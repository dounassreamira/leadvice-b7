/* Liste des images de partage à générer au build : une par page, titre de la page. */
import { getCollection } from 'astro:content';
import { plain } from './content';

export interface OgEntry { slug: string; title: string; kicker: string }

export async function ogEntries(): Promise<OgEntry[]> {
  const out = new Map<string, OgEntry>();
  out.set('accueil', { slug: 'accueil', title: 'Moins de bruit. Plus de clients.', kicker: 'Cabinet de conseil stratégique & marketing, Casablanca' });
  const pages = (await getCollection('pages')).sort((a, b) => Number((b.data as { seo?: { og?: string } }).seo?.og === b.id) - Number((a.data as { seo?: { og?: string } }).seo?.og === a.id));
  for (const p of pages) {
    const seo = (p.data as Record<string, { og?: string; og_titre?: string; title?: string }>).seo;
    /* plusieurs pages peuvent partager une image : la page du même nom donne le titre, sinon la première rencontrée */
    if (seo?.og && !out.has(seo.og)) out.set(seo.og, { slug: seo.og, title: plain(seo.og_titre ?? seo.title ?? ''), kicker: 'Leadvice, cabinet de conseil stratégique & marketing' });
  }
  for (const a of await getCollection('insights')) out.set('insight-' + a.id, { slug: 'insight-' + a.id, title: a.data.title, kicker: 'Insights ' + a.data.category + ', Leadvice' });
  for (const l of await getCollection('legal')) out.set(l.id, { slug: l.id, title: l.data.title, kicker: 'Leadvice' });
  return [...out.values()];
}
