/**
 * LẠC HỒNG SỐ — Cinematic Multi-Layer Heritage Sky Canvas (Pure Canvas 2D)
 * Strictly behind UI (z-index: 1, pointer-events: none).
 *
 * Architecture:
 *  - Pre-rendered Offscreen Sprite Atlases (starHaloSprite, bokehOrbSprite, farCloudSprite, nearCloudSprite, 3 botanical leafSprites)
 *  - Atmospheric Royal-Sapphire Sky Gradient + 5 Volumetric Light Shafts + Drifting Clouds
 *  - Luminous Multi-Ring Đông Sơn Bronze Drum Layer (16-ray solar burst, beaded orbit, 8 Chim Lạc accents, 95s/turn)
 *  - 85 Distant Stars + 45 Golden-Ivory Motes + 14 Outer Bokeh Orbs
 *  - Recurring Golden Knowledge Particle Waves (65–95 particles along sweeping upper/outer Bezier arcs)
 *  - Continuous Multi-Depth Bird Flocks (Chim Lạc, Hạc trắng, Bồ câu trắng) with 2-joint articulated wings + Auto Grand Sky Wave
 *  - 20 Botanical Leaves (emerald, sage olive, champagne gold) tumbling along outer safe corridors (x < 0.14, x > 0.86)
 *  - Stage 1 (Video) Focus Mode: gently dims center (rgba(4,12,26,0.34)) and pauses heavy foreground birds/leaves
 */

const FLOCK_TYPES = ['chim-lac', 'hac-trang', 'bo-cau'];
const DEPTH_TIERS = ['far', 'mid', 'near'];

export function createHeritageSkyCanvas(canvas) {
  if (!canvas || !canvas.getContext) {
    return {
      setStage: () => {},
      setLiteMode: () => {},
      setMotionOff: () => {},
      triggerGrandWave: () => {},
      setPointer: () => {},
      getMetrics: () => ({
        flocksCount: 0,
        totalBirds: 0,
        leavesCount: 0,
        motesCount: 0,
        waveCount: 0,
        grandWavesTriggered: 0,
        fps: 0,
        isPaused: true,
      }),
      destroy: () => {},
    };
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  let width = window.innerWidth || 1280;
  let height = window.innerHeight || 720;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let prefersReduced = reducedMotionQuery?.matches || false;
  let liteMode = prefersReduced;
  let motionOff = false;
  let isTabHidden = document.hidden || false;

  let currentStage = 0;
  let rafId = null;
  let lastTs = 0;
  let elapsed = 0;

  // FPS telemetry
  let fpsFrames = 0;
  let fpsLastCheck = performance.now();
  let currentFps = 60;

  // Smooth desktop pointer parallax [-1..1] -> ±14px
  let targetPtrX = 0;
  let targetPtrY = 0;
  let ptrX = 0;
  let ptrY = 0;

  // Timers & counters
  let flockTimer = 2.6;
  let flockCycleIdx = 0;
  let knowledgeWaveTimer = 8.6;
  let grandSkyWaveTimer = 11.4;
  let grandWavesTriggered = 0;

  // =========================================================================
  // 1. PRE-RENDERED OFFSCREEN SPRITE ATLASES (built once at init)
  // =========================================================================
  let starHaloSprite = null;
  let bokehOrbSprite = null;
  let farCloudSprite = null;
  let nearCloudSprite = null;
  const leafSprites = [];

  function buildOffscreenSprites() {
    // A. Star Halo & Golden Knowledge Mote Sprite (48x48 warm ivory-gold glow)
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 48;
    sCanvas.height = 48;
    const sCtx = sCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(24, 24, 0, 24, 24, 24);
    sGrad.addColorStop(0, 'rgba(255, 253, 245, 1)');
    sGrad.addColorStop(0.22, 'rgba(247, 232, 186, 0.92)');
    sGrad.addColorStop(0.52, 'rgba(240, 193, 75, 0.36)');
    sGrad.addColorStop(1, 'rgba(240, 193, 75, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 48, 48);
    starHaloSprite = sCanvas;

    // B. Soft Golden/Azure Bokeh Orb Sprite (64x64)
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 64;
    bCanvas.height = 64;
    const bCtx = bCanvas.getContext('2d');
    const bGrad = bCtx.createRadialGradient(32, 32, 2, 32, 32, 31);
    bGrad.addColorStop(0, 'rgba(247, 243, 232, 0.36)');
    bGrad.addColorStop(0.42, 'rgba(240, 193, 75, 0.24)');
    bGrad.addColorStop(0.76, 'rgba(30, 108, 194, 0.16)');
    bGrad.addColorStop(1, 'rgba(19, 88, 166, 0)');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(0, 0, 64, 64);
    bokehOrbSprite = bCanvas;

    // C1. Far Cloud Sprite (220x110 sapphire horizon mist)
    const fcCanvas = document.createElement('canvas');
    fcCanvas.width = 220;
    fcCanvas.height = 110;
    const fcCtx = fcCanvas.getContext('2d');
    const farPuffs = [
      { x: 110, y: 56, rx: 102, ry: 44, c0: 'rgba(116, 174, 235, 0.20)', c1: 'rgba(30, 108, 194, 0.08)' },
      { x: 74, y: 60, rx: 64, ry: 34, c0: 'rgba(155, 200, 245, 0.16)', c1: 'rgba(19, 88, 166, 0.05)' },
      { x: 148, y: 58, rx: 66, ry: 34, c0: 'rgba(155, 200, 245, 0.15)', c1: 'rgba(19, 88, 166, 0.05)' },
    ];
    for (let i = 0; i < farPuffs.length; i++) {
      const p = farPuffs[i];
      fcCtx.save();
      fcCtx.translate(p.x, p.y);
      fcCtx.scale(1, p.ry / p.rx);
      const g = fcCtx.createRadialGradient(0, 0, 4, 0, 0, p.rx);
      g.addColorStop(0, p.c0);
      g.addColorStop(0.55, p.c1);
      g.addColorStop(1, 'rgba(10, 38, 82, 0)');
      fcCtx.fillStyle = g;
      fcCtx.beginPath();
      fcCtx.arc(0, 0, p.rx, 0, Math.PI * 2);
      fcCtx.fill();
      fcCtx.restore();
    }
    farCloudSprite = fcCanvas;

    // C2. Near Illuminated Cloud Sprite (220x110 warm dawn horizon mist)
    const ncCanvas = document.createElement('canvas');
    ncCanvas.width = 220;
    ncCanvas.height = 110;
    const ncCtx = ncCanvas.getContext('2d');
    const nearPuffs = [
      { x: 110, y: 55, rx: 100, ry: 42, c0: 'rgba(247, 243, 232, 0.24)', c1: 'rgba(240, 193, 75, 0.11)' },
      { x: 72, y: 58, rx: 62, ry: 32, c0: 'rgba(240, 193, 75, 0.18)', c1: 'rgba(30, 108, 194, 0.06)' },
      { x: 148, y: 58, rx: 62, ry: 32, c0: 'rgba(247, 232, 186, 0.18)', c1: 'rgba(30, 108, 194, 0.06)' },
    ];
    for (let i = 0; i < nearPuffs.length; i++) {
      const p = nearPuffs[i];
      ncCtx.save();
      ncCtx.translate(p.x, p.y);
      ncCtx.scale(1, p.ry / p.rx);
      const g = ncCtx.createRadialGradient(0, 0, 4, 0, 0, p.rx);
      g.addColorStop(0, p.c0);
      g.addColorStop(0.55, p.c1);
      g.addColorStop(1, 'rgba(10, 38, 82, 0)');
      ncCtx.fillStyle = g;
      ncCtx.beginPath();
      ncCtx.arc(0, 0, p.rx, 0, Math.PI * 2);
      ncCtx.fill();
      ncCtx.restore();
    }
    nearCloudSprite = ncCanvas;

    // D. 3 Botanical Leaf Canvases (36x36 — youth emerald, sage olive, champagne gold; ZERO pink petals)
    leafSprites.length = 0;
    const leafThemes = [
      { tip: '#59C199', body: '#2D8A68', base: '#1B5E45', vein: 'rgba(247, 243, 232, 0.36)' },
      { tip: '#C9DCB3', body: '#A4BC8A', base: '#6E8855', vein: 'rgba(240, 193, 75, 0.36)' },
      { tip: '#FFF7DA', body: '#F0C14B', base: '#C79229', vein: 'rgba(255, 253, 245, 0.44)' },
    ];

    for (let i = 0; i < leafThemes.length; i++) {
      const lt = leafThemes[i];
      const lCanvas = document.createElement('canvas');
      lCanvas.width = 36;
      lCanvas.height = 36;
      const lCtx = lCanvas.getContext('2d');
      lCtx.translate(18, 18);

      const lGrad = lCtx.createLinearGradient(0, -13, 0, 13);
      lGrad.addColorStop(0, lt.tip);
      lGrad.addColorStop(0.55, lt.body);
      lGrad.addColorStop(1, lt.base);

      lCtx.beginPath();
      lCtx.moveTo(0, -13);
      lCtx.bezierCurveTo(8, -6, 8.5, 5, 0, 13);
      lCtx.bezierCurveTo(-8.5, 5, -8, -6, 0, -13);
      lCtx.closePath();
      lCtx.fillStyle = lGrad;
      lCtx.fill();

      lCtx.strokeStyle = lt.vein;
      lCtx.lineWidth = 0.85;
      lCtx.stroke();

      // Central midrib & delicate veins
      lCtx.beginPath();
      lCtx.moveTo(0, -10.5);
      lCtx.lineTo(0, 11.5);
      lCtx.moveTo(0, -3);
      lCtx.lineTo(3.8, -6.2);
      lCtx.moveTo(0, 2);
      lCtx.lineTo(-4.0, -1.4);
      lCtx.moveTo(0, 5.5);
      lCtx.lineTo(3.5, 2.2);
      lCtx.stroke();

      leafSprites.push(lCanvas);
    }
  }

  // =========================================================================
  // 2. STAGE MOOD STATE & ENTITY POOLS
  // =========================================================================
  const auraState = {
    xRatio: 0.5,
    yRatio: 0.46,
    targetXRatio: 0.5,
    targetYRatio: 0.46,
    strength: 0.20,
    targetStrength: 0.20,
    ringPresence: 0.55,
    targetRingPresence: 0.55,
    horizonGlow: 0.36,
    targetHorizonGlow: 0.36,
    sunriseMix: 0.42,
    targetSunriseMix: 0.42,
    dongSonGlow: 1.0,
    targetDongSonGlow: 1.0,
    videoDim: 0,
    targetVideoDim: 0,
  };

  // 85 distant twinkling stars
  const STARS_COUNT = 85;
  const farStars = Array.from({ length: STARS_COUNT }, (_, idx) => ({
    nx: ((idx * 173 + 37) % 1000) / 1000,
    ny: 0.015 + (((idx * 281 + 71) % 860) / 1000),
    radius: 0.65 + (idx % 4) * 0.34,
    baseAlpha: 0.32 + (idx % 6) * 0.08,
    twinkleSpeed: 0.55 + (idx % 5) * 0.22,
    twinklePhase: idx * 0.92,
    parallax: 3 + (idx % 3) * 1.4,
  }));

  // 45 drifting golden-ivory motes (rendered via starHaloSprite)
  const MOTES_COUNT = 45;
  const motes = Array.from({ length: MOTES_COUNT }, (_, idx) => ({
    nx: ((idx * 197 + 19) % 1000) / 1000,
    ny: ((idx * 353 + 61) % 1000) / 1000,
    size: 10 + (idx % 5) * 3.4,
    speedY: 0.0065 + (idx % 5) * 0.0024,
    phase: idx * 0.85,
    alpha: 0.28 + (idx % 5) * 0.09,
    parallax: 7.5 + (idx % 4) * 1.5,
  }));

  // 14 soft outer bokeh orbs (rendered via bokehOrbSprite)
  const BOKEH_COUNT = 14;
  const bokehOrbs = Array.from({ length: BOKEH_COUNT }, (_, idx) => {
    const isLeft = idx % 2 === 0;
    return {
      nx: idx < 10 ? (isLeft ? 0.02 + (idx % 5) * 0.026 : 0.98 - (idx % 5) * 0.026) : 0.18 + (idx - 10) * 0.21,
      ny: idx < 10 ? 0.12 + (idx * 0.082) : 0.04 + (idx % 2) * 0.07,
      vx: (isLeft ? 1 : -1) * 0.0022,
      vy: -0.0038 - (idx % 3) * 0.0014,
      size: 32 + (idx % 4) * 10,
      alpha: 0.22 + (idx % 4) * 0.055,
      phase: idx * 1.15,
      parallax: 11 + (idx % 3) * 1.5,
    };
  });

  // Drifting upper-horizon clouds (y: 4%..20%)
  const farClouds = [
    { nx: 0.16, ny: 0.065, scaleX: 1.55, scaleY: 0.85, speedX: 0.0042, alpha: 0.54, parallax: 6 },
    { nx: 0.54, ny: 0.115, scaleX: 1.75, scaleY: 0.92, speedX: 0.0034, alpha: 0.48, parallax: 7 },
    { nx: 0.88, ny: 0.075, scaleX: 1.45, scaleY: 0.82, speedX: 0.0046, alpha: 0.50, parallax: 6 },
  ];

  const nearClouds = [
    { nx: 0.12, ny: 0.135, scaleX: 1.45, scaleY: 0.82, speedX: 0.0068, alpha: 0.46, parallax: 11 },
    { nx: 0.48, ny: 0.085, scaleX: 1.65, scaleY: 0.88, speedX: 0.0058, alpha: 0.44, parallax: 12 },
    { nx: 0.82, ny: 0.165, scaleX: 1.40, scaleY: 0.80, speedX: 0.0072, alpha: 0.48, parallax: 11 },
  ];

  // 5 soft diagonal volumetric light shafts
  const LIGHT_SHAFTS = [
    { xRatio: 0.18, widthRatio: 0.11, angle: -0.34, phase: 0.0, speed: 0.32, strength: 0.055 },
    { xRatio: 0.36, widthRatio: 0.14, angle: -0.30, phase: 1.3, speed: 0.27, strength: 0.065 },
    { xRatio: 0.54, widthRatio: 0.16, angle: -0.28, phase: 2.5, speed: 0.24, strength: 0.070 },
    { xRatio: 0.72, widthRatio: 0.13, angle: -0.32, phase: 3.7, speed: 0.29, strength: 0.060 },
    { xRatio: 0.88, widthRatio: 0.10, angle: -0.36, phase: 4.9, speed: 0.34, strength: 0.050 },
  ];

  // 20 botanical leaves tumbling strictly along outer safe corridors (x < 0.14 and x > 0.86)
  const LEAVES_COUNT = 20;
  const leaves = Array.from({ length: LEAVES_COUNT }, (_, idx) => {
    const isLeft = idx % 2 === 0;
    const laneOffset = ((idx * 37) % 100) / 1000; // 0..0.099
    const baseX = isLeft ? 0.02 + laneOffset : 0.98 - laneOffset;
    return {
      xRatio: baseX,
      isLeft,
      yRatio: (idx * 0.053) % 1,
      speedY: 0.015 + (idx % 4) * 0.0038,
      swayAmp: 6 + (idx % 4) * 2.5,
      swayFreq: 0.55 + (idx % 4) * 0.16,
      rotPhase: idx * 0.95,
      rotSpeed: (isLeft ? 1 : -1) * (0.42 + (idx % 4) * 0.14),
      rollPhase: idx * 1.4,
      rollSpeed: 1.2 + (idx % 4) * 0.28,
      scale: 0.62 + (idx % 4) * 0.11,
      alpha: 0.42 + (idx % 3) * 0.11,
      spriteIdx: idx % 3,
    };
  });

  // Active bird flocks, grand sky wave birds, and Bezier knowledge wave particles
  const flocks = [];
  const grandWaveBirds = [];
  const waveParticles = [];

  function isAnimationDisabled() {
    return motionOff || liteMode || prefersReduced;
  }

  function updateStageTarget(stage) {
    currentStage = stage;
    const isDesktop = width > 1024;
    const focalX = isDesktop ? 0.36 : 0.5;
    const focalY = isDesktop ? 0.48 : 0.36;

    if (stage === 0) {
      // Landing: warm horizon luminescence & prominent Đông Sơn
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.45;
      auraState.targetStrength = 0.22;
      auraState.targetRingPresence = 0.56;
      auraState.targetHorizonGlow = 0.42;
      auraState.targetSunriseMix = 0.48;
      auraState.targetDongSonGlow = 1.0;
      auraState.targetVideoDim = 0;
    } else if (stage === 1) {
      // Video Focus Mode: dim center cleanly, calm background
      auraState.targetXRatio = isDesktop ? 0.38 : 0.5;
      auraState.targetYRatio = 0.5;
      auraState.targetStrength = 0.08;
      auraState.targetRingPresence = 0.10;
      auraState.targetHorizonGlow = 0.05;
      auraState.targetSunriseMix = 0.04;
      auraState.targetDongSonGlow = 0.24;
      auraState.targetVideoDim = 1;
    } else if (stage === 2 || stage === 3) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.19;
      auraState.targetRingPresence = stage === 3 ? 0.62 : 0.34;
      auraState.targetHorizonGlow = 0.18;
      auraState.targetSunriseMix = 0.24;
      auraState.targetDongSonGlow = stage === 3 ? 0.66 : 0.52;
      auraState.targetVideoDim = 0;
    } else if (stage === 4) {
      // Stage 4 Vision 03/05 (2030 -> 2045): warm horizon dawn
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.20;
      auraState.targetRingPresence = 0.42;
      auraState.targetHorizonGlow = 0.86;
      auraState.targetSunriseMix = 0.72;
      auraState.targetDongSonGlow = 0.68;
      auraState.targetVideoDim = 0;
    } else if (stage === 5) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.19;
      auraState.targetRingPresence = 0.38;
      auraState.targetHorizonGlow = 0.32;
      auraState.targetSunriseMix = 0.36;
      auraState.targetDongSonGlow = 0.56;
      auraState.targetVideoDim = 0;
    } else if (stage === 6) {
      // Stage 6 Lan tỏa 05/05: warm radiant horizon
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.22;
      auraState.targetRingPresence = 0.52;
      auraState.targetHorizonGlow = 0.76;
      auraState.targetSunriseMix = 0.84;
      auraState.targetDongSonGlow = 0.74;
      auraState.targetVideoDim = 0;
    } else if (stage === 7 || stage === 8) {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.44;
      auraState.targetStrength = 0.17;
      auraState.targetRingPresence = 0.34;
      auraState.targetHorizonGlow = 0.26;
      auraState.targetSunriseMix = 0.28;
      auraState.targetDongSonGlow = 0.52;
      auraState.targetVideoDim = 0;
    } else {
      // Stage 9 Finale: radiant golden horizon & prominent Đông Sơn
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.45;
      auraState.targetStrength = 0.26;
      auraState.targetRingPresence = 0.68;
      auraState.targetHorizonGlow = 0.88;
      auraState.targetSunriseMix = 0.96;
      auraState.targetDongSonGlow = 1.06;
      auraState.targetVideoDim = 0;
    }
  }

  function snapAuraState() {
    auraState.xRatio = auraState.targetXRatio;
    auraState.yRatio = auraState.targetYRatio;
    auraState.strength = auraState.targetStrength;
    auraState.ringPresence = auraState.targetRingPresence;
    auraState.horizonGlow = auraState.targetHorizonGlow;
    auraState.sunriseMix = auraState.targetSunriseMix;
    auraState.dongSonGlow = auraState.targetDongSonGlow;
    auraState.videoDim = auraState.targetVideoDim;
  }

  function stepAuraInterpolation(dt) {
    const rate = Math.min(1, dt * 4.5);
    auraState.xRatio += (auraState.targetXRatio - auraState.xRatio) * rate;
    auraState.yRatio += (auraState.targetYRatio - auraState.yRatio) * rate;
    auraState.strength += (auraState.targetStrength - auraState.strength) * rate;
    auraState.ringPresence += (auraState.targetRingPresence - auraState.ringPresence) * rate;
    auraState.horizonGlow += (auraState.targetHorizonGlow - auraState.horizonGlow) * rate;
    auraState.sunriseMix += (auraState.targetSunriseMix - auraState.sunriseMix) * rate;
    auraState.dongSonGlow += (auraState.targetDongSonGlow - auraState.dongSonGlow) * rate;
    auraState.videoDim += (auraState.targetVideoDim - auraState.videoDim) * rate;

    const ptrRate = Math.min(1, dt * 5.2);
    ptrX += (targetPtrX - ptrX) * ptrRate;
    ptrY += (targetPtrY - ptrY) * ptrRate;
  }

  // =========================================================================
  // 3. SPAWNERS: MULTI-DEPTH FLOCKS, GRAND SKY WAVE, KNOWLEDGE PARTICLE WAVE
  // =========================================================================
  function spawnFlock(prewarmXRatio = null, forcedTier = null, forcedKind = null) {
    if (flocks.length >= 4 || currentStage === 1 || isAnimationDisabled()) return;

    const kind = forcedKind || FLOCK_TYPES[flockCycleIdx % FLOCK_TYPES.length];
    const tier = forcedTier || DEPTH_TIERS[flockCycleIdx % DEPTH_TIERS.length];
    flockCycleIdx += 1;

    const count = tier === 'far' ? 5 : tier === 'mid' ? 4 : 3;
    const goRight = prewarmXRatio !== null ? flockCycleIdx % 3 !== 0 : Math.random() > 0.34;
    const minYRatio = Math.max(76 / Math.max(height, 400), 0.082);
    const bandMin = tier === 'far' ? minYRatio : tier === 'mid' ? minYRatio + 0.032 : minYRatio + 0.068;
    const bandSpan = tier === 'far' ? 0.06 : tier === 'mid' ? 0.075 : 0.085;
    const baseY = height * (bandMin + Math.random() * bandSpan);
    const startX =
      prewarmXRatio !== null
        ? width * prewarmXRatio
        : goRight
          ? -120
          : width + 120;

    const speedMag = tier === 'far' ? 38 + Math.random() * 12 : tier === 'mid' ? 54 + Math.random() * 14 : 72 + Math.random() * 16;
    const vx = (goRight ? 1 : -1) * speedMag;
    const vy = -1.8 + (Math.random() - 0.5) * 4.2;

    const baseScale = tier === 'far' ? 0.66 : tier === 'mid' ? 0.96 : 1.24;
    const birds = [];
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const row = Math.ceil(i / 2);
      const spacingX = tier === 'far' ? 22 : tier === 'mid' ? 30 : 38;
      const spacingY = tier === 'far' ? 8 : tier === 'mid' ? 12 : 15;
      birds.push({
        offsetX: (goRight ? -1 : 1) * row * spacingX,
        offsetY: side * row * spacingY,
        scale: baseScale * (1 - row * 0.07),
        wingPhase: i * 0.75 + Math.random() * 0.45,
        wingSpeed: kind === 'bo-cau' ? 4.4 : kind === 'chim-lac' ? 3.4 : 3.0 + Math.random() * 0.4,
      });
    }

    flocks.push({
      kind,
      tier,
      x: startX,
      y: baseY,
      vx,
      vy,
      dir: goRight ? 1 : -1,
      alphaMul: tier === 'far' ? 0.54 : tier === 'mid' ? 0.76 : 0.90,
      life: prewarmXRatio !== null ? 2.4 : 0,
      maxLife: (width + 280) / speedMag,
      birds,
    });
  }

  function spawnGrandSkyWave(birdCount = 14) {
    if (currentStage === 1 || isAnimationDisabled()) return;
    grandWaveBirds.length = 0;
    const clampedCount = Math.max(12, Math.min(16, birdCount));
    const goRight = Math.random() > 0.25;
    const duration = 7.4;

    for (let i = 0; i < clampedCount; i++) {
      const kind = FLOCK_TYPES[i % FLOCK_TYPES.length];
      const tier = DEPTH_TIERS[i % DEPTH_TIERS.length];
      const scale = tier === 'near' ? 1.24 + (i % 2) * 0.14 : tier === 'mid' ? 0.96 + (i % 2) * 0.12 : 0.68 + (i % 2) * 0.10;
      const clusterIdx = i % 3;
      const baseNx = goRight
        ? -0.06 - clusterIdx * 0.05 - (i % 4) * 0.025
        : 1.06 + clusterIdx * 0.05 + (i % 4) * 0.025;
      // Keep strictly below 60px top header bar
      const minNy = Math.max(0.085, 76 / Math.max(height, 400));
      const maxNy = (currentStage === 0 || currentStage === 4 || currentStage === 6 || currentStage === 9) ? 0.285 : 0.245;
      const spanNy = Math.max(0.08, maxNy - minNy);
      const baseNy = minNy + ((clusterIdx * 0.34 + (i % 4) * 0.08) % 1) * spanNy;
      const speedNx = (goRight ? 1 : -1) * (0.14 + scale * 0.035);

      grandWaveBirds.push({
        kind,
        tier,
        dir: goRight ? 1 : -1,
        nx: baseNx,
        ny: baseNy,
        vx: speedNx,
        vy: -0.008 - (i % 3) * 0.003,
        scale,
        wingPhase: i * 0.7,
        wingSpeed: kind === 'bo-cau' ? 4.8 : 3.8 + (i % 3) * 0.35,
        phase: i * 0.9,
        delay: (i % 5) * 0.16,
        life: 0,
        maxLife: duration,
      });
    }
  }

  function spawnKnowledgeParticleWave(count = 80, prewarm = false) {
    if (currentStage === 1 || isAnimationDisabled()) return;
    waveParticles.length = 0;
    const actualCount = Math.max(65, Math.min(95, count));
    const duration = 6.2;

    // 3 sweeping upper/outer Bezier curves (keeping center content crisp)
    const arcs = [
      { p0: { x: -0.04, y: 0.22 }, p1: { x: 0.50, y: 0.02 }, p2: { x: 1.04, y: 0.20 } },
      { p0: { x: -0.04, y: 0.76 }, p1: { x: 0.10, y: 0.14 }, p2: { x: 0.88, y: 0.05 } },
      { p0: { x: 1.04, y: 0.72 }, p1: { x: 0.90, y: 0.14 }, p2: { x: 0.12, y: 0.06 } },
    ];

    for (let i = 0; i < actualCount; i++) {
      const arcIdx = i % arcs.length;
      const delay = prewarm ? 0 : (i / actualCount) * 1.1;
      const startProgress = prewarm ? (i / actualCount) * 0.78 : 0;
      waveParticles.push({
        arc: arcs[arcIdx],
        u: startProgress,
        speed: 0.14 + (i % 5) * 0.018,
        spreadX: ((i * 19) % 100 - 50) * 0.0008,
        spreadY: ((i * 31) % 100 - 50) * 0.0009,
        size: i % 4 === 0 ? 22 + (i % 3) * 5 : 11 + (i % 4) * 2.5,
        alpha: 0.58 + (i % 4) * 0.1,
        phase: i * 0.65,
        delay,
        life: prewarm ? startProgress * duration : 0,
        maxLife: duration,
      });
    }
  }

  function triggerGrandWave(reason = 'manual') {
    if (isAnimationDisabled() || currentStage === 1) return;
    grandWavesTriggered += 1;
    spawnGrandSkyWave(14);
    spawnKnowledgeParticleWave(88, false);
    knowledgeWaveTimer = 8.5 + Math.random() * 2.5;
    grandSkyWaveTimer = 10.5 + Math.random() * 3.5;
    void reason;
  }

  function preseedLandingLife() {
    flocks.length = 0;
    spawnFlock(0.18, 'far', 'hac-trang');
    spawnFlock(0.52, 'mid', 'chim-lac');
    spawnFlock(0.76, 'near', 'bo-cau');
    spawnKnowledgeParticleWave(76, true);
  }

  // =========================================================================
  // 4. DRAWING HELPERS
  // =========================================================================
  function getCenterSafeAttenuation(nx, ny) {
    // Attenuate cleanly inside central content box so text, video, poster & QR remain crisp
    if (nx > 0.20 && nx < 0.80 && ny > 0.20 && ny < 0.84) {
      const dx = Math.abs(nx - 0.50) / 0.30;
      const dy = Math.abs(ny - 0.52) / 0.32;
      const edge = Math.max(dx, dy);
      return Math.max(0.08, Math.pow(edge, 2.2) * 0.45);
    }
    return 1.0;
  }

  function drawArticulatedBird(kind, x, y, scale, dir, wingPhase, tier, alpha) {
    if (alpha <= 0.015) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir * scale, scale);

    // Fluid 2-joint shoulder + wrist wing articulation
    const flap = Math.sin(wingPhase);
    const wrist = Math.sin(wingPhase - 0.56);
    const shoulderY = -4.2 - flap * 4.4;
    const tipY = -2.2 - flap * 8.6 - wrist * 3.4;

    if ((kind === 'chim-lac' || tier === 'near') && starHaloSprite) {
      ctx.globalAlpha = alpha * (kind === 'chim-lac' ? 0.34 : 0.20);
      ctx.drawImage(starHaloSprite, -22, -22, 44, 44);
    }

    // Subtle soft ivory-gold wingtip & tail motion trails on near/mid birds
    if (tier !== 'far') {
      const trailMul = tier === 'near' ? 0.34 : 0.22;
      ctx.lineCap = 'round';
      ctx.lineWidth = tier === 'near' ? 1.05 : 0.8;
      ctx.strokeStyle =
        kind === 'chim-lac'
          ? `rgba(240, 193, 75, ${(alpha * trailMul).toFixed(3)})`
          : `rgba(247, 243, 232, ${(alpha * trailMul).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(9, tipY);
      ctx.quadraticCurveTo(-4, tipY + 1.8, -20, tipY + 4.4);
      ctx.moveTo(-12, 1.8);
      ctx.quadraticCurveTo(-21, 3.2, -30, 4.8);
      ctx.stroke();
    }

    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (kind === 'chim-lac') {
      // Stylized Đông Sơn Chim Lạc: gold/ivory body, crest, 2-joint articulated wings & trailing tail ribbons
      ctx.fillStyle = tier === 'far' ? 'rgba(240, 193, 75, 0.84)' : 'rgba(240, 193, 75, 0.94)';
      ctx.strokeStyle = 'rgba(255, 253, 245, 0.90)';
      ctx.lineWidth = tier === 'near' ? 1.25 : 0.95;

      // Body + elongated beak + crest
      ctx.beginPath();
      ctx.moveTo(-14, 1.5);
      ctx.quadraticCurveTo(-2, -1.2, 12, -2.5);
      ctx.lineTo(20, -4.4);
      ctx.lineTo(13, -0.6);
      ctx.quadraticCurveTo(2, 2.5, -14, 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crest plume
      ctx.beginPath();
      ctx.moveTo(9, -2.4);
      ctx.quadraticCurveTo(4, -7.2, -1, -6.5);
      ctx.stroke();

      // Far wing (back wing subtly offset)
      ctx.globalAlpha = alpha * 0.62;
      ctx.beginPath();
      ctx.moveTo(-2, -0.8);
      ctx.quadraticCurveTo(4, shoulderY * 0.72, 13, tipY * 0.72);
      ctx.quadraticCurveTo(6, shoulderY * 0.35, 3, -0.4);
      ctx.closePath();
      ctx.fill();

      // Near 2-joint articulated wing (shoulder + wrist)
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.quadraticCurveTo(-1, shoulderY, 11, tipY);
      ctx.quadraticCurveTo(5, shoulderY + 3.2, 4, -0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Trailing tail ribbons
      ctx.globalAlpha = alpha * 0.72;
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.moveTo(-13, 1.4);
      ctx.quadraticCurveTo(-19, 3.2, -24, 5.0);
      ctx.moveTo(-12, 2.0);
      ctx.quadraticCurveTo(-17, 4.6, -21, 7.0);
      ctx.stroke();
    } else if (kind === 'hac-trang') {
      // Graceful White Crane (Hạc trắng): slender elongated neck, swept legs, luminous ivory 2-joint wings
      ctx.fillStyle = tier === 'far' ? 'rgba(247, 243, 232, 0.74)' : 'rgba(255, 253, 247, 0.92)';
      ctx.strokeStyle = 'rgba(240, 193, 75, 0.68)';
      ctx.lineWidth = tier === 'near' ? 1.15 : 0.85;

      // Slender neck & trailing legs
      ctx.beginPath();
      ctx.moveTo(-18, 2.2);
      ctx.lineTo(-10, 1.0);
      ctx.quadraticCurveTo(2, -1.0, 14, -2.6);
      ctx.lineTo(21, -3.5);
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0.2, 8, 2.2, -0.06, 0, Math.PI * 2);
      ctx.fill();

      // 2-joint articulated crane wings
      ctx.beginPath();
      ctx.moveTo(-4, -0.5);
      ctx.quadraticCurveTo(0, shoulderY * 0.95, 11, tipY * 0.92);
      ctx.quadraticCurveTo(5, shoulderY * 0.48, 3.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Bồ câu trắng: luminous white peace dove with soft arched wings
      ctx.fillStyle = tier === 'far' ? 'rgba(247, 243, 232, 0.78)' : 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = 'rgba(240, 193, 75, 0.74)';
      ctx.lineWidth = tier === 'near' ? 1.15 : 0.85;

      // Compact breast & fanned tail
      ctx.beginPath();
      ctx.moveTo(-12, 2.2);
      ctx.lineTo(-5, 0.2);
      ctx.quadraticCurveTo(2, -2.8, 10, -1.4);
      ctx.lineTo(13, -0.4);
      ctx.quadraticCurveTo(3, 3.2, -12, 2.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Back wing
      ctx.globalAlpha = alpha * 0.66;
      ctx.beginPath();
      ctx.moveTo(-1, -1);
      ctx.quadraticCurveTo(4, shoulderY * 0.68, 11, tipY * 0.66);
      ctx.quadraticCurveTo(4, -2, 2, -0.6);
      ctx.closePath();
      ctx.fill();

      // Primary 2-joint articulated wing
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(-3.5, -0.6);
      ctx.quadraticCurveTo(0.5, shoulderY * 0.9, 9.5, tipY * 0.86);
      ctx.quadraticCurveTo(4, shoulderY * 0.4, 3, -0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSkyAndVolumetricRays(t) {
    // Rich Royal-Sapphire Sky Gradient (#041026 -> #0A2652 -> #1358A6 -> #1E6CC2)
    const skyGrad = ctx.createLinearGradient(0, 0, width * 0.24, height);
    skyGrad.addColorStop(0, '#041026');
    skyGrad.addColorStop(0.36, '#0A2652');
    skyGrad.addColorStop(0.72, '#1358A6');
    skyGrad.addColorStop(1, '#1E6CC2');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Gentle warming on Stage 0 Landing, Stage 4 Vision, Stage 6 Lan tỏa, Stage 9 Finale
    if (auraState.sunriseMix > 0.04) {
      const sx = currentStage === 4 ? width * 0.82 : width * 0.54;
      const sy = currentStage === 4 ? height * 0.16 : height * 0.22;
      const sr = Math.max(width, height) * 0.44;
      const breathe = isAnimationDisabled() ? 1 : 1 + Math.sin(t * 0.42) * 0.025;
      const sunGrad = ctx.createRadialGradient(sx, sy, 8, sx, sy, sr * breathe);
      sunGrad.addColorStop(0, `rgba(240, 193, 75, ${(0.14 * auraState.sunriseMix).toFixed(3)})`);
      sunGrad.addColorStop(0.45, `rgba(247, 243, 232, ${(0.055 * auraState.sunriseMix).toFixed(3)})`);
      sunGrad.addColorStop(1, 'rgba(10, 38, 82, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
    }

    if (auraState.horizonGlow > 0.04) {
      const horizonY = height * 0.72;
      const hGrad = ctx.createLinearGradient(0, horizonY - height * 0.22, 0, height);
      hGrad.addColorStop(0, 'rgba(240, 193, 75, 0)');
      hGrad.addColorStop(0.58, `rgba(240, 193, 75, ${(0.08 * auraState.horizonGlow).toFixed(3)})`);
      hGrad.addColorStop(1, `rgba(247, 243, 232, ${(0.05 * auraState.horizonGlow).toFixed(3)})`);
      ctx.fillStyle = hGrad;
      ctx.fillRect(0, horizonY - height * 0.22, width, height - (horizonY - height * 0.22));
    }

    // Center focal stage aura
    const ax = width * auraState.xRatio;
    const ay = height * auraState.yRatio;
    const auraR = Math.max(width, height) * 0.44;
    const auraGrad = ctx.createRadialGradient(ax, ay, 8, ax, ay, auraR);
    auraGrad.addColorStop(0, `rgba(247, 243, 232, ${(auraState.strength * 0.72).toFixed(3)})`);
    auraGrad.addColorStop(0.44, `rgba(240, 193, 75, ${(auraState.strength * 0.36).toFixed(3)})`);
    auraGrad.addColorStop(1, 'rgba(10, 38, 82, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, width, height);

    // 5 soft diagonal volumetric light shafts breathing gently from upper zenith/sunrise
    const rayScale = 1 - auraState.videoDim * 0.72;
    if (rayScale > 0.05) {
      ctx.save();
      for (let i = 0; i < LIGHT_SHAFTS.length; i++) {
        const shaft = LIGHT_SHAFTS[i];
        const sway = isAnimationDisabled() ? 0 : Math.sin(t * shaft.speed + shaft.phase) * 0.025;
        const pulse = isAnimationDisabled() ? 0.9 : 0.75 + 0.25 * Math.sin(t * (shaft.speed * 1.3) + shaft.phase);
        const alpha = shaft.strength * pulse * rayScale * (0.72 + auraState.sunriseMix * 0.55);

        const sx = width * (shaft.xRatio + sway) - ptrX * 6;
        const beamW = width * shaft.widthRatio;
        const beamLen = height * 1.15;

        ctx.save();
        ctx.translate(sx, -height * 0.08);
        ctx.rotate(shaft.angle + sway * 0.35);

        const beamGrad = ctx.createLinearGradient(0, 0, 0, beamLen);
        beamGrad.addColorStop(0, `rgba(247, 243, 232, ${(alpha * 1.15).toFixed(3)})`);
        beamGrad.addColorStop(0.35, `rgba(240, 193, 75, ${(alpha * 0.72).toFixed(3)})`);
        beamGrad.addColorStop(0.82, `rgba(30, 108, 194, ${(alpha * 0.22).toFixed(3)})`);
        beamGrad.addColorStop(1, 'rgba(10, 38, 82, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-beamW * 0.25, 0);
        ctx.lineTo(beamW * 0.25, 0);
        ctx.lineTo(beamW * 0.85, beamLen);
        ctx.lineTo(-beamW * 0.85, beamLen);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    // Stage 1 (Video) Focus Mode gentle center dim
    if (auraState.videoDim > 0.02) {
      ctx.fillStyle = `rgba(4, 12, 26, ${(auraState.videoDim * 0.34).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
    }
  }

  function drawDriftingClouds(dt) {
    const cloudScale = 1 - auraState.videoDim * 0.52;
    const parallaxMax = isAnimationDisabled() ? 0 : 14;

    if (farCloudSprite) {
      for (let i = 0; i < farClouds.length; i++) {
        const fc = farClouds[i];
        if (!isAnimationDisabled() && dt > 0) {
          fc.nx += fc.speedX * dt;
          if (fc.nx > 1.22) fc.nx = -0.22;
        }
        const cw = 260 * fc.scaleX;
        const ch = 128 * fc.scaleY;
        const cx = fc.nx * width - ptrX * (parallaxMax * 0.45);
        const cy = fc.ny * height - ptrY * (parallaxMax * 0.3);
        ctx.globalAlpha = fc.alpha * cloudScale;
        ctx.drawImage(farCloudSprite, cx - cw * 0.5, cy - ch * 0.5, cw, ch);
      }
    }

    if (nearCloudSprite) {
      for (let i = 0; i < nearClouds.length; i++) {
        const nc = nearClouds[i];
        if (!isAnimationDisabled() && dt > 0) {
          nc.nx += nc.speedX * dt;
          if (nc.nx > 1.22) nc.nx = -0.22;
        }
        const cw = 280 * nc.scaleX;
        const ch = 136 * nc.scaleY;
        const cx = nc.nx * width - ptrX * (parallaxMax * 0.85);
        const cy = nc.ny * height - ptrY * (parallaxMax * 0.55);
        ctx.globalAlpha = nc.alpha * (0.72 + auraState.sunriseMix * 0.42) * cloudScale;
        ctx.drawImage(nearCloudSprite, cx - cw * 0.5, cy - ch * 0.5, cw, ch);
      }
    }

    ctx.globalAlpha = 1;
  }

  function drawDongSonBronzeDrumLayer(t) {
    const pOffset = isAnimationDisabled() ? 0 : 1;
    const cx = width * 0.5 - ptrX * 9 * pOffset;
    const cy = height * 0.52 - ptrY * 6.5 * pOffset;
    const outerRadius = Math.max(width, height) * 0.47;

    // 95s per full turn; static on <= 768px, Lite, Motion Off, or prefers-reduced-motion
    const shouldRotate = !isAnimationDisabled() && width > 768;
    const baseAngle = shouldRotate ? (t * Math.PI * 2) / 95 : 0.18;

    const glow = auraState.dongSonGlow;
    const baseAlpha = Math.min(0.28, 0.155 * glow);
    const isCeremonialSvgStage = currentStage === 0 || currentStage === 9;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(baseAngle);

    // 1. Concentric luminous golden rings (#F0C14B)
    const ringConfigs = [
      { ratio: 0.24, width: 1.45, alphaMul: 1.05, dash: null },
      { ratio: 0.48, width: 1.35, alphaMul: 0.92, dash: null },
      { ratio: 0.62, width: 1.15, alphaMul: 0.78, dash: [6, 8] },
      { ratio: 0.74, width: 1.35, alphaMul: 0.90, dash: null },
      { ratio: 0.88, width: 1.25, alphaMul: 0.82, dash: null },
      { ratio: 0.98, width: 1.10, alphaMul: 0.68, dash: null },
    ];

    for (let i = 0; i < ringConfigs.length; i++) {
      const rc = ringConfigs[i];
      if (isCeremonialSvgStage && rc.ratio < 0.74) continue;
      ctx.save();
      ctx.strokeStyle = `rgba(240, 193, 75, ${(baseAlpha * rc.alphaMul).toFixed(3)})`;
      ctx.lineWidth = rc.width;
      if (rc.dash) ctx.setLineDash(rc.dash);
      ctx.beginPath();
      ctx.arc(0, 0, outerRadius * rc.ratio, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. 16-ray solar star burst at drum center (Stages 2–8 only; avoids moiré with SVG drum on Stages 0 & 9)
    if (!isCeremonialSvgStage) {
      const rCore = outerRadius * 0.085;
      const rInner = outerRadius * 0.12;
      const rTip = outerRadius * 0.235;
      ctx.fillStyle = `rgba(240, 193, 75, ${(baseAlpha * 0.58).toFixed(3)})`;
      ctx.strokeStyle = `rgba(240, 193, 75, ${(baseAlpha * 1.08).toFixed(3)})`;
      ctx.lineWidth = 1.15;

      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const aTip = (i / 16) * Math.PI * 2;
        const aLeft = ((i - 0.34) / 16) * Math.PI * 2;
        const aRight = ((i + 0.34) / 16) * Math.PI * 2;
        ctx.moveTo(Math.cos(aLeft) * rInner, Math.sin(aLeft) * rInner);
        ctx.lineTo(Math.cos(aTip) * rTip, Math.sin(aTip) * rTip);
        ctx.lineTo(Math.cos(aRight) * rInner, Math.sin(aRight) * rInner);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      // Inner solar medallion
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 193, 75, ${(baseAlpha * 0.42).toFixed(3)})`;
      ctx.fill();
      ctx.stroke();
    }

    // 3. Concentric beaded dot orbit + radial comb ticks (outer corona band on Stages 0 & 9)
    const rBead = outerRadius * (isCeremonialSvgStage ? 0.85 : 0.55);
    ctx.fillStyle = `rgba(247, 243, 232, ${(baseAlpha * 0.92).toFixed(3)})`;
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * rBead, Math.sin(a) * rBead, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = `rgba(247, 243, 232, ${(baseAlpha * 0.62).toFixed(3)})`;
    ctx.lineWidth = 0.95;
    const rTickIn = outerRadius * (isCeremonialSvgStage ? 0.75 : 0.64);
    const rTickOut = outerRadius * (isCeremonialSvgStage ? 0.79 : 0.71);
    ctx.beginPath();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.moveTo(Math.cos(a) * rTickIn, Math.sin(a) * rTickIn);
      ctx.lineTo(Math.cos(a) * rTickOut, Math.sin(a) * rTickOut);
    }
    ctx.stroke();

    // 4. 8 stylized bronze-gold Chim Lạc accents orbiting serenely
    const rChim = outerRadius * 0.81;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.save();
      ctx.rotate(a);
      ctx.translate(0, -rChim);

      const s = outerRadius * 0.00145;
      ctx.scale(s, s);
      ctx.fillStyle = `rgba(240, 193, 75, ${(baseAlpha * 0.92).toFixed(3)})`;
      ctx.strokeStyle = `rgba(247, 243, 232, ${(baseAlpha * 0.95).toFixed(3)})`;
      ctx.lineWidth = 1.2 / Math.max(0.4, s);

      // Stylized Đông Sơn Chim Lạc crest & swept wings
      ctx.beginPath();
      ctx.moveTo(-28, 3);
      ctx.lineTo(-4, -5);
      ctx.lineTo(22, -2);
      ctx.lineTo(36, -6);
      ctx.lineTo(20, 4);
      ctx.lineTo(-6, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.quadraticCurveTo(2, -22, 18, -16);
      ctx.quadraticCurveTo(8, -12, 2, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();

    // Subtle concentric stage pulse rings
    if (auraState.ringPresence > 0.05) {
      const ax = width * auraState.xRatio - ptrX * 5 * pOffset;
      const ay = height * auraState.yRatio - ptrY * 4 * pOffset;
      const baseR = Math.min(width, height) * 0.18;
      const pulse = isAnimationDisabled() ? 0 : Math.sin(t * 0.58) * 5;
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const r = baseR * (1 + i * 0.48) + pulse * (i + 1) * 0.32;
        const alpha = auraState.ringPresence * (0.095 - i * 0.02);
        ctx.beginPath();
        ctx.arc(ax, ay, r, 0, Math.PI * 2);
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(240, 193, 75, ${alpha.toFixed(3)})`
            : `rgba(247, 243, 232, ${(alpha * 0.78).toFixed(3)})`;
        ctx.lineWidth = i === 0 ? 1.3 : 0.95;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawStarfieldMotesAndBokeh(t, dt) {
    const pMul = isAnimationDisabled() ? 0 : 1;
    const videoAtten = currentStage === 1 ? 0.36 : 1.0;

    // 1. 85 Distant Twinkling Stars
    ctx.fillStyle = '#FFFDF5';
    for (let i = 0; i < farStars.length; i++) {
      const st = farStars[i];
      const sx = st.nx * width - ptrX * st.parallax * pMul;
      const sy = st.ny * height - ptrY * st.parallax * 0.65 * pMul;
      const twinkle = isAnimationDisabled()
        ? 0.85
        : 0.58 + 0.42 * Math.sin(t * st.twinkleSpeed + st.twinklePhase);
      ctx.globalAlpha = Math.min(0.88, st.baseAlpha * twinkle * (currentStage === 1 ? 0.65 : 1.0));
      ctx.beginPath();
      ctx.arc(sx, sy, st.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. 45 Drifting Golden-Ivory Motes (starHaloSprite)
    if (starHaloSprite) {
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const yNorm = isAnimationDisabled() ? m.ny : (((m.ny - t * m.speedY) % 1) + 1) % 1;
        const sway = isAnimationDisabled() ? 0 : Math.sin(t * 0.68 + m.phase) * 11;
        const mx = m.nx * width + sway - ptrX * m.parallax * pMul;
        const my = yNorm * height - ptrY * m.parallax * 0.65 * pMul;
        const twinkle = isAnimationDisabled() ? 0.82 : 0.60 + 0.40 * Math.sin(t * 1.15 + m.phase);

        ctx.globalAlpha = Math.min(0.75, m.alpha * twinkle * videoAtten);
        ctx.drawImage(starHaloSprite, mx - m.size * 0.5, my - m.size * 0.5, m.size, m.size);
      }
    }

    // 3. 14 Soft Outer Bokeh Orbs (bokehOrbSprite)
    if (bokehOrbSprite) {
      for (let i = 0; i < bokehOrbs.length; i++) {
        const bk = bokehOrbs[i];
        if (!isAnimationDisabled() && dt > 0) {
          bk.nx += bk.vx * dt;
          bk.ny += bk.vy * dt;
          if (bk.ny < -0.06) bk.ny = 0.96;
          if (bk.nx < -0.06) bk.nx = 1.04;
          if (bk.nx > 1.06) bk.nx = -0.04;
        }
        const pulse = isAnimationDisabled() ? 0.8 : 0.68 + 0.32 * Math.sin(t * 0.72 + bk.phase);
        const bx = bk.nx * width - ptrX * bk.parallax * pMul;
        const by = bk.ny * height - ptrY * bk.parallax * 0.65 * pMul;

        ctx.globalAlpha = bk.alpha * pulse * videoAtten;
        ctx.drawImage(bokehOrbSprite, bx - bk.size * 0.5, by - bk.size * 0.5, bk.size, bk.size);
      }
    }

    ctx.globalAlpha = 1;
  }

  function drawKnowledgeParticleWaves(t, dt) {
    if (isAnimationDisabled() || currentStage === 1 || waveParticles.length === 0 || !starHaloSprite) {
      return;
    }

    ctx.save();
    ctx.strokeStyle = 'rgba(247, 243, 232, 0.22)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();

    for (let i = waveParticles.length - 1; i >= 0; i--) {
      const wp = waveParticles[i];
      if (wp.delay > 0) {
        wp.delay -= dt;
        continue;
      }

      wp.life += dt;
      wp.u += wp.speed * dt;

      if (wp.life >= wp.maxLife || wp.u >= 1.05) {
        waveParticles.splice(i, 1);
        continue;
      }

      const u = Math.max(0, Math.min(1, wp.u));
      const inv = 1 - u;
      const { p0, p1, p2 } = wp.arc;
      // Quadratic Bezier curve + organic harmonic ripple
      const ripple = Math.sin(u * 10 + t * 1.8 + wp.phase) * 0.012;
      const nx = inv * inv * p0.x + 2 * inv * u * p1.x + u * u * p2.x + wp.spreadX;
      const ny = inv * inv * p0.y + 2 * inv * u * p1.y + u * u * p2.y + wp.spreadY + ripple;

      const fadeIn = Math.min(1, u / 0.14);
      const fadeOut = Math.min(1, (1.0 - u) / 0.18);
      const safeAtten = getCenterSafeAttenuation(nx, ny);
      const alpha = wp.alpha * Math.min(fadeIn, fadeOut) * safeAtten;

      if (alpha <= 0.025) continue;

      const px = nx * width;
      const py = ny * height;

      if (i % 3 === 0) {
        const uPrev = Math.max(0, u - 0.032);
        const invPrev = 1 - uPrev;
        const prevX = (invPrev * invPrev * p0.x + 2 * invPrev * uPrev * p1.x + uPrev * uPrev * p2.x + wp.spreadX) * width;
        const prevY = (invPrev * invPrev * p0.y + 2 * invPrev * uPrev * p1.y + uPrev * uPrev * p2.y + wp.spreadY + ripple) * height;
        ctx.moveTo(px, py);
        ctx.lineTo(prevX, prevY);
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(starHaloSprite, px - wp.size * 0.5, py - wp.size * 0.5, wp.size, wp.size);
    }

    ctx.globalAlpha = 0.45;
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawLeavesAndBirds(t, dt) {
    if (isAnimationDisabled() || currentStage === 1) return;

    // 1. 20 Botanical Leaves strictly in outer safe corridors (x < 0.14 & x > 0.86, width > 640)
    if (width > 640 && leafSprites.length > 0) {
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];
        const ly = (((leaf.yRatio + t * leaf.speedY) % 1) + 1) % 1 * height;
        const rawX = leaf.xRatio * width + Math.sin(t * leaf.swayFreq + leaf.rotPhase) * leaf.swayAmp;
        // Clamp strictly inside outer safe corridors
        const lx = leaf.isLeft
          ? Math.min(width * 0.132, Math.max(10, rawX))
          : Math.max(width * 0.868, Math.min(width - 10, rawX));
        const rot = leaf.rotPhase + t * leaf.rotSpeed;
        const roll = leaf.rollPhase + t * leaf.rollSpeed;
        const flip3D = 0.34 + 0.66 * Math.abs(Math.cos(roll));
        const sprite = leafSprites[leaf.spriteIdx % leafSprites.length];

        ctx.save();
        ctx.globalAlpha = leaf.alpha;
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        ctx.scale(leaf.scale * flip3D, leaf.scale);
        ctx.drawImage(sprite, -18, -18, 36, 36);
        ctx.restore();
      }
    }

    // 2. Continuous Staggered Multi-Depth Bird Flocks (Chim Lạc, Hạc trắng, Bồ câu trắng)
    for (let fIdx = flocks.length - 1; fIdx >= 0; fIdx--) {
      const flock = flocks[fIdx];
      flock.x += flock.vx * dt;
      flock.y += flock.vy * dt;
      flock.life += dt;

      const fadeIn = Math.min(1, flock.life / 1.0);
      const fadeOut = Math.min(1, Math.max(0, (flock.maxLife - flock.life) / 1.2));
      const baseAlpha = flock.alphaMul * Math.min(fadeIn, fadeOut);

      if (baseAlpha > 0.015) {
        for (let b = 0; b < flock.birds.length; b++) {
          const bird = flock.birds[b];
          const bx = flock.x + bird.offsetX;
          const by = flock.y + bird.offsetY + Math.sin(t * 1.25 + b) * 2.6;
          drawArticulatedBird(
            flock.kind,
            bx,
            by,
            bird.scale,
            flock.dir,
            bird.wingPhase + flock.life * bird.wingSpeed,
            flock.tier,
            baseAlpha
          );
        }
      }

      if (flock.life >= flock.maxLife) {
        flocks.splice(fIdx, 1);
      }
    }

    // 3. Auto / Triggered Grand Sky Wave Birds (12–16 mixed birds sweeping upper sky y: 4%..24%)
    for (let i = grandWaveBirds.length - 1; i >= 0; i--) {
      const gb = grandWaveBirds[i];
      if (gb.delay > 0) {
        gb.delay -= dt;
        continue;
      }

      gb.life += dt;
      gb.nx += gb.vx * dt;
      gb.ny += (gb.vy + Math.sin(t * 1.6 + gb.phase) * 0.008) * dt;
      gb.ny = Math.max(Math.max(0.078, 72 / Math.max(height, 400)), Math.min(0.29, gb.ny));

      const progress = gb.life / gb.maxLife;
      const fadeIn = Math.min(1, progress / 0.14);
      const fadeOut = Math.min(1, Math.max(0, (1 - progress) / 0.18));
      const tierAlpha = gb.tier === 'near' ? 0.94 : gb.tier === 'mid' ? 0.80 : 0.62;
      const alpha = tierAlpha * Math.min(fadeIn, fadeOut);

      if (alpha > 0.02) {
        const bx = gb.nx * width;
        const by = gb.ny * height;
        drawArticulatedBird(
          gb.kind,
          bx,
          by,
          gb.scale,
          gb.dir,
          gb.wingPhase + t * gb.wingSpeed,
          gb.tier,
          alpha
        );
      }

      if (gb.life >= gb.maxLife || gb.nx < -0.22 || gb.nx > 1.22) {
        grandWaveBirds.splice(i, 1);
      }
    }

    ctx.globalAlpha = 1;
  }

  // =========================================================================
  // 5. MAIN FRAME RENDER & UNIFIED RAF LOOP
  // =========================================================================
  function renderFrame(t, dt = 0) {
    if (!isAnimationDisabled() && dt > 0) {
      stepAuraInterpolation(dt);
    }

    drawSkyAndVolumetricRays(t);
    drawDriftingClouds(dt);
    drawDongSonBronzeDrumLayer(t);
    drawStarfieldMotesAndBokeh(t, dt);
    drawKnowledgeParticleWaves(t, dt);
    drawLeavesAndBirds(t, dt);
  }

  function resize() {
    width = window.innerWidth || 1280;
    height = window.innerHeight || 720;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateStageTarget(currentStage);
    renderFrame(elapsed, 0);
  }

  function tick(ts) {
    if (isAnimationDisabled() || isTabHidden) {
      rafId = null;
      return;
    }

    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;
    elapsed += dt;

    // Rolling FPS meter
    fpsFrames += 1;
    const now = performance.now();
    if (now - fpsLastCheck >= 450) {
      currentFps = Math.min(60, Math.round((fpsFrames * 1000) / (now - fpsLastCheck)));
      fpsFrames = 0;
      fpsLastCheck = now;
    }

    if (currentStage !== 1) {
      // Continuous staggered flocks (keep 3–4 active)
      flockTimer -= dt;
      if (flockTimer <= 0) {
        spawnFlock();
        flockTimer = 2.2 + Math.random() * 2.3; // 2.2–4.5s cadence
      }
      if (flocks.length < 3) {
        spawnFlock();
      }

      // Recurring Golden Knowledge Particle Wave every 8–11s
      knowledgeWaveTimer -= dt;
      if (knowledgeWaveTimer <= 0) {
        spawnKnowledgeParticleWave(78, false);
        knowledgeWaveTimer = 8.0 + Math.random() * 3.0;
      }

      // Auto Grand Sky Wave every 10–14s
      grandSkyWaveTimer -= dt;
      if (grandSkyWaveTimer <= 0) {
        grandWavesTriggered += 1;
        spawnGrandSkyWave(14);
        grandSkyWaveTimer = 10.0 + Math.random() * 4.0;
      }
    }

    renderFrame(elapsed, dt);
    rafId = window.requestAnimationFrame(tick);
  }

  function syncLoopState() {
    if (isAnimationDisabled()) {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      flocks.length = 0;
      grandWaveBirds.length = 0;
      waveParticles.length = 0;
      ptrX = 0;
      ptrY = 0;
      targetPtrX = 0;
      targetPtrY = 0;
      currentFps = 0;
      snapAuraState();
      renderFrame(elapsed, 0);
    } else if (isTabHidden) {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (rafId === null) {
      lastTs = 0;
      fpsFrames = 0;
      fpsLastCheck = performance.now();
      if (currentStage !== 1 && flocks.length === 0) {
        preseedLandingLife();
      }
      rafId = window.requestAnimationFrame(tick);
    }
  }

  const onReducedMotionChange = (e) => {
    prefersReduced = e.matches;
    syncLoopState();
  };

  const onVisibilityChange = () => {
    isTabHidden = document.hidden;
    syncLoopState();
  };

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  reducedMotionQuery?.addEventListener?.('change', onReducedMotionChange);

  buildOffscreenSprites();
  resize();
  syncLoopState();

  return {
    setStage(stage) {
      updateStageTarget(stage);
      if (stage === 1) {
        flocks.length = 0;
        grandWaveBirds.length = 0;
        waveParticles.length = 0;
      } else if (!isAnimationDisabled() && flocks.length === 0) {
        preseedLandingLife();
      }
      if (isAnimationDisabled()) {
        snapAuraState();
        renderFrame(elapsed, 0);
      }
    },
    setLiteMode(enabled) {
      liteMode = Boolean(enabled) || prefersReduced;
      syncLoopState();
    },
    setMotionOff(enabled) {
      motionOff = Boolean(enabled);
      syncLoopState();
    },
    triggerGrandWave(reason) {
      triggerGrandWave(reason);
    },
    setPointer(nx, ny) {
      if (isAnimationDisabled()) {
        targetPtrX = 0;
        targetPtrY = 0;
        return;
      }
      const cx = Number.isFinite(nx) ? Math.max(-1, Math.min(1, nx)) : 0;
      const cy = Number.isFinite(ny) ? Math.max(-1, Math.min(1, ny)) : 0;
      targetPtrX = cx;
      targetPtrY = cy;
    },
    getMetrics() {
      let regularBirds = 0;
      for (let i = 0; i < flocks.length; i++) {
        regularBirds += flocks[i].birds.length;
      }
      const hasGrandFlock = grandWaveBirds.length > 0;
      const active = !isAnimationDisabled();
      return {
        flocksCount: flocks.length + (hasGrandFlock ? 1 : 0),
        totalBirds: regularBirds + grandWaveBirds.length,
        leavesCount: active && currentStage !== 1 && width > 640 ? leaves.length : 0,
        motesCount: motes.length,
        waveCount: waveParticles.length,
        grandWavesTriggered,
        fps: active ? currentFps : 0,
        isPaused: !active || isTabHidden,
      };
    },
    destroy() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotionQuery?.removeEventListener?.('change', onReducedMotionChange);
    },
  };
}
