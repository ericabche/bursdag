// galleri.js – bildegalleriet. Legg bildene i bilder/galleri/ og skriv dem inn i listen under.

import { lyd } from './lyd.js';

const BILDER = [
  { fil: 'bilder/galleri/1.jpg', tekst: '' },
  { fil: 'bilder/galleri/2.jpg', tekst: '' },
  { fil: 'bilder/galleri/3.jpg', tekst: '' },
  { fil: 'bilder/galleri/4.jpg', tekst: '' },
  { fil: 'bilder/galleri/5.jpg', tekst: '' },
  { fil: 'bilder/galleri/6.jpg', tekst: '' },
  { fil: 'bilder/galleri/7.jpg', tekst: '' },
  { fil: 'bilder/galleri/8.jpg', tekst: '' },
  { fil: 'bilder/galleri/9.jpg', tekst: '' },
  { fil: 'bilder/galleri/10.jpg', tekst: '' },
  { fil: 'bilder/galleri/11.jpg', tekst: '' },
  { fil: 'bilder/galleri/12.jpg', tekst: '' },
  { fil: 'bilder/galleri/13.jpg', tekst: '' },
  { fil: 'bilder/galleri/14.jpg', tekst: '' },
  { fil: 'bilder/galleri/15.jpg', tekst: '' },
  { fil: 'bilder/galleri/16.jpg', tekst: '' },
  { fil: 'bilder/galleri/17.jpg', tekst: '' },
  { fil: 'bilder/galleri/18.jpg', tekst: '' },
  { fil: 'bilder/galleri/19.jpg', tekst: '' },
  { fil: 'bilder/galleri/20.jpg', tekst: '' },
  { fil: 'bilder/galleri/21.jpg', tekst: '' },
  { fil: 'bilder/galleri/22.jpg', tekst: '' },
  { fil: 'bilder/galleri/23.jpg', tekst: '' },
  { fil: 'bilder/galleri/24.jpg', tekst: '' },
  { fil: 'bilder/galleri/25.jpg', tekst: '' },
  { fil: 'bilder/galleri/26.jpg', tekst: '' },
  { fil: 'bilder/galleri/27.jpg', tekst: '' },
  { fil: 'bilder/galleri/28.jpg', tekst: '' },
];

export function startGalleri() {
  const galleri = document.getElementById('galleri');
  const dialog = document.getElementById('stort-bilde');
  const stortImg = dialog.querySelector('img');
  const stortTekst = dialog.querySelector('p');

  galleri.replaceChildren(
    ...BILDER.map(({ fil, tekst }, i) => {
      const knapp = document.createElement('button');
      knapp.type = 'button';
      knapp.className = 'polaroid';
      knapp.style.setProperty('--vri', `${[-4, 3, -2, 5, -3, 2][i % 6]}deg`);

      const img = document.createElement('img');
      img.src = fil;
      img.alt = tekst;
      img.loading = 'lazy';
      img.onerror = () => {
        knapp.classList.add('mangler');
        knapp.disabled = true;
        bildetekst.textContent = `Mangler: ${fil}`;
      };

      const bildetekst = document.createElement('span');
      bildetekst.textContent = tekst;   // textContent: trygt mot HTML i teksten

      knapp.append(img, bildetekst);
      knapp.addEventListener('click', () => {
        lyd.klikk();
        stortImg.src = fil;
        stortImg.alt = tekst;
        stortTekst.textContent = tekst;
        dialog.showModal();
      });
      return knapp;
    })
  );

  document.getElementById('lukk-bilde').addEventListener('click', () => {
    lyd.pop();
    dialog.close();
  });
  // Klikk utenfor bildet lukker også
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}