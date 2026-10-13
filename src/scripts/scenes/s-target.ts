/* Acquisition : diffuser à tout le monde, cibler, qualifier, transmettre. */
import { C, FONT, glow, label, lerp, person, rnd, rrect, ss, L, LA, type SceneFn } from './util';

interface P { x: number; y: number; m: boolean[]; ok: boolean; ph: number; pass?: boolean; k?: number }
const r = rnd(29), N = 140, PS: P[] = [];
for (let i = 0; i < N; i++) { const m = [r() < .62, r() < .55, r() < .6]; PS.push({ x: r(), y: r(), m, ok: !!(m[0] && m[1] && m[2]), ph: r() * 6.28 }); }
let good = PS.filter((q) => q.ok);
good.slice(12).forEach((q) => { q.ok = false; q.m[2] = false; });
good = good.slice(0, 12);
good.forEach((q, k) => { q.pass = k % 4 !== 2; q.k = k; });

const target: SceneFn = (ctx, w, h, p, t, mini, el) => {
  if (mini) {
    const lx = w * (.5 + .3 * Math.sin(t * .6)), ly = h * .5;
    PS.slice(0, 60).forEach((q) => { const x = q.x * w, y = q.y * h, inn = Math.hypot(x - lx, y - ly) < h * .4; ctx.fillStyle = inn ? C.sig : C.ink3; ctx.globalAlpha = inn ? 1 : .35; ctx.beginPath(); ctx.arc(x, y, 2, 0, 6.283); ctx.fill(); });
    ctx.globalAlpha = 1; return;
  }
  const FL = LA(el, 'filtres'), FORM = LA(el, 'champs');
  const narrow = w < 720, wide = w > 1100;
  let ph: { x: number; y: number }, F: { x: number; y: number; w: number; h: number }, gate: { x: number; y: number; w: number; h: number }, list: { x: number; y: number; w: number };
  if (narrow) { ph = { x: w / 2, y: h * .13 }; F = { x: w * .08, y: h * .25, w: w * .84, h: h * .22 }; gate = { x: w * .1, y: h * .52, w: 92, h: 104 }; list = { x: w * .5, y: h * .52, w: w * .42 }; }
  else { const X0 = wide ? w * .33 : w * .05; ph = { x: X0 + 30, y: h * .36 }; F = { x: X0 + 100, y: h * .14, w: wide ? w * .27 : w * .38, h: h * .46 }; gate = { x: F.x + F.w + 36, y: h * .26, w: 104, h: 120 }; list = { x: gate.x + gate.w + 32, y: h * .22, w: Math.min(200, w - (gate.x + gate.w + 32) - 32) }; }
  const s3 = ss(.58, .86, p), s4 = ss(.86, .98, p);
  /* la publicité */
  ctx.fillStyle = '#1E0F52'; rrect(ctx, ph.x - 22, ph.y - 38, 44, 76, 8); ctx.fill(); ctx.fillStyle = '#fff'; rrect(ctx, ph.x - 18, ph.y - 33, 36, 66, 5); ctx.fill(); ctx.fillStyle = C.sig; rrect(ctx, ph.x - 13, ph.y + 14, 26, 8, 2); ctx.fill();
  /* le faisceau qui se resserre */
  const fy = F.y + F.h / 2, narrowing = ss(.32, .58, p), spread = lerp(F.h * .62, F.h * .22, narrowing);
  if (!narrow) { ctx.fillStyle = 'rgba(123,97,255,' + (.05 + .07 * narrowing) + ')'; ctx.beginPath(); ctx.moveTo(ph.x + 22, ph.y); ctx.lineTo(F.x + F.w, fy - spread); ctx.lineTo(F.x + F.w, fy + spread); ctx.closePath(); ctx.fill(); }
  /* les ondes de diffusion */
  if (p < .4) for (let wv = 0; wv < 3; wv++) { const rr2 = (t * 60 + wv * 90) % 270, a2 = (1 - rr2 / 270) * (1 - ss(.25, .4, p)) * .5; ctx.strokeStyle = 'rgba(123,97,255,' + a2 + ')'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(ph.x, ph.y, 30 + rr2, narrow ? .3 : -1.1, narrow ? Math.PI - .3 : 1.1); ctx.stroke(); }
  /* les filtres */
  const chipY = narrow ? F.y - 22 : F.y - 26;
  let chx = F.x;
  ctx.font = '500 12px ' + FONT; ctx.textAlign = 'left';
  FL.forEach((f, k) => { const on = ss(.3 + k * .08, .36 + k * .08, p), tw = ctx.measureText(f).width + 22; ctx.globalAlpha = ss(.26, .32, p); ctx.fillStyle = on > .5 ? '#301781' : '#fff'; ctx.strokeStyle = on > .5 ? '#301781' : C.line; rrect(ctx, chx, chipY - 15, tw, 24, 12); ctx.fill(); ctx.stroke(); ctx.fillStyle = on > .5 ? '#fff' : '#5B5770'; ctx.fillText(f, chx + 11, chipY + 1); chx += tw + 8; });
  ctx.globalAlpha = 1;
  /* la foule */
  const listRows: [number, number][] = [];
  const passCount = good.filter((g) => g.pass).length;
  PS.forEach((q) => {
    const hx = F.x + q.x * F.w + Math.sin(t * .7 + q.ph) * 2, hy = F.y + q.y * F.h + Math.cos(t * .6 + q.ph) * 2, a = ss(0, .12, p), sz = narrow ? 9 : 11;
    let col = C.ink3;
    let out = 0; for (let k = 0; k < 3; k++) if (!q.m[k]) out = Math.max(out, ss(.32 + k * .08, .38 + k * .08, p));
    if (!q.ok) { person(ctx, hx, hy, sz, col, a * (1 - out * .86)); return; }
    const lit = ss(.4, .56, p);
    if (s3 <= 0) { if (p < .3 && Math.sin(t * 2 + q.ph * 3) > .96) col = C.lav; if (lit > .5) { col = C.sig; glow(ctx, true); } person(ctx, hx, hy, sz, col, a); glow(ctx, false); return; }
    const qk = q.k ?? 0;
    const d = ss(qk * .025, qk * .025 + .45, s3), gx = gate.x + gate.w / 2, gy = gate.y + gate.h / 2;
    const row = good.filter((g) => g.pass && (g.k ?? 0) < qk).length;
    const tx = q.pass ? list.x + 14 : gx, ty = q.pass ? list.y + 38 + row * (narrow ? 18 : 22) : gate.y + gate.h + 30;
    let x: number, y: number;
    if (d < .55) { const e = d / .55; x = lerp(hx, gx, e); y = lerp(hy, gy, e) - Math.sin(e * Math.PI) * 30; }
    else { const e2 = (d - .55) / .45; x = lerp(gx, tx, e2); y = lerp(gy, ty, e2); }
    const c2 = d < .55 ? C.sig : q.pass ? C.sig : C.ink3, al = q.pass ? 1 : 1 - ss(.56, .72, d);
    glow(ctx, !!q.pass && d > .55); person(ctx, x, y, d >= 1 && q.pass ? 10 : sz, c2, al); glow(ctx, false);
    if (q.pass && d >= 1 && list.w > 60) listRows.push([x, y]);
  });
  /* le formulaire qui trie */
  const ga = ss(.5, .62, p); ctx.globalAlpha = ga; ctx.fillStyle = '#fff'; ctx.strokeStyle = s3 > 0 ? C.sig : C.ink3; ctx.lineWidth = 1.2; rrect(ctx, gate.x, gate.y, gate.w, gate.h, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1E0F52'; ctx.font = '500 12px ' + FONT; ctx.textAlign = 'left'; ctx.fillText(L(el, 'formulaire'), gate.x + 10, gate.y + 20);
  FORM.forEach((f, k) => { ctx.fillStyle = '#5B5770'; ctx.font = '11px ' + FONT; ctx.fillText(f, gate.x + 10, gate.y + 42 + k * 24); ctx.fillStyle = '#E2DDF2'; rrect(ctx, gate.x + 10, gate.y + 46 + k * 24, gate.w - 20, 5, 2); ctx.fill(); });
  ctx.globalAlpha = 1;
  /* la liste des leads qualifiés */
  if (s3 > .1 && list.w > 60) {
    ctx.globalAlpha = ss(.1, .3, s3); ctx.fillStyle = C.brand; ctx.font = '600 13px ' + FONT; ctx.textAlign = 'left'; ctx.fillText(L(el, 'liste'), list.x, list.y + 14);
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(list.x, list.y + 22); ctx.lineTo(list.x + list.w, list.y + 22); ctx.stroke();
    listRows.forEach((rw) => { ctx.fillStyle = C.line; rrect(ctx, rw[0] + 14, rw[1] - 3, list.w * .5, 5, 2); ctx.fill(); ctx.strokeStyle = C.sig; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(list.x + list.w - 18, rw[1]); ctx.lineTo(list.x + list.w - 13, rw[1] + 4); ctx.lineTo(list.x + list.w - 5, rw[1] - 5); ctx.stroke(); });
    ctx.globalAlpha = 1;
  }
  if (s4 > 0 && list.w > 60) {
    const ey = list.y + 44 + passCount * (narrow ? 18 : 22) + 10;
    ctx.globalAlpha = s4; ctx.fillStyle = C.ink; ctx.font = '500 13px ' + FONT; ctx.fillText(L(el, 'transmis'), list.x, ey);
    ctx.strokeStyle = C.sig; ctx.lineWidth = 1.5; for (let rg = 0; rg < 2; rg++) { ctx.globalAlpha = s4 * (.6 - rg * .25) * (.6 + .4 * Math.sin(t * 5)); ctx.beginPath(); ctx.arc(list.x + list.w - 10, ey - 5, 6 + rg * 6, -.8, .8); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  if (!narrow) { const labs = LA(el, 'etapes'), at = [.1, .4, .66, .88], y0 = Math.min(h - 24, F.y + F.h + 60); labs.forEach((l, k) => { const on = p >= (at[k] ?? 1); label(ctx, l, F.x + k * Math.min(130, F.w / 3.2), y0, on ? 1 : .4, 'left', 15, on ? C.ink : C.ink3); }); }
};
export default target;
