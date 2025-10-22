#!/usr/bin/env node
// generate-ico-node-only.js — Create a multi-size ICO without external native deps
// This implementation writes a simple ICO by combining PNGs into an ICO file. It's a minimal implementation and supports common sizes.

const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

async function writeICO(buffers, outPath) {
  // Simple ICO writer using PNG images
  // ICO header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = 1 for icon
  header.writeUInt16LE(buffers.length, 4); // number of images

  let entries = Buffer.alloc(16 * buffers.length);
  let dataOffset = 6 + entries.length;
  let imageData = Buffer.alloc(0);

  for (let i = 0; i < buffers.length; i++) {
    const b = buffers[i];
    const size = b.length;
    const width = 0; // 0 means 256 in ICO spec for width/height
    const height = 0;
    const colorCount = 0;
    const reserved = 0;
    const planes = 1;
    const bitCount = 32;

    // write entry
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width, 0);
    entry.writeUInt8(height, 1);
    entry.writeUInt8(colorCount, 2);
    entry.writeUInt8(reserved, 3);
    entry.writeUInt16LE(planes, 4);
    entry.writeUInt16LE(bitCount, 6);
    entry.writeUInt32LE(size, 8);
    entry.writeUInt32LE(dataOffset, 12);

    entry.copy(entries, i * 16);

    imageData = Buffer.concat([imageData, b]);
    dataOffset += size;
  }

  const out = Buffer.concat([header, entries, imageData]);
  fs.writeFileSync(outPath, out);
}

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
    const buf = await img.getBufferAsync(Jimp.MIME_PNG);
    buffers.push(buf);
  }

  const outPath = path.join(outDir, 'icon.ico');
  await writeICO(buffers, outPath);
  console.log('Wrote', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
