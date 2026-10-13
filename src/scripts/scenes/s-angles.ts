/* Création : une offre, trois angles, trois publics ; l'angle temps est retenu. */
import { C, FONT, glow, lerp, person, rrect, ss, wrapText, L, type Ctx, type SceneFn, type SceneHost } from './util';

interface Angle { k: string; hook: string; who: string; lit: number[]; bar: number }
const LIT = [[0, 2, 5], [1, 3, 4, 6], [2, 6]];
const BAR = [.5, .92, .66];
function angles(el: SceneHost): Angle[] {
  L(el, 'offre');
  const raw = el._labels?.angles as { k: string; hook: string; who: string }[] | undefined;
  return (raw ?? []).map((a, i) => ({ ...a, lit: LIT[i] ?? [], bar: BAR[i] ?? .5 }));
}
function icon(ctx: Ctx, i: number, x: number, y: number, s: number, col: string): void {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = Math.max(1.4, s * .07);
  if (i === 0) { ctx.beginPath(); ctx.moveTo(x - s * .45, y - s * .1); ctx.lineTo(x - s * .1, y - s * .45); ctx.lineTo(x + s * .45, y - s * .45); ctx.lineTo(x + s * .45, y + s * .1); ctx.lineTo(x + s * .1, y + s * .45); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(x + s * .2, y - s * .2, s * .08, 0, 6.283); ctx.fill(); }
  else if (i === 1) { ctx.beginPath(); ctx.arc(x, y, s * .45, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - s * .3); ctx.moveTo(x, y); ctx.lineTo(x + s * .22, y + s * .1); ctx.stroke(); }
  else { person(ctx, x - s * .22, y + s * .12, s * .5, col); person(ctx, x + s * .22, y + s * .02, s * .72, col); }
}
const scene: SceneFn = (ctx, w, h, p, _t, mini, el) => {
  if (mini) {
    const cx = w / 2, cy = h / 2, sp = ss(.1, .6, p);
    for (let m = 0; m < 3; m++) { const a = (m - 1) * .5 * sp, cw = w * .2, ch = h * .62; ctx.save(); ctx.translate(cx + (m - 1) * w * .22 * sp, cy); ctx.rotate(a * .3); ctx.fillStyle = m === 1 && p > .7 ? C.sig : '#fff'; ctx.strokeStyle = m === 1 && p > .7 ? C.sig : C.ink3; ctx.lineWidth = 1; rrect(ctx, -cw / 2, -ch / 2, cw, ch, 3); ctx.fill(); ctx.stroke(); ctx.restore(); }
    return;
  }
  const A = angles(el);
  const narrow = w < 720, wide = w > 1100;
  const mx = wide ? w * .62 : w / 2;
  const s1 = ss(.1, .34, p), s2 = ss(.28, .46, p), s3 = ss(.46, .7, p), s4 = ss(.72, .9, p);
  /* l'offre */
  const ow = narrow ? Math.min(w * .7, 260) : 250, oh = 58, ox = mx - ow / 2, oy = h * (narrow ? .09 : .08);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; rrect(ctx, ox, oy, ow, oh, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1E0F52'; ctx.textAlign = 'center'; ctx.font = '500 14px ' + FONT; ctx.fillText(L(el, 'offre'), mx, oy + 24);
  ctx.fillStyle = '#5B5770'; ctx.font = '13px ' + FONT; ctx.fillText(L(el, 'offre_sous'), mx, oy + 43);
  A.forEach((a, i) => {
    const win = i === 1, dim = s4 > 0 && !win ? 1 - s4 * .3 : 1;
    let pw: number, ph: number, px: number, py: number;
    if (narrow) { const rh = h * .17, rowY = h * .2 + i * (rh + h * .02); pw = rh * .62; ph = rh; px = w * .08; py = rowY; }
    else { const colW = Math.min(240, w * (wide ? .19 : .3)); ph = Math.min(220, h * .25); pw = ph * .64; px = mx + (i - 1) * colW - pw / 2; py = h * .24; }
    /* trajectoire depuis l'offre */
    const sx = mx - pw * .15, sy = oy + oh, cxp = lerp(sx, px, s1), cyp = lerp(sy, py, s1), sc = lerp(.2, 1, s1);
    if (s1 > 0) { ctx.globalAlpha = .55 * dim; ctx.strokeStyle = win && s4 > .3 ? C.sig : C.lav; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mx, oy + oh); ctx.bezierCurveTo(mx, oy + oh + 30, cxp + pw * sc / 2, cyp - 30, cxp + pw * sc / 2, cyp); ctx.stroke(); ctx.globalAlpha = 1; }
    if (s1 <= 0) return;
    ctx.save(); ctx.globalAlpha = dim; ctx.translate(cxp, cyp); ctx.scale(sc, sc);
    /* le téléphone et sa publicité */
    if (win && s4 > 0) { glow(ctx, true); ctx.strokeStyle = C.sig; ctx.lineWidth = 3; rrect(ctx, -4, -4, pw + 8, ph + 8, 12); ctx.stroke(); glow(ctx, false); }
    ctx.fillStyle = '#1E0F52'; rrect(ctx, 0, 0, pw, ph, 10); ctx.fill();
    ctx.fillStyle = '#fff'; rrect(ctx, 4, 6, pw - 8, ph - 12, 7); ctx.fill();
    const imgH = (ph - 12) * (narrow ? .78 : .5);
    ctx.fillStyle = i === 0 ? '#F1EEF6' : i === 1 ? '#EAE5FB' : '#EEF0F4'; rrect(ctx, 8, 10, pw - 16, imgH, 4); ctx.fill();
    icon(ctx, i, pw / 2, 10 + imgH / 2, Math.min(pw, imgH) * .42, win && s4 > .3 ? '#6B4EFF' : '#301781');
    if (!narrow) {
      ctx.fillStyle = '#E2DDF2'; for (let l = 0; l < 2; l++) { rrect(ctx, 10, 18 + imgH + l * 10, (pw - 20) * (l ? .6 : .9), 5, 2); ctx.fill(); }
      ctx.fillStyle = '#301781'; rrect(ctx, 10, 44 + imgH, pw - 20, 22, 3); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '500 11px ' + FONT; ctx.textAlign = 'center'; ctx.fillText(L(el, 'bouton_pub'), pw / 2, 59 + imgH);
      const bw = pw - 20, by = ph - 30;
      ctx.fillStyle = '#EFEDF3'; rrect(ctx, 10, by, bw, 8, 4); ctx.fill();
      if (s4 > 0) { ctx.fillStyle = win ? '#6B4EFF' : '#9C97B5'; rrect(ctx, 10, by, bw * a.bar * s4, 8, 4); ctx.fill(); }
    }
    ctx.restore();
    /* étiquette de l'angle */
    const lx = narrow ? px + pw + 16 : px + pw / 2, ly = narrow ? py + 18 : py - 14;
    ctx.globalAlpha = s1 * dim; ctx.fillStyle = win && s4 > .3 ? C.sig : C.brand; ctx.font = '600 13px ' + FONT; ctx.textAlign = narrow ? 'left' : 'center';
    ctx.fillText((win && s4 > .5 ? L(el, 'retenu') : L(el, 'angle')) + ' ' + a.k.toLowerCase(), lx, ly);
    /* l'accroche */
    ctx.globalAlpha = ss(i * .05, i * .05 + .5, s2) * dim; ctx.fillStyle = C.ink;
    ctx.font = '700 ' + (narrow ? 17 : 19) + 'px ' + FONT;
    const hy = narrow ? py + 42 : py + ph + 30;
    const endY = wrapText(ctx, '« ' + a.hook + ' »', lx, hy, narrow ? w - lx - 16 : Math.min(220, w * .18), narrow ? 20 : 22);
    /* le public : sept personnes, l'angle en touche certaines */
    const ay = narrow ? endY + 26 : endY + 40, gap = narrow ? 18 : 23, ax0 = narrow ? lx + 6 : lx - gap * 3;
    for (let q = 0; q < 7; q++) {
      const on = a.lit.indexOf(q) > -1, k = on ? ss(q * .06, q * .06 + .5, s3) : 0;
      const pc = k > .5 ? C.sig : C.ink3, xq = ax0 + q * gap;
      ctx.globalAlpha = ss(0, .3, s3) * dim; if (k > .5) glow(ctx, true); person(ctx, xq, ay, narrow ? 13 : 16, pc, ss(0, .3, s3) * dim); glow(ctx, false);
      if (on && k > 0 && k < 1) { ctx.globalAlpha = (1 - k) * dim; ctx.fillStyle = C.sig; ctx.beginPath(); ctx.arc(xq, ay - 14 - k * 26, 2.5, 0, 6.283); ctx.fill(); }
    }
    ctx.globalAlpha = ss(.5, 1, s3) * dim; ctx.fillStyle = C.ink; ctx.font = '500 13px ' + FONT; ctx.textAlign = narrow ? 'left' : 'center';
    ctx.fillText(L(el, 'parle') + ' ' + a.who.toLowerCase(), lx, ay + (narrow ? 22 : 26)); ctx.globalAlpha = 1;
  });
};
export default scene;
