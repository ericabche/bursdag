// musikk.js – platespilleren: sangen, platen som snurrer og Snoopy som danser.

import { lyd } from './lyd.js';

export function startMusikk() {
  const sang = document.getElementById('sang');
  const spiller = document.getElementById('platespiller');
  const knapp = document.getElementById('spill-knapp');
  const noter = spiller.querySelector('.noter');
  const tittel = document.getElementById('sang-tittel');
  let noteTimer = null;
  let bremser = false;

  const oppdater = () => {
    const spiller_ = !sang.paused;
    spiller.classList.toggle('spiller', spiller_);
    knapp.textContent = spiller_ ? '⏸ Pause' : '▶ Spill av';

    clearInterval(noteTimer);
    if (spiller_ && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      noteTimer = setInterval(() => lagNote(noter), 600);
    }
  };

  knapp.addEventListener('click', async () => {
    if (sang.paused) {
      lyd.skrape();
      try {
        await sang.play();
      } catch {
        tittel.textContent = 'Fant ikke sangen – ligger den i musikk/sang.mp3?';
      }
    } else if (!bremser) {
      // Scratch-lyd, og sangen bremser ned som en plate som stoppes med hånda
      lyd.scratch();
      bremser = true;
      bremse(sang, () => { bremser = false; });
    }
  });

  sang.addEventListener('play', oppdater);
  sang.addEventListener('pause', oppdater);
  sang.addEventListener('error', () => {
    tittel.textContent = 'Fant ikke sangen – ligger den i musikk/sang.mp3?';
  });

  // Musikken stopper når man går tilbake til menyen
  document.querySelector('#skjerm-musikk .tilbake').addEventListener('click', () => sang.pause());
}

// Senker farten (og tonen) på sangen raskt, og pauser den til slutt
function bremse(sang, ferdig) {
  const VARIGHET = 350;   // millisekunder
  sang.preservesPitch = false;          // la tonen synke med farten
  sang.webkitPreservesPitch = false;    // eldre Safari
  const start = performance.now();

  const steg = () => {
    const t = (performance.now() - start) / VARIGHET;
    if (t >= 1) {
      sang.pause();
      sang.playbackRate = 1;
      sang.preservesPitch = true;
      sang.webkitPreservesPitch = true;
      ferdig();
      return;
    }
    sang.playbackRate = 1 - t * 0.75;   // fra 1 ned til 0,25
    requestAnimationFrame(steg);
  };
  steg();
}

// En note som svever opp fra platespilleren og forsvinner
function lagNote(beholder) {
  const note = document.createElement('span');
  note.className = 'note';
  note.textContent = ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)];
  note.style.left = `${10 + Math.random() * 80}%`;
  note.style.color = ['#e0636b', '#e3a6cf', '#8ec3ea', '#6db38f'][Math.floor(Math.random() * 4)];
  beholder.append(note);

  const sving = (Math.random() - 0.5) * 80;
  note.animate(
    [
      { transform: 'translate(0, 0) rotate(0) scale(0.6)', opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { transform: `translate(${sving}px, -160px) rotate(${sving / 3}deg) scale(1.2)`, opacity: 0 },
    ],
    { duration: 2200, easing: 'ease-out' }
  ).finished.then(() => note.remove());
}