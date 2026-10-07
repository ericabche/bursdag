// main.js – starter siden og bytter mellom skjermene.

import { startVideo } from './video.js';
import { startMood } from './mood.js';
import { startMeny } from './meny.js';
import { startKake } from './kake.js';
import { startGalleri } from './galleri.js';
import { startMusikk } from './musikk.js';
import { startLyd } from './lyd.js';
import { startSlutt } from './slutt.js';

export function visSkjerm(id) {
  document.querySelectorAll('.skjerm').forEach((s) => { s.hidden = s.id !== id; });
  window.scrollTo(0, 0);
}

startLyd();
startVideo(() => visSkjerm('skjerm-mood'));
startMood(() => visSkjerm('skjerm-meny'));
startMeny(visSkjerm);
startKake();
startGalleri();
startMusikk();
startSlutt();