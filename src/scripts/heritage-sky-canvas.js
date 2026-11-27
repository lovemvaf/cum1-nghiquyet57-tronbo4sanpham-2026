/**
 * LẠC HỒNG SỐ — Continuous Multi-Layer Heritage Sky Canvas (Pure Canvas 2D)
 * Strictly behind UI (z-index: 1, pointer-events: none).
 *
 * Layers:
 *  - Layer A (Heritage): Ultra-slow rotating Đông Sơn bronze drum concentric pattern (110s/turn; static on <=768px & Lite/MotionOff).
 *  - Layer B (Sky): Continuous staggered flocks every 3.2–7.2s — Chim Lạc, distant Hạc trắng, Bồ câu trắng
 *    gliding gracefully along upper & outer safe corridors (<=3 foreground silhouettes, never blocking text/video/QR).
 *  - Layer C (Nature): Sparse, slow olive/champagne leaves drifting along outer margins (ZERO flower storms).
 *  - Layer D (Light): Subtle golden motes & soft concentric aura matched to each stage's mood.
 *    On Stage 1 (Video), dims & pauses foreground birds/leaves outside the 9:16 frame for 100% viewing focus.
 */

const FLOCK_TYPES = ['chim-lac', 'hac-trang', 'bo-cau'];

export function createHeritageSkyCanvas(canvas) {
  if (!canvas || !canvas.getContext) {
    return {
      setStage: () => {},
      setLiteMode: () => {},
      setMotionOff: () => {},
      destroy: () => {},
    };
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let prefersReduced = reducedMotionQuery?.matches || false;
  let liteMode = prefersReduced;
  let motionOff = false;

  let currentStage = 0;
  let rafId = null;
  let lastTs = 0;
  let elapsed = 0;
  let flockTimer = 3.8;
  let flockCycleIdx = 0;

  const auraState = {
    xRatio: 0.5,
    yRatio: 0.46,
    targetXRatio: 0.5,
    targetYRatio: 0.46,
    strength: 0.16,
    targetStrength: 0.16,
    ringPresence: 0.24,
    targetRingPresence: 0.24,
    horizonGlow: 0.1,
    targetHorizonGlow: 0.1,
    sunriseMix: 0.14,
    targetSunriseMix: 0.14,
    videoDim: 0,
    targetVideoDim: 0,
  };

  const MOTES_COUNT = 32;
  const motes = Array.from({ length: MOTES_COUNT }, (_, idx) => ({
    x: ((idx * 197) % 1000) / 1000,
    y: ((idx * 353) % 1000) / 1000,
    radius: 0.9 + (idx % 4) * 0.48,
    speedY: 0.0065 + (idx % 5) * 0.0028,
    phase: idx * 0.85,
    alpha: 0.14 + (idx % 5) * 0.06,
    warmCream: idx % 3 === 0,
  }));

  // Sparse olive/champagne leaves drifting strictly along outer left/right safe margins
  const LEAVES_COUNT = 8;
  const leaves = Array.from({ length: LEAVES_COUNT }, (_, idx) => {
    const isLeftMargin = idx % 2 === 0;
    const xBase = isLeftMargin ? 0.02 + (idx * 0.018) : 0.98 - (idx * 0.015);
    return {
      xRatio: Math.max(0.015, Math.min(0.985, xBase)),
      yRatio: (idx * 0.137) % 1,
      speedY: 0.014 + (idx % 3) * 0.004,
      swayAmp: 10 + (idx % 4) * 4,
      swayFreq: 0.55 + (idx % 3) * 0.18,
      rotPhase: idx * 1.1,
      rotSpeed: (idx % 2 === 0 ? 1 : -1) * (0.35 + (idx % 3) * 0.12),
      scale: 0.72 + (idx % 3) * 0.14,
      alpha: 0.24 + (idx % 3) * 0.06,
      champagne: idx % 2 === 1,
    };
  });

  const flocks = [];

  function isAnimationDisabled() {
    return motionOff || liteMode || prefersReduced;
  }

  function updateStageTarget(stage) {
    currentStage = stage;
    const isDesktop = width > 1024;
    const focalX = isDesktop ? 0.35 : 0.5;
    const focalY = isDesktop ? 0.48 : 0.36;

    if (stage === 0) {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.45;
      auraState.targetStrength = 0.17;
      auraState.targetRingPresence = 0.28;
      auraState.targetHorizonGlow = 0.1;
      auraState.targetSunriseMix = 0.14;
      auraState.targetVideoDim = 0;
    } else if (stage === 1) {
      // Video stage: calm dim atmosphere around 9:16 player
      auraState.targetXRatio = isDesktop ? 0.38 : 0.5;
      auraState.targetYRatio = 0.5;
      auraState.targetStrength = 0.09;
      auraState.targetRingPresence = 0.08;
      auraState.targetHorizonGlow = 0.04;
      auraState.targetSunriseMix = 0.04;
      auraState.targetVideoDim = 1;
    } else if (stage === 2 || stage === 3) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.19;
      auraState.targetRingPresence = stage === 3 ? 0.78 : 0.3;
      auraState.targetHorizonGlow = 0.12;
      auraState.targetSunriseMix = 0.2;
      auraState.targetVideoDim = 0;
    } else if (stage === 4) {
      // 03/05 Vision 2030->2045: dignified horizon glow
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.16;
      auraState.targetRingPresence = 0.16;
      auraState.targetHorizonGlow = 0.86;
      auraState.targetSunriseMix = 0.58;
      auraState.targetVideoDim = 0;
    } else if (stage === 5 || stage === 6) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.2;
      auraState.targetRingPresence = 0.32;
      auraState.targetHorizonGlow = stage === 6 ? 0.65 : 0.28;
      auraState.targetSunriseMix = stage === 6 ? 0.85 : 0.34;
      auraState.targetVideoDim = 0;
    } else if (stage === 7 || stage === 8) {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.44;
      auraState.targetStrength = 0.15;
      auraState.targetRingPresence = 0.22;
      auraState.targetHorizonGlow = 0.24;
      auraState.targetSunriseMix = 0.26;
      auraState.targetVideoDim = 0;
    } else {
      // Stage 9: Finale
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.45;
      auraState.targetStrength = 0.23;
      auraState.targetRingPresence = 0.36;
      auraState.targetHorizonGlow = 0.78;
      auraState.targetSunriseMix = 0.94;
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
    auraState.videoDim = auraState.targetVideoDim;
  }

  function stepAuraInterpolation() {
    const rate = 0.08;
    auraState.xRatio += (auraState.targetXRatio - auraState.xRatio) * rate;
    auraState.yRatio += (auraState.targetYRatio - auraState.yRatio) * rate;
    auraState.strength += (auraState.targetStrength - auraState.strength) * rate;
    auraState.ringPresence += (auraState.targetRingPresence - auraState.ringPresence) * rate;
    auraState.horizonGlow += (auraState.targetHorizonGlow - auraState.horizonGlow) * rate;
    auraState.sunriseMix += (auraState.targetSunriseMix - auraState.sunriseMix) * rate;
    auraState.videoDim += (auraState.targetVideoDim - auraState.videoDim) * rate;
  }

  function spawnFlock(prewarmXRatio = null) {
    if (flocks.length >= 2 || currentStage === 1 || isAnimationDisabled()) return;

    const kind = FLOCK_TYPES[flockCycleIdx % FLOCK_TYPES.length];
    flockCycleIdx += 1;

    // Alternate foreground (<=3 larger silhouettes) and distant high sky flocks
    const isDistant = kind === 'hac-trang' || flockCycleIdx % 2 === 0;
    const count = isDistant ? 4 : 3;
    const goRight = Math.random() > 0.32;
    const baseY = isDistant
      ? height * (0.042 + Math.random() * 0.055)
      : height * (0.075 + Math.random() * 0.065);
    const startX =
      prewarmXRatio !== null
        ? width * prewarmXRatio
        : goRight
          ? -110
          : width + 110;
    const speedMag = isDistant ? 40 + Math.random() * 14 : 56 + Math.random() * 16;
    const vx = (goRight ? 1 : -1) * speedMag;
    const vy = (Math.random() - 0.5) * 4.5;

    const birds = [];
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const row = Math.ceil(i / 2);
      const baseScale = isDistant ? 0.56 : 0.86;
      birds.push({
        offsetX: (goRight ? -1 : 1) * row * (isDistant ? 24 : 34),
        offsetY: side * row * (isDistant ? 10 : 14),
        scale: baseScale * (1 - row * 0.08),
        wingPhase: i * 0.8 + Math.random() * 0.4,
        wingSpeed: kind === 'bo-cau' ? 3.5 : 2.6 + Math.random() * 0.4,
      });
    }

    flocks.push({
      kind,
      isDistant,
      x: startX,
      y: baseY,
      vx,
      vy,
      dir: goRight ? 1 : -1,
      alphaMul: isDistant ? 0.46 : 0.78,
      life: prewarmXRatio !== null ? 2.5 : 0,
      maxLife: (width + 260) / speedMag,
      birds,
    });
  }

  function drawBirdSilhouette(kind, x, y, scale, dir, wingPhase, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir * scale, scale);
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const flap = Math.sin(wingPhase) * 6.5;

    if (kind === 'chim-lac') {
      // Stylized Đông Sơn Chim Lạc: golden body + cream outline + tail ribbons
      ctx.strokeStyle = 'rgba(247, 243, 232, 0.9)';
      ctx.fillStyle = 'rgba(240, 193, 75, 0.88)';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(-14, 1.5);
      ctx.quadraticCurveTo(-2, -1, 12, -2.5);
      ctx.lineTo(19, -4.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.quadraticCurveTo(-1, -13 - flap, 10, -16 - flap * 0.85);
      ctx.quadraticCurveTo(3, -8 - flap * 0.45, 4, -1);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 1.05;
      ctx.stroke();

      ctx.globalAlpha = alpha * 0.68;
      ctx.beginPath();
      ctx.moveTo(-13, 1.5);
      ctx.lineTo(-22, 4.5);
      ctx.moveTo(-12, 2);
      ctx.lineTo(-19, 6.2);
      ctx.stroke();
    } else if (kind === 'hac-trang') {
      // Distant graceful white crane: slender neck, swept cream wings
      ctx.strokeStyle = 'rgba(247, 243, 232, 0.85)';
      ctx.fillStyle = 'rgba(247, 243, 232, 0.55)';
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      ctx.moveTo(-13, 1);
      ctx.quadraticCurveTo(0, -1, 16, -3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.quadraticCurveTo(2, -11 - flap * 0.8, 9, -13 - flap * 0.75);
      ctx.quadraticCurveTo(3, -5, 4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Bồ câu trắng: compact rounded breast & soft arched wings
      ctx.strokeStyle = 'rgba(247, 243, 232, 0.9)';
      ctx.fillStyle = 'rgba(247, 243, 232, 0.76)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8.5, 3.2, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-2, -1);
      ctx.quadraticCurveTo(1, -11 - flap * 0.75, 8, -12 - flap * 0.7);
      ctx.quadraticCurveTo(3, -4, 3, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawOliveLeaf(x, y, rot, scale, alpha, champagne) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;

    ctx.fillStyle = champagne ? 'rgba(247, 243, 232, 0.72)' : 'rgba(181, 194, 152, 0.72)';
    ctx.strokeStyle = 'rgba(240, 193, 75, 0.45)';
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.quadraticCurveTo(5.5, -2, 0, 9);
    ctx.quadraticCurveTo(-5.5, -2, 0, -9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 7);
    ctx.stroke();

    ctx.restore();
  }

  function drawDongSonHeritageLayer(t) {
    const cx = width * 0.5;
    const cy = height * 0.52;
    const outerRadius = Math.max(width, height) * 0.48;
    // 110s full turn; static on mobile <= 768px or when motion disabled
    const shouldRotate = !isAnimationDisabled() && width > 768;
    const baseAngle = shouldRotate ? (t * Math.PI * 2) / 110 : 0.18;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(baseAngle);

    const videoScale = 1 - auraState.videoDim * 0.55;
    const ringAlpha = (currentStage === 9 ? 0.11 : currentStage === 0 ? 0.095 : 0.068) * videoScale;
    ctx.strokeStyle = `rgba(240, 193, 75, ${ringAlpha.toFixed(3)})`;
    ctx.lineWidth = 1.05;

    for (let rIdx = 0; rIdx < 4; rIdx++) {
      const r = outerRadius * (0.64 + rIdx * 0.11);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = `rgba(247, 243, 232, ${(ringAlpha * 0.78).toFixed(3)})`;
    ctx.lineWidth = 0.95;
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const rIn = outerRadius * 0.75;
      const rOut = outerRadius * 0.79;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
      ctx.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawLightAndAuraLayer(t) {
    const ax = width * auraState.xRatio;
    const ay = height * auraState.yRatio;
    const auraRadius = Math.max(width, height) * 0.45;
    const auraGrad = ctx.createRadialGradient(ax, ay, 8, ax, ay, auraRadius);
    auraGrad.addColorStop(0, `rgba(247, 243, 232, ${auraState.strength.toFixed(3)})`);
    auraGrad.addColorStop(0.42, `rgba(240, 193, 75, ${(auraState.strength * 0.4).toFixed(3)})`);
    auraGrad.addColorStop(1, 'rgba(13, 43, 82, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, width, height);

    if (auraState.horizonGlow > 0.04) {
      const horizonY = height * 0.76;
      const bandGrad = ctx.createLinearGradient(0, horizonY - height * 0.24, 0, height);
      bandGrad.addColorStop(0, 'rgba(240, 193, 75, 0)');
      bandGrad.addColorStop(0.55, `rgba(240, 193, 75, ${(0.07 * auraState.horizonGlow).toFixed(3)})`);
      bandGrad.addColorStop(1, `rgba(247, 243, 232, ${(0.05 * auraState.horizonGlow).toFixed(3)})`);
      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, horizonY - height * 0.24, width, height);
    }

    if (auraState.sunriseMix > 0.05) {
      const sx = currentStage === 4 ? width * 0.86 : width * 0.5;
      const sy = currentStage === 4 ? height * 0.16 : height * 0.22;
      const sr = Math.max(width, height) * 0.36;
      const breathe = isAnimationDisabled() ? 1 : 1 + Math.sin(t * 0.42) * 0.024;
      const sunGrad = ctx.createRadialGradient(sx, sy, 6, sx, sy, sr * breathe);
      sunGrad.addColorStop(0, `rgba(240, 193, 75, ${(0.14 * auraState.sunriseMix).toFixed(3)})`);
      sunGrad.addColorStop(0.48, `rgba(247, 243, 232, ${(0.055 * auraState.sunriseMix).toFixed(3)})`);
      sunGrad.addColorStop(1, 'rgba(13, 43, 82, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
    }

    if (auraState.ringPresence > 0.05) {
      const baseR = Math.min(width, height) * 0.18;
      const pulse = isAnimationDisabled() ? 0 : Math.sin(t * 0.6) * 5;
      ctx.save();
      for (let i = 0; i < 3; i++) {
        const r = baseR * (1 + i * 0.48) + pulse * (i + 1) * 0.32;
        const alpha = auraState.ringPresence * (0.1 - i * 0.022);
        ctx.beginPath();
        ctx.arc(ax, ay, r, 0, Math.PI * 2);
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(240, 193, 75, ${alpha.toFixed(3)})`
            : `rgba(247, 243, 232, ${(alpha * 0.75).toFixed(3)})`;
        ctx.lineWidth = i === 0 ? 1.4 : 1.0;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function renderFrame(t) {
    if (!isAnimationDisabled()) {
      stepAuraInterpolation();
    }

    // Deep Navy -> Youth Blue museum gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width * 0.35, height);
    bgGrad.addColorStop(0, '#07172E');
    bgGrad.addColorStop(0.48, '#0D2B52');
    bgGrad.addColorStop(1, '#1464B4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    if (auraState.videoDim > 0.02) {
      ctx.fillStyle = `rgba(4, 12, 26, ${(auraState.videoDim * 0.38).toFixed(3)})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Layer D: Soft lighting & stage mood aura
    drawLightAndAuraLayer(t);

    // Layer A: Đông Sơn concentric bronze drum heritage rings
    drawDongSonHeritageLayer(t);

    // Layer D2: Subtle floating golden motes (reduced on Video stage and static when disabled)
    const moteScale = currentStage === 1 ? 0.35 : 1;
    for (let i = 0; i < MOTES_COUNT; i++) {
      const m = motes[i];
      const yPos = isAnimationDisabled()
        ? m.y * height
        : ((((m.y - t * m.speedY) % 1) + 1) % 1) * height;
      const sway = isAnimationDisabled() ? 0 : Math.sin(t * 0.7 + m.phase) * 10;
      const xPos = m.x * width + sway;
      const twinkle = isAnimationDisabled() ? 0.85 : 0.62 + 0.38 * Math.sin(t * 1.25 + m.phase);
      const a = Math.min(0.36, m.alpha * twinkle * moteScale);

      ctx.beginPath();
      ctx.arc(xPos, yPos, m.radius, 0, Math.PI * 2);
      ctx.fillStyle = m.warmCream
        ? `rgba(247, 243, 232, ${a.toFixed(3)})`
        : `rgba(240, 193, 75, ${a.toFixed(3)})`;
      ctx.fill();
    }

    // Layer B & C: Paused on Video stage (currentStage === 1) or when motion disabled
    if (!isAnimationDisabled() && currentStage !== 1) {
      // Outer-margin olive/champagne leaves (desktop / wider viewports)
      if (width > 640) {
        for (let i = 0; i < LEAVES_COUNT; i++) {
          const leaf = leaves[i];
          const ly = (((leaf.yRatio + t * leaf.speedY) % 1) + 1) % 1 * height;
          const lx = leaf.xRatio * width + Math.sin(t * leaf.swayFreq + leaf.rotPhase) * leaf.swayAmp;
          const rot = leaf.rotPhase + t * leaf.rotSpeed;
          drawOliveLeaf(lx, ly, rot, leaf.scale, leaf.alpha, leaf.champagne);
        }
      }

      // Upper & outer safe-corridor Chim Lạc, Hạc trắng, Bồ câu trắng flocks
      for (let fIdx = flocks.length - 1; fIdx >= 0; fIdx--) {
        const flock = flocks[fIdx];
        const fadeIn = Math.min(1, flock.life / 1.0);
        const fadeOut = Math.min(1, Math.max(0, (flock.maxLife - flock.life) / 1.2));
        const baseAlpha = flock.alphaMul * Math.min(fadeIn, fadeOut);

        if (baseAlpha > 0.01) {
          for (let b = 0; b < flock.birds.length; b++) {
            const bird = flock.birds[b];
            const bx = flock.x + bird.offsetX;
            const by = flock.y + bird.offsetY + Math.sin(t * 1.15 + b) * 2.5;
            drawBirdSilhouette(
              flock.kind,
              bx,
              by,
              bird.scale,
              flock.dir,
              bird.wingPhase + flock.life * bird.wingSpeed,
              baseAlpha
            );
          }
        }

        if (flock.life >= flock.maxLife) {
          flocks.splice(fIdx, 1);
        }
      }
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateStageTarget(currentStage);
    renderFrame(elapsed);
  }

  function tick(ts) {
    if (isAnimationDisabled()) {
      rafId = null;
      return;
    }

    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
    lastTs = ts;
    elapsed += dt;

    if (currentStage !== 1) {
      flockTimer -= dt;
      if (flockTimer <= 0) {
        spawnFlock();
        flockTimer = 3.2 + Math.random() * 4.0; // Continuous staggered 3.2–7.2s cadence
      }
      for (let i = 0; i < flocks.length; i++) {
        flocks[i].x += flocks[i].vx * dt;
        flocks[i].y += flocks[i].vy * dt;
        flocks[i].life += dt;
      }
    }

    renderFrame(elapsed);
    rafId = window.requestAnimationFrame(tick);
  }

  function syncLoopState() {
    if (isAnimationDisabled()) {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      flocks.length = 0;
      snapAuraState();
      renderFrame(elapsed);
    } else if (rafId === null) {
      lastTs = 0;
      if (flocks.length === 0 && currentStage !== 1) {
        spawnFlock(0.18);
      }
      rafId = window.requestAnimationFrame(tick);
    }
  }

  const onReducedMotionChange = (e) => {
    prefersReduced = e.matches;
    syncLoopState();
  };

  window.addEventListener('resize', resize);
  reducedMotionQuery?.addEventListener?.('change', onReducedMotionChange);

  resize();
  syncLoopState();

  return {
    setStage(stage) {
      updateStageTarget(stage);
      if (isAnimationDisabled()) {
        snapAuraState();
        renderFrame(elapsed);
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
    destroy() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('resize', resize);
      reducedMotionQuery?.removeEventListener?.('change', onReducedMotionChange);
    },
  };
}
