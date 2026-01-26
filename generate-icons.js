const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 192, name: "icons/icon-192x192.png" },
  { size: 512, name: "icons/icon-512x512.png" },
];

const maskableSizes = [
  { size: 192, name: "icons/icon-192x192-maskable.png" },
  { size: 512, name: "icons/icon-512x512-maskable.png" },
];

const svgPath = path.join(__dirname, "public", "logo.svg");
const publicDir = path.join(__dirname, "public");

async function generateIcons() {
  console.log("Generating icons from SVG...");

  // Generate regular icons
  for (const { size, name } of sizes) {
    const outputPath = path.join(publicDir, name);
    await sharp(svgPath).resize(size, size).png().toFile(outputPath);
    console.log(`✓ Generated ${name}`);
  }

  // Generate maskable icons (with extra padding for safe zone)
  for (const { size, name } of maskableSizes) {
    const outputPath = path.join(publicDir, name);
    const paddedSize = Math.floor(size * 0.8); // 80% of size to leave safe zone
    await sharp(svgPath)
      .resize(paddedSize, paddedSize)
      .extend({
        top: Math.floor((size - paddedSize) / 2),
        bottom: Math.ceil((size - paddedSize) / 2),
        left: Math.floor((size - paddedSize) / 2),
        right: Math.ceil((size - paddedSize) / 2),
        background: { r: 79, g: 70, b: 229, alpha: 1 }, // #4f46e5
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${name} (maskable)`);
  }

  // Generate favicon.ico (multi-size ICO file)
  const favicon16 = await sharp(svgPath).resize(16, 16).png().toBuffer();
  const favicon32 = await sharp(svgPath).resize(32, 32).png().toBuffer();

  // For ICO, we'll just use the 32x32 PNG as favicon
  await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, "favicon.png"));
  console.log("✓ Generated favicon.png");

  // Generate apple-touch-icon
  await sharp(svgPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("✓ Generated apple-touch-icon.png");

  console.log("\n✅ All icons generated successfully!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
