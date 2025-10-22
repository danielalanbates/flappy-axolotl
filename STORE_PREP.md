# Preparing Flappy Axolotl for App Stores

This document lists the essential steps, assets and checks to prepare the project for submission to major stores (macOS App Store / Notarization, Microsoft Store, Steam, and Google Play for web/PWA). It also includes signing and notarization notes for desktop builds created with `electron-builder`.

## Quick summary
- Desktop distributables are produced with `electron-builder` (see `package.json` scripts).
- You must supply platform-specific signing credentials for release builds:
  - macOS: Developer ID Application certificate (for notarization) or Apple App Store credentials
  - Windows: Code signing certificate (EV recommended) or use Microsoft Partner Center for Store submissions
  - Linux: Not strictly required, but signing packages and using snaps/flatpaks is recommended
- Provide properly sized icons and screenshots (see `assets/README.md`).

## Checklist (high level)
- [ ] Verify game runs in production mode (open `index.html` and test `npm start`).
- [ ] Create app icons in required sizes (see `assets/README.md`).
- [ ] Create screenshot set for each platform (512x512+, 16:9 and 4:3 variants recommended).
- [ ] Obtain code signing certificates:
  - macOS: Apple Developer Program membership and Developer ID cert (or App Store submission which requires Xcode/Transporter)
  - Windows: Code signing certificate (prefer EV)
- [ ] Configure `electron-builder` environment variables for signing (see notes below).
- [ ] Run `npm run build` on the appropriate host(s) and verify artifacts in `dist/`.
- [ ] Notarize macOS builds (recommended) before releasing outside the App Store.
- [ ] Create developer accounts for target stores and fill metadata (descriptions, privacy policy, icons, age rating).

## electron-builder signing environment (recommended)
Set the following environment variables in your CI or local shell before building (macOS-specific values must run on macOS):

macOS (notarization/Azure):
- APPLE_ID (your Apple ID email)
- APPLE_ID_PASSWORD (app-specific password or apple notary tool password)
- CSC_LINK (link to your .p12 code signing certificate OR path)
- CSC_KEY_PASSWORD (password for the .p12 file)

Windows code signing (optional but recommended):
- CSC_LINK (link to .p12 or path to the certificate)
- CSC_KEY_PASSWORD

GitHub publishing (releases):
- GH_TOKEN (GitHub personal access token with repo access) — used by `electron-builder` to create GitHub releases and upload artifacts

Example on macOS (zsh):

```bash
export GH_TOKEN="ghp_..."
export CSC_LINK="file:///Users/you/certs/win-codesign.p12"
export CSC_KEY_PASSWORD="p12password"
export APPLE_ID="dev@example.com"
export APPLE_ID_PASSWORD="@keychain:AC_PASSWORD_OR_APP_SPECIFIC_PASSWORD"
```

Notes:
- For macOS notarization `APPLE_ID_PASSWORD` can be provided using an app-specific password or via keychain. See Apple docs.
- For CI, prefer encrypted secrets (GitHub Actions/Azure Pipelines) rather than embedding credentials in repo.

## Store-specific notes
### macOS (App Store & Notarization)
- App Store submissions require an App Store build with an App Store distribution provisioning profile. You typically build with Xcode or use Transporter to upload the signed .pkg/.ipa-like bundle produced by electron-builder.
- For distributing outside the App Store, notarize the signed .dmg or .zip.
- Ensure `build.appId` matches the App Store bundle ID.

### Microsoft Store / MSIX
- Electron apps can be packaged for the Microsoft Store using MSIX and uploaded through Partner Center. Use electron-windows-store or `electron-builder` with `appx`/`msix` targets.
- You may need to reserve the app name in Partner Center.

### Steam
- Steam requires a developer account and the Steamworks SDK. Upload the appropriate installers or a portable binary and configure the store presence via Steamworks.

### Google Play / PWA
- For mobile distribution, the web/PWA can be wrapped as a Trusted Web Activity (TWA) and published to Google Play. That process requires an Android app wrapper (bubblewrap or PWA builder) and a keystore for signing the Android app.

## Metadata and privacy
- Prepare a short and long description, keywords, and age rating info.
- Provide a privacy policy URL if your game stores personal data (local high scores via localStorage do not usually require one, but include a privacy policy if you add analytics or remote features).

## Verification & smoke tests
- Run the app on each target OS or use VMs/CI to verify.
- Check for console errors and performance issues.

## Where to go next
- Populate `assets/` with icon files and screenshots.
- Decide which stores you want to target first (GitHub Releases + macOS notarized DMG and Windows signed installer is common).
- Add CI (GitHub Actions) to perform builds and uploads automatically (optional but recommended).

---

If you want, I can:
- Add a GitHub Actions workflow that builds and creates a draft release on tags.
- Add a template `electron-builder` GitHub Actions workflow that performs macOS notarization and Windows signing using repository secrets.

Tell me which next step you'd like me to take.