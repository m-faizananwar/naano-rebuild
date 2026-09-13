// Renders the icon PNGs on a white disc (favicon-16/32 from public/favicon.svg —
// oval, stem and centre leaf pair; the 180px touch icon from public/mark.svg, the
// full mark). The disc makes the ink mark read on a dark tab bar; a 1px inner
// ring of the ink at 10% keeps it visible on a white one. Run after changing the
// mark: node scripts/icons.mjs
import { readFileSync } from "node:fs";
import sharp from "sharp";

const favicon = readFileSync("public/favicon.svg");
const mark = readFileSync("public/mark.svg");
const MARK_SHARE = 0.7;

function disc(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="#ffffff"/><circle cx="${r}" cy="${r}" r="${r - 0.5}" fill="none" stroke="#175A67" stroke-opacity="0.1" stroke-width="1"/></svg>`,
  );
}

// favicon.svg already carries the disc; mark.svg is the bare 96×120 mark, so it
// is padded onto the disc at 70% of the size.
async function renderMark(svg, size, out, strokeScale = 1) {
  const src = strokeScale === 1 ? svg : Buffer.from(svg.toString().replace('stroke-width="2"', `stroke-width="${2 * strokeScale}"`));
  const inner = Math.round(size * MARK_SHARE);
  const glyph = await sharp(src, { density: 600 }).resize({ height: inner, fit: "inside" }).png().toBuffer();
  await sharp(disc(size)).composite([{ input: glyph, gravity: "centre" }]).png().toFile(out);
  console.log(out);
}
async function renderDisc(svg, size, out, strokeScale = 1) {
  const src = strokeScale === 1 ? svg : Buffer.from(svg.toString().replace('stroke-width="2"', `stroke-width="${2 * strokeScale}"`));
  await sharp(src, { density: 600 }).resize(size, size).png().toFile(out);
  console.log(out);
}
// Small sizes get a heavier stroke so the oval and sprig survive at 16px.
await renderDisc(favicon, 16, "public/favicon-16.png", 3);
await renderDisc(favicon, 32, "public/favicon-32.png", 2);
await renderMark(mark, 180, "public/apple-touch-icon.png", 1);
