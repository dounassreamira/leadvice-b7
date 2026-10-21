/* Objets du métier dessinés en miniature (feuille, post-it, téléphone, carte, tampon), partagés par les scènes.
   Les objets restent « papier » dans les deux thèmes : fond blanc, encre sombre. */
import type { Ctx } from './util';

export const SANS = '"Hanken Grotesk", system-ui, sans-serif';
export const SERIF = '"Young Serif", Georgia, serif';
export const K = { paper: '#FFFFFF', ink: '#16131F', grey: '#5B566C', soft: '#9C97B5', line: '#E2DDF2', tint: '#F3F0FB', violet: '#7B61FF', brand: '#301781', coral: '#FF7A59', coralInk: '#C2410C', note: '#FFF1B5', noteB: '#ECE7FF' };

export function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
/** Feuille ou carte posée : fond blanc, bord fin, ombre douce. */
export function sheet(ctx: Ctx, x: number, y: number, w: number, h: number, r = 6, a = 1, fill = K.paper): void {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(30,15,82,.12)'; ctx.shadowBlur = Math.max(4, w * .05); ctx.shadowOffsetY = Math.max(2, w * .012);
  ctx.fillStyle = fill; rr(ctx, x, y, w, h, r); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.strokeStyle = K.line; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}
export function txt(ctx: Ctx, s: string, x: number, y: number, size: number, col = K.ink, opts: { w?: number; align?: CanvasTextAlign; serif?: boolean; a?: number; max?: number } = {}): void {
  if (!s || (opts.a ?? 1) <= 0) return;
  ctx.save(); ctx.globalAlpha *= opts.a ?? 1; ctx.fillStyle = col; ctx.textAlign = opts.align ?? 'left'; ctx.textBaseline = 'alphabetic';
  ctx.font = (opts.serif ? '400 ' : (opts.w ?? 500) + ' ') + size + 'px ' + (opts.serif ? SERIF : SANS);
  let t = s;
  if (opts.max) while (t.length > 3 && ctx.measureText(t).width > opts.max) t = t.slice(0, -2) + '…';
  ctx.fillText(t, x, y); ctx.restore();
}
/** Texte sur plusieurs lignes ; renvoie la hauteur utilisée. */
export function para(ctx: Ctx, s: string, x: number, y: number, maxW: number, size: number, col = K.ink, opts: { serif?: boolean; a?: number; lh?: number; w?: number } = {}): number {
  ctx.save(); ctx.globalAlpha *= opts.a ?? 1; ctx.fillStyle = col; ctx.textAlign = 'left';
  ctx.font = (opts.serif ? '400 ' : (opts.w ?? 500) + ' ') + size + 'px ' + (opts.serif ? SERIF : SANS);
  const lh = opts.lh ?? size * 1.25; let line = '', yy = y;
  for (const wd of s.split(' ')) { const test = line ? line + ' ' + wd : wd; if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = wd; yy += lh; } else line = test; }
  ctx.fillText(line, x, yy); ctx.restore();
  return yy - y + lh;
}
/** Barre de texte simulée (ligne grise arrondie). */
export function bar(ctx: Ctx, x: number, y: number, w: number, h: number, col = K.line, a = 1): void {
  if (a <= 0 || w <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; rr(ctx, x, y, w, h, h / 2); ctx.fill(); ctx.restore();
}
/** Téléphone : renvoie le rectangle de l'écran. */
export function phone(ctx: Ctx, cx: number, cy: number, w: number, a = 1): { x: number; y: number; w: number; h: number } {
  const h = w * 2.02, x = cx - w / 2, y = cy - h / 2, b = w * .05;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.shadowColor = 'rgba(30,15,82,.22)'; ctx.shadowBlur = w * .12; ctx.shadowOffsetY = w * .04;
  ctx.fillStyle = '#16131F'; rr(ctx, x, y, w, h, w * .16); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#FBFAFD'; rr(ctx, x + b, y + b, w - 2 * b, h - 2 * b, w * .12); ctx.fill();
  ctx.fillStyle = '#16131F'; rr(ctx, cx - w * .14, y + b + w * .025, w * .28, w * .055, w * .03); ctx.fill();
  ctx.restore();
  return { x: x + b, y: y + b + w * .1, w: w - 2 * b, h: h - 2 * b - w * .1 };
}
/** Tampon incliné (« Signé », « Payé »…). */
export function stamp(ctx: Ctx, s: string, x: number, y: number, size: number, rot: number, a = 1, col = K.coralInk): void {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.font = '700 ' + size + 'px ' + SANS; const tw = ctx.measureText(s).width, pw = tw + size * 1.2, ph = size * 1.7;
  ctx.fillStyle = 'rgba(255,244,239,.92)'; rr(ctx, -pw / 2, -ph / 2, pw, ph, 3); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.2, size * .12); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, size * .05);
  ctx.restore();
}
/** Cercle qui s'élargit (un toucher, un clic). */
export function tap(ctx: Ctx, x: number, y: number, k: number, r: number, col = K.coral): void {
  if (k <= 0 || k >= 1) return;
  ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * (.4 + k), 0, 6.283); ctx.stroke(); ctx.restore();
}
/** Écriture manuscrite révélée de gauche à droite, avec la pointe du stylo. */
export function handwrite(ctx: Ctx, s: string, x: number, y: number, size: number, k: number, col = K.coralInk): void {
  if (k <= 0) return;
  ctx.save(); ctx.font = 'italic 400 ' + size + 'px ' + SERIF; const tw = ctx.measureText(s).width;
  ctx.beginPath(); ctx.rect(x - 2, y - size * 1.2, tw * k + 2, size * 1.6); ctx.clip();
  ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.fillText(s, x, y); ctx.restore();
  if (k < 1) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x + tw * k, y - size * .25, Math.max(1.5, size * .09), 0, 6.283); ctx.fill(); }
}
/** Mise en page commune : sur grand écran l'objet se place à droite du centre (la légende est en bas à gauche). */
export function stage(w: number, h: number): { wide: boolean; cx: number; cy: number; u: number } {
  const wide = w > 900;
  return { wide, cx: wide ? w * .62 : w / 2, cy: wide ? h * .45 : h * .4, u: Math.min(wide ? w * .38 : w * .86, h * (wide ? .72 : .5)) };
}
