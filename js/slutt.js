// slutt.js – avslutningen: videoen i ramme, og en hilsen når den er ferdig.

import { konfetti } from './konfetti.js';
import { lyd } from './lyd.js';

export function startSlutt() {
  const video = document.getElementById('slutt-video');
  const feil = document.getElementById('slutt-feil');
  const hilsen = document.getElementById('slutt-hilsen');
  const igjen = document.getElementById('se-igjen');

  const spill = () => {
    hilsen.classList.remove('vis');
    igjen.hidden = true;
    video.currentTime = 0;
    video.play().catch(() => { /* f.eks. hvis videoen mangler – håndteres av error under */ });
  };

  // Videoen starter når man trykker «Avslutt» (trykket gjør at nettleseren tillater lyd)
  document.getElementById('avslutt-knapp').addEventListener('click', spill);
  igjen.addEventListener('click', () => {
    lyd.pop();
    spill();
  });

  video.addEventListener('ended', () => {
    hilsen.classList.add('vis');
    igjen.hidden = false;
    lyd.fanfare();
    konfetti();
  });

  video.addEventListener('error', () => {
    video.hidden = true;
    feil.hidden = false;
  });

  // Videoen stopper når man går tilbake til menyen
  document.querySelector('#skjerm-slutt .tilbake').addEventListener('click', () => video.pause());
}