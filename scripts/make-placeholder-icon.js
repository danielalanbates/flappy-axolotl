#!/usr/bin/env node
// make-placeholder-icon.js
// Creates a simple placeholder 1024x1024 PNG at assets/source.png using Jimp

const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function makePlaceholder(out = path.join(__dirname, '..', 'assets', 'source.png')) {
  await fs.promises.mkdir(path.dirname(out), { recursive: true });
  const image = new Jimp(1024, 1024, '#70c5ce');
  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  image.print(font, 0, 420, {
    text: 'Flappy\nAxolotl',
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  }, 1024, 512);
  await image.writeAsync(out);
  console.log('Placeholder icon written to', out);
}

if (require.main === module) {
  makePlaceholder(process.argv[2]).catch(err => {
    console.error('Failed to create placeholder:', err);
    process.exit(1);
  });
}
