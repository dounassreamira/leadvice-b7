/* Outils communs aux ateliers : format des nombres, gabarits de texte, hasard reproductible, sauvegarde locale. */
export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/** Nombre en français ; l'espace fine insécable des milliers devient une espace insécable (toutes les polices l'ont). */
export const fmt = (n: number, d = 0): string => Number(n).toLocaleString('fr-FR', { maximumFractionDigits: d, minimumFractionDigits: d }).replace(/ /g, ' ');

/** Remplace les {clés} d'un texte du contenu. */
export const fill = (s: string, v: Record<string, string | number>): string => String(s).replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? String(v[k]) : m));

export function rng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
}

/** Progression gardée sur l'appareil ; repli silencieux si le stockage est indisponible. */
export function store<T>(key: string): { get: () => T | null; set: (v: T) => void; clear: () => void } {
  return {
    get: () => { try { return JSON.parse(localStorage.getItem(key) ?? 'null') as T | null; } catch { return null; } },
    set: (v) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* stockage indisponible */ } },
    clear: () => { try { localStorage.removeItem(key); } catch { /* stockage indisponible */ } },
  };
}
