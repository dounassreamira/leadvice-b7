/* Stratégie : le nœud de décision se résout ; un seul chemin reste, violet, jusqu'à la porte éclairée. */
import { C, glow, lerp, rnd, ss, type SceneFn } from './util';

let curves: { pts: number[][]; f: number }[] | null = null;
function init(): void {
  const r = rnd(11); curves = [];
  for (let i = 0; i < 14; i++) {
    const pts: number[][] = [];
    for (let j = 0; j < 4; j++) pts.push([.25 + r() * .5, .2 + r() * .6]);
    curves.push({ pts, f: .05 + r() * .4 });
  }
}
const knot: SceneFn = (ctx, w, h, p, t, mini) => {
  if (!curves) init();
  const A = [w * .08, h * .62] as const, B = [w * .9, h * .38] as const;
  const s = ss(.35, .8, p);
  ctx.lineCap = 'round';
  curves!.forEach((cv, i) => {
    const chosen = i === 0;
    const fade = chosen ? 1 : 1 - ss(cv.f + .2, cv.f + .45, p);
    if (fade <= 0) return;
    const q = cv.pts.map((pt, k) => {
      const wob = Math.sin(t * .7 + i + k) * 8 * (1 - s);
      let x = (pt[0] ?? 0) * w + wob, y = (pt[1] ?? 0) * h + wob;
      if (chosen) { const tx = lerp(A[0], B[0], (k + 1) / 5), ty = lerp(A[1], B[1], (k + 1) / 5) + Math.sin((k + 1) / 5 * 3.14) * -h * .08; x = lerp(x, tx, s); y = lerp(y, ty, s); }
      return [x, y] as [number, number];
    });
    ctx.globalAlpha = chosen ? 1 : .55 * fade;
    ctx.strokeStyle = chosen && p > .3 ? C.sig : C.ink3;
    ctx.lineWidth = chosen ? lerp(1.2, 2.4, s) : 1.1;
    glow(ctx, chosen && p > .3);
    const [q0, q1, q2, q3] = q as [[number, number], [number, number], [number, number], [number, number]];
    ctx.beginPath(); ctx.moveTo(A[0], A[1]);
    ctx.bezierCurveTo(q0[0], q0[1], q1[0], q1[1], (q1[0] + q2[0]) / 2, (q1[1] + q2[1]) / 2);
    ctx.bezierCurveTo(q2[0], q2[1], q3[0], q3[1], B[0], B[1]);
    ctx.stroke(); glow(ctx, false);
  });
  ctx.globalAlpha = 1;
  const d = ss(.75, .95, p), dw = mini ? 10 : 34, dh = mini ? 16 : 54;
  ctx.fillStyle = d > 0 ? 'rgba(123,97,255,' + (.15 + d * .85) + ')' : C.line;
  glow(ctx, d > .1);
  ctx.beginPath(); ctx.moveTo(B[0] - dw / 2, B[1] + dh / 2); ctx.lineTo(B[0] - dw / 2, B[1] - dh / 2 + dw / 2);
  ctx.arc(B[0], B[1] - dh / 2 + dw / 2, dw / 2, 3.14159, 0); ctx.lineTo(B[0] + dw / 2, B[1] + dh / 2); ctx.closePath(); ctx.fill(); glow(ctx, false);
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(A[0], A[1], mini ? 2.5 : 5, 0, 6.283); ctx.fill();
};
export default knot;
