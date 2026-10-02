# CLAUDE.md

Portfolio personale di Francesco Pistorio, servito da GitHub Pages (branch `main`).

## Leggi prima di modificare
- `docs/STYLE.md` — concetto (salita sull'Etna), palette, tipografia, componenti, 3D e **le cose da non rimettere**.
- `docs/CONTENT.md` — dove si trovano i contenuti e come aggiungerli (skill, progetti, Stimoli, traduzioni).
- `CHANGELOG.md` — aggiungi una riga per ogni modifica visibile.

## Regole fisse
- Contenuti veri: la fonte è il CV e i repository GitHub. Non inventare esperienze, numeri, certificazioni o tecnologie.
- Ogni testo esiste in **inglese (default, nell'HTML / `js/main.js`)** e in **italiano (`js/i18n.js`)**: aggiornali sempre insieme.
- Niente viola, niente emoji, niente chip/etichette di quota, niente linee "scan" nel 3D, un solo vulcano.
- Security: solo "sta studiando cybersecurity", senza elencare tecniche.
- Stack: HTML/CSS/JS vanilla, nessun framework. Three.js solo nella scena (`src/scene.js` → `npm run build` → `js/scene.js`, file buildato e committato).

## Comandi
```bash
npm install
npm run build   # dopo modifiche a src/scene.js
npm run serve   # http://localhost:8080
```

## Verifica prima del push
- Nessun errore in console, desktop e mobile, EN e IT.
- Controllo chiavi di traduzione: vedi il comando in `docs/CONTENT.md` §5.
