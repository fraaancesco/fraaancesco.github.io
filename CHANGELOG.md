# Changelog

Storico delle modifiche al portfolio, dalla più recente.
Aggiungi una riga ogni volta che cambi qualcosa di visibile.

## 2026-10

- **Responsive**: titolo hero che non esce più dallo schermo sui telefoni piccoli; sottolineature ondulate dei titoli che non toccano più il testo sotto; padding mobile delle sezioni finalmente applicato (un selettore CSS rotto lo annullava); poster in evidenza orizzontale sui tablet; menu a burger fino a 1180px (la barra non si accavalla più sui tablet); menu scorrevole e niente scroll-stack con il telefono in orizzontale; effetti hover solo su dispositivi con mouse (niente stati "bloccati" dopo un tap); ritocchi sotto i 380px.
- **Performance**: 3D e cielo dimensionati sul viewport grande, quindi la barra degli indirizzi su mobile non ridimensiona più il canvas WebGL; scroll-stack aggiornato una volta per frame senza layout thrashing; cielo aggiornato solo quando i colori cambiano; canvas delle scintille allocato solo al primo click.
- **About**: nuovo sticker "codes in Java & Go" / "scrivo in Java & Go".
- **GitHub dal vivo**: le card dei progetti mostrano ultimo aggiornamento e linguaggi letti dalle API pubbliche di GitHub a ogni caricamento della pagina (nascosti se GitHub non risponde).
- **Click Spark**: scintille color lava a ogni click/tap (canvas attivo solo durante l'animazione; disattivato con riduzione animazioni).
- **Animazioni** (ispirate a Vue Bits, in vanilla): titoli Split Text, riflesso Shiny Text su "Start the climb", Scroll Stack per Stimoli al posto della griglia di polaroid.
- **Performance**: primo testo visibile da ~6 s a ~0,6 s (font non bloccanti, hero senza attesa del `load`); 3D circa 3× più veloce su desktop (illuminazione pre-calcolata nei vertici, terreno a blocchi senza triangoli sommersi, antialiasing solo su schermi 1×, risoluzione adattiva, 30 fps a pagina ferma, pausa con menu/dialog aperti). Bagliore del cratere ora è uno sprite che pulsa.
- **Training**: tolta la riga "TryHackMe" dalla voce Cybersecurity.
- **Training**: voci in ordine cronologico (diploma → laurea → cybersecurity).
- **Documentazione**: `docs/STYLE.md` (guida di stile), `docs/CONTENT.md` (come aggiungere contenuti), `CLAUDE.md` (regole per le sessioni AI), questo changelog.
- **Sparks / Stimoli**: nuova sezione (work in progress) per trekking, foto e dipinti, con polaroid filtrabili e lightbox. Contenuti in `js/stimoli.js`.
- **About** riscritto in EN e IT ("Nice to meet you." / "Piacere di conoscerti.").
- **Lingua**: selettore EN/IT, inglese di default, scelta salvata nel browser.
- **Security alleggerita**: solo "sto studiando cybersecurity"; tolte le tecniche specifiche.
- **3D**: lava realistica (crosta + crepe incandescenti, scintille), vulcano più scuro.
- **Mobile**: tolto il blur sopra il 3D, fps limitati sui dispositivi deboli, fallback per `<dialog>`.
- Tolte le emoji.
- **3D**: un solo vulcano, niente linee di contorno; tolti chip di quota, altimetro, chip "Catania · sea level" e la statistica "48 checks".
- **Palette**: via il viola → blu oceano, turchese, oro, corallo, terracotta; tolta la striscia marquee e lo sticker "may be slow to respond".
- **Redesign**: da portfolio scuro/minimal a "salita sull'Etna al tramonto", tono più personale.
- **Prima versione** del portfolio 3D (Three.js) al posto della pagina segnaposto.
