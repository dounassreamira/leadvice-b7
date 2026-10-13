/* API Conversions de Meta : mêmes event_id que le navigateur pour dédoublonner.
   E-mail et téléphone hachés (SHA-256, normalisés : minuscules, indicatif +212). */
import { type Env, sha256 } from './env';

export interface CapiUser { email?: string; tel?: string; externalId?: string; fbc?: string; fbp?: string; ip?: string | null; ua?: string | null }
export function normTel(t: string): string {
  let d = t.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '212' + d.slice(1);
  return d;
}
export async function capi(env: Env, name: string, eventId: string, user: CapiUser, custom: Record<string, unknown>, url: string, consent: boolean): Promise<boolean> {
  if (!env.META_CAPI_TOKEN || !env.PUBLIC_META_PIXEL_ID) return false;
  if (!consent && env.CAPI_SANS_CONSENTEMENT !== '1') return false;
  const ud: Record<string, unknown> = {};
  if (user.email) ud.em = [await sha256(user.email.trim().toLowerCase())];
  if (user.tel) ud.ph = [await sha256(normTel(user.tel))];
  if (user.externalId) ud.external_id = [await sha256(user.externalId)];
  if (user.fbc) ud.fbc = user.fbc;
  if (user.fbp) ud.fbp = user.fbp;
  if (user.ip) ud.client_ip_address = user.ip;
  if (user.ua) ud.client_user_agent = user.ua;
  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${env.PUBLIC_META_PIXEL_ID}/events?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [{ event_name: name, event_time: Math.floor(Date.now() / 1000), event_id: eventId, action_source: 'website', event_source_url: url, user_data: ud, custom_data: custom }] }),
    });
    return r.ok;
  } catch { return false; }
}
