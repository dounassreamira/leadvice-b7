/* Accueil, le nuage de clients : des sphères qui flottent, se repoussent, s'écartent du curseur ;
   on peut en attraper une et la lancer (au doigt : un toucher la lance). */
import { $, $$, RM, FINE } from '../env';

interface Ball { el: HTMLElement; r: number; x: number; y: number; vx: number; vy: number; ph: number; hx: number; hy: number }

export function init(): void {
  const ob = $('#orbs');
  if (!ob) return;
  const cl = ob.parentElement!;
  const sky = $<HTMLCanvasElement>('.cloud-sky', cl);
  const os = $$('.orb', ob);
  let B: Ball[] = [], W = 0, H = 0, vis = false, drag: { b: Ball; dx: number; dy: number } | null = null, lastSY = scrollY;
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 };
  const stars: { x: number; y: number; r: number; o: number; v: boolean }[] = [];
  for (let i = 0; i < 130; i++) stars.push({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 1.7, o: Math.random() * 6.28, v: i % 8 === 0 });
  function setup(): void {
    W = cl.clientWidth; H = cl.clientHeight;
    const m = W < 760;
    B = os.map((o, i) => {
      const cs = getComputedStyle(o), sz = parseFloat(cs.getPropertyValue('--s')) * (m ? .62 : 1);
      const px = parseFloat(cs.getPropertyValue(m ? '--xm' : '--x')) / 100, py = parseFloat(cs.getPropertyValue(m ? '--ym' : '--y')) / 100, old = B[i];
      o.style.left = '0'; o.style.top = '0'; o.style.margin = '0'; o.style.width = sz + 'px'; o.style.height = sz + 'px';
      return { el: o, r: sz / 2, x: old ? Math.min(W - sz / 2, old.x) : px * W, y: old ? Math.min(H - sz / 2, old.y) : py * H, vx: (Math.random() - .5) * 40, vy: (Math.random() - .5) * 40, ph: Math.random() * 6.28, hx: px * W, hy: py * H };
    });
  }
  setup();
  addEventListener('resize', setup);
  new IntersectionObserver((e) => { vis = !!e[0]?.isIntersecting; }).observe(cl);
  const local = (e: PointerEvent): { x: number; y: number } => { const b = cl.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
  cl.addEventListener('pointermove', (e) => {
    const p = local(e), now = performance.now(), dt = Math.max(16, now - mouse.t);
    mouse.vx = (p.x - mouse.x) / dt * 1000; mouse.vy = (p.y - mouse.y) / dt * 1000; mouse.x = p.x; mouse.y = p.y; mouse.t = now;
    if (drag) { drag.b.x = p.x - drag.dx; drag.b.y = p.y - drag.dy; }
  });
  cl.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  os.forEach((o, i) => {
    o.addEventListener('pointerdown', (e) => {
      const b = B[i]!, p = local(e);
      if (FINE) { drag = { b, dx: p.x - b.x, dy: p.y - b.y }; o.setPointerCapture(e.pointerId); o.classList.add('grab'); }
      else { const a = Math.random() * 6.28; b.vx += Math.cos(a) * 420; b.vy += Math.sin(a) * 420; }
    });
    o.addEventListener('pointerup', () => {
      const b = B[i]!;
      if (drag && drag.b === b) { b.vx = Math.max(-1400, Math.min(1400, mouse.vx)); b.vy = Math.max(-1400, Math.min(1400, mouse.vy)); drag = null; o.classList.remove('grab'); }
    });
    o.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const b = B[i]!, a = Math.random() * 6.28; b.vx += Math.cos(a) * 520; b.vy += Math.sin(a) * 520;
    });
  });
  addEventListener('scroll', () => { const d = scrollY - lastSY; lastSY = scrollY; if (!vis || RM) return; B.forEach((b, i) => { b.vy -= d * (1.2 + (i % 3) * .6); }); }, { passive: true });
  let last = 0;
  const loop = (now: number): void => {
    const dt = Math.min(.033, (now - last) / 1000 || .016); last = now;
    if (vis) {
      if (!RM) {
        const cx = W / 2, cy = H / 2, rx = Math.min(300, W * .36), ry = Math.min(170, H * .22), t = now / 1000;
        B.forEach((b) => {
          if (drag && drag.b === b) { b.vx = 0; b.vy = 0; return; }
          b.vx += Math.sin(t * .6 + b.ph) * 26 * dt * 10; b.vy += Math.cos(t * .5 + b.ph * 1.3) * 26 * dt * 10;
          b.vx += (b.hx - b.x) * .12 * dt; b.vy += (b.hy - b.y) * .12 * dt;
          const dx = (b.x - cx) / (rx + b.r), dy = (b.y - cy) / (ry + b.r), dd = dx * dx + dy * dy;
          if (dd < 1) { const k = (1 - dd) * 2600 * dt, n = Math.sqrt(dd) || 1; b.vx += dx / n * k; b.vy += dy / n * k; }
          const mx = b.x - mouse.x, my = b.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
          if (md < b.r + 110 && md > 0) { const f = (b.r + 110 - md) * 16 * dt * 10; b.vx += mx / md * f; b.vy += my / md * f; }
          b.vx *= .985; b.vy *= .985;
          const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy); if (sp > 1600) { b.vx *= 1600 / sp; b.vy *= 1600 / sp; }
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * .7; } if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * .7; }
          if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * .7; } if (b.y > H - b.r) { b.y = H - b.r; b.vy = -Math.abs(b.vy) * .7; }
        });
        for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
          const a = B[i]!, c = B[j]!, ex = c.x - a.x, ey = c.y - a.y, d = Math.sqrt(ex * ex + ey * ey), m = a.r + c.r + 6;
          if (d < m && d > 0) {
            const nx = ex / d, ny = ey / d, ov = (m - d) / 2; a.x -= nx * ov; a.y -= ny * ov; c.x += nx * ov; c.y += ny * ov;
            const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
            if (rv < 0) { const imp = -rv * .9; a.vx -= imp * nx; a.vy -= imp * ny; c.vx += imp * nx; c.vy += imp * ny;
              if (-rv > 220) { a.el.classList.add('hit'); c.el.classList.add('hit'); setTimeout(() => { a.el.classList.remove('hit'); c.el.classList.remove('hit'); }, 260); } }
          }
        }
      }
      B.forEach((b) => { const s = RM ? 1 : 1 + Math.sin(now / 1000 * 1.2 + b.ph) * .025; b.el.style.transform = 'translate(' + (b.x - b.r).toFixed(1) + 'px,' + (b.y - b.r).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')'; });
      if (sky) {
        const d = Math.min(devicePixelRatio || 1, 2), w = sky.clientWidth, h = sky.clientHeight;
        if (sky.width !== Math.round(w * d)) { sky.width = Math.round(w * d); sky.height = Math.round(h * d); }
        const c2 = sky.getContext('2d');
        if (c2) {
          c2.setTransform(d, 0, 0, d, 0, 0); c2.clearRect(0, 0, w, h);
          const tt = RM ? 0 : now / 1000;
          stars.forEach((s) => { c2.globalAlpha = .12 + .55 * (.5 + .5 * Math.sin(tt * 1.4 + s.o)); c2.fillStyle = s.v ? '#7B61FF' : '#9C97A8'; c2.beginPath(); c2.arc(s.x * w, s.y * h, s.r, 0, 6.283); c2.fill(); });
          if (!RM) B.forEach((b) => { const g = c2.createRadialGradient(b.x, b.y, b.r * .8, b.x, b.y, b.r * 1.9); g.addColorStop(0, 'rgba(123,97,255,.10)'); g.addColorStop(1, 'rgba(123,97,255,0)'); c2.globalAlpha = 1; c2.fillStyle = g; c2.beginPath(); c2.arc(b.x, b.y, b.r * 1.9, 0, 6.283); c2.fill(); });
          c2.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
