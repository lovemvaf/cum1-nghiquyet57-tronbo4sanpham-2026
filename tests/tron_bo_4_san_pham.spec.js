import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://127.0.0.1:5175/cum1-nghiquyet57-tronbo4sanpham-2026/';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'qa', 'SCREENSHOTS');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const BANNED_TOKENS = [
  '20/11',
  'DNTU',
  'Nhà giáo',
  'Nét vẽ tri ân',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
];

const POSTER_CHECKS = [
  { stage: 2, id: 1, file: '01_dat_cau_hoi_1080x1350.png', alias: '01.png', badge: '01 / 05' },
  { stage: 3, id: 2, file: '02_quan_diem_cot_loi_1080x1350.png', alias: '02.png', badge: '02 / 05' },
  { stage: 4, id: 3, file: '03_muc_tieu_2030_tam_nhin_2045_1080x1350.png', alias: '03.png', badge: '03 / 05' },
  { stage: 5, id: 4, file: '04_thanh_nien_cum1_hanh_dong_1080x1350.png', alias: '04.png', badge: '04 / 05' },
  { stage: 6, id: 5, file: '05_lan_toa_1080x1350.png', alias: '05.png', badge: '05 / 05' },
];

const DOWNLOADABLE_ASSETS = [
  'assets/downloads/BAI_DANG_CUM1_HOAN_CHINH.docx',
  'assets/downloads/MOCKUP_BAI_DANG.png',
  'assets/downloads/THUYET_MINH_CUM1_CHUDE1.docx',
  'assets/downloads/THUYET_MINH_CUM1_CHUDE1.pdf',
  'assets/downloads/LOI_THUYET_TRINH_04_PHUT_CUM1_NQ57.docx',
  'assets/posters/01.png',
  'assets/posters/02.png',
  'assets/posters/03.png',
  'assets/posters/04.png',
  'assets/posters/05.png',
  'assets/posters/01_dat_cau_hoi_1080x1350.png',
  'assets/posters/02_quan_diem_cot_loi_1080x1350.png',
  'assets/posters/03_muc_tieu_2030_tam_nhin_2045_1080x1350.png',
  'assets/posters/04_thanh_nien_cum1_hanh_dong_1080x1350.png',
  'assets/posters/05_lan_toa_1080x1350.png',
  'assets/video/video-web-optimized.mp4',
  'assets/video/subtitles_vi.vtt',
  'assets/video/thumbnail-chu-dung-1080x1920.png',
];

function attachNetworkAndConsoleGuards(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  const externalRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });
  page.on('request', (req) => {
    const url = req.url();
    if (
      !url.startsWith('http://127.0.0.1:') &&
      !url.startsWith('http://localhost:') &&
      !url.startsWith('data:') &&
      !url.startsWith('blob:')
    ) {
      externalRequests.push(url);
    }
  });
  page.on('requestfailed', (req) => {
    // Aborted media range requests when navigating away from video are normal browser behavior
    const failure = req.failure()?.errorText || '';
    if (failure.includes('ERR_ABORTED')) return;
    failedRequests.push(`${req.url()} (${failure})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      httpErrors.push(`${res.status()} ${res.url()}`);
    }
  });

  return {
    assertClean(contextLabel) {
      expect(consoleErrors, `${contextLabel} console.error`).toEqual([]);
      expect(pageErrors, `${contextLabel} pageerror`).toEqual([]);
      expect(failedRequests, `${contextLabel} requestfailed`).toEqual([]);
      expect(httpErrors, `${contextLabel} HTTP >= 400`).toEqual([]);
      expect(externalRequests, `${contextLabel} external CDN requests`).toEqual([]);
    },
  };
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
  await page.waitForTimeout(450);
}

async function checkPurityAndEmblem(page, label) {
  const info = await page.evaluate((banned) => {
    const emblem = document.getElementById('header-emblem-img');
    const emblemRect = emblem?.getBoundingClientRect();
    const audioCount = document.querySelectorAll('audio').length;
    const debugCount = document.querySelectorAll(
      '[id*="vfx"], [id*="debug"], [id*="showcase"], [class*="debug"]'
    ).length;
    const bodyText = (document.body.innerText || '') + '\n' + (document.title || '');
    const bannedHits = banned.filter((tok) => bodyText.toLowerCase().includes(tok.toLowerCase()));
    return {
      emblemSrc: emblem?.getAttribute('src') || '',
      emblemComplete: Boolean(emblem && emblem.complete && emblem.naturalWidth > 0),
      emblemVisible: Boolean(
        emblemRect &&
          emblemRect.width > 10 &&
          emblemRect.height > 10 &&
          emblemRect.top >= 0 &&
          emblemRect.left >= 0
      ),
      audioCount,
      debugCount,
      bannedHits,
    };
  }, BANNED_TOKENS);

  expect(info.emblemSrc, `${label} emblem src`).toContain('huy-hieu-doan-clean.png');
  expect(info.emblemComplete, `${label} emblem naturalWidth > 0`).toBe(true);
  expect(info.emblemVisible, `${label} emblem visible`).toBe(true);
  expect(info.audioCount, `${label} zero <audio>`).toBe(0);
  expect(info.debugCount, `${label} zero debug/vfx/showcase elements`).toBe(0);
  expect(info.bannedHits, `${label} zero banned 20/11 or DNTU tokens`).toEqual([]);
}

test.describe('Cum 1 NQ57 — Integrated 04-Product Showcase E2E', () => {
  test('1920x1080 Full 10-Stage Journey, Real Video, Posters, Social, Thuyet Minh, Finale & Downloads', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const guards = attachNetworkAndConsoleGuards(page);

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await waitForStage(page, 0);

    // Stage 0: Landing
    await checkPurityAndEmblem(page, 'Stage 0 Landing');
    await expect(page.locator('#landing-title')).toContainText('NGHỊ QUYẾT 57 ĐẾN GẦN THANH NIÊN');
    await expect(page.locator('#landing-products-grid .product-overview-card')).toHaveCount(4);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'landing.png') });

    // Verify all 18 downloadable deliverables return HTTP 200 and non-empty bytes in browser context
    const downloadResults = await page.evaluate(async (paths) => {
      const results = [];
      for (const relPath of paths) {
        const res = await fetch(relPath);
        const buf = await res.arrayBuffer();
        results.push({
          path: relPath,
          status: res.status,
          bytes: buf.byteLength,
        });
      }
      return results;
    }, DOWNLOADABLE_ASSETS);

    for (const item of downloadResults) {
      expect(item.status, `Download HTTP 200 for ${item.path}`).toBe(200);
      expect(item.bytes, `Non-empty bytes for ${item.path}`).toBeGreaterThan(200);
    }

    // Stage 1: Video 9:16
    await page.click('#btn-start');
    await waitForStage(page, 1);
    await checkPurityAndEmblem(page, 'Stage 1 Video');

    await page.waitForFunction(() => {
      const v = document.getElementById('campaign-video');
      return v && v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 100;
    });

    const videoMeta = await page.evaluate(() => {
      const v = document.getElementById('campaign-video');
      const track = document.getElementById('video-vtt-track');
      const posterAttr = v?.getAttribute('poster') || '';
      const im = new Image();
      im.src = posterAttr;
      return new Promise((resolve) => {
        const done = () =>
          resolve({
            readyState: v.readyState,
            duration: v.duration,
            posterAttr,
            trackSrc: track?.getAttribute('src') || '',
            trackExists: Boolean(track),
            thumbW: im.naturalWidth,
            thumbH: im.naturalHeight,
          });
        if (im.complete) done();
        else im.onload = done;
      });
    });

    expect(videoMeta.readyState).toBeGreaterThanOrEqual(1);
    expect(videoMeta.duration).toBeGreaterThanOrEqual(100.5);
    expect(videoMeta.duration).toBeLessThanOrEqual(102.5);
    expect(videoMeta.posterAttr).toContain('thumbnail-chu-dung-1080x1920.png');
    expect(videoMeta.thumbW).toBe(1080);
    expect(videoMeta.thumbH).toBe(1920);
    expect(videoMeta.trackExists).toBe(true);
    expect(videoMeta.trackSrc).toContain('subtitles_vi.vtt');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'video.png') });

    // Real video playback test: click overlay play button -> advances > 0.3s
    await page.click('#btn-video-overlay-play');
    await page.waitForFunction(() => {
      const v = document.getElementById('campaign-video');
      return v && !v.paused && v.currentTime > 0.35;
    }, { timeout: 10000 });

    // Press Space on body (not a button) -> pauses video cleanly WITHOUT jumping to Stage 2
    await page.locator('h2#video-title').click();
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    const pausedAfterSpace = await page.evaluate(() => {
      const v = document.getElementById('campaign-video');
      return {
        paused: v.paused,
        stage: window.__LHS_DECK__.getState().stage,
        time: v.currentTime,
      };
    });
    expect(pausedAfterSpace.paused, 'Space pauses video cleanly').toBe(true);
    expect(pausedAfterSpace.stage, 'Space on Video must NOT jump to Stage 2').toBe(1);
    expect(pausedAfterSpace.time).toBeGreaterThan(0.3);

    // Press Space again -> resumes cleanly, still on Stage 1, then pause cleanly before advancing
    await page.keyboard.press('Space');
    await page.waitForTimeout(350);
    const resumedAfterSpace = await page.evaluate(() => {
      const v = document.getElementById('campaign-video');
      return {
        paused: v.paused,
        stage: window.__LHS_DECK__.getState().stage,
      };
    });
    expect(resumedAfterSpace.paused, 'Space resumes video cleanly').toBe(false);
    expect(resumedAfterSpace.stage, 'Space resume still on Stage 1').toBe(1);

    await page.keyboard.press('Space');
    await page.waitForTimeout(250);
    const repaused = await page.evaluate(() => document.getElementById('campaign-video').paused);
    expect(repaused, 'Final pause check works cleanly').toBe(true);

    // Stages 2..6: 05 Posters
    for (const pCheck of POSTER_CHECKS) {
      await page.keyboard.press('ArrowRight');
      await waitForStage(page, pCheck.stage);
      await checkPurityAndEmblem(page, `Poster ${pCheck.badge}`);

      const posterState = await page.evaluate(() => {
        const img = document.getElementById('poster-stage-img');
        const rect = img.getBoundingClientRect();
        const cs = window.getComputedStyle(img);
        const policyPanel = document.getElementById('panel-policy-highlights');
        return {
          src: img.getAttribute('src') || '',
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          objectFit: cs.objectFit,
          rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
          badge: document.getElementById('stage-badge')?.textContent?.trim(),
          policyVisible: Boolean(policyPanel && !policyPanel.hidden && policyPanel.offsetParent !== null),
          policyText: policyPanel?.innerText || '',
        };
      });

      expect(posterState.src).toContain(pCheck.file);
      expect(posterState.badge).toBe(pCheck.badge);
      expect(posterState.complete).toBe(true);
      expect(posterState.naturalWidth).toBe(1080);
      expect(posterState.naturalHeight).toBe(1350);
      expect(posterState.objectFit).toBe('contain');
      expect(posterState.rect.left).toBeGreaterThanOrEqual(0);
      expect(posterState.rect.top).toBeGreaterThanOrEqual(0);
      expect(posterState.rect.right).toBeLessThanOrEqual(1920.5);
      expect(posterState.rect.bottom).toBeLessThanOrEqual(1080.5);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `poster_0${pCheck.id}.png`) });

      if (pCheck.stage === 4) {
        expect(posterState.policyVisible, 'Stage 4 Poster 03 policy highlights visible').toBe(true);
        for (const tok of [
          '2030',
          '2045',
          '>= 30% GDP',
          '> 80%',
          '>= 50% GDP',
          'TOP 30',
          'KHÔNG PHẢI KẾT QUẢ HIỆN TẠI',
        ]) {
          expect(posterState.policyText, `Poster 03 policy text has "${tok}"`).toContain(tok);
        }

        // Test Zoom Lightbox KeyZ / Escape on Poster 03
        await page.keyboard.press('KeyZ');
        await page.waitForSelector('#lightbox-modal:not([hidden])');
        const zoomSrc = await page.locator('#lightbox-img').getAttribute('src');
        expect(zoomSrc).toContain('03_muc_tieu_2030_tam_nhin_2045_1080x1350.png');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'poster_03_zoom.png') });
        await page.keyboard.press('Escape');
        await page.waitForSelector('#lightbox-modal[hidden]', { state: 'attached' });
      }
    }

    // Stage 7: Social Post
    await page.keyboard.press('ArrowRight');
    await waitForStage(page, 7);
    await checkPurityAndEmblem(page, 'Stage 7 Social Post');

    const socialCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText || '';
      const hasFakeCounts = /\b\d+[KM]\s*(lượt thích|likes|shares|bình luận|comments)\b/i.test(bodyText);
      const hasFakeSocialChrome = Boolean(
        document.querySelector('[class*="facebook"], [class*="zalo-badge"], [data-fake-metric]')
      );
      const visualVisible = !document.getElementById('social-visual-view').hidden;
      const rawHidden = document.getElementById('social-raw-view').hidden;
      return { hasFakeCounts, hasFakeSocialChrome, visualVisible, rawHidden };
    });
    expect(socialCheck.hasFakeCounts).toBe(false);
    expect(socialCheck.hasFakeSocialChrome).toBe(false);
    expect(socialCheck.visualVisible).toBe(true);
    expect(socialCheck.rawHidden).toBe(true);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'social_post.png') });

    // Toggle Xem nguyên văn -> back to Xem trực quan
    await page.click('#btn-social-raw');
    await expect(page.locator('#social-raw-view')).toBeVisible();
    await expect(page.locator('#social-raw-pre')).toContainText('#Cum1');
    await page.click('#btn-social-visual');
    await expect(page.locator('#social-visual-view')).toBeVisible();

    // Open MOCKUP_BAI_DANG.png in Lightbox and verify naturalWidth > 0
    await page.click('#btn-open-mockup');
    await page.waitForSelector('#lightbox-modal:not([hidden])');
    await page.waitForFunction(() => {
      const im = document.getElementById('lightbox-img');
      return im && im.complete && im.naturalWidth > 100;
    });
    const mockupSrc = await page.locator('#lightbox-img').getAttribute('src');
    expect(mockupSrc).toContain('MOCKUP_BAI_DANG.png');
    await page.keyboard.press('Escape');
    await page.waitForSelector('#lightbox-modal[hidden]', { state: 'attached' });

    // Stage 8: Thuyết minh
    await page.keyboard.press('ArrowRight');
    await waitForStage(page, 8);
    await checkPurityAndEmblem(page, 'Stage 8 Thuyet minh');

    const presCards = page.locator('#pres-cards-grid .pres-card');
    await expect(presCards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(presCards.nth(i)).toBeVisible();
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'thuyet_minh.png') });

    // Optional 9-slide PPT reference modal opens & closes via Escape
    await page.click('#btn-open-ppt-ref');
    await page.waitForSelector('#ppt-modal:not([hidden])');
    await expect(page.locator('#ppt-modal-body .ppt-slide-row')).toHaveCount(9);
    await page.keyboard.press('Escape');
    await page.waitForSelector('#ppt-modal[hidden]', { state: 'attached' });

    // Stage 9: Finale
    await page.keyboard.press('ArrowRight');
    await waitForStage(page, 9);
    await checkPurityAndEmblem(page, 'Stage 9 Finale');

    const finaleCheck = await page.evaluate(() => {
      const qrSvg = document.querySelector('#finale-qr-box svg');
      const primaryLink = document.getElementById('btn-finale-official')?.getAttribute('href') || '';
      const secondaryLink =
        document.getElementById('btn-finale-secondary-official')?.getAttribute('href') || '';
      return {
        hasQr: Boolean(qrSvg && qrSvg.getBoundingClientRect().width > 40),
        primaryLink,
        secondaryLink,
      };
    });
    expect(finaleCheck.hasQr).toBe(true);
    expect(finaleCheck.primaryLink).toContain('chinhphu.vn');
    expect(finaleCheck.secondaryLink).toContain('mst.gov.vn');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'finale.png') });

    // Controls: KeyD Resource Hub modal
    await page.keyboard.press('KeyD');
    await page.waitForSelector('#downloads-modal:not([hidden])');
    await expect(page.locator('#downloads-modal-body .download-hub-card')).toHaveCount(13);
    await page.keyboard.press('Escape');
    await page.waitForSelector('#downloads-modal[hidden]', { state: 'attached' });

    // Controls: KeyN Speaker Drawer + Timing Mode toggle (04:00 / 06:00)
    await page.keyboard.press('KeyN');
    await expect(page.locator('#speaker-drawer')).toBeVisible();
    await expect(page.locator('#speaker-drawer-title')).toContainText('Lời nói 4p');
    await expect(page.locator('#speaker-drawer-extended')).toBeHidden();
    await page.click('#btn-timing-mode');
    await expect(page.locator('#timing-mode-label')).toContainText('06:00');
    await page.click('#btn-timing-mode');
    await expect(page.locator('#timing-mode-label')).toContainText('04:00');
    await page.keyboard.press('KeyN');
    await expect(page.locator('#speaker-drawer')).toBeHidden();

    // Controls: KeyI Sources / 7NV / 5 Q&As Modal
    await page.keyboard.press('KeyI');
    await page.waitForSelector('#sources-modal:not([hidden])');
    await expect(page.locator('#sources-modal-body .sources-pillar-card')).toHaveCount(4);
    await expect(page.locator('#sources-modal-body .sources-task-item')).toHaveCount(7);
    await expect(page.locator('#sources-modal-body .sources-qa-card')).toHaveCount(5);
    await page.keyboard.press('Escape');
    await page.waitForSelector('#sources-modal[hidden]', { state: 'attached' });

    // Controls: KeyL Lite Mode, KeyB Motion Off, Auto Demo toggle, ArrowLeft
    await page.keyboard.press('KeyL');
    expect(await page.evaluate(() => document.body.classList.contains('lite-mode'))).toBe(true);
    await page.keyboard.press('KeyB');
    expect(await page.evaluate(() => document.body.classList.contains('motion-off'))).toBe(true);
    await page.keyboard.press('KeyB');
    await page.keyboard.press('KeyL');

    await page.keyboard.press('ArrowLeft');
    await waitForStage(page, 8);
    await page.click('#btn-auto-demo');
    expect(await page.evaluate(() => window.__LHS_DECK__.getState().isAutoDemo)).toBe(true);
    await page.click('#btn-auto-demo');
    expect(await page.evaluate(() => window.__LHS_DECK__.getState().isAutoDemo)).toBe(false);

    guards.assertClean('1920x1080 Desktop');
  });

  test('1366x768 Laptop Viewport & prefers-reduced-motion: reduce', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const guards = attachNetworkAndConsoleGuards(page);

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await waitForStage(page, 0);

    const isLiteOnReduced = await page.evaluate(() => document.body.classList.contains('lite-mode'));
    expect(isLiteOnReduced, 'prefers-reduced-motion: reduce enables lite-mode').toBe(true);

    // Check stages 0, 1, 4, 7, 8, 9 fit cleanly without horizontal page overflow
    for (const target of [0, 1, 4, 7, 8, 9]) {
      await page.evaluate((s) => window.__LHS_DECK__.goToStage(s), target);
      await waitForStage(page, target);
      await checkPurityAndEmblem(page, `1366x768 Stage ${target}`);
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });
      expect(overflow, `1366x768 Stage ${target} horizontal overflow`).toBeLessThanOrEqual(2);
    }

    guards.assertClean('1366x768 Reduced Motion');
    await context.close();
  });

  test('Mobile 390x844 & 360x800 Viewports + Mobile Screenshots', async ({ browser }) => {
    // 390x844
    const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page390 = await ctx390.newPage();
    const guards390 = attachNetworkAndConsoleGuards(page390);

    await page390.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page390.evaluate(() => document.fonts.ready);
    await waitForStage(page390, 0);
    await checkPurityAndEmblem(page390, 'Mobile 390 Landing');
    expect(
      await page390.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(2);
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_390_landing.png') });

    await page390.evaluate(() => window.__LHS_DECK__.goToStage(1));
    await waitForStage(page390, 1);
    await checkPurityAndEmblem(page390, 'Mobile 390 Video');
    expect(
      await page390.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(2);
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_390_video.png') });

    await page390.evaluate(() => window.__LHS_DECK__.goToStage(4));
    await waitForStage(page390, 4);
    await checkPurityAndEmblem(page390, 'Mobile 390 Poster 03');
    expect(
      await page390.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(2);
    await page390.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_390_poster03.png') });

    guards390.assertClean('Mobile 390x844');
    await ctx390.close();

    // 360x800
    const ctx360 = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const page360 = await ctx360.newPage();
    const guards360 = attachNetworkAndConsoleGuards(page360);

    await page360.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page360.evaluate(() => document.fonts.ready);
    await page360.evaluate(() => window.__LHS_DECK__.goToStage(9));
    await waitForStage(page360, 9);
    await checkPurityAndEmblem(page360, 'Mobile 360 Finale');
    expect(
      await page360.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(2);
    await page360.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_360_finale.png') });

    guards360.assertClean('Mobile 360x800');
    await ctx360.close();
  });
});
