# Rollup Configuration

`yarn build` runs Rollup with three plugins (see `rollup.config.js`):

1. **Video config plugin** (`src/buildVideoConfigPlugin.js`): reads `configs/videoconfig.txt`
   and writes one `dist/videoconfig-<resolution>.txt` per resolution variant.
2. **Autoexec plugin** (`src/buildAutoexecPlugin.js`): reads `configs/autoexec.cfg`,
   strips `//` comments, applies the variant overrides and writes `dist/autoexec-<variant>.cfg`.
3. **Release plugin** (`src/buildReleasePlugin.js`): zips every autoexec × videoconfig
   combination together with `src/scripts/install-windows-config.ps1` into `dist/releases/`.
   Inside the ZIP the files are renamed to `autoexec.cfg` and `videoconfig.txt`.

## Folder Structure

- `configs/`: base `autoexec.cfg` and `videoconfig.txt`
- `docs/`: this documentation
- `mods/`: unused for Apex (kept for the shared skeleton layout)
- `src/`: Rollup plugins, `src/utils/` helpers, `src/scripts/` files shipped in releases

## Adding a Variant

Add an entry to the `variants` array of the matching plugin in `rollup.config.js`:
resolutions take `{ name, width, height }`, autoexec variants take `{ name, overrides }`.
