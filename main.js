gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const cards = document.querySelectorAll('.hero-card-gsap');
  const headlineImg = document.querySelector('.prod-photo_hero-main-wrap');


  const SCROLL = '+=250%';
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

  // Bottom row: card bottom 10px from viewport bottom (device-independent)
  const CARD_H_REM = 30.375;
  const BOTTOM_GAP = 10;
  const ROW_X = ['-37.5vw', '-25vw', '-12.5vw', '0', '12.5vw', '25vw', '37.5vw'];
  const ROW_SCALE = [0.4, 0.55, 0.4, 0.65, 0.4, 0.55, 0.4];

  gsap.set(cards, { scale: 1, x: 0, y: 0 });
  if (headlineImg) gsap.set(headlineImg, { y: 0 });

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

  // Part 2: move to bottom row, aligned by bottom edge
  const PART2_START = 0.65;
  if (headlineImg) {
    tl.to(headlineImg, { y: -130, duration: 0.35, force3D: true }, PART2_START);
  }
  cards.forEach((card, i) => {
    const scale = ROW_SCALE[i] ?? 0.3;
    const y = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const cardH = CARD_H_REM * rem;
      return window.innerHeight / 2 - BOTTOM_GAP - (cardH * scale) / 2;
    };
    tl.to(card, {
      x: ROW_X[i] || 0,
      y,
      scale,
      duration: 0.35,
      force3D: true,
    }, PART2_START);
  });

  window.addEventListener('resize', () => ScrollTrigger.refresh());
});