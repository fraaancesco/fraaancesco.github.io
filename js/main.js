/* Francesco Pistorio — portfolio interactions (no dependencies). */

const root = document.documentElement;
const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let reduced = reduceMQ.matches;
reduceMQ.addEventListener?.('change', (e) => { reduced = e.matches; });

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const SUMMIT = 3350; // metres, roughly Etna's summit — the page is the climb

/* ─────────────────────────────── Content ─────────────────────────────── */

const SKILLS = [
  // tier 1 = every day at Fincons · tier 2 = in the toolbox · tier 3 = learning / current focus
  { name: 'Spring Boot', cat: 'backend', tier: 1, text: 'Scalable, high-performance REST APIs in Java — part of my daily work at Fincons Group.' },
  { name: 'Java', cat: 'lang', tier: 1, text: 'The language behind my Spring Boot work at Fincons Group.' },
  { name: 'NestJS', cat: 'backend', tier: 1, text: 'RESTful services written in TypeScript on Node.js, at Fincons Group.' },
  { name: 'TypeScript', cat: 'lang', tier: 1, text: 'Typed backend services with NestJS at Fincons Group.' },
  { name: 'REST APIs', cat: 'backend', tier: 1, text: 'The common thread: Spring Boot and NestJS at work, Go + Gin in my own tools.' },
  { name: 'PostgreSQL', cat: 'data', tier: 1, text: 'Relational database management at Fincons Group.' },
  { name: 'MongoDB', cat: 'data', tier: 1, text: 'Document database management at Fincons Group.' },
  { name: 'Git', cat: 'devops', tier: 1, text: 'Every single day: versioning, teamwork and code reviews.' },
  { name: 'Node.js', cat: 'backend', tier: 2, text: 'The runtime under the NestJS services I build.' },
  { name: 'Vue.js', cat: 'frontend', tier: 2, text: 'Modern, responsive user interfaces at Fincons Group.' },
  { name: 'JavaScript', cat: 'lang', tier: 2, text: 'Front-end and Node.js work.' },
  { name: 'HTML5', cat: 'frontend', tier: 2, text: 'Front-end foundations — this site is hand-written HTML.' },
  { name: 'CSS', cat: 'frontend', tier: 2, text: 'Front-end foundations — every wobbly sticker here is plain CSS.' },
  { name: 'Docker', cat: 'devops', tier: 2, text: 'Both of my Go security tools ship with Docker / Docker Compose.' },
  { name: 'Linux', cat: 'devops', tier: 2, text: 'In the DevOps toolbox, plus the Linux fundamentals rooms on TryHackMe.' },
  { name: 'CI/CD', cat: 'devops', tier: 2, text: 'Part of my DevOps toolbox.' },
  { name: 'Go', cat: 'lang', tier: 3, focus: true, text: 'My current obsession. Two open-source security tools so far: an HTTP header scanner and a JWT analyzer.' },
  { name: 'Gin', cat: 'backend', tier: 3, text: 'The Go web framework behind both of my security tools.' },
  { name: 'Pentesting', cat: 'security', tier: 3, focus: true, text: 'Practising penetration testing on TryHackMe since 2024.' },
  { name: 'Web exploitation', cat: 'security', tier: 3, text: 'Hands-on web exploitation techniques on TryHackMe.' },
  { name: 'Privilege escalation', cat: 'security', tier: 3, text: 'Privilege-escalation techniques practised on TryHackMe.' },
  { name: 'OWASP Top 10', cat: 'security', tier: 3, text: 'Completed the OWASP Top 10 room on TryHackMe.' },
  { name: 'Network scanning', cat: 'security', tier: 3, text: 'Completed network scanning rooms on TryHackMe.' },
];
const POCKETS = [
  { tier: 1, title: 'every day', hint: 'what I use daily at Fincons' },
  { tier: 2, title: 'in the pack', hint: 'always with me, used when needed' },
  { tier: 3, title: 'learning the ropes ★', hint: 'current focus & after-hours practice' },
];
const CAT_LABEL = { backend: 'back-end', lang: 'language', data: 'database', devops: 'devops', frontend: 'front-end', security: 'security' };

const WAYPOINTS = [
  ['2012', 'Started a technical diploma in Computer Science at ITI Guglielmo Marconi.'],
  ['2017', 'Began Computer Engineering at the Università di Catania.'],
  ['2022', 'Joined Fincons Group as a Software Engineer in April — and wrapped up the degree in October.'],
  ['2024', 'Started practising offensive security on TryHackMe.'],
  ['now', 'Shipping APIs at Fincons by day, writing security tools in Go by night.'],
];

const sevBlock = (rows) => `<div class="case__matrix">${rows.map(([cls, label, n, text]) =>
  `<div><b class="${cls}">${label}</b><strong>${n}</strong><p>${text}</p></div>`).join('')}</div>`;

const PROJECTS = {
  scanner: {
    color: 'var(--lime)',
    index: '01 · Go · open source',
    title: 'HTTP Header Security Scanner',
    lede: 'A Go API that analyses HTTP response headers to find missing or misconfigured protections that could leave an app exposed.',
    problem: 'Security headers are one of the cheapest defences a web app has — and one of the easiest to forget. A missing HSTS or CSP header doesn\'t break anything visibly, so nobody notices until it matters.',
    built: [
      'POST /scan — checks multiple URLs in a single request',
      '24 security headers, sorted into four severity levels',
      'A recommendation for every missing header, plus a score (% of checks passed)',
      'Configurable timeout and TLS verification, Bearer-token support for protected endpoints',
      'Swagger UI docs, Docker Compose and Makefile workflows',
    ],
    stack: ['Go', 'Gin', 'Swagger / OpenAPI', 'Docker', 'Make'],
    result: 'An open-source tool that turns a header audit into one API call with a severity-ranked, actionable report.',
    link: 'https://github.com/fraaancesco/http-header-security-scanner',
    extra: () => `<h3 class="case__h mono">what it checks</h3>${sevBlock([
      ['sev-crit', 'critical', 2, 'Strict-Transport-Security, Content-Security-Policy'],
      ['sev-high', 'high', 5, 'X-Frame-Options, X-Content-Type-Options, COOP, CORP, COEP'],
      ['sev-med', 'medium', 4, 'Referrer-Policy, Permissions-Policy, Cache-Control, Clear-Site-Data'],
      ['sev-low', 'low', 13, 'X-XSS-Protection, X-Permitted-Cross-Domain-Policies, X-DNS-Prefetch-Control and more'],
    ])}`,
  },
  jwt: {
    color: 'var(--pink)',
    index: '02 · Go · AppSec',
    title: 'JWT Token Analyzer',
    lede: 'A REST API service that analyses a JWT\'s structure and claims, and flags vulnerabilities and best-practice violations.',
    problem: 'JWTs carry authentication across countless APIs, but tiny mistakes — an "alg: none" header, no expiration, an embedded key — can quietly turn them into a way in.',
    built: [
      'Decoding and parsing of tokens without signature verification',
      'Security checks across critical, high, medium and low/info severities',
      'Batch processing for multiple tokens at once',
      'Endpoints for full analysis (/analyze), plain decoding (/decode) and health (/health)',
      'Configurable expiration thresholds via env vars; Swagger docs; Docker Compose',
    ],
    stack: ['Go 1.21+', 'Gin', 'Swagger / OpenAPI', 'Docker Compose'],
    result: 'An open-source analyser that explains, check by check, why a token is risky — laid out as cmd / internal / pkg like a proper Go service.',
    link: 'https://github.com/fraaancesco/JWT-token-analyzer',
    extra: () => `<h3 class="case__h mono">what it flags</h3>${sevBlock([
      ['sev-crit', 'critical', 5, 'ALG_NONE, ALG_MISSING, JWK_EMBEDDED, EMPTY_SIGNATURE, MALFORMED_TOKEN'],
      ['sev-high', 'high', 7, 'ALG_UNKNOWN, JKU_PRESENT, X5U_PRESENT, KID_INJECTION, NO_EXPIRATION, TOKEN_EXPIRED, VERY_LONG_EXPIRATION'],
      ['sev-med', 'medium', 7, 'ALG_WEAK_HMAC, X5C_PRESENT, LONG_EXPIRATION, NO_ISSUER, NO_AUDIENCE, IAT_FUTURE, SENSITIVE_DATA'],
      ['sev-low', 'low / info', 5, 'NO_IAT, NO_SUBJECT, NO_JTI, ALG_SYMMETRIC, NOT_YET_VALID'],
    ])}`,
  },
  fugo: {
    color: 'var(--orange)',
    index: '03 · Unity · university project',
    title: 'FUGO PUGO',
    lede: 'A video game built in Unity with a university mate — an exercise in structure, and in what happens without it.',
    problem: 'Build a real game end to end, as a pair, and learn first-hand why architecture and version control matter.',
    built: [
      'A complete game developed in Unity with a fellow student',
      'Singleton and other design patterns in the game\'s architecture',
      'The whole thing managed under version control',
      'And yes, some spaghetti code along the way — kept as part of the lesson',
    ],
    stack: ['Unity', 'Design patterns', 'Git'],
    result: 'A finished, shared game codebase and a very concrete feel for the difference between patterns and spaghetti.',
    link: 'https://github.com/fraaancesco/FUGOPUGO',
    extra: () => '',
  },
};

/* ─────────────────────────────── Boot ─────────────────────────────── */

window.addEventListener('load', () => root.classList.add('is-loaded'), { once: true });
setTimeout(() => root.classList.add('is-loaded'), 1800); // never leave the hero hidden
$('#year').textContent = new Date().getFullYear();

function scramble(el, delay = 0) {
  const final = el.textContent;
  if (reduced) return;
  const glyphs = '<>/\\[]{}#$%&*+=?_01';
  const total = 24;
  let frame = 0;
  el.setAttribute('aria-label', final);
  const tick = () => {
    frame++;
    const revealed = Math.floor((frame / total) * final.length);
    let html = '';
    for (let i = 0; i < final.length; i++) {
      html += i < revealed ? final[i] : `<span class="glyph" aria-hidden="true">${glyphs[(Math.random() * glyphs.length) | 0]}</span>`;
    }
    el.innerHTML = html;
    if (frame < total) requestAnimationFrame(tick); else el.textContent = final;
  };
  setTimeout(() => requestAnimationFrame(tick), delay);
}
$$('[data-scramble]').forEach((el, i) => scramble(el, 250 + i * 160));

/* ─────────────────────────────── Navigation ─────────────────────────────── */

const nav = $('#nav');
const toggle = $('.nav__toggle');
const menu = $('#menu');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  $('.sr-only', toggle).textContent = open ? 'Close menu' : 'Open menu';
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    document.body.classList.add('has-modal');
    $('a', menu).focus({ preventScroll: true });
  } else {
    menu.classList.remove('is-open');
    document.body.classList.remove('has-modal');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduced ? 0 : 700);
  }
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});
menu.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const items = [...$$('a', menu), toggle];
  const i = items.indexOf(document.activeElement);
  if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
  else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
});
toggle.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey && toggle.getAttribute('aria-expanded') === 'true') { e.preventDefault(); $('a', menu).focus(); }
});

const navLinks = $$('.nav__links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${entry.target.id}`)));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['about', 'experience', 'skills', 'projects', 'education', 'contact'].forEach((id) => sectionObserver.observe(document.getElementById(id)));

/* ─────────────────────────────── The climb (scroll) ─────────────────────────────── */

// sky colours along the climb: golden hour at sea level → night with lava glow at the top
const SKY = [
  [0, ['#0d3b66', '#12808f', '#ffc857', '#ff7f50']],
  [0.5, ['#0a2f52', '#0f6d7a', '#ffa040', '#ff5e4a']],
  [1, ['#061a26', '#0b3d4a', '#d9502e', '#ff5a3c']],
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const SKY_RGB = SKY.map(([p, cols]) => [p, cols.map(hex)]);
function skyAt(p) {
  let a = SKY_RGB[0], b = SKY_RGB[SKY_RGB.length - 1];
  for (let i = 0; i < SKY_RGB.length - 1; i++) {
    if (p >= SKY_RGB[i][0] && p <= SKY_RGB[i + 1][0]) { a = SKY_RGB[i]; b = SKY_RGB[i + 1]; break; }
  }
  const t = (p - a[0]) / (b[0] - a[0] || 1);
  return a[1].map((c, i) => c.map((v, k) => Math.round(v + (b[1][i][k] - v) * t)));
}

const hero = $('.hero');
const altEl = $('#alt');
const scene = { api: null, p: 0 };
let scrollQueued = false;

function onScroll() {
  scrollQueued = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const p = clamp(y / max);
  scene.p = p;

  root.style.setProperty('--progress', p.toFixed(4));
  nav.classList.toggle('is-compact', y > 40);
  altEl.textContent = Math.round(p * SUMMIT).toLocaleString('en-US');

  const sky = skyAt(p);
  ['--sky1', '--sky2', '--sky3', '--sky4'].forEach((v, i) => root.style.setProperty(v, `rgb(${sky[i].join(',')})`));

  const h = clamp(y / (hero.offsetHeight * 0.8));
  if (!reduced) {
    hero.style.setProperty('--hero-y', `${(-h * 90).toFixed(1)}px`);
    hero.style.setProperty('--hero-o', (1 - h * 1.1).toFixed(3));
  }
  scene.api?.setProgress(p, sky[3]);
}
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });

// checkpoints show the altitude you'll be at when that chapter is centred on screen
const CHECKPOINT_LABEL = { about: 'base camp', experience: 'the route', skills: 'gear check', projects: 'the view', education: 'training camp', contact: 'summit' };
function placeCheckpoints() {
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  $$('[data-checkpoint]').forEach((cp) => {
    const section = cp.parentElement;
    const top = section.getBoundingClientRect().top + window.scrollY + cp.offsetTop;
    const p = clamp((top - vh / 2) / max);
    const label = CHECKPOINT_LABEL[section.id] || 'trail stats';
    cp.textContent = `${Math.round(p * SUMMIT).toLocaleString('en-US')} m · ${label}`;
  });
}
window.addEventListener('resize', () => { placeCheckpoints(); onScroll(); });
window.addEventListener('load', placeCheckpoints);
placeCheckpoints();
onScroll();

/* ─────────────────────────────── Reveal ─────────────────────────────── */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
$$('[data-reveal]').forEach((el) => {
  const siblings = [...el.parentElement.children].filter((n) => n.hasAttribute('data-reveal'));
  const i = siblings.indexOf(el);
  if (i > 0) el.style.setProperty('--d', `${Math.min(i, 4) * 0.09}s`);
  revealObserver.observe(el);
});

/* Magnetic buttons ------------------------------------------------------- */
if (finePointer) {
  $$('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      if (reduced) return;
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

/* ─────────────────────────────── Route (experience) ─────────────────────────────── */

const wpButtons = $$('[data-wp]');
function showWaypoint(i) {
  wpButtons.forEach((b) => b.classList.toggle('is-on', Number(b.dataset.wp) === i));
  $('#wp-year').textContent = WAYPOINTS[i][0];
  $('#wp-text').textContent = WAYPOINTS[i][1];
}
wpButtons.forEach((b) => {
  const i = Number(b.dataset.wp);
  b.setAttribute('aria-label', `${WAYPOINTS[i][0]}: ${WAYPOINTS[i][1]}`);
  b.addEventListener('click', () => showWaypoint(i));
  b.addEventListener('pointerenter', () => showWaypoint(i));
  b.addEventListener('focus', () => showWaypoint(i));
});
showWaypoint(2);

$$('[data-job]').forEach((job) => {
  const head = $('.job__head', job);
  head.addEventListener('click', () => head.setAttribute('aria-expanded', String(head.getAttribute('aria-expanded') !== 'true')));
});

/* ─────────────────────────────── Backpack (skills) ─────────────────────────────── */

const pack = $('#pack');
const note = { cat: $('#skill-cat'), name: $('#skill-name'), text: $('#skill-text') };
const items = [];
POCKETS.forEach((pocket) => {
  const div = document.createElement('div');
  div.className = 'pocket';
  div.innerHTML = `<p class="pocket__title">${pocket.title}</p><p class="pocket__hint">${pocket.hint}</p><ul class="items"></ul>`;
  const ul = $('.items', div);
  SKILLS.filter((s) => s.tier === pocket.tier).forEach((s, i) => {
    const li = document.createElement('li');
    li.className = `item${s.tier === 1 ? ' item--big' : ''}${s.focus ? ' item--focus' : ''}`;
    li.dataset.cat = s.cat;
    li.style.setProperty('--r', `${((i * 7) % 5) - 2}deg`); // deterministic little wobble
    li.innerHTML = `<button type="button">${s.name}</button>`;
    ul.appendChild(li);
    items.push({ li, s });
  });
  pack.appendChild(div);
});
function showSkill(it) {
  items.forEach((x) => x.li.classList.toggle('is-sel', x === it));
  note.cat.textContent = `${CAT_LABEL[it.s.cat]}${it.s.focus ? ' · current focus' : ''}`;
  note.name.textContent = it.s.name;
  note.text.textContent = it.s.text;
}
items.forEach((it) => {
  const b = $('button', it.li);
  ['pointerenter', 'focus', 'click'].forEach((ev) => b.addEventListener(ev, () => showSkill(it)));
});
$$('.filter').forEach((f) => {
  f.addEventListener('click', () => {
    $$('.filter').forEach((x) => { x.classList.toggle('is-on', x === f); x.setAttribute('aria-pressed', String(x === f)); });
    const cat = f.dataset.filter;
    items.forEach(({ li, s }) => li.classList.toggle('is-dim', cat !== 'all' && s.cat !== cat));
  });
});

/* ─────────────────────────────── Projects ─────────────────────────────── */

const grid = $('.viz-headers__grid');
if (grid) {
  [['--pink', 2], ['--orange', 5], ['--lime', 4], ['--cyan', 13]].forEach(([v, n]) => {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.style.setProperty('--c', `var(${v})`);
      grid.appendChild(s);
    }
  });
  const cells = $$('span', grid);
  let idx = 0, timer = null;
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (reduced) { cells.forEach((c) => c.classList.add('is-hit')); return; }
    if (e.isIntersecting) {
      timer = setInterval(() => {
        cells.forEach((c, i) => c.classList.toggle('is-hit', i <= idx));
        idx = (idx + 1) % (cells.length + 8);
      }, 120);
    }
  }).observe(grid);
}

if (finePointer) {
  $$('.poster').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (reduced) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 8}deg`);
      card.style.setProperty('--rx', `${(0.5 - ((e.clientY - r.top) / r.height)) * 8}deg`);
    });
    card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  });
}

const dialog = $('#case');
const panel = $('.case__panel', dialog);
let originCard = null;

function fillCase(p) {
  panel.style.setProperty('--case-c', p.color);
  $('#case-index').textContent = p.index;
  $('#case-title').textContent = p.title;
  $('#case-lede').textContent = p.lede;
  $('#case-problem').textContent = p.problem;
  $('#case-result').textContent = p.result;
  $('#case-built').innerHTML = p.built.map((b) => `<li>${b}</li>`).join('');
  $('#case-stack').innerHTML = p.stack.map((t) => `<li>${t}</li>`).join('');
  $('#case-extra').innerHTML = p.extra();
  $('#case-link').href = p.link;
  $$('.case__kicker, .case__title, .case__lede, .case__grid > section, .case__extra, #case-link', dialog).forEach((el, i) => {
    el.setAttribute('data-case-in', '');
    el.style.transitionDelay = `${0.12 + i * 0.04}s`;
  });
}
function flipFrom(card) {
  const from = card.getBoundingClientRect();
  const to = panel.getBoundingClientRect();
  return [
    { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, borderRadius: '30px' },
    { transform: 'none', borderRadius: getComputedStyle(panel).borderRadius },
  ];
}
function openCase(key, card) {
  originCard = card;
  fillCase(PROJECTS[key]);
  $('.case__scroll', dialog).scrollTop = 0;
  dialog.showModal();
  document.body.classList.add('has-modal');
  if (!reduced && panel.animate) panel.animate(flipFrom(card), { duration: 650, easing: 'cubic-bezier(.7,0,.2,1)' });
  requestAnimationFrame(() => dialog.classList.add('is-ready'));
}
function closeCase() {
  dialog.classList.remove('is-ready');
  const done = () => {
    dialog.close();
    document.body.classList.remove('has-modal');
    $('.poster__open', originCard)?.focus({ preventScroll: true });
  };
  if (!reduced && panel.animate && originCard) {
    panel.animate(flipFrom(originCard).reverse(), { duration: 450, easing: 'cubic-bezier(.7,0,.2,1)' }).onfinish = done;
  } else done();
}
$$('[data-open]').forEach((b) => b.addEventListener('click', () => openCase(b.dataset.open, b.closest('.poster'))));
$('[data-close]', dialog).addEventListener('click', closeCase);
dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeCase(); });
dialog.addEventListener('click', (e) => { if (e.target === dialog) closeCase(); });

/* ─────────────────────────────── Numbers ─────────────────────────────── */

$$('[data-count]').forEach((el) => {
  let target = Number(el.dataset.count);
  if (el.dataset.since) {
    const since = new Date(el.dataset.since);
    const now = new Date();
    target = now.getFullYear() - since.getFullYear();
    if (now < new Date(now.getFullYear(), since.getMonth(), since.getDate())) target--;
  }
  el.textContent = target;
  if (reduced) return;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / 1300);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });
  io.observe(el);
});

$$('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const label = $('.copy__label', btn);
    try { await navigator.clipboard.writeText(btn.dataset.copy); label.textContent = 'copied ✓'; }
    catch { label.textContent = btn.dataset.copy; }
    btn.classList.add('is-done');
    setTimeout(() => { label.textContent = 'copy email'; btn.classList.remove('is-done'); }, 2200);
  });
});

/* ─────────────────────────────── 3D volcano ─────────────────────────────── */

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch { return false; }
}
function lowPower() {
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const small = window.matchMedia('(max-width: 720px)').matches;
  return mem <= 4 || cores <= 4 || small || navigator.connection?.saveData === true;
}
async function bootScene() {
  if (!webglAvailable()) { root.classList.add('no-webgl'); return; }
  try {
    const { createScene } = await import('./scene.js');
    scene.api = createScene($('#stage-canvas'), { low: lowPower(), reduced: () => reduced });
    onScroll();
  } catch (err) {
    console.warn('3D disabled:', err);
    root.classList.add('no-webgl');
  }
}
if ('requestIdleCallback' in window) requestIdleCallback(bootScene, { timeout: 500 });
else setTimeout(bootScene, 150);
