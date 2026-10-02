# Come aggiungere e modificare i contenuti

Guida pratica: dove mettere le mani per ogni tipo di contenuto.
Ricorda: **ogni testo esiste in due lingue** — inglese (default) e italiano.

---

## Mappa dei file

| File | Cosa contiene |
|------|---------------|
| `index.html` | struttura e testi inglesi della pagina |
| `js/i18n.js` | **tutte** le traduzioni italiane |
| `js/main.js` | testi inglesi generati da JS: skill, tappe del percorso, case study |
| `js/stimoli.js` | voci della sezione Sparks / Stimoli |
| `images/stimoli/` | immagini della sezione Stimoli |
| `css/main.css` | stile (vedi `docs/STYLE.md`) |
| `src/scene.js` | scena 3D (dopo le modifiche: `npm run build`) |

---

## 1. Sparks / Stimoli (hobby: trekking, foto, dipinti)

1. Copia l'immagine in `images/stimoli/`
   - formato `.jpg` o `.webp`, lato lungo ~1200px, possibilmente < 400 KB
   - nome file senza spazi: `etna-crateri-silvestri.jpg`
2. Apri `js/stimoli.js` e aggiungi una voce nella lista (le più recenti in alto):

```js
export const STIMOLI = [
  {
    type: 'hiking',                     // 'hiking' | 'photo' | 'painting'
    image: 'images/stimoli/etna-crateri-silvestri.jpg',
    title: { en: 'Silvestri craters', it: 'Crateri Silvestri' },
    note:  { en: 'first snow of the year', it: "prima neve dell'anno" },  // opzionale
    date: '2026-01',                    // opzionale
    place: 'Etna, Sicily',              // opzionale
    link: 'https://…',                  // opzionale (Komoot, Strava, Instagram…)
  },
];
```

- Quando una categoria ha almeno una voce, la card "coming soon" di quella categoria sparisce da sola.
- Senza `image` la card mostra un'illustrazione colorata al posto della foto.
- Attenzione agli apostrofi: usa le virgolette doppie (`"prima neve dell'anno"`) oppure `\'`.

---

## 2. Skill (sezione Backpack / Zaino)

In `js/main.js`, lista `SKILLS`:

```js
{ name: 'Docker', cat: 'devops', tier: 2, text: 'Descrizione in inglese.' },
```

- `cat`: `backend` | `lang` | `data` | `devops` | `frontend` | `security`
- `tier`: `1` = ogni giorno · `2` = nello zaino · `3` = sto imparando ★
- `focus: true` aggiunge la stellina "current focus"

Poi in `js/i18n.js` → `skills`, aggiungi la descrizione italiana con la stessa chiave del nome:

```js
'Docker': 'Descrizione in italiano.',
// se anche il nome va tradotto: 'REST APIs': ['API REST', 'descrizione…'],
```

---

## 3. Progetti e case study

1. **Card** in `index.html`: copia un blocco `<article class="poster …">` e cambia colore
   (`poster--lime` / `poster--pink` / `poster--orange`), testi, tag e `data-open="chiave"`.
   Aggiungi `data-i18n="proj.chiave"` alla descrizione.
2. **Case study** in `js/main.js` → `PROJECTS.chiave` (`index`, `title`, `lede`, `problem`, `built`, `stack`, `result`, `link`, `color`, `extra`).
3. **Traduzioni** in `js/i18n.js` → `projects.chiave` (stessi campi testuali) e `static['proj.chiave']`.

---

## 4. Esperienze e percorso

- Card lavoro: `index.html`, blocchi `<article class="job …">`. Ogni testo ha un `data-i18n` (es. `job1.when`, `job1.list`).
- Tappe del profilo altimetrico: `WAYPOINTS` in `js/main.js` + `waypoints` in `js/i18n.js`.
  Per una nuova tappa serve anche un punto `<li style="--x:…;--y:…">` in `.profile__points`.

---

## 5. Testi della pagina (traduzioni)

Ogni elemento traducibile in `index.html` ha un attributo `data-i18n="chiave"`.
Il testo inglese sta nell'HTML, quello italiano in `js/i18n.js` → `static['chiave']`.

Per aggiungere un testo nuovo:
1. scrivi l'HTML in inglese con `data-i18n="sezione.nome"`;
2. aggiungi `'sezione.nome': 'testo italiano'` in `js/i18n.js` → `static`.

Le chiavi si possono controllare così (devono risultare entrambe vuote):

```bash
node -e "const fs=require('fs');import('./js/i18n.js').then(({IT})=>{const k=new Set([...fs.readFileSync('index.html','utf8').matchAll(/data-i18n=\"([^\"]+)\"/g)].map(m=>m[1]));console.log('mancano IT:',[...k].filter(x=>!(x in IT.static)));console.log('inutilizzate:',Object.keys(IT.static).filter(x=>!k.has(x)))})"
```

---

## 6. Nuova sezione

1. In `index.html` aggiungi una `<section class="chapter" id="…">` con dentro un `.panel` (vedi le altre sezioni).
2. Aggiungi il link nel menu desktop (`.nav__links`) **e** in quello mobile (`.menu__links`).
3. Aggiungi l'id alla lista delle sezioni osservate in `js/main.js` (quella con `'about', 'experience', …`) per evidenziare la voce di menu attiva.
4. Traduzioni in `js/i18n.js`.
5. Stile coerente con `docs/STYLE.md`.

---

## 7. Provare in locale e pubblicare

```bash
npm install          # solo la prima volta
npm run build        # solo se hai toccato src/scene.js
npm run serve        # apri http://localhost:8080
```

Checklist prima di pubblicare:
- [ ] la pagina si vede bene su desktop e su mobile
- [ ] EN e IT: nessun testo rimasto in una lingua sola
- [ ] nessun errore nella console del browser
- [ ] i link funzionano
- [ ] le informazioni sono vere (CV / GitHub)

Il sito è servito da GitHub Pages dal branch `main`: un push su `main` lo pubblica in 1–2 minuti.
Aggiorna anche `CHANGELOG.md`.
