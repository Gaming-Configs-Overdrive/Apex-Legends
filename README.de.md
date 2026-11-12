[![Release](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/release.yml/badge.svg)](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/release.yml)
[![Lint](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/lint.yml/badge.svg)](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/actions/workflows/lint.yml)

# Apex Legends Konfigurationshilfe (Deutsch)

> [Englische Readme Version hier](./README.md)
>
> [Veröffentlichungs-Log](./CHANGELOG.md)

Abgestimmte `autoexec.cfg`- und `videoconfig.txt`-Presets für Apex Legends. Jede
Variante kombiniert ein Profil mit einer Auflösung, z. B. `competitive-1080p`.

## Varianten

- **Profile (`autoexec.cfg`):**
  - **competitive:** maximale Leistung, FPS ungedeckelt, niedrigste Texturen.
  - **quality:** ausgewogen zwischen Bildqualität und Leistung, 144 FPS.
  - **ultraquality:** beste Optik für starke PCs, 240 FPS.
- **Auflösungen (`videoconfig.txt`):** `720p`, `1080p`, `1440p`, `4k`.

## Hinweis zum Anti-Cheat

Apex Legends ist ein Online-Spiel mit Easy Anti-Cheat. Die Nutzungsbedingungen von
EA verbieten nicht autorisierte Änderungen an Spieldateien. `autoexec.cfg` und
`videoconfig.txt` sind weit verbreitet und es sind keine Bans dafür bekannt, die
Nutzung erfolgt aber auf eigenes Risiko
([EA-Forum](https://forums.ea.com/discussions/apex-legends-general-discussion-en/autoexec/5198856)).

## Installation mit dem Installer (empfohlen)

1. `fullrelease.zip` aus den [Releases](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/releases) herunterladen und entpacken.
2. Apex Legends schließen.
3. `install.bat` starten und eine Variante wählen, oder den Installer direkt aufrufen:
   ```bash
   gco-install install --variant competitive-1080p --dry-run
   gco-install install --variant competitive-1080p
   ```
   Steam-Installationen werden automatisch erkannt. Für die EA app
   `--game-dir "<Apex-Installationsordner>"` angeben.
4. Startoption `+exec autoexec` setzen (siehe unten).
5. Alles rückgängig machen mit `gco-install restore`.

Der Installer sichert beide Dateien, ersetzt `cfg/autoexec.cfg` im Spielordner und
führt `videoconfig.txt` in
`%USERPROFILE%\Saved Games\Respawn\Apex\local\videoconfig.txt` zusammen. Diese wird
schreibgeschützt, damit das Spiel sie nicht zurücksetzt.

## Manuelle Installation

1. `autoexec-<profil>_videoconfig-<auflösung>.zip` aus den
   [Releases](https://github.com/Gaming-Configs-Overdrive/Apex-Legends/releases) herunterladen und entpacken.
2. `autoexec.cfg` in den `cfg`-Ordner des Spiels kopieren, bei Steam meist
   `C:\Program Files (x86)\Steam\steamapps\common\Apex Legends\cfg`.
3. `Win + R` drücken, `%USERPROFILE%\Saved Games\Respawn\Apex\local` öffnen und
   `videoconfig.txt` ersetzen. Datei schreibschützen (Eigenschaften → Schreibgeschützt).
4. Startoption `+exec autoexec` setzen.

Zum späteren Bearbeiten erst den Schreibschutz entfernen (`attrib -r videoconfig.txt`).

## Startoptionen

Steam: Bibliothek → Rechtsklick auf Apex Legends → Eigenschaften → Allgemein → Startoptionen.

| Option                                  | Beschreibung                                                    |
| --------------------------------------- | --------------------------------------------------------------- |
| `+exec autoexec`                        | Führt `cfg/autoexec.cfg` beim Start aus (erforderlich)          |
| `-dev`                                  | Überspringt das EA-Intro, kann HUD-Flackern bei NVIDIA auslösen |
| `-fullscreen`                           | Erzwingt Vollbild                                               |
| `-high`                                 | Versucht, die Prozesspriorität auf „hoch" zu setzen             |
| `-anticheat_settings=SettingsDX11.json` | Erzwingt DX11                                                   |
| `-anticheat_settings=SettingsDX12.json` | Erzwingt DX12                                                   |

## Keybinds in der autoexec

- **F3:** `disconnect`: Server bei starkem Lag verlassen.
- **F4:** `miles_reboot; miles_stop_all`: Audio-Engine neu starten.
- **F5:** `toggle showfps_enabled 0 1 2`: FPS-Anzeige und Performance-Graphen.
- **F6:** `toggle shownet_enabled`: Netzwerk-Graph.
- **F7:** `exec autoexec.cfg`: autoexec neu laden.

## Tipps

- Schwache Hardware: mit `competitive-720p` oder `competitive-1080p` starten, dann hochgehen.
- autoexec ohne Neustart anwenden: Konsole → `exec autoexec.cfg` (oder F7).

## Entwicklung

Node 24 (`.nvmrc`):

```bash
npm ci
npm run variants   # configs/variants/ nach Änderungen an configs/* neu erzeugen
npm run validate
npm run build      # dist/: config.zip, fullrelease.zip, ZIP je Variante, MODS.md, SHA256SUMS
npm test
```

Basisdateien liegen in `configs/autoexec.cfg` und `configs/videoconfig.txt`, Profile
und Auflösungen in `scripts/lib/variants.mjs`. `configs/variants/` wird generiert und
eingecheckt, weil der Installer es liest; `npm test` und `npm run build` schlagen
fehl, wenn es veraltet ist. Manifest-Referenz: [docs/GAME_MANIFEST.md](./docs/GAME_MANIFEST.md).

## Lizenz

MIT
