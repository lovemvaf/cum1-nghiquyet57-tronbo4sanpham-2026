#!/usr/bin/env node
/**
 * Strict QA Suite for Product 1 (Video, Subtitles VTT, Thumbnails)
 * and Product 2 (05 Posters V2, Editable SVGs, 01..05 Aliases, QR Pixel Decode)
 *
 * Run: npm run qa:media-posters
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const VIDEO_DIR = path.join(ROOT, 'deliverables', '01_Video');
const PUB_VIDEO_DIR = path.join(ROOT, 'public', 'assets', 'video');
const DESIGN_DIR = path.join(ROOT, 'deliverables', '02_ThietKe');
const PUB_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');

const EXPECTED_QR_URL =
  'https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm';

const EXPECTED_EMBLEM_SHA256 =
  'a6f768702ee40feda5ace6360cfcf036523a2708b972c9cfa3138a86c1d92078';

const BANNED_TOKENS = [
  '20/11',
  'DNTU',
  'TBD',
  '[TBD]',
  'Lorem',
  '{{',
  '}}',
  'Nhà giáo',
  'Nét vẽ tri ân',
  'Cô Liệu',
  'Cô Ngọc',
];

const POSTER_MAP = [
  { id: 1, file: '01_dat_cau_hoi_1080x1350.png', alias: '01.png', svg: '01.svg' },
  { id: 2, file: '02_quan_diem_cot_loi_1080x1350.png', alias: '02.png', svg: '02.svg' },
  { id: 3, file: '03_muc_tieu_2030_tam_nhin_2045_1080x1350.png', alias: '03.png', svg: '03.svg' },
  { id: 4, file: '04_thanh_nien_cum1_hanh_dong_1080x1350.png', alias: '04.png', svg: '04.svg' },
  { id: 5, file: '05_lan_toa_1080x1350.png', alias: '05.png', svg: '05.svg' },
];

let passed = 0;
let failed = 0;

function check(label, ok, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`  PASS  ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failed += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function ffprobeJson(filePath) {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', filePath],
    { encoding: 'utf8' }
  );
  return JSON.parse(out);
}

function inspectPng(filePath) {
  const py = [
    'import json, sys',
    'from PIL import Image',
    'im = Image.open(sys.argv[1])',
    'print(json.dumps({"width": im.width, "height": im.height, "mode": im.mode}))',
  ].join('; ');
  return JSON.parse(execFileSync('python', ['-c', py, filePath], { encoding: 'utf8' }).trim());
}

function checkLowerPhotoUntouched(origPath, fixedPath, minY = 725) {
  const py = [
    'import sys, numpy as np',
    'from PIL import Image',
    'a = np.array(Image.open(sys.argv[1]).convert("RGB"), dtype=int)',
    'b = np.array(Image.open(sys.argv[2]).convert("RGB"), dtype=int)',
    `print(int(np.max(np.abs(a[${minY}:] - b[${minY}:]))))`,
  ].join('; ');
  return Number(execFileSync('python', ['-c', py, origPath, fixedPath], { encoding: 'utf8' }).trim());
}

function extractRgbaBytes(filePath) {
  const py = [
    'import sys',
    'from PIL import Image',
    'im = Image.open(sys.argv[1]).convert("RGBA")',
    'sys.stdout.buffer.write(im.tobytes())',
  ].join('; ');
  return execFileSync('python', ['-c', py, filePath], { maxBuffer: 16 * 1024 * 1024 });
}

function parseVttSeconds(ts) {
  const parts = ts.trim().split(':');
  if (parts.length === 3) {
    return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
  }
  if (parts.length === 2) {
    return Number(parts[0]) * 60 + Number(parts[1]);
  }
  return Number.NaN;
}

function stripSvgMarkup(svgContent) {
  const noData = svgContent.replace(/data:[^"']+/g, '');
  const noStyle = noData.replace(/<style[\s\S]*?<\/style>/g, '');
  return [...noStyle.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
    .map((m) =>
      m[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .join(' | ');
}

function checkNoBanned(label, text) {
  const hits = BANNED_TOKENS.filter((tok) => text.toLowerCase().includes(tok.toLowerCase()));
  check(`${label} — zero banned tokens`, hits.length === 0, hits.join(', '));
}

function verifyProduct1() {
  console.log('\n=== PRODUCT 1: VIDEO, SUBTITLES VTT & THUMBNAILS ===');

  const origMp4 = path.join(VIDEO_DIR, '1_Doi1_ChuDe1_GOC.mp4');
  const webMp4 = path.join(VIDEO_DIR, 'video-web-optimized.mp4');
  const pubMp4 = path.join(PUB_VIDEO_DIR, 'video-web-optimized.mp4');

  check('Original video exists', fs.existsSync(origMp4));
  check('Web video exists in deliverables', fs.existsSync(webMp4));
  check('Web video exists in public/assets/video', fs.existsSync(pubMp4));

  if (fs.existsSync(origMp4) && fs.existsSync(webMp4) && fs.existsSync(pubMp4)) {
    const webStat = fs.statSync(webMp4);
    check('Web video byte-identical in public mirror', sha256File(webMp4) === sha256File(pubMp4));
    check(
      'Web video size under 35 MB (ideal web streaming)',
      webStat.size > 1024 * 1024 && webStat.size < 35 * 1024 * 1024,
      `${(webStat.size / (1024 * 1024)).toFixed(2)} MB`
    );

    const origProbe = ffprobeJson(origMp4);
    const webProbe = ffprobeJson(webMp4);
    const vStream = webProbe.streams.find((s) => s.codec_type === 'video');
    const aStream = webProbe.streams.find((s) => s.codec_type === 'audio');
    const origDur = Number(origProbe.format.duration);
    const webDur = Number(webProbe.format.duration);

    check('Web video stream is H.264 720x1280 (9:16)', vStream?.codec_name === 'h264' && vStream.width === 720 && vStream.height === 1280, `${vStream?.width}x${vStream?.height}`);
    check('Web audio stream is AAC 44100 Hz', aStream?.codec_name === 'aac' && Number(aStream.sample_rate) === 44100, `${aStream?.codec_name} ${aStream?.sample_rate}Hz`);
    check('Duration preserved within 0.2s of original', Math.abs(origDur - webDur) < 0.2, `orig=${origDur.toFixed(3)}s web=${webDur.toFixed(3)}s`);
  }

  // Subtitles VTT
  const vttPath = path.join(VIDEO_DIR, 'subtitles_vi.vtt');
  const pubVttPath = path.join(PUB_VIDEO_DIR, 'subtitles_vi.vtt');
  check('subtitles_vi.vtt exists in deliverables', fs.existsSync(vttPath));
  check('subtitles_vi.vtt exists in public mirror', fs.existsSync(pubVttPath));

  if (fs.existsSync(vttPath) && fs.existsSync(pubVttPath)) {
    const vttRaw = fs.readFileSync(vttPath, 'utf8');
    check('subtitles_vi.vtt byte-identical in public mirror', sha256File(vttPath) === sha256File(pubVttPath));
    check('subtitles_vi.vtt starts with WEBVTT', vttRaw.startsWith('WEBVTT'));

    const blocks = vttRaw.trim().split(/\r?\n\r?\n/).slice(1);
    let prevEnd = -1;
    let validOrder = true;
    let validText = true;
    for (const block of blocks) {
      const lines = block.split(/\r?\n/).filter(Boolean);
      const timingLine = lines.find((l) => l.includes('-->'));
      if (!timingLine) {
        validOrder = false;
        continue;
      }
      const [sRaw, eRaw] = timingLine.split('-->');
      const start = parseVttSeconds(sRaw);
      const end = parseVttSeconds(eRaw);
      if (Number.isNaN(start) || Number.isNaN(end) || start >= end || start < prevEnd || end > 101.5) {
        validOrder = false;
      }
      prevEnd = end;
      const cueText = lines.slice(lines.indexOf(timingLine) + 1).join(' ').trim();
      if (!cueText) validText = false;
    }
    check('subtitles_vi.vtt has >= 15 valid non-overlapping cues <= 101.5s', blocks.length >= 15 && validOrder && validText, `${blocks.length} cues`);
    check('subtitles_vi.vtt has NO invented 2030/2045 lines', !vttRaw.includes('2030') && !vttRaw.includes('2045'));
    checkNoBanned('subtitles_vi.vtt', vttRaw);
  }

  // Thumbnails
  const origThumb = path.join(VIDEO_DIR, '1.1_Doi1_ChuDe1_THUMB_GOC.png');
  const thumb941 = path.join(VIDEO_DIR, 'thumbnail-chu-dung.png');
  const pubThumb941 = path.join(PUB_VIDEO_DIR, 'thumbnail-chu-dung.png');
  const thumb1080 = path.join(VIDEO_DIR, 'thumbnail-chu-dung-1080x1920.png');
  const pubThumb1080 = path.join(PUB_VIDEO_DIR, 'thumbnail-chu-dung-1080x1920.png');

  for (const [label, a, b, w, h] of [
    ['thumbnail-chu-dung.png (941x1672)', thumb941, pubThumb941, 941, 1672],
    ['thumbnail-chu-dung-1080x1920.png (1080x1920)', thumb1080, pubThumb1080, 1080, 1920],
  ]) {
    check(`${label} exists in deliverables & public`, fs.existsSync(a) && fs.existsSync(b));
    if (fs.existsSync(a) && fs.existsSync(b)) {
      check(`${label} byte-identical in public mirror`, sha256File(a) === sha256File(b));
      const info = inspectPng(a);
      check(`${label} dimensions & RGB mode`, info.width === w && info.height === h && info.mode === 'RGB', `${info.width}x${info.height} ${info.mode}`);
    }
  }
  if (fs.existsSync(origThumb) && fs.existsSync(thumb941)) {
    const diff = checkLowerPhotoUntouched(origThumb, thumb941, 725);
    check('thumbnail-chu-dung.png lower photo (y>=725) 0px diff vs original', diff === 0, `max_diff=${diff}`);
    const ratioDelta = Math.abs(941 / 1672 - 1080 / 1920);
    check('thumbnail-chu-dung-1080x1920.png proportional 9:16 (no face stretching)', ratioDelta < 0.001, `aspect_delta=${ratioDelta.toFixed(6)}`);
  }
}

function verifyProduct2() {
  console.log('\n=== PRODUCT 2: 05 POSTERS V2, ALIASES, SVGs & QR ===');

  const delivEmblem = path.join(DESIGN_DIR, 'identity', 'derived', 'huy-hieu-doan-clean.png');
  const pubEmblem = path.join(ROOT, 'public', 'assets', 'identity', 'derived', 'huy-hieu-doan-clean.png');
  check('Đoàn emblem exists in deliverables & public', fs.existsSync(delivEmblem) && fs.existsSync(pubEmblem));
  if (fs.existsSync(delivEmblem) && fs.existsSync(pubEmblem)) {
    const h1 = sha256File(delivEmblem);
    const h2 = sha256File(pubEmblem);
    check('Untouched Đoàn emblem SHA-256 matches golden hash', h1 === EXPECTED_EMBLEM_SHA256 && h1 === h2, h1.slice(0, 16));
  }

  const sheet = path.join(DESIGN_DIR, 'CONTACT_SHEET.png');
  check('CONTACT_SHEET.png exists (1920x1080 RGB)', fs.existsSync(sheet));
  if (fs.existsSync(sheet)) {
    const info = inspectPng(sheet);
    check('CONTACT_SHEET dimensions & RGB mode', info.width === 1920 && info.height === 1080 && info.mode === 'RGB', `${info.width}x${info.height}`);
  }

  const configPath = path.join(DESIGN_DIR, 'campaign.config.json');
  if (fs.existsSync(configPath)) {
    checkNoBanned('campaign.config.json', fs.readFileSync(configPath, 'utf8'));
  }

  for (const p of POSTER_MAP) {
    const dMain = path.join(DESIGN_DIR, p.file);
    const dAlias = path.join(DESIGN_DIR, p.alias);
    const pMain = path.join(PUB_POSTERS_DIR, p.file);
    const pAlias = path.join(PUB_POSTERS_DIR, p.alias);
    const svgPath = path.join(DESIGN_DIR, 'editable', p.svg);

    console.log(`\n[Poster 0${p.id}] ${p.file} / ${p.alias}`);
    check('All 4 PNG copies exist (deliverables + public, main + alias)', fs.existsSync(dMain) && fs.existsSync(dAlias) && fs.existsSync(pMain) && fs.existsSync(pAlias));

    if (fs.existsSync(dMain) && fs.existsSync(dAlias) && fs.existsSync(pMain) && fs.existsSync(pAlias)) {
      const h = sha256File(dMain);
      check('All 4 PNG copies byte-identical', h === sha256File(dAlias) && h === sha256File(pMain) && h === sha256File(pAlias));
      const stat = fs.statSync(dMain);
      const info = inspectPng(dMain);
      check('PNG size > 100KB & 1080x1350 RGB', stat.size > 102400 && info.width === 1080 && info.height === 1350 && info.mode === 'RGB', `${stat.size.toLocaleString()} B, ${info.width}x${info.height} ${info.mode}`);
    }

    check(`Editable SVG exists (${p.svg})`, fs.existsSync(svgPath));
    if (fs.existsSync(svgPath)) {
      const svg = fs.readFileSync(svgPath, 'utf8');
      check('SVG viewBox="0 0 1080 1350" & Be Vietnam Pro WOFF2', svg.includes('viewBox="0 0 1080 1350"') && svg.includes('Be Vietnam Pro') && svg.includes('data:font/woff2;base64,'));
      const visibleText = stripSvgMarkup(svg);
      checkNoBanned(p.svg, svg.replace(/data:[^"']+/g, ''));

      if (p.id === 3) {
        for (const tok of ['2030', '2045', '30%', '80%', '50%', 'TOP 30', 'KHÔNG PHẢI KẾT QUẢ HIỆN TẠI']) {
          check(`Poster 03 SVG contains "${tok}"`, visibleText.includes(tok));
        }
      }
      if (p.id === 4) {
        for (const tok of ['Cụm 1', 'HỌC KỸ NĂNG SỐ', 'HỖ TRỢ NGƯỜI DÂN', 'ỨNG DỤNG TRONG CÔNG TÁC ĐOÀN', 'SÁNG TẠO GIẢI PHÁP', 'AN TOÀN THÔNG TIN']) {
          check(`Poster 04 SVG contains "${tok}"`, visibleText.includes(tok));
        }
      }
    }

    if (p.id === 5 && fs.existsSync(dAlias)) {
      const rgba = extractRgbaBytes(dAlias);
      const decoded = jsQR(new Uint8ClampedArray(rgba), 1080, 1350);
      check('jsQR pixel decode of Poster 05 (05.png) succeeds', Boolean(decoded) && decoded.data === EXPECTED_QR_URL, decoded ? decoded.data : 'null');
    }
  }
}

function main() {
  verifyProduct1();
  verifyProduct2();
  console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
