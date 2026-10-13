/* Vérifie le jeton Cloudflare Access (en-tête Cf-Access-Jwt-Assertion) : l'administration n'est
   accessible qu'aux adresses autorisées dans Access (Amira et Nada). Sans configuration, tout est refusé. */
import type { Env } from './env';

interface Jwk { kid: string; kty: string; n: string; e: string; alg?: string }
let certs: { keys: Jwk[]; at: number } | null = null;
const dec = (s: string): Uint8Array => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

export async function accessUser(req: Request, env: Env): Promise<string | null> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const jwt = req.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return null;
  const [h, p, s] = jwt.split('.');
  if (!h || !p || !s) return null;
  try {
    const header = JSON.parse(new TextDecoder().decode(dec(h))) as { kid: string };
    const payload = JSON.parse(new TextDecoder().decode(dec(p))) as { aud: string | string[]; exp: number; email?: string; iss?: string };
    if (!certs || Date.now() - certs.at > 3600e3) {
      const r = await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
      certs = { keys: ((await r.json()) as { keys: Jwk[] }).keys, at: Date.now() };
    }
    const jwk = certs.keys.find((k) => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, dec(s), new TextEncoder().encode(h + '.' + p));
    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!ok || !aud.includes(env.ACCESS_AUD) || payload.exp * 1000 < Date.now()) return null;
    return payload.email ?? 'admin';
  } catch { return null; }
}
