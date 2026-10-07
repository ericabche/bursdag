// lyd.js – lydeffekter laget med Web Audio API, helt uten lydfiler.
// Bruk: import { lyd } from './lyd.js';  lyd.pling();

let ctx = null;      // lydmotoren lages først når noen trykker på noe (krav fra nettleserne)
let master = null;   // felles volum for alle effekter
let stoyBuffer = null;
let paa = lesInnstilling();

const VOLUM = 0.5;   // samlet volum for effektene (0–1)

// ---------- Oppsett ----------

function lesInnstilling() {
  try { return localStorage.getItem('lydeffekter') !== 'av'; } catch { return true; }
}

function lagreInnstilling() {
  try { localStorage.setItem('lydeffekter', paa ? 'paa' : 'av'); } catch { /* privat modus o.l. */ }
}

// Henter lydmotoren, eller null hvis lyden er skrudd av / ikke støttes
function motor() {
  if (!paa) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOLUM;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// To sekunder hvit støy som gjenbrukes til whoosh, smell, rasling osv.
function stoy(c) {
  if (!stoyBuffer) {
    stoyBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const data = stoyBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  return stoyBuffer;
}

// Volumkurve: stiger raskt opp og dør ut
function kurve(c, start, varighet, volum, attack = 0.005) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.linearRampToValueAtTime(volum, start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + varighet);
  g.connect(master);
  return g;
}

// En tone. Med «til» glir tonen fra én frekvens til en annen.
function tone(c, { frekvens, til, start = 0, varighet = 0.3, type = 'sine', volum = 0.4, attack = 0.005 }) {
  const t = c.currentTime + start;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frekvens, t);
  if (til) osc.frequency.exponentialRampToValueAtTime(til, t + varighet);
  osc.connect(kurve(c, t, varighet, volum, attack));
  osc.start(t);
  osc.stop(t + varighet + 0.05);
}

// Filtrert støy. Med «til» glir filteret, som gir whoosh-lyd.
function sus(c, { start = 0, varighet = 0.3, filter = 'bandpass', frekvens = 1000, til, q = 1, volum = 0.4, attack = 0.005 }) {
  const t = c.currentTime + start;
  const kilde = c.createBufferSource();
  kilde.buffer = stoy(c);
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(frekvens, t);
  if (til) f.frequency.exponentialRampToValueAtTime(til, t + varighet);
  kilde.connect(f).connect(kurve(c, t, varighet, volum, attack));
  kilde.start(t, Math.random());   // tilfeldig startpunkt, så det ikke låter likt hver gang
  kilde.stop(t + varighet + 0.05);
}

const tilfeldig = (min, maks) => min + Math.random() * (maks - min);

// ---------- Lydene ----------

export const lyd = {
  /** Noe som faller gjennom lufta */
  whoosh(varighet = 0.5) {
    const c = motor(); if (!c) return;
    sus(c, { varighet, frekvens: 300, til: 2500, q: 1.2, volum: 0.35, attack: varighet * 0.7 });
  },

  /** Smell og glass som knuses */
  knus() {
    const c = motor(); if (!c) return;
    tone(c, { frekvens: 140, til: 40, varighet: 0.3, volum: 0.8 });                       // dunk
    sus(c, { varighet: 0.35, filter: 'highpass', frekvens: 1500, volum: 0.5 });           // krasj
    for (let i = 0; i < 10; i++) {                                                         // glassbiter
      tone(c, { frekvens: tilfeldig(2200, 6500), start: tilfeldig(0.02, 0.35),
        varighet: tilfeldig(0.1, 0.35), volum: 0.12 });
    }
  },

  /** Lyst «pling» */
  pling() {
    const c = motor(); if (!c) return;
    tone(c, { frekvens: 1318, varighet: 0.5, volum: 0.3 });
    tone(c, { frekvens: 1976, start: 0.08, varighet: 0.6, volum: 0.25 });
  },

  /** Lite «pop» til knapper */
  pop() {
    const c = motor(); if (!c) return;
    tone(c, { frekvens: 700, til: 160, varighet: 0.09, volum: 0.5 });
    sus(c, { varighet: 0.03, filter: 'highpass', frekvens: 3000, volum: 0.15 });
  },

  /** Kamera-klikk til bildene */
  klikk() {
    const c = motor(); if (!c) return;
    sus(c, { varighet: 0.025, filter: 'highpass', frekvens: 2500, volum: 0.5 });
    sus(c, { start: 0.07, varighet: 0.04, filter: 'bandpass', frekvens: 1800, q: 2, volum: 0.4 });
  },

  /** Papir som rasler når konvolutten åpnes */
  rasling() {
    const c = motor(); if (!c) return;
    let t = 0;
    for (let i = 0; i < 7; i++) {
      sus(c, { start: t, varighet: tilfeldig(0.05, 0.12), frekvens: tilfeldig(2500, 4500), q: 0.8, volum: 0.25 });
      t += tilfeldig(0.04, 0.09);
    }
  },

  /** Liten fanfare */
  fanfare() {
    const c = motor(); if (!c) return;
    [523, 659, 784].forEach((f, i) => {
      tone(c, { frekvens: f, start: i * 0.12, varighet: 0.15, type: 'triangle', volum: 0.35 });
    });
    tone(c, { frekvens: 1047, start: 0.36, varighet: 0.7, type: 'triangle', volum: 0.4 });
    tone(c, { frekvens: 784, start: 0.36, varighet: 0.7, type: 'triangle', volum: 0.2 });
  },

  /** Blås – «fffff» */
  blaas() {
    const c = motor(); if (!c) return;
    sus(c, { varighet: 1.1, filter: 'lowpass', frekvens: 1400, til: 500, q: 0.5, volum: 0.7, attack: 0.12 });
    sus(c, { varighet: 0.9, frekvens: 2500, q: 1, volum: 0.15, attack: 0.1 });
  },

  /** Jubel: partyhorn, glitter og applaus */
  jubel() {
    const c = motor(); if (!c) return;

    // Partyhorn med vibrato
    const t = c.currentTime;
    const horn = c.createOscillator();
    horn.type = 'sawtooth';
    horn.frequency.setValueAtTime(330, t);
    horn.frequency.linearRampToValueAtTime(440, t + 0.15);
    const vibrato = c.createOscillator();
    const vibratoStyrke = c.createGain();
    vibrato.frequency.value = 9;
    vibratoStyrke.gain.value = 12;
    vibrato.connect(vibratoStyrke).connect(horn.frequency);
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2200;
    horn.connect(filter).connect(kurve(c, t, 0.8, 0.18, 0.05));
    horn.start(t); vibrato.start(t);
    horn.stop(t + 0.85); vibrato.stop(t + 0.85);

    // Glitter oppover
    [1047, 1175, 1319, 1568, 1760, 2093, 2349, 2637].forEach((f, i) => {
      tone(c, { frekvens: f, start: 0.3 + i * 0.06, varighet: 0.25, volum: 0.12 });
    });

    // Applaus: mange små klapp som blir færre
    for (let i = 0; i < 60; i++) {
      const start = 0.2 + Math.pow(Math.random(), 1.6) * 1.8;
      sus(c, { start, varighet: tilfeldig(0.015, 0.03), frekvens: tilfeldig(1200, 2500), q: 1.5, volum: tilfeldig(0.1, 0.3) });
    }
  },

  /** DJ-scratch: platen dras fram og tilbake */
  scratch() {
    const c = motor(); if (!c) return;
    // [start, varighet, fra-frekvens, til-frekvens] – ett drag fram og ett tilbake
    [[0, 0.11, 350, 2600], [0.13, 0.15, 2800, 250]].forEach(([start, varighet, fra, til]) => {
      sus(c, { start, varighet, frekvens: fra, til, q: 5, volum: 0.7, attack: 0.01 });
      tone(c, { frekvens: fra / 5, til: til / 5, start, varighet, type: 'sawtooth', volum: 0.1, attack: 0.01 });
    });
  },

  /** Nålen settes ned på platen */
  skrape() {
    const c = motor(); if (!c) return;
    tone(c, { frekvens: 90, til: 50, varighet: 0.12, volum: 0.5 });
    sus(c, { varighet: 0.4, filter: 'lowpass', frekvens: 1200, volum: 0.12, attack: 0.02 });
    for (let i = 0; i < 12; i++) {
      sus(c, { start: tilfeldig(0.02, 0.5), varighet: 0.008, filter: 'highpass', frekvens: 3000, volum: tilfeldig(0.1, 0.35) });
    }
  },
};

// ---------- Lyd av/på-knapp ----------

export function startLyd() {
  const knapp = document.createElement('button');
  knapp.type = 'button';
  knapp.id = 'lyd-knapp';
  knapp.className = 'lyd-knapp';

  const vis = () => {
    knapp.textContent = paa ? '🔊' : '🔇';
    knapp.setAttribute('aria-label', paa ? 'Skru av lydeffekter' : 'Skru på lydeffekter');
    knapp.setAttribute('aria-pressed', String(!paa));
  };

  knapp.addEventListener('click', () => {
    paa = !paa;
    lagreInnstilling();
    vis();
    if (paa) lyd.pop();
  });

  vis();
  document.body.append(knapp);
}