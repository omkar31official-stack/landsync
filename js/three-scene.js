/**
 * LANDSYNC AI — High-Fidelity Three.js Scene Engine
 * PBR materials, procedural textures, atmospheric fog, glowing boundaries
 */
'use strict';

const ThreeScenes = (() => {

  const scenes = {};

  // ─────────────────────────────────────────────────────────────
  // PROCEDURAL TEXTURE GENERATORS
  // ─────────────────────────────────────────────────────────────

  function createStoneTexture(w = 512, h = 512) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // Base plaster/render coat
    ctx.fillStyle = '#c9b89a';
    ctx.fillRect(0, 0, w, h);

    // Stone blocks
    const stoneColors = ['#b8a888','#c4b090','#d0bc9c','#baa880','#c8b494'];
    const rows = 10, cols = 8;
    const bw = w / cols, bh = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const offset = (r % 2) * bw * 0.5;
        const x = col * bw + offset - (offset > 0 ? bw : 0);
        const y = r * bh;
        ctx.fillStyle = stoneColors[Math.floor(Math.random() * stoneColors.length)];
        ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);

        // Mortar shadow
        ctx.fillStyle = 'rgba(80,60,40,0.18)';
        ctx.fillRect(x, y, bw, 2);
        ctx.fillRect(x, y, 2, bh);
      }
    }

    // Surface noise
    for (let i = 0; i < 3000; i++) {
      const px = Math.random() * w, py = Math.random() * h;
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`;
      ctx.fillRect(px, py, 2, 2);
    }
    return new THREE.CanvasTexture(c);
  }

  function createSlateTexture(w = 512, h = 256) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // Base dark slate
    ctx.fillStyle = '#3a4252';
    ctx.fillRect(0, 0, w, h);

    // Slate tiles
    const tileH = 18, tileW = 22;
    for (let row = 0; row < Math.ceil(h / tileH); row++) {
      const offset = (row % 2) * tileW * 0.5;
      for (let col = -1; col < Math.ceil(w / tileW) + 1; col++) {
        const x = col * tileW + offset;
        const y = row * tileH;
        ctx.fillStyle = `hsl(220, 15%, ${18 + Math.random() * 8}%)`;
        ctx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);
        // Shadow line at bottom
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x, y + tileH - 2, tileW, 2);
      }
    }

    // Surface sheen
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    return new THREE.CanvasTexture(c);
  }

  function createGrassTexture(w = 1024, h = 1024) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // Base grass
    ctx.fillStyle = '#2a3d22';
    ctx.fillRect(0, 0, w, h);

    // Variation patches
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const r = 10 + Math.random() * 40;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      const l = 18 + Math.random() * 14;
      grd.addColorStop(0, `hsl(110,${30 + Math.random()*20}%,${l}%)`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // Fine grass texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ctx.strokeStyle = `rgba(${40 + Math.random()*30},${70 + Math.random()*40},${20 + Math.random()*20},0.3)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y + 4);
      ctx.lineTo(x + (Math.random() - 0.5) * 4, y);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(c);
  }

  function createRoadTexture(w = 512, h = 512) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#22293a';
    ctx.fillRect(0, 0, w, h);

    // Asphalt noise
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ctx.fillStyle = `rgba(${Math.random()*20},${Math.random()*20},${Math.random()*20},0.5)`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Road aggregate
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ctx.fillStyle = `rgba(100,100,110,${0.05 + Math.random()*0.08})`;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(c);
  }

  function createWindowTexture(w = 128, h = 128) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // Dark interior
    ctx.fillStyle = '#0d1e35';
    ctx.fillRect(0, 0, w, h);

    // Sky reflection diagonal
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(80,130,180,0.35)');
    grad.addColorStop(0.4, 'rgba(40,80,140,0.1)');
    grad.addColorStop(1, 'rgba(10,30,60,0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Window frame lines
    ctx.strokeStyle = 'rgba(180,180,180,0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, w-2, h-2);
    ctx.beginPath();
    ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
    ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
    ctx.stroke();

    // Bright glint
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(2, 2); ctx.lineTo(w*0.4, 2); ctx.lineTo(2, h*0.4);
    ctx.closePath(); ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  function createBrickTexture(w = 512, h = 512) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#8c6a50';
    ctx.fillRect(0, 0, w, h);

    const bw = 50, bh = 22;
    const brickColors = ['#96705a','#8a6248','#9e7a62','#7e5a42','#a08060'];
    for (let r = 0; r < Math.ceil(h / bh); r++) {
      const offset = (r % 2) * bw * 0.5;
      for (let col = -1; col < Math.ceil(w / bw) + 1; col++) {
        const x = col * bw + offset;
        const y = r * bh;
        ctx.fillStyle = brickColors[Math.floor(Math.random() * brickColors.length)];
        ctx.fillRect(x + 2, y + 2, bw - 4, bh - 3);
        // Mortar
        ctx.fillStyle = 'rgba(60,40,30,0.2)';
        ctx.fillRect(x, y, bw, 2);
        ctx.fillRect(x, y, 2, bh);
      }
    }
    return new THREE.CanvasTexture(c);
  }

  // ─────────────────────────────────────────────────────────────
  // RENDERER FACTORY — HDR tone mapping
  // ─────────────────────────────────────────────────────────────
  function makeRenderer(canvas) {
    const r = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: false,
      logarithmicDepthBuffer: false,
    });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.9;
    // r128 compatibility: outputEncoding may not exist; skip if unavailable
    try { r.outputEncoding = THREE.sRGBEncoding; } catch(e) {}
    return r;
  }

  // ─────────────────────────────────────────────────────────────
  // LIGHTING — sun + sky + fill + rim
  // ─────────────────────────────────────────────────────────────
  function setupLighting(scene) {
    // Overcast sky ambient
    const sky = new THREE.HemisphereLight(0xc8d8e8, 0x2a3830, 0.7);
    scene.add(sky);

    // Main sun (warm afternoon)
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.4);
    sun.position.set(25, 45, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    // Blue sky fill (opposite sun)
    const fill = new THREE.DirectionalLight(0x8ab0d0, 0.35);
    fill.position.set(-30, 20, -10);
    scene.add(fill);

    // Warm bounce from ground
    const bounce = new THREE.PointLight(0xd4c090, 0.3, 80);
    bounce.position.set(0, 1, 0);
    scene.add(bounce);

    // Rim light (back-lit atmosphere)
    const rim = new THREE.DirectionalLight(0x90b0e0, 0.2);
    rim.position.set(0, 30, -40);
    scene.add(rim);
  }

  // ─────────────────────────────────────────────────────────────
  // GROUND — grass with texture
  // ─────────────────────────────────────────────────────────────
  function makeGround(scene, size = 140) {
    const tex = createGrassTexture();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);

    const mat = new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.95, metalness: 0.0,
      color: 0xaabb99,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size, 1, 1), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Subtle terrain elevation (undulation)
    const geo = new THREE.PlaneGeometry(size, size, 24, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.08) * 0.3 + Math.cos(z * 0.06) * 0.2);
    }
    geo.computeVertexNormals();
    return mesh;
  }

  // ─────────────────────────────────────────────────────────────
  // ROADS
  // ─────────────────────────────────────────────────────────────
  function makeRoads(scene) {
    const tex = createRoadTexture();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 12);

    const roadMat = new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.92, metalness: 0.02, color: 0xaaaaaa,
    });

    const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(140, 9), roadMat);
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.set(0, 0.02, 30);
    hRoad.receiveShadow = true;
    scene.add(hRoad);

    const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(9, 140), roadMat);
    vRoad.rotation.x = -Math.PI / 2;
    vRoad.position.set(-32, 0.02, 0);
    vRoad.receiveShadow = true;
    scene.add(vRoad);

    // White dashes
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    for (let i = -60; i < 60; i += 8) {
      if (Math.abs(i) < 5) continue;
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 0.18), dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(i, 0.03, 30);
      scene.add(dash);
    }

    // Road curb (raised edge)
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x999aaa, roughness: 0.8 });
    const curbGeo = new THREE.BoxGeometry(140, 0.12, 0.3);
    [-30 - 4.65, -30 + 4.65, 30 - 4.65, 30 + 4.65].forEach(z => {
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(0, 0.06, z);
      scene.add(curb);
    });

    // Pavement / sidewalk strip
    const sideMat = new THREE.MeshStandardMaterial({ color: 0xb0b4be, roughness: 0.9 });
    const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(140, 2.5), sideMat);
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(0, 0.025, 24);
    sidewalk.receiveShadow = true;
    scene.add(sidewalk);
  }

  // ─────────────────────────────────────────────────────────────
  // PARCEL BOUNDARY — glowing teal line
  // ─────────────────────────────────────────────────────────────
  function makeParcel(scene, opts = {}) {
    const {
      w = 21, d = 23, x = 0, z = 0,
      glowColor = 0x00c4a8,
      fillColor = 0x003830,
    } = opts;

    // Filled ground tint
    const fillMat = new THREE.MeshBasicMaterial({
      color: fillColor, transparent: true, opacity: 0.12,
      depthWrite: false,
    });
    const fill = new THREE.Mesh(new THREE.PlaneGeometry(w, d), fillMat);
    fill.rotation.x = -Math.PI / 2;
    fill.position.set(x, 0.04, z);
    scene.add(fill);

    // GLOW EFFECT: multiple stacked lines with decreasing opacity
    const corners = [
      [x - w/2, z - d/2], [x + w/2, z - d/2],
      [x + w/2, z + d/2], [x - w/2, z + d/2],
      [x - w/2, z - d/2],
    ];

    // Core bright line
    [
      { width: 1, opacity: 1.0,  y: 0.08 },
      { width: 3, opacity: 0.35, y: 0.06 },
      { width: 6, opacity: 0.12, y: 0.05 },
    ].forEach(({ opacity, y }) => {
      const pts = corners.map(([cx, cz]) => new THREE.Vector3(cx, y, cz));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: glowColor, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      scene.add(new THREE.Line(geo, mat));
    });

    // Vertex markers (glowing dots)
    const dotMat = new THREE.MeshBasicMaterial({
      color: glowColor, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    corners.slice(0, 4).forEach(([cx, cz]) => {
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.28, 12), dotMat);
      dot.rotation.x = -Math.PI / 2;
      dot.position.set(cx, 0.1, cz);
      scene.add(dot);

      // Glowing halo ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.3, 0.55, 12),
        new THREE.MeshBasicMaterial({
          color: glowColor, transparent: true, opacity: 0.3,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(cx, 0.09, cz);
      scene.add(ring);
    });

    return fill;
  }

  // Setback dashed line
  function makeSetback(scene, pw = 21, pd = 23, setback = 1.5, px = 0, pz = 0) {
    const sw = pw - setback * 2, sd = pd - setback * 2;
    const pts = [
      [px - sw/2, pz - sd/2], [px + sw/2, pz - sd/2],
      [px + sw/2, pz + sd/2], [px - sw/2, pz + sd/2],
      [px - sw/2, pz - sd/2],
    ].map(([a, b]) => new THREE.Vector3(a, 0.07, b));

    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineDashedMaterial({
      color: 0x00c4a8, dashSize: 0.5, gapSize: 0.35,
      transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    scene.add(line);
  }

  // ─────────────────────────────────────────────────────────────
  // DETAILED HOUSE — PBR materials + canvas textures
  // ─────────────────────────────────────────────────────────────
  function makeHouse(scene, opts = {}) {
    const {
      x = 0, z = 0,
      showShadow = true,
    } = opts;

    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Pre-bake textures
    const stoneTex = createStoneTexture();
    stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
    stoneTex.repeat.set(2, 1.2);

    const brickTex = createBrickTexture();
    brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping;
    brickTex.repeat.set(2, 1.5);

    const slateTex = createSlateTexture(512, 256);
    slateTex.wrapS = slateTex.wrapT = THREE.RepeatWrapping;
    slateTex.repeat.set(2, 1);

    const winTex = createWindowTexture();

    // Materials
    const stoneMat = new THREE.MeshStandardMaterial({
      map: stoneTex, roughness: 0.88, metalness: 0.0, color: 0xd8c8aa,
    });
    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTex, roughness: 0.9, metalness: 0.0, color: 0xccaa88,
    });
    const slateMat = new THREE.MeshStandardMaterial({
      map: slateTex, roughness: 0.85, metalness: 0.05, color: 0xaaaabc,
    });
    const winMat = new THREE.MeshStandardMaterial({
      map: winTex, roughness: 0.05, metalness: 0.4, color: 0x8ab0d8,
      transparent: true, opacity: 0.85,
    });
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xe8e0d0, roughness: 0.7, metalness: 0.0,
    });
    const fascMat = new THREE.MeshStandardMaterial({
      color: 0xf0ece0, roughness: 0.7, metalness: 0.0,
    });
    const chimMat = new THREE.MeshStandardMaterial({
      color: 0x886655, roughness: 0.9, metalness: 0.0,
    });
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x3a2010, roughness: 0.7, metalness: 0.05,
    });
    const concMat = new THREE.MeshStandardMaterial({
      color: 0x909090, roughness: 0.95, metalness: 0.0,
    });

    // Helper: box
    const box = (w, h, d, mat, px, py, pz, castS=true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(px, py, pz);
      if (castS) { m.castShadow = true; m.receiveShadow = true; }
      group.add(m);
      return m;
    };

    // ── MAIN BODY (2-storey) ──
    const mainW = 10, mainH = 6.2, mainD = 12;
    box(mainW, mainH, mainD, stoneMat, 0, mainH/2, 0);

    // ── RIGHT WING (garage / utility) ──
    const wingW = 4.5, wingH = 4.5, wingD = 7;
    box(wingW, wingH, wingD, brickMat, mainW/2 + wingW/2 - 0.3, wingH/2, mainD/2 - wingD/2);

    // ── FRONT EXTENSION (bay / porch) ──
    const bayW = 3.8, bayH = 5, bayD = 2.2;
    box(bayW, bayH, bayD, stoneMat, -mainW/2 + bayW/2 + 0.8, bayH/2, -mainD/2 - bayD/2 + 0.3);

    // ── GABLE ROOF (main) ──
    const mainRoof = makeGableRoof(mainW + 0.5, mainD + 0.5, 3.8, slateMat);
    mainRoof.position.set(0, mainH, 0);
    group.add(mainRoof);

    // Wing flat roof (low-pitch)
    const wingRoof = makeGableRoof(wingW + 0.3, wingD + 0.3, 1.8, slateMat);
    wingRoof.position.set(mainW/2 + wingW/2 - 0.3, wingH, mainD/2 - wingD/2);
    group.add(wingRoof);

    // Bay gable
    const bayRoof = makeGableRoof(bayW + 0.3, bayD + 0.3, 2.5, slateMat);
    bayRoof.position.set(-mainW/2 + bayW/2 + 0.8, bayH, -mainD/2 - bayD/2 + 0.3);
    group.add(bayRoof);

    // ── ROOF FASCIA / EAVES ──
    [0, mainH + 3.8 * 0.5].forEach(h => {
      const eave = new THREE.Mesh(new THREE.BoxGeometry(mainW + 0.8, 0.1, 0.25), fascMat);
      eave.position.set(0, mainH - 0.05, -mainD/2 - 0.12);
      group.add(eave);
    });

    // ── CHIMNEYS ──
    box(0.65, 2.5, 0.65, chimMat, -1.5, mainH + 1.2, 1.2);
    // Chimney cap
    box(0.9, 0.12, 0.9, chimMat, -1.5, mainH + 2.45, 1.2);

    // ── DORMERS ──
    const dormerW = 2.0, dormerH = 1.8, dormerD = 1.5;
    [[-2.5, -mainD/2 + 3], [2.5, -mainD/2 + 3]].forEach(([dx, dz]) => {
      const dormerBody = new THREE.Mesh(new THREE.BoxGeometry(dormerW, dormerH, dormerD), stoneMat);
      dormerBody.position.set(dx, mainH + 1.2, dz);
      dormerBody.castShadow = true;
      group.add(dormerBody);

      // Dormer roof
      const dr = makeGableRoof(dormerW + 0.2, dormerD + 0.2, 1.0, slateMat);
      dr.position.set(dx, mainH + 1.2 + dormerH, dz);
      group.add(dr);

      // Dormer window
      const dwin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 0.05), winMat);
      dwin.position.set(dx, mainH + 1.6, dz - dormerD/2 - 0.01);
      group.add(dwin);
    });

    // ── WINDOWS ── (ground floor large, upper floor smaller)
    function addWindow(px, py, pz, ww, wh, axis) {
      const frameG = new THREE.BoxGeometry(
        axis==='z' ? ww + 0.18 : 0.08, wh + 0.18, axis==='z' ? 0.08 : ww + 0.18
      );
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(axis==='z' ? ww : 0.06, wh, axis==='z' ? 0.06 : ww), winMat
      );
      const frame = new THREE.Mesh(frameG, frameMat);
      glass.position.set(px, py, pz);
      frame.position.set(px, py, pz);
      group.add(glass); group.add(frame);

      // Window sill
      const sill = new THREE.Mesh(
        new THREE.BoxGeometry(axis==='z' ? ww + 0.3 : 0.1, 0.08, axis==='z' ? 0.2 : ww + 0.3), frameMat
      );
      sill.position.set(px, py - wh/2 - 0.04, pz + (axis==='z' ? 0.1 : 0));
      group.add(sill);
    }

    // Front windows (z = -mainD/2)
    const fz = -mainD/2 - 0.04;
    addWindow(-3.0, 2.0, fz, 1.8, 1.6, 'z'); // GF left
    addWindow( 0.0, 2.0, fz, 1.4, 1.6, 'z'); // GF center
    addWindow( 3.0, 2.0, fz, 1.4, 1.6, 'z'); // GF right
    addWindow(-3.0, 4.8, fz, 1.0, 1.2, 'z'); // 1F left
    addWindow( 0.0, 4.8, fz, 1.0, 1.2, 'z'); // 1F center
    addWindow( 3.0, 4.8, fz, 1.0, 1.2, 'z'); // 1F right

    // Right side (x = mainW/2)
    const rx = mainW/2 + 0.04;
    addWindow(rx, 2.0, -2.0, 1.2, 1.4, 'x');
    addWindow(rx, 4.8, -2.0, 0.9, 1.1, 'x');

    // Bay window (front extension)
    const bz = -mainD/2 - bayD - 0.04;
    addWindow(-mainW/2 + bayW/2 + 0.8, bayH/2, bz, 2.4, 2.0, 'z');

    // ── DOOR ──
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.08), doorMat);
    door.position.set(1.2, 1.2, fz);
    door.castShadow = true;
    group.add(door);

    // Door frame
    const df = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.7, 0.06), frameMat);
    df.position.set(1.2, 1.35, fz);
    group.add(df);

    // Door step
    box(2.0, 0.14, 0.7, concMat, 1.2, 0.07, fz - 0.35);

    // ── PATH TO DOOR ──
    const path = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 5), concMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(1.2, 0.03, fz - 3);
    path.receiveShadow = true;
    group.add(path);

    // ── FENCE ──
    const fencePostMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.8 });
    const fenceRailMat = new THREE.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.85 });

    for (let fx = -mainW * 0.55; fx <= mainW * 0.55; fx += 1.2) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.08), fencePostMat);
      post.position.set(fx, 0.38, fz - 1.6);
      post.castShadow = true;
      group.add(post);
    }
    // Rails
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(mainW * 1.1 + 0.2, 0.05, 0.05), fenceRailMat);
    rail1.position.set(0, 0.55, fz - 1.6);
    group.add(rail1);
    const rail2 = rail1.clone();
    rail2.position.y = 0.25;
    group.add(rail2);

    // Apply shadows
    if (showShadow) {
      group.traverse(child => {
        if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
      });
    }

    scene.add(group);
    return group;
  }

  function makeGableRoof(w, d, h, mat) {
    const verts = new Float32Array([
      // Left slope (2 triangles)
      -w/2, 0,  d/2,   0, h,  d/2,   0, h, -d/2,
      -w/2, 0,  d/2,   0, h, -d/2,  -w/2, 0, -d/2,
      // Right slope
       w/2, 0,  d/2,   0, h,  d/2,   0, h, -d/2,
       w/2, 0,  d/2,   0, h, -d/2,   w/2, 0, -d/2,
      // Front gable
      -w/2, 0, -d/2,   w/2, 0, -d/2,  0, h, -d/2,
      // Back gable
      -w/2, 0,  d/2,   w/2, 0,  d/2,  0, h,  d/2,
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.computeVertexNormals();

    // UV mapping for texture
    const uvs = new Float32Array(verts.length / 3 * 2);
    for (let i = 0; i < uvs.length; i += 2) { uvs[i] = 0; uvs[i+1] = 0; }
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    return m;
  }

  // ─────────────────────────────────────────────────────────────
  // NEIGHBOR HOUSES
  // ─────────────────────────────────────────────────────────────
  function makeNeighborHouses(scene) {
    const stoneTex = createStoneTexture(256, 256);
    const slateTex = createSlateTexture(256, 128);
    stoneTex.wrapS = stoneTex.wrapT = THREE.RepeatWrapping;
    stoneTex.repeat.set(1.5, 1);
    slateTex.wrapS = slateTex.wrapT = THREE.RepeatWrapping;
    slateTex.repeat.set(1.5, 1);

    const wallMat = new THREE.MeshStandardMaterial({
      map: stoneTex, roughness: 0.9, metalness: 0.0,
      color: 0xb8aaa0, transparent: true, opacity: 0.75,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      map: slateTex, roughness: 0.85,
      color: 0x8890a0, transparent: true, opacity: 0.75,
    });

    const neighbors = [
      { x:  30, z:  -4, w: 9,  h: 5,  d: 11 },
      { x:  28, z:  18, w: 8,  h: 4.5, d: 10 },
      { x: -38, z:  -6, w: 10, h: 5.5, d: 12 },
      { x: -38, z:  18, w: 9,  h: 5,  d: 11 },
      { x:  -4, z: -34, w: 11, h: 5,  d: 9  },
      { x:  22, z: -32, w: 8,  h: 4.5, d: 10 },
    ];

    neighbors.forEach(n => {
      const body = new THREE.Mesh(new THREE.BoxGeometry(n.w, n.h, n.d), wallMat);
      body.position.set(n.x, n.h/2, n.z);
      body.castShadow = true; body.receiveShadow = true;
      scene.add(body);

      const roof = makeGableRoof(n.w + 0.3, n.d + 0.3, n.h * 0.42, roofMat);
      roof.position.set(n.x, n.h, n.z);
      scene.add(roof);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TREES — layered foliage
  // ─────────────────────────────────────────────────────────────
  function makeTrees(scene, positions) {
    positions.forEach(([px, pz, scale = 1.0, variety = 0]) => {
      const group = new THREE.Group();
      group.position.set(px, 0, pz);

      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3d1e, roughness: 0.98 });
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15 * scale, 0.22 * scale, 1.4 * scale, 8),
        trunkMat
      );
      trunk.position.y = 0.7 * scale;
      trunk.castShadow = true;
      group.add(trunk);

      // Layered foliage cones
      const greenShades = [0x2d5a22, 0x345c28, 0x284e1e, 0x3a6430, 0x22481a];
      const shade = greenShades[variety % greenShades.length];
      const layers = variety === 0 ? 3 : 4;

      for (let i = 0; i < layers; i++) {
        const leafMat = new THREE.MeshStandardMaterial({
          color: shade, roughness: 0.95, metalness: 0.0,
        });
        const r  = (1.5 - i * 0.22) * scale;
        const lh = 1.4 * scale;
        const yOff = 1.2 * scale + i * 0.75 * scale;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(r, lh, 8), leafMat);
        cone.position.y = yOff;
        cone.castShadow = true;
        group.add(cone);
      }

      scene.add(group);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // CONFLICT ZONE — red translucent encroachment volume
  // ─────────────────────────────────────────────────────────────
  function makeConflictZone(scene, opts = {}) {
    const { x = -6, z = 0, w = 2.0, d = 6, h = 6.2 } = opts;

    // Translucent fill
    const fillMat = new THREE.MeshStandardMaterial({
      color: 0xff2020, roughness: 0.5, metalness: 0.1,
      transparent: true, opacity: 0.22,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const fill = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), fillMat);
    fill.position.set(x, h/2, z);
    scene.add(fill);

    // Glowing wireframe
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xff3333, linewidth: 2,
      blending: THREE.AdditiveBlending,
      transparent: true, opacity: 0.85, depthWrite: false,
    });
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), wireMat
    );
    edges.position.set(x, h/2, z);
    scene.add(edges);

    // Outer glow ring
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff1111, transparent: true, opacity: 0.08,
      side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, h + 0.4, d + 0.4), glowMat);
    glow.position.set(x, h/2, z);
    scene.add(glow);

    // Measurement lines (red dashed)
    const mMat = new THREE.LineBasicMaterial({
      color: 0xff5555, transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    // Arrow lines to boundary
    const boundary_x = -10.5; // parcel edge
    [[z - d/2, 0.8], [z, 0.8], [z + d/2, 0.8]].forEach(([mz, my]) => {
      const pts = [
        new THREE.Vector3(x - w/2, my, mz),
        new THREE.Vector3(boundary_x, my, mz),
      ];
      const mLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mMat);
      scene.add(mLine);

      // Tick marks
      const tk = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.5),
        new THREE.MeshBasicMaterial({ color: 0xff5555, depthWrite: false }));
      tk.position.set(boundary_x, my, mz);
      scene.add(tk);
    });

    return fill;
  }

  // ─────────────────────────────────────────────────────────────
  // ORBIT CONTROLS (manual implementation)
  // ─────────────────────────────────────────────────────────────
  function createOrbitControls(camera, canvas, opts = {}) {
    let theta  = opts.theta  ?? -0.4;
    let phi    = opts.phi    ?? 0.55;
    let radius = opts.radius ?? 45;
    let tx = opts.tx ?? 0, ty = opts.ty ?? 1, tz = opts.tz ?? 0;
    let dragging = false, rightDrag = false;
    let px = 0, py2 = 0;

    function apply() {
      const sinT = Math.sin(theta), cosT = Math.cos(theta);
      const sinP = Math.sin(phi),   cosP = Math.cos(phi);
      camera.position.set(
        tx + radius * sinT * cosP,
        ty + radius * sinP,
        tz + radius * cosT * cosP
      );
      camera.lookAt(tx, ty, tz);
    }
    apply();

    canvas.addEventListener('mousedown', e => {
      dragging = true; rightDrag = e.button === 2;
      px = e.clientX; py2 = e.clientY;
    });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py2;
      px = e.clientX; py2 = e.clientY;
      if (!rightDrag) {
        theta -= dx * 0.007;
        phi = Math.max(0.05, Math.min(1.5, phi - dy * 0.007));
      } else {
        const ps = radius * 0.0018;
        const perp = theta + Math.PI / 2;
        tx -= (Math.cos(theta) * dx - Math.sin(perp) * 0) * ps;
        tz += (Math.sin(theta) * dx) * ps;
        ty += dy * ps * 0.6;
      }
      apply();
    });
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      radius = Math.max(6, Math.min(120, radius + e.deltaY * 0.04));
      apply();
    }, { passive: false });
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    return {
      setView(t, p, r, ntx, nty, ntz) {
        theta = t; phi = p; radius = r;
        if (ntx !== undefined) tx = ntx;
        if (nty !== undefined) ty = nty;
        if (ntz !== undefined) tz = ntz;
        apply();
      },
      zoom(f) { radius = Math.max(6, Math.min(120, radius * f)); apply(); },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // INIT: DASHBOARD SCENE
  // ─────────────────────────────────────────────────────────────
  function initDashboard(canvas) {
    const W = canvas.clientWidth || 800, H = canvas.clientHeight || 520;
    const renderer = makeRenderer(canvas);
    renderer.setSize(W, H, false);
    renderer.setClearColor(0x0c1420);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1828);
    scene.fog = new THREE.FogExp2(0x0e1828, 0.022);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
    setupLighting(scene);
    makeGround(scene, 140);
    makeRoads(scene);
    makeParcel(scene, { w: 21, d: 23 });
    makeSetback(scene, 21, 23, 1.5);
    makeHouse(scene, { x: 0.5, z: 0 });
    makeNeighborHouses(scene);
    makeTrees(scene, [
      [-8, -13, 1.2, 0], [9.5, -11, 1.0, 2],
      [-10, 9, 1.15, 1], [12, 7, 0.9, 3],
      [-12, 0, 1.1, 0],  [9, 13, 0.95, 2],
      [36, -16, 1.3, 1], [-42, 5, 1.2, 0],
      [32, 12, 1.0, 3],  [-38, -18, 1.1, 2],
      [2, -16, 0.85, 1], [-6, 15, 1.0, 0],
      [18, -5, 1.05, 3], [-20, -12, 0.9, 2],
    ]);

    const controls = createOrbitControls(camera, canvas, {
      theta: -0.52, phi: 0.58, radius: 42, ty: 1,
    });

    let animId, time = 0;
    function animate() {
      animId = requestAnimationFrame(animate);
      time += 0.016;
      renderer.render(scene, camera);
    }
    animate();

    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas.parentElement || canvas);

    scenes.dashboard = { renderer, scene, camera, controls, animId, ro };
    return { controls };
  }

  // ─────────────────────────────────────────────────────────────
  // INIT: ANALYSIS SCENE (top-down 2D-ish orthographic feel)
  // ─────────────────────────────────────────────────────────────
  function initAnalysis(canvas) {
    const W = canvas.clientWidth || 700, H = canvas.clientHeight || 500;
    const renderer = makeRenderer(canvas);
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141e28);
    scene.fog = new THREE.Fog(0x141e28, 80, 180);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 500);
    setupLighting(scene);

    // Dark satellite-ish ground
    const satTex = (() => {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1e2a1a';
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 600; i++) {
        const x = Math.random()*512, y = Math.random()*512;
        const r = 15 + Math.random() * 35;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        const l = 14 + Math.random() * 12;
        grd.addColorStop(0, `hsl(110,18%,${l}%)`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(x-r, y-r, r*2, r*2);
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 4);
      return t;
    })();

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ map: satTex, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Roads
    const roadM = new THREE.MeshStandardMaterial({ color: 0x1e2535, roughness: 0.9 });
    const hr = new THREE.Mesh(new THREE.PlaneGeometry(100, 7), roadM);
    hr.rotation.x = -Math.PI / 2; hr.position.set(0, 0.01, 28);
    scene.add(hr);

    // Parcel - bright teal
    makeParcel(scene, { w: 21, d: 23, glowColor: 0x00d4b0 });

    // Building footprint (filled semi-transparent)
    const fpMat = new THREE.MeshBasicMaterial({
      color: 0x40a080, transparent: true, opacity: 0.45, depthWrite: false,
    });
    const fp = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 12.5), fpMat);
    fp.rotation.x = -Math.PI / 2; fp.position.set(0.5, 0.05, 0);
    scene.add(fp);

    // Footprint border
    const fpPts = [
      [-5, 0.06, -6.25], [5.5, 0.06, -6.25],
      [5.5, 0.06, 6.25], [-5, 0.06, 6.25], [-5, 0.06, -6.25],
    ].map(([a,b,c]) => new THREE.Vector3(a,b,c));
    const fpLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(fpPts),
      new THREE.LineBasicMaterial({
        color: 0x00d4b0, blending: THREE.AdditiveBlending,
        transparent: true, opacity: 0.9,
      })
    );
    scene.add(fpLine);

    // Grid
    const grid = new THREE.GridHelper(100, 40, 0x1a2840, 0x1a2840);
    grid.position.y = 0.01; grid.material.transparent = true; grid.material.opacity = 0.6;
    scene.add(grid);

    // Neighbor parcel outlines
    [[28, 0, 15, 20], [-30, 0, 15, 20], [0, -30, 20, 12]].forEach(([nx, nz, nw, nd]) => {
      const pts2 = [
        [nx-nw/2, nz-nd/2], [nx+nw/2, nz-nd/2],
        [nx+nw/2, nz+nd/2], [nx-nw/2, nz+nd/2],
        [nx-nw/2, nz-nd/2],
      ].map(([a,b]) => new THREE.Vector3(a, 0.03, b));
      const l = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts2),
        new THREE.LineBasicMaterial({ color: 0x2a4060, transparent: true, opacity: 0.7 })
      );
      scene.add(l);
    });

    const controls = createOrbitControls(camera, canvas, {
      theta: 0.02, phi: 1.42, radius: 55, ty: 0,
    });

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas.parentElement || canvas);

    scenes.analysis = { renderer, scene, camera, controls, animId, ro };
    return { controls };
  }

  // ─────────────────────────────────────────────────────────────
  // INIT: VERIFICATION SCENE — 3D with conflict
  // ─────────────────────────────────────────────────────────────
  function initVerification(canvas) {
    const W = canvas.clientWidth || 700, H = canvas.clientHeight || 500;
    const renderer = makeRenderer(canvas);
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1828);
    scene.fog = new THREE.FogExp2(0x101a28, 0.02);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
    setupLighting(scene);
    makeGround(scene, 120);
    makeRoads(scene);
    makeParcel(scene, { w: 21, d: 23 });
    makeSetback(scene, 21, 23, 1.5);
    makeHouse(scene, { x: 0.5, z: 0 });
    makeConflictZone(scene, { x: -10.2, z: 1, w: 1.8, d: 6.5, h: 6.2 });
    makeNeighborHouses(scene);
    makeTrees(scene, [
      [-8, -13, 1.2, 0], [9.5, -11, 1.0, 2],
      [-10, 9, 1.15, 1], [12, 7, 0.9, 3],
      [-12, 0, 1.1, 0],  [9, 13, 0.95, 2],
    ]);

    const controls = createOrbitControls(camera, canvas, {
      theta: -0.65, phi: 0.5, radius: 40, ty: 2,
    });

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas.parentElement || canvas);

    scenes.verify = { renderer, scene, camera, controls, animId, ro };
    return { controls };
  }

  // ─────────────────────────────────────────────────────────────
  // INIT: CONFLICT 3D PANEL
  // ─────────────────────────────────────────────────────────────
  function initConflict3D(canvas) {
    const W = canvas.clientWidth || 450, H = canvas.clientHeight || 360;
    const renderer = makeRenderer(canvas);
    renderer.setSize(W, H, false);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1520);
    scene.fog = new THREE.FogExp2(0x0c1520, 0.025);

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 300);
    setupLighting(scene);
    makeGround(scene, 80);

    makeParcel(scene, { w: 21, d: 23 });
    makeHouse(scene, { x: 1.2, z: 0 });
    makeConflictZone(scene, { x: -9.8, z: 0.5, w: 2.0, d: 7, h: 6.2 });
    makeTrees(scene, [
      [-8, -12, 1.0, 0], [10, -10, 0.85, 2],
    ]);

    const controls = createOrbitControls(camera, canvas, {
      theta: 0.75, phi: 0.42, radius: 32, ty: 2,
    });

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas.parentElement || canvas);

    scenes.conflict = { renderer, scene, camera, controls, animId, ro };
    return { controls };
  }

  // ─────────────────────────────────────────────────────────────
  // CONFLICT 2D PLAN VIEW (canvas 2D)
  // ─────────────────────────────────────────────────────────────
  function drawConflict2D(canvas) {
    canvas.width  = canvas.offsetWidth  || 500;
    canvas.height = canvas.offsetHeight || 400;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const sc = 7; // pixels per metre

    // Background
    ctx.fillStyle = '#101c2a';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,60,90,0.5)';
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < W; gx += sc * 5) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy < H; gy += sc * 5) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // Roads
    ctx.fillStyle = '#181f2c';
    ctx.fillRect(0, cy + 14 * sc, W, 7 * sc);
    ctx.fillRect(cx - 18 * sc, 0, 7 * sc, H);

    // Street labels
    ctx.fillStyle = '#2a3a50';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText('Oak Street', cx + 5, cy + 14 * sc + 18);
    ctx.save();
    ctx.translate(cx - 18 * sc + 12, cy - 5);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Elm Avenue', 0, 0);
    ctx.restore();

    // Dim neighbor parcels
    [[cx + 12*sc, cy - 13*sc, 16*sc, 20*sc],
     [cx - 30*sc, cy - 13*sc, 16*sc, 20*sc],
    ].forEach(([nx, ny, nw, nh]) => {
      ctx.fillStyle = 'rgba(20,40,60,0.5)';
      ctx.fillRect(nx, ny, nw, nh);
      ctx.strokeStyle = '#1e3a54'; ctx.lineWidth = 1;
      ctx.strokeRect(nx, ny, nw, nh);
    });

    // Legal parcel fill
    ctx.fillStyle = 'rgba(0,100,80,0.1)';
    ctx.fillRect(cx - 10.5*sc, cy - 11.5*sc, 21*sc, 23*sc);

    // Legal parcel border — glowing teal
    const parcelGrad = ctx.createLinearGradient(cx - 10.5*sc, 0, cx + 10.5*sc, 0);
    parcelGrad.addColorStop(0, '#00c4a8');
    parcelGrad.addColorStop(1, '#00d4b8');
    ctx.strokeStyle = parcelGrad;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(cx - 10.5*sc, cy - 11.5*sc, 21*sc, 23*sc);

    // Vertex dots
    ctx.fillStyle = '#00c4a8';
    [[cx-10.5*sc,cy-11.5*sc],[cx+10.5*sc,cy-11.5*sc],
     [cx+10.5*sc,cy+11.5*sc],[cx-10.5*sc,cy+11.5*sc]].forEach(([vx,vy]) => {
      ctx.beginPath(); ctx.arc(vx, vy, 3.5, 0, Math.PI*2); ctx.fill();
    });

    // Setback dashed
    ctx.strokeStyle = 'rgba(0,196,168,0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(cx - 9*sc, cy - 10*sc, 18*sc, 20*sc);
    ctx.setLineDash([]);

    // Building footprint
    ctx.fillStyle = 'rgba(50,130,100,0.4)';
    ctx.fillRect(cx - 4.8*sc, cy - 6.2*sc, 10.5*sc, 12.5*sc);
    ctx.strokeStyle = '#00d4a8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 4.8*sc, cy - 6.2*sc, 10.5*sc, 12.5*sc);

    // Conflict zone (west encroachment)
    const confX = cx - 10.5*sc - 1.2*sc;
    const confY = cy - 3.5*sc;
    const confW = 2.2*sc, confH = 7*sc;
    ctx.fillStyle = 'rgba(239,68,68,0.3)';
    ctx.fillRect(confX, confY, confW, confH);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(confX, confY, confW, confH);

    // Conflict label
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('6.4 m²', confX - 2, confY - 6);
    ctx.font = '8px Inter, sans-serif';
    ctx.fillStyle = '#c0c0c0';
    ctx.fillText('OVERLAP', confX - 2, confY + 14);

    // Measurement depth line
    ctx.strokeStyle = 'rgba(239,68,68,0.8)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(cx - 10.5*sc, confY - 8);
    ctx.lineTo(confX, confY - 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillText('0.82 m MAX DEPTH', confX + confW + 4, confY + confH / 2);

    // Segment labels
    ctx.fillStyle = '#00c4a8';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillText('V7', cx - 10.5*sc - 18, cy - 11.5*sc + 6);
    ctx.fillText('V8', cx - 10.5*sc - 18, cy + 11.5*sc - 2);

    // Dimension label 91.3m (top edge)
    ctx.fillStyle = '#8b949e';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('91.3m', cx + 1.5*sc, cy - 11.5*sc - 5);

    // North arrow
    const na = { x: W - 22, y: 22 };
    ctx.fillStyle = '#e6edf3';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText('N', na.x - 3, na.y - 6);
    ctx.strokeStyle = '#e6edf3'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(na.x, na.y); ctx.lineTo(na.x, na.y + 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(na.x - 5, na.y + 5); ctx.lineTo(na.x, na.y);
    ctx.lineTo(na.x + 5, na.y + 5);
    ctx.stroke();

    // Scale bar
    ctx.strokeStyle = '#8b949e'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(10, H - 12); ctx.lineTo(10 + 5*sc, H - 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, H - 9); ctx.lineTo(10, H - 15);
    ctx.moveTo(10 + 5*sc, H - 9); ctx.lineTo(10 + 5*sc, H - 15);
    ctx.stroke();
    ctx.fillStyle = '#8b949e';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('0', 7, H - 16);
    ctx.fillText('5m', 10 + 5*sc - 6, H - 16);
  }

  // ── Public ────────────────────────────────────────────────────
  return {
    initDashboard,
    initAnalysis,
    initVerification,
    initConflict3D,
    drawConflict2D,
    scenes,
  };
})();
