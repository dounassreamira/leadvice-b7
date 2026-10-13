/* Google Agenda (compte de service) : occupation (freeBusy), création, déplacement et annulation des événements,
   avec lien Google Meet et invitation du prospect. Facultatif : sans identifiants, rien n'est appelé. */
import type { Env } from './env';
import type { Busy } from './slots';

interface SA { client_email: string; private_key: string }
let cached: { token: string; exp: number } | null = null;

const b64url = (b: ArrayBuffer | Uint8Array | string): string => {
  const bytes = typeof b === 'string' ? new TextEncoder().encode(b) : new Uint8Array(b instanceof Uint8Array ? b : new Uint8Array(b));
  let s = ''; bytes.forEach((x) => { s += String.fromCharCode(x); });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const calendarReady = (env: Env): boolean => !!(env.GOOGLE_SERVICE_ACCOUNT && env.GOOGLE_CALENDAR_ID);

async function token(env: Env): Promise<string | null> {
  if (!calendarReady(env)) return null;
  if (cached && cached.exp > Date.now() + 60000) return cached.token;
  try {
    const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT!) as SA;
    const now = Math.floor(Date.now() / 1000);
    const claims: Record<string, unknown> = { iss: sa.client_email, scope: 'https://www.googleapis.com/auth/calendar', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 };
    if (env.GOOGLE_IMPERSONATE) claims.sub = env.GOOGLE_IMPERSONATE;
    const unsigned = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) + '.' + b64url(JSON.stringify(claims));
    const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + unsigned + '.' + b64url(sig) });
    if (!r.ok) return null;
    const j = (await r.json()) as { access_token: string; expires_in: number };
    cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
    return j.access_token;
  } catch { return null; }
}

const cal = (env: Env): string => encodeURIComponent(env.GOOGLE_CALENDAR_ID ?? 'primary');

/** Plages occupées de l'agenda entre deux instants. */
export async function freeBusy(env: Env, from: number, to: number): Promise<Busy[] | null> {
  const t = await token(env);
  if (!t) return null;
  try {
    const r = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(), timeZone: 'Africa/Casablanca', items: [{ id: env.GOOGLE_CALENDAR_ID }] }),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { calendars: Record<string, { busy: { start: string; end: string }[] }> };
    return Object.values(j.calendars).flatMap((c) => c.busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) })));
  } catch { return null; }
}

export interface EventIn { id: string; start: number; end: number; summary: string; description: string; attendee?: string; visio: boolean }
/** Crée l'événement (lien Meet si visio, invitation au prospect). Retourne l'identifiant Google et le lien Meet. */
export async function createEvent(env: Env, e: EventIn): Promise<{ id: string; meet?: string } | null> {
  const t = await token(env);
  if (!t) return null;
  const body: Record<string, unknown> = {
    summary: e.summary, description: e.description,
    start: { dateTime: new Date(e.start).toISOString(), timeZone: 'Africa/Casablanca' },
    end: { dateTime: new Date(e.end).toISOString(), timeZone: 'Africa/Casablanca' },
    attendees: e.attendee && env.GOOGLE_IMPERSONATE ? [{ email: e.attendee }] : undefined,
    reminders: { useDefault: true },
  };
  if (e.visio && env.GOOGLE_IMPERSONATE) body.conferenceData = { createRequest: { requestId: e.id, conferenceSolutionKey: { type: 'hangoutsMeet' } } };
  try {
    const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${cal(env)}/events?conferenceDataVersion=1&sendUpdates=${env.GOOGLE_IMPERSONATE ? 'all' : 'none'}`, {
      method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { id: string; hangoutLink?: string };
    return { id: j.id, meet: j.hangoutLink };
  } catch { return null; }
}

export async function moveEvent(env: Env, eventId: string, start: number, end: number): Promise<boolean> {
  const t = await token(env);
  if (!t) return false;
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${cal(env)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`, {
    method: 'PATCH', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ start: { dateTime: new Date(start).toISOString(), timeZone: 'Africa/Casablanca' }, end: { dateTime: new Date(end).toISOString(), timeZone: 'Africa/Casablanca' } }),
  }).catch(() => null);
  return !!r?.ok;
}

export async function cancelEvent(env: Env, eventId: string): Promise<boolean> {
  const t = await token(env);
  if (!t) return false;
  const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${cal(env)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } }).catch(() => null);
  return !!r && (r.ok || r.status === 410);
}

export async function calendarStatus(env: Env): Promise<'non-configure' | 'connecte' | 'erreur'> {
  if (!calendarReady(env)) return 'non-configure';
  return (await token(env)) ? 'connecte' : 'erreur';
}
