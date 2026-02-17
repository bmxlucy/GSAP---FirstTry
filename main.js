gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const cards = document.querySelectorAll('.hero-card');


  const SCROLL = '+=200%';
  const SCALE = 0.4;
  const SPREAD = [
    { x: '-20vw', y: '-34vh', scale: SCALE },
    { x: '24vw', y: '-28vh', scale: SCALE },
    { x: '-18vw', y: '32vh', scale: SCALE },
    { x: '19vw', y: '27vh', scale: SCALE },
    { x: '-25vw', y: '0', scale: SCALE },
    { x: '26vw', y: '0', scale: SCALE },
    { x: '0', y: '-39vh', scale: SCALE },
  ];

  // Bottom row: 7 cards in one line, evenly spaced
  const ROW_SCALE = 0.4;
  const ROW_Y = '38vh';
  const ROW_X = ['-30vw', '-20vw', '-10vw', '0', '10vw', '20vw', '30vw'];

  gsap.set(cards, { scale: 1, x: 0, y: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: SCROLL,
      pin: true,
      scrub: 1.5, // Smooth scroll-linked animation (reduces jitter)
    },
  });

  // Part 1: scale + spread (ends before Part 2 at 0.55)
  tl.to(cards, { scale: SCALE, force3D: true }, 0);
  cards.forEach((card, i) => {
    const pos = SPREAD[i] || { x: 0, y: 0 };
    tl.to(card, { x: pos.x, y: pos.y, duration: 0.2, force3D: true }, 0.2 + i * 0.025);
  });

  // Part 2: move to bottom row (after delay)
  const PART2_START = 0.65; // Delay after Part 1 ends (~0.5)
  cards.forEach((card, i) => {
    tl.to(card, {
      x: ROW_X[i] || 0,
      y: ROW_Y,
      scale: ROW_SCALE,
      duration: 0.35,
      force3D: true,
    }, PART2_START);
  });
});
