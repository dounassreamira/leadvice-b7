/* Images optimisées au build (astro:assets) : logos clients et portraits. */
import type { ImageMetadata } from 'astro';
const logos = import.meta.glob<{ default: ImageMetadata }>('../assets/logos/*.png', { eager: true });
const portraits = import.meta.glob<{ default: ImageMetadata }>('../assets/fondatrices/*.webp', { eager: true });

export function logo(name: string): ImageMetadata {
  const m = logos[`../assets/logos/${name}.png`];
  if (!m) throw new Error(`Logo introuvable : ${name}`);
  return m.default;
}
export function portrait(name: string): ImageMetadata {
  const m = portraits[`../assets/fondatrices/${name}.webp`];
  if (!m) throw new Error(`Portrait introuvable : ${name}`);
  return m.default;
}
