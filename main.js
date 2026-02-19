gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const cardsContainer = document.querySelector('.hero-cards');
  let cards = document.querySelectorAll('.hero-card-gsap');
  const headlineImg = document.querySelector('.prod-photo_hero-main-wrap');

  if (!hero || !cardsContainer || !cards.length) return;

  // Clone cards 2,3,4,5 for second row (duplicates appear from right)
  const originalCount = cards.length;
  const DUP_INDICES = [1, 2, 3, 4]; // cards 2, 3, 4, 5
  DUP_INDICES.forEach((idx) => {
    if (!cards[idx]) return;
    cardsContainer.appendChild(cards[idx].cloneNode(true));
  });
  cards = document.querySelectorAll('.hero-card-gsap');

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

  // Bottom row constants
  const CARD_W_REM = 24.25;
  const CARD_H_REM = 30.375;
  const GAP_REM = 2;
  const BOTTOM_GAP_REM = -5;
  const HEADLINE_MOVE_REM = 10;
  const ROW_SCALE = [0.55, 0.65, 0.55, 0.75, 0.55, 0.65, 0.55];

  // Cache layout values and refresh them only when needed
  const L = { rem: 16, w: 0, h: 0, gap: 0, bottomGap: 0, headlineMove: 0, rowW: 0, rowShift: 0 };

  const updateLayout = () => {
    L.rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    L.w = CARD_W_REM * L.rem;
    L.h = CARD_H_REM * L.rem;
    L.gap = GAP_REM * L.rem;
    L.bottomGap = BOTTOM_GAP_REM * L.rem;
    L.headlineMove = HEADLINE_MOVE_REM * L.rem;
    L.rowW = ROW_SCALE.reduce((s, sc) => s + L.w * sc, 0) + 6 * L.gap;

    // same math as your ROW_WIDTH()
    let card5Center = L.rowW / 2 + L.gap + (L.w * ROW_SCALE[DUP_INDICES[3]]) / 2;
    for (let j = 0; j < 3; j++) card5Center += L.w * ROW_SCALE[DUP_INDICES[j]] + L.gap;
    const card5RightEdge = card5Center + (L.w * ROW_SCALE[DUP_INDICES[3]]) / 2;
    L.rowShift = Math.max(0, card5RightEdge - window.innerWidth / 2);
  };

  updateLayout();

  gsap.set(cards, { scale: 1, x: 0, y: 0 });
  cards.forEach((c, i) => { if (i >= originalCount) gsap.set(c, { opacity: 0 }); });
  if (headlineImg) gsap.set(headlineImg, { y: 0 });
  gsap.set(cardsContainer, { x: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: SCROLL,
      pin: true,
      scrub: 1.5,
      invalidateOnRefresh: true,
      onRefreshInit: updateLayout,
    },
  });

  // Part 1: scale + spread (only first 7 cards)
  cards.forEach((card, i) => {
    if (i >= originalCount) return;
    const pos = SPREAD[i] || { x: 0, y: 0, scale: 0.4 };
    tl.to(card, { x: pos.x, y: pos.y, scale: pos.scale, duration: 0.2, force3D: true }, 0.05 + i * 0.025);
  });

  // Part 2: move to bottom row
  const PART2_START = 0.5;
  const PART2_DURATION = 0.15;

  if (headlineImg) {
    tl.to(headlineImg, { y: () => -L.headlineMove, duration: PART2_DURATION, force3D: true }, PART2_START);
  }

  cards.forEach((card, i) => {
    const idx = i < originalCount ? i : DUP_INDICES[i - originalCount];
    const scale = ROW_SCALE[idx] ?? 0.3;
    const rowOffset = i >= originalCount;

    const y = () => window.innerHeight / 2 - L.bottomGap - (L.h * scale) / 2;

    const x = () => {
      if (rowOffset) {
        const dupIdx = i - originalCount;
        let pos = L.rowW / 2 + L.gap + (L.w * scale) / 2;
        for (let j = 0; j < dupIdx; j++) pos += L.w * ROW_SCALE[DUP_INDICES[j]] + L.gap;
        return pos;
      }
      let pos = -L.rowW / 2;
      for (let j = 0; j < idx; j++) pos += L.w * ROW_SCALE[j] + L.gap;
      return pos + (L.w * scale) / 2;
    };

    if (i >= originalCount) tl.to(card, { opacity: 1, duration: 0.01 }, PART2_START + PART2_DURATION);
    tl.to(card, { x, y, scale, duration: PART2_DURATION, force3D: true }, PART2_START);
  });

  // Part 3: horizontal scroll
  const PART3_START = 0.7;
  tl.to(cardsContainer, { x: () => -L.rowShift, duration: 0.22, force3D: true }, PART3_START);

  // Debounced refresh on resize
  let raf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => ScrollTrigger.refresh());
  });
});
