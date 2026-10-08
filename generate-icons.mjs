/**
 * generate-icons.mjs
 * Generates PWA icons (192x192 and 512x512) as PNG files
 * using only Node.js built-in modules — no canvas lib needed.
 * Writes minimal valid PNGs with the app's warm cream + charcoal palette.
 */

import { writeFileSync } from 'fs';
import { deflateSync } from 'zlib';

// ── Minimal PNG encoder ──────────────────────────────────
function uint32BE(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function crc32(buf) {
  const table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return t;
  })();
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type);
  const len = uint32BE(data.length);
  const crcVal = uint32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function encodePNG(width, height, pixels) {
  // pixels: Uint8Array of RGBA, row-major
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB (no alpha for simplicity)
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Build raw rows (filter byte 0 + RGB data)
  const rowBytes = width * 3;
  const raw = Buffer.allocUnsafe(height * (1 + rowBytes));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + rowBytes)] = 0; // filter: None
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4;
      const ri = y * (1 + rowBytes) + 1 + x * 3;
      raw[ri]     = pixels[pi];     // R
      raw[ri + 1] = pixels[pi + 1]; // G
      raw[ri + 2] = pixels[pi + 2]; // B
    }
  }

  const compressed = deflateSync(raw, { level: 6 });

  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Draw icon ────────────────────────────────────────────
function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4);

  // Background: warm cream #faf7f2  (250, 247, 242)
  const bgR = 250, bgG = 247, bgB = 242;
  // Foreground: charcoal #2c2926    (44, 41, 38)
  const fgR = 44,  fgG = 41,  fgB = 38;

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4]     = bgR;
    pixels[i * 4 + 1] = bgG;
    pixels[i * 4 + 2] = bgB;
    pixels[i * 4 + 3] = 255;
  }

  // Draw a four-pointed star (✦) via SDF (signed distance field)
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.22;  // outer radius of star points
  const innerR = size * 0.06;  // inner radius

  function starSDF(px, py) {
    // 4-pointed star SDF — rotate by 45° so points face cardinal directions
    const dx = px - cx;
    const dy = py - cy;
    const angle = Math.atan2(dy, dx) + Math.PI / 4; // rotate 45°
    const r = Math.sqrt(dx * dx + dy * dy);

    // Map angle to [0, pi/2] quadrant
    const a = Math.abs(((angle % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2) - Math.PI / 4);
    // Interpolate between inner and outer radius
    const starR = innerR + (outerR - innerR) * Math.pow(Math.cos(2 * a), 3);
    return r - starR;
  }

  // Anti-aliased rasterization
  const aa = 1.5; // AA width in pixels
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = starSDF(x + 0.5, y + 0.5);
      const alpha = Math.max(0, Math.min(1, (-d + aa / 2) / aa));
      if (alpha > 0) {
        const i = (y * size + x) * 4;
        pixels[i]     = Math.round(bgR * (1 - alpha) + fgR * alpha);
        pixels[i + 1] = Math.round(bgG * (1 - alpha) + fgG * alpha);
        pixels[i + 2] = Math.round(bgB * (1 - alpha) + fgB * alpha);
      }
    }
  }

  return pixels;
}

// ── Generate & write ─────────────────────────────────────
for (const size of [192, 512]) {
  const pixels = drawIcon(size);
  const png = encodePNG(size, size, pixels);
  const path = `public/icons/icon-${size}.png`;
  writeFileSync(path, png);
  console.log(`✓ Written ${path} (${png.length} bytes)`);
}
