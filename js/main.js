/* Francesco Pistorio — portfolio interactions (no dependencies). */

const root = document.documentElement;
const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let reduced = reduceMQ.matches;
reduceMQ.addEventListener?.('change', (e) => { reduced = e.matches; });

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* ─────────────────────────────── Content ─────────────────────────────── */

const SKILLS = [
  // tier 1 = daily work at Fincons, tier 2 = used / listed, tier 3 = practice & exploration
  { name: 'Spring Boot', cat: 'backend', tier: 1, text: 'Scalable, high-performance REST APIs in Java — part of my daily work at Fincons Group.' },
  { name: 'NestJS', cat: 'backend', tier: 1, text: 'RESTful services written in TypeScript on Node.js at Fincons Group.' },
  { name: 'REST API', cat: 'backend', tier: 1, text: 'The common thread: REST APIs with Spring Boot and NestJS at work, and with Go + Gin in my security tools.' },
  { name: 'Java', cat: 'lang', tier: 1, text: 'Backend development with Spring Boot at Fincons Group.' },
  { name: 'TypeScript', cat: 'lang', tier: 1, text: 'Typed backend services with NestJS at Fincons Group.' },
  { name: 'PostgreSQL', cat: 'data', tier: 1, text: 'Relational database management at Fincons Group.' },
  { name: 'MongoDB', cat: 'data', tier: 1, text: 'Document database management at Fincons Group.' },
  { name: 'Git', cat: 'devops', tier: 1, text: 'Used daily for versioning and team collaboration, alongside code reviews.' },
  { name: 'Node.js', cat: 'backend', tier: 2, text: 'Runtime behind the NestJS services I build at Fincons Group.' },
  { name: 'Vue.js', cat: 'frontend', tier: 2, text: 'Modern, responsive user interfaces at Fincons Group.' },
  { name: 'JavaScript', cat: 'lang', tier: 2, text: 'Front-end and Node.js work.' },
  { name: 'HTML5', cat: 'frontend', tier: 2, text: 'Front-end foundations — including this site, hand-written.' },
  { name: 'CSS', cat: 'frontend', tier: 2, text: 'Front-end foundations — including this site, hand-written.' },
  { name: 'Docker', cat: 'devops', tier: 2, text: 'Both of my Go security tools ship with Docker / Docker Compose setups.' },
  { name: 'Linux', cat: 'devops', tier: 2, text: 'Part of my DevOps toolbox, and a completed Linux fundamentals path on TryHackMe.' },
  { name: 'CI/CD', cat: 'devops', tier: 2, text: 'Part of my DevOps toolbox.' },
  { name: 'Go', cat: 'lang', tier: 3, focus: true, text: 'My current deep-dive. I wrote two open-source security tools in Go: an HTTP header scanner and a JWT analyzer.' },
  { name: 'Gin', cat: 'backend', tier: 3, text: 'The Go web framework behind both of my security tools.' },
  { name: 'Pentesting', cat: 'security', tier: 3, focus: true, text: 'Practising penetration testing on TryHackMe since 2024.' },
  { name: 'Web exploitation', cat: 'security', tier: 3, text: 'Hands-on web exploitation techniques on TryHackMe.' },
  { name: 'Privilege escalation', cat: 'security', tier: 3, text: 'Privilege-escalation techniques practised on TryHackMe.' },
  { name: 'OWASP Top 10', cat: 'security', tier: 3, text: 'Completed the OWASP Top 10 room on TryHackMe.' },
  { name: 'Network scanning', cat: 'security', tier: 3, text: 'Completed network scanning rooms on TryHackMe.' },
];

const CAT_LABEL = { backend: 'Back-end', lang: 'Programming language', data: 'Database', devops: 'DevOps', frontend: 'Front-end', security: 'Security' };

const PROJECTS = {
  scanner: {
    index: '01 — Go · Security tooling',
    title: 'HTTP Header Security Scanner',
    lede: 'A Go-based API that analyses HTTP response headers to detect missing or misconfigured protections that could leave an application vulnerable.',
    problem: 'Security headers are one of the cheapest defences a web app has — and one of the easiest to forget. A missing HSTS or CSP header rarely breaks anything visibly, so it tends to go unnoticed until it matters.',
    built: [
      'A REST endpoint (POST /scan) that checks multiple URLs in a single request',
      '24 security headers checked, grouped in four severity levels',
      'A recommendation for every missing header, plus a score summary (% of checks passed)',
      'Configurable timeout and TLS verification, and Bearer-token support for protected endpoints',
      'Swagger UI documentation, Docker Compose and Makefile workflows',
    ],
    stack: ['Go', 'Gin', 'Swagger / OpenAPI', 'Docker', 'Make'],
    result: 'An open-source tool that turns a header audit into a single API call with an actionable, severity-ranked report.',
    link: 'https://github.com/fraaancesco/http-header-security-scanner',
    extra: () => `
      <h3 class="case__h mono">Coverage by severity</h3>
      <div class="case__matrix">
        <div><span class="sev sev--crit">Critical</span><strong>2</strong><p>Strict-Transport-Security, Content-Security-Policy</p></div>
        <div><span class="sev sev--high">High</span><strong>5</strong><p>X-Frame-Options, X-Content-Type-Options, COOP, CORP, COEP</p></div>
        <div><span class="sev sev--med">Medium</span><strong>4</strong><p>Referrer-Policy, Permissions-Policy, Cache-Control, Clear-Site-Data</p></div>
        <div><span class="sev sev--low">Low</span><strong>13</strong><p>X-XSS-Protection, X-Permitted-Cross-Domain-Policies, X-DNS-Prefetch-Control and more</p></div>
      </div>`,
  },
  jwt: {
    index: '02 — Go · AppSec',
    title: 'JWT Token Analyzer',
    lede: 'A REST API service that analyses a JWT\'s structure and claims, and identifies potential vulnerabilities and best-practice violations.',
    problem: 'JSON Web Tokens carry authentication across countless APIs, but small mistakes — an "alg: none" header, no expiration, an embedded key — can quietly turn them into a way in.',
    built: [
      'Decoding and parsing of tokens without signature verification',
      'Security checks across critical, high, medium and low/info severities',
      'Batch processing for multiple tokens in one request',
      'Endpoints for full analysis (/analyze), plain decoding (/decode) and health (/health)',
      'Configurable expiration thresholds via environment variables; Swagger docs; Docker Compose',
    ],
    stack: ['Go 1.21+', 'Gin', 'Swagger / OpenAPI', 'Docker Compose'],
    result: 'An open-source analyser that explains, check by check, why a token is risky — structured as cmd / internal / pkg like a production Go service.',
    link: 'https://github.com/fraaancesco/JWT-token-analyzer',
    extra: () => `
      <h3 class="case__h mono">What it flags</h3>
      <div class="case__matrix">
        <div><span class="sev sev--crit">Critical</span><strong>5</strong><p>ALG_NONE, ALG_MISSING, JWK_EMBEDDED, EMPTY_SIGNATURE, MALFORMED_TOKEN</p></div>
        <div><span class="sev sev--high">High</span><strong>7</strong><p>ALG_UNKNOWN, JKU_PRESENT, X5U_PRESENT, KID_INJECTION, NO_EXPIRATION, TOKEN_EXPIRED, VERY_LONG_EXPIRATION</p></div>
        <div><span class="sev sev--med">Medium</span><strong>7</strong><p>ALG_WEAK_HMAC, X5C_PRESENT, LONG_EXPIRATION, NO_ISSUER, NO_AUDIENCE, IAT_FUTURE, SENSITIVE_DATA</p></div>
        <div><span class="sev sev--low">Low / info</span><strong>5</strong><p>NO_IAT, NO_SUBJECT, NO_JTI, ALG_SYMMETRIC, NOT_YET_VALID</p></div>
      </div>`,
  },
  fugo: {
    index: '03 — Unity · University project',
    title: 'FUGO PUGO',
    lede: 'A video game developed in Unity together with a university colleague, as an academic exercise in structure — and in what happens without it.',
    problem: 'A university project with a twist: build a real game end to end, as a pair, and learn first-hand why architecture and version control matter.',
    built: [
      'A game developed in Unity, in collaboration with a fellow student',
      'Singleton and other design patterns applied to the game\'s architecture',
      'The whole project managed with version control',
      'And, honestly, some spaghetti code along the way — documented as part of the lesson',
    ],
    stack: ['Unity', 'Design patterns', 'Git'],
    result: 'A finished, shared game codebase and a very concrete understanding of the difference between boilerplate, patterns and spaghetti.',
    link: 'https://github.com/fraaancesco/FUGOPUGO',
    extra: () => '',
  },
};

/* ─────────────────────────────── Boot ─────────────────────────────── */

window.addEventListener('load', () => root.classList.add('is-loaded'), { once: true });
// safety: never leave hero hidden if load is slow
setTimeout(() => root.classList.add('is-loaded'), 1800);
$('#year').textContent = new Date().getFullYear();

/* Scramble / decode text (hero name) ------------------------------------ */
function scramble(el, delay = 0) {
  const final = el.textContent;
  if (reduced) return;
  const glyphs = '01<>/\\[]{}#$%&*+=?_';
  const total = 26;
  let frame = 0;
  el.setAttribute('aria-label', final);
  const tick = () => {
    frame++;
    const revealed = Math.floor((frame / total) * final.length);
    let html = '';
    for (let i = 0; i < final.length; i++) {
      if (i < revealed) html += final[i];
      else html += `<span class="glyph" aria-hidden="true">${glyphs[(Math.random() * glyphs.length) | 0]}</span>`;
    }
    el.innerHTML = html;
    if (frame < total) requestAnimationFrame(tick);
    else el.textContent = final;
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
  toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    document.body.classList.add('has-modal');
    menu.querySelector('a').focus({ preventScroll: true });
  } else {
    menu.classList.remove('is-open');
    document.body.classList.remove('has-modal');
    setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduced ? 0 : 600);
  }
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});
// keep focus inside the open menu
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

// active section highlight
const navLinks = $$('.nav__links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${entry.target.id}`)));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['about', 'experience', 'skills', 'projects', 'education', 'contact'].forEach((id) => sectionObserver.observe(document.getElementById(id)));

/* ─────────────────────────────── Scroll loop ─────────────────────────────── */

const hero = $('.hero');
const contact = $('#contact');
const scene = { api: null, hero: 0, contact: 0 };
let scrollQueued = false;

function onScroll() {
  scrollQueued = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;

  root.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
  nav.classList.toggle('is-compact', y > 40);

  // hero exit: content drifts up and fades while the 3D camera pushes in
  const h = clamp(y / (hero.offsetHeight * 0.85));
  scene.hero = h;
  if (!reduced) {
    hero.style.setProperty('--hero-y', `${(-h * 120).toFixed(1)}px`);
    hero.style.setProperty('--hero-o', (1 - h * 1.2).toFixed(3));
  }

  // contact entrance: the core comes back to close the experience
  const r = contact.getBoundingClientRect();
  const c = clamp(1 - r.top / vh);
  scene.contact = c;

  const stageO = Math.max(1 - h * 1.15, (c - 0.15) * 1.25);
  root.style.setProperty('--stage-o', clamp(stageO).toFixed(3));
  scene.api?.setProgress(h, c);
}
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* Cursor light ----------------------------------------------------------- */
if (finePointer) {
  let mx = 0, my = 0, queued = false;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      root.style.setProperty('--mx', `${mx}px`);
      root.style.setProperty('--my', `${my}px`);
    });
  }, { passive: true });
}

/* ─────────────────────────────── Reveal ─────────────────────────────── */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

// small stagger between siblings revealed together
$$('[data-reveal]').forEach((el) => {
  const siblings = [...el.parentElement.children].filter((n) => n.hasAttribute('data-reveal'));
  const i = siblings.indexOf(el);
  if (i > 0) el.style.setProperty('--d', `${Math.min(i, 4) * 0.08}s`);
  revealObserver.observe(el);
});
$$('.track').forEach((el) => revealObserver.observe(el));

/* Magnetic buttons ------------------------------------------------------- */
if (finePointer) {
  $$('[data-magnetic]').forEach((btn) => {
    const strength = 0.28;
    btn.addEventListener('pointermove', (e) => {
      if (reduced) return;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      btn.style.transform = `translate(${x}px, ${y}px)`;
      btn.querySelector('.btn__label').style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transition = 'transform .6s cubic-bezier(.2,.7,.1,1), background .3s, color .3s, box-shadow .3s';
      btn.style.transform = '';
      btn.querySelector('.btn__label').style.transform = '';
      setTimeout(() => { btn.style.transition = ''; }, 600);
    });
  });
}

/* Depth tilt helper ------------------------------------------------------ */
function tilt(el, target, max = 6, lightVars = false) {
  if (!finePointer) return;
  target.addEventListener('pointermove', (e) => {
    if (reduced) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${((px - 0.5) * max).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - py) * max).toFixed(2)}deg`);
    if (lightVars) {
      el.style.setProperty('--px', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--py', `${(py * 100).toFixed(1)}%`);
    }
  });
  target.addEventListener('pointerleave', () => {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  });
}

/* ─────────────────────────────── Experience ─────────────────────────────── */

const jobs = $$('[data-job]');
function activateJob(job) { jobs.forEach((j) => j.classList.toggle('is-active', j === job)); }
jobs.forEach((job) => {
  const head = $('.job__head', job);
  head.addEventListener('click', () => {
    const open = head.getAttribute('aria-expanded') === 'true';
    head.setAttribute('aria-expanded', String(!open));
    if (!open) activateJob(job);
  });
  job.addEventListener('pointerenter', () => {
    activateJob(job);
    // hover reveals details on desktop; collapsing stays a deliberate click
    if (finePointer) head.setAttribute('aria-expanded', 'true');
  });
  head.addEventListener('focus', () => activateJob(job));
  tilt($('.job__card', job), job, 3);
});
activateJob(jobs[0]);

/* ─────────────────────────────── Skills orbit ─────────────────────────────── */

const orbit = $('#orbit');
const nodesList = $('#orbit-nodes');
const info = { cat: $('#skill-cat'), name: $('#skill-name'), text: $('#skill-text') };
const RINGS = [0.44, 0.7, 0.95]; // fraction of half-width per tier
const nodes = [];

SKILLS.forEach((s) => {
  const li = document.createElement('li');
  li.className = `node node--t${s.tier}${s.focus ? ' node--focus' : ''}`;
  li.dataset.cat = s.cat;
  li.innerHTML = `<button type="button">${s.name}</button>`;
  nodesList.appendChild(li);
  nodes.push({ el: li, data: s, angle: 0 });
});
// distribute evenly per ring, offset each ring for a less mechanical look
[1, 2, 3].forEach((tier, ti) => {
  const ring = nodes.filter((n) => n.data.tier === tier);
  ring.forEach((n, i) => { n.angle = (i / ring.length) * Math.PI * 2 + ti * 0.6; });
});

let selected = null;
function showSkill(n) {
  nodes.forEach((m) => m.el.classList.toggle('is-selected', m === n));
  selected = n;
  info.cat.textContent = `${CAT_LABEL[n.data.cat]}${n.data.focus ? ' — current focus' : ''}`;
  info.name.textContent = n.data.name;
  info.text.textContent = n.data.text;
}
nodes.forEach((n) => {
  const b = $('button', n.el);
  b.addEventListener('pointerenter', () => showSkill(n));
  b.addEventListener('focus', () => showSkill(n));
  b.addEventListener('click', () => showSkill(n));
});

$$('.orbit-filters .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    $$('.orbit-filters .chip').forEach((c) => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-pressed', String(c === chip));
    });
    nodes.forEach((n) => n.el.classList.toggle('is-dim', f !== 'all' && n.data.cat !== f));
  });
});

const orbitState = { w: 0, h: 0, tilt: 0.5, targetTilt: 0.5, spin: 0, speed: 1, targetSpeed: 1, visible: false, compact: false };
function measureOrbit() {
  const r = orbit.getBoundingClientRect();
  orbitState.w = r.width; orbitState.h = r.height;
  orbitState.compact = window.matchMedia('(max-width: 720px)').matches;
  const half = Math.min(r.width / 2 - 40, (r.height / 2 - 34) / 0.5);
  $$('.orbit__rings i').forEach((ring, i) => ring.style.setProperty('--r', (half * RINGS[i]).toFixed(1)));
}
function layoutOrbit(dt) {
  if (orbitState.compact) return;
  orbitState.tilt = lerp(orbitState.tilt, orbitState.targetTilt, 0.06);
  orbitState.speed = lerp(orbitState.speed, orbitState.targetSpeed, 0.08);
  if (!reduced) orbitState.spin += dt * 0.00008 * orbitState.speed;
  const half = Math.min(orbitState.w / 2 - 40, (orbitState.h / 2 - 34) / 0.5);
  $$('.orbit__rings i').forEach((ring) => ring.style.setProperty('--tilt', orbitState.tilt.toFixed(3)));
  for (const n of nodes) {
    const dir = n.data.tier === 2 ? -1 : 1;
    const a = n.angle + orbitState.spin * dir * (1.25 - n.data.tier * 0.15);
    const R = half * RINGS[n.data.tier - 1];
    const x = Math.cos(a) * R;
    const y = Math.sin(a) * R * orbitState.tilt;
    const depth = (Math.sin(a) + 1) / 2; // 0 back → 1 front
    n.el.style.setProperty('--x', `${x.toFixed(1)}px`);
    n.el.style.setProperty('--y', `${y.toFixed(1)}px`);
    n.el.style.setProperty('--s', (0.78 + depth * 0.28).toFixed(3));
    n.el.style.setProperty('--o', (0.45 + depth * 0.55).toFixed(3));
    n.el.style.setProperty('--z', depth > 0.5 ? 60 + Math.round(depth * 40) : Math.round(depth * 40));
  }
}
let last = performance.now();
function orbitLoop(now) {
  const dt = Math.min(64, now - last); last = now;
  layoutOrbit(dt);
  if (orbitState.visible && !reduced) requestAnimationFrame(orbitLoop);
}
new IntersectionObserver(([e]) => {
  orbitState.visible = e.isIntersecting;
  if (e.isIntersecting) { last = performance.now(); measureOrbit(); requestAnimationFrame(orbitLoop); }
}).observe(orbit);
window.addEventListener('resize', () => { measureOrbit(); layoutOrbit(0); });
measureOrbit(); layoutOrbit(0);

// orbit reacts to the cursor: tilt follows vertical position, hovering slows rotation
orbit.addEventListener('pointermove', (e) => {
  const r = orbit.getBoundingClientRect();
  orbitState.targetTilt = 0.36 + ((e.clientY - r.top) / r.height) * 0.26;
});
orbit.addEventListener('pointerenter', () => { orbitState.targetSpeed = 0.25; });
orbit.addEventListener('pointerleave', () => { orbitState.targetSpeed = 1; orbitState.targetTilt = 0.5; });
// reduced motion: still lay out once whenever it changes
reduceMQ.addEventListener?.('change', () => layoutOrbit(0));

showSkill(nodes.find((n) => n.data.name === 'Spring Boot'));
nodes.forEach((n) => n.el.classList.remove('is-selected'));

/* ─────────────────────────────── Projects ─────────────────────────────── */

// header severity grid (2 critical, 5 high, 4 medium, 13 low — from the project README)
const grid = $('.viz-headers__grid');
if (grid) {
  const sev = [['--crit', 2], ['--high', 5], ['--med', 4], ['--low', 13]];
  sev.forEach(([v, count]) => {
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.style.setProperty('--c', `var(${v})`);
      grid.appendChild(s);
    }
  });
  const cells = $$('span', grid);
  let idx = 0, timer = null;
  const sweep = () => {
    cells.forEach((c, i) => c.classList.toggle('is-hit', i <= idx));
    idx = (idx + 1) % (cells.length + 8);
  };
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting && !reduced) timer = setInterval(sweep, 110);
    else if (reduced) cells.forEach((c) => c.classList.add('is-hit'));
  }).observe(grid);
}

$$('.card').forEach((card) => tilt(card, card, 5, true));

/* Case study dialog with a FLIP transition from the clicked card --------- */
const dialog = $('#case');
const panel = $('.case__panel', dialog);
let originCard = null;

function fillCase(p) {
  $('#case-index').textContent = p.index;
  $('#case-title').textContent = p.title;
  $('#case-lede').textContent = p.lede;
  $('#case-problem').textContent = p.problem;
  $('#case-result').textContent = p.result;
  $('#case-built').innerHTML = p.built.map((b) => `<li>${b}</li>`).join('');
  $('#case-stack').innerHTML = p.stack.map((t) => `<li>${t}</li>`).join('');
  $('#case-extra').innerHTML = p.extra();
  $('#case-link').href = p.link;
  $$('.case__head, .case__grid > section, .case__extra, #case-link', dialog).forEach((el, i) => {
    el.setAttribute('data-case-in', '');
    el.style.transitionDelay = `${0.15 + i * 0.05}s`;
  });
}

function flipFrom(card) {
  const from = card.getBoundingClientRect();
  const to = panel.getBoundingClientRect();
  return [
    { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, borderRadius: '18px', opacity: 0.6 },
    { transform: 'none', borderRadius: getComputedStyle(panel).borderRadius, opacity: 1 },
  ];
}

function openCase(key, card) {
  originCard = card;
  fillCase(PROJECTS[key]);
  $('.case__scroll', dialog).scrollTop = 0;
  dialog.showModal();
  document.body.classList.add('has-modal');
  if (!reduced && panel.animate) {
    panel.animate(flipFrom(card), { duration: 700, easing: 'cubic-bezier(.7,0,.2,1)' });
  }
  requestAnimationFrame(() => dialog.classList.add('is-ready'));
}

function closeCase() {
  dialog.classList.remove('is-ready');
  const done = () => {
    dialog.close();
    document.body.classList.remove('has-modal');
    $('.card__open', originCard)?.focus({ preventScroll: true });
  };
  if (!reduced && panel.animate && originCard) {
    const anim = panel.animate(flipFrom(originCard).reverse(), { duration: 500, easing: 'cubic-bezier(.7,0,.2,1)' });
    anim.onfinish = done;
  } else done();
}

$$('[data-open]').forEach((btn) => btn.addEventListener('click', () => openCase(btn.dataset.open, btn.closest('.card'))));
$('[data-close]', dialog).addEventListener('click', closeCase);
dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeCase(); });
dialog.addEventListener('click', (e) => { if (e.target === dialog) closeCase(); });

/* ─────────────────────────────── Numbers ─────────────────────────────── */

$$('[data-count]').forEach((el) => {
  let target = Number(el.dataset.count);
  if (el.dataset.since) {
    const since = new Date(el.dataset.since);
    const now = new Date();
    let years = now.getFullYear() - since.getFullYear();
    if (now < new Date(now.getFullYear(), since.getMonth(), since.getDate())) years--;
    target = years;
  }
  el.textContent = target;
  if (reduced) return;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = clamp((now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.6 });
  io.observe(el);
});

/* Copy email ------------------------------------------------------------- */
$$('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const label = $('.copy__label', btn);
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      label.textContent = 'Copied ✓';
    } catch {
      label.textContent = btn.dataset.copy;
    }
    btn.classList.add('is-done');
    setTimeout(() => { label.textContent = 'Copy email'; btn.classList.remove('is-done'); }, 2200);
  });
});

/* ─────────────────────────────── 3D stage ─────────────────────────────── */

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

function lowPower() {
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const small = window.matchMedia('(max-width: 720px)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return mem <= 4 || cores <= 4 || (small && coarse) || navigator.connection?.saveData === true;
}

async function bootScene() {
  if (!webglAvailable()) { root.classList.add('no-webgl'); return; }
  try {
    const { createScene } = await import('./scene.js');
    scene.api = createScene($('#stage-canvas'), { low: lowPower(), reduced: () => reduced });
    scene.api.setProgress(scene.hero, scene.contact);
  } catch (err) {
    root.classList.add('no-webgl');
  }
}
// load the 3D after first paint so text is never blocked by WebGL
if ('requestIdleCallback' in window) requestIdleCallback(bootScene, { timeout: 600 });
else setTimeout(bootScene, 200);
