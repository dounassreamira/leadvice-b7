/* Expertises : la boucle des quatre leviers qui se referme. */
import { C, FONT, glow, ss, LA, type SceneFn } from './util';

const loop: SceneFn = (ctx, w, h, p, t, _mini, el) => {
  const cx = w / 2, cy = h * .5, R = Math.min(w * .24, h * .3), fs = Math.round(Math.min(26, Math.max(16, w / 22)));
  const names = LA(el, 'leviers');
  const drawn = ss(.05, .85, p) * 6.283;
  ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
  ctx.strokeStyle = C.sig; ctx.lineWidth = 2; glow(ctx, true);
  ctx.beginPath(); ctx.arc(cx, cy, R, -1.5708, -1.5708 + drawn); ctx.stroke(); glow(ctx, false);
  const dotA = -1.5708 + drawn + (p > .85 ? (t * .8) % 6.283 : 0);
  ctx.fillStyle = C.sig; glow(ctx, true); ctx.beginPath(); ctx.arc(cx + Math.cos(dotA) * R, cy + Math.sin(dotA) * R, 6, 0, 6.283); ctx.fill(); glow(ctx, false);
  for (let i = 0; i < 4; i++) {
    const a = -1.5708 + i * 1.5708, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, reached = drawn >= i * 1.5708 - .01;
    ctx.fillStyle = reached ? C.brand : C.paper; ctx.strokeStyle = reached ? C.brand : C.ink3; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.283); ctx.fill(); ctx.stroke();
    const ox = Math.cos(a) * 22, oy = Math.sin(a) * 30 + 7;
    ctx.globalAlpha = reached ? 1 : .4; ctx.fillStyle = C.ink; ctx.font = '700 ' + fs + 'px ' + FONT; ctx.textAlign = i === 1 ? 'left' : i === 3 ? 'right' : 'center';
    ctx.fillText(names[i] ?? '', x + ox, y + oy); ctx.globalAlpha = 1;
  }
};
export default loop;
