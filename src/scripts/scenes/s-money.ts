/* Le chemin d'un dirham : des billets entrent dans la publicité, deviennent des personnes, les bonnes deviennent
   clientes, les clients font tomber des pièces, et plus de billets reviennent. */
import { C, FONT, clamp, glow, label, lerp, ss, LA, type Ctx, type SceneFn } from './util';

const GOLD = ['#FBEFC4', '#E2C066', '#B8892F', '#8F6A22'], NOTE = ['#EEF4EA', '#D3E3CF', '#5E8A69'];
function hash(n: number): number { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
function note(ctx: Ctx, x: number, y: number, rot: number, sc: number, a: number, glowOn: boolean, cur: string): void {
  const w = 64 * sc, h = 32 * sc; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot);
  if (glowOn) { ctx.shadowColor = 'rgba(123,97,255,.55)'; ctx.shadowBlur = 14; } else { ctx.shadowColor = 'rgba(20,18,26,.18)'; ctx.shadowBlur = 6 * sc; ctx.shadowOffsetY = 2 * sc; }
  const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, NOTE[0]!); g.addColorStop(1, NOTE[1]!);
  ctx.fillStyle = g; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, 3 * sc); else ctx.rect(-w / 2, -h / 2, w, h); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.shadowOffsetY = 0; ctx.strokeStyle = NOTE[2]!; ctx.lineWidth = Math.max(.6, .9 * sc);
  ctx.strokeRect(-w / 2 + 3 * sc, -h / 2 + 3 * sc, w - 6 * sc, h - 6 * sc);
  ctx.beginPath(); ctx.arc(-w * .26, 0, h * .26, 0, 6.283); ctx.stroke();
  ctx.fillStyle = NOTE[2]!; ctx.font = '600 ' + Math.max(6, 9 * sc) + 'px ' + FONT; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(cur, w / 2 - 6 * sc, 1);
  ctx.restore();
}
function coin(ctx: Ctx, x: number, y: number, sc: number, a: number, tilt: number, shine: number): void {
  const r = 11 * sc, ry = r * tilt; ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = GOLD[3]!; ctx.beginPath(); ctx.ellipse(x, y + 2.2 * sc * tilt, r, ry, 0, 0, 6.283); ctx.fill();
  const g = ctx.createRadialGradient(x - r * .35, y - ry * .4, r * .1, x, y, r); g.addColorStop(0, GOLD[0]!); g.addColorStop(.55, GOLD[1]!); g.addColorStop(1, GOLD[2]!);
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, ry, 0, 0, 6.283); ctx.fill();
  ctx.strokeStyle = 'rgba(143,106,34,.75)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(x, y, r * .72, ry * .72, 0, 0, 6.283); ctx.stroke();
  if (shine > 0) { ctx.globalAlpha = a * shine; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x - r * .3, y - ry * .35, r * .22, ry * .12, -.5, 0, 6.283); ctx.fill(); }
  ctx.restore();
}
function person(ctx: Ctx, x: number, y: number, sc: number, col: string, a: number, gl: boolean): void {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; if (gl) { ctx.shadowColor = 'rgba(123,97,255,.85)'; ctx.shadowBlur = 12; }
  ctx.beginPath(); ctx.arc(x, y - 5 * sc, 3.6 * sc, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + 4 * sc, 6 * sc, 4.6 * sc, 0, 3.1416, 6.283); ctx.fill(); ctx.restore();
}
function bez(a: number[], c: number[], b: number[], t: number): [number, number] { const u = 1 - t; return [u * u * a[0]! + 2 * u * t * c[0]! + t * t * b[0]!, u * u * a[1]! + 2 * u * t * c[1]! + t * t * b[1]!]; }

const money: SceneFn = (ctx, w, h, p0, t, mini, el) => {
  let p = p0;
  if (el.hasAttribute('data-loop')) { const cyc = (t % 10) / 8.6; p = t === 0 ? 1 : cyc > 1 ? 1 : cyc; }
  const f = el._flow ?? { lead: .45, client: .14, ret: 3.2 };
  const cur = LA(el, 'devise')[0] ?? 'MAD';
  const portrait = h > w * .9, sc = Math.max(.62, Math.min(1.25, Math.min(w / 1100, h / 640))) * (mini ? .7 : 1);
  const P = (u: number, v: number): [number, number] => portrait ? [w * .5 + v * w * .32, lerp(h * .26, h * .72, u)] : [lerp(w * .07, w * .93, u), h * .56 + v * h * .2];
  const U = [0, .3, .62, .92], LB = el._stage ?? LA(el, 'etapes');
  const NN = 12, PER = 6, TOT = NN * PER, NS = Math.max(3, Math.min(24, Math.round(TOT * Math.max(.04, Math.min(.5, f.client * (f.lead / .45)))))), NR = Math.max(6, Math.min(34, Math.round(NN * f.ret / 2))), NC = Math.max(10, Math.min(72, Math.round(NR * 2.2)));
  /* rail discret */
  ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.setLineDash([3, 6]); ctx.beginPath(); const a0 = P(0, 0), a1 = P(1, 0); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke(); ctx.setLineDash([]);
  /* téléphone (la publicité) */
  const ph = P(U[1]!, 0), pw = 66 * sc, phh = 120 * sc, recv = ss(.04, .08, p) * (1 - ss(.3, .36, p));
  ctx.save(); ctx.translate(ph[0], ph[1] + Math.sin(t * 1.4) * 2);
  if (recv > 0) { ctx.shadowColor = 'rgba(123,97,255,.7)'; ctx.shadowBlur = 30 * recv; }
  ctx.fillStyle = '#1E0F52'; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-pw / 2, -phh / 2, pw, phh, 12 * sc); else ctx.rect(-pw / 2, -phh / 2, pw, phh); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#F1EEF8'; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-pw / 2 + 4 * sc, -phh / 2 + 10 * sc, pw - 8 * sc, phh - 20 * sc, 6 * sc); else ctx.rect(-pw / 2 + 4 * sc, -phh / 2 + 10 * sc, pw - 8 * sc, phh - 20 * sc); ctx.fill();
  for (let k = 0; k < 3; k++) { const yy = -phh / 2 + 18 * sc + k * 32 * sc, on = (Math.floor(t * 2) % 3) === k && p > .05 && p < .4; ctx.fillStyle = on ? '#6B4EFF' : '#DCD6E6'; ctx.fillRect(-pw / 2 + 10 * sc, yy, pw - 20 * sc, 22 * sc); }
  ctx.restore();
  /* billets qui partent du budget */
  const bud = P(U[0]!, 0);
  for (let i = NN - 1; i >= 0; i--) {
    const ti = .03 + i * .015, fl = clamp((p - ti) / .1, 0, 1);
    const st = [bud[0], bud[1] - i * 3.2 * sc];
    if (fl <= 0) { note(ctx, st[0]!, st[1]!, -.04 + hash(i) * .08, sc, 1, false, cur); continue; }
    if (fl >= 1) continue;
    const ctrl = portrait ? [w * .5 + w * .36, (st[1]! + ph[1]) / 2] : [(st[0]! + ph[0]) / 2, Math.min(st[1]!, ph[1]) - h * .22];
    const q = bez(st, ctrl, ph, ss(0, 1, fl)); note(ctx, q[0], q[1], fl * 6.3 * (hash(i + 3) > .5 ? 1 : -1), sc * (1 - fl * .55), 1 - ss(.85, 1, fl), false, cur);
  }
  /* personnes qui sortent de la publicité */
  const clientPos = P(U[2]!, 0);
  let sIdx = 0;
  for (let n = 0; n < TOT; n++) {
    const ni = Math.floor(n / PER), m = n % PER, s0 = .03 + ni * .015 + .1 + m * .006, g = clamp((p - s0) / .24, 0, 1);
    if (g <= 0) continue;
    const surv = hash(n + 11) < NS / TOT, vStart = (hash(n + 5) - .5) * 1.8, uu = lerp(U[1]! + .03, U[2]!, ss(0, 1, g));
    const vv = lerp(vStart, vStart * .25, g);
    let pos = P(uu, vv), a = 1;
    if (!surv && g > .55) { const fall = (g - .55) / .45; a = 1 - fall; if (portrait) pos[0] += fall * fall * 70 * (vStart > 0 ? 1 : -1); else pos[1] += fall * fall * 90; }
    if (surv) {
      const idx = sIdx++, cols = Math.ceil(NS / 3), cx2 = idx % cols, cy2 = Math.floor(idx / cols);
      const slot = portrait ? [clientPos[0] + (cx2 - (cols - 1) / 2) * 20 * sc, clientPos[1] + (cy2 - 1) * 22 * sc] : [clientPos[0] + (cy2 - 1) * 22 * sc, clientPos[1] + (cx2 - (cols - 1) / 2) * 20 * sc];
      const gg = ss(.75, 1, g); pos = [lerp(pos[0], slot[0]!, gg), lerp(pos[1], slot[1]!, gg)];
      person(ctx, pos[0], pos[1], sc * 1.15, g > .6 ? C.sig : C.ink2, 1, g > .8); continue;
    }
    if (a > 0) person(ctx, pos[0], pos[1], sc, C.ink3, a * .85, false);
  }
  /* pièces qui tombent des clients vers la pile */
  const pile = P(U[3]!, 0), colsP = portrait ? 5 : 4;
  for (let c = 0; c < NC; c++) {
    const c0 = .56 + c * (.22 / NC), cf = clamp((p - c0) / .09, 0, 1); if (cf <= 0) continue;
    const colI = c % colsP, row = Math.floor(c / colsP), dest = [pile[0] + (colI - (colsP - 1) / 2) * 24 * sc, pile[1] + 30 * sc - row * 5.5 * sc];
    const srcIdx = c % NS, src = [clientPos[0] + (hash(srcIdx) - .5) * 40 * sc, clientPos[1] + (hash(srcIdx + 9) - .5) * 40 * sc];
    if (cf < 1) { const ctl = portrait ? [src[0]! + w * .25, (src[1]! + dest[1]!) / 2] : [(src[0]! + dest[0]!) / 2, Math.min(src[1]!, dest[1]!) - h * .25]; const cp = bez(src, ctl, dest, ss(0, 1, cf)); coin(ctx, cp[0], cp[1], sc, 1, .35 + .65 * Math.abs(Math.cos(cf * 9 + c)), .8); }
    else { coin(ctx, dest[0]!, dest[1]!, sc, 1, .42, .4 + .4 * Math.sin(t * 3 + c)); if (p - c0 - .09 < .03) { ctx.fillStyle = C.sig; glow(ctx, true); ctx.globalAlpha = 1 - (p - c0 - .09) / .03; ctx.beginPath(); ctx.arc(dest[0]! + 10 * sc, dest[1]! - 10 * sc, 2.4 * sc, 0, 6.283); ctx.fill(); glow(ctx, false); ctx.globalAlpha = 1; } }
  }
  /* les billets reviennent, plus nombreux */
  const topPile = [pile[0], pile[1] + 30 * sc - Math.ceil(NC / colsP) * 5.5 * sc];
  for (let r = 0; r < NR; r++) {
    const r0 = .8 + r * (.14 / NR), rf = clamp((p - r0) / .1, 0, 1); if (rf <= 0) continue;
    const dst = [bud[0], bud[1] - r * 3.2 * sc];
    if (rf < 1) { const ctl2 = portrait ? [w * .08, (topPile[1]! + dst[1]!) / 2] : [(topPile[0]! + dst[0]!) / 2, Math.min(topPile[1]!, dst[1]!) - h * .42]; const rp = bez(topPile, ctl2, dst, ss(0, 1, rf)); note(ctx, rp[0], rp[1], Math.sin(rf * 6 + r) * .6, sc * .9, 1, true, cur); }
    else note(ctx, dst[0]! + (hash(r) - .5) * 3, dst[1]!, -.04 + hash(r + 7) * .08, sc, 1, r === NR - 1 && p < .999, cur);
  }
  if (p > .8) { ctx.strokeStyle = 'rgba(123,97,255,' + (.35 * ss(.8, .9, p)) + ')'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 10]); ctx.lineDashOffset = -t * 30; ctx.beginPath(); const ctl3 = portrait ? [w * .08, (topPile[1]! + bud[1]) / 2] : [(topPile[0]! + bud[0]) / 2, Math.min(topPile[1]!, bud[1]) - h * .42]; ctx.moveTo(topPile[0]!, topPile[1]!); ctx.quadraticCurveTo(ctl3[0]!, ctl3[1]!, bud[0], bud[1] - NR * 3.2 * sc); ctx.stroke(); ctx.setLineDash([]); }
  if (!mini) {
    const vis = [1, ss(.04, .1, p), ss(.3, .4, p), ss(.56, .62, p)];
    for (let k = 0; k < 4; k++) {
      const txt = LB[k] ?? '', col = k === 3 ? '#8F6A22' : k === 2 ? C.brand : C.ink2, va = Math.max(.3, vis[k] ?? 1);
      if (portrait) label(ctx, txt, 16, P(U[k]!, 0)[1] - 46 * sc, va, 'left', 13, col);
      else { const lp = P(U[k]!, 1.05); label(ctx, txt, lp[0], lp[1] + 40 * sc, va, 'center', 15, col); }
    }
  }
};
export default money;
