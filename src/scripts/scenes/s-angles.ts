/* Création : un fil Instagram défile, notre annonce y entre ; son accroche change trois fois (trois angles,
   trois publics), puis le défilement s'arrête sur celle qui fait agir. */
import { ss, lerp, L, type SceneFn, type SceneHost } from './util';
import { K, phone, rr, bar, txt, para, tap, stamp, stage } from './obj';

interface Angle { k: string; hook: string; who: string }
function angles(el: SceneHost): Angle[] {
  try { const v = JSON.parse(el.dataset.labels ?? '{}').angles; return Array.isArray(v) ? v as Angle[] : []; } catch { return []; }
}
const CHOIX = 1;

function post(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, s: number, tint: string): number {
  const h = w * 1.05;
  ctx.fillStyle = K.paper; rr(ctx, x, y, w, h, s * .04); ctx.fill();
  ctx.fillStyle = K.line; ctx.beginPath(); ctx.arc(x + w * .08, y + w * .08, w * .035, 0, 6.283); ctx.fill();
  bar(ctx, x + w * .15, y + w * .065, w * .3, w * .03, K.line);
  ctx.fillStyle = tint; rr(ctx, x + w * .04, y + w * .15, w * .92, w * .62, s * .03); ctx.fill();
  bar(ctx, x + w * .04, y + w * .82, w * .7, w * .03, K.line); bar(ctx, x + w * .04, y + w * .89, w * .45, w * .03, K.line);
  return h + w * .05;
}

const scene: SceneFn = (ctx, w, h, p, t, mini, el) => {
  const A = angles(el);
  if (mini) {
    const s = Math.min(w, h), pw = s * .42, scr = phone(ctx, w / 2, h / 2, pw);
    const i = Math.min(2, Math.floor(p * 3)), k = (p * 3) % 1;
    ctx.save(); ctx.beginPath(); ctx.rect(scr.x, scr.y, scr.w, scr.h); ctx.clip();
    ctx.fillStyle = '#EFEBF8'; rr(ctx, scr.x + scr.w * .08, scr.y + scr.h * .12, scr.w * .84, scr.h * .4, 2); ctx.fill();
    [.62, .72, .8].forEach((yy, j) => bar(ctx, scr.x + scr.w * .1, scr.y + scr.h * yy, scr.w * (j === i ? .8 : .5) * (j === i ? .5 + .5 * Math.min(1, k * 2) : 1), scr.h * .045, j === i ? K.coral : K.line));
    ctx.restore();
    return;
  }
  const { wide, cx, cy, u } = stage(w, h), pw = Math.min(u * .42, 250), scr = phone(ctx, cx, cy, pw);
  const enter = ss(.06, .26, p), stop = ss(.82, .9, p);
  const step = p < .44 ? 0 : p < .62 ? 1 : 2, hookK = p < .26 ? 0 : step === 0 ? ss(.26, .32, p) : step === 1 ? ss(.44, .5, p) : ss(.62, .68, p);
  const cur = p >= .82 ? CHOIX : step;
  /* le fil */
  ctx.save(); ctx.beginPath(); ctx.rect(scr.x, scr.y, scr.w, scr.h); ctx.clip();
  const pwid = scr.w * .92, px = scr.x + scr.w * .04, postH = pwid * 1.1, tints = ['#E9F1EC', '#F4EDE4', '#EAE8F3', '#F1E9EF'];
  const colY = lerp(-((t * 60) % postH), -3 * postH + scr.h * .06, enter);
  for (let i = 0; i < 4; i++) { const yy = scr.y + colY + i * postH; if (yy < scr.y + scr.h && yy + postH > scr.y) post(ctx, px, yy, pwid, pw, tints[i % 4]!); }
  const adY = scr.y + colY + 3 * postH;
  /* l'annonce */
  const ah = pwid * 1.6;
  ctx.fillStyle = K.paper; rr(ctx, px, adY, pwid, ah, pw * .04); ctx.fill(); ctx.strokeStyle = cur === CHOIX && stop > 0 ? K.coral : K.line; ctx.lineWidth = cur === CHOIX && stop > 0 ? 2 : 1; ctx.stroke();
  ctx.fillStyle = K.violet; ctx.beginPath(); ctx.arc(px + pwid * .08, adY + pwid * .08, pwid * .04, 0, 6.283); ctx.fill();
  txt(ctx, L(el, 'marque'), px + pwid * .15, adY + pwid * .07, pwid * .055, K.ink, { w: 700 });
  txt(ctx, L(el, 'sponsorise'), px + pwid * .15, adY + pwid * .125, pwid * .045, K.grey);
  const ix = px + pwid * .04, iy = adY + pwid * .17, iw = pwid * .92, ih = pwid * .98;
  const g = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih); g.addColorStop(0, '#301781'); g.addColorStop(1, '#7B61FF');
  ctx.fillStyle = g; rr(ctx, ix, iy, iw, ih, pw * .03); ctx.fill();
  const a = A[cur] ?? A[0];
  if (a && p >= .26) {
    const prev = A[Math.max(0, step - 1)], kIn = p >= .82 ? 1 : hookK;
    if (prev && kIn < 1 && step > 0) para(ctx, prev.hook, ix + iw * .08, iy + ih * .3 - kIn * ih * .2, iw * .84, Math.max(12, pwid * .075), '#fff', { serif: true, a: 1 - kIn });
    para(ctx, a.hook, ix + iw * .08, iy + ih * .3 + (1 - kIn) * ih * .2, iw * .84, Math.max(12, pwid * .075), '#fff', { serif: true, a: kIn });
  } else txt(ctx, L(el, 'offre'), ix + iw * .08, iy + ih * .4, Math.max(12, pwid * .07), '#fff', { serif: true });
  const by = iy + ih + pwid * .06;
  ctx.fillStyle = K.tint; rr(ctx, ix, by, iw, pwid * .13, pw * .02); ctx.fill();
  txt(ctx, L(el, 'bouton_pub'), ix + iw * .06, by + pwid * .085, pwid * .055, K.brand, { w: 700 });
  bar(ctx, ix, by + pwid * .2, iw * .8, pwid * .03, K.line); bar(ctx, ix, by + pwid * .26, iw * .55, pwid * .03, K.line);
  ctx.restore();
  tap(ctx, ix + iw * .8, by + pwid * .065, ss(.86, .96, p), pw * .22);
  /* à côté du téléphone : l'angle et le public auxquels il parle */
  if (a && p >= .26) {
    const lx = wide ? cx - pw * .5 - 40 : cx, ly = wide ? cy - pw * .5 : scr.y + scr.h + pw * .3, al = wide ? 'right' : 'center';
    const fade = p >= .82 ? 1 : hookK;
    txt(ctx, L(el, 'angle') + ' : ' + a.k, lx, ly, Math.max(15, pw * .085), K.ink, { serif: true, align: al as CanvasTextAlign, a: fade });
    txt(ctx, L(el, 'parle') + ' ' + a.who.toLowerCase(), lx, ly + Math.max(15, pw * .085) * 1.4, Math.max(12, pw * .058), K.grey, { align: al as CanvasTextAlign, a: fade });
    if (wide) [0, 1, 2].forEach((j) => { ctx.fillStyle = j === cur ? (p >= .82 ? K.coral : K.violet) : K.line; ctx.beginPath(); ctx.arc(lx - 8 - (2 - j) * 14, ly + Math.max(15, pw * .085) * 2.6, 4, 0, 6.283); ctx.fill(); });
  }
  if (stop > 0) stamp(ctx, L(el, 'retenu'), cx + pw * .5 + (wide ? 18 : -pw * .2), scr.y + scr.h * .15, Math.max(12, pw * .06), .08, stop);
};
export default scene;
