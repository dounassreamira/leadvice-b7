/* Outils de dessin partagés par les scènes (canvas 2D). */
import { C } from '../env';
export { C };

export type Ctx = CanvasRenderingContext2D;
export interface SceneHost extends HTMLElement {
  _t0?: number | null;
  _mouse?: { x: number; y: number } | null;
  _flow?: { lead: number; client: number; ret: number };
  _labels?: Record<string, unknown>;
  _stage?: string[];
}
export type SceneFn = (ctx: Ctx, w: number, h: number, p: number, t: number, mini: boolean, el: SceneHost) => void;

export const FONT = 'Schibsted Grotesk, system-ui, sans-serif';
export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
export function ss(a: number, b: number, v: number): number { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export function rnd(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
}
export function glow(ctx: Ctx, on: boolean): void { ctx.shadowColor = on ? 'rgba(123,97,255,.85)' : 'transparent'; ctx.shadowBlur = on ? 14 : 0; }
export function label(ctx: Ctx, txt: string, x: number, y: number, a: number, align: CanvasTextAlign = 'center', size = 13, col?: string): void {
  ctx.globalAlpha = a; ctx.fillStyle = col || C.ink2; ctx.font = size + 'px ' + FONT;
  ctx.textAlign = align; ctx.fillText(txt, x, y); ctx.globalAlpha = 1;
}
export function rrect(ctx: Ctx, x: number, y: number, w: number, h: number, k: number): void {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, k); else ctx.rect(x, y, w, h);
}
export function person(ctx: Ctx, x: number, y: number, s: number, col: string, a?: number): void {
  ctx.globalAlpha = a == null ? 1 : a; ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x, y - s * .55, s * .32, 0, 6.283); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + s * .28, s * .48, s * .42, 0, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1;
}
export function wrapText(ctx: Ctx, txt: string, x: number, y: number, maxW: number, lh: number): number {
  const words = txt.split(' ');
  let line = '', yy = y;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = test;
  }
  ctx.fillText(line, x, yy);
  return yy;
}
/** Textes d'une scène, fournis par la page (data-labels, JSON) : aucun texte n'est écrit dans le code de dessin. */
export function L(el: SceneHost | undefined, key: string): string {
  if (!el) return '';
  if (!el._labels) { try { el._labels = JSON.parse(el.dataset.labels ?? '{}') as Record<string, unknown>; } catch { el._labels = {}; } }
  const v = el._labels[key];
  return typeof v === 'string' ? v : '';
}
export function LA(el: SceneHost | undefined, key: string): string[] {
  if (!el) return [];
  L(el, key);
  const v = el._labels?.[key];
  return Array.isArray(v) ? v.map(String) : [];
}
export function fitCanvas(cv: HTMLCanvasElement): { ctx: Ctx; w: number; h: number } | null {
  const r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  return { ctx, w: r.width, h: r.height };
}
