gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const cardsContainer = document.querySelector('.hero-cards');
  let cards = document.querySelectorAll('.hero-card-gsap');

  // Clone cards 2,3,4,5 for second row (duplicates appear from right)
  const originalCount = cards.length;
  const DUP_INDICES = [1, 2, 3, 4]; // cards 2, 3, 4, 5
  DUP_INDICES.forEach((idx) => {
    const clone = cards[idx].cloneNode(true);
    cardsContainer.appendChild(clone);
  });
  cards = document.querySelectorAll('.hero-card-gsap');

  const headlineImg = document.querySelector('.prod-photo_hero-main-wrap');

  const SCROLL = '+=300%';
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
  const getRowValues = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const w = CARD_W_REM * rem;
    const gap = GAP_REM * rem;
    const rowW = ROW_SCALE.reduce((s, sc) => s + w * sc, 0) + 6 * gap;
    return { rem, w, gap, rowW };
  };
  // Scroll distance: first row + gap + width of 4 dup cards (2,3,4,5)
  const ROW_WIDTH = () => {
    const { w, gap, rowW } = getRowValues();
    const dupW = DUP_INDICES.reduce((s, j) => s + w * ROW_SCALE[j], 0) + 3 * gap;
    return rowW + gap + dupW;
  };

  gsap.set(cards, { scale: 1, x: 0, y: 0 });
  cards.forEach((c, i) => { if (i >= originalCount) gsap.set(c, { opacity: 0 }); });
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

  // Part 1: scale + spread (only first 7 cards)
  cards.forEach((card, i) => {
    if (i >= originalCount) return;
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
    const idx = i < originalCount ? i : DUP_INDICES[i - originalCount];
    const scale = ROW_SCALE[idx] ?? 0.3;
    const rowOffset = i >= originalCount ? 1 : 0;
    const y = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const cardH = CARD_H_REM * rem;
      const bottomGap = BOTTOM_GAP_REM * rem;
      return window.innerHeight / 2 - bottomGap - (cardH * scale) / 2;
    };
    const x = () => {
      const { w, gap, rowW } = getRowValues();
      if (rowOffset) {
        const dupIdx = i - originalCount;
        let pos = rowW / 2 + gap + (w * scale) / 2;
        for (let j = 0; j < dupIdx; j++) pos += w * ROW_SCALE[DUP_INDICES[j]] + gap;
        return pos;
      }
      let pos = -rowW / 2;
      for (let j = 0; j < idx; j++) pos += w * ROW_SCALE[j] + gap;
      return pos + (w * scale) / 2;
    };
    if (i >= originalCount) {
      tl.to(card, { opacity: 1, duration: 0.01 }, PART2_START + PART2_DURATION);
    }
    tl.to(card, { x, y, scale, duration: PART2_DURATION, force3D: true }, PART2_START);
  });

  // Part 3: horizontal scroll (starts after Part 2 completes + pause)
  const PART3_START = 0.7;
  if (cardsContainer) {
    tl.to(cardsContainer, {
      x: () => -ROW_WIDTH(),
      duration: 0.22,
      force3D: true,
    }, PART3_START);
  }

  window.addEventListener('resize', () => ScrollTrigger.refresh());
});