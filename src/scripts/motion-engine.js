/**
 * LẠC HỒNG SỐ — GSAP Motion & Stage Transition Engine
 * Coordinates smooth non-strobing 0.55–0.85s stage transitions across stages 0..9
 * (golden radial light veil, Đông Sơn solar pulse, soaring Chim Lạc arc, cross-depth entrance).
 * Instant clean snap when Lite Mode, Motion Off, or prefers-reduced-motion is active.
 */

import gsap from 'gsap';

export function createMotionEngine() {
  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let prefersReduced = reducedMotionQuery?.matches || false;
  let liteMode = prefersReduced;
  let motionOff = false;
  let transitionTimeline = null;
  let transitionResolve = null;
  let stageTimeline = null;

  function isStatic() {
    return liteMode || motionOff || prefersReduced;
  }

  function pickTransitionCue(fromStage, toStage) {
    if (fromStage === 0 && toStage === 1) return 'dongson-ripple';
    if (toStage === 9) return 'finale-bloom';
    if (toStage === 4 || toStage === 6 || (fromStage === 4 && toStage === 3)) return 'chimlac-flight';
    if (toStage >= 2 && toStage <= 6) return 'soft-parallax';
    return 'light-sweep';
  }

  function resetTransitionLayers() {
    const overlay = document.getElementById('scene-transition-overlay');
    const veil = document.getElementById('transition-veil');
    const sweep = document.getElementById('transition-light-sweep');
    const ripple = document.getElementById('transition-dongson-ripple');
    const flight = document.getElementById('transition-chimlac-flight');

    if (overlay) gsap.set(overlay, { autoAlpha: 0 });
    if (veil) gsap.set(veil, { autoAlpha: 0 });
    if (sweep) gsap.set(sweep, { autoAlpha: 0, xPercent: -45 });
    if (ripple) gsap.set(ripple, { autoAlpha: 0, scale: 0.78 });
    if (flight) gsap.set(flight, { autoAlpha: 0, xPercent: -22, yPercent: 10 });
  }

  function queryVisible(selectors) {
    return Array.from(document.querySelectorAll(selectors)).filter((el) => !el.hidden);
  }

  function playStageTransition(fromStage, toStage, onMidpoint) {
    if (transitionTimeline) {
      transitionTimeline.kill();
      transitionTimeline = null;
    }
    if (transitionResolve) {
      const prevResolve = transitionResolve;
      transitionResolve = null;
      prevResolve('interrupted');
    }

    const overlay = document.getElementById('scene-transition-overlay');
    const veil = document.getElementById('transition-veil');
    const sweep = document.getElementById('transition-light-sweep');
    const ripple = document.getElementById('transition-dongson-ripple');
    const flight = document.getElementById('transition-chimlac-flight');

    if (isStatic() || !overlay || fromStage === toStage) {
      if (typeof onMidpoint === 'function') onMidpoint();
      resetTransitionLayers();
      return Promise.resolve('instant');
    }

    const cue = pickTransitionCue(fromStage, toStage);
    overlay.setAttribute('data-cue', cue);
    resetTransitionLayers();

    let midpointFired = false;
    const triggerMidpoint = () => {
      if (!midpointFired) {
        midpointFired = true;
        if (typeof onMidpoint === 'function') onMidpoint();
      }
    };

    return new Promise((resolve) => {
      transitionResolve = resolve;
      const tl = gsap.timeline({
        onComplete: () => {
          triggerMidpoint();
          resetTransitionLayers();
          if (transitionTimeline === tl) transitionTimeline = null;
          if (transitionResolve === resolve) transitionResolve = null;
          resolve('completed');
        },
      });
      transitionTimeline = tl;

      gsap.set(overlay, { autoAlpha: 1 });

      if (cue === 'dongson-ripple') {
        // 0.68s Đông Sơn solar pulse + soft golden radial veil
        if (veil) tl.to(veil, { autoAlpha: 0.28, duration: 0.24, ease: 'power2.out' }, 0);
        if (ripple) {
          tl.fromTo(
            ripple,
            { autoAlpha: 0.62, scale: 0.76 },
            { autoAlpha: 0, scale: 1.24, duration: 0.66, ease: 'power2.out' },
            0.02
          );
        }
        tl.call(triggerMidpoint, null, 0.24);
        if (veil) tl.to(veil, { autoAlpha: 0, duration: 0.42, ease: 'power2.out' }, 0.26);
      } else if (cue === 'chimlac-flight') {
        // 0.72s soaring Chim Lạc arc + gentle radial veil & solar pulse
        if (veil) tl.to(veil, { autoAlpha: 0.24, duration: 0.22, ease: 'power2.out' }, 0);
        if (ripple) {
          tl.fromTo(
            ripple,
            { autoAlpha: 0.34, scale: 0.84 },
            { autoAlpha: 0, scale: 1.18, duration: 0.62, ease: 'power2.out' },
            0.04
          );
        }
        if (flight) {
          tl.fromTo(
            flight,
            { autoAlpha: 0, xPercent: -24, yPercent: 12 },
            { autoAlpha: 0.88, xPercent: 16, yPercent: -10, duration: 0.36, ease: 'power2.out' },
            0.03
          ).to(flight, { autoAlpha: 0, xPercent: 48, yPercent: -24, duration: 0.34, ease: 'power2.in' }, 0.38);
        }
        tl.call(triggerMidpoint, null, 0.24);
        if (veil) tl.to(veil, { autoAlpha: 0, duration: 0.42, ease: 'power2.out' }, 0.28);
      } else if (cue === 'finale-bloom') {
        // 0.82s ceremonial Finale bloom: radial light veil + Đông Sơn pulse + soaring Chim Lạc arc
        if (veil) tl.to(veil, { autoAlpha: 0.34, duration: 0.26, ease: 'power2.out' }, 0);
        if (ripple) {
          tl.fromTo(
            ripple,
            { autoAlpha: 0.64, scale: 0.78 },
            { autoAlpha: 0, scale: 1.32, duration: 0.78, ease: 'power2.out' },
            0.03
          );
        }
        if (flight) {
          tl.fromTo(
            flight,
            { autoAlpha: 0, xPercent: -18, yPercent: 10 },
            { autoAlpha: 0.84, xPercent: 34, yPercent: -18, duration: 0.74, ease: 'power2.out' },
            0.06
          );
        }
        tl.call(triggerMidpoint, null, 0.28);
        if (veil) tl.to(veil, { autoAlpha: 0, duration: 0.50, ease: 'power2.out' }, 0.32);
      } else if (cue === 'soft-parallax') {
        // 0.60s smooth cross-depth sweep across poster stages
        if (veil) tl.to(veil, { autoAlpha: 0.20, duration: 0.18, ease: 'power2.out' }, 0);
        if (sweep) {
          tl.fromTo(
            sweep,
            { autoAlpha: 0, xPercent: -42 },
            { autoAlpha: 0.46, xPercent: 16, duration: 0.30, ease: 'power2.out' },
            0.02
          ).to(sweep, { autoAlpha: 0, xPercent: 52, duration: 0.28, ease: 'power2.in' }, 0.32);
        }
        tl.call(triggerMidpoint, null, 0.22);
        if (veil) tl.to(veil, { autoAlpha: 0, duration: 0.36, ease: 'power2.out' }, 0.24);
      } else {
        // 0.62s radiant diagonal light sweep
        if (veil) tl.to(veil, { autoAlpha: 0.22, duration: 0.20, ease: 'power2.out' }, 0);
        if (sweep) {
          tl.fromTo(
            sweep,
            { autoAlpha: 0, xPercent: -44 },
            { autoAlpha: 0.50, xPercent: 44, duration: 0.56, ease: 'power2.inOut' },
            0.02
          );
        }
        tl.call(triggerMidpoint, null, 0.22);
        if (veil) tl.to(veil, { autoAlpha: 0, duration: 0.38, ease: 'power2.out' }, 0.24);
      }
    });
  }

  function animateStageEntrance(stage) {
    if (stageTimeline) {
      stageTimeline.kill();
      stageTimeline = null;
    }

    if (isStatic()) return;

    const tl = gsap.timeline();
    stageTimeline = tl;

    if (stage === 0) {
      const heroItems = queryVisible('#stage-landing .landing-hero-col > *');
      const storyPills = queryVisible('#stage-landing .story-rail-pill');
      const showcaseCards = queryVisible('#stage-landing .landing-showcase-card');

      if (heroItems.length) {
        tl.fromTo(
          heroItems,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            stagger: 0.045,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.02
        );
      } else {
        // Fallback for legacy landing DOM structure
        const legacyItems = queryVisible(
          '#stage-landing .landing-hero-copy > *, #stage-landing .product-overview-card, #stage-landing .landing-actions'
        );
        if (legacyItems.length) {
          tl.fromTo(
            legacyItems,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.045,
              ease: 'power2.out',
              clearProps: 'transform,opacity,visibility',
            },
            0.02
          );
        }
      }

      if (storyPills.length) {
        tl.fromTo(
          storyPills,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.14
        );
      }

      if (showcaseCards.length) {
        tl.fromTo(
          showcaseCards,
          { autoAlpha: 0, y: 18, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            stagger: 0.06,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.08
        );
      }
    } else if (stage === 1) {
      const items = queryVisible(
        '#stage-video .video-frame-shell, #stage-video .video-controls-caption, #stage-video .video-insight-card'
      );
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            stagger: 0.055,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.02
        );
      }
    } else if (stage >= 2 && stage <= 6) {
      const posterFrame = document.querySelector('#stage-posters .poster-frame-btn');
      const panelItems = queryVisible(
        '#stage-posters .panel-header-row, #stage-posters .poster-mini-pills, #stage-posters .panel-story-head, #stage-posters .panel-summary, #stage-posters .panel-policy-highlights, #stage-posters .panel-fact-chips, #stage-posters .motif-card, #stage-posters .panel-official-wrap'
      );

      if (posterFrame && !posterFrame.hidden) {
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.48, scale: 0.98 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.58,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
          0
        );
      }
      if (panelItems.length) {
        tl.fromTo(
          panelItems,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.038,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.04
        );
      }
    } else if (stage === 7) {
      const items = queryVisible(
        '#stage-social .social-card-shell, #stage-social .social-side-panel'
      );
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.02
        );
      }
    } else if (stage === 8) {
      const cards = queryVisible(
        '#stage-presentation .pres-header-card, #stage-presentation .pres-card, #stage-presentation .pres-actions-bar'
      );
      if (cards.length) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.045,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.02
        );
      }
    } else if (stage === 9) {
      const items = queryVisible(
        '#stage-finale .finale-crest-wrap, #stage-finale .finale-top-row, #stage-finale .finale-heading, #stage-finale .finale-summary, #stage-finale .finale-product-chip, #stage-finale .finale-thumb-card, #stage-finale .finale-action-panel'
      );
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.04,
            ease: 'power2.out',
            clearProps: 'transform,opacity,visibility',
          },
          0.02
        );
      }
    }
  }

  function killTimelinesIfStatic() {
    if (isStatic()) {
      if (transitionTimeline) {
        transitionTimeline.progress(1).kill();
        transitionTimeline = null;
      }
      if (stageTimeline) {
        stageTimeline.progress(1).kill();
        stageTimeline = null;
      }
      resetTransitionLayers();
    }
  }

  const onReducedMotionChange = (e) => {
    prefersReduced = e.matches;
    killTimelinesIfStatic();
  };

  reducedMotionQuery?.addEventListener?.('change', onReducedMotionChange);

  return {
    playStageTransition,
    animateStageEntrance,
    setLiteMode(enabled) {
      liteMode = Boolean(enabled);
      killTimelinesIfStatic();
    },
    setMotionOff(enabled) {
      motionOff = Boolean(enabled);
      killTimelinesIfStatic();
    },
    destroy() {
      if (transitionTimeline) {
        transitionTimeline.kill();
        transitionTimeline = null;
      }
      if (stageTimeline) {
        stageTimeline.kill();
        stageTimeline = null;
      }
      reducedMotionQuery?.removeEventListener?.('change', onReducedMotionChange);
    },
  };
}
