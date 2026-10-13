/* Sites web : des blocs épars s'assemblent en page, le bouton s'allume, un visiteur clique, la demande arrive. */
import { C, FONT, glow, label, lerp, rnd, rrect, ss, L, LA, type SceneFn } from './util';

const B = [[.05, .06, .9, .05, 0], [.07, .2, .52, .075, 0], [.07, .3, .38, .075, 0], [.07, .43, .46, .024, 0], [.07, .48, .42, .024, 0], [.07, .53, .33, .024, 0], [.07, .63, .2, .085, 1], [.63, .2, .3, .5, 2], [.07, .8, .27, .12, 0], [.365, .8, .27, .12, 0], [.66, .8, .27, .12, 0]] as const;
const r = rnd(17), S = B.map(() => ({ x: r(), y: r(), a: (r() - .5) * 1.2, d: r() * .18 }));

const page: SceneFn = (ctx, w, h, p, t, mini, el) => {
  const wide = !mini && w > 900, fw = mini ? w * .86 : Math.min(w * (wide ? .5 : .84), 620), fh = fw * .64, mx = wide ? w * .62 : w / 2, fx = mx - fw / 2, fy = h * (mini ? .5 : wide ? .44 : .36) - fh / 2;
  const frameA = ss(.25, .5, p);
  ctx.globalAlpha = frameA; ctx.fillStyle = '#fff'; ctx.strokeStyle = C.line; ctx.lineWidth = 1;
  rrect(ctx, fx, fy - fh * .07, fw, fh * 1.07, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#E2DDF2'; for (let d = 0; d < 3; d++) { ctx.beginPath(); ctx.arc(fx + 14 + d * 12, fy - fh * .035, mini ? 2 : 3.5, 0, 6.283); ctx.fill(); }
  ctx.globalAlpha = 1;
  const lit = ss(.66, .76, p), click = ss(.8, .86, p), sent = ss(.86, .97, p);
  B.forEach((b, i) => {
    const s0 = S[i]!, k = ss(.12 + s0.d, .52 + s0.d * .8, p);
    const tx = fx + b[0] * fw, ty = fy + b[1] * fh, bw = b[2] * fw, bh = b[3] * fh;
    const x0 = s0.x * (w - bw), y0 = s0.y * (h - bh) + Math.sin(t * .8 + i) * 6 * (1 - k);
    const x = lerp(x0, tx, k), y = lerp(y0, ty, k), a = s0.a * (1 - k);
    ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.rotate(a);
    if (b[4] === 1) {
      ctx.fillStyle = lit > 0 ? 'rgba(' + Math.round(lerp(220, 123, lit)) + ',' + Math.round(lerp(214, 97, lit)) + ',' + Math.round(lerp(230, 255, lit)) + ',1)' : '#E2DDF2';
      glow(ctx, lit > .5); rrect(ctx, -bw / 2, -bh / 2, bw * (1 - click * .04), bh * (1 - click * .04), 3); ctx.fill(); glow(ctx, false);
      if (!mini && lit > .3) { ctx.globalAlpha = lit; ctx.fillStyle = '#fff'; ctx.font = '500 ' + Math.max(10, bh * .38) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.fillText(L(el, 'bouton'), 0, bh * .14); ctx.globalAlpha = 1; }
    } else if (b[4] === 2) {
      ctx.fillStyle = '#EFEBF8'; rrect(ctx, -bw / 2, -bh / 2, bw, bh, 3); ctx.fill();
      ctx.strokeStyle = '#B4A6FF'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-bw * .4, bh * .3); ctx.bezierCurveTo(-bw * .1, bh * .25, 0, -bh * .05, bw * .4, -bh * .32); ctx.stroke();
    } else {
      ctx.fillStyle = i === 1 || i === 2 ? '#301781' : i === 0 ? '#F1EEF6' : '#E6E1EE';
      if (i === 1 || i === 2) ctx.globalAlpha = lerp(.25, 1, k);
      rrect(ctx, -bw / 2, -bh / 2, bw, bh, 2); ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.restore();
  });
  const bt = B[6], bx = fx + (bt[0] + bt[2] / 2) * fw, by = fy + (bt[1] + bt[3] / 2) * fh;
  const cp = ss(.7, .82, p);
  if (cp > 0 && sent < 1) {
    const cxp = lerp(w * .92, bx + 6, cp), cyp = lerp(h * .95, by + 4, cp);
    ctx.globalAlpha = 1 - sent; ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(cxp, cyp); ctx.lineTo(cxp, cyp + 18); ctx.lineTo(cxp + 5, cyp + 14); ctx.lineTo(cxp + 12, cyp + 14); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  }
  if (click > 0 && click < 1) { ctx.strokeStyle = C.sig; ctx.globalAlpha = 1 - click; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, by, 10 + click * 40, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
  if (sent > 0) {
    const ex = fx + fw + (mini ? -fw * .2 : 24), ey = fy + fh * .2, dx = lerp(bx, ex, sent), dy = lerp(by, ey, sent) - Math.sin(sent * Math.PI) * 50;
    ctx.fillStyle = C.sig; glow(ctx, true); ctx.beginPath(); ctx.arc(dx, dy, mini ? 3 : 6, 0, 6.283); ctx.fill(); glow(ctx, false);
    if (!mini && sent > .9) {
      const ca = ss(.9, 1, sent), cw = 168, ch = 46, cx2 = Math.min(ex - 10, w - cw - 12), cy2 = ey - ch - 14;
      ctx.globalAlpha = ca; ctx.fillStyle = '#fff'; ctx.strokeStyle = C.sig; ctx.lineWidth = 1; rrect(ctx, cx2, cy2, cw, ch, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#301781'; ctx.font = '500 13px ' + FONT; ctx.textAlign = 'left'; ctx.fillText(L(el, 'demande'), cx2 + 14, cy2 + 20);
      ctx.fillStyle = '#5B5770'; ctx.font = '12px ' + FONT; ctx.fillText(L(el, 'demande_detail'), cx2 + 14, cy2 + 36); ctx.globalAlpha = 1;
    }
  }
  if (!mini) {
    const labs = LA(el, 'etapes'), at = [.3, .55, .82], ly = Math.min(h - 24, fy + fh + 56);
    labs.forEach((l, k) => { const on = p >= (at[k] ?? 1) - .06; label(ctx, l, mx + (k - 1) * Math.min(170, w * .28), ly, on ? 1 : .4, 'center', 16, on ? C.ink : C.ink3); });
  }
};
export default page;
