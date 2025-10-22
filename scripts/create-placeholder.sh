iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=
#!/usr/bin/env bash
# create-placeholder.sh
# Create a 1024x1024 placeholder PNG at assets/source.png.
# Prefer ImageMagick (magick) to draw a gradient + text. If not available, fall back to a tiny base64 PNG.

set -euo pipefail
OUT="assets/source.png"
mkdir -p "$(dirname "$OUT")"

if command -v magick >/dev/null 2>&1; then
  echo "Using ImageMagick to generate 1024x1024 placeholder"
  # Create a vertical gradient and annotate text centered
  magick -size 1024x1024 gradient:'#70c5ce'-'#1e5f8c' \
    -gravity center \
    -pointsize 160 -fill white -annotate +0-40 'Flappy' \
    -pointsize 80 -fill white -annotate +0+120 'Axolotl' \
    "$OUT"
  echo "Wrote placeholder PNG to $OUT"
  exit 0
fi

echo "ImageMagick 'magick' not found; writing tiny fallback PNG (will be upscaled by generator)"
cat > /tmp/__placeholder_png.b64 <<'B64'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=
B64

if base64 --help 2>&1 | grep -q "--decode"; then
  base64 --decode /tmp/__placeholder_png.b64 > "$OUT"
elif base64 --help 2>&1 | grep -q "-D"; then
  base64 -D /tmp/__placeholder_png.b64 > "$OUT"
else
  # Try openssl fallback
  openssl base64 -d -in /tmp/__placeholder_png.b64 -out "$OUT" || {
    echo "No base64 decode available (tried --decode, -D, openssl)." >&2
    exit 2
  }
fi

rm -f /tmp/__placeholder_png.b64
echo "Wrote fallback placeholder PNG to $OUT (1x1). Run 'npm run icons:gen' to generate icons."
exit 0
