// main.js – starter siden og bytter mellom skjermene.

import { startVideo } from './video.js';
import { startMood } from './mood.js';

export function visSkjerm(id) {
  document.querySelectorAll('.skjerm').forEach((s) => { s.hidden = s.id !== id; });
}

startVideo(() => visSkjerm('skjerm-mood'));
startMood(() => visSkjerm('skjerm-neste'));
