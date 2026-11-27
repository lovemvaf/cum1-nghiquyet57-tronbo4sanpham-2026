#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const ORIG_THUMB = path.join(ROOT, 'deliverables', '01_Video', '1.1_Doi1_ChuDe1_THUMB_GOC.png');
const OUT_941 = path.join(ROOT, 'deliverables', '01_Video', 'thumbnail-chu-dung.png');
const OUT_1080 = path.join(ROOT, 'deliverables', '01_Video', 'thumbnail-chu-dung-1080x1920.png');
const PUB_941 = path.join(ROOT, 'public', 'assets', 'video', 'thumbnail-chu-dung.png');
const PUB_1080 = path.join(ROOT, 'public', 'assets', 'video', 'thumbnail-chu-dung-1080x1920.png');

const SCRATCH_DIR = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\6d1a5a2e-4a21-49e5-9f33-aac3e4f50ea2\\scratch';
const CLEAN_BG_PATH = path.join(SCRATCH_DIR, 'thumb_clean_bg.png');
const RAW_COMP_PATH = path.join(SCRATCH_DIR, 'thumb_raw_comp.png');
const ZOOM_CROP_PATH = path.join(SCRATCH_DIR, 'thumb_headline_zoom.png');

const FONT_DIR = path.join(ROOT, 'node_modules', '@fontsource', 'be-vietnam-pro', 'files');

function readFontDataUri(filename) {
  const buf = fs.readFileSync(path.join(FONT_DIR, filename));
  return `data:font/woff2;base64,${buf.toString('base64')}`;
}

function buildCleanFoliageBase() {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  const pyScript = `
import numpy as np
from PIL import Image, ImageFilter

orig = Image.open(r"${ORIG_THUMB.replace(/\\/g, '\\\\')}").convert("RGB")
w, h = orig.size
assert (w, h) == (941, 1672), f"Unexpected size {w}x{h}"

arr = np.array(orig, dtype=np.float32)

# Reconstruct garden bokeh background for y = 0..712 from clean upper & lower foliage strips
bg_canvas = Image.new("RGB", (w, 740))

# Top sunlit foliage strip (y=0..150) & lower garden foliage strip (y=668..735)
top_strip = orig.crop((0, 0, w, 155))
# Tile vertically with smooth flip so leaves & right-side palm trunks flow naturally
top_flip = top_strip.transpose(Image.FLIP_TOP_BOTTOM)
bot_strip = orig.crop((0, 668, w, 735))
bot_flip = bot_strip.transpose(Image.FLIP_TOP_BOTTOM)

bg_canvas.paste(top_strip, (0, 0))
bg_canvas.paste(top_flip, (0, 150))
bg_canvas.paste(top_strip, (0, 300))
bg_canvas.paste(top_flip, (0, 450))
bg_canvas.paste(bot_flip, (0, 585))
bg_canvas.paste(bot_strip, (0, 650))

# Blur slightly to eliminate hard tile seams and match natural bokeh
bg_blur = bg_canvas.filter(ImageFilter.GaussianBlur(radius=9))
bg_arr = np.array(bg_blur, dtype=np.float32)

# Build soft feathered alpha mask ONLY over the old headline + burst area
# Keep y >= 716 100% untouched, AND keep left curved white arrow (x <= 185, y >= 645) untouched!
mask = np.zeros((h, w), dtype=np.float32)
# Main old headline & brush area + top-right rays
mask[68:646, 20:926] = 1.0
# Lower-right area (around old laptop icon y=560..708, x=212..920) keeping arrow at x<190 safe
mask[635:706, 212:922] = 1.0

# Feather the mask smoothly
mask_img = Image.fromarray((mask * 255).astype(np.uint8), mode="L").filter(ImageFilter.GaussianBlur(radius=9))
mask_f = np.array(mask_img, dtype=np.float32) / 255.0

# Boost interior opacity so zero ghost residue peeks through while keeping outer edge feathered
mask_f = np.clip(mask_f * 1.15, 0.0, 1.0)

# Hard-clamp untouched lower zone (y >= 716) and arrow zone (x < 188 and y >= 646) to exact 0.0
mask_f[716:, :] = 0.0
mask_f[646:, :188] = 0.0
# Also keep top edge y < 56 100% original
mask_f[:56, :] = 0.0

out = arr.copy()
out[:740, :, :] = arr[:740, :, :] * (1.0 - mask_f[:740, :, None]) + bg_arr * mask_f[:740, :, None]
out_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), mode="RGB")
out_img.save(r"${CLEAN_BG_PATH.replace(/\\/g, '\\\\')}", format="PNG")
print("Clean foliage base saved.")
`;
  execFileSync('python', ['-c', pyScript], { stdio: 'inherit' });
}

function buildHtml(cleanBgDataUri) {
  const fontsCss = `
    @font-face {
      font-family: 'Be Vietnam Pro';
      font-style: normal;
      font-weight: 800;
      src: url('${readFontDataUri('be-vietnam-pro-latin-800-normal.woff2')}') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Be Vietnam Pro';
      font-style: normal;
      font-weight: 800;
      src: url('${readFontDataUri('be-vietnam-pro-vietnamese-800-normal.woff2')}') format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
    }
    @font-face {
      font-family: 'Be Vietnam Pro';
      font-style: italic;
      font-weight: 800;
      src: url('${readFontDataUri('be-vietnam-pro-latin-800-italic.woff2')}') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Be Vietnam Pro';
      font-style: italic;
      font-weight: 800;
      src: url('${readFontDataUri('be-vietnam-pro-vietnamese-800-italic.woff2')}') format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
    }
  `;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<style>
  ${fontsCss}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 941px; height: 1672px; overflow: hidden; background: transparent; }
  svg { display: block; width: 941px; height: 1672px; }
</style>
</head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 941 1672" width="941" height="1672">
  <defs>
    <filter id="dropShadow" x="-15%" y="-15%" width="130%" height="135%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#051734" flood-opacity="0.45"/>
    </filter>
    <filter id="softShadow" x="-15%" y="-15%" width="130%" height="135%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#04152E" flood-opacity="0.38"/>
    </filter>
    <linearGradient id="navyBadgeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#114692"/>
      <stop offset="55%" stop-color="#0C316B"/>
      <stop offset="100%" stop-color="#08234F"/>
    </linearGradient>
    <linearGradient id="goldTextGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE84D"/>
      <stop offset="60%" stop-color="#FFD014"/>
      <stop offset="100%" stop-color="#F5B301"/>
    </linearGradient>
  </defs>

  <!-- Base photo with clean foliage patch over headline region -->
  <image href="${cleanBgDataUri}" x="0" y="0" width="941" height="1672" />

  <!-- Top-right energetic yellow burst rays -->
  <g transform="translate(808, 128) rotate(-14)" filter="url(#softShadow)">
    <polygon points="0,38 14,-36 42,-28 16,42" fill="#FFD926" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="28,48 64,-18 88,0 40,56" fill="#FFD926" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="48,66 102,24 114,48 54,78" fill="#FFD926" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
  </g>

  <!-- Left energetic yellow burst rays -->
  <g transform="translate(88, 396) rotate(-10)" filter="url(#softShadow)">
    <polygon points="10,-10 -34,-34 -42,-16 4,4" fill="#FFD926" stroke="#FFFFFF" stroke-width="4.5" stroke-linejoin="round"/>
    <polygon points="4,10 -46,8 -48,26 4,22" fill="#FFD926" stroke="#FFFFFF" stroke-width="4.5" stroke-linejoin="round"/>
    <polygon points="10,28 -34,50 -24,66 18,38" fill="#FFD926" stroke="#FFFFFF" stroke-width="4.5" stroke-linejoin="round"/>
  </g>

  <!-- Main Graphic Headline Group (-2.2deg energetic tilt) -->
  <g transform="translate(470, 318) rotate(-2.2) translate(-470, -318)">
    <!-- Deep Navy Sticker Badge with White outer border & Gold inner trim -->
    <g filter="url(#dropShadow)">
      <rect x="108" y="168" width="760" height="278" rx="34" ry="34" fill="url(#navyBadgeGrad)" stroke="#FFFFFF" stroke-width="11"/>
      <rect x="116" y="176" width="744" height="262" rx="28" ry="28" fill="none" stroke="#F0C76D" stroke-width="4"/>
    </g>

    <!-- Line 1: TƯỞNG NGỒI CHƠI (pure Unicode Be Vietnam Pro 800, crisp white) -->
    <text x="502" y="264"
          text-anchor="middle"
          font-family="'Be Vietnam Pro', sans-serif"
          font-weight="800"
          font-style="italic"
          font-size="63"
          letter-spacing="1"
          fill="#FFFFFF"
          stroke="#061B3D"
          stroke-width="10"
          paint-order="stroke fill"
          stroke-linejoin="round">TƯỞNG NGỒI CHƠI</text>

    <!-- Line 2: ĐIỆN THOẠI? (pure Unicode Be Vietnam Pro 800, warm gold) -->
    <text x="495" y="388"
          text-anchor="middle"
          font-family="'Be Vietnam Pro', sans-serif"
          font-weight="800"
          font-style="italic"
          font-size="102"
          letter-spacing="1.5"
          fill="url(#goldTextGrad)"
          stroke="#061B3D"
          stroke-width="14"
          paint-order="stroke fill"
          stroke-linejoin="round">ĐIỆN THOẠI?</text>

    <!-- Smartphone vector sticker icon (top-left of badge) -->
    <g transform="translate(92, 260) rotate(-18)" filter="url(#softShadow)">
      <rect x="-36" y="-58" width="72" height="116" rx="14" fill="#0D356D" stroke="#FFFFFF" stroke-width="8"/>
      <rect x="-26" y="-44" width="52" height="80" rx="6" fill="#1764B0" stroke="#F0C76D" stroke-width="2.5"/>
      <rect x="-10" y="-52" width="20" height="4" rx="2" fill="#FFFFFF"/>
      <circle cx="0" cy="46" r="4.5" fill="#FFFFFF"/>
    </g>
  </g>

  <!-- Sub-banner: NHƯNG ĐANG LÀM CHUYỂN ĐỔI SỐ! -->
  <g transform="translate(470, 558) rotate(-2.2) translate(-470, -558)">
    <!-- Clean crisp tilted white banner plaque with soft shadow -->
    <g filter="url(#softShadow)">
      <path d="M 114,474 Q 470,464 844,474 C 858,475 864,484 862,498 L 854,616 C 852,630 842,636 828,636 Q 470,646 110,636 C 96,635 90,626 92,612 L 100,494 C 102,480 106,475 114,474 Z"
            fill="#FFFFFF" stroke="#F0C76D" stroke-width="3.5" stroke-linejoin="round"/>
    </g>

    <text x="466" y="528"
          text-anchor="middle"
          font-family="'Be Vietnam Pro', sans-serif"
          font-weight="800"
          font-style="italic"
          font-size="42"
          letter-spacing="0.6"
          fill="#C8102E">NHƯNG ĐANG LÀM</text>

    <text x="466" y="601"
          text-anchor="middle"
          font-family="'Be Vietnam Pro', sans-serif"
          font-weight="800"
          font-style="italic"
          font-size="55"
          letter-spacing="0.5"
          fill="#C8102E">CHUYỂN ĐỔI SỐ!</text>

    <!-- Red swooshing underline -->
    <path d="M 272,621 Q 466,612 664,619" fill="none" stroke="#C8102E" stroke-width="6" stroke-linecap="round"/>

    <!-- Laptop + Cloud icon bottom-right -->
    <g transform="translate(796, 622) rotate(5)" filter="url(#softShadow)">
      <!-- Sticker backdrop -->
      <path d="M -60,-18 L -48,-18 L -48,-46 C -48,-54 -42,-60 -34,-60 L 16,-60 C 18,-76 34,-86 50,-80 C 62,-76 68,-64 66,-52 C 76,-48 80,-36 74,-26 L 62,-18 L 62,22 L 74,40 C 76,44 72,50 66,50 L -62,50 C -68,50 -72,44 -70,40 L -56,22 Z"
            fill="#FFFFFF" stroke="#FFFFFF" stroke-width="10" stroke-linejoin="round"/>
      <!-- Laptop screen -->
      <rect x="-46" y="-44" width="92" height="58" rx="8" fill="#0D356D"/>
      <rect x="-38" y="-36" width="76" height="42" rx="4" fill="#1764B0"/>
      <!-- Bar chart inside screen -->
      <rect x="-24" y="-12" width="10" height="12" rx="2" fill="#FFFFFF"/>
      <rect x="-8" y="-22" width="10" height="22" rx="2" fill="#FFFFFF"/>
      <rect x="8" y="-28" width="10" height="28" rx="2" fill="#FFD926"/>
      <!-- Laptop base -->
      <polygon points="-50,18 50,18 64,40 -64,40" fill="#0D356D"/>
      <rect x="-18" y="25" width="36" height="5" rx="2.5" fill="#FFFFFF"/>
      <!-- Cloud upload badge -->
      <path d="M 18,-48 C 18,-62 32,-70 44,-64 C 54,-60 60,-48 56,-38 C 66,-34 68,-20 56,-14 L 16,-14 C 6,-16 6,-34 18,-40 Z"
            fill="#FFFFFF" stroke="#0D356D" stroke-width="5"/>
      <path d="M 35,-24 L 35,-46 M 26,-38 L 35,-48 L 44,-38" fill="none" stroke="#0D356D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Small right rays -->
      <polygon points="78,-10 108,-18 110,-6 80,-2" fill="#FFD926" stroke="#FFFFFF" stroke-width="3"/>
      <polygon points="80,8 114,14 110,26 78,16" fill="#FFD926" stroke="#FFFFFF" stroke-width="3"/>
      <polygon points="74,26 102,44 94,54 68,34" fill="#FFD926" stroke="#FFFFFF" stroke-width="3"/>
    </g>
  </g>
</svg>
</body>
</html>`;
}

async function main() {
  buildCleanFoliageBase();
  const cleanBgBuf = fs.readFileSync(CLEAN_BG_PATH);
  const cleanBgDataUri = `data:image/png;base64,${cleanBgBuf.toString('base64')}`;
  const html = buildHtml(cleanBgDataUri);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 941, height: 1672 }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: RAW_COMP_PATH, type: 'png' });
  } finally {
    await browser.close();
  }

  // Convert to strict sRGB RGB PNG, verify lower photo untouched, export 1080x1920 proportional + zoomed crop
  const pyPost = `
import numpy as np
from PIL import Image

orig = Image.open(r"${ORIG_THUMB.replace(/\\/g, '\\\\')}").convert("RGB")
comp = Image.open(r"${RAW_COMP_PATH.replace(/\\/g, '\\\\')}").convert("RGB")
assert comp.size == (941, 1672), f"Comp size mismatch: {comp.size}"

# Ensure lower photo (y >= 714) and arrow region (y >= 645, x < 192) are 100% pixel-identical to original
orig_arr = np.array(orig)
comp_arr = np.array(comp)
comp_arr[714:, :, :] = orig_arr[714:, :, :]
comp_arr[645:, :192, :] = orig_arr[645:, :192, :]

final_941 = Image.fromarray(comp_arr, mode="RGB")
final_941.save(r"${OUT_941.replace(/\\/g, '\\\\')}", format="PNG", optimize=True)
final_941.save(r"${PUB_941.replace(/\\/g, '\\\\')}", format="PNG", optimize=True)

# Verify lower face/photo diff
diff_lower = np.max(np.abs(orig_arr[725:, :, :].astype(int) - np.array(final_941)[725:, :, :].astype(int)))
print(f"Lower photo (y>=725) max RGB diff: {diff_lower}")

# Proportional scale to 1080x1920 without face stretching (941:1672 -> 1081:1920 -> 1px center crop to 1080x1920)
scaled_w = round(941 * 1920 / 1672)
scaled = final_941.resize((scaled_w, 1920), Image.Resampling.LANCZOS)
left = (scaled_w - 1080) // 2
final_1080 = scaled.crop((left, 0, left + 1080, 1920)).convert("RGB")
final_1080.save(r"${OUT_1080.replace(/\\/g, '\\\\')}", format="PNG", optimize=True)
final_1080.save(r"${PUB_1080.replace(/\\/g, '\\\\')}", format="PNG", optimize=True)

# Zoom crop of TƯỞNG NGỒI CHƠI ĐIỆN THOẠI? for visual verification
zoom = final_941.crop((40, 130, 910, 680))
zoom.save(r"${ZOOM_CROP_PATH.replace(/\\/g, '\\\\')}", format="PNG")
print("Saved all thumbnail outputs.")
`;
  execFileSync('python', ['-c', pyPost], { stdio: 'inherit' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
