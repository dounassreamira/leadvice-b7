/* Audit : un nuage de dépenses éparpillées ; une lentille passe dessus et remet chaque point à sa place.
   À la fin, tout est rangé en colonnes : ce qui rapporte s'allume, les fuites s'éteignent. */
import { C, glow, lerp, rnd, ss, type SceneFn } from './util';

interface Dot { sx: number; sy: number; col: number; row: number; ph: number }
let dots: Dot[] | null = null, dw = 0, dh = 0;
const COLS = 12, ROWS = 8, HOT = 7, LEAK = [2, 10];

function make(): Dot[] {
  const r = rnd(41), out: Dot[] = [];
  for (let c = 0; c < COLS; c++) {
    const n = 2 + Math.round(r() * (ROWS - 2)) + (c === HOT ? ROWS : 0);
    for (let k = 0; k < Math.min(ROWS, n); k++) out.push({ sx: r(), sy: r(), col: c, row: k, ph: r() * 6.283 });
  }
  return out;
}

const lens: SceneFn = (ctx, w, h, p, t, mini) => {
  if (!dots || dw !== w || dh !== h) { dots = make(); dw = w; dh = h; }
  const wide = w > 900;
  const x0 = wide ? w * .44 : w * .1, x1 = wide ? w * .92 : w * .9;
  const y0 = h * (mini ? .2 : .22), y1 = h * (mini ? .82 : .74);
  const step = (x1 - x0) / COLS, rowH = Math.min(step * .9, (y1 - y0) / (ROWS + 1));
  /* la lentille traverse le champ de gauche à droite, puis s'élargit à tout le tableau */
  const r0 = Math.min(w, h) * (mini ? .2 : .16);
  const sweep = ss(.1, .72, p), lx = lerp(x0 - r0, x1 + r0, sweep), ly = (y0 + y1) / 2;
  const R = r0;
  const sorted = ss(.74, .92, p);
  for (const d of dots) {
    const tx = x0 + (d.col + .5) * step, ty = y1 - (d.row + .5) * rowH;
    const fx = x0 + d.sx * (x1 - x0) + Math.sin(t * .7 + d.ph) * 6, fy = y0 + d.sy * (y1 - y0) + Math.cos(t * .6 + d.ph) * 6;
    /* derrière la lentille, chaque point a trouvé sa place ; dedans, il est en train de la trouver */
    const behind = ss(-R * .2, R * .7, lx - tx), inLens = 1 - ss(R * .6, R, Math.hypot(fx - lx, fy - ly));
    const k = Math.max(behind, inLens * .85, sorted);
    const x = lerp(fx, tx, k), y = lerp(fy, ty, k);
    const hot = d.col === HOT && k > .5, leak = LEAK.includes(d.col) && sorted > .3;
    ctx.globalAlpha = leak ? lerp(.9, .18, sorted) : .35 + .65 * k;
    ctx.fillStyle = hot ? C.sig : k > .5 ? C.brand : C.ink3;
    glow(ctx, hot && sorted > .2);
    ctx.beginPath(); ctx.arc(x, y, (mini ? 2.4 : 4) + (hot ? 1 : 0), 0, 6.283); ctx.fill();
  }
  glow(ctx, false);
  ctx.globalAlpha = 1;
  /* la lentille elle-même */
  if (p > .06 && p < .9) {
    ctx.globalAlpha = ss(.06, .14, p) * (1 - ss(.72, .86, p));
    ctx.strokeStyle = C.sig; ctx.lineWidth = mini ? 1.4 : 2; glow(ctx, true);
    ctx.beginPath(); ctx.arc(lx, ly, R, 0, 6.283); ctx.stroke();
    glow(ctx, false); ctx.globalAlpha = 1;
  }
  /* la ligne de base du tableau rangé */
  ctx.globalAlpha = ss(.1, .4, p); ctx.strokeStyle = C.line; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, y1 + 4); ctx.lineTo(x1, y1 + 4); ctx.stroke(); ctx.globalAlpha = 1;
};
export default lens;
