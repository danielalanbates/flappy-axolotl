# Publishing Flappy Axolotl to GitHub

## Pre-Publishing Checklist

### ✅ Testing Checklist
Test the following features before publishing:

#### Basic Gameplay
- [ ] Game starts with start screen
- [ ] Click/tap makes axolotl swim upward
- [ ] Pipes scroll from right to left
- [ ] Score increases when passing pipes
- [ ] Collision with pipes causes damage
- [ ] Out of bounds (top/bottom) causes damage
- [ ] Game over screen appears when all hearts lost
- [ ] Restart button works correctly

#### Power-ups
- [ ] Mermaid spawns randomly
- [ ] Mermaid hair color matches power-up type
- [ ] **Worm (Pink)** - Restores all hearts
- [ ] **Slow (Orange)** - Slows pipe speed for 5 seconds
- [ ] **Small (Magenta)** - Shrinks axolotl for 5 seconds
- [ ] **Star (Yellow)** - Invincibility for 3 seconds with speed boost
- [ ] Power-up effects expire correctly
- [ ] Power-up visual effects display correctly

#### Boss Fights
- [ ] Scuba Diver boss spawns at score 20
- [ ] Scuba Diver throws nets
- [ ] Nets cause damage when hit
- [ ] Boss health decreases when passing pipes
- [ ] Boss retreats when health reaches 0
- [ ] Dolphin boss spawns at score 40
- [ ] Dolphin creates whirlpools
- [ ] Whirlpools cause damage when hit
- [ ] Bosses alternate correctly (20=Diver, 40=Dolphin, 60=Diver, etc.)

#### Golden Hearts
- [ ] Golden heart spawns when boss is defeated
- [ ] Golden heart scrolls with environment
- [ ] Collecting golden heart increases max health by 1
- [ ] Collecting golden heart fully heals player
- [ ] Special sound plays on collection

#### Health & Damage System
- [ ] Start with 3 hearts
- [ ] Hearts display correctly in UI
- [ ] Invulnerability frames work after taking damage
- [ ] Visual feedback for damage (flashing/color change)
- [ ] Game over triggers at 0 hearts

#### High Scores
- [ ] High score persists between sessions
- [ ] Scoreboard shows top 10 scores
- [ ] Initial entry screen works
- [ ] Initials are saved with scores
- [ ] Scores are sorted correctly

#### Visual & Audio
- [ ] Axolotl scales correctly with small power-up
- [ ] All animations smooth (gills, tail, swimming)
- [ ] Background elements animate (bubbles, fish, jellyfish)
- [ ] Sound effects play for all actions
- [ ] No console errors

## Publishing to GitHub

### 1. Create a New Repository on GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right and select **New repository**
3. Repository settings:
   - **Name**: `flappy-axolotl`
   - **Description**: "A charming underwater Flappy Bird game featuring a realistic pink axolotl"
   - **Visibility**: Public (or Private if preferred)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Link Local Repository to GitHub

```bash
cd "/Users/daniel/Documents/aicode/Flappy Axolotl"

# Add the remote repository (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/flappy-axolotl.git

# Rename branch to main (optional but recommended)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section in the left sidebar
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait a few minutes for deployment
7. Your game will be live at: `https://YOUR-USERNAME.github.io/flappy-axolotl/`

### 4. Add Repository Topics (Optional)

Add topics to help people find your game:
- `game`
- `javascript`
- `html5-canvas`
- `flappy-bird`
- `axolotl`
- `pwa`
- `browser-game`

### 5. Update README with Live Demo Link

After GitHub Pages is deployed, add this to the top of your README:

```markdown
## 🎮 [Play Now!](https://YOUR-USERNAME.github.io/flappy-axolotl/)
```

Commit and push the change:

```bash
git add README.md
git commit -m "Add live demo link to README"
git push
```

## Post-Publishing

### Share Your Game
- Share the GitHub Pages URL on social media
- Post on game development forums
- Submit to browser game directories

### Future Updates
When making changes:

```bash
# Make your changes to the code
git add -A
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically update within a few minutes.

## Troubleshooting

### Game doesn't work on GitHub Pages
- Check browser console for errors
- Verify all file paths are relative, not absolute
- Make sure service worker cache names are unique

### High scores don't persist
- This is expected - localStorage is domain-specific
- Each player will have their own local high scores

### PWA doesn't install
- PWA requires HTTPS (GitHub Pages provides this)
- Try force refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check manifest.json paths are correct

---

Good luck with your game! 🦎💕
