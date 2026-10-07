// kake.js – lysene på kaken, og å blåse dem ut.

import { konfetti } from './konfetti.js';
import { lyd } from './lyd.js';

const ANTALL_LYS = 5;   // endre til så mange lys du vil (passer best med 1–9)
const SVG = 'http://www.w3.org/2000/svg';

export function startKake() {
  const kake = document.getElementById('kake');
  const lysGruppe = document.getElementById('lys');
  const tittel = document.getElementById('kake-tittel');
  const blaas = document.getElementById('blaas-knapp');
  const tenn = document.getElementById('tenn-knapp');

  const veker = lagLys(lysGruppe);

  blaas.addEventListener('click', () => {
    lyd.blaas();
    kake.classList.add('slukket');
    veker.forEach(([x, y], i) => setTimeout(() => royk(lysGruppe, x, y), i * 60));
    tittel.textContent = 'Gratulerer med dagen! 🎉';
    blaas.hidden = true;
    tenn.hidden = false;
    setTimeout(() => {
      lyd.jubel();
      konfetti();
    }, 500);
  });

  tenn.addEventListener('click', () => {
    lyd.pling();
    kake.classList.remove('slukket');
    tittel.textContent = 'Ønsk deg noe …';
    tenn.hidden = true;
    blaas.hidden = false;
  });
}

function lag(navn, attributter) {
  const el = document.createElementNS(SVG, navn);
  for (const [k, v] of Object.entries(attributter)) el.setAttribute(k, v);
  return el;
}

// Lager lysene jevnt fordelt på toppen av kaken. Returnerer posisjonen til vekene.
function lagLys(gruppe) {
  const veker = [];
  const bredde = Math.min(100, (ANTALL_LYS - 1) * 22);

  for (let i = 0; i < ANTALL_LYS; i++) {
    const x = ANTALL_LYS === 1 ? 150 : 150 - bredde / 2 + (bredde / (ANTALL_LYS - 1)) * i;
    const bunn = 128;
    const topp = bunn - 42;

    gruppe.append(
      lag('rect', { x: x - 5, y: topp, width: 10, height: bunn - topp, rx: 2,
        fill: 'url(#lys-striper)', stroke: '#2b2b2b', 'stroke-width': 2.5 }),
      lag('line', { x1: x, y1: topp, x2: x, y2: topp - 6, stroke: '#2b2b2b', 'stroke-width': 2, 'stroke-linecap': 'round' })
    );

    const glod = lag('circle', { cx: x, cy: topp - 16, r: 16, class: 'glod' });
    const flamme = lag('path', {
      d: `M${x} ${topp - 4} c-7 0 -8 -9 -4 -15 c2 -3 4 -6 4 -10 c4 4 9 10 7 17 c-1 5 -3 8 -7 8z`,
      fill: 'url(#flamme-farge)', stroke: '#e8742c', 'stroke-width': 1.5, class: 'flamme',
    });
    flamme.style.animationDelay = `${-Math.random()}s`;
    gruppe.append(glod, flamme);

    veker.push([x, topp - 8]);
  }
  return veker;
}

// Små røykdotter som stiger opp fra hver veke
function royk(gruppe, x, y) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 4; i++) {
    const dott = lag('circle', { cx: x, cy: y, r: 4, fill: '#c9c4bd' });
    dott.style.transformBox = 'fill-box';
    dott.style.transformOrigin = 'center';
    gruppe.append(dott);
    const sving = (Math.random() - 0.5) * 20;
    dott.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
        { transform: `translate(${sving}px, -60px) scale(3)`, opacity: 0 },
      ],
      { duration: 1400, delay: i * 150, easing: 'ease-out', fill: 'backwards' }
    ).finished.then(() => dott.remove());
  }
}