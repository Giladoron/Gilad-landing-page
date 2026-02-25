/**
 * Generate static typographic "G" favicon assets.
 * Run: node scripts/generate-favicons-typographic.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const BG = "#0A0A0A";
const FG = "#FF6B35";
const MARGIN = 0.04;
const CORNER_RADIUS = 25;
// Minimal Y offset so top and bottom padding are equal (nudge up; ~1–2 px at 48px)
const Y_OFFSET = -2;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="${BG}"/>
  <text
    x="50"
    y="${50 + Y_OFFSET}"
    fill="${FG}"
    font-family="system-ui, -apple-system, sans-serif"
    font-weight="bold"
    font-size="${(1 - 2 * MARGIN) * 100 * 1.05}"
    text-anchor="middle"
    dominant-baseline="middle"
  >G</text>
</svg>`;

const svgBuffer = Buffer.from(svg);

async function pngAtSize(size) {
  return sharp(svgBuffer).resize(size, size).png().toBuffer();
}

const sizes = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-48x48.png", 48],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
];

for (const [name, size] of sizes) {
  const buf = await pngAtSize(size);
  writeFileSync(join(publicDir, name), buf);
  console.log("Wrote", name);
}

const icoBuffers = [await pngAtSize(16), await pngAtSize(32), await pngAtSize(48)];
const ico = await toIco(icoBuffers);
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log("Wrote favicon.ico");
console.log("Done.");
