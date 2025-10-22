Linking this repo to GitHub and enabling CI

This file explains the steps to connect this local repository to your GitHub account and enable the workflows that generate icons and perform unsigned builds.

1) Create a repository on GitHub
- Go to https://github.com/new
- Name: `flappy-axolotl`
- Description: A charming underwater Flappy Bird game featuring an adorable axolotl
- Visibility: Public or Private

2) Add the remote and push

```bash
cd "/Users/daniel/Documents/aicode/Flappy Axolotl"
# Replace <your-username> below
git remote add origin https://github.com/<your-username>/flappy-axolotl.git
git branch -M main
git add -A
git commit -m "Prepare repo for store publishing and CI" || true
git push -u origin main
```

3) Enable GitHub Actions
- Go to your repo -> Actions and enable workflows if prompted.

4) Add repository secrets (for signed builds & notarization)
- Go to: Settings -> Secrets -> Actions -> New repository secret
- Add the following secrets if you plan to sign/notarize builds:
  - `GH_TOKEN` — Personal access token with `repo` scope (used by electron-builder to upload releases)
  - `CSC_LINK` — URL to code signing certificate (.p12) uploaded as a secret or an S3/redirect URL electron-builder can use
  - `CSC_KEY_PASSWORD` — Password for the .p12
  - `APPLE_ID` — Apple ID email
  - `APPLE_ID_PASSWORD` — App-specific password for notarization (or use keychain integration)

5) Test the icon workflow
- Make a small change, commit and push to `main`.
- In Actions, run `Generate and Upload Icons` or wait for it to run.
- Check the workflow run artifacts for the `icons` artifact.

6) Test unsigned build on tag
- Create a tag locally and push:

```bash
git tag v1.0.0
git push origin v1.0.0
```

- The `Unsigned Build (Test)` workflow will run on the pushed tag and upload artifacts under `unsigned-artifacts`.

Notes
- Do NOT store private certificates directly in the repo. Use GitHub Secrets or a secure storage location.
- When ready for full signing and release automation, I can help configure a workflow that runs on push to tags and uses the provided secrets to sign and upload artifacts automatically.
