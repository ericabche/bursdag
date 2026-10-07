// meny.js – navigasjon mellom menyen og de tre overraskelsene, og konvolutten.

import { konfetti } from './konfetti.js';
import { lyd } from './lyd.js';

export function startMeny(visSkjerm) {
  // Alle knapper med data-til="..." går til den skjermen
  document.addEventListener('click', (e) => {
    const knapp = e.target.closest('[data-til]');
    if (!knapp) return;
    lyd.pop();
    visSkjerm(knapp.dataset.til);
  });

  // Konvolutten: klaffen åpnes, brevet glir opp, så vises kortet
  const konvolutt = document.getElementById('konvolutt');
  const kort = document.getElementById('bursdagskort');

  konvolutt.addEventListener('click', () => {
    if (konvolutt.classList.contains('aapen')) {
      kort.hidden = false;   // allerede åpen: vis kortet med en gang
      return;
    }
    konvolutt.classList.add('aapen');
    lyd.rasling();
    setTimeout(() => {
      kort.hidden = false;
      lyd.fanfare();
      konfetti(80);
    }, 1300);
  });

  document.getElementById('lukk-kort').addEventListener('click', () => {
    lyd.pop();
    kort.hidden = true;
  });
}