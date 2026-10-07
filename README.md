# Gratulerer med dagen! 🎉

En interaktiv bursdagsside med video, animasjoner, lydeffekter og Snoopy. Laget med vanlig HTML, CSS og JavaScript, uten rammeverk eller byggesteg.

## Slik går siden

1. **Start:** en festlig side med ballonger og en pulserende play-knapp. Videoen spilles av i fullskjerm.
2. **Mood check:** «How are you feeling today?» Kommer man i nærheten av en av de fire første knappene, faller et bilde ned og knuser den. Bare smilefjeset helt til høyre kan velges.
3. **Meny:** fire Snoopy-kort på beige bakgrunn med stjerner.
   - 💌 **Bursdagskort:** konvolutten åpnes, og kortet spretter frem med konfetti.
   - 🎂 **Kake:** «Blås ut lysene» slukker lysene, med røyk, jubel og konfetti.
   - 📸 **Bilder:** et galleri med polaroidbilder som kan åpnes større.
   - 🎵 **Musikk:** en platespiller der platen snurrer og Snoopy danser når sangen spiller. Pause gir scratch-lyd.
4. **Avslutt:** en avslutningsvideo i ramme, og en hilsen med konfetti når den er ferdig.

Øverst til høyre er det en 🔊-knapp som skrur lydeffektene av og på.

## Kom i gang

Siden må kjøres via en lokal server, fordi nettleseren blokkerer JavaScript-moduler når siden åpnes direkte som fil.

**Med VS Code:** Installer utvidelsen *Live Server*, høyreklikk på `index.html` og velg *Open with Live Server*.

**Med terminalen:**

```bash
npx serve
```

## Dette må fylles inn

| Hva | Hvor |
|---|---|
| Startvideoen | `video/bursdag.mp4` |
| Avslutningsvideoen | `video/slutt.mp4` |
| Sangen | `musikk/sang.mp3` (navnet på sangen står i `index.html`, søk etter «Bursdagssangen») |
| Bildene som knuser knappene | `bilder/1.png` til `bilder/4.png` |
| Hilsenen i bursdagskortet | `index.html`, søk etter «Kjære [navn]!» |
| Bildene i galleriet | legg dem i `bilder/galleri/` og skriv dem inn i listen øverst i `js/galleri.js` |
| Antall lys på kaken | `ANTALL_LYS` øverst i `js/kake.js` |

Filnavn må stemme nøyaktig, også store og små bokstaver (`.png` og `.PNG` er ikke det samme på GitHub Pages). Mangler en fil, viser siden en melding eller en reserve i stedet for å krasje.

## Mappestruktur

```
├── index.html          # Alle skjermene
├── css/
│   └── style.css       # Utseende og animasjoner
├── js/
│   ├── main.js         # Starter siden og bytter skjerm
│   ├── video.js        # Play-knapp og startvideo
│   ├── mood.js         # Mood check og knusing
│   ├── meny.js         # Navigasjon og konvolutten
│   ├── kake.js         # Kaken og lysene
│   ├── galleri.js      # Bildegalleriet
│   ├── musikk.js       # Platespilleren
│   ├── slutt.js        # Avslutningsvideoen
│   ├── lyd.js          # Lydeffekter (Web Audio API)
│   └── konfetti.js     # Konfetti
├── video/              # bursdag.mp4 og slutt.mp4
├── musikk/             # sang.mp3
└── bilder/
    ├── 1.png – 4.png   # Bildene som faller i mood check
    ├── snoopy-*.jpg    # Bildene på menykortene
    ├── snoopy_musikk.png
    ├── snoopy_dancing.gif
    ├── stjerner.jpg    # Bakgrunnen
    └── galleri/        # Bildene i galleriet
```

## Justeringer

- **Farger:** alle fargene ligger som variabler øverst i `css/style.css` (`:root`).
- **Lydvolum:** `VOLUM` øverst i `js/lyd.js`.
- **Hvor nær man må være før en knapp knuses:** `AVSTAND` øverst i `js/mood.js`.
- **Hvor lenge musikken bremser ved pause:** `VARIGHET` i `bremse` nederst i `js/musikk.js`.

Animasjonene skrus av for de som har valgt redusert bevegelse i systeminnstillingene.

## Publisering

Siden kan legges ut med GitHub Pages. Med en gratis GitHub-konto må repoet da være offentlig. Med GitHub Pro (gratis for studenter gjennom GitHub Student Developer Pack) kan det være privat.

Store filer gjør siden treg å laste, særlig på mobil, så hold videoene så små som mulig. GitHub tillater ikke filer over 100 MB.

## Om bildene

Snoopy og Peanuts er opphavsrettslig beskyttet. Bildene brukes her bare i en privat bursdagshilsen, så lenken bør deles direkte med bursdagsbarnet og ikke spres videre.