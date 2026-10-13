/* Pilotage : l'aiguille monte, se corrige, puis se fixe dans la zone violette. */
import { C, glow, label, lerp, ss, LA, type SceneFn } from './util';

const dial: SceneFn = (ctx, w, h, p, t, mini, el) => {
  const cx = w * .5, cy = h * (mini ? .72 : .66), R = Math.min(w * .42, h * (mini ? .6 : .48));
  const a0 = Math.PI, a1 = 2 * Math.PI;
  ctx.lineCap = 'butt';
  for (let i = 0; i <= 40; i++) {
    const a = lerp(a0, a1, i / 40), long = i % 5 === 0;
    ctx.strokeStyle = i >= 30 && i <= 37 ? C.sig : C.ink3; ctx.lineWidth = long ? 2 : 1;
    glow(ctx, i >= 30 && i <= 37 && p > .8);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.lineTo(cx + Math.cos(a) * (R - (long ? R * .12 : R * .07)), cy + Math.sin(a) * (R - (long ? R * .12 : R * .07))); ctx.stroke();
  }
  glow(ctx, false);
  let v: number;
  if (p < .3) v = lerp(.15, .62, p / .3);
  else if (p < .45) v = lerp(.62, .48, (p - .3) / .15);
  else if (p < .65) v = lerp(.48, .9, ss(.45, .65, p));
  else v = lerp(.9, .84, ss(.65, .85, p));
  v += Math.sin(t * 3) * .006 * (1 - ss(.8, 1, p));
  const na = lerp(a0, a1, v);
  ctx.strokeStyle = v > .74 && v < .93 ? C.brand : C.ink; ctx.lineWidth = mini ? 1.6 : 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(na) * R * .82, cy + Math.sin(na) * R * .82); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, mini ? 3 : 7, 0, 6.283); ctx.fill();
  if (!mini) {
    const labs = LA(el, 'etapes');
    const at = [.25, .5, .75];
    labs.forEach((l, k) => { const on = p >= (at[k] ?? 1) - .08; label(ctx, l, cx + (k - 1) * R * .7, cy + 56, on ? 1 : .35, 'center', 16, on ? C.ink : C.ink3); });
  }
};
export default dial;
