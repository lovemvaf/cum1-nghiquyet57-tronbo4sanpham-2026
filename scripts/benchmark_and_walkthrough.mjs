import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PREVIEW_URL = 'http://127.0.0.1:4175/cum1-nghiquyet57-tronbo4sanpham-2026/';
const RECORDING_DIR = path.resolve(process.cwd(), 'qa', 'VIDEO_SCREEN_RECORDINGS');
const TARGET_WEBM = path.join(RECORDING_DIR, 'cum1_4sanpham_walkthrough.webm');
const BENCHMARK_JSON = path.resolve(process.cwd(), 'qa', 'FPS_LOAD_BENCHMARK.json');

fs.mkdirSync(RECORDING_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return;
    } catch {
      // keep polling
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Preview server did not respond 200 at ${url} within ${timeoutMs}ms`);
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

async function measureFps(page, durationMs = 2000) {
  return page.evaluate((ms) => {
    return new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      let last = start;
      let maxDelta = 0;
      function tick(now) {
        const delta = now - last;
        if (frames > 0 && delta > maxDelta) maxDelta = delta;
        last = now;
        frames += 1;
        if (now - start >= ms) {
          const elapsed = now - start;
          resolve({
            frames,
            elapsedMs: Number(elapsed.toFixed(1)),
            fps: Number(((frames * 1000) / elapsed).toFixed(2)),
            maxFrameDeltaMs: Number(maxDelta.toFixed(2)),
          });
        } else {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    });
  }, durationMs);
}

async function measureLoadTiming(page) {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((p) => p.name === 'first-contentful-paint');
    if (!nav) return null;
    return {
      domContentLoadedMs: Number(nav.domContentLoadedEventEnd.toFixed(1)),
      loadEventMs: Number(nav.loadEventEnd.toFixed(1)),
      domInteractiveMs: Number(nav.domInteractive.toFixed(1)),
      responseEndMs: Number(nav.responseEnd.toFixed(1)),
      firstContentfulPaintMs: fcp ? Number(fcp.startTime.toFixed(1)) : null,
      transferSizeBytes: nav.transferSize || 0,
    };
  });
}

async function runBenchmark(browser) {
  console.log('\n=== 1. FPS & LOAD BENCHMARK ON dist/ (vite preview :4175) ===');

  // Normal context (1920x1080)
  const ctxNormal = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctxNormal.newPage();
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await waitForStage(page, 0);

  const loadTimingNormal = await measureLoadTiming(page);
  const fpsStage0Normal = await measureFps(page, 2000);

  await page.evaluate(() => window.__LHS_DECK__.goToStage(4));
  await waitForStage(page, 4);
  const fpsStage4Normal = await measureFps(page, 2000);

  // Lite Mode (KeyL)
  await page.keyboard.press('KeyL');
  await page.waitForTimeout(300);
  const fpsStage4Lite = await measureFps(page, 2000);

  // Motion Off (KeyB)
  await page.keyboard.press('KeyL'); // turn off lite first
  await page.keyboard.press('KeyB');
  await page.waitForTimeout(300);
  const fpsStage4MotionOff = await measureFps(page, 2000);

  await ctxNormal.close();

  // Reduced Motion context
  const ctxReduced = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    reducedMotion: 'reduce',
  });
  const pageRed = await ctxReduced.newPage();
  await pageRed.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
  await pageRed.evaluate(() => document.fonts.ready);
  await waitForStage(pageRed, 0);
  const loadTimingReduced = await measureLoadTiming(pageRed);
  const fpsStage0Reduced = await measureFps(pageRed, 2000);
  await ctxReduced.close();

  const report = {
    measuredAt: new Date().toISOString(),
    previewUrl: PREVIEW_URL,
    loadTimingNormal,
    loadTimingReduced,
    fps: {
      normalStage0Landing: fpsStage0Normal,
      normalStage4Poster03: fpsStage4Normal,
      liteModeStage4Poster03: fpsStage4Lite,
      motionOffStage4Poster03: fpsStage4MotionOff,
      reducedMotionStage0Landing: fpsStage0Reduced,
    },
  };
  fs.writeFileSync(BENCHMARK_JSON, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  return report;
}

async function recordWalkthrough(browser) {
  console.log('\n=== 2. RECORDING SILENT 1280x720 WEBM WALKTHROUGH ===');
  const tmpDir = path.join(RECORDING_DIR, '_tmp_rec');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: tmpDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await waitForStage(page, 0);
  await page.waitForTimeout(1200);

  // Stage 0 -> Stage 1 (Video) + brief muted preview playback
  await page.click('#btn-start');
  await waitForStage(page, 1);
  await page.waitForFunction(() => {
    const v = document.getElementById('campaign-video');
    return v && v.readyState >= 1;
  });
  await page.evaluate(() => {
    const v = document.getElementById('campaign-video');
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  });
  await page.waitForTimeout(2400);
  await page.evaluate(() => {
    const v = document.getElementById('campaign-video');
    if (v && !v.paused) v.pause();
  });

  // Stage 1 -> Stage 2 (Poster 01/05)
  await page.click('#btn-next');
  await waitForStage(page, 2);
  await page.waitForTimeout(1100);

  // Jump to Stage 4 (Poster 03/05: 2030/2045) + brief Zoom Lightbox
  await page.evaluate(() => window.__LHS_DECK__.goToStage(4));
  await waitForStage(page, 4);
  await page.waitForTimeout(1200);
  await page.keyboard.press('KeyZ');
  await page.waitForSelector('#lightbox-modal:not([hidden])');
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape');
  await page.waitForSelector('#lightbox-modal[hidden]', { state: 'attached' });

  // Jump to Stage 7 (Social Post)
  await page.evaluate(() => window.__LHS_DECK__.goToStage(7));
  await waitForStage(page, 7);
  await page.waitForTimeout(1200);
  await page.click('#btn-social-raw');
  await page.waitForTimeout(700);
  await page.click('#btn-social-visual');
  await page.waitForTimeout(500);

  // Stage 8 (Thuyết minh)
  await page.click('#btn-next');
  await waitForStage(page, 8);
  await page.waitForTimeout(1300);

  // Stage 9 (Finale + QR)
  await page.click('#btn-next');
  await waitForStage(page, 9);
  await page.waitForTimeout(1500);

  const videoObj = page.video();
  await context.close();

  const recordedPath = await videoObj.path();
  fs.copyFileSync(recordedPath, TARGET_WEBM);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const sizeBytes = fs.statSync(TARGET_WEBM).size;
  const sizeMb = (sizeBytes / (1024 * 1024)).toFixed(2);
  console.log(`Saved walkthrough WebM: ${TARGET_WEBM} (${sizeMb} MB, ${sizeBytes} bytes)`);
  if (sizeBytes >= 8 * 1024 * 1024) {
    throw new Error(`Walkthrough WebM ${sizeMb} MB exceeds 8 MB budget!`);
  }
}

async function main() {
  const previewProc = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', '4175', '--host', '127.0.0.1'],
    {
      cwd: process.cwd(),
      stdio: 'ignore',
      shell: true,
    }
  );

  try {
    await waitForServer(PREVIEW_URL);
    const browser = await chromium.launch({ headless: true });
    try {
      await runBenchmark(browser);
      await recordWalkthrough(browser);
    } finally {
      await browser.close();
    }
  } finally {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(previewProc.pid), '/f', '/t'], { stdio: 'ignore' });
    } else {
      previewProc.kill('SIGTERM');
    }
  }
}

main().catch((err) => {
  console.error('BENCHMARK/WALKTHROUGH FAILED:', err);
  process.exit(1);
});
