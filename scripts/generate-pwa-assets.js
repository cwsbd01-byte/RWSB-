import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, drawPixelFn) {
  // Raw uncompressed RGBA pixel data with filter byte per row
  const rowBytes = width * 4 + 1; // 1 byte filter (0 = None) + 4 bytes per pixel (RGBA)
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    rawData[rowStart] = 0; // Filter: 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowStart + 1 + x * 4;
      const [r, g, b, a] = drawPixelFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace (no)

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(4 + 4 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = calculateCrc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function calculateCrc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Public directory ensure
const publicDir = path.resolve(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');
const screenshotsDir = path.join(publicDir, 'screenshots');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Draw icon: Emerald gradient badge + white rabbit ears / head silhouette + emerald medical cross
function drawAppIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const r = Math.sqrt(dx * dx + dy * dy);

  // Background
  const bgCornerRadius = isMaskable ? 0 : w * 0.22;
  let inBadge = false;

  if (isMaskable) {
    inBadge = true;
  } else {
    // Rounded rect
    const halfW = w * 0.46;
    const halfH = h * 0.46;
    const rx = Math.abs(dx) - (halfW - bgCornerRadius);
    const ry = Math.abs(dy) - (halfH - bgCornerRadius);
    if (rx <= 0 && ry <= 0) {
      inBadge = true;
    } else if (rx > 0 && ry <= 0 && Math.abs(dx) <= halfW) {
      inBadge = true;
    } else if (ry > 0 && rx <= 0 && Math.abs(dy) <= halfH) {
      inBadge = true;
    } else if (rx > 0 && ry > 0 && Math.sqrt(rx * rx + ry * ry) <= bgCornerRadius) {
      inBadge = true;
    }
  }

  if (!inBadge) {
    return [0, 0, 0, 0]; // transparent
  }

  // Base background emerald gradient (from #059669 to #064e3b)
  const grad = y / h;
  let bgR = Math.round(5 * (1 - grad) + 6 * grad);
  let bgG = Math.round(150 * (1 - grad) + 78 * grad);
  let bgB = Math.round(105 * (1 - grad) + 59 * grad);

  // Decorative subtle inner glow circle
  if (r < w * 0.4) {
    const glow = (1 - r / (w * 0.4)) * 0.12;
    bgR = Math.min(255, Math.round(bgR + 255 * glow));
    bgG = Math.min(255, Math.round(bgG + 255 * glow));
    bgB = Math.min(255, Math.round(bgB + 255 * glow));
  }

  // Scaled coordinates centered at (0, 0)
  const nx = dx / (w * 0.5);
  const ny = dy / (h * 0.5);

  let isWhite = false;
  let isPink = false;
  let isGreenAccent = false;

  // 1. Left Ear
  const elx = nx + 0.22;
  const ely = ny + 0.32;
  const inLeftEar = (elx * elx) / (0.12 * 0.12) + (ely * ely) / (0.38 * 0.38) <= 1;
  const inLeftEarInner = (elx * elx) / (0.06 * 0.06) + ((ely - 0.02) * (ely - 0.02)) / (0.28 * 0.28) <= 1;

  // 2. Right Ear
  const erx = nx - 0.22;
  const ery = ny + 0.32;
  const inRightEar = (erx * erx) / (0.12 * 0.12) + (ery * ery) / (0.38 * 0.38) <= 1;
  const inRightEarInner = (erx * erx) / (0.06 * 0.06) + ((ery - 0.02) * (ery - 0.02)) / (0.28 * 0.28) <= 1;

  // 3. Rabbit Head
  const hx = nx;
  const hy = ny - 0.12;
  const inHead = (hx * hx) / (0.38 * 0.38) + (hy * hy) / (0.32 * 0.32) <= 1;

  // 4. Cheeks & Muzzle
  const chLeft = ((nx + 0.16) * (nx + 0.16)) / (0.2 * 0.2) + ((ny - 0.16) * (ny - 0.16)) / (0.18 * 0.18) <= 1;
  const chRight = ((nx - 0.16) * (nx - 0.16)) / (0.2 * 0.2) + ((ny - 0.16) * (ny - 0.16)) / (0.18 * 0.18) <= 1;

  // 5. Medical Cross Badge on bottom right of rabbit
  const cx0 = nx - 0.32;
  const cy0 = ny - 0.32;
  const inCrossH = Math.abs(cx0) <= 0.14 && Math.abs(cy0) <= 0.045;
  const inCrossV = Math.abs(cx0) <= 0.045 && Math.abs(cy0) <= 0.14;
  const inCrossRing = (cx0 * cx0 + cy0 * cy0 <= 0.19 * 0.19) && (cx0 * cx0 + cy0 * cy0 >= 0.15 * 0.15);

  if (inLeftEarInner || inRightEarInner) {
    isPink = true;
  } else if (inLeftEar || inRightEar || inHead || chLeft || chRight) {
    isWhite = true;
  }

  // Eyes (dark eyes)
  const eyeLY = ny - 0.08;
  const eyeLX = nx + 0.18;
  const eyeRX = nx - 0.18;
  const inEyeL = (eyeLX * eyeLX) / (0.045 * 0.045) + (eyeLY * eyeLY) / (0.055 * 0.055) <= 1;
  const inEyeR = (eyeRX * eyeRX) / (0.045 * 0.045) + (eyeLY * eyeLY) / (0.055 * 0.055) <= 1;

  // Nose (pink triangle/oval)
  const noseY = ny - 0.18;
  const noseX = nx;
  const inNose = (noseX * noseX) / (0.045 * 0.045) + (noseY * noseY) / (0.035 * 0.035) <= 1;

  if (inEyeL || inEyeR) {
    return [30, 41, 59, 255]; // Dark slate
  }
  if (inNose) {
    return [244, 114, 182, 255]; // Pink-400
  }
  if (inCrossH || inCrossV || inCrossRing) {
    return [255, 255, 255, 255]; // White medical cross
  }
  if (isPink) {
    return [251, 207, 232, 255]; // Soft pink
  }
  if (isWhite) {
    return [255, 255, 255, 255];
  }

  return [bgR, bgG, bgB, 255];
}

// Generate Screenshots (Wide: 1280x720 & Narrow: 720x1280)
function drawScreenshotWide(x, y, w, h) {
  // Top nav bar
  if (y < 60) {
    return [6, 78, 59, 255]; // #064e3b
  }
  // Subheader
  if (y < 120) {
    return [255, 255, 255, 255];
  }
  // Content background
  const isCard = (x > 80 && x < 600 && y > 150 && y < 650) || (x > 640 && x < 1200 && y > 150 && y < 650);
  if (isCard) {
    return [255, 255, 255, 255];
  }
  return [248, 250, 252, 255]; // slate-50
}

function drawScreenshotNarrow(x, y, w, h) {
  if (y < 70) {
    return [6, 78, 59, 255]; // #064e3b
  }
  if (y < 140) {
    return [255, 255, 255, 255];
  }
  const isCard = (x > 30 && x < w - 30 && y > 160 && y < 450) || (x > 30 && x < w - 30 && y > 470 && y < 850) || (x > 30 && x < w - 30 && y > 870 && y < 1200);
  if (isCard) {
    return [255, 255, 255, 255];
  }
  return [248, 250, 252, 255];
}

console.log('Generating PNG icons for PWA and PWABuilder compliance...');

const iconSizes = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon-96x96.png', size: 96, maskable: false },
  { name: 'favicon-48x48.png', size: 48, maskable: false },
];

for (const icon of iconSizes) {
  const buffer = createPng(icon.size, icon.size, (x, y, w, h) => drawAppIcon(x, y, w, h, icon.maskable));
  fs.writeFileSync(path.join(iconsDir, icon.name), buffer);
  console.log(`Created ${icon.name} (${icon.size}x${icon.size})`);
}

// Copy primary 192 & 512 to root public too for legacy crawlers
fs.copyFileSync(path.join(iconsDir, 'icon-192x192.png'), path.join(publicDir, 'icon-192x192.png'));
fs.copyFileSync(path.join(iconsDir, 'icon-512x512.png'), path.join(publicDir, 'icon-512x512.png'));
fs.copyFileSync(path.join(iconsDir, 'apple-touch-icon.png'), path.join(publicDir, 'apple-touch-icon.png'));

// Generate screenshots
console.log('Generating screenshots for PWABuilder store readiness...');
const wideBuf = createPng(1280, 720, drawScreenshotWide);
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-wide.png'), wideBuf);
fs.copyFileSync(path.join(screenshotsDir, 'screenshot-wide.png'), path.join(publicDir, 'screenshot-wide.png'));

const narrowBuf = createPng(720, 1280, drawScreenshotNarrow);
fs.writeFileSync(path.join(screenshotsDir, 'screenshot-narrow.png'), narrowBuf);
fs.copyFileSync(path.join(screenshotsDir, 'screenshot-narrow.png'), path.join(publicDir, 'screenshot-narrow.png'));

console.log('All PWA assets generated successfully!');
