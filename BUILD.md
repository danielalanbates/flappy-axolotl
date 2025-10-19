# Building Flappy Axolotl Desktop Apps

This guide explains how to build standalone desktop applications for Windows, Mac, and Linux.

## Prerequisites

You need Node.js installed on your computer. Download from [nodejs.org](https://nodejs.org/)

## Quick Build Instructions

### 1. Install Dependencies

Open terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install Electron and Electron Builder.

### 2. Build for All Platforms

To build for all platforms at once (requires Mac for macOS builds):

```bash
npm run build
```

Or build for specific platforms:

```bash
# Build for Mac only
npm run build:mac

# Build for Windows only
npm run build:win

# Build for Linux only
npm run build:linux
```

### 3. Find Your Builds

Built applications will be in the `dist/` folder:

- **macOS**: `dist/Flappy Axolotl-1.0.0.dmg` and `dist/Flappy Axolotl-1.0.0-mac.zip`
- **Windows**: `dist/Flappy Axolotl Setup 1.0.0.exe` and `dist/Flappy Axolotl 1.0.0.exe` (portable)
- **Linux**: `dist/Flappy Axolotl-1.0.0.AppImage` and `dist/flappy-axolotl_1.0.0_amd64.deb`

## Testing Locally

To test the Electron app without building:

```bash
npm start
```

This will open the game in a desktop window.

## Platform-Specific Notes

### Building for macOS
- Requires macOS to build `.dmg` files
- The app will be unsigned (users may need to allow in Security settings)

### Building for Windows
- Can be built on any platform
- Creates both installer (.exe) and portable (.exe) versions
- Installer allows installation directory choice

### Building for Linux
- Creates AppImage (universal) and .deb (Debian/Ubuntu)
- AppImage works on most Linux distributions

## File Sizes (Approximate)

- macOS DMG: ~150-200 MB
- Windows Installer: ~150-200 MB
- Linux AppImage: ~150-200 MB

*Note: Electron bundles Chromium, which makes the files large but ensures the game works identically on all platforms.*

## Uploading to GitHub Releases

After building:

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Title: `Flappy Axolotl v1.0.0`
5. Upload the files from `dist/`:
   - `Flappy Axolotl-1.0.0.dmg` (macOS)
   - `Flappy Axolotl Setup 1.0.0.exe` (Windows installer)
   - `Flappy Axolotl 1.0.0.exe` (Windows portable)
   - `Flappy Axolotl-1.0.0.AppImage` (Linux)
   - `flappy-axolotl_1.0.0_amd64.deb` (Linux Debian/Ubuntu)
6. Write release notes
7. Publish release

## User Installation Instructions

### For End Users (No Technical Knowledge Required)

**Windows:**
1. Download `Flappy Axolotl Setup 1.0.0.exe`
2. Double-click to install
3. Follow the installer prompts
4. Launch from Start Menu or Desktop shortcut

**Windows (Portable - No Installation):**
1. Download `Flappy Axolotl 1.0.0.exe`
2. Double-click to run directly
3. No installation needed!

**macOS:**
1. Download `Flappy Axolotl-1.0.0.dmg`
2. Open the DMG file
3. Drag "Flappy Axolotl" to Applications folder
4. Open from Applications
5. If blocked, go to System Preferences → Security & Privacy → Click "Open Anyway"

**Linux (AppImage):**
1. Download `Flappy Axolotl-1.0.0.AppImage`
2. Right-click → Properties → Permissions → Check "Allow executing file as program"
3. Double-click to run

**Linux (Debian/Ubuntu):**
1. Download `flappy-axolotl_1.0.0_amd64.deb`
2. Double-click or run: `sudo dpkg -i flappy-axolotl_1.0.0_amd64.deb`
3. Launch from application menu

## Troubleshooting

**Build fails:**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check you have enough disk space (builds need ~1GB free)

**App won't open on Mac:**
- The app is unsigned. Go to System Preferences → Security & Privacy
- Click "Open Anyway" when warned about the app

**Windows Defender blocks the app:**
- This is normal for unsigned apps
- Click "More info" then "Run anyway"

## Alternative: Web Version

Users can also play directly in their browser at:
`https://YOUR-USERNAME.github.io/flappy-axolotl/`

No download required!
