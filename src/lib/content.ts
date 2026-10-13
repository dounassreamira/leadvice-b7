import { getEntry } from 'astro:content';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>;

/** Lit un fichier de textes communs (src/content/site/<id>.yaml). */
export async function site(id = 'site'): Promise<Data> {
  const e = await getEntry('site', id);
  if (!e) throw new Error(`Contenu introuvable : site/${id}.yaml`);
  return e.data as Data;
}

/** Lit les textes d'une page (src/content/pages/<id>.yaml). */
export async function page(id: string): Promise<Data> {
  const e = await getEntry('pages', id);
  if (!e) throw new Error(`Contenu introuvable : pages/${id}.yaml`);
  return e.data as Data;
}

/** Dates en français, lisibles (« 12 octobre 2026 »). */
export function dateFr(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Casablanca' }).format(d);
}

/** Échappe un texte pour l'insérer dans du HTML. */
export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}

/** Retire les balises d'un texte enrichi (pour les métadonnées et les données structurées). */
export function plain(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** Textes d'une scène dessinée, à passer en attribut data-labels. */
export async function sceneLabels(name: string): Promise<string> {
  const all = await site('scenes');
  return JSON.stringify(all[name] ?? {});
}
