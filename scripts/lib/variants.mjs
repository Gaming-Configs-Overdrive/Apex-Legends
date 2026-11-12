// Apex-specific: generates configs/variants/<profile>-<resolution>/ from
// configs/autoexec.cfg + configs/videoconfig.txt and packs one ZIP per variant.
import fs from 'node:fs'
import path from 'node:path'
import AdmZip from 'adm-zip'
import { writeSha256Sums } from './build.mjs'

export const PROFILES = {
  competitive: { fps_max: '0', mat_picmip: '4' },
  quality: { fps_max: '144', mat_picmip: '1' },
  ultraquality: {
    fps_max: '240',
    mat_picmip: '1',
    mat_compressedtextures: '0',
    staticProp_max_scaled_dist: '6000',
    glow_outline_effect_enable: '1',
  },
}

export const RESOLUTIONS = {
  '1080p': { width: 1920, height: 1080 },
  '1440p': { width: 2560, height: 1440 },
  '4k': { width: 3840, height: 2160 },
  '720p': { width: 1280, height: 720 },
}

const VARIANTS_DIR = 'configs/variants'

export const variantList = () =>
  Object.keys(PROFILES).flatMap((profile) =>
    Object.keys(RESOLUTIONS).map((res) => ({
      name: `${profile}-${res}`,
      profile,
      res,
    }))
  )

const lf = (s) => s.replace(/\r\n/g, '\n')
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Strips // comments outside of "quoted" strings, trims lines, drops empty ones.
export function removeComments(config) {
  return lf(config)
    .split('\n')
    .map((line) => {
      let quoted = false
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') quoted = !quoted
        else if (!quoted && line.startsWith('//', i)) return line.slice(0, i)
      }
      return line
    })
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

// Sets `key "value"` (quoted, empty values allowed); appends missing keys.
export function applyOverrides(config, overrides) {
  let out = config
  for (const [key, value] of Object.entries(overrides)) {
    const re = new RegExp(`^(${escapeRegex(key)}\\s+")[^"]*(")`, 'm')
    out = re.test(out)
      ? out.replace(re, (_, a, b) => a + value + b)
      : `${out}\n${key} "${value}"`
  }
  return out
}

export function applyResolution(config, { width, height }) {
  const set = (cfg, key, value) =>
    cfg.replace(
      new RegExp(`("setting\\.${key}"\\s+")\\d+(")`),
      (_, a, b) => a + value + b
    )
  let out = set(config, 'last_display_width', width)
  out = set(out, 'last_display_height', height)
  out = set(out, 'defaultres', width)
  return set(out, 'defaultresheight', height)
}

// Returns { '<variant>/autoexec.cfg': content, '<variant>/videoconfig.txt': content, … } (LF).
export function renderVariants(root) {
  const read = (f) => lf(fs.readFileSync(path.join(root, 'configs', f), 'utf8'))
  const autoexec = removeComments(read('autoexec.cfg'))
  const video = read('videoconfig.txt')
  const files = {}
  for (const { name, profile, res } of variantList()) {
    files[`${name}/autoexec.cfg`] =
      applyOverrides(autoexec, PROFILES[profile]) + '\n'
    files[`${name}/videoconfig.txt`] = applyResolution(video, RESOLUTIONS[res])
  }
  return files
}

// Rewrites configs/variants/ from the base configs.
export function writeVariants(root) {
  const dir = path.join(root, VARIANTS_DIR)
  fs.rmSync(dir, { recursive: true, force: true })
  for (const [rel, content] of Object.entries(renderVariants(root))) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true })
    fs.writeFileSync(path.join(dir, rel), content)
  }
}

// Lists files in configs/variants/ that are missing, stale or unexpected.
export function staleVariants(root) {
  const dir = path.join(root, VARIANTS_DIR)
  const expected = renderVariants(root)
  const stale = Object.entries(expected)
    .filter(([rel, content]) => {
      const file = path.join(dir, rel)
      return (
        !fs.existsSync(file) || lf(fs.readFileSync(file, 'utf8')) !== content
      )
    })
    .map(([rel]) => rel)
  const extra = fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { recursive: true })
        .map((rel) => rel.split(path.sep).join('/'))
        .filter((rel) => fs.statSync(path.join(dir, rel)).isFile())
        .filter((rel) => !(rel in expected))
    : []
  return [...stale, ...extra].map((rel) => `${VARIANTS_DIR}/${rel}`)
}

// Writes dist/autoexec-<profile>_videoconfig-<res>.zip per variant (same names as
// the old Rollup releases) and refreshes dist/SHA256SUMS. Run after build().
export function zipVariants(root) {
  const stale = staleVariants(root)
  if (stale.length) {
    throw new Error(
      `configs/variants is out of date, run "npm run variants":\n  ${stale.join('\n  ')}`
    )
  }
  const files = renderVariants(root)
  const dist = path.join(root, 'dist')
  const names = variantList().map(({ name, profile, res }) => {
    const zip = new AdmZip()
    for (const f of ['autoexec.cfg', 'videoconfig.txt']) {
      zip.addFile(f, Buffer.from(files[`${name}/${f}`]))
    }
    const zipName = `autoexec-${profile}_videoconfig-${res}.zip`
    zip.writeZip(path.join(dist, zipName))
    return zipName
  })
  writeSha256Sums(dist)
  return names
}
