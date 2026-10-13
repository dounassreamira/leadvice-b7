/* Événements de conversion : envoyés au dataLayer (GTM, GA4, Google Ads) et au Pixel Meta si le visiteur
   l'a accepté. Le même event_id part aussi du serveur (API Conversions) pour que les plateformes dédoublonnent. */
import { hasAdConsent } from './consent';

declare global { interface Window { fbq?: (...a: unknown[]) => void } }
const META: Record<string, [string, boolean]> = {
  begin_diagnostic: ['OuvertureDiagnostic', true],
  qualify_lead: ['QualificationRemplie', true],
  generate_lead: ['Lead', false],
  schedule: ['Schedule', false],
};
export const eventId = (name: string): string => name + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function track(name: keyof typeof META, params: Record<string, unknown> = {}, id = eventId(name)): string {
  (window.dataLayer = window.dataLayer || []).push({ event: name, event_id: id, ...params });
  const m = META[name];
  if (m && window.fbq && hasAdConsent()) window.fbq(m[1] ? 'trackCustom' : 'track', m[0], params, { eventID: id });
  return id;
}
export function fbp(): string { return document.cookie.match(/(?:^|; )_fbp=([^;]+)/)?.[1] ?? ''; }
