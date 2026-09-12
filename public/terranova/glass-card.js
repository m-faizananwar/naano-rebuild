// Frame sync: the card is a window onto a refracted duplicate of the background
// video. Every frame the duplicate is re-aligned to the viewport origin and
// redrawn from the current video frame; the SVG filter on the canvas does the
// refraction on composite. Self-starting, no exports.

// The duplicate is sized to the VIEWPORT rather than to the card on purpose:
// the filter shifts each colour channel by a different amount, so the filtered
// element's own leading edges show hard channel-separation bands. At viewport
// size those bands fall outside the card and only clean refraction shows.
//
// It stays at 1× even on retina: the SVG filter's cost scales with pixel
// count, and what shows through is a soft refraction where 4× the filter work
// buys nothing.
const DUP_PIXEL_RATIO = 1;

const video = document.getElementById("bg-video");
const card = document.querySelector("[data-glass-card]");
const container = document.getElementById("dup-video-container");
const canvas = document.getElementById("dup-image");
const ctx = canvas.getContext("2d");

let lastW = 0;
let lastH = 0;

function frame() {
  requestAnimationFrame(frame);
  if (!video || !card || !container || !ctx) return;
  const rect = card.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  if (!video.videoWidth || !video.videoHeight) return;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  // Absolutely positioned inside the card, so this negative offset lands the
  // duplicate exactly over the viewport origin: its pixels line up 1:1 with the
  // real video behind the card. The card's overflow:hidden + radius clip it.
  container.style.left = `${-rect.left}px`;
  container.style.top = `${-rect.top}px`;
  container.style.width = `${vw}px`;
  container.style.height = `${vh}px`;

  const w = Math.round(vw * DUP_PIXEL_RATIO);
  const h = Math.round(vh * DUP_PIXEL_RATIO);
  if (w !== lastW || h !== lastH) {
    canvas.width = w;
    canvas.height = h;
    lastW = w;
    lastH = h;
  }

  // Reproduce object-fit: cover.
  const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight);
  const sw = vw / cover, sh = vh / cover;
  const sx = (video.videoWidth - sw) / 2, sy = (video.videoHeight - sh) / 2;
  try {
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
  } catch (e) {
    // a frame may not be decodable yet
  }
}

requestAnimationFrame(frame);
