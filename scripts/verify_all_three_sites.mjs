import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const V3_URL = 'https://lovemvaf.github.io/cum1-nghiquyet57-tronbo4sanpham-2026/';
const V2_URL = 'https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/';
const V10_URL = 'https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'qa', 'SCREENSHOTS');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const BANNED_20_11 = [
  'Nét vẽ tri ân',
  'Nhà giáo',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
  '20/11',
  'DNTU',
];

const CLUTTER_TOKENS = [
  '101,45s',
  '≤ 3tr',
  'Nhịp 04:00',
  'đã kiểm chứng dữ liệu',
  'DRAFT_PENDING_TEAM_DETAILS',
  'UNVERIFIED',
  'CHỜ NHÓM CHỐT',
  'NQ57-03',
  'TM-01',
  '.docx',
  '.pdf',
  '.vtt',
  '.mp4',
  '.svg',
  'PDF/DOCX',
  'thành phố Đồng Nai',
];

const V2_POSTERS = [
  '01_dat_cau_hoi_1080x1350.png',
  '02_quan_diem_cot_loi_1080x1350.png',
  '03_muc_tieu_2030_tam_nhin_2045_1080x1350.png',
  '04_thanh_nien_cum1_hanh_dong_1080x1350.png',
  '05_lan_toa_1080x1350.png',
];

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`ASSERTION FAILED: ${msg}`);
  }
}

async function saveShot(page, name) {
  const out = path.join(SCREENSHOT_DIR, name);
  await page.screenshot({ path: out, fullPage: false });
  return out;
}

async function waitForStage(page, targetStage) {
  await page.waitForFunction(
    (s) => {
      const api = window.__LHS_DECK__;
      if (!api) return false;
      const st = api.getState();
      return st.stage === s && !st.isTransitioning;
    },
    targetStage,
    { timeout: 15000 }
  );
  await page.waitForTimeout(500);
}

async function verifyV3Site(browser) {
  console.log(`\n=== [SITE 1/3] NEW V3 4-Product Showcase: ${V3_URL} ===`);
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) => {
    const errText = req.failure()?.errorText || '';
    if (errText.includes('ERR_ABORTED')) return;
    failedRequests.push(`${req.url()} (${errText})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) httpErrors.push(`${res.status()} ${res.url()}`);
  });

  const resp = await page.goto(`${V3_URL}?v=${Date.now()}`, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  assert(resp && resp.status() === 200, `V3 expected HTTP 200, got ${resp?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await waitForStage(page, 0);

  const landing = await page.evaluate(({ banned, clutter }) => {
    const emblem = document.getElementById('header-emblem-img');
    const title = document.getElementById('landing-title')?.textContent || '';
    const railPills = document.querySelectorAll('.landing-story-rail .story-rail-pill').length;
    const fanCards = Array.from(document.querySelectorAll('.landing-showcase-fan .landing-showcase-card'));
    const fanCardsOk =
      fanCards.length === 3 &&
      fanCards.every((card) => {
        const img = card.querySelector('img');
        return Boolean(img && img.complete && img.naturalWidth > 0);
      });
    const debugCount = document.querySelectorAll('[id*="vfx"], [id*="debug"], [id*="showcase"]').length;
    const audioCount = document.querySelectorAll('audio').length;
    const text = document.body.innerText || '';
    const bannedHits = banned.filter((t) => text.toLowerCase().includes(t.toLowerCase()));
    const clutterHits = clutter.filter((t) => text.toLowerCase().includes(t.toLowerCase()));
    const vfx = window.__LHS_DECK__?.getVfxMetrics?.() || null;
    return {
      title,
      railPills,
      fanCardsCount: fanCards.length,
      fanCardsOk,
      emblemOk: Boolean(emblem && emblem.complete && emblem.naturalWidth > 0),
      debugCount,
      audioCount,
      bannedHits,
      clutterHits,
      vfx,
    };
  }, { banned: BANNED_20_11, clutter: CLUTTER_TOKENS });

  assert(landing.title.includes('NGHỊ QUYẾT 57'), `V3 landing title unexpected: ${landing.title}`);
  assert(landing.railPills === 4, `V3 landing expected 4 story rail pills, got ${landing.railPills}`);
  assert(landing.fanCardsCount === 3 && landing.fanCardsOk, `V3 showcase fan invalid: ${landing.fanCardsCount}`);
  assert(landing.emblemOk, 'V3 emblem did not load');
  assert(landing.debugCount === 0 && landing.audioCount === 0, 'V3 purity check failed');
  assert(landing.bannedHits.length === 0, `V3 banned 20/11 hits: ${landing.bannedHits.join(', ')}`);
  assert(landing.clutterHits.length === 0, `V3 clutter hits: ${landing.clutterHits.join(', ')}`);
  assert(
    landing.vfx &&
      landing.vfx.isPaused === false &&
      landing.vfx.totalBirds >= 8 &&
      landing.vfx.flocksCount >= 3 &&
      landing.vfx.motesCount >= 40,
    `V3 VFX metrics unexpected: ${JSON.stringify(landing.vfx)}`
  );
  console.log(`  PASS Stage 0 Landing -> ${await saveShot(page, 'live_v3_landing.png')}`);

  // Stage 1: Video (101.4s, fixed thumb, VTT)
  await page.click('#btn-start');
  await waitForStage(page, 1);
  await page.waitForFunction(() => {
    const v = document.getElementById('campaign-video');
    return v && v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 100;
  }, { timeout: 30000 });

  const videoInfo = await page.evaluate(() => {
    const v = document.getElementById('campaign-video');
    const track = document.getElementById('video-vtt-track');
    const poster = v?.getAttribute('poster') || '';
    const im = new Image();
    im.src = poster;
    return new Promise((resolve) => {
      const done = () =>
        resolve({
          duration: v.duration,
          poster,
          thumbW: im.naturalWidth,
          thumbH: im.naturalHeight,
          vttSrc: track?.getAttribute('src') || '',
        });
      if (im.complete) done();
      else im.onload = done;
    });
  });

  assert(videoInfo.duration >= 100.5 && videoInfo.duration <= 102.5, `V3 video duration ${videoInfo.duration}`);
  assert(videoInfo.poster.includes('thumbnail-chu-dung-1080x1920.png'), 'V3 fixed thumb path mismatch');
  assert(videoInfo.thumbW === 1080 && videoInfo.thumbH === 1920, `V3 thumb dims ${videoInfo.thumbW}x${videoInfo.thumbH}`);
  assert(videoInfo.vttSrc.includes('subtitles_vi.vtt'), 'V3 VTT track missing');
  console.log(
    `  PASS Stage 1 Video (dur=${videoInfo.duration.toFixed(2)}s, thumb=${videoInfo.thumbW}x${videoInfo.thumbH}, VTT) -> ${await saveShot(page, 'live_v3_video.png')}`
  );

  // Stages 2..6: 5 Posters 1080x1350
  for (let idx = 0; idx < 5; idx++) {
    const targetStage = idx + 2;
    await page.keyboard.press('ArrowRight');
    await waitForStage(page, targetStage);
    const p = await page.evaluate(() => {
      const img = document.getElementById('poster-stage-img');
      const policy = document.getElementById('panel-policy-highlights');
      return {
        src: img?.getAttribute('src') || '',
        complete: Boolean(img?.complete),
        w: img?.naturalWidth || 0,
        h: img?.naturalHeight || 0,
        policyVisible: Boolean(policy && !policy.hidden),
        policyText: policy?.innerText || '',
      };
    });
    assert(p.src.includes(V2_POSTERS[idx]), `V3 poster ${idx + 1} expected ${V2_POSTERS[idx]}, got ${p.src}`);
    assert(p.complete && p.w === 1080 && p.h === 1350, `V3 poster ${idx + 1} dims ${p.w}x${p.h}`);
    if (targetStage === 4) {
      assert(p.policyVisible && p.policyText.includes('2030') && p.policyText.includes('2045'), 'V3 Stage 4 2030/2045 missing');
      console.log(`  PASS Stage 4 Poster 03/05 (1080x1350 + 2030/2045) -> ${await saveShot(page, 'live_v3_poster03.png')}`);
    } else {
      console.log(`  PASS Stage ${targetStage} Poster 0${idx + 1}/05 (${p.w}x${p.h})`);
    }
  }

  // Stage 7: Social Card
  await page.keyboard.press('ArrowRight');
  await waitForStage(page, 7);
  const socialHeadline = await page.locator('#social-headline').textContent();
  assert(socialHeadline?.includes('Chuyển đổi số'), `V3 social headline unexpected: ${socialHeadline}`);
  console.log(`  PASS Stage 7 Social Post -> ${await saveShot(page, 'live_v3_social.png')}`);

  // Stage 8: Thuyet minh 4 cards + Downloads modal PDF HTTP 200 (closed before screenshot)
  await page.keyboard.press('ArrowRight');
  await waitForStage(page, 8);
  const presCount = await page.locator('#pres-cards-grid .pres-card').count();
  assert(presCount === 4, `V3 expected 4 presentation cards, got ${presCount}`);
  await page.click('#btn-pres-downloads');
  await page.waitForSelector('#downloads-modal:not([hidden])');
  const pdfCheck = await page.evaluate(async () => {
    const link = document.querySelector('#downloads-modal a[href*="THUYET_MINH_CUM1_CHUDE1.pdf"]');
    const href = link?.getAttribute('href') || '';
    if (!href) return { href: '', status: 0, bytes: 0 };
    const r = await fetch(href);
    const buf = await r.arrayBuffer();
    return { href, status: r.status, bytes: buf.byteLength };
  });
  assert(pdfCheck.status === 200 && pdfCheck.bytes > 50000, `V3 PDF fetch failed: ${JSON.stringify(pdfCheck)}`);
  await page.keyboard.press('Escape');
  await page.waitForSelector('#downloads-modal[hidden]', { state: 'attached' });
  await page.waitForTimeout(200);
  console.log(
    `  PASS Stage 8 Thuyết minh (4 cards + PDF HTTP 200, ${pdfCheck.bytes} B) -> ${await saveShot(page, 'live_v3_thuyet_minh.png')}`
  );

  // Stage 9: Finale QR SVG + chinhphu.vn + mst.gov.vn
  await page.keyboard.press('ArrowRight');
  await waitForStage(page, 9);
  const finale = await page.evaluate((banned) => {
    const qrSvg = document.querySelector('#finale-qr-box svg');
    const primary = document.getElementById('btn-finale-official')?.getAttribute('href') || '';
    const secondary = document.getElementById('btn-finale-secondary-official')?.getAttribute('href') || '';
    const text = document.body.innerText || '';
    return {
      hasQr: Boolean(qrSvg && qrSvg.getBoundingClientRect().width > 40),
      primary,
      secondary,
      bannedHits: banned.filter((t) => text.toLowerCase().includes(t.toLowerCase())),
    };
  }, BANNED_20_11);
  assert(finale.hasQr, 'V3 Finale QR SVG missing');
  assert(finale.primary.includes('chinhphu.vn'), 'V3 Finale chinhphu.vn link missing');
  assert(finale.secondary.includes('mst.gov.vn'), 'V3 Finale mst.gov.vn link missing');
  assert(finale.bannedHits.length === 0, `V3 Finale banned hits: ${finale.bannedHits.join(', ')}`);
  console.log(`  PASS Stage 9 Finale (QR SVG + chinhphu.vn + mst.gov.vn) -> ${await saveShot(page, 'live_v3_finale.png')}`);

  assert(consoleErrors.length === 0, `V3 console errors: ${consoleErrors.join(' | ')}`);
  assert(pageErrors.length === 0, `V3 page errors: ${pageErrors.join(' | ')}`);
  assert(failedRequests.length === 0, `V3 failed requests: ${failedRequests.join(' | ')}`);
  assert(httpErrors.length === 0, `V3 HTTP errors: ${httpErrors.join(' | ')}`);

  await context.close();
}

async function verifyLegacyV2Site(browser) {
  console.log(`\n=== [SITE 2/3] Legacy V2 Lạc Hồng Số: ${V2_URL} ===`);
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const resp = await page.goto(`${V2_URL}?v=${Date.now()}`, {
    waitUntil: 'networkidle',
    timeout: 45000,
  });
  assert(resp && resp.status() === 200, `V2 expected HTTP 200, got ${resp?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await waitForStage(page, 0);

  const beatImgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#landing-beats .beat-card img')).map((i) => ({
      src: i.getAttribute('src') || '',
      ok: i.complete && i.naturalWidth > 0,
    }))
  );
  assert(beatImgs.length === 5, `V2 expected 5 landing beat images, got ${beatImgs.length}`);
  V2_POSTERS.forEach((fname, idx) => {
    assert(beatImgs[idx].src.includes(fname) && beatImgs[idx].ok, `V2 beat ${idx + 1} broken: ${beatImgs[idx].src}`);
  });
  console.log(`  PASS V2 Landing (5 posters intact) -> ${await saveShot(page, 'live_v2_lhs_landing.png')}`);

  await page.evaluate(() => window.__LHS_DECK__.goToStage(3));
  await waitForStage(page, 3);
  const s3 = await page.evaluate(() => {
    const img = document.getElementById('poster-stage-img');
    const policy = document.getElementById('panel-policy-highlights')?.innerText || '';
    return {
      w: img?.naturalWidth || 0,
      h: img?.naturalHeight || 0,
      has2030: policy.includes('2030'),
      has2045: policy.includes('2045'),
    };
  });
  assert(s3.w === 1080 && s3.h === 1350 && s3.has2030 && s3.has2045, `V2 Stage 3 failed: ${JSON.stringify(s3)}`);
  console.log(`  PASS V2 Stage 3 (1080x1350 + 2030/2045 intact) -> ${await saveShot(page, 'live_v2_lhs_scene03.png')}`);

  await context.close();
}

async function verifyLegacyV10Site(browser) {
  console.log(`\n=== [SITE 3/3] Legacy V10 Nét Vẽ Tri Ân: ${V10_URL} ===`);
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const resp = await page.goto(`${V10_URL}?v=${Date.now()}`, {
    waitUntil: 'networkidle',
    timeout: 45000,
  });
  assert(resp && resp.status() === 200, `V10 expected HTTP 200, got ${resp?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1400);

  const info = await page.evaluate(() => {
    const posterImg = document.getElementById('landing-full-poster-img');
    const bodyText = document.body.innerText || '';
    return {
      title: document.title,
      hasLandingPage: Boolean(document.getElementById('landing-page')),
      has2011: bodyText.includes('20/11') || bodyText.includes('NÉT VẼ TRI ÂN'),
      hasLacHong: bodyText.includes('LẠC HỒNG SỐ') || bodyText.includes('Nghị quyết 57'),
      posterOk: Boolean(posterImg && posterImg.complete && posterImg.naturalWidth > 0),
      posterW: posterImg?.naturalWidth || 0,
      posterH: posterImg?.naturalHeight || 0,
    };
  });

  assert(info.hasLandingPage && info.has2011, `V10 missing 20/11 / NÉT VẼ TRI ÂN: ${JSON.stringify(info)}`);
  assert(!info.hasLacHong, 'V10 was overwritten with Lạc Hồng Số!');
  assert(info.posterOk, `V10 poster failed (${info.posterW}x${info.posterH})`);
  console.log(
    `  PASS V10 Net ve tri an (${info.title}, poster ${info.posterW}x${info.posterH}) -> ${await saveShot(page, 'live_v10_netvetrian.png')}`
  );

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    await verifyV3Site(browser);
    await verifyLegacyV2Site(browser);
    await verifyLegacyV10Site(browser);
    console.log('\nALL 3 LIVE SITES PASSED VERIFICATION!');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n3-SITE LIVE VERIFICATION FAILED:', err);
  process.exit(1);
});
