import { writeVariants, zipVariants } from './lib/variants.mjs'

// `npm run variants` regenerates configs/variants/; `--zip` (part of
// `npm run build`) packs one ZIP per variant into dist/.
try {
  if (process.argv.includes('--zip')) {
    for (const name of zipVariants(process.cwd())) console.log(`dist/${name}`)
  } else {
    writeVariants(process.cwd())
    console.log('configs/variants updated')
  }
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
