# Release Guide - Making Flappy Axolotl Available for Download

This guide will help you publish Flappy Axolotl so anyone can download and play it on any OS without technical knowledge.

## 🎯 Goal

Make the game available in two ways:
1. **Web Version** - Play instantly in browser (GitHub Pages)
2. **Desktop Apps** - Download and run on Windows, Mac, or Linux

## 📋 Step-by-Step Release Process

### Step 1: Publish to GitHub

```bash
cd "/Users/daniel/Documents/aicode/Flappy Axolotl"

# Create repository on GitHub first (at github.com)
# Then link it:
git remote add origin https://github.com/YOUR-USERNAME/flappy-axolotl.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages (Web Version)

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** in left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 2-3 minutes
7. Game will be live at: `https://YOUR-USERNAME.github.io/flappy-axolotl/`

### Step 3: Build Desktop Apps

On your Mac, run:

```bash
cd "/Users/daniel/Documents/aicode/Flappy Axolotl"

# Build for all platforms
npm run build

# This will create files in dist/ folder:
# - Flappy Axolotl-1.0.0.dmg (macOS)
# - Flappy Axolotl-1.0.0-mac.zip (macOS alternative)
# - Flappy Axolotl Setup 1.0.0.exe (Windows installer)
# - Flappy Axolotl 1.0.0.exe (Windows portable)
# - Flappy Axolotl-1.0.0.AppImage (Linux universal)
# - flappy-axolotl_1.0.0_amd64.deb (Linux Debian/Ubuntu)
```

**Note:** This may take 5-10 minutes and will create ~200MB files per platform.

### Step 4: Create GitHub Release with Downloads

1. Go to your repository on GitHub
2. Click **Releases** (right sidebar)
3. Click **Create a new release**
4. Fill in:
   - **Tag**: `v1.0.0`
   - **Title**: `Flappy Axolotl v1.0.0 - Initial Release`
   - **Description**: Copy from template below
5. **Upload files** from `dist/` folder:
   - Drag all the built files (.dmg, .exe, .AppImage, .deb)
6. Click **Publish release**

#### Release Description Template:

```markdown
# 🦎 Flappy Axolotl v1.0.0

A charming underwater Flappy Bird game featuring a realistic pink axolotl!

## 🎮 How to Play
- Click or tap to swim upward
- Avoid pipes and obstacles
- Collect power-ups from mermaids
- Defeat bosses every 20 points
- Set high scores!

## 💾 Download & Install

### 🪟 Windows
**Option 1: Installer (Recommended)**
1. Download `Flappy Axolotl Setup 1.0.0.exe`
2. Double-click to install
3. Play from Start Menu

**Option 2: Portable (No Install)**
1. Download `Flappy Axolotl 1.0.0.exe`
2. Double-click to play immediately
3. No installation required!

### 🍎 macOS
1. Download `Flappy Axolotl-1.0.0.dmg`
2. Open the DMG file
3. Drag app to Applications folder
4. Launch from Applications
5. If blocked: System Preferences → Security & Privacy → "Open Anyway"

### 🐧 Linux
**Option 1: AppImage (Any Distribution)**
1. Download `Flappy Axolotl-1.0.0.AppImage`
2. Right-click → Properties → Permissions → Check "Allow executing as program"
3. Double-click to run

**Option 2: .deb Package (Debian/Ubuntu)**
1. Download `flappy-axolotl_1.0.0_amd64.deb`
2. Double-click to install OR run: `sudo dpkg -i flappy-axolotl_1.0.0_amd64.deb`
3. Launch from app menu

## 🌐 Play in Browser
No download needed! Play at: [https://YOUR-USERNAME.github.io/flappy-axolotl/](https://YOUR-USERNAME.github.io/flappy-axolotl/)

## ✨ Features
- Realistic axolotl with animated gills
- 4 power-ups from color-coded mermaids
- 2 boss fights (Scuba Diver & Dolphin)
- Golden hearts that permanently increase max health
- SNES-style underwater environment
- High score tracking
- Works offline after first load

## 📦 Technical Details
- No dependencies - runs standalone
- File size: ~150-200MB per platform
- Built with Electron + HTML5 Canvas
- Pure vanilla JavaScript

---

Enjoy swimming with the axolotl! 🦎💕
```

### Step 5: Update README Links

After creating the release, update your README.md to replace `YOUR-USERNAME` with your actual GitHub username:

```bash
# Edit README.md and replace YOUR-USERNAME with your actual username
# Then commit and push:
git add README.md
git commit -m "Update download links with actual username"
git push
```

## 🎉 You're Done!

Now people can:

1. **Play instantly in browser**: Visit your GitHub Pages URL
2. **Download desktop app**: Go to Releases page and download for their OS

## 📱 Sharing Your Game

Share these links:

- **Web Version**: `https://YOUR-USERNAME.github.io/flappy-axolotl/`
- **Downloads**: `https://github.com/YOUR-USERNAME/flappy-axolotl/releases`
- **Repository**: `https://github.com/YOUR-USERNAME/flappy-axolotl`

## 🔄 Future Updates

When you make changes:

```bash
# Make your code changes
git add -A
git commit -m "Description of changes"
git push

# Rebuild desktop apps
npm run build

# Create new release on GitHub
# Upload new files from dist/
# Tag as v1.1.0, v1.2.0, etc.
```

## 💡 Tips for Non-Technical Users

When sharing with non-technical users, tell them:

**"Want to play Flappy Axolotl?"**

**For instant play:**
"Visit [your-github-pages-url] - works on any device!"

**For download:**
"Go to [releases-url] and click the download for your computer:
- Windows: Click the 'Setup' file
- Mac: Click the 'dmg' file
- Linux: Click the 'AppImage' file"

That's it! No explaining GitHub, git, or technical details needed.

## ❓ Common User Questions

**Q: Is it safe to download?**
A: Yes! It's open source. The code is all visible in the repository.

**Q: Why is Windows/Mac blocking it?**
A: The app isn't code-signed (costs $99-$299/year). It's safe - click "More info" → "Run anyway"

**Q: Why is it so large (200MB)?**
A: It includes a mini browser (Electron) so it works identically everywhere without needing any installation.

**Q: Does it need internet?**
A: No! After downloading, it works completely offline.

**Q: Do high scores sync?**
A: No, they're saved locally on each computer.

---

🎮 Happy releasing! Your game is ready to share with the world! 🦎💕
