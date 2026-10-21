/* Acquisition : l'annonce dans le fil, le toucher, le formulaire à trois questions qui se remplit,
   puis chaque demande devient une fiche qui tombe dans la bonne pile : qualifiée, ou à relancer. */
import { ss, lerp, L, LA, type SceneFn } from './util';
import { K, phone, rr, bar, txt, para, sheet, tap, stage } from './obj';

const ROUTE = [0, 1, 0, 0, 1, 0, 0]; // 0 : qualifié, 1 : à relancer

const target: SceneFn = (ctx, w, h, p, _t, mini, el) => {
  if (mini) {
    const s = Math.min(w, h), bw = s * .34, bh = s * .2, x0 = w * .5 - bw * 1.15, x1 = w * .5 + bw * .15, base = h * .82;
    [x0, x1].forEach((x, j) => { const n = j === 0 ? 1 + Math.floor(p * 3.99) : 1 + Math.floor(p * 1.99); for (let i = 0; i < n; i++) sheet(ctx, x, base - bh - i * bh * .28, bw, bh, 2); bar(ctx, x + bw * .12, base - bh * .62 - (n - 1) * bh * .28, bw * .5, bh * .16, j === 0 ? K.violet : K.soft); });
    const k = (p * 4) % 1, x = lerp(w * .5 - bw * .5, x0, k), y = lerp(h * .08, base - bh * 2.4, k);
    sheet(ctx, x, y, bw, bh, 2, 1 - ss(.85, 1, k)); bar(ctx, x + bw * .12, y + bh * .38, bw * .5, bh * .16, K.coral, 1 - ss(.85, 1, k));
    return;
  }
  const { wide, cx, cy, u } = stage(w, h), C = LA(el, 'champs'), V = LA(el, 'valeurs');
  const pw = Math.min(u * .36, 220), px = wide ? cx - u * .28 : w * .3, scr = phone(ctx, px, cy, pw);
  const form = ss(.24, .32, p), sent = ss(.52, .58, p);
  ctx.save(); ctx.beginPath(); ctx.rect(scr.x, scr.y, scr.w, scr.h); ctx.clip();
  /* écran 1 : l'annonce */
  if (form < 1) {
    ctx.globalAlpha = 1 - form;
    const ax = scr.x + scr.w * .05, aw = scr.w * .9, ay = scr.y + scr.h * .05;
    ctx.fillStyle = K.paper; rr(ctx, ax, ay, aw, scr.h * .72, 4); ctx.fill();
    ctx.fillStyle = K.violet; ctx.beginPath(); ctx.arc(ax + aw * .09, ay + aw * .09, aw * .045, 0, 6.283); ctx.fill();
    bar(ctx, ax + aw * .18, ay + aw * .07, aw * .4, aw * .04, K.line);
    const g = ctx.createLinearGradient(ax, ay, ax + aw, ay + aw); g.addColorStop(0, '#301781'); g.addColorStop(1, '#7B61FF');
    ctx.fillStyle = g; rr(ctx, ax + aw * .04, ay + aw * .18, aw * .92, aw * .7, 3); ctx.fill();
    txt(ctx, L(el, 'annonce'), ax + aw * .1, ay + aw * .5, Math.max(11, aw * .08), '#fff', { serif: true, max: aw * .8 });
    ctx.fillStyle = K.tint; rr(ctx, ax + aw * .04, ay + aw * .95, aw * .92, aw * .15, 3); ctx.fill();
    txt(ctx, L(el, 'bouton_annonce'), ax + aw * .1, ay + aw * 1.05, Math.max(10, aw * .06), K.brand, { w: 700 });
    ctx.globalAlpha = 1;
  }
  /* écran 2 : le formulaire */
  if (form > 0) {
    ctx.globalAlpha = form;
    const fx = scr.x + scr.w * .08, fw = scr.w * .84, fs = Math.max(10, fw * .062);
    txt(ctx, L(el, 'formulaire'), fx, scr.y + scr.h * .1, fs * 1.4, K.ink, { serif: true, max: fw });
    C.forEach((c, i) => {
      const y = scr.y + scr.h * (.2 + i * .19), fill = ss(.32 + i * .06, .38 + i * .06, p), v = V[i] ?? '';
      txt(ctx, c, fx, y, fs, K.grey);
      ctx.fillStyle = K.paper; ctx.strokeStyle = fill > 0 && fill < 1 ? K.violet : K.line; ctx.lineWidth = 1; rr(ctx, fx, y + fs * .5, fw, fs * 2.3, 4); ctx.fill(); ctx.stroke();
      txt(ctx, v.slice(0, Math.round(v.length * fill)), fx + fs * .6, y + fs * 2.05, fs * 1.05, K.ink, { max: fw * .9 });
    });
    const by = scr.y + scr.h * .8;
    ctx.fillStyle = sent > 0 ? K.violet : K.coral; rr(ctx, fx, by, fw, fs * 2.6, 6); ctx.fill();
    txt(ctx, L(el, 'envoyer'), fx + fw / 2, by + fs * 1.7, fs * 1.05, sent > 0 ? '#fff' : K.ink, { align: 'center', w: 700 });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  tap(ctx, scr.x + scr.w * .5, scr.y + scr.h * .05 + scr.w * .95 * 1.05, ss(.18, .26, p), pw * .25);
  tap(ctx, scr.x + scr.w * .5, scr.y + scr.h * .8 + pw * .08, ss(.5, .58, p), pw * .25);
  /* les deux piles */
  const cw = Math.min(wide ? u * .3 : w * .3, 180), ch = cw * .42, gx = wide ? cx + u * .1 : w * .58, py = cy + pw * .55;
  const pile = [{ x: gx, lab: L(el, 'qualifie'), sub: L(el, 'transmis'), col: K.violet }, { x: gx + cw + (wide ? 28 : 12), lab: L(el, 'relance'), sub: L(el, 'relance_sub'), col: K.soft }];
  if (!wide) { pile[0]!.x = w * .62; pile[1]!.x = w * .62; }
  const pileY = (j: number): number => wide ? py : (j === 0 ? cy - pw * .25 : cy + pw * .7);
  const landed = [0, 0];
  ROUTE.forEach((dst, i) => {
    const s0 = .56 + i * .055, k = ss(s0, s0 + .08, p);
    if (k <= 0) return;
    const P = pile[dst]!, x0 = scr.x + scr.w * .1, y0 = scr.y + scr.h * .5, x1 = P.x, y1 = pileY(dst) - ch - landed[dst]! * ch * .22;
    const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 60;
    if (k >= 1) landed[dst]!++;
    sheet(ctx, x, y, cw, ch, 4);
    ctx.fillStyle = dst === 0 ? K.violet : K.soft; ctx.beginPath(); ctx.arc(x + ch * .32, y + ch * .4, ch * .14, 0, 6.283); ctx.fill();
    bar(ctx, x + ch * .58, y + ch * .3, cw * .45, ch * .14, K.ink); bar(ctx, x + ch * .58, y + ch * .58, cw * .3, ch * .12, K.line);
    if (k >= 1 && dst === 0) txt(ctx, L(el, 'tag_q'), x + cw - 8, y + ch * .45, Math.max(10, ch * .2), K.brand, { align: 'right', w: 700 });
  });
  const lab = ss(.56, .62, p);
  pile.forEach((P, j) => {
    const y = pileY(j);
    txt(ctx, P.lab + ' : ' + landed[j], P.x, y + 24, Math.max(15, cw * .1), K.ink, { serif: true, a: lab });
    if (wide) para(ctx, P.sub, P.x, y + 44, cw, Math.max(12, cw * .075), K.grey, { a: lab });
  });
};
void 0;
export default target;
