/* Articles Insights : liste publiée, temps de lecture, sommaire et « À lire aussi », calculés au build. */
import { getCollection, type CollectionEntry } from 'astro:content';
export type Article = CollectionEntry<'insights'>;

export async function articles(): Promise<Article[]> {
  const now = Date.now();
  return (await getCollection('insights', (a) => !a.data.draft && a.data.publishedAt.getTime() <= now))
    .sort((a, b) => a.data.order - b.data.order || b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
export function readingTime(a: Article): number {
  const words = (a.body ?? '').replace(/[#*`>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
export function related(a: Article, all: Article[]): Article[] {
  const others = all.filter((x) => x.id !== a.id);
  const same = others.filter((x) => x.data.category === a.data.category);
  const rest = others.filter((x) => x.data.category !== a.data.category);
  return [...same, ...rest].slice(0, 2);
}
