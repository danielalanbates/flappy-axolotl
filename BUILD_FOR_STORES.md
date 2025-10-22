# Build for Stores — Commands & Notes

This file contains exact commands to create distributables for each platform using the repo's existing `electron-builder` setup.

Prerequisites
- Node.js (16+ recommended)
- On macOS: Xcode command line tools (for notarization and macOS-specific code signing)
- Certificates and secrets configured as environment variables (see `STORE_PREP.md`)

Install deps

```bash
cd "/Users/daniel/Documents/aicode/Flappy Axolotl"
npm install
```

Build for all desktop platforms (builds required host for macOS):

```bash
# Build for macOS, Windows, and Linux (macOS target requires macOS host)
npm run build
```

Build per platform:

```bash
npm run build:mac   # macOS (dmg + zip)
npm run build:win   # Windows (nsis installer + portable)
npm run build:linux # Linux (AppImage + deb)
```

Publishing to GitHub Releases (automated by electron-builder if GH_TOKEN is set)

```bash
# Make a git tag matching the version in package.json
npm version patch -m "Release v%s"
# Push tag to remote
git push --follow-tags origin main
# electron-builder will create a release and upload artifacts if GH_TOKEN is set
```

Signing & Notarization tips
- macOS notarization requires Apple Developer membership. Ensure APPLE_ID, APPLE_ID_PASSWORD, CSC_LINK, and CSC_KEY_PASSWORD are set.
- Windows signing via a .p12 certificate (CSC_LINK/CSC_KEY_PASSWORD).

Troubleshooting
- If builds fail with certificate errors, double-check paths and passwords and run the command locally with verbose logging: `DEBUG=electron-builder npm run build:mac`
- For CI builds, store secrets securely and never commit certificates to the repo.

Notes
- This project uses `build.files` to include only the game files. If you add assets or node modules, update the `files` list in `package.json`.

Finished: Run the appropriate build command on the host OS matching your target platforms.
