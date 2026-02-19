gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const cards = document.querySelectorAll('.hero-card-gsap');
  const cardsContainer = document.querySelector('.hero-cards');
  const headlineImg = document.querySelector('.prod-photo_hero-main-wrap');

  const SCROLL = '+=350%';
  const SCALE = 0.4;
  const SPREAD = [
    { x: '-20vw', y: '-34vh', scale: SCALE },
    { x: '22vw', y: '-30vh', scale: 0.55 },
    { x: '-18vw', y: '32vh', scale: SCALE },
    { x: '22vw', y: '29vh', scale: 0.55 },
    { x: '-25vw', y: '0', scale: 0.55 },
    { x: '26vw', y: '0', scale: SCALE },
    { x: '0', y: '-39vh', scale: SCALE },
  ];

  // Bottom row
  const CARD_W_REM = 24.25;
  const CARD_H_REM = 30.375;
  const GAP_REM = 2;
  const BOTTOM_GAP_REM = -5; // 10px at 16px base
  const HEADLINE_MOVE_REM = 10; // move up in Part 2
  const ROW_SCALE = [0.55, 0.65, 0.55, 0.75, 0.55, 0.65, 0.55];
  const CAROUSEL_DISTANCE = 3; // cards worth of scroll (right to left)

  gsap.set(cards, { scale: 1, x: 0, y: 0 });
  if (headlineImg) gsap.set(headlineImg, { y: 0 });
  if (cardsContainer) gsap.set(cardsContainer, { x: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: SCROLL,
      pin: true,
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  // Part 1: scale + spread (unique scale per card)
  cards.forEach((card, i) => {
    const pos = SPREAD[i] || { x: 0, y: 0, scale: 0.4 };
    tl.to(card, {
      x: pos.x,
      y: pos.y,
      scale: pos.scale,
      duration: 0.2,
      force3D: true,
    }, 0.05 + i * 0.025);
  });

  // Part 2: move to bottom row (must finish before Part 3)
  const PART2_START = 0.5;
  const PART2_DURATION = 0.15;
  if (headlineImg) {
    tl.to(headlineImg, {
      y: () => -(HEADLINE_MOVE_REM * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)),
      duration: PART2_DURATION,
      force3D: true,
    }, PART2_START);
  }
  cards.forEach((card, i) => {
    const scale = ROW_SCALE[i] ?? 0.3;
    const y = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const cardH = CARD_H_REM * rem;
      const bottomGap = BOTTOM_GAP_REM * rem;
      return window.innerHeight / 2 - bottomGap - (cardH * scale) / 2;
    };
    const x = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const w = CARD_W_REM * rem;
      const gap = GAP_REM * rem;
      const rowW = ROW_SCALE.reduce((s, sc) => s + w * sc, 0) + 6 * gap;
      let pos = -rowW / 2;
      for (let j = 0; j < i; j++) pos += w * ROW_SCALE[j] + gap;
      return pos + (w * scale) / 2;
    };
    tl.to(card, { x, y, scale, duration: PART2_DURATION, force3D: true }, PART2_START);
  });

  // Part 3: horizontal scroll (starts after Part 2 completes + pause)
  const PART3_START = 0.7;
  if (cardsContainer) {
    tl.to(cardsContainer, {
      x: () => {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const w = CARD_W_REM * rem;
        const gap = GAP_REM * rem;
        const avgScale = ROW_SCALE.reduce((a, b) => a + b, 0) / ROW_SCALE.length;
        return -(CAROUSEL_DISTANCE * w * avgScale + (CAROUSEL_DISTANCE - 1) * gap);
      },
      duration: 0.3,
      force3D: true,
    }, PART3_START);
  }

  window.addEventListener('resize', () => ScrollTrigger.refresh());
});