# fraaancesco.github.io

Personal portfolio of **Francesco Pistorio** — Backend Engineer & cybersecurity enthusiast.
Live at <https://fraaancesco.github.io>.

**Docs (IT):** [style guide](docs/STYLE.md) · [how to add content](docs/CONTENT.md) · [changelog](CHANGELOG.md)

## Stack

- Hand-written HTML + CSS + vanilla JS (no framework, no runtime dependencies)
- [Three.js](https://threejs.org) for a procedural low-poly Etna that the camera climbs as you scroll, bundled and tree-shaken with esbuild into `js/scene.js`
- Lazy-loaded after first paint; falls back to a static SVG without WebGL
- Respects `prefers-reduced-motion`, reduces quality on low-power devices

## Structure

```
index.html      page markup and content
css/main.css    design system + layout
js/main.js      interactions + English content for skills, waypoints and case studies
js/i18n.js      Italian translations (language switch EN/IT, English by default)
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

Content (skills, project case studies) lives in the `SKILLS` and `PROJECTS` objects at the top of `js/main.js`;
their Italian versions, and every translated string in the page (`data-i18n` keys), are in `js/i18n.js`.

## Sparks / Stimoli (hobbies — work in progress)

The "Sparks" section (Italian: "Stimoli") collects hikes, photos and paintings.
To add something:

1. put the image in `images/stimoli/` (jpg/webp, ~1200px wide);
2. add an entry to the `STIMOLI` list in `js/stimoli.js` (the file explains every field).

Categories without entries show a "coming soon" card.
