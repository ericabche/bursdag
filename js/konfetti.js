// konfetti.js – enkel konfetti uten bibliotek, i samme farger som stjernene.

const FARGER = ['#e0636b', '#e3a6cf', '#8ec3ea', '#6db38f', '#9b6b47', '#ffd84d'];

export function konfetti(antall = 120) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < antall; i++) {
    const bit = document.createElement('span');
    bit.className = 'konfetti';
    const storrelse = 6 + Math.random() * 8;
    Object.assign(bit.style, {
      left: `${Math.random() * 100}vw`,
      width: `${storrelse}px`,
      height: `${storrelse * (Math.random() < 0.5 ? 0.5 : 1)}px`,
      background: FARGER[i % FARGER.length],
      borderRadius: Math.random() < 0.3 ? '50%' : '2px',
    });
    document.body.append(bit);

    const sving = (Math.random() - 0.5) * 200;
    bit.animate(
      [
        { transform: 'translate(0, -20px) rotate(0deg)' },
        { transform: `translate(${sving}px, 105vh) rotate(${720 * Math.random()}deg)` },
      ],
      { duration: 2500 + Math.random() * 2000, delay: Math.random() * 600, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' }
    ).finished.then(() => bit.remove());
  }
}