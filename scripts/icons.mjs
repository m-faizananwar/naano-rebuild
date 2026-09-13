// Renders the icon PNGs: favicon-16/32 from public/favicon.svg (oval, stem and
// centre leaf pair — the full sprig turns to mud at 16px) and the 180px touch
// icon from public/mark.svg (the full mark). Run after changing the mark:
// node scripts/icons.mjs
import { readFileSync } from "node:fs";
import sharp from "sharp";

const favicon = readFileSync("public/favicon.svg");
const mark = readFileSync("public/mark.svg");
// The mark is 96×120: pad it onto a square canvas so browsers don't squash it.
async function render(svg, size, out, strokeScale = 1) {
  const src = strokeScale === 1 ? svg : Buffer.from(svg.toString().replace('stroke-width="2"', `stroke-width="${2 * strokeScale}"`));
  const inner = Math.round(size * 0.92);
  const mark = await sharp(src, { density: 600 }).resize({ height: inner, fit: "inside" }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toFile(out);
  console.log(out);
}
// Small sizes get a heavier stroke so the oval and sprig survive at 16px.
await render(favicon, 16, "public/favicon-16.png", 3);
await render(favicon, 32, "public/favicon-32.png", 2);
await render(mark, 180, "public/apple-touch-icon.png", 1);
