const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT = path.join(__dirname, '../public/favicon-source.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'mstile-150x150.png', size: 150 },
  { name: 'og-image-logo.png', size: 256 },
];

async function generateFavicons() {
  console.log('Generating favicon variants...');

  for (const { name, size } of sizes) {
    const outputPath = path.join(OUTPUT_DIR, name);
    await sharp(INPUT)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(outputPath);
    console.log(`  Generated: ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (multi-size) – use 32x32 as ICO
  await sharp(INPUT)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'favicon.png'));

  console.log('\nAll favicon variants generated successfully.');
}

generateFavicons().catch(console.error);
