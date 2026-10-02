# fraaancesco.github.io

Personal portfolio of **Francesco Pistorio** — Backend Engineer & cybersecurity enthusiast.
Live at <https://fraaancesco.github.io>.

## Stack

- Hand-written HTML + CSS + vanilla JS (no framework, no runtime dependencies)
- [Three.js](https://threejs.org) for a procedural low-poly Etna (the page is a climb from sea level to the crater), bundled and tree-shaken with esbuild into `js/scene.js`
- Lazy-loaded after first paint; falls back to a static SVG without WebGL
- Respects `prefers-reduced-motion`, reduces quality on low-power devices

## Structure

```
index.html      page markup and content
css/main.css    design system + layout
js/main.js      interactions (nav, reveals, timeline, skills orbit, case studies)
src/scene.js    Three.js scene source
js/scene.js     built bundle (committed, served by GitHub Pages)
404.html        custom not-found page
```

## Develop

```bash
npm install
npm run build   # rebuilds js/scene.js after editing src/scene.js
npm run serve   # http://localhost:8080
```

Content (skills, project case studies) lives in the `SKILLS` and `PROJECTS` objects at the top of `js/main.js`.
