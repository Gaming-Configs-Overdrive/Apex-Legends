[![Release](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/release.yml/badge.svg)](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/release.yml)
[![Lint](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/lint.yml/badge.svg)](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/lint.yml)

# Apex Legends Configuration Guide (English)

> [Deutsche Readme Version hier](./README.de.md)
>
> [Release Changelog](./CHANGELOG.md)

Tuned `autoexec.cfg` and `videoconfig.txt` presets for Apex Legends. Every
variant combines one profile with one resolution, e.g. `competitive-1080p`.

## Variants

- **Profiles (`autoexec.cfg`):**
  - **competitive:** maximum performance, uncapped FPS, lowest textures.
  - **quality:** balanced image quality and performance, 144 FPS cap.
  - **ultraquality:** best visuals for high-end PCs, 240 FPS cap.
- **Resolutions (`videoconfig.txt`):** `720p`, `1080p`, `1440p`, `4k`.

## Anti-Cheat Notice

Apex Legends on PC uses [EA Javelin Anticheat](https://www.ea.com/games/apex-legends/apex-legends/news/javelin-anticheat-announcement). Follow the [EA User Agreement](https://www.ea.com/legal/user-agreement) when using custom configuration files.

## Installation with the Installer (recommended)

1. Download `fullrelease.zip` from the [Releases](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/releases) and extract it.
2. Close Apex Legends.
3. Run `install.bat` and pick a variant, or call the installer directly:
   ```bash
   gco-install install --variant competitive-1080p --dry-run
   gco-install install --variant competitive-1080p
   ```
   Steam installs are detected automatically. For the EA app add
   `--game-dir "<Apex install folder>"`.
4. Add the launch option `+exec autoexec` (see below).
5. Undo everything with `gco-install restore`.

The installer backs up both files, replaces `cfg/autoexec.cfg` in the game folder
and merges `videoconfig.txt` into
`%USERPROFILE%\Saved Games\Respawn\Apex\local\videoconfig.txt`, which it marks
read-only so the game does not reset it.

## Manual Installation

1. Download `autoexec-<profile>_videoconfig-<resolution>.zip` from the
   [Releases](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/releases) and extract it.
2. Copy `autoexec.cfg` into the game's `cfg` folder, for Steam usually
   `C:\Program Files (x86)\Steam\steamapps\common\Apex Legends\cfg`.
3. Press `Win + R`, open `%USERPROFILE%\Saved Games\Respawn\Apex\local` and replace
   `videoconfig.txt`. Mark it read-only (Properties → Read-only).
4. Add the launch option `+exec autoexec`.

To edit the files later, remove the read-only flag first (`attrib -r videoconfig.txt`).

## Launch Options

Steam: Library → right-click Apex Legends → Properties → General → Launch Options.

| Option           | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `+exec autoexec` | Executes `cfg/autoexec.cfg` on startup (required)         |
| `-dev`           | Skips the EA intro, can cause HUD flicker on NVIDIA cards |
| `-fullscreen`    | Forces fullscreen mode                                    |
| `-high`          | Attempts to set the game's process priority to "high"     |

Launch Apex Legends normally with DirectX 12. Respawn retired DirectX 11 support. [Game Reliability Update](https://forums.ea.com/blog/apex-legends-game-info-hub-en/apex-legends%E2%84%A2-game-reliability-update/12263037)

## Keybinds in autoexec

- **F3:** `disconnect`: leave the server on heavy lag.
- **F4:** `miles_reboot; miles_stop_all`: restart the audio engine.
- **F5:** `toggle showfps_enabled 0 1 2`: FPS display and performance graphs.
- **F6:** `toggle shownet_enabled`: network graph.
- **F7:** `exec autoexec.cfg`: reload the autoexec.

## Video settings in Cipher (Season 31)

- In **Settings → Video**, EA recommends enabling NVIDIA Reflex on NVIDIA GPUs, leaving V-Sync off unless you see tearing, and leaving the adaptive resolution FPS target off unless you experience frequent FPS drops. [EA PC settings guide](https://help.ea.com/en/articles/apex-legends/best-settings-pc/)
- For competitive play, EA recommends disabling Ambient Occlusion. For image quality, try it in the Video menu. Overclocked improved Ambient Occlusion and added specular occlusion. EA reports it is generally faster than the previous implementation, with exceptions at High or Ultra at 4K on PC. [EA PC settings guide](https://help.ea.com/en/articles/apex-legends/best-settings-pc/) · [Overclocked patch notes](https://www.ea.com/games/apex-legends/apex-legends/news/overclocked-patch-notes)
- Cipher changed lighting, fog and auto-exposure across maps as engine updates. Check visibility and FPS in the current build after applying a preset. [Cipher patch notes](https://www.ea.com/games/apex-legends/apex-legends/news/cipher-patch-notes)

Remove the read-only flag on `videoconfig.txt` before changing video settings you want the game to save.

## Tips

- Weak hardware: start with `competitive-720p` or `competitive-1080p`, then move up.
- Reapply the autoexec without restarting: console → `exec autoexec.cfg` (or F7).

## Development

Node 24 (`.nvmrc`):

```bash
npm ci
npm run variants   # regenerate configs/variants/ after editing configs/*
npm run validate
npm run build      # dist/: config.zip, fullrelease.zip, per-variant ZIPs, MODS.md, SHA256SUMS
npm test
```

Base files live in `configs/autoexec.cfg` and `configs/videoconfig.txt`; profiles
and resolutions in `scripts/lib/variants.mjs`. `configs/variants/` is generated and
checked in because the installer reads it; `npm test` and `npm run build` fail if
it is out of date. Manifest reference: [docs/GAME_MANIFEST.md](./docs/GAME_MANIFEST.md).

## License

MIT
