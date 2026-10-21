/* Stratégie : des post-it en vrac (toutes les idées du moment) ; la plupart tombent, trois deviennent
   les lignes numérotées d'un plan, chacune avec un responsable et une échéance. */
import { ss, lerp, rnd, LA, L, type SceneFn } from './util';
import { K, sheet, txt, bar, rr, stage, handwrite } from './obj';

const r = rnd(41), SEED = Array.from({ length: 12 }, () => ({ x: r(), y: r(), a: (r() - .5) * .5, d: r() * .12, c: r() < .65 }));
const KEEP = [2, 6, 9];

const knot: SceneFn = (ctx, w, h, p, t, mini, el) => {
  if (mini) {
    const s = Math.min(w, h), cx = w / 2, cy = h / 2, sw = s * .56, sh = s * .7, sx = cx - sw / 2, sy = cy - sh / 2;
    const k = ss(.3, .75, p);
    sheet(ctx, sx, sy, sw, sh, s * .04, .4 + .6 * k);
    for (let i = 0; i < 3; i++) {
      const y = sy + sh * (.3 + i * .22);
      ctx.fillStyle = i === 0 ? K.coral : K.violet; ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(sx + sw * .18, y, s * .03, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
      bar(ctx, sx + sw * .3, y - s * .02, sw * (.55 - i * .08) * k, s * .04, i === 0 ? K.ink : K.soft);
    }
    for (let i = 0; i < 6; i++) {
      const q = SEED[i]!, a = 1 - k, x = q.x * (w - s * .22), y = q.y * (h - s * .2) + k * s * .2;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x + s * .1, y + s * .08); ctx.rotate(q.a);
      ctx.fillStyle = q.c ? K.note : K.noteB; rr(ctx, -s * .1, -s * .08, s * .2, s * .16, 2); ctx.fill(); ctx.restore();
    }
    return;
  }
  const { wide, cx, cy, u } = stage(w, h), notes = LA(el, 'notes'), keep = LA(el, 'retenues'), who = LA(el, 'details');
  const sw = Math.min(u * .78, 440), sh = sw * 1.12, sx = cx - sw / 2, sy = cy - sh / 2, nw = Math.max(86, sw * .3), nh = nw * .62;
  const appear = ss(.3, .48, p);
  sheet(ctx, sx, sy, sw, sh, 6, appear);
  txt(ctx, L(el, 'plan'), sx + sw * .08, sy + sw * .12, Math.max(15, sw * .052), K.ink, { serif: true, a: appear });
  bar(ctx, sx + sw * .08, sy + sw * .16, sw * .84, 1, K.line, appear);
  const line = (i: number): number => sy + sw * (.3 + i * .21);
  /* les post-it */
  const area = wide ? { x0: w * .3, x1: w * .96, y0: h * .1, y1: h * .78 } : { x0: w * .04, x1: w * .96, y0: h * .12, y1: h * .66 };
  SEED.forEach((q, i) => {
    const ki = KEEP.indexOf(i), label = ki >= 0 ? keep[ki] ?? '' : notes[i - KEEP.filter((k) => k < i).length] ?? '';
    const x0 = lerp(area.x0, area.x1 - nw, q.x) + Math.sin(t * .7 + i) * 3, y0 = lerp(area.y0, area.y1 - nh, q.y) + Math.cos(t * .6 + i) * 3;
    let x = x0, y = y0, a = 1, rot = q.a, sc = 1;
    if (ki >= 0) {
      const k = ss(.36 + ki * .06, .6 + ki * .06, p);
      x = lerp(x0, sx + sw * .14, k); y = lerp(y0, line(ki) - nh * .55, k); rot = lerp(q.a, 0, k); sc = lerp(1, .9, k); a = 1 - ss(.55 + ki * .06, .66 + ki * .06, p);
    } else {
      const k = ss(.3 + q.d, .5 + q.d, p);
      y = y0 + k * h * .25; a = 1 - k; rot = q.a + k * .6;
    }
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x + nw / 2, y + nh / 2); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.shadowColor = 'rgba(30,15,82,.12)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
    ctx.fillStyle = q.c ? K.note : K.noteB; rr(ctx, -nw / 2, -nh / 2, nw, nh, 2); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x + nw / 2, y + nh / 2); ctx.rotate(rot); ctx.scale(sc, sc);
    ctx.font = '500 ' + Math.max(11, nw * .12) + 'px "Hanken Grotesk", system-ui, sans-serif'; ctx.fillStyle = K.ink; ctx.textAlign = 'center';
    const words = label.split(' '); let l1 = '', l2 = '';
    for (const wd of words) { if (ctx.measureText((l1 ? l1 + ' ' : '') + wd).width < nw * .84 && !l2) l1 += (l1 ? ' ' : '') + wd; else l2 += (l2 ? ' ' : '') + wd; }
    ctx.fillText(l1, 0, l2 ? -2 : nh * .08); if (l2) ctx.fillText(l2, 0, nw * .14);
    ctx.restore();
  });
  /* les trois lignes du plan */
  keep.forEach((s, i) => {
    const k = ss(.58 + i * .06, .68 + i * .06, p), y = line(i), fs = Math.max(13, sw * .044);
    if (k <= 0) return;
    ctx.globalAlpha = k;
    ctx.fillStyle = i === 0 ? K.coral : K.violet; ctx.beginPath(); ctx.arc(sx + sw * .11, y - fs * .35, fs * .62, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
    txt(ctx, String(i + 1), sx + sw * .11, y, fs * .78, '#fff', { align: 'center', w: 700, a: k });
    txt(ctx, s, sx + sw * .2, y, fs, K.ink, { w: 600, a: k, max: sw * .74 });
    const d = ss(.76 + i * .05, .86 + i * .05, p);
    txt(ctx, who[i] ?? '', sx + sw * .2, y + fs * 1.45, fs * .82, K.grey, { a: d, max: sw * .74 });
  });
  handwrite(ctx, L(el, 'debut'), sx + sw * .2, line(0) - Math.max(13, sw * .044) * 1.6, Math.max(13, sw * .04), ss(.9, 1, p));
};
export default knot;
