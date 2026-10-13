/* 404 : « 404 » fait de points qui respirent ; le curseur les recolle ; la ligne de signal est rompue en son
   milieu et se ressoude quand on la survole. */
import { C, FONT, glow, lerp, rnd, ss, L, type SceneFn } from './util';

interface Pt { x: number; y: number; ox: number; oy: number; ph: number }
let pts: Pt[] | null = null, pw = 0, ph2 = 0, cx404 = 0, base404 = 0;
const mouse = { x: -1e4, y: -1e4 };
addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) { mouse.x = t.clientX; mouse.y = t.clientY; } }, { passive: true });

function sample(w: number, h: number, txt: string): Pt[] {
  const c = document.createElement('canvas'), g = c.getContext('2d'), wide = w > 900, fs = wide ? Math.min(w * .36, h * .56) : Math.min(w * .62, h * .5);
  cx404 = wide ? w * .66 : w / 2;
  const cy404 = wide ? h * .42 : h * .4;
  base404 = cy404 + fs * .3;
  c.width = Math.round(w); c.height = Math.round(h);
  if (!g) return [];
  g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 ' + fs + 'px ' + FONT; g.fillText(txt, cx404, cy404);
  const d = g.getImageData(0, 0, c.width, c.height).data, out: Pt[] = [], step = Math.max(5, Math.round(w / 170)), r = rnd(7);
  for (let y = 0; y < c.height; y += step) for (let x = 0; x < c.width; x += step) if ((d[(y * c.width + x) * 4 + 3] ?? 0) > 128) out.push({ x, y, ox: (r() - .5) * w * .22, oy: (r() - .5) * h * .3, ph: r() * 6.28 });
  return out;
}
const lost: SceneFn = (ctx, w, h, _p, t, _mini, el) => {
  if (!pts || Math.abs(pw - w) > 2 || Math.abs(ph2 - h) > 2) { pts = sample(w, h, L(el, 'code') || '404'); pw = w; ph2 = h; }
  const rb = el.getBoundingClientRect(), mx = mouse.x - rb.left, my = mouse.y - rb.top;
  const breath = .5 + .5 * Math.sin(t * .45), base = t === 0 ? 1 : lerp(.5, .97, breath);
  const head = (t * .18) % 1.3 - .15, hx = head * w;
  for (const q of pts) {
    const dm = Math.hypot(q.x - mx, q.y - my), lens = 1 - ss(60, 190, dm);
    const k = Math.max(base, lens), x = q.x + q.ox * (1 - k) + Math.sin(t + q.ph) * 3 * (1 - k), y = q.y + q.oy * (1 - k) + Math.cos(t * .8 + q.ph) * 3 * (1 - k);
    const near = t > 0 && Math.abs(q.x - hx) < 40 ? 1 - Math.abs(q.x - hx) / 40 : 0;
    const on = lens > .3 || near > .2;
    ctx.globalAlpha = .3 + .7 * Math.max(k, near); ctx.fillStyle = on ? C.sig : C.ink2;
    ctx.beginPath(); ctx.arc(x, y, on ? 2.2 : 1.6, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = 1;
  /* la ligne de signal, interrompue au milieu */
  const yL = base404 + 18; ctx.lineWidth = 1.6; ctx.strokeStyle = C.sig; glow(ctx, true); ctx.beginPath();
  const xs = w > 900 ? Math.max(0, cx404 - w * .3) : 0;
  for (let x = xs; x <= w; x += 4) {
    const gap = x > cx404 - w * .08 && x < cx404 + w * .08, dn = Math.hypot(x - mx, yL - my) < 120;
    const yy = yL + (gap && !dn ? Math.sin(x * .9 + t * 20) * 6 * (t ? Math.random() : .5) : Math.sin(x * .02 + t * 2) * 4);
    if (gap && !dn && (t ? Math.random() < .5 : x % 16 < 8)) { ctx.moveTo(x + 4, yy); continue; }
    if (x === xs) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
  }
  ctx.stroke(); glow(ctx, false);
};
export default lost;
