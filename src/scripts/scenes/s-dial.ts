/* Pilotage : la feuille du point du lundi. Les chiffres se remplissent, la ligne qui ne vend pas ressort,
   une décision s'écrit à la main dans la marge, puis le budget se déplace. */
import { ss, lerp, L, LA, type SceneFn } from './util';
import { K, sheet, txt, bar, rr, handwrite, stage } from './obj';

const ROWS = [[64, 9, 0], [41, 14, 5], [38, 6, 1]];
const BUD0 = [.4, .3, .3], BUD1 = [0, .6, .4];

const dial: SceneFn = (ctx, w, h, p, t, mini, el) => {
  if (mini) {
    const s = Math.min(w, h), sw = s * .7, sh = s * .74, sx = w / 2 - sw / 2, sy = h / 2 - sh / 2;
    sheet(ctx, sx, sy, sw, sh, s * .04);
    bar(ctx, sx + sw * .1, sy + sh * .14, sw * .45, sh * .06, K.ink);
    for (let i = 0; i < 3; i++) {
      const y = sy + sh * (.36 + i * .2), hi = i === 0 && p > .3;
      if (hi) { ctx.fillStyle = 'rgba(255,122,89,.18)'; rr(ctx, sx + sw * .05, y - sh * .07, sw * .9, sh * .16, 2); ctx.fill(); }
      bar(ctx, sx + sw * .1, y - sh * .02, sw * .25, sh * .05, K.soft); bar(ctx, sx + sw * .5, y - sh * .02, sw * .35 * (i === 0 ? 1 - ss(.6, .9, p) : i === 1 ? .6 + .4 * ss(.6, .9, p) : .6), sh * .05, i === 0 ? K.coral : K.violet);
    }
    ctx.strokeStyle = K.coralInk; ctx.lineWidth = Math.max(1.2, s * .02); ctx.lineCap = 'round'; ctx.beginPath();
    const k = ss(.4, .8, p); for (let j = 0; j <= 20 * k; j++) { const x = sx + sw * (.1 + j * .04), y = sy + sh * .92 + Math.sin(j * 1.3) * sh * .025; if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
    return;
  }
  const { cx, cy, u } = stage(w, h), cols = LA(el, 'colonnes'), names = LA(el, 'annonces');
  const sw = Math.min(u * .92, 520), sh = sw * .78, sx = cx - sw / 2, sy = cy - sh / 2, fs = Math.max(12, sw * .034);
  sheet(ctx, sx, sy, sw, sh, 6);
  txt(ctx, L(el, 'titre'), sx + sw * .06, sy + sw * .085, fs * 1.55, K.ink, { serif: true });
  txt(ctx, L(el, 'semaine'), sx + sw * .94, sy + sw * .085, fs, K.grey, { align: 'right' });
  const X = [.06, .36, .52, .68, .82].map((v) => sx + sw * v), hy = sy + sw * .17;
  cols.forEach((c, i) => txt(ctx, c, X[i]!, hy, fs * .92, K.grey, { w: 600 }));
  bar(ctx, sx + sw * .06, hy + fs * .7, sw * .88, 1, K.line);
  const fillK = ss(.04, .3, p), flag = ss(.32, .44, p), write = ss(.48, .74, p), move = ss(.78, .94, p);
  ROWS.forEach((r, i) => {
    const y = hy + fs * 2.6 + i * fs * 2.7;
    if (i === 0 && flag > 0) { ctx.fillStyle = 'rgba(255,122,89,' + (.16 * flag) + ')'; rr(ctx, sx + sw * .04, y - fs * 1.5, sw * .92, fs * 2.3, 4); ctx.fill(); }
    txt(ctx, names[i] ?? '', X[0]!, y, fs, K.ink, { w: 600 });
    r.forEach((v, j) => txt(ctx, String(Math.round(v * fillK)), X[j + 1]!, y, fs * 1.05, i === 0 && j === 2 && flag > 0 ? K.coralInk : K.ink, { w: j === 2 ? 700 : 500 }));
    const bw = sw * .12 * lerp(BUD0[i]!, BUD1[i]!, move) / .4;
    ctx.fillStyle = i === 0 ? K.coral : K.violet; rr(ctx, X[4]!, y - fs * .75, Math.max(0, bw), fs * .8, fs * .3); ctx.fill();
    if (i === 0 && move > .5) bar(ctx, X[4]!, y - fs * .4, sw * .12 * (1 - move) + 2, 1.5, K.coralInk);
  });
  /* la décision, écrite dans la marge */
  const ny = hy + fs * 2.6 + 3 * fs * 2.7 + fs * .8;
  bar(ctx, sx + sw * .06, ny - fs * 1.2, sw * .88, 1, K.line, 1);
  handwrite(ctx, L(el, 'decision'), sx + sw * .06, ny + fs * .9, fs * 1.35, write);
  if (write > .1) {
    ctx.strokeStyle = K.coralInk; ctx.lineWidth = 1.4; ctx.setLineDash([3, 4]); ctx.globalAlpha = ss(.5, .6, p);
    ctx.beginPath(); ctx.moveTo(sx + sw * .97, ny - fs * .2); ctx.quadraticCurveTo(sx + sw * 1.06, hy + fs * 2, sx + sw * .97, hy + fs * 2.3); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
  }
  txt(ctx, L(el, 'exemple'), sx + sw * .94, sy + sh - fs * .9, fs * .8, K.soft, { align: 'right' });
  void t;
};
export default dial;
