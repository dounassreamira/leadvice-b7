/* Cloudflare Turnstile : vérifié seulement si la clé secrète est configurée. */
import type { Env } from './env';
export async function turnstileOk(env: Env, token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const j = (await r.json()) as { success?: boolean };
    return !!j.success;
  } catch { return false; }
}
