/* Sites web : la page se monte bloc par bloc dans un navigateur, le temps de chargement mobile descend
   de 6,4 s à 1,2 s pendant que l'image s'allège, puis un visiteur touche le bouton et la demande arrive. */
import { ss, lerp, L, type SceneFn } from './util';
import { K, sheet, rr, bar, txt, tap, stage } from './obj';

const page: SceneFn = (ctx, w, h, p, t, mini, el) => {
  const { cx, cy, u } = stage(w, h);
  const fw = mini ? Math.min(w, h) * .8 : Math.min(u * .95, 560), fh = fw * .7, fx = (mini ? w / 2 : cx) - fw / 2, fy = (mini ? h / 2 : cy) - fh / 2;
  sheet(ctx, fx, fy, fw, fh, mini ? 3 : 8);
  ctx.fillStyle = K.tint; rr(ctx, fx + 1, fy + 1, fw - 2, fh * .08, mini ? 3 : 8); ctx.fill();
  [0, 1, 2].forEach((d) => { ctx.fillStyle = K.line; ctx.beginPath(); ctx.arc(fx + fw * (.03 + d * .025), fy + fh * .04, fw * .008 + .5, 0, 6.283); ctx.fill(); });
  const B: [number, number, number, number, number][] = [ // x, y, w, h, type (0 texte sombre, 1 texte clair, 2 bouton, 3 image)
    [.06, .14, .2, .05, 1], [.06, .26, .5, .08, 0], [.06, .37, .42, .08, 0], [.06, .5, .46, .035, 1], [.06, .56, .38, .035, 1], [.06, .68, .26, .1, 2], [.6, .24, .34, .58, 3],
  ];
  const light = ss(.48, .74, p), click = ss(.8, .88, p), sent = ss(.88, .98, p);
  B.forEach((b, i) => {
    const k = ss(.04 + i * .05, .16 + i * .05, p), x = fx + b[0] * fw, y = fy + b[1] * fh - (1 - k) * fh * .12, bw = b[2] * fw, bh = b[3] * fh;
    if (k <= 0) return;
    ctx.globalAlpha = k;
    if (b[4] === 3) {
      const sc = lerp(1, .82, light), iw = bw * sc, ih = bh * sc, ix = x + (bw - iw) / 2, iy = y + (bh - ih) / 2;
      ctx.fillStyle = lerp(0, 1, light) > .5 ? '#E8E3F8' : '#D8D2EA'; rr(ctx, ix, iy, iw, ih, 4); ctx.fill();
      if (light < 1) { ctx.save(); ctx.globalAlpha = k * (1 - light) * .6; ctx.strokeStyle = '#B9B1D3'; ctx.lineWidth = 1; rr(ctx, ix, iy, iw, ih, 4); ctx.clip(); for (let d = -ih; d < iw; d += 8) { ctx.beginPath(); ctx.moveTo(ix + d, iy + ih); ctx.lineTo(ix + d + ih, iy); ctx.stroke(); } ctx.restore(); }
    } else if (b[4] === 2) {
      ctx.fillStyle = sent > 0 ? K.violet : K.coral; rr(ctx, x, y, bw * (1 - click * .04), bh, bh * .3); ctx.fill();
      if (!mini) txt(ctx, L(el, 'bouton'), x + bw / 2, y + bh * .65, Math.max(11, bh * .38), sent > 0 ? '#fff' : K.ink, { align: 'center', w: 700 });
    } else bar(ctx, x, y, bw, bh, b[4] === 0 ? K.ink : K.line);
    ctx.globalAlpha = 1;
  });
  if (mini) return;
  /* le temps de chargement sur mobile */
  const a = ss(.42, .5, p), sec = lerp(parseFloat(L(el, 'avant') || '6.4'), parseFloat(L(el, 'apres') || '1.2'), light);
  const chx = fx, chy = fy - fh * .16;
  sheet(ctx, chx, chy, fw * .3, fh * .12, 6, a);
  txt(ctx, L(el, 'chargement'), chx + fw * .02, chy + fh * .05, Math.max(10, fw * .022), K.grey, { a });
  txt(ctx, sec.toFixed(1).replace('.', ',') + ' s', chx + fw * .02, chy + fh * .1, Math.max(13, fw * .034), light >= 1 ? K.brand : K.coralInk, { a, w: 700 });
  bar(ctx, chx + fw * .16, chy + fh * .075, fw * .12, fh * .02, K.line, a); bar(ctx, chx + fw * .16, chy + fh * .075, fw * .12 * (sec / 6.4), fh * .02, light >= 1 ? K.violet : K.coral, a);
  /* le toucher, puis la demande */
  const bt = B[5]!, bx = fx + (bt[0] + bt[2] / 2) * fw, by = fy + (bt[1] + bt[3] / 2) * fh;
  tap(ctx, bx, by, click, fw * .08);
  if (sent > 0) {
    const cw = Math.min(220, fw * .42), ch = cw * .32, x = lerp(bx, fx + fw - cw * .6, sent), y = lerp(by, fy + fh + ch * .4, sent);
    sheet(ctx, x, y, cw, ch, 6, sent);
    ctx.globalAlpha = sent; ctx.fillStyle = K.coral; ctx.beginPath(); ctx.arc(x + ch * .42, y + ch / 2, ch * .16, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    txt(ctx, L(el, 'demande'), x + ch * .8, y + ch * .44, Math.max(12, cw * .065), K.ink, { w: 700, a: sent });
    txt(ctx, L(el, 'demande_detail'), x + ch * .8, y + ch * .74, Math.max(11, cw * .055), K.grey, { a: sent });
  }
  void t;
};
export default page;
