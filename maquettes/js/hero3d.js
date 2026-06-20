/* ============================================================
   TANGER CODE — Hero 3D "La Mer Numérique"
   Undulating point-mesh wave receding to a horizon, height-based
   cyan→blue gradient with glowing crests, drifting particles,
   mouse parallax, fog depth. Graceful fallback if WebGL fails.
   ============================================================ */
(function () {
  "use strict";
  const canvas = document.getElementById("hero3d");
  if (!canvas || typeof THREE === "undefined") { document.body.classList.add("no-3d"); return; }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { document.body.classList.add("no-3d"); return; }

  const BG = 0x0a1628, CYAN = new THREE.Color(0x00d4ff), BLUE = new THREE.Color(0x0a3a8c), CORAL = new THREE.Color(0xff6b35);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.085);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 2.6, 8);
  camera.lookAt(0, -0.4, -6);

  /* ---------- Wave mesh (points) ---------- */
  const SEG = 110, SIZE = 34;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const count = pos.count;
  const base = new Float32Array(count * 2);   // store x,z
  for (let i = 0; i < count; i++) { base[i*2] = pos.getX(i); base[i*2+1] = pos.getZ(i); }
  const colors = new Float32Array(count * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const wave = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.07, vertexColors: true, transparent: true, opacity: 0.92,
    sizeAttenuation: true, fog: true
  }));
  wave.position.y = -1.4;
  scene.add(wave);

  function heightAt(x, z, t) {
    return (
      Math.sin(x * 0.45 + t) * 0.30 +
      Math.sin(z * 0.32 + t * 0.8) * 0.42 +
      Math.sin((x + z) * 0.22 + t * 1.25) * 0.22 +
      Math.sin((x - z) * 0.55 + t * 1.6) * 0.12
    );
  }

  const tmp = new THREE.Color();
  function updateWave(t) {
    let maxH = 1.1;
    for (let i = 0; i < count; i++) {
      const x = base[i*2], z = base[i*2+1];
      const h = heightAt(x, z, t);
      pos.setY(i, h);
      // color by normalized height
      const n = Math.min(Math.max((h + 0.8) / 1.8, 0), 1);
      tmp.copy(BLUE).lerp(CYAN, n);
      if (n > 0.82) tmp.lerp(CORAL, (n - 0.82) / 0.18 * 0.5); // coral on the crests
      colors[i*3] = tmp.r; colors[i*3+1] = tmp.g; colors[i*3+2] = tmp.b;
    }
    pos.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  }

  /* ---------- Drifting particles above the sea ---------- */
  const PC = 260;
  const aPos = new Float32Array(PC * 3);
  for (let i = 0; i < PC; i++) {
    aPos[i*3]   = (Math.random() - 0.5) * 30;
    aPos[i*3+1] = Math.random() * 7 + 0.5;
    aPos[i*3+2] = (Math.random() - 0.5) * 24 - 4;
  }
  const ambient = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(aPos, 3)),
    new THREE.PointsMaterial({ color: 0x9fe8ff, size: 0.05, transparent: true, opacity: 0.55, fog: true })
  );
  scene.add(ambient);

  /* ---------- Mouse parallax ---------- */
  let tx = 0, ty = 0, mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5);
    ty = (e.clientY / window.innerHeight - 0.5);
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }

  const clock = new THREE.Clock();
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    resize();
    const t = reduced ? 0.5 : clock.getElapsedTime() * 0.6;
    // throttle the heavy wireframe rebuild to every other frame
    updateWave(t);

    const ap = ambient.geometry.attributes.position;
    for (let i = 0; i < PC; i++) {
      let y = ap.getY(i) + 0.004 * (reduced ? 0 : 1);
      if (y > 8) y = 0.5;
      ap.setY(i, y);
    }
    ap.needsUpdate = true;

    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    camera.position.x = mx * 2.2;
    camera.position.y = 2.6 - my * 1.2;
    camera.lookAt(0, -0.6, -6);

    renderer.render(scene, camera);
    frame++;
  }
  animate();
})();
