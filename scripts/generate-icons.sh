#!/usr/bin/env bash
# generate-icons.sh
# Generates icon.icns, icon.ico, and PWA icons (192x192, 512x512) from a source PNG (default: assets/source.png)
# Requirements: macOS: iconutil & sips; Linux/Windows: ImageMagick (convert) or png2icons (npm)

set -euo pipefail

SRC="${1:-assets/source.png}"
OUT_DIR="assets"
ICONSET_DIR="$OUT_DIR/icon.iconset"
TMP_DIR="$OUT_DIR/tmp_icons"

if [ ! -f "$SRC" ]; then
  echo "Source image not found: $SRC"
  echo "Place a 1024x1024 PNG at $SRC or pass a path as the first argument."
  exit 1
fi

mkdir -p "$OUT_DIR"
rm -rf "$ICONSET_DIR" "$TMP_DIR"
mkdir -p "$ICONSET_DIR"
mkdir -p "$TMP_DIR"

# Generate sizes for .icns using sips (macOS) or fallback to ImageMagick
if command -v sips >/dev/null 2>&1; then
  echo "Using sips to generate iconset (macOS)"
  sips -z 16 16     "$SRC" --out "$ICONSET_DIR/icon_16x16.png"
  sips -z 32 32     "$SRC" --out "$ICONSET_DIR/icon_16x16@2x.png"
  sips -z 32 32     "$SRC" --out "$ICONSET_DIR/icon_32x32.png"
  sips -z 64 64     "$SRC" --out "$ICONSET_DIR/icon_32x32@2x.png"
  sips -z 128 128   "$SRC" --out "$ICONSET_DIR/icon_128x128.png"
  sips -z 256 256   "$SRC" --out "$ICONSET_DIR/icon_128x128@2x.png"
  sips -z 256 256   "$SRC" --out "$ICONSET_DIR/icon_256x256.png"
  sips -z 512 512   "$SRC" --out "$ICONSET_DIR/icon_256x256@2x.png"
  sips -z 512 512   "$SRC" --out "$ICONSET_DIR/icon_512x512.png"
  sips -z 1024 1024 "$SRC" --out "$ICONSET_DIR/icon_512x512@2x.png"

  if command -v iconutil >/dev/null 2>&1; then
    echo "Creating icon.icns"
    iconutil -c icns "$ICONSET_DIR" -o "$OUT_DIR/icon.icns"
  else
    echo "iconutil not found; skipping .icns generation"
  fi
else
  echo "sips not found. Using ImageMagick (convert) for resizing."
  if ! command -v convert >/dev/null 2>&1; then
    echo "ImageMagick 'convert' not found. Install it or run this script on macOS." >&2
    exit 2
  fi
  convert "$SRC" -resize 16x16 "${ICONSET_DIR}/icon_16x16.png"
  convert "$SRC" -resize 32x32 "${ICONSET_DIR}/icon_32x32.png"
  convert "$SRC" -resize 64x64 "${ICONSET_DIR}/icon_64x64.png"
  convert "$SRC" -resize 128x128 "${ICONSET_DIR}/icon_128x128.png"
  convert "$SRC" -resize 256x256 "${ICONSET_DIR}/icon_256x256.png"
  convert "$SRC" -resize 512x512 "${ICONSET_DIR}/icon_512x512.png"
fi

# Generate .ico using ImageMagick (portable across platforms)
if command -v convert >/dev/null 2>&1 || command -v magick >/dev/null 2>&1; then
  echo "Generating icon.ico"
  if command -v magick >/dev/null 2>&1; then
    magick convert "$SRC" -define icon:auto-resize=256,128,64,48,32,16 "$OUT_DIR/icon.ico"
  else
    convert "$SRC" -define icon:auto-resize=256,128,64,48,32,16 "$OUT_DIR/icon.ico"
  fi
else
  echo "ImageMagick not found; attempting Node fallback to generate icon.ico"
  if command -v node >/dev/null 2>&1 && [ -f "$(dirname "$0")/generate-ico.js" ]; then
    node "$(dirname "$0")/generate-ico.js" "$SRC"
  else
    echo "Node fallback not available; please install ImageMagick or ensure Node is present." >&2
  fi
fi

# Generate PWA PNGs
if command -v convert >/dev/null 2>&1; then
  echo "Generating PWA icons (192x192, 512x512)"
  convert "$SRC" -resize 192x192 "$OUT_DIR/icon-192.png"
  convert "$SRC" -resize 512x512 "$OUT_DIR/icon-512.png"
else
  # macOS fallback using sips
  if command -v sips >/dev/null 2>&1; then
    echo "Generating PWA icons using sips"
    sips -z 192 192 "$SRC" --out "$OUT_DIR/icon-192.png"
    sips -z 512 512 "$SRC" --out "$OUT_DIR/icon-512.png"
  else
    echo "No image tool available to generate PWA icons; please install ImageMagick or run on macOS." >&2
  fi
fi

# Cleanup
rm -rf "$ICONSET_DIR"

echo "Generated icons in $OUT_DIR: icon.icns (if available), icon.ico (if available), icon-192.png, icon-512.png"
exit 0
