# Guida di stile

Il riferimento per mantenere coerente il look & feel del portfolio.
Prima di aggiungere una sezione, un colore o un'animazione, controlla qui.

---

## 1. Il concetto

**La pagina è una salita sull'Etna al tramonto.**
Si parte dal mare di Catania (hero) e scorrendo si sale fino al cratere (Contact = "la vetta").
Ogni sezione è una tappa del percorso, e i nomi seguono questa metafora:

| Sezione (id)  | EN          | IT           |
|---------------|-------------|--------------|
| `top` (hero)  | —           | —            |
| `about`       | About       | Chi sono     |
| `experience`  | Route       | Percorso     |
| `skills`      | Backpack    | Zaino        |
| `projects`    | Projects    | Progetti     |
| *(numeri)*    | —           | —            |
| `education`   | Training    | Formazione   |
| `stimoli`     | Sparks      | Stimoli      |
| `contact`     | Summit ▲    | Vetta ▲      |

Il tono è **personale, vivace, un po' cyberpunk**, ma non da "gaming" e non corporate.

---

## 2. Colori

Definiti come variabili in `css/main.css` (`:root`). **Usa sempre le variabili, mai esadecimali sparsi.**

| Variabile  | Valore     | Uso |
|------------|------------|-----|
| `--ink`    | `#0b1d26`  | sfondo dei pannelli, testo su colori chiari |
| `--ink-2`  | `#12303b`  | variante più chiara di ink (hover) |
| `--cream`  | `#fff1dc`  | testo principale, polaroid, note |
| `--muted`  | crema 72%  | testo secondario |
| `--faint`  | crema 14%  | bordi sottili |
| `--lime`   | `#c8ff3d`  | CTA principale, evidenziazioni, "hi, I'm" |
| `--pink`   | `#ff5c7a`  | corallo-rosa: accenti, back-end |
| `--orange` | `#ff8a3d`  | accenti caldi, security |
| `--cyan`   | `#3de0ff`  | accenti freddi, data |
| `--yellow` | `#ffd23f`  | devops, etichetta "work in progress" |
| `--lava`   | `#ff5a1f`  | riservato alla lava/3D |

**Cielo** (cambia scorrendo, in `js/main.js` → `SKY`): blu oceano → turchese → oro → corallo,
e verso la vetta notte petrolio con bagliore di lava.

### Regole sui colori
- ❌ **Niente viola/lilla/magenta.** È stata una richiesta esplicita.
  Attenzione anche alle sfumature: un gradiente blu → corallo diretto passa per un malva; serve una tappa intermedia (turchese/oro).
- ✅ Colori vivaci, ma su base scura (`--ink`) per leggibilità.
- ✅ Ogni categoria ha il suo colore fisso (back-end = pink, linguaggi = cream, data = cyan, devops = yellow, front-end = lime, security = orange; hiking = lime, foto = cyan, dipinti = orange).

---

## 3. Tipografia

| Ruolo | Font | Note |
|-------|------|------|
| Titoli e testo | **Bricolage Grotesque** | titoli 800, `font-variation-settings: "wdth" 78–80, "opsz" 96`, interlinea stretta |
| Note scritte a mano | **Caveat** (classe `.hand`) | brevi frasi, leggermente ruotate |
| Etichette tecniche | **Space Mono** (classe `.mono`) | date, kicker, categorie |

- Le parole chiave dei titoli usano `.hl` + colore (`hl--lime`, `hl--pink`, `hl--orange`, `hl--cyan`): testo colorato con sottolineatura ondulata.
- Non usare `letter-spacing` troppo negativo: le lettere non devono toccarsi (max `-.02em`).
- Testo mai sotto i 16px.

---

## 4. Componenti

| Componente | Classe | Quando usarlo |
|------------|--------|---------------|
| Pannello | `.panel` | contenitore scuro di ogni sezione (non trasparente: sotto c'è il 3D) |
| Pulsanti | `.btn--lime`, `.btn--ghost`, `.btn--dark` | lime = azione principale |
| Sticker | `.sticker` + `--r` (rotazione) | fatti brevi, leggermente storti |
| Card lavoro | `.job` | colore pieno, espandibile |
| Poster progetto | `.poster` | colore pieno, apre il case study |
| Cartello | `.sign` | numeri/statistiche (forma a freccia) |
| Card dello stack | `.stack-card` | foto/hobby nella sezione Stimoli: card crema con nastro adesivo, impilate con lo scroll (Scroll Stack) |
| Filtri | `.filter` + `--c` | pillole per filtrare per categoria |

Elementi "storti": usare piccole rotazioni (`-4deg … 5deg`) che tornano dritte all'hover.

---

## 5. Il 3D (Etna)

Sorgente: `src/scene.js` → build in `js/scene.js` (`npm run build`).

- **Un solo vulcano** che sale dal mare. Niente altre catene montuose.
- ❌ Niente linee di contorno / "scan" luminose sul terreno.
- Vulcano **scuro** (toni basalto: marroni e rossi scuri), cima innevata.
- **Lava realistica**: crosta scura con crepe incandescenti che scorrono, più calda vicino al cratere; scintille dal cratere; fumo.
- Su desktop il vulcano sta a destra del nome nell'hero; su mobile sotto i pulsanti.
- Performance (non peggiorarle):
  - **illuminazione pre-calcolata**: terreno e mare non usano luci in tempo reale; la luce (emisfero, sole, luce di riempimento, lava) è calcolata una volta in `shade()` e salvata nei colori dei vertici. Se cambi i colori delle luci, cambiali in `LIGHT` (`src/scene.js`).
  - terreno diviso in 4×4 blocchi (quelli fuori inquadratura non vengono disegnati); i triangoli sotto il mare sono scartati;
  - antialiasing solo su schermi 1×, pixel ratio max 1.5, **risoluzione adattiva** se il dispositivo fatica;
  - 30 fps quando la pagina è ferma, piena velocità durante scroll/mouse, ~24 fps su dispositivi deboli; render in pausa con menu/case study aperti o tab nascosta;
  - un solo canvas WebGL; niente `backdrop-filter` sopra il canvas su mobile.
- Pagina: i font non bloccano il primo render (preload + `media="print"` → `all`); l'hero compare subito; durante lo scroll si scrive solo su `.sky` e `.hero`, mai su `<html>`.

---

## 6. Animazioni

Poche e belle:
1. decodifica del nome nell'hero,
2. salita della camera con lo scroll,
3. comparsa delle sezioni (`[data-reveal]`) e **titoli Split Text**: le lettere di `.title` / `.summit__title` salgono una a una (le parole `.hl` come blocco unico),
4. tilt dei poster + apertura del case study "dalla card",
5. pulsanti magnetici + **Shiny Text** sul CTA principale (`.btn--shine`, solo `transform`),
6. **Scroll Stack** in Stimoli (card sticky che si coprono; quella sotto si rimpicciolisce e scurisce).
7. **Click Spark**: scintille color lava (`#ff5a1f`, `#ff8a3d`, `#ffb347`, `#ffd23f`) a ogni click/tap.

Effetti ispirati a Vue Bits ma riscritti in JS/CSS vanilla: **non aggiungere Vue o altre librerie**.

Rispettare sempre `prefers-reduced-motion`.

---

## 7. Cose tolte su richiesta (non rimetterle)

- ❌ Emoji nei testi
- ❌ Chip/etichette di quota ("1.952 m · the view"), altimetro laterale, chip "Catania, Sicily · sea level"
- ❌ Striscia lime con le skill che scorrono (marquee)
- ❌ Sticker "may be slow to respond"
- ❌ La statistica "48 automated security checks"
- ❌ Dettagli di security non consolidati (pentesting, privilege escalation, OWASP…): si dice solo che **sta studiando** cybersecurity
- ❌ Viola, e il look "troppo AI / troppo professionale"

---

## 8. Tono di voce

- Prima persona, diretto, caldo, con un pizzico di ironia ("an honest amount of spaghetti").
- Frasi brevi. Niente gergo da CV ("dinamico", "orientato ai risultati").
- **Mai inventare** esperienze, numeri, clienti, certificazioni: la fonte è il CV (e i repository GitHub).
- Inglese di default, italiano completo tramite il selettore EN/IT.
