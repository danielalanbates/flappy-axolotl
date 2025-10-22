# assets/

This folder should contain the icons and screenshots required for store submissions. Do NOT commit large binary art files to the repository if you prefer to keep them out of source control; instead use a release process or a CI secret store.

Required files and recommended sizes

- icon.icns — macOS application icon (.icns)
  - Recommended generation sizes inside icns: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
- icon.ico — Windows icon (.ico)
  - Recommended sizes: 16x16, 32x32, 48x48, 256x256
- icon.png — 512x512 PNG (used for Linux AppImage and web store assets)
- screenshots/ - A collection of screenshots (PNG) for store pages
  - Recommended: 1920x1080 (landscape), 1080x1920 (portrait), and 1400x900 for desktop.

How to generate icons from a single 1024x1024 PNG (macOS + Windows)

Prerequisites: macOS (iconutil) and ImageMagick (convert), or use `png2icons` via npm.

Example (macOS):

```bash
# Generate .iconset folder from 1024x1024 source
mkdir -p icon.iconset
sips -z 16 16     source.png --out icon.iconset/icon_16x16.png
sips -z 32 32     source.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     source.png --out icon.iconset/icon_32x32.png
sips -z 64 64     source.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   source.png --out icon.iconset/icon_128x128.png
sips -z 256 256   source.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   source.png --out icon.iconset/icon_256x256.png
sips -z 512 512   source.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   source.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 source.png --out icon.iconset/icon_512x512@2x.png

# Create .icns file
iconutil -c icns icon.iconset -o icon.icns

# Create .ico using ImageMagick
convert source.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

If you'd like, I can add a small script to automate icon generation (using `png2icons`), or add a GitHub Actions workflow to build and create releases automatically. If you want that, tell me which target stores to prioritize.

Icon generation script
----------------------

This repository includes a simple shell script to create the icons from a single source PNG (recommended: 1024x1024). Files created:

- `assets/icon.icns` (macOS, when run on macOS with `iconutil`)
- `assets/icon.ico` (Windows)
- `assets/icon-192.png` and `assets/icon-512.png` (PWA)

Usage (from project root):

```bash
npm run icons:gen             # uses default source: assets/source.png
npm run icons:gen -- path/to/your-1024.png
```

Place a 1024x1024 PNG at `assets/source.png` (or pass a path) before running.

Requirements:
- macOS: `sips` and `iconutil` (both included on macOS) for `.icns` generation
- Linux/Windows: ImageMagick `convert` for `.ico` and PWA PNGs

If you want, I can add a Node-based generator (cross-platform) to avoid shell dependencies.

Quick regen helper
------------------

There is a convenience npm script that regenerates a placeholder and then the icons:

```bash
npm run icons:regen
```

It runs `scripts/create-placeholder.sh` then `scripts/generate-icons.sh`.