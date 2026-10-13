/* Cloudflare Turnstile, chargé seulement si la clé publique est définie (PUBLIC_TURNSTILE_SITE_KEY). */
declare global { interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; getResponse: (id?: string) => string; reset: (id?: string) => void } } }
const KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
let loading: Promise<void> | null = null;
export const turnstileEnabled = (): boolean => !!KEY;
function load(): Promise<void> {
  return (loading ??= new Promise((res) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true; s.onload = () => res(); s.onerror = () => res();
    document.head.appendChild(s);
  }));
}
/** Affiche le widget dans « el » ; renvoie une fonction qui lit le jeton. */
export async function mountTurnstile(el: HTMLElement): Promise<() => string> {
  if (!KEY) return () => '';
  await load();
  if (!window.turnstile) return () => '';
  const id = window.turnstile.render(el, { sitekey: KEY, language: 'fr', appearance: 'interaction-only' });
  return () => window.turnstile?.getResponse(id) ?? '';
}
