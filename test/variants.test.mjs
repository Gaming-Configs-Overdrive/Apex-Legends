import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import AdmZip from 'adm-zip'
import YAML from 'yaml'
import { build } from '../scripts/lib/build.mjs'
import {
  applyOverrides,
  removeComments,
  staleVariants,
  variantList,
  zipVariants,
} from '../scripts/lib/variants.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))

test('configs/variants is up to date (run "npm run variants")', () => {
  assert.deepEqual(staleVariants(root), [])
})

test('game.yml variants match the generated variants', () => {
  const manifest = YAML.parse(
    fs.readFileSync(path.join(root, 'game.yml'), 'utf8')
  )
  assert.deepEqual(
    manifest.variants,
    variantList().map((v) => v.name)
  )
})

test('removeComments keeps // inside quoted strings', () => {
  assert.equal(
    removeComments(
      '// header\r\nbind "f1" "say http://x" // note\r\nfps_max "0"//x\r\n\r\n'
    ),
    'bind "f1" "say http://x"\nfps_max "0"'
  )
})

test('applyOverrides escapes keys, allows empty values and appends', () => {
  const cfg = 'a.b "1"\naxb "2"\nc ""'
  assert.equal(
    applyOverrides(cfg, { 'a.b': '', c: '$1', d: '4' }),
    'a.b ""\naxb "2"\nc "$1"\nd "4"'
  )
})

test('build writes one ZIP per variant into dist/', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gco-apex-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  for (const f of ['game.yml', 'configs']) {
    fs.cpSync(path.join(root, f), path.join(dir, f), { recursive: true })
  }
  build(dir)
  const zips = zipVariants(dir)

  assert.equal(zips.length, 12)
  assert.ok(zips.includes('autoexec-competitive_videoconfig-1080p.zip'))
  const zip = new AdmZip(path.join(dir, 'dist', zips[0]))
  assert.deepEqual(
    zip
      .getEntries()
      .map((e) => e.entryName)
      .sort(),
    ['autoexec.cfg', 'videoconfig.txt']
  )
  const video = zip.readAsText('videoconfig.txt')
  assert.match(video, /"setting\.defaultres"\s+"1920"/)
  const sums = fs.readFileSync(path.join(dir, 'dist/SHA256SUMS'), 'utf8')
  assert.equal(sums.trimEnd().split('\n').length, 4 + 12)
})
