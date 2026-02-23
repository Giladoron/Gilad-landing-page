/**
 * Generate favicon and app icons from public/icon-source.svg.
 * Outputs to public/: favicon.ico, favicon-32x32.png, favicon-48x48.png,
 * android-chrome-192x192.png, android-chrome-512x512.png, apple-touch-icon.png.
 * Run: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import ico from "sharp-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public");
const svgPath = join(publicDir, "icon-source.svg");

const SIZES = {
  "favicon-32x32.png": 32,
  "favicon-48x48.png": 48,
  "apple-touch-icon.png": 180,
  "android-chrome-192x192.png": 192,
  "android-chrome-512x512.png": 512,
};

async function main() {
  const svgBuffer = readFileSync(svgPath);

  // Generate PNGs at each size
  for (const [filename, size] of Object.entries(SIZES)) {
    const outPath = join(publicDir, filename);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log("Wrote", filename);
  }

  // Build favicon.ico from 16, 32, 48 (sharp-ico will resize from one source)
  const source48 = sharp(svgBuffer).resize(48, 48);
  await ico.sharpsToIco(
    [source48],
    join(publicDir, "favicon.ico"),
    { sizes: [16, 32, 48] }
  );
  console.log("Wrote favicon.ico");

  console.log("Done. All icon assets are in public/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
