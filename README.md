# Flappy Axolotl

A charming underwater Flappy Bird-style game featuring a realistic pink axolotl swimming through an SNES-inspired ocean environment. Built with HTML5 Canvas and vanilla JavaScript.

## 🎮 [Play Now in Browser!](https://danielalanbates.github.io/flappy-axolotl/)

## 💾 Download Desktop App

**No installation needed - just download and play!**

### Windows
- [Download Installer](https://github.com/danielalanbates/flappy-axolotl/releases/latest/download/Flappy.Axolotl.Setup.1.0.0.exe) (Recommended)
- [Download Portable](https://github.com/danielalanbates/flappy-axolotl/releases/latest/download/Flappy.Axolotl.1.0.0.exe) (No install, run directly)

### macOS
- [Download DMG](https://github.com/danielalanbates/flappy-axolotl/releases/latest/download/Flappy.Axolotl-1.0.0.dmg)

### Linux
- [Download AppImage](https://github.com/danielalanbates/flappy-axolotl/releases/latest/download/Flappy.Axolotl-1.0.0.AppImage) (Universal)
- [Download .deb](https://github.com/danielalanbates/flappy-axolotl/releases/latest/download/flappy-axolotl_1.0.0_amd64.deb) (Debian/Ubuntu)

## 🎮 How to Play

- **Click or tap** to make the axolotl swim upward
- Navigate through pipes while avoiding obstacles
- Collect power-ups from mermaids
- Defeat bosses every 20 points
- Try to survive as long as possible and set a high score!

## ✨ Features

### Core Gameplay
- Realistic axolotl sprite with animated gills, tail, and swimming motion
- Underwater-themed SNES-style graphics
- Dynamic difficulty scaling
- Heart-based health system with invulnerability frames
- Procedurally generated sound effects

### Power-ups (Dropped by Mermaids)
Mermaids swim across the screen with hair colors that match their power-up:

- **🪱 Worm (Pink)** - Restores all hearts
- **⏰ Slow (Orange)** - Slows down pipe speed
- **🔽 Small (Magenta)** - Shrinks the axolotl for easier navigation
- **⭐ Star (Yellow)** - Invincibility and speed boost

### Boss Fights (Every 20 Points)
- **Scuba Diver Boss** - Throws nets that trap you
- **Dolphin Boss** - Creates whirlpools that pull you in
- Defeat bosses to earn **Golden Hearts** that permanently increase max health

### Environment
- Animated bubbles and background elements (fish, jellyfish, seaweed)
- Parallax scrolling layers
- Ocean floor with seamless texture
- Atmospheric underwater gradient background

### Progression
- High score tracking with localStorage
- Top 10 scoreboard with initials
- Increasing difficulty every 2 points
- Boss alternation system

## 🎯 Game Mechanics

### Health System
- Start with 3 hearts
- Take damage from:
  - Hitting pipes
  - Going out of bounds
  - Boss attacks (nets/whirlpools)
- Invulnerability period after taking damage
- Collect golden hearts from defeated bosses to increase max health

### Boss Battles
- Triggered at scores: 20, 40, 60, 80...
- Bosses alternate between Scuba Diver and Dolphin
- Deal damage by successfully passing pipes during boss fight
- Each boss has 5 health points
- Bosses retreat when defeated, dropping a golden heart

## 🚀 Running the Game

### Local Play
Simply open `index.html` in a modern web browser.

### Local Server (Recommended)
For the best experience with PWA features:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000`

### PWA Installation
The game can be installed as a Progressive Web App on mobile devices and desktop browsers that support PWA installation.

## 📁 Project Structure

```
Flappy Axolotl/
├── index.html          # Main HTML file
├── game.js             # Game logic and rendering
├── style.css           # Styling
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for PWA
└── README.md          # This file
```

## 🛠️ Technical Details

- **No dependencies** - Pure vanilla JavaScript
- **HTML5 Canvas** for rendering
- **Web Audio API** for procedural sound generation
- **LocalStorage** for high score persistence
- **PWA-ready** with service worker and manifest
- **Class-based architecture** for game entities
- **Responsive design** (800x600 canvas)

## 🎨 Art Style

- SNES-inspired pixel-perfect aesthetic
- Realistic axolotl anatomy (external gills, tail fin, legs)
- Underwater color palette (blues, teals, sandy browns)
- Smooth animations using sine waves for natural movement

## 🏆 Scoring

- **+1 point** for each pipe cleared
- **+5 bonus points** for defeating a boss
- Difficulty increases every 2 points
- High scores saved locally with player initials

## 🎵 Audio

All sound effects are procedurally generated using the Web Audio API:
- Flapping sounds
- Power-up collection
- Damage effects
- Boss defeat fanfare
- Special golden heart sound

## 🐛 Known Features

- Boss attacks (nets/whirlpools) disappear when boss is defeated
- Golden hearts scroll with the environment
- Power-ups have timed effects (except worm, which is instant)
- Mermaids swim elegantly with animated tails and hair

## 📝 Credits

Created with Claude Code
Game design inspired by Flappy Bird
Axolotl sprite and underwater theme original

## 📜 License

This project is open source and available for personal and educational use.

---

Enjoy swimming with the axolotl! 🦎💕


---

## License

Copyright (c) 2025 Daniel Bates / BatesAI

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Copyright Notice

While this code is open source under the MIT License, the BatesAI brand name and associated trademarks are proprietary. Please do not use the BatesAI name or logo without permission.

For commercial support or custom development, contact: daniel@batesai.org

