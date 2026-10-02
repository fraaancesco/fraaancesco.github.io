/*
  The "core": a dark faceted crystal (the backend — dense, structured) wrapped
  in a wireframe shell, scanned by a moving ring (security), with packets of
  data orbiting it (APIs / traffic). One WebGL context serves both the hero
  and the contact section; rendering stops whenever the stage is invisible.
*/
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Color, Fog,
  IcosahedronGeometry, DodecahedronGeometry, EdgesGeometry, TorusGeometry, BoxGeometry,
  BufferGeometry, Float32BufferAttribute,
  MeshStandardMaterial, LineBasicMaterial, MeshBasicMaterial, PointsMaterial,
  Mesh, LineSegments, Points, InstancedMesh, Object3D,
  AmbientLight, DirectionalLight, PointLight, GridHelper, AdditiveBlending, MathUtils,
} from 'three';

const YELLOW = 0xf3e600;
const CYAN = 0x3ee6e0;
const BONE = 0xecebe6;

export function createScene(canvas, { low = false, reduced = () => false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: !low, alpha: true, powerPreference: low ? 'low-power' : 'high-performance' });
  let maxDpr = low ? 1.25 : 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  scene.fog = new Fog(0x07080a, 7, 22);

  const camera = new PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 0, 8);

  /* Lighting — soft key, coloured rims ---------------------------------- */
  scene.add(new AmbientLight(0xffffff, 0.25));
  const key = new DirectionalLight(0xfff6e0, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rimY = new PointLight(YELLOW, 22, 12, 2);
  rimY.position.set(-3.2, 1.6, -1.5);
  scene.add(rimY);
  const rimC = new PointLight(CYAN, 14, 12, 2);
  rimC.position.set(3.4, -1.8, 1.2);
  scene.add(rimC);

  /* Core --------------------------------------------------------------- */
  const rig = new Group();      // follows layout + scroll
  const core = new Group();     // follows the mouse
  rig.add(core);
  scene.add(rig);

  const crystal = new Mesh(
    new IcosahedronGeometry(1, 0),
    new MeshStandardMaterial({ color: 0x15171c, metalness: 0.85, roughness: 0.32, flatShading: true }),
  );
  core.add(crystal);

  const crystalEdges = new LineSegments(
    new EdgesGeometry(crystal.geometry),
    new LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.55 }),
  );
  crystal.add(crystalEdges);

  const shell = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(1.55, 1)),
    new LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.16 }),
  );
  core.add(shell);

  const cage = new LineSegments(
    new EdgesGeometry(new DodecahedronGeometry(2.05, 0)),
    new LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.07 }),
  );
  core.add(cage);

  // scan ring: slides along Y, radius follows the shell's cross-section
  const scan = new Mesh(
    new TorusGeometry(1, 0.006, 6, 96),
    new MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false }),
  );
  scan.rotation.x = Math.PI / 2;
  core.add(scan);

  /* Data packets (instanced) -------------------------------------------- */
  const PACKETS = low ? 36 : 84;
  const packets = new InstancedMesh(
    new BoxGeometry(0.032, 0.032, 0.032),
    new MeshBasicMaterial({ color: BONE }),
    PACKETS,
  );
  const packetData = [];
  const accentColor = new Color(YELLOW);
  const boneColor = new Color(0x9a9ca3);
  for (let i = 0; i < PACKETS; i++) {
    packetData.push({
      a: Math.random() * Math.PI * 2,
      r: 2.35 + Math.random() * 0.55,
      y: (Math.random() - 0.5) * 0.22,
      v: 0.15 + Math.random() * 0.35,
      s: 0.6 + Math.random() * 1.2,
    });
    packets.setColorAt(i, Math.random() < 0.14 ? accentColor : boneColor);
  }
  const ring = new Group();
  ring.rotation.set(1.18, 0, 0.32);
  ring.add(packets);
  const orbitLine = new Mesh(
    new TorusGeometry(2.6, 0.003, 4, 160),
    new MeshBasicMaterial({ color: BONE, transparent: true, opacity: 0.12 }),
  );
  ring.add(orbitLine);
  core.add(ring);

  /* Ambient dust --------------------------------------------------------- */
  const DUST = low ? 220 : 640;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const r = 5 + Math.random() * 10;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    dustPos[i * 3] = r * Math.sin(p) * Math.cos(t);
    dustPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.6;
    dustPos[i * 3 + 2] = r * Math.cos(p) - 4;
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(dustPos, 3));
  const dust = new Points(dustGeo, new PointsMaterial({ color: BONE, size: 0.025, transparent: true, opacity: 0.5, sizeAttenuation: true, depthWrite: false }));
  scene.add(dust);

  /* Perspective floor grid — the city at night, far below ---------------- */
  const grid = new GridHelper(60, 60, 0x2a2d33, 0x16181d);
  grid.position.y = -3.4;
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  scene.add(grid);

  /* State ---------------------------------------------------------------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const progress = { hero: 0, contact: 0, h: 0, c: 0 };
  const layout = { x: 0, y: 0, scale: 1 };
  const dummy = new Object3D();
  let width = 0, height = 0, running = true, rafId = 0, t = 0;

  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const mobile = width < 720;
    const tablet = width < 1080;
    // desktop: core sits to the right of the headline; mobile: above it, smaller
    layout.x = mobile ? 0 : tablet ? 1.6 : 2.55;
    layout.y = mobile ? 1.35 : 0;
    layout.scale = mobile ? 0.58 : tablet ? 0.78 : 0.95;
    if (reduced()) renderOnce();
  }

  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointer, { passive: true });

  // gentle device-tilt parallax on phones (no permission prompt: only where it is freely available)
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    pointer.tx = MathUtils.clamp(e.gamma / 30, -1, 1);
    pointer.ty = MathUtils.clamp((e.beta - 45) / 30, -1, 1);
  }, { passive: true });

  /* Adaptive quality: drop resolution if frames are slow ---------------- */
  let frames = 0, slow = 0, lastT = performance.now();
  function watchdog(now) {
    const dt = now - lastT; lastT = now;
    if (++frames < 30) return;
    if (dt > 30) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 20 && maxDpr > 1) {
      maxDpr = 1;
      renderer.setPixelRatio(1);
      renderer.setSize(width, height, false);
      slow = 0;
    }
  }

  function update(dt) {
    const still = reduced();
    const k = still ? 1 : 1 - Math.pow(0.0015, dt); // frame-rate independent smoothing

    pointer.x += (pointer.tx - pointer.x) * k * 0.6;
    pointer.y += (pointer.ty - pointer.y) * k * 0.6;
    progress.h += (progress.hero - progress.h) * k;
    progress.c += (progress.contact - progress.c) * k;

    const h = progress.h, c = progress.c;
    const ease = (x) => x * x * (3 - 2 * x);
    // the explosion relaxes back as the contact section arrives
    const he = ease(h) * (1 - ease(c));

    // hero → content: camera pushes in, the shell and packets fly outward
    // contact: core comes back, centred, reassembled
    const cx = MathUtils.lerp(layout.x, 0, c);
    const cy = MathUtils.lerp(layout.y, width < 720 ? -0.2 : 0, c);
    rig.position.set(cx, cy + he * 0.8, -he * 1.5);
    const base = MathUtils.lerp(layout.scale, width < 720 ? 0.5 : 0.62, c);
    rig.scale.setScalar(base);

    shell.scale.setScalar(1 + he * 1.4);
    cage.scale.setScalar(1 + he * 2.2);
    ring.scale.setScalar(1 + he * 1.8);
    shell.material.opacity = 0.16 * (1 - he * 0.6);
    camera.position.z = 8 - he * 2.4 - c * 0.6;
    camera.position.x = pointer.x * 0.25;
    camera.position.y = -pointer.y * 0.18;
    camera.lookAt(rig.position.x * 0.35, rig.position.y * 0.35, 0);

    core.rotation.y += ((pointer.x * 0.5) - core.rotation.y) * k * 0.4;
    core.rotation.x += ((pointer.y * 0.35) - core.rotation.x) * k * 0.4;

    if (!still) {
      t += dt;
      crystal.rotation.y += dt * 0.18;
      crystal.rotation.x += dt * 0.07;
      shell.rotation.y -= dt * 0.06;
      cage.rotation.z += dt * 0.025;
      dust.rotation.y += dt * 0.008;
      grid.position.z = (t * 0.35) % 1;
    }

    // scanning ring
    const sy = Math.sin(t * 0.9) * 1.35;
    scan.position.y = sy;
    const sr = Math.sqrt(Math.max(0.0001, 1.55 * 1.55 - sy * sy));
    scan.scale.set(sr, sr, 1);
    scan.material.opacity = 0.25 + 0.65 * (1 - Math.abs(sy) / 1.4);
    crystalEdges.material.opacity = 0.35 + 0.35 * Math.max(0, 1 - Math.abs(sy) * 1.2);

    // packets
    for (let i = 0; i < PACKETS; i++) {
      const p = packetData[i];
      if (!still) p.a += dt * p.v * (1 + c * 0.6);
      dummy.position.set(Math.cos(p.a) * p.r, p.y, Math.sin(p.a) * p.r);
      dummy.rotation.set(p.a, p.a * 0.5, 0);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      packets.setMatrixAt(i, dummy.matrix);
    }
    packets.instanceMatrix.needsUpdate = true;
  }

  function stageVisible() {
    return Number(document.documentElement.style.getPropertyValue('--stage-o') || 1) > 0.01;
  }

  let prev = performance.now();
  function frame(now) {
    rafId = 0;
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    if (!running) return;
    if (stageVisible()) {
      update(dt);
      renderer.render(scene, camera);
      watchdog(now);
    }
    if (!reduced()) rafId = requestAnimationFrame(frame);
  }
  function start() { if (!rafId) { prev = performance.now(); rafId = requestAnimationFrame(frame); } }
  function renderOnce() { update(1); renderer.render(scene, camera); }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) start();
  });
  window.addEventListener('resize', resize);
  resize();
  if (reduced()) renderOnce(); else start();

  return {
    setProgress(hero, contact) {
      progress.hero = hero; progress.contact = contact;
      if (reduced()) { progress.h = hero; progress.c = contact; renderOnce(); }
      else start();
    },
  };
}
