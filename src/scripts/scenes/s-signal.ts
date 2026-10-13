/* Accueil, ouverture : du bruit au signal. Une ligne de bruit se règle en signal violet, puis devient la courbe
   de croissance le long de laquelle des clients s'allument. Le curseur amplifie le signal sous lui. */
import { RM } from '../env';
import { C, clamp, glow, label, lerp, ss, LA, L, type SceneFn } from './util';

function hs(n: number): number { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function vn(x: number): number { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hs(i), hs(i + 1), u) * 2 - 1; }
function fbm(x: number): number { return vn(x) * .6 + vn(x * 2.3 + 7) * .28 + vn(x * 5.1 + 3) * .12; }

const signal: SceneFn = (ctx, w, h, p, t, _mini, el) => {
  if (el._t0 == null) el._t0 = t;
  const CH = LA(el, 'canaux');
  const tt = t - el._t0, intro = RM ? 1 : clamp(tt / 2.6, 0, 1), mob = w < 700;
  const sec = el.getBoundingClientRect();
  const rel = (sel: string, edge: 'top' | 'bottom'): number | null => { const e = el.querySelector(sel); return e ? e.getBoundingClientRect()[edge] - sec.top : null; };
  const hb = rel('.hero-layer', 'bottom') ?? h * .5, hd = rel('.story-head', 'bottom') ?? h * .3, rt = rel('.story-rail', 'top') ?? h * .9;
  const bm = ss(0, .11, p);
  const y0 = lerp(hb + 24, hd + 20, bm), y1 = lerp(h - (mob ? 70 : 40), rt - 24, bm), cy = (y0 + y1) / 2, amp = (y1 - y0) * .42;
  const x0 = mob ? 16 : w * .05, x1 = w - x0, N = mob ? 120 : 240, mouse = el._mouse;
  const s1 = ss(.12, .3, p), s2 = ss(.3, .5, p), s3 = ss(.5, .7, p), s4 = ss(.7, .95, p);
  const tune = x0 + (x1 - x0) * ss(.15, .85, intro);
  /* lignes des canaux : le bruit des indicateurs de vanité */
  const chA = s1 * (1 - s2);
  if (chA > .01) {
    CH.forEach((name, c) => {
      const off = (c - 1.5) / 1.5 * amp * .55;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const u = i / N, x = lerp(x0, x1, u), y = cy + off + fbm(u * 18 + c * 13 + tt * 1.8) * amp * .32 * (1 - s2 * .9); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.globalAlpha = .55 * chA; ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.3; ctx.stroke();
      label(ctx, name, x0, cy + off - 10, chA, 'left', 12, C.ink2);
    });
    ctx.globalAlpha = 1;
  }
  /* la ligne principale */
  const pts: [number, number][] = [];
  for (let j = 0; j <= N; j++) {
    const uu = j / N, xx = lerp(x0, x1, uu);
    const noise = fbm(uu * 26 + tt * 2.2) * amp * .9 + (hs(j + Math.floor(tt * 24) * 7) - .5) * amp * .35;
    const clean = Math.sin(uu * 6.283 * (mob ? 2 : 3) - tt * 1.4) * amp * .45 * Math.exp(-Math.pow((uu - .5) * 1.6, 2)) + Math.sin(uu * 6.283 * 9 - tt * 2) * amp * .05;
    const tuned = intro >= 1 ? 1 : ss(0, 1, (tune - xx) / 60);
    const mix = tuned * (1 - s1 * .75) + s2 * .75;
    let yy = cy + lerp(noise, clean, clamp(mix, 0, 1)) * (1 + s3 * .5);
    if (mouse && p < .12) { const d2 = Math.abs(xx - mouse.x); if (d2 < 150) yy = cy + (yy - cy) * (1 + .6 * (1 - d2 / 150)); }
    if (s4 > 0) { const grow = cy + amp * .9 - Math.pow(uu, 1.8) * amp * 2.1 + Math.sin(uu * 25 - tt * 2) * amp * .03; yy = lerp(yy, grow, s4); }
    pts.push([xx, yy]);
  }
  const last = pts[N]!, first = pts[0]!;
  if (s4 > .05) {
    const g = ctx.createLinearGradient(0, cy - amp, 0, cy + amp); g.addColorStop(0, 'rgba(123,97,255,' + (.22 * s4) + ')'); g.addColorStop(1, 'rgba(123,97,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(first[0], cy + amp); pts.forEach((q) => ctx.lineTo(q[0], q[1])); ctx.lineTo(last[0], cy + amp); ctx.closePath(); ctx.fill();
  }
  /* échos : deux fines ondes lavande décalées, pour la profondeur */
  const echoA = ss(.3, 1, intro) * (1 - s1) * (1 - s4);
  if (echoA > .02) {
    for (let e2 = 1; e2 <= 2; e2++) {
      ctx.beginPath();
      for (let j2 = 0; j2 <= N; j2++) { const u2 = j2 / N, x2 = lerp(x0, x1, u2), y2 = cy + Math.sin(u2 * 6.283 * (mob ? 2 : 3) - tt * 1.4 - e2 * .55) * amp * (.45 - e2 * .1) * Math.exp(-Math.pow((u2 - .5) * 1.6, 2)) * (e2 === 1 ? 1.15 : .8); if (j2) ctx.lineTo(x2, y2); else ctx.moveTo(x2, y2); }
      ctx.strokeStyle = C.lav; ctx.globalAlpha = echoA * (e2 === 1 ? .55 : .3); ctx.lineWidth = 1.2; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  /* trait : gris avant le réglage, violet après */
  for (let k = 1; k <= N; k++) {
    const a = pts[k - 1]!, b = pts[k]!, tunedK = intro >= 1 ? 1 : (b[0] < tune ? 1 : 0);
    const vio = tunedK && (s1 < .5 || s2 > .2);
    ctx.strokeStyle = vio ? C.sig : C.ink3; ctx.lineWidth = vio ? 2.6 + s3 * 1.2 : 1.4; ctx.globalAlpha = vio ? 1 : .7;
    if (vio && k % 6 === 0) glow(ctx, true);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); glow(ctx, false);
  }
  ctx.globalAlpha = 1;
  /* barre de réglage pendant l'ouverture */
  if (intro < 1 && intro > .1) {
    const gr = ctx.createLinearGradient(tune - 70, 0, tune + 6, 0); gr.addColorStop(0, 'rgba(123,97,255,0)'); gr.addColorStop(.85, 'rgba(123,97,255,.18)'); gr.addColorStop(1, 'rgba(123,97,255,0)');
    ctx.fillStyle = gr; ctx.fillRect(tune - 70, y0, 76, y1 - y0); ctx.strokeStyle = C.sig; ctx.lineWidth = 2; glow(ctx, true); ctx.beginPath(); ctx.moveTo(tune, y0); ctx.lineTo(tune, y1); ctx.stroke(); glow(ctx, false);
  }
  /* impulsion qui parcourt le signal */
  if (intro >= 1 && s4 < .5 && !RM) {
    const pu = (tt * .22) % 1, pp = pts[Math.round(pu * N)]!;
    ctx.fillStyle = C.sig; glow(ctx, true); ctx.beginPath(); ctx.arc(pp[0], pp[1], 4 + s3 * 3, 0, 6.283); ctx.fill(); glow(ctx, false);
  }
  /* croissance : des clients s'allument le long de la courbe */
  if (s4 > .2) {
    const M = mob ? 6 : 9;
    for (let m = 0; m < M; m++) {
      const at = ss(.2 + m * .07, .3 + m * .07, s4); if (at <= 0) continue;
      const q2 = pts[Math.min(N, Math.round((.12 + m * .86 / (M - 1)) * N))]!;
      ctx.globalAlpha = at; ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(q2[0], q2[1], 9, 0, 6.283); ctx.fill();
      ctx.fillStyle = C.sig; glow(ctx, true); ctx.beginPath(); ctx.arc(q2[0], q2[1] - 2, 3, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(q2[0], q2[1] + 4, 5, 3.2, 0, 3.1416, 6.283); ctx.fill(); glow(ctx, false);
    }
    ctx.globalAlpha = 1;
    if (s4 > .85) label(ctx, L(el, 'fin'), last[0] - 4, last[1] - 22, ss(.85, 1, s4), 'right', mob ? 18 : 24, C.brand);
  }
};
export default signal;
