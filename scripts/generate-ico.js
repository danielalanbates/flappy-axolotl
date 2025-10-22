#!/usr/bin/env node
// generate-ico.js — Node fallback to create icon.ico without ImageMagick
const Jimp = require('jimp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function main() {
  const src = process.argv[2] || path.join(__dirname, '..', 'assets', 'source.png');
  if (!fs.existsSync(src)) {
    console.error('Source not found:', src);
    process.exit(2);
  }
  const outDir = path.join(__dirname, '..', 'assets');
  await fs.promises.mkdir(outDir, { recursive: true });

  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const buffers = [];
  for (const s of sizes) {
    const img = await Jimp.read(src);
    img.resize(s, s);
    buffers.push(await img.getBufferAsync(Jimp.MIME_PNG));
  }

  const ico = await pngToIco(buffers);
  await fs.promises.writeFile(path.join(outDir, 'icon.ico'), ico);
  console.log('Generated assets/icon.ico');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
