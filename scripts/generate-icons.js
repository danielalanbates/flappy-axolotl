#!/usr/bin/env node
// generate-icons.js
// Cross-platform icon generator using Jimp and to-ico

const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

async function generate(src = path.join(__dirname, '..', 'assets', 'source.png')) {
  if (!fs.existsSync(src)) {
    console.error('Source file not found:', src);
    process.exitCode = 2;
    return;
  }

  const outDir = path.join(__dirname, '..', 'assets');
  await fs.promises.mkdir(outDir, { recursive: true });

  const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];
  const images = [];

  for (const s of sizes) {
    const img = await Jimp.read(src);
    img.resize(s, s);
    const buffer = await img.getBufferAsync(Jimp.MIME_PNG);
    images.push(buffer);
    if (s === 192 || s === 512) {
      // These will be saved separately below
    }
  }

  // Write PWA PNGs
  const pwa192 = await Jimp.read(src);
  pwa192.resize(192, 192);
  await pwa192.writeAsync(path.join(outDir, 'icon-192.png'));

  const pwa512 = await Jimp.read(src);
  pwa512.resize(512, 512);
  await pwa512.writeAsync(path.join(outDir, 'icon-512.png'));

  // Write icon.png (512x512)
  const iconPng = await Jimp.read(src);
  iconPng.resize(512, 512);
  await iconPng.writeAsync(path.join(outDir, 'icon.png'));

  // Generate .ico from multiple sizes (16..256)
  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const icoBuffers = [];
  for (const s of icoSizes) {
    const img = await Jimp.read(src);
    img.resize(s, s);
    const buf = await img.getBufferAsync(Jimp.MIME_PNG);
    icoBuffers.push(buf);
  }
  const ico = await pngToIco(icoBuffers);
  await fs.promises.writeFile(path.join(outDir, 'icon.ico'), ico);

  // Attempt to create an .icns by writing an .iconset and invoking iconutil on macOS
  const isMac = process.platform === 'darwin';
  if (isMac) {
    const iconsetDir = path.join(outDir, 'icon.iconset');
    await fs.promises.mkdir(iconsetDir, { recursive: true });
    await new Promise(async (resolve) => {
      for (const size of [16, 32, 64, 128, 256, 512, 1024]) {
        const img = await Jimp.read(src);
        img.resize(size, size);
        const fileName = `icon_${size}x${size}.png`;
        await img.writeAsync(path.join(iconsetDir, fileName));
      }
      resolve();
    });
    const { exec } = require('child_process');
    const icnsPath = path.join(outDir, 'icon.icns');
    exec(`iconutil -c icns ${iconsetDir} -o ${icnsPath}`, (err, stdout, stderr) => {
      if (err) {
        console.warn('iconutil failed:', stderr || err.message);
      } else {
        console.log('icon.icns created at', icnsPath);
      }
      // cleanup iconset
      fs.rmSync(iconsetDir, { recursive: true, force: true });
    });
  }

  console.log('Generated icons in', outDir);
}

if (require.main === module) {
  const arg = process.argv[2];
  generate(arg).catch(err => {
    console.error('Error generating icons:', err);
    process.exit(1);
  });
}
