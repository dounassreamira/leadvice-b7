/* Drapeaux partagés par tous les scripts du site. */
export const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const root = document.documentElement;

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document): T | null => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document): T[] => Array.from(r.querySelectorAll<T>(s));

/* Couleurs lues par les scènes dessinées : elles suivent le mode clair ou sombre. */
export interface Palette { ink: string; ink2: string; ink3: string; line: string; brand: string; sig: string; lav: string; paper: string; white: string }
const LIGHT: Palette = { ink: '#1E0F52', ink2: '#5B5770', ink3: '#9C97B5', line: '#E2DDF2', brand: '#301781', sig: '#6B4EFF', lav: '#B4A6FF', paper: '#FBFAFD', white: '#FFFFFF' };
const DARK: Palette = { ink: '#EEEAF8', ink2: '#B7B0D4', ink3: '#8A83A8', line: '#2C2452', brand: '#B4A6FF', sig: '#9C87FF', lav: '#6E5BD0', paper: '#0F0A24', white: '#1A1338' };
export const C: Palette = { ...LIGHT };
export function syncPalette(): void {
  Object.assign(C, root.getAttribute('data-theme') === 'dark' ? DARK : LIGHT);
}
syncPalette();

declare global {
  interface Window {
    __lenis?: { scrollTo: (t: number | string | HTMLElement, o?: Record<string, unknown>) => void; on: (e: string, f: () => void) => void; stop: () => void; start: () => void };
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
  }
}

export function scrollToY(y: number | string | HTMLElement): void {
  if (window.__lenis) window.__lenis.scrollTo(y, { offset: typeof y === 'number' ? 0 : -90 });
  else if (typeof y === 'number') window.scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
  else {
    const el = typeof y === 'string' ? document.querySelector(y) : y;
    el?.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  }
}

const live = (): HTMLElement | null => document.querySelector('[data-announce]');
export function announce(msg: string): void {
  const l = live();
  if (!l) return;
  l.textContent = '';
  requestAnimationFrame(() => { l.textContent = msg; });
}

export const idle = (fn: () => void, timeout = 1500): void => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout });
  else setTimeout(fn, 200);
};
