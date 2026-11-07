import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AurumWarehouseProps {
  onOpenProductsTable?: () => void;
}

export const AurumWarehouse: React.FC<AurumWarehouseProps> = ({ onOpenProductsTable }) => {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const logContainerRef = useRef<HTMLUListElement | null>(null);

  // Animated metrics state
  const [metrics, setMetrics] = useState({
    skus: '0',
    stock: '0',
    val: '$0M',
    accuracy: '0%',
  });

  // Category progress widths state
  const [barWidths, setBarWidths] = useState<number[]>([0, 0, 0, 0, 0]);

  // Log entries state
  interface LogEntry {
    id: string;
    time: string;
    text: string;
    hash: string;
  }

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '09:34:17', text: 'Outbound dispatched · SO-20931 · 64 units', hash: '#a84e2b01' },
    { id: '2', time: '09:26:51', text: 'Transfer · Bay A3 to B1 · 180 units', hash: '#6f193c72' },
    { id: '3', time: '09:18:03', text: 'Cycle count verified · Aisle B · 0 variance', hash: '#3d9418e5' },
    { id: '4', time: '09:12:44', text: 'Inbound received · PO-8841 · +320 units', hash: '#e582a471' },
  ]);

  const categories = [
    { name: 'Electronics', count: 18340, pct: 38 },
    { name: 'Industrial', count: 11580, pct: 24 },
    { name: 'Apparel', count: 8690, pct: 18 },
    { name: 'Food & Beverage', count: 5790, pct: 12 },
    { name: 'Pharma', count: 3860, pct: 8 },
  ];

  // Number animation effect
  useEffect(() => {
    const t0 = performance.now();
    const duration = 1600;

    let frameId = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);

      setMetrics({
        skus: Math.round(2847 * e).toLocaleString('en-US'),
        stock: Math.round(48260 * e).toLocaleString('en-US'),
        val: '$' + (12.4 * e).toFixed(1) + 'M',
        accuracy: (99.7 * e).toFixed(1) + '%',
      });

      if (p < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    const timeout = setTimeout(() => {
      setBarWidths(categories.map(c => c.pct * 2));
    }, 300);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timeout);
    };
  }, []);

  // FNV hash function for live audit log
  const prevHashRef = useRef('00000000');
  const pool = [
    'Inbound received · PO-8852 · +240 units',
    'Cycle count verified · Aisle C · 0 variance',
    'Transfer · Bay C2 to A4 · 96 units',
    'Outbound dispatched · SO-20944 · 120 units',
    'Putaway completed · Rack B3 · 48 units',
    'Adjustment approved · SKU-4471 · 2 units',
  ];
  const poolIndexRef = useRef(0);

  useEffect(() => {
    function fnv(s: string) {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(16).padStart(8, '0');
    }

    const interval = setInterval(() => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      const timeStr = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
      const text = pool[poolIndexRef.current % pool.length];
      poolIndexRef.current++;

      const newHash = fnv(prevHashRef.current + timeStr + text);
      prevHashRef.current = newHash;

      setLogs(prevLogs => [
        { id: String(Date.now()), time: timeStr, text, hash: '#' + newHash },
        ...prevLogs.slice(0, 4),
      ]);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  // Three.js 3D Warehouse Setup
  useEffect(() => {
    const stage = tiltRef.current;
    if (!stage) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Clear previous canvas
    while (stage.firstChild) {
      stage.removeChild(stage.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl, powerPreference: 'high-performance' });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.5 : 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    stage.appendChild(renderer.domElement);

    const BG = 0x07080c;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.Fog(BG, 48, 120);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 250);
    const target = new THREE.Vector3(0, 4.5, -2);

    const world = new THREE.Group();
    const mirror = new THREE.Group();
    mirror.scale.y = -1;
    scene.add(world, mirror);

    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x1a1c26, 0.6));
    const sun = new THREE.DirectionalLight(0xfff0d2, 1.15);
    sun.position.set(-16, 30, 18);
    sun.castShadow = !isSoftwareGl;
    const sm = window.innerWidth < 700 ? 1024 : 2048;
    sun.shadow.mapSize.set(sm, sm);
    Object.assign(sun.shadow.camera, { left: -34, right: 34, top: 34, bottom: -34, near: 1, far: 90 });
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const mat = (c: number, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    const add = (
      g: THREE.Group | THREE.Scene,
      m: THREE.Material,
      x: number,
      y: number,
      z: number,
      sx: number,
      sy: number,
      sz: number,
      sh = true
    ) => {
      const o = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
      o.position.set(x, y, z);
      o.castShadow = sh && !isSoftwareGl;
      o.receiveShadow = !isSoftwareGl;
      g.add(o);
      return o;
    };

    const reflect = (g: THREE.Group) => {
      const c = g.clone();
      c.traverse(o => {
        o.castShadow = false;
        o.receiveShadow = false;
      });
      mirror.add(c);
      return c;
    };

    const W = 46;
    const D = 36;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(W, D),
      new THREE.MeshStandardMaterial({
        color: 0x12151e,
        roughness: 0.22,
        metalness: 0.45,
        transparent: true,
        opacity: 0.8,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    floor.renderOrder = 2;
    scene.add(floor);

    const wallM = mat(0x171a24, 0.85, 0.1);
    const goldM = mat(0xd4af37, 0.35, 0.8);
    add(scene, wallM, 0, 8, -D / 2, W, 16, 0.5);
    add(scene, wallM, -W / 2, 8, 0, 0.5, 16, D);
    add(scene, goldM, 0, 1.4, -D / 2 + 0.3, W, 0.12, 0.1, false);
    add(scene, goldM, -W / 2 + 0.3, 1.4, 0, 0.1, 0.12, D, false);
    add(scene, goldM, 0, 13.5, -D / 2 + 0.3, W, 0.12, 0.1, false);

    const lineM = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 0.5,
      roughness: 0.5,
    });
    [-8.25, -0.25, 8.8].forEach(z => {
      add(scene, lineM, 0, 0.012, z - 3, W - 3, 0.02, 0.12, false);
      add(scene, lineM, 0, 0.012, z + 3, W - 3, 0.02, 0.12, false);
    });

    const beamM = mat(0x2a303d, 0.5, 0.5);
    for (let i = -3; i <= 3; i++) add(scene, beamM, i * 7, 15.4, 0, 0.5, 0.7, D);
    [-14, -4, 6].forEach(z => add(scene, beamM, 0, 15.8, z, W, 0.5, 0.5));

    const lampM = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe7b8, emissiveIntensity: 2.6 });
    const shaftM = new THREE.MeshBasicMaterial({
      color: 0xffdc90,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    [
      [-12, -8.25],
      [0, -8.25],
      [12, -8.25],
      [-12, -0.25],
      [0, -0.25],
      [12, -0.25],
      [-12, 8.8],
      [12, 8.8],
    ].forEach(([x, z]) => {
      const l = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 0.8), lampM);
      l.position.set(x, 15, z);
      scene.add(l);
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 3.4, 15, 28, 1, true), shaftM);
      s.position.set(x, 7.5, z);
      scene.add(s);
      const p = new THREE.PointLight(0xffe2b0, 0.5, 28, 1.5);
      p.position.set(x, 12.5, z);
      scene.add(p);
    });

    const upM = mat(0x20273a, 0.4, 0.6);
    const bmM = mat(0xd4af37, 0.4, 0.7);
    const deckM = mat(0x4b5263, 0.6, 0.4);
    const boxCols = [0xc89b6a, 0xb98a58, 0xd2a877, 0xa87a4c, 0x2b3142, 0x3a4256].map(c => mat(c, 0.85));
    const stripM = mat(0xf0e0b8, 0.8);
    const levels = [0.25, 2.75, 5.25, 7.75];
    const bay = 5.6;
    const rd = 1.8;
    const rh = 10.4;
    const seeded = () => {
      let s = 11;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    };
    const R = seeded();

    function rack(cx: number, cz: number) {
      const g = new THREE.Group();
      g.position.set(cx, 0, cz);
      [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].forEach(([a, b]) => add(g, upM, (a * bay) / 2, rh / 2, (b * rd) / 2, 0.2, rh, 0.2));
      levels.forEach(y => {
        add(g, bmM, 0, y, -rd / 2, bay, 0.22, 0.12);
        add(g, bmM, 0, y, rd / 2, bay, 0.22, 0.12);
        add(g, deckM, 0, y + 0.04, 0, bay - 0.2, 0.06, rd - 0.1, false);
        let x = -bay / 2 + 0.45;
        while (x < bay / 2 - 0.9) {
          const w = 0.9 + R() * 0.7;
          const h = 0.9 + R() * 1.0;
          if (R() > 0.1) {
            const m = boxCols[Math.floor(R() * boxCols.length)];
            add(g, m, x + w / 2, y + 0.07 + h / 2, 0, w, h, rd - 0.35);
            add(g, stripM, x + w / 2, y + 0.07 + h / 2, (rd - 0.35) / 2 + 0.005, w * 0.88, 0.07, 0.01, false);
          }
          x += w + 0.14;
        }
      });
      world.add(g);
      reflect(g);
    }
    [-12, -4.5, 4].forEach(z => [-14.5, -8.9, -3.3, 2.3, 7.9, 13.5].forEach(x => rack(x, z)));

    function pallet(x: number, z: number, n: number, ry: number) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = ry;
      const wood = mat(0x6e5636, 0.9);
      add(g, wood, 0, 0.07, 0, 1.6, 0.14, 1.4);
      for (let k = 0; k < n; k++) {
        const m = boxCols[Math.floor(R() * boxCols.length)];
        add(g, m, -0.38, 0.7 + k, 0, 0.78, 0.95, 1.2);
        add(g, m, 0.38, 0.7 + k, 0, 0.78, 0.95, 1.2);
      }
      world.add(g);
      reflect(g);
    }
    pallet(-16, 12.5, 3, 0.1);
    pallet(-13.4, 12.8, 2, -0.05);
    pallet(15, 13, 3, 0.2);
    pallet(17.6, 12.2, 2, -0.1);

    interface AgvItem {
      g: THREE.Group;
      m: THREE.Group;
      x0: number;
      x1: number;
      speed: number;
      dir: number;
    }
    const agvs: AgvItem[] = [];
    function agv(x: number, z: number, x0: number, x1: number, speed: number, dir: number) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      add(g, mat(0x1a1e2a, 0.35, 0.7), 0, 0.3, 0, 2.0, 0.4, 1.3);
      add(g, goldM, 0, 0.55, 0, 1.8, 0.1, 1.1);
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(2.02, 0.06, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xffe9a0, emissive: 0xffd35a, emissiveIntensity: 3 })
      );
      strip.position.set(0, 0.3, 0.66);
      g.add(strip);
      const strip2 = strip.clone();
      strip2.position.z = -0.66;
      g.add(strip2);
      add(g, boxCols[agvs.length % 4], 0, 1.15, 0, 1.2, 0.9, 0.9);
      world.add(g);
      agvs.push({ g, m: reflect(g), x0, x1, speed, dir });
    }
    agv(-8, -8.25, -16, 16, 2.0, 1);
    agv(10, -0.25, -16, 16, 1.6, -1);
    agv(-2, 8.8, -14, 14, 1.8, 1);

    const skin = [0xf1c6a0, 0xc68a5e, 0x8d5a3b, 0xe0ac82];
    interface WorkerItem {
      g: THREE.Group;
      x0: number;
      x1: number;
      speed: number;
      ph: number;
      dir: number;
      legL: THREE.Group;
      legR: THREE.Group;
      armL: THREE.Group;
      armR: THREE.Group;
      carry: boolean;
    }
    const workers: WorkerItem[] = [];
    function worker(
      x0: number,
      x1: number,
      z: number,
      speed: number,
      vc: number,
      ph: number,
      carry: boolean
    ) {
      const g = new THREE.Group();
      const sk = mat(skin[workers.length % 4], 0.7);
      const vs = mat(vc, 0.55);
      const pn = mat(0x252c3c, 0.85);
      const hat = mat(0xf5f0e0, 0.4);
      add(g, vs, 0, 1.25, 0, 0.55, 0.75, 0.32);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), sk);
      head.position.y = 1.82;
      head.castShadow = !isSoftwareGl;
      g.add(head);
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.23, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        hat
      );
      cap.position.y = 1.87;
      cap.castShadow = !isSoftwareGl;
      g.add(cap);
      const limb = (m: THREE.Material, lx: number, ly: number, sx: number, sy: number, sz: number) => {
        const p = new THREE.Group();
        p.position.set(lx, ly, 0);
        const o = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
        o.position.y = -sy / 2;
        o.castShadow = !isSoftwareGl;
        p.add(o);
        g.add(p);
        return p;
      };
      const legL = limb(pn, -0.15, 0.9, 0.2, 0.9, 0.22);
      const legR = limb(pn, 0.15, 0.9, 0.2, 0.9, 0.22);
      const armL = limb(vs, -0.38, 1.6, 0.15, 0.7, 0.17);
      const armR = limb(vs, 0.38, 1.6, 0.15, 0.7, 0.17);
      if (carry) {
        armL.rotation.x = armR.rotation.x = -1.25;
        add(g, boxCols[0], 0, 1.3, 0.45, 0.5, 0.4, 0.4);
      }
      g.position.set(x0 + (x1 - x0) * ((ph * 0.27) % 1), 0, z);
      world.add(g);
      workers.push({ g, x0, x1, speed, ph, dir: ph % 2 ? 1 : -1, legL, legR, armL, armR, carry });
    }
    worker(-14, 14, -9.6, 1.1, 0xd4af37, 1, true);
    worker(-12, 12, -6.8, 0.9, 0x2fb36b, 2, false);
    worker(-13, 13, -2.4, 1.0, 0xd4af37, 3, true);
    worker(-10, 10, 6.2, 0.85, 0xe8573d, 4, false);

    const dg = new THREE.BufferGeometry();
    const pts = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 40;
      pts[i * 3 + 1] = 1 + Math.random() * 13;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    dg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const dust = new THREE.Points(
      dg,
      new THREE.PointsMaterial({ color: 0xffe6b0, size: 0.07, transparent: true, opacity: 0.4, depthWrite: false })
    );
    scene.add(dust);

    let wide = true;
    function fit() {
      if (!stage) return;
      const w = stage.clientWidth || window.innerWidth;
      const h = stage.clientHeight || window.innerHeight;
      wide = window.innerWidth > 900;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = wide ? 34 : 46;
      if (wide) camera.setViewOffset(w, h, -w * 0.13, 0, w, h);
      else camera.setViewOffset(w, h, 0, h * 0.2, w, h);
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', fit);
    fit();

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let hasPointer = false;

    const handlePointerMove = (e: PointerEvent) => {
      hasPointer = true;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove);

    const clock = new THREE.Clock();
    let last = 0;
    let animId = 0;

    function loop() {
      const t = clock.getElapsedTime();
      const dt = Math.min(t - last, 0.05);
      last = t;

      if (!hasPointer) {
        tx = Math.sin(t * 0.25) * 0.6;
        ty = Math.cos(t * 0.2) * 0.4;
      }
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;

      if (stage) {
        stage.style.transform = `rotateX(${-cy * 4}deg) rotateY(${cx * 6}deg) scale(1.03)`;
      }

      const R0 = wide ? 50 : 62;
      const th = 0.72 + Math.sin(t * 0.12) * 0.06;
      const ph = 1.12;
      camera.position.set(
        target.x + R0 * Math.sin(ph) * Math.sin(th),
        target.y + R0 * Math.cos(ph),
        target.z + R0 * Math.sin(ph) * Math.cos(th)
      );
      camera.lookAt(target);

      agvs.forEach(a => {
        a.g.position.x += a.dir * a.speed * dt;
        if (a.g.position.x > a.x1) a.dir = -1;
        if (a.g.position.x < a.x0) a.dir = 1;
        a.g.rotation.y = a.dir > 0 ? 0 : Math.PI;
        a.m.position.copy(a.g.position);
        a.m.rotation.y = a.g.rotation.y;
      });

      workers.forEach(w => {
        const p = w.g.position;
        p.x += w.dir * w.speed * dt;
        if (p.x > w.x1) w.dir = -1;
        if (p.x < w.x0) w.dir = 1;
        const tr = w.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        w.g.rotation.y += (tr - w.g.rotation.y) * Math.min(1, dt * 6);
        const s = Math.sin(t * w.speed * 5 + w.ph);
        w.legL.rotation.x = s * 0.6;
        w.legR.rotation.x = -s * 0.6;
        if (!w.carry) {
          w.armL.rotation.x = -s * 0.5;
          w.armR.rotation.x = s * 0.5;
        }
        p.y = Math.abs(s) * 0.04;
      });

      dust.rotation.y = t * 0.01;
      dust.position.y = Math.sin(t * 0.2) * 0.25;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#07080c] text-[#f3efe4] overflow-hidden select-none font-['Times_New_Roman',Times,serif]">
      
      {/* 3D Fixed Viewport with Tilt */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ perspective: '1200px' }}>
        <div 
          ref={tiltRef} 
          className="absolute inset-[-4%] will-change-transform" 
          style={{ transformStyle: 'preserve-3d' }}
        />
      </div>

      {/* Atmospheric Vignette Shade */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(90deg, rgba(7,8,12,0.88) 0%, rgba(7,8,12,0.55) 34%, transparent 62%), radial-gradient(110% 90% at 60% 45%, transparent 55%, rgba(7,8,12,0.7) 100%)'
        }}
      />

      {/* Interactive Main Foreground Panel */}
      <main className="relative z-10 px-5 sm:px-10 py-8 lg:py-14 max-w-7xl mx-auto flex flex-col justify-start">
        <section className="w-full max-w-[520px] flex flex-col gap-4">
          
          {/* Brand Mark matching Aurum Logistics */}
          <div className="flex items-center gap-3 text-sm tracking-[0.28em] uppercase text-[#f1d572]">
            <div className="w-[26px] h-[26px] border-[1.5px] border-[#d4af37] rotate-45 grid place-items-center">
              <span className="w-2 h-2 bg-[#d4af37]" />
            </div>
            <span>Aurum Logistics</span>
          </div>

          {/* Heading */}
          <h1 className="text-[34px] sm:text-[48px] lg:text-[56px] font-bold tracking-tight leading-[1.05] text-[#f3efe4]">
            Inventory, <em className="italic text-[#d4af37] font-serif">perfectly</em> in order.
          </h1>

          <p className="text-[#a79f8a] text-base sm:text-lg leading-relaxed max-w-[40ch]">
            A live view of every rack, vehicle and movement across the facility.
          </p>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            
            <div className="bg-[rgba(13,15,22,0.74)] border border-[rgba(212,175,55,0.3)] rounded-[14px] p-4 backdrop-blur-md">
              <small className="block text-xs uppercase tracking-[0.16em] text-[#a79f8a]">Total SKUs</small>
              <b className="block mt-1.5 text-2xl sm:text-3xl font-bold text-[#f1d572] tabular-nums">{metrics.skus}</b>
              <i className="block mt-0.5 text-xs text-[#7fcf9a] not-italic">+42 this week</i>
            </div>

            <div className="bg-[rgba(13,15,22,0.74)] border border-[rgba(212,175,55,0.3)] rounded-[14px] p-4 backdrop-blur-md">
              <small className="block text-xs uppercase tracking-[0.16em] text-[#a79f8a]">Units in stock</small>
              <b className="block mt-1.5 text-2xl sm:text-3xl font-bold text-[#f1d572] tabular-nums">{metrics.stock}</b>
              <i className="block mt-0.5 text-xs text-[#7fcf9a] not-italic">+3.1% this month</i>
            </div>

            <div className="bg-[rgba(13,15,22,0.74)] border border-[rgba(212,175,55,0.3)] rounded-[14px] p-4 backdrop-blur-md">
              <small className="block text-xs uppercase tracking-[0.16em] text-[#a79f8a]">Inventory value</small>
              <b className="block mt-1.5 text-2xl sm:text-3xl font-bold text-[#f1d572] tabular-nums">{metrics.val}</b>
              <i className="block mt-0.5 text-xs text-[#7fcf9a] not-italic">+1.8% this month</i>
            </div>

            <div className="bg-[rgba(13,15,22,0.74)] border border-[rgba(212,175,55,0.3)] rounded-[14px] p-4 backdrop-blur-md">
              <small className="block text-xs uppercase tracking-[0.16em] text-[#a79f8a]">Order accuracy</small>
              <b className="block mt-1.5 text-2xl sm:text-3xl font-bold text-[#f1d572] tabular-nums">{metrics.accuracy}</b>
              <i className="block mt-0.5 text-xs text-[#7fcf9a] not-italic">Above target</i>
            </div>

          </div>

          {/* Stock by Category Card */}
          <div className="bg-[rgba(13,15,22,0.74)] border border-[rgba(212,175,55,0.3)] rounded-[14px] p-4 backdrop-blur-md">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-bold flex justify-between items-center mb-3">
              <span>Stock by category</span>
              <span className="text-[11px] tracking-[0.12em] text-[#a79f8a] font-normal">48,260 units</span>
            </h2>

            <div className="space-y-3">
              {categories.map((c, i) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#f3efe4]">{c.name}</span>
                    <em className="text-[#a79f8a] not-italic tabular-nums text-xs">
                      {c.count.toLocaleString('en-US')} · {c.pct}%
                    </em>
                  </div>
                  <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-[1400ms] ease-out"
                      style={{
                        width: `${barWidths[i]}%`,
                        background: 'linear-gradient(90deg, #9c7a1c, #f1d572)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Audit Log Card */}
          <div className="bg-[rgba(13,15,22,0.74)] border border-[rgba(212,175,55,0.3)] rounded-[14px] p-4 backdrop-blur-md">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-bold flex justify-between items-center mb-2">
              <span>Audit log</span>
              <span className="text-[11px] tracking-[0.12em] text-[#a79f8a] font-normal">Hash-chained · read-only</span>
            </h2>

            <ul ref={logContainerRef} className="divide-y divide-[rgba(212,175,55,0.14)] text-sm">
              {logs.map(log => (
                <li key={log.id} className="py-2 grid grid-cols-[auto_1fr_auto] gap-3 items-baseline animate-fade-in">
                  <time className="text-[#a79f8a] font-mono text-xs tabular-nums">{log.time}</time>
                  <span className="text-[#f3efe4] text-xs truncate">{log.text}</span>
                  <code className="font-mono text-[11px] text-[#d4af37]">{log.hash}</code>
                </li>
              ))}
            </ul>
          </div>

          {/* Action button to open Products Catalog if desired */}
          {onOpenProductsTable && (
            <div className="pt-2">
              <button
                onClick={onOpenProductsTable}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9c7a1c] to-[#d4af37] hover:from-[#d4af37] hover:to-[#f1d572] text-[#07080c] font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                Access Product Inventory Ledger →
              </button>
            </div>
          )}

        </section>
      </main>

    </div>
  );
};
