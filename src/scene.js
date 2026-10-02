/*
  Etna at sunset, low-poly: one volcano rising from the sea.
  The camera starts at sea level (Catania) and climbs to the crater as the
  page scrolls. Everything is procedural: no models, no textures to download.
*/
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Vector3,
  PlaneGeometry, CircleGeometry, TubeGeometry, BufferGeometry, Float32BufferAttribute,
  MeshStandardMaterial, MeshBasicMaterial, PointsMaterial, ShaderMaterial,
  Mesh, Points, HemisphereLight, DirectionalLight, PointLight,
  CatmullRomCurve3, AdditiveBlending, MathUtils,
} from 'three';

/* ---------- terrain ------------------------------------------------------ */

function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) {
  let f = 0, amp = 0.5, fr = 1;
  for (let i = 0; i < 5; i++) { f += amp * vnoise(x * fr, y * fr); fr *= 2.03; amp *= 0.5; }
  return f;
}
const smooth = (a, b, x) => { const t = MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const ETNA = { x: 0, z: -48 };
const CRATER_R = 3.6;

function height(x, z) {
  const d = Math.hypot(x - ETNA.x, z - ETNA.z);
  // the volcano: a broad cone with a crater bitten out of the top
  let h = 37 * Math.exp(-Math.pow(d / 30, 1.4));
  if (d < CRATER_R) h -= Math.pow(1 - d / CRATER_R, 1.2) * 5.5;
  // gentle ridges on its flanks; the land around it stays low and calm
  h += (fbm(x * 0.05 + 10, z * 0.05 + 3) - 0.45) * 5 * (0.4 + 0.6 * smooth(4, 30, d)) * (1 - smooth(45, 80, d) * 0.6);
  // the coast: everything in front sinks under the sea
  h -= smooth(18, 46, z) * 14;
  return h;
}

// height → colour: sea-level teal, green hills, terracotta & gold slopes, dark ash at the top
const STOPS = [
  [-3, '#0e4a5a'], [1.5, '#13606a'], [6, '#1f7a5c'], [12, '#5f8f3e'],
  [18, '#c8763a'], [24, '#e5553d'], [28, '#f0a03c'], [30.5, '#3a2a24'], [32.5, '#d9d2c6'], [36, '#f7f3ec'],
].map(([h, c]) => [h, new Color(c)]);
function colorAt(h, out) {
  if (h <= STOPS[0][0]) return out.copy(STOPS[0][1]);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [h0, c0] = STOPS[i], [h1, c1] = STOPS[i + 1];
    if (h <= h1) return out.copy(c0).lerp(c1, (h - h0) / (h1 - h0));
  }
  return out.copy(STOPS[STOPS.length - 1][1]);
}

function buildTerrain(low) {
  const W = 300, D = 240;
  const geo = new PlaneGeometry(W, D, low ? 100 : 190, low ? 80 : 152);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -50);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    // jitter the grid a little so it reads hand-made rather than gridded
    const jx = (hash(x, z) - 0.5) * 0.6, jz = (hash(z, x) - 0.5) * 0.6;
    pos.setXYZ(i, x + jx, height(x + jx, z + jz), z + jz);
  }
  const flat = geo.toNonIndexed();
  flat.computeVertexNormals();

  const p = flat.attributes.position;
  const n = flat.attributes.normal;
  const colors = new Float32Array(p.count * 3);
  const c = new Color();
  for (let i = 0; i < p.count; i += 3) {
    const h = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    colorAt(h, c);
    const slope = 1 - n.getY(i);
    c.multiplyScalar(1 - slope * 0.35 + (hash(p.getX(i), p.getZ(i)) - 0.5) * 0.12);
    for (let k = 0; k < 3; k++) { colors[(i + k) * 3] = c.r; colors[(i + k) * 3 + 1] = c.g; colors[(i + k) * 3 + 2] = c.b; }
  }
  flat.setAttribute('color', new Float32BufferAttribute(colors, 3));

  const mat = new MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.92, metalness: 0.05 });
  return { mesh: new Mesh(flat, mat) };
}

/* ---------- lava ----------------------------------------------------------- */

function lavaStream(angle, steps) {
  const pts = [];
  let x = ETNA.x + Math.cos(angle) * (CRATER_R + 0.4);
  let z = ETNA.z + Math.sin(angle) * (CRATER_R + 0.4);
  for (let i = 0; i < steps; i++) {
    pts.push(new Vector3(x, height(x, z) + 0.25, z));
    // walk downhill, with a little meander
    const e = 0.5;
    const gx = height(x + e, z) - height(x - e, z);
    const gz = height(x, z + e) - height(x, z - e);
    const len = Math.hypot(gx, gz) || 1;
    const wobble = (vnoise(i * 0.3, angle * 10) - 0.5) * 0.9;
    x += (-gx / len) * 0.9 + wobble * 0.4;
    z += (-gz / len) * 0.9 + wobble * 0.2;
  }
  return new CatmullRomCurve3(pts);
}

/* ---------- smoke ---------------------------------------------------------- */

function buildSmoke(count) {
  const geo = new BufferGeometry();
  const age = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) { age[i] = i / count; seed[i] = Math.random(); }
  geo.setAttribute('position', new Float32BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute('aAge', new Float32BufferAttribute(age.slice(), 1));
  const mat = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uScale: { value: 1 }, uA: { value: new Color('#ff8a6b') }, uB: { value: new Color('#5c6f78') } },
    vertexShader: `
      attribute float aAge; varying float vAge; uniform float uScale;
      void main() {
        vAge = aAge;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (90.0 + aAge * 380.0) * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vAge; uniform vec3 uA; uniform vec3 uB;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d) * smoothstep(0.0, 0.12, vAge) * (1.0 - vAge) * 0.55;
        gl_FragColor = vec4(mix(uA, uB, smoothstep(0.0, 0.6, vAge)), a);
      }`,
  });
  const points = new Points(geo, mat);
  points.frustumCulled = false;
  return { points, age, seed };
}

/* ---------- scene ---------------------------------------------------------- */

export function createScene(canvas, { low = false, reduced = () => false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: !low, alpha: true, powerPreference: low ? 'low-power' : 'high-performance' });
  canvas.addEventListener('webglcontextlost', () => document.documentElement.classList.add('no-webgl'));
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  scene.fog = new Fog('#ff7f50', 40, 190);

  const camera = new PerspectiveCamera(48, 1, 0.5, 600);

  scene.add(new HemisphereLight('#8fd8ff', '#3a2014', 1.2));
  const sun = new DirectionalLight('#ff9a6b', 2.4);   // sunset behind the volcano
  sun.position.set(-90, 30, -160);
  scene.add(sun);
  const fill = new DirectionalLight('#ff7a59', 0.7);   // coral bounce from the sea side
  fill.position.set(70, 50, 90);
  scene.add(fill);

  const terrain = buildTerrain(low);
  scene.add(terrain.mesh);

  const sea = new Mesh(
    new PlaneGeometry(600, 400),
    new MeshStandardMaterial({ color: '#11607a', emissive: '#0a3a4a', emissiveIntensity: 0.6, roughness: 0.95, metalness: 0.05 }),
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, -0.6, 0);
  scene.add(sea);

  // crater: molten disc + light
  const craterY = height(ETNA.x, ETNA.z);
  const crater = new Mesh(new CircleGeometry(CRATER_R * 0.75, 24), new MeshBasicMaterial({ color: '#ff7a2a', fog: false }));
  crater.rotation.x = -Math.PI / 2;
  crater.position.set(ETNA.x, craterY + 0.15, ETNA.z);
  scene.add(crater);
  const lavaLight = new PointLight('#ff5a1f', 140, 60, 1.6);
  lavaLight.position.set(ETNA.x, craterY + 4, ETNA.z);
  scene.add(lavaLight);

  // lava streams down the flank facing the city
  const lavaCore = new MeshBasicMaterial({ color: '#ffb347', fog: false });
  const lavaGlow = new MeshBasicMaterial({ color: '#ff3d1f', transparent: true, opacity: 0.28, blending: AdditiveBlending, depthWrite: false, fog: false });
  [Math.PI * 0.42, Math.PI * 0.6, Math.PI * 0.18].forEach((a, i) => {
    const curve = lavaStream(a, 26 - i * 5);
    scene.add(new Mesh(new TubeGeometry(curve, 90, 0.13, 5), lavaCore));
    scene.add(new Mesh(new TubeGeometry(curve, 60, 0.45, 6), lavaGlow));
  });

  const smoke = buildSmoke(low ? 40 : 80);
  scene.add(smoke.points);

  // stars appear as the climb gets darker
  const STARS = low ? 300 : 700;
  const starPos = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    const t = Math.random() * Math.PI * 2, ph = Math.random() * 0.45 * Math.PI;
    starPos[i * 3] = Math.cos(t) * Math.cos(ph) * 400;
    starPos[i * 3 + 1] = Math.sin(ph) * 400 + 30;
    starPos[i * 3 + 2] = Math.sin(t) * Math.cos(ph) * 400 - 100;
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute('position', new Float32BufferAttribute(starPos, 3));
  const starMat = new PointsMaterial({ color: '#fff1dc', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.2, fog: false, depthWrite: false });
  scene.add(new Points(starGeo, starMat));

  /* camera path: sea → plain → flanks → crater rim ------------------------ */
  const PATH = new CatmullRomCurve3([
    new Vector3(-4, 8, 50),
    new Vector3(-44, 16, 26),
    new Vector3(46, 26, 0),
    new Vector3(-40, 36, -16),
    new Vector3(24, 50, -10),
    new Vector3(6, 56, -12),
  ]);
  const LOOK = new CatmullRomCurve3([
    new Vector3(0, 19, -48),
    new Vector3(0, 21, -48),
    new Vector3(-2, 23, -50),
    new Vector3(2, 26, -50),
    new Vector3(0, 28, -50),
    new Vector3(0, 26, -54),
  ]);

  const state = { p: 0, cp: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
  const camPos = new Vector3(), camLook = new Vector3();
  let width = 0, heightPx = 0, rafId = 0, running = true, t = 0, last = performance.now();

  function resize() {
    width = canvas.clientWidth; heightPx = canvas.clientHeight;
    renderer.setSize(width, heightPx, false);
    camera.aspect = width / heightPx;
    camera.fov = width < 720 ? 56 : 48;
    camera.updateProjectionMatrix();
    smoke.points.material.uniforms.uScale.value = renderer.getPixelRatio() * heightPx / 900;
    if (reduced()) renderOnce();
  }

  window.addEventListener('pointermove', (e) => {
    state.tmx = (e.clientX / window.innerWidth) * 2 - 1;
    state.tmy = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function update(dt) {
    const still = reduced();
    const k = still ? 1 : 1 - Math.pow(0.002, dt);
    state.cp += (state.p - state.cp) * k;
    state.mx += (state.tmx - state.mx) * k * 0.5;
    state.my += (state.tmy - state.my) * k * 0.5;

    const p = state.cp;
    PATH.getPoint(p, camPos);
    LOOK.getPoint(p, camLook);
    camPos.x += state.mx * 3;
    camPos.y += -state.my * 1.2;
    camPos.y = Math.max(camPos.y, height(camPos.x, camPos.z) + 3); // never clip into the mountain
    camera.position.copy(camPos);
    camLook.x += state.mx * 4;
    if (width >= 720) camLook.x -= 26 * Math.pow(1 - p, 2); // hero: volcano sits right of the name
    if (width < 720) camLook.y += 26 * (1 - p); // portrait: keep the mountains low, under the headline
    camera.lookAt(camLook);

    starMat.opacity = 0.15 + p * 0.75;

    if (!still) t += dt;
    lavaLight.intensity = 120 + Math.sin(t * 2.1) * 25 + Math.sin(t * 5.3) * 10;

    // smoke: each puff rises from the crater and drifts with the wind
    const pos = smoke.points.geometry.attributes.position;
    const ageAttr = smoke.points.geometry.attributes.aAge;
    for (let i = 0; i < smoke.age.length; i++) {
      if (!still) smoke.age[i] = (smoke.age[i] + dt * 0.045) % 1;
      const a = smoke.age[i], s = smoke.seed[i];
      pos.setXYZ(i,
        ETNA.x + a * a * 46 + Math.sin(s * 30 + a * 4) * (1 + a * 5),
        craterY + 1 + a * 38,
        ETNA.z - a * 8 + Math.cos(s * 20 + a * 3) * (1 + a * 4));
      ageAttr.setX(i, a);
    }
    pos.needsUpdate = true;
    ageAttr.needsUpdate = true;
  }

  const frameBudget = low ? 1000 / 32 : 0; // ~30fps cap on low-power devices
  function frame(now) {
    rafId = 0;
    if (!running) return;
    if (now - last >= frameBudget) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      renderer.render(scene, camera);
    }
    if (!reduced()) rafId = requestAnimationFrame(frame);
  }
  function start() { if (!rafId && running) { last = performance.now(); rafId = requestAnimationFrame(frame); } }
  function renderOnce() { update(1); renderer.render(scene, camera); }

  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) start(); });
  window.addEventListener('resize', resize);
  resize();
  if (reduced()) renderOnce(); else start();

  return {
    setProgress(p, horizonRgb) {
      state.p = p;
      if (horizonRgb) scene.fog.color.setStyle(`rgb(${horizonRgb.join(',')})`);
      if (reduced()) { state.cp = p; renderOnce(); } else start();
    },
  };
}
