// video.js – play-knapp, fullskjerm og videre når videoen er ferdig.

import { lyd } from './lyd.js';

export function startVideo(naarFerdig) {
  const video = document.getElementById('video');
  const play = document.getElementById('play-knapp');
  const hopp = document.getElementById('hopp-over');

  play.addEventListener('click', async () => {
    lyd.pop();   // første trykk låser også opp lyden i nettleseren
    play.hidden = true;
    video.hidden = false;
    hopp.hidden = false;
    try {
      await video.requestFullscreen?.();
    } catch { /* noen mobiler støtter ikke fullskjerm – videoen fyller skjermen med CSS uansett */ }
    video.play();
  });

  const ferdig = () => {
    video.pause();
    video.hidden = true;
    hopp.hidden = true;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    naarFerdig();
  };

  video.addEventListener('ended', ferdig);
  hopp.addEventListener('click', ferdig);
}