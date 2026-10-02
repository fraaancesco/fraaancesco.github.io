/* Italian copy. English lives in the HTML / main.js and is the default. */

export const IT = {
  meta: {
    title: 'Francesco Pistorio — backend engineer ai piedi dell\'Etna',
    description: 'Francesco Pistorio — backend engineer di giorno, nerd della sicurezza di notte. Java, Spring Boot, NestJS, Go. Catania.',
  },

  // static strings, keyed by data-i18n
  static: {
    'skip': 'Vai al contenuto',
    'nav.about': 'Chi sono',
    'nav.route': 'Percorso',
    'nav.pack': 'Zaino',
    'nav.projects': 'Progetti',
    'nav.training': 'Formazione',
    'nav.stimoli': 'Stimoli',
    'nav.summit': 'Vetta ▲',
    'menu.note': 'psst — il vulcano è 3D in tempo reale',

    'hero.hi': 'ciao, sono',
    'hero.lede': 'Backend engineer di giorno, <mark class="hl hl--pink">nerd della sicurezza</mark> di notte — scrivo API ai piedi di un vulcano.',
    'hero.cta1': 'Inizia la salita <span aria-hidden="true">↓</span>',
    'hero.cta2': 'Salta in cima <span aria-hidden="true">▲</span>',

    'about.title': 'Piacere di <span class="hl hl--orange">conoscerti</span>.',
    'about.p1': 'Sono Francesco, ingegnere informatico di Catania. Da qualche anno lavoro come software engineer in <strong>Fincons Group</strong>, soprattutto sul backend: sviluppo API REST in Java e TypeScript, mi occupo di PostgreSQL e MongoDB e, quando serve, do una mano sul frontend con Vue.js.',
    'about.p2': 'Mi piace capire come funzionano le cose — e come si rompono. È una curiosità che ho da quando ero bambino e che ora sto trasformando in studio vero: approfondisco la cybersecurity su <strong>TryHackMe</strong> e, quando posso, la metto in pratica scrivendo piccoli tool open source in <strong>Go</strong>.',
    'about.p3': 'Lontano dalla tastiera: pittura, sentieri di montagna e film thriller o horror — più sono cupi, meglio è.',
    'about.note': 'bravo a: parlare con le persone, lavorare in team, lavorare da solo, sbrogliare problemi ✓',
    'about.s1': '<span class="mono">vivo a</span>Catania, IT',
    'about.s2': '<span class="mono">lavoro</span>Software Engineer @ Fincons',
    'about.s3': '<span class="mono">adesso</span>a fondo su Go &amp; sicurezza',
    'about.s4': '<span class="mono">tempo libero</span>pittura · trekking · film horror',
    'about.s5': '<span class="mono">parlo</span>Italiano (madrelingua) · Inglese (professionale)',
    'about.s6': '<span class="mono">scrivo in</span>Java &amp; Go',

    'exp.title': 'Il percorso <span class="hl hl--cyan">finora</span>',
    'exp.sub': 'La mia strada, disegnata come un profilo altimetrico. Tocca un punto.',
    'wp.now': 'oggi',
    'job1.when': 'Apr 2022 → oggi · Catania',
    'job1.tldr': 'full-stack sulla carta, backend nel cuore',
    'job1.list': `
                <li><b>Spring Boot</b> — API REST scalabili e ad alte prestazioni in Java</li>
                <li><b>NestJS + TypeScript</b> — servizi RESTful su Node.js</li>
                <li><b>PostgreSQL &amp; MongoDB</b> — gestione dei dati</li>
                <li><b>Vue.js</b> — interfacce moderne e responsive quando serve il front-end</li>
                <li><b>Git, ogni giorno</b> — versionamento, lavoro in team, code review e debugging</li>
                <li><b>Processi</b> — migliorare ogni volta un po' il modo in cui sviluppiamo</li>`,
    'job2.when': '2024 → oggi · online · extra-lavoro',
    'job2.tldr': 'studio cybersecurity, un passo alla volta',
    'job2.list': `
                <li><b>Sto studiando</b> — cybersecurity, ancora in corso</li>
                <li><b>Profilo</b> — <a href="https://www.tryhackme.com/p/fraaancois" target="_blank" rel="noopener">tryhackme.com/p/fraaancois ↗</a></li>`,

    'skills.title': 'Cosa c\'è nello <span class="hl hl--lime">zaino</span>',
    'skills.sub': 'Tutto quello che porto in salita, in ordine di quanto spesso lo uso. Passa sopra o tocca un elemento.',
    'filter.all': 'tutto',
    'filter.lang': 'linguaggi',
    'filter.data': 'dati',
    'filter.security': 'sicurezza',
    'skills.pick': 'scegli qualcosa',
    'skills.hint': 'Ogni elemento dice dove compare davvero nel mio lavoro.',

    'proj.title': 'Cose che ho costruito <span class="hl hl--pink">lungo la strada</span>',
    'proj.sub': 'Due tool di sicurezza in Go e un gioco gloriosamente disordinato. Aprili pure.',
    'proj.open': 'apri il case study <span aria-hidden="true">→</span>',
    'proj.scanner': 'Gli dai degli URL e ti dice quali security header mancano o sono sbagliati — e quanto è grave.',
    'proj.jwt': 'Gli dai un JWT: lo decodifica e segnala tutto ciò che non va — <code>alg: none</code>, nessuna scadenza, chiavi incorporate…',
    'proj.fugonote': '↑ vero diagramma dell\'architettura*',
    'proj.fugokick': '03 · Unity · progetto universitario',
    'proj.fugo': 'Un videogioco fatto con un compagno di università. Singleton, design pattern, version control — e un po\' di onesti spaghetti.',

    'stats.years': 'anni di software vero in produzione <em>da aprile 2022</em>',
    'stats.tools': 'tool di sicurezza open source <em>scritti in Go</em>',
    'stats.langs': 'linguaggi di programmazione <em>Go · Java · TypeScript · JavaScript</em>',

    'edu.title': 'Campo di <span class="hl hl--cyan">allenamento</span>',
    'edu.bs': 'Laurea triennale in Ingegneria Informatica',
    'edu.diploma': 'Diploma tecnico in Informatica',
    'edu.thmwhen': '2024 → oggi',
    'edu.thm': 'Cybersecurity — in corso di studio',

    'stim.title': '<span class="hl hl--lime">Stimoli</span>',
    'stim.sub': 'Quello che mi tiene curioso quando il portatile è chiuso: sentieri, foto, dipinti. Un angolo che cresce un po\' ogni volta che torno da qualche parte.',
    'stim.wip': 'lavori in corso',
    'stim.all': 'tutto',
    'stim.hiking': 'trekking',
    'stim.photo': 'foto',
    'stim.painting': 'dipinti',

    'contact.hand': 'ce l\'hai fatta, sei in cima!',
    'contact.title': 'Ora dimmi <span class="summit__hi">ciao.</span>',
    'contact.lede': 'Nuove sfide, un progetto parallelo, due chiacchiere su backend o sicurezza — la mia inbox è aperta.',
    'footer.made': 'fatto a mano a Catania, sotto lo sguardo di un vulcano',
    'footer.top': 'torna al livello del mare ↓',

    'case.problem': 'il problema',
    'case.built': 'cosa ho costruito',
    'case.result': 'il risultato',
    'case.link': 'guardalo su GitHub ↗',
  },

  // strings used by main.js
  ui: {
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
    copy: 'copia email',
    copied: 'copiata ✓',
    focus: ' · focus attuale',
    whatItChecks: 'cosa controlla',
    whatItFlags: 'cosa segnala',
    sev: { critical: 'critici', high: 'alti', medium: 'medi', low: 'bassi', lowInfo: 'bassi / info' },
    live: 'in diretta da GitHub', updated: 'aggiornato',
    stim: {
      soon: 'presto qui',
      hiking: ['Sentieri', 'le escursioni arriveranno qui — tracce, cime, panorami'],
      photo: ['Foto', 'scatti dai miei giri, presto in questa cornice'],
      painting: ['Dipinti', 'le tele stanno asciugando — torna a trovarmi'],
    },
  },

  cat: { backend: 'back-end', lang: 'linguaggio', data: 'database', devops: 'devops', frontend: 'front-end', security: 'sicurezza' },

  pockets: [
    { title: 'ogni giorno', hint: 'quello che uso ogni giorno in Fincons' },
    { title: 'nello zaino', hint: 'sempre con me, lo uso quando serve' },
    { title: 'sto imparando ★', hint: 'il focus di adesso' },
  ],

  skills: {
    'Spring Boot': 'API REST scalabili e ad alte prestazioni in Java — parte del mio lavoro quotidiano in Fincons Group.',
    'Java': 'Il linguaggio dietro il mio lavoro con Spring Boot in Fincons Group.',
    'NestJS': 'Servizi RESTful in TypeScript su Node.js, in Fincons Group.',
    'TypeScript': 'Servizi backend tipizzati con NestJS in Fincons Group.',
    'REST APIs': ['API REST', 'Il filo conduttore: Spring Boot e NestJS al lavoro, Go + Gin nei miei tool.'],
    'PostgreSQL': 'Gestione di database relazionali in Fincons Group.',
    'MongoDB': 'Gestione di database documentali in Fincons Group.',
    'Git': 'Ogni singolo giorno: versionamento, lavoro in team e code review.',
    'Node.js': 'Il runtime sotto i servizi NestJS che sviluppo.',
    'Vue.js': 'Interfacce moderne e responsive in Fincons Group.',
    'JavaScript': 'Lavoro front-end e Node.js.',
    'HTML5': 'Le basi del front-end — questo sito è HTML scritto a mano.',
    'CSS': 'Le basi del front-end — ogni sticker storto qui è CSS puro.',
    'Docker': 'Entrambi i miei tool di sicurezza in Go girano con Docker / Docker Compose.',
    'Linux': 'Parte della mia cassetta degli attrezzi DevOps.',
    'CI/CD': 'Parte della mia cassetta degli attrezzi DevOps.',
    'Go': 'La mia fissa del momento. Finora due tool di sicurezza open source: uno scanner di header HTTP e un analizzatore di JWT.',
    'Gin': 'Il framework web Go dietro entrambi i miei tool di sicurezza.',
    'Cybersecurity': 'Quello che sto studiando adesso, su TryHackMe.',
  },

  waypoints: [
    ['2012', 'Inizio il diploma tecnico in Informatica all\'ITI Guglielmo Marconi.'],
    ['2017', 'Inizio Ingegneria Informatica all\'Università di Catania.'],
    ['2022', 'Entro in Fincons Group come Software Engineer ad aprile — e a ottobre chiudo la laurea.'],
    ['2024', 'Inizio a studiare cybersecurity su TryHackMe.'],
    ['oggi', 'API in Fincons di giorno, tool di sicurezza in Go la sera.'],
  ],

  projects: {
    scanner: {
      index: '01 · Go · open source',
      lede: 'Un\'API in Go che analizza gli header delle risposte HTTP per trovare protezioni mancanti o configurate male che potrebbero esporre un\'applicazione.',
      problem: 'Gli header di sicurezza sono tra le difese più economiche di una web app — e tra le più facili da dimenticare. Un HSTS o un CSP mancante non rompe niente di visibile, quindi nessuno se ne accorge finché non serve.',
      built: [
        'POST /scan — controlla più URL in una sola richiesta',
        '24 security header, divisi in quattro livelli di gravità',
        'Una raccomandazione per ogni header mancante, più un punteggio (% di controlli superati)',
        'Timeout e verifica TLS configurabili, supporto Bearer token per endpoint protetti',
        'Documentazione Swagger UI, Docker Compose e Makefile',
      ],
      result: 'Un tool open source che trasforma un audit degli header in una sola chiamata API, con un report ordinato per gravità e azioni concrete.',
    },
    jwt: {
      index: '02 · Go · AppSec',
      lede: 'Un servizio REST che analizza struttura e claim di un JWT e segnala vulnerabilità e violazioni delle best practice.',
      problem: 'I JWT portano l\'autenticazione in tantissime API, ma piccoli errori — un header "alg: none", nessuna scadenza, una chiave incorporata — possono trasformarli silenziosamente in una porta d\'ingresso.',
      built: [
        'Decodifica e parsing dei token senza verifica della firma',
        'Controlli di sicurezza su gravità critica, alta, media e bassa/info',
        'Elaborazione batch di più token insieme',
        'Endpoint per analisi completa (/analyze), sola decodifica (/decode) e health (/health)',
        'Soglie di scadenza configurabili via variabili d\'ambiente; docs Swagger; Docker Compose',
      ],
      result: 'Un analizzatore open source che spiega, controllo per controllo, perché un token è a rischio — organizzato in cmd / internal / pkg come un vero servizio Go.',
    },
    fugo: {
      index: '03 · Unity · progetto universitario',
      lede: 'Un videogioco sviluppato in Unity con un compagno di università — un esercizio sulla struttura, e su cosa succede senza.',
      problem: 'Costruire un gioco vero dall\'inizio alla fine, in coppia, e capire sulla propria pelle perché architettura e version control contano.',
      built: [
        'Un gioco completo sviluppato in Unity con un compagno di corso',
        'Singleton e altri design pattern nell\'architettura del gioco',
        'Tutto il progetto gestito sotto version control',
        'E sì, un po\' di spaghetti code lungo la strada — tenuto come parte della lezione',
      ],
      result: 'Una codebase di gioco finita e condivisa, e un\'idea molto concreta della differenza tra pattern e spaghetti.',
    },
  },
};
