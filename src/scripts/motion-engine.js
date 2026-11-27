/**
 * LẠC HỒNG SỐ — GSAP Motion & Stage Transition Engine
 * Smooth non-strobing 0.45–0.75s stage transitions across all 10 stages (0..9).
 * Instant clean snap when Lite Mode, Motion Off, or prefers-reduced-motion is active.
 */

import gsap from 'gsap';

export function createMotionEngine() {
  let prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
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
    if (toStage === 4 || (fromStage === 4 && toStage === 3)) return 'chimlac-flight';
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
    if (ripple) gsap.set(ripple, { autoAlpha: 0, scale: 0.75 });
    if (flight) gsap.set(flight, { autoAlpha: 0, xPercent: -20, yPercent: 8 });
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
        tl.to(veil, { autoAlpha: 0.32, duration: 0.22, ease: 'power2.out' }, 0)
          .fromTo(
            ripple,
            { autoAlpha: 0.55, scale: 0.76 },
            { autoAlpha: 0, scale: 1.22, duration: 0.64, ease: 'power2.out' },
            0.02
          )
          .call(triggerMidpoint, null, 0.2)
          .to(veil, { autoAlpha: 0, duration: 0.36, ease: 'power2.out' }, 0.24);
      } else if (cue === 'chimlac-flight') {
        tl.to(veil, { autoAlpha: 0.28, duration: 0.2, ease: 'power2.out' }, 0)
          .fromTo(
            flight,
            { autoAlpha: 0, xPercent: -20, yPercent: 10 },
            { autoAlpha: 0.85, xPercent: 18, yPercent: -10, duration: 0.36, ease: 'power2.out' },
            0.03
          )
          .call(triggerMidpoint, null, 0.2)
          .to(flight, { autoAlpha: 0, xPercent: 46, yPercent: -22, duration: 0.32, ease: 'power2.in' }, 0.36)
          .to(veil, { autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, 0.28);
      } else if (cue === 'finale-bloom') {
        tl.to(veil, { autoAlpha: 0.4, duration: 0.24, ease: 'power2.out' }, 0)
          .fromTo(
            ripple,
            { autoAlpha: 0.58, scale: 0.8 },
            { autoAlpha: 0, scale: 1.28, duration: 0.68, ease: 'power2.out' },
            0.03
          )
          .fromTo(
            flight,
            { autoAlpha: 0, xPercent: -16, yPercent: 8 },
            { autoAlpha: 0.8, xPercent: 32, yPercent: -16, duration: 0.64, ease: 'power2.out' },
            0.06
          )
          .call(triggerMidpoint, null, 0.24)
          .to(veil, { autoAlpha: 0, duration: 0.38, ease: 'power2.out' }, 0.3);
      } else if (cue === 'soft-parallax') {
        tl.to(veil, { autoAlpha: 0.22, duration: 0.16, ease: 'power2.out' }, 0)
          .fromTo(
            sweep,
            { autoAlpha: 0, xPercent: -40 },
            { autoAlpha: 0.45, xPercent: 18, duration: 0.3, ease: 'power2.out' },
            0.02
          )
          .call(triggerMidpoint, null, 0.18)
          .to(sweep, { autoAlpha: 0, xPercent: 52, duration: 0.28, ease: 'power2.in' }, 0.3)
          .to(veil, { autoAlpha: 0, duration: 0.28, ease: 'power2.out' }, 0.22);
      } else {
        tl.to(veil, { autoAlpha: 0.24, duration: 0.18, ease: 'power2.out' }, 0)
          .fromTo(
            sweep,
            { autoAlpha: 0, xPercent: -42 },
            { autoAlpha: 0.5, xPercent: 42, duration: 0.52, ease: 'power2.inOut' },
            0.02
          )
          .call(triggerMidpoint, null, 0.2)
          .to(veil, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.24);
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
      const items = document.querySelectorAll(
        '#stage-landing .landing-hero-copy > *, #stage-landing .product-overview-card, #stage-landing .landing-actions'
      );
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.02
        );
      }
    } else if (stage === 1) {
      const items = document.querySelectorAll('#stage-video .video-frame-shell, #stage-video .video-insight-card');
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.06, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.02
        );
      }
    } else if (stage >= 2 && stage <= 6) {
      const posterFrame = document.querySelector('#stage-posters .poster-frame-btn');
      const panelItems = Array.from(
        document.querySelectorAll(
          '#stage-posters .panel-story-head, #stage-posters .panel-summary, #stage-posters .panel-policy-highlights, #stage-posters .panel-fact-chips, #stage-posters .motif-card, #stage-posters .panel-official-wrap'
        )
      ).filter((el) => !el.hidden);

      if (posterFrame) {
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.5, scale: 0.99 },
          { autoAlpha: 1, scale: 1, duration: 0.36, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0
        );
      }
      if (panelItems.length) {
        tl.fromTo(
          panelItems,
          { autoAlpha: 0, y: 7 },
          { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.035, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.03
        );
      }
    } else if (stage === 7) {
      const items = document.querySelectorAll('#stage-social .social-card-shell, #stage-social .social-side-panel');
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.02
        );
      }
    } else if (stage === 8) {
      const cards = document.querySelectorAll('#stage-presentation .pres-card, #stage-presentation .pres-actions-bar');
      if (cards.length) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.02
        );
      }
    } else if (stage === 9) {
      const items = document.querySelectorAll(
        '#stage-finale .finale-heading, #stage-finale .finale-product-chip, #stage-finale .finale-thumb-card, #stage-finale .finale-action-panel'
      );
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.035, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
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
  };
}
