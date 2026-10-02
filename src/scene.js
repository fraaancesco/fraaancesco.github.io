/*
  Etna at sunset, low-poly: one volcano rising from the sea.
  The camera starts at sea level (Catania) and climbs to the crater as the
  page scrolls. Everything is procedural: no models, no textures to download.
*/
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Fog, Vector3,
  PlaneGeometry, CircleGeometry, BufferGeometry, Float32BufferAttribute,
  MeshBasicMaterial, PointsMaterial, ShaderMaterial,
  Mesh, Points, Group,
  CatmullRomCurve3, AdditiveBlending, MathUtils, UniformsLib,
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
  [18, '#8a4b2c'], [24, '#8e3527'], [28, '#6b3a26'], [30.5, '#2a1f1b'], [32.5, '#b9b2a8'], [36, '#ece6dc'],
].map(([h, c]) => [h, new Color(c)]);
function colorAt(h, out) {
  if (h <= STOPS[0][0]) return out.copy(STOPS[0][1]);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [h0, c0] = STOPS[i], [h1, c1] = STOPS[i + 1];
    if (h <= h1) return out.copy(c0).lerp(c1, (h - h0) / (h1 - h0));
  }
  return out.copy(STOPS[STOPS.length - 1][1]);
}

/* ---------- baked lighting ----------------------------------------------
   Terrain and sea never move and the lights never move, so their lighting is
   computed once on the CPU (same Lambert maths three.js uses: hemisphere +
   two directional lights + the crater's point light) and stored in vertex
   colours. The GPU then just draws flat colours with fog: far cheaper than
   evaluating four lights for every pixel of every frame. */
const LIGHT = {
  sky: new Color('#8fd8ff').multiplyScalar(1.2),
  ground: new Color('#3a2014').multiplyScalar(1.2),
  sun: { color: new Color('#ff9a6b').multiplyScalar(2.4), dir: new Vector3(-90, 30, -160).normalize() },
  fill: { color: new Color('#ff7a59').multiplyScalar(0.7), dir: new Vector3(70, 50, 90).normalize() },
  lava: { color: new Color('#ff5a1f').multiplyScalar(120), pos: null, cutoff: 60, decay: 1.6 },
};
const _irr = new Color(), _tmp = new Color(), _toL = new Vector3();
function shade(albedo, n, p, out) {
  _irr.lerpColors(LIGHT.ground, LIGHT.sky, 0.5 * n.y + 0.5);
  _irr.add(_tmp.copy(LIGHT.sun.color).multiplyScalar(Math.max(0, n.dot(LIGHT.sun.dir))));
  _irr.add(_tmp.copy(LIGHT.fill.color).multiplyScalar(Math.max(0, n.dot(LIGHT.fill.dir))));
  const L = LIGHT.lava;
  if (!L.pos) L.pos = new Vector3(ETNA.x, height(ETNA.x, ETNA.z) + 4, ETNA.z);
  _toL.subVectors(L.pos, p);
  const d = _toL.length();
  if (d < L.cutoff) {
    const fall = (1 / Math.max(Math.pow(d, L.decay), 0.01)) * Math.pow(Math.min(1, Math.max(0, 1 - Math.pow(d / L.cutoff, 4))), 2);
    _irr.add(_tmp.copy(L.color).multiplyScalar(fall * Math.max(0, n.dot(_toL.normalize()))));
  }
  return out.copy(albedo).multiply(_irr).multiplyScalar(1 / Math.PI);
}

// The terrain is split into a 4×4 grid of chunks so three.js can skip the ones
// outside the view (behind the camera, off to the side, or past the far plane).
function buildTerrain(low) {
  const W = 300, D = 240, CX = 4, CZ = 4;
  const segX = (low ? 100 : 160) / CX, segZ = (low ? 80 : 128) / CZ;
  const mat = new MeshBasicMaterial({ vertexColors: true });
  const group = new Group();
  for (let i = 0; i < CX; i++) {
    for (let j = 0; j < CZ; j++) {
      const geo = new PlaneGeometry(W / CX, D / CZ, segX, segZ);
      geo.rotateX(-Math.PI / 2);
      geo.translate(-W / 2 + (W / CX) * (i + 0.5), 0, -50 - D / 2 + (D / CZ) * (j + 0.5));
      const chunk = buildChunk(geo);
      if (!chunk) continue;               // entirely under the sea
      const mesh = new Mesh(chunk, mat);
      mesh.matrixAutoUpdate = false;
      group.add(mesh);
    }
  }
  return { mesh: group };
}

function buildChunk(geo) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    // round so vertices shared by neighbouring chunks get the exact same jitter (no seams)
    const x = Math.round(pos.getX(i) * 1000) / 1000, z = Math.round(pos.getZ(i) * 1000) / 1000;
    // jitter the grid a little so it reads hand-made rather than gridded
    const jx = (hash(x, z) - 0.5) * 0.6, jz = (hash(z, x) - 0.5) * 0.6;
    pos.setXYZ(i, x + jx, height(x + jx, z + jz), z + jz);
  }
  const flat = geo.toNonIndexed();
  flat.computeVertexNormals();
  const p = flat.attributes.position, n = flat.attributes.normal;

  // keep only faces that can be seen: anything fully under the sea surface is skipped
  const SEA = -0.9;
  const keep = [];
  for (let i = 0; i < p.count; i += 3) {
    if (p.getY(i) > SEA || p.getY(i + 1) > SEA || p.getY(i + 2) > SEA) keep.push(i);
  }
  if (!keep.length) return null;

  const outPos = new Float32Array(keep.length * 9);
  const colors = new Float32Array(keep.length * 9);
  const albedo = new Color(), lit = new Color(), normal = new Vector3(), centre = new Vector3();
  keep.forEach((i, f) => {
    const h = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    colorAt(h, albedo);
    normal.set(n.getX(i), n.getY(i), n.getZ(i));
    albedo.multiplyScalar(1 - (1 - normal.y) * 0.35 + (hash(p.getX(i), p.getZ(i)) - 0.5) * 0.12);
    centre.set((p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, h, (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3);
    shade(albedo, normal, centre, lit);
    for (let k = 0; k < 3; k++) {
      const o = f * 9 + k * 3;
      outPos[o] = p.getX(i + k); outPos[o + 1] = p.getY(i + k); outPos[o + 2] = p.getZ(i + k);
      colors[o] = lit.r; colors[o + 1] = lit.g; colors[o + 2] = lit.b;
    }
  });
  const out = new BufferGeometry();
  out.setAttribute('position', new Float32BufferAttribute(outPos, 3));
  out.setAttribute('color', new Float32BufferAttribute(colors, 3));
  out.computeBoundingSphere();
  return out;
}

/* ---------- lava ----------------------------------------------------------- */

// a flow is a ribbon draped on the slope: dark cooling crust with glowing cracks
// that drift downhill; hotter near the vent, cooler and darker further down
const LAVA_VERT = `
  varying vec2 vUv;
  #include <fog_pars_vertex>
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`;
const LAVA_FRAG = `
  uniform float uTime; uniform float uLen;
  varying vec2 vUv;
  #include <fog_pars_fragment>
  float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * n(p); p *= 2.1; a *= 0.5; } return s; }
  void main() {
    float along = vUv.y;                       // 0 at the vent → 1 at the tongue
    float across = abs(vUv.x - 0.5) * 2.0;     // 0 centre → 1 edge
    vec2 q = vec2(vUv.x * 2.5, along * uLen * 0.55 - uTime * 0.12);
    float cracks = fbm(q + fbm(q * 1.7 + uTime * 0.05));
    float heat = pow(1.0 - along, 1.3) * 0.85 + 0.15;          // cools downhill
    heat *= 1.0 - smoothstep(0.35, 1.0, across);               // edges cool first
    float glow = smoothstep(0.52 - heat * 0.22, 0.72, cracks) * heat;
    vec3 crust = mix(vec3(0.07, 0.035, 0.03), vec3(0.18, 0.06, 0.03), heat);
    vec3 molten = mix(vec3(0.85, 0.12, 0.02), vec3(1.0, 0.78, 0.35), smoothstep(0.4, 1.0, glow));
    vec3 col = mix(crust, molten * 1.4, clamp(glow * 1.6 + heat * 0.12, 0.0, 1.0));
    float alpha = (1.0 - smoothstep(0.75, 1.0, across)) * (1.0 - smoothstep(0.88, 1.0, along));
    gl_FragColor = vec4(col, alpha);
    #include <fog_fragment>
  }`;

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

function lavaRibbon(curve, width) {
  const SEG = 140;
  const pos = [], uv = [], idx = [];
  const p = new Vector3(), tan = new Vector3();
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    curve.getPointAt(t, p);
    curve.getTangentAt(t, tan);
    // side vector in the ground plane; flows widen as they slow down, with a ragged edge
    const sx = -tan.z, sz = tan.x, sl = Math.hypot(sx, sz) || 1;
    const w = width * (0.55 + 0.9 * Math.sqrt(t)) * (0.8 + 0.4 * vnoise(t * 9, width * 7));
    for (const side of [-1, 1]) {
      const x = p.x + (sx / sl) * w * side, z = p.z + (sz / sl) * w * side;
      pos.push(x, height(x, z) + 0.12, z);
      uv.push(side < 0 ? 0 : 1, t);
    }
    if (i < SEG) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
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
        gl_PointSize = min((90.0 + aAge * 380.0) * uScale / -mv.z, 260.0 * uScale);
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
  const dpr = window.devicePixelRatio || 1;
  // MSAA is expensive and pointless on dense screens: only use it on 1× displays
  const renderer = new WebGLRenderer({ canvas, antialias: !low && dpr < 1.5, alpha: true, powerPreference: low ? 'low-power' : 'high-performance' });
  canvas.addEventListener('webglcontextlost', () => document.documentElement.classList.add('no-webgl'));
  const maxRatio = Math.min(dpr, low ? 1.25 : 1.5);
  let ratio = maxRatio;
  renderer.setPixelRatio(ratio);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  scene.fog = new Fog('#ff7f50', 40, 190);

  const camera = new PerspectiveCamera(48, 1, 0.5, 280); // nothing past the fog is worth drawing

  // lighting is baked into terrain and sea (see LIGHT / shade above): no runtime lights

  const terrain = buildTerrain(low);
  scene.add(terrain.mesh);

  const sea = new Mesh(
    new PlaneGeometry(600, 400),
    new MeshBasicMaterial({ color: shade(new Color('#11607a'), new Vector3(0, 1, 0), new Vector3(0, 0, 80), new Color()).add(new Color('#0a3a4a').multiplyScalar(0.6)) }),
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, -0.6, 0);
  scene.add(sea);

  // crater: molten disc + light
  const craterY = height(ETNA.x, ETNA.z);
  const crater = new Mesh(new CircleGeometry(CRATER_R * 0.75, 24), new MeshBasicMaterial({ color: '#ff5a14', fog: false }));
  crater.rotation.x = -Math.PI / 2;
  crater.position.set(ETNA.x, craterY + 0.15, ETNA.z);
  scene.add(crater);

  // soft pulsing glow over the vent (replaces the old real-time point light)
  const glowGeo = new BufferGeometry();
  glowGeo.setAttribute('position', new Float32BufferAttribute([ETNA.x, craterY + 1.8, ETNA.z], 3));
  const glow = new Points(glowGeo, new ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uScale: { value: 1 }, uPulse: { value: 1 } },
    vertexShader: `
      uniform float uScale;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = min(9000.0 * uScale / -mv.z, 360.0 * uScale);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uPulse;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = pow(max(0.0, 1.0 - d), 2.0) * 0.9 * uPulse;
        gl_FragColor = vec4(1.0, 0.45, 0.15, a);
      }`,
  }));
  glow.frustumCulled = false;
  scene.add(glow);

  // lava flows down the flank facing the city
  const lavaMats = [];
  [[Math.PI * 0.42, 30, 1.1], [Math.PI * 0.62, 22, 0.8], [Math.PI * 0.2, 17, 0.7]].forEach(([a, steps, w]) => {
    const curve = lavaStream(a, steps);
    const mat = new ShaderMaterial({
      uniforms: { ...UniformsLib.fog, uTime: { value: 0 }, uLen: { value: curve.getLength() } },
      vertexShader: LAVA_VERT, fragmentShader: LAVA_FRAG,
      transparent: true, depthWrite: false, fog: true,
      polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
    });
    lavaMats.push(mat);
    scene.add(new Mesh(lavaRibbon(curve, w), mat));
  });

  // embers: sparks thrown up from the vent
  const EMBERS = low ? 30 : 70;
  const emberGeo = new BufferGeometry();
  emberGeo.setAttribute('position', new Float32BufferAttribute(new Float32Array(EMBERS * 3), 3));
  const emberSeed = Array.from({ length: EMBERS }, () => [Math.random(), Math.random(), Math.random()]);
  const embers = new Points(emberGeo, new PointsMaterial({ color: '#ffb35c', size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false, fog: false }));
  embers.frustumCulled = false;
  scene.add(embers);

  const smoke = buildSmoke(low ? 32 : 60);
  scene.add(smoke.points);

  // stars appear as the climb gets darker
  const STARS = low ? 250 : 500;
  const starPos = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    const t = Math.random() * Math.PI * 2, ph = Math.random() * 0.45 * Math.PI;
    starPos[i * 3] = Math.cos(t) * Math.cos(ph) * 220;
    starPos[i * 3 + 1] = Math.sin(ph) * 220 + 30;
    starPos[i * 3 + 2] = Math.sin(t) * Math.cos(ph) * 220 - 40;
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
    // the canvas is sized on the large viewport, so mobile URL-bar moves don't reach here; skip no-op resizes anyway
    if (canvas.clientWidth === width && canvas.clientHeight === heightPx) return;
    width = canvas.clientWidth; heightPx = canvas.clientHeight;
    renderer.setSize(width, heightPx, false);
    camera.aspect = width / heightPx;
    camera.fov = width < 720 ? 56 : 48;
    camera.updateProjectionMatrix();
    smoke.points.material.uniforms.uScale.value = ratio * heightPx / 900;
    glow.material.uniforms.uScale.value = ratio * heightPx / 900;
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
    for (const m of lavaMats) m.uniforms.uTime.value = t;
    glow.material.uniforms.uPulse.value = 0.85 + Math.sin(t * 2.1) * 0.15 + Math.sin(t * 5.3) * 0.06;
    const ep = embers.geometry.attributes.position;
    for (let i = 0; i < EMBERS; i++) {
      const [a, b, c] = emberSeed[i];
      const life = (t * (0.25 + a * 0.3) + b) % 1;          // each spark loops on its own clock
      const ang = c * Math.PI * 2;
      const r = life * (1.5 + a * 3);
      ep.setXYZ(i, ETNA.x + Math.cos(ang) * r, craterY + life * (6 + b * 6) - life * life * 5, ETNA.z + Math.sin(ang) * r);
    }
    ep.needsUpdate = true;

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

  // Frame pacing: full rate while the user scrolls or moves the pointer, ~30fps once
  // things are calm (lava and smoke are slow anyway), ~24fps on low-power devices.
  let lastActivity = performance.now();
  const markActive = () => { lastActivity = performance.now(); };
  window.addEventListener('pointermove', markActive, { passive: true });
  const budget = (now) => (low ? 1000 / 24 : now - lastActivity > 1500 ? 1000 / 30 : 0);

  // Adaptive resolution: if frames are consistently slow, render fewer pixels;
  // scale back up when there is headroom again.
  let avg = 16, slowFor = 0, fastFor = 0;
  function adapt(ms, paced) {
    if (paced) return;                       // throttled frames say nothing about the GPU
    avg += (ms - avg) * 0.1;
    if (avg > 26) { slowFor += ms; fastFor = 0; } else if (avg < 18) { fastFor += ms; slowFor = 0; } else { slowFor = fastFor = 0; }
    const minRatio = Math.max(0.6, maxRatio * 0.5);
    if (slowFor > 1500 && ratio > minRatio) { setRatio(Math.max(minRatio, ratio - 0.15)); slowFor = 0; }
    else if (fastFor > 4000 && ratio < maxRatio) { setRatio(Math.min(maxRatio, ratio + 0.1)); fastFor = 0; }
  }
  function setRatio(r) {
    ratio = r;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, heightPx, false);
    smoke.points.material.uniforms.uScale.value = ratio * heightPx / 900;
    glow.material.uniforms.uScale.value = ratio * heightPx / 900;
  }

  function frame(now) {
    rafId = 0;
    if (!running) return;
    const covered = document.body.classList.contains('has-modal'); // menu or case study on top: nothing to see
    const minGap = budget(now);
    if (!covered && now - last >= minGap - 1) {
      const ms = now - last;
      last = now;
      update(Math.min(0.05, ms / 1000));
      renderer.render(scene, camera);
      adapt(ms, minGap > 0);
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
      if (p !== state.p) markActive();
      state.p = p;
      if (horizonRgb) scene.fog.color.setStyle(`rgb(${horizonRgb.join(',')})`);
      if (reduced()) { state.cp = p; renderOnce(); } else start();
    },
  };
}
