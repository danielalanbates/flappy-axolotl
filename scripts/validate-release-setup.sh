#!/usr/bin/env bash
# Quick validation before attempting a release build/publish
set -euo pipefail

echo "Validating repository for store release readiness..."

REQUIRED=(package.json manifest.json electron-main.js index.html)
MISSING=()
for f in "${REQUIRED[@]}"; do
  if [ ! -f "$f" ]; then
    MISSING+=("$f")
  fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
  echo "Missing required files:" >&2
  for m in "${MISSING[@]}"; do echo "  - $m"; done
  exit 2
fi

# Check icons exist
ICON_FILES=(assets/icon.icns assets/icon.ico assets/icon-192.png assets/icon-512.png)
for f in "${ICON_FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Warning: icon missing: $f" >&2
  fi
done

# Check publish config
if ! node -e "const p=require('./package.json'); if(!p.publish) {process.exit(3)}" 2>/dev/null; then
  echo "Warning: package.json has no publish configuration" >&2
fi

echo "Validation complete."
exit 0
