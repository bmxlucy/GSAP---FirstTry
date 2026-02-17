gsap.registerPlugin(ScrollTrigger);

const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const boxes = document.querySelectorAll('.box');
const scrollPrompt = document.querySelector('.scroll-prompt');
const nextSection = document.querySelector('.next-section');

// Each box moves to a different position around the center (like Affinity)
const boxPositions = [
  { x: -200, y: -140 },  // 1: top-left
  { x: 200, y: -140 },   // 2: top-right
  { x: -240, y: 0 },     // 3: mid-left
  { x: 240, y: 0 },      // 4: mid-right
  { x: -200, y: 140 },   // 5: bottom-left
  { x: 200, y: 140 },    // 6: bottom-right
];

gsap.set(nextSection, { y: 80, opacity: 0 });

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: hero,
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: 1,
  },
});

// Title and subtitle stay visible throughout

// Boxes start stacked at center (only top card visible), spread outward on scroll
boxes.forEach((box, i) => {
  const pos = boxPositions[i];
  tl.fromTo(
    box,
    { x: 0, y: 0 },
    { x: pos.x, y: pos.y, duration: 0.4 },
    0.1 + i * 0.03
  );
});

// Scroll prompt stays visible

// Next section slides up
tl.to(nextSection, { y: 0, opacity: 1, duration: 0.3 }, 0.65);
