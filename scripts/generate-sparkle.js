/**
 * Generate a 200x200 tileable sparkle/noise texture PNG.
 *
 * The image is a transparent canvas with random bright white pixels
 * scattered across it at varying opacities. Designed for use as a
 * holographic overlay with mix-blend-mode: color-dodge.
 *
 * Usage: node scripts/generate-sparkle.js
 * Output: public/textures/sparkle.png
 */

const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const WIDTH = 200;
const HEIGHT = 200;

// Density of sparkle dots (probability that any given pixel is a sparkle)
const SPARKLE_DENSITY = 0.04;

// A smaller number of extra-bright "star" sparkles
const STAR_DENSITY = 0.008;

const png = new PNG({ width: WIDTH, height: HEIGHT });

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const idx = (WIDTH * y + x) << 2; // RGBA index

    const rand = Math.random();

    if (rand < STAR_DENSITY) {
      // Bright star sparkle — fully white, high opacity
      png.data[idx] = 255;     // R
      png.data[idx + 1] = 255; // G
      png.data[idx + 2] = 255; // B
      png.data[idx + 3] = 200 + Math.floor(Math.random() * 56); // A: 200-255
    } else if (rand < SPARKLE_DENSITY) {
      // Regular sparkle — white with moderate opacity
      png.data[idx] = 255;     // R
      png.data[idx + 1] = 255; // G
      png.data[idx + 2] = 255; // B
      png.data[idx + 3] = 40 + Math.floor(Math.random() * 120); // A: 40-159
    } else {
      // Transparent pixel
      png.data[idx] = 0;
      png.data[idx + 1] = 0;
      png.data[idx + 2] = 0;
      png.data[idx + 3] = 0;
    }
  }
}

const outDir = path.resolve(__dirname, "..", "public", "textures");
const outPath = path.join(outDir, "sparkle.png");

fs.mkdirSync(outDir, { recursive: true });

const buffer = PNG.sync.write(png);
fs.writeFileSync(outPath, buffer);

console.log("Sparkle texture written to " + outPath);
console.log("Dimensions: " + WIDTH + "x" + HEIGHT);
console.log("File size: " + buffer.length + " bytes");
