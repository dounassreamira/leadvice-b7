/* Variables et liaisons de l'environnement Cloudflare (Pages Functions et Worker des rappels). */
export interface Env {
  DB?: D1Database;                       // base D1 (liaison « DB »)
  RESEND_API_KEY?: string;               // envoi des e-mails
  MAIL_FROM?: string;                    // ex. « Leadvice <diagnostic@leadvice.org> »
  MAIL_TO?: string;                      // destinataire interne, contact@leadvice.org par défaut
  TURNSTILE_SECRET_KEY?: string;         // anti-robots
  GOOGLE_SERVICE_ACCOUNT?: string;       // JSON du compte de service Google (Agenda)
  GOOGLE_CALENDAR_ID?: string;           // agenda à lire et à remplir
  GOOGLE_IMPERSONATE?: string;           // utilisateur Google Workspace à représenter (pour inviter et créer le lien Meet)
  META_CAPI_TOKEN?: string;              // API Conversions de Meta
  PUBLIC_META_PIXEL_ID?: string;
  CAPI_SANS_CONSENTEMENT?: string;       // « 1 » pour envoyer les événements serveur même sans accord publicité (à valider CNDP)
  ACCESS_TEAM_DOMAIN?: string;           // Cloudflare Access, ex. leadvice.cloudflareaccess.com
  ACCESS_AUD?: string;                   // Audience de l'application Access protégeant /admin/
  SITE_URL?: string;                     // https://leadvice.org
  SITE_VERSION?: string;                 // b7 (comparaison de versions)
}

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });

export const siteUrl = (env: Env): string => (env.SITE_URL ?? 'https://leadvice.org').replace(/\/$/, '');
export const mailTo = (env: Env): string => env.MAIL_TO ?? 'contact@leadvice.org';
export const mailFrom = (env: Env): string => env.MAIL_FROM ?? 'Leadvice <diagnostic@leadvice.org>';

export async function readJson<T>(req: Request): Promise<T | null> {
  try { return (await req.json()) as T; } catch { return null; }
}

/** Lit un formulaire envoyé en JSON (JavaScript) ou en application/x-www-form-urlencoded (sans JavaScript). */
export async function readForm(req: Request): Promise<{ data: Record<string, unknown>; html: boolean }> {
  const type = req.headers.get('Content-Type') ?? '';
  if (type.includes('application/json')) return { data: (await readJson<Record<string, unknown>>(req)) ?? {}, html: false };
  const fd = await req.formData();
  const data: Record<string, unknown> = {};
  fd.forEach((v, k) => { if (typeof v === 'string') data[k] = v; });
  return { data, html: true };
}

export const str = (v: unknown, max = 500): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function randomToken(bytes = 24): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, '0')).join('');
}
