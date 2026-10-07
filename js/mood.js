// mood.js – dårlige knapper knuses når man kommer nær, bare den beste kan velges.
// Bildet som faller på hver knapp står i data-bilde i index.html.

import { lyd } from './lyd.js';

const AVSTAND = 60;   // px – hvor nær pekeren må være før en knapp knuses
const redusertBevegelse = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bitene knappen knuses i: trekanter fra treffpunktet ut til kantene (i prosent).
const TREFF = [50, 35];
const KANT = [[0, 0], [35, 0], [70, 0], [100, 0], [100, 45], [100, 100], [60, 100], [25, 100], [0, 100], [0, 50]];

export function startMood(naarValgt) {
  const skjerm = document.getElementById('skjerm-mood');
  const best = document.getElementById('best-knapp');
  const send = document.getElementById('send-knapp');
  const daarlige = [...document.querySelectorAll('.mood.daarlig')];

  // Last bildene på forhånd, og bruk steinen for knapper der bildet mangler
  daarlige.forEach((knapp) => {
    const test = new Image();
    test.onerror = () => { knapp.dataset.mangler = 'ja'; };
    test.src = knapp.dataset.bilde;
  });

  // Pekeren i nærheten: mus som beveger seg, eller finger som trykker
  const sjekkNaerhet = (e) => {
    if (skjerm.hidden) return;
    for (const knapp of daarlige) {
      if (avstandTil(knapp, e.clientX, e.clientY) < AVSTAND) knus(knapp);
    }
  };
  document.addEventListener('pointermove', sjekkNaerhet);
  document.addEventListener('pointerdown', sjekkNaerhet);

  // Tastatur: tabber man til en dårlig knapp, knuses den også
  daarlige.forEach((knapp) => knapp.addEventListener('focus', () => knus(knapp)));

  best.addEventListener('click', () => {
    lyd.pling();
    best.classList.add('valgt');
    best.setAttribute('aria-pressed', 'true');
    send.disabled = false;
  });

  send.addEventListener('click', () => {
    lyd.pop();
    naarValgt();
  });
}

// Korteste avstand fra et punkt til kanten av elementet (0 hvis pekeren er over det)
function avstandTil(el, x, y) {
  const r = el.getBoundingClientRect();
  const dx = Math.max(r.left - x, 0, x - r.right);
  const dy = Math.max(r.top - y, 0, y - r.bottom);
  return Math.hypot(dx, dy);
}

async function knus(knapp) {
  if (knapp.dataset.knust) return;   // hver knapp knuses bare én gang
  knapp.dataset.knust = 'ja';
  knapp.disabled = true;

  const plass = knapp.parentElement;
  const bilde = lagBilde(knapp);
  plass.append(bilde);

  if (!redusertBevegelse) {
    lyd.whoosh(0.5);
    // Bildet faller fra over toppen av skjermen ned på knappen
    const r = plass.getBoundingClientRect();
    const fall = r.top + r.height / 2 + 250;
    await bilde.animate(
      [
        { transform: `translate(-50%, calc(-50% - ${fall}px)) rotate(-25deg)` },
        { transform: 'translate(-50%, -50%) rotate(6deg)' },
      ],
      { duration: 500, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' } // akselererer som tyngdekraft
    ).finished;

    lyd.knus();
    splintre(knapp);

    // Liten sprett etter smellet
    bilde.animate(
      [
        { transform: 'translate(-50%, -50%) rotate(6deg)' },
        { transform: 'translate(-50%, -75%) rotate(-6deg)' },
        { transform: 'translate(-50%, -50%) rotate(6deg)' },
      ],
      { duration: 350, easing: 'ease-out' }
    );
  }

  if (redusertBevegelse) lyd.knus();
  knapp.classList.add('knust');
  plass.classList.add('knust');
}

function lagBilde(knapp) {
  if (!knapp.dataset.bilde || knapp.dataset.mangler) {
    const stein = document.createElement('span');
    stein.className = 'knuser stein';
    return stein;
  }
  const img = new Image();
  img.src = knapp.dataset.bilde;
  img.alt = '';
  img.className = 'knuser';
  return img;
}

// Lager kopier av knappen, klipper dem til trekanter og lar dem fly ut og falle
function splintre(knapp) {
  const r = knapp.getBoundingClientRect();

  KANT.forEach(([x1, y1], i) => {
    const [x2, y2] = KANT[(i + 1) % KANT.length];

    const bit = knapp.cloneNode(true);
    bit.removeAttribute('id');
    bit.setAttribute('aria-hidden', 'true');
    bit.classList.add('bit');
    Object.assign(bit.style, {
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      clipPath: `polygon(${TREFF[0]}% ${TREFF[1]}%, ${x1}% ${y1}%, ${x2}% ${y2}%)`,
    });
    document.body.append(bit);

    // Retning: fra treffpunktet ut mot midten av biten
    const retningX = (x1 + x2) / 2 - TREFF[0];
    const retningY = (y1 + y2) / 2 - TREFF[1];
    const fart = 1.5 + Math.random();

    bit.animate(
      [
        { transform: 'none', opacity: 1 },
        {
          transform: `translate(${retningX * fart}px, ${retningY * fart + 300 + Math.random() * 150}px)
                      rotate(${(Math.random() - 0.5) * 140}deg)`,
          opacity: 0,
        },
      ],
      { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(0.3, 0, 0.8, 0.6)' }
    ).finished.then(() => bit.remove());
  });
}