/* Version de démonstration : répond à /api/* dans le navigateur, sans serveur.
   Chargé uniquement quand le site est construit avec PUBLIC_DEMO=1 (voir core.ts). */
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const KEY = 'lv-demo-pris';
const root = new URL(/* @vite-ignore */ '../', import.meta.url);

const pad = (n: number): string => String(n).padStart(2, '0');
const hm = (m: number): string => Math.floor(m / 60) + ' h ' + pad(m % 60);
const seed = (s: string): number => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const pris = (): string[] => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as string[]; } catch { return []; } };

/* La date de Casablanca (UTC+1) sert de repère : on part de demain et on couvre trois semaines. */
function days(): { date: string; slots: { start: string; min: number; label: string }[] }[] {
  const out: ReturnType<typeof days> = [], taken = pris();
  const base = new Date(Date.now() + 3600e3);
  for (let i = 1; i <= 21; i++) {
    const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + i));
    const key = d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()), dow = d.getUTCDay(), h = seed(key);
    const list: { start: string; min: number; label: string }[] = [];
    if (dow !== 0 && h % 7 !== 3) {
      const AM = [600, 660, 690], PM = [750, 870, 930, 990], am = dow === 6 ? 2 : 1 + (h % 2), pm = dow === 6 ? 0 : 3 - am;
      const pick = new Set<number>();
      for (let k = 0; k < am; k++) pick.add(AM[(h + k * 2) % AM.length]!);
      for (let k = 0; k < pm; k++) pick.add(PM[(h + k * 3) % PM.length]!);
      [...pick].sort((a, b) => a - b).forEach((m) => {
        const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, m - 60)).toISOString();
        if (!taken.includes(start)) list.push({ start, min: m, label: hm(m) });
      });
    }
    out.push({ date: key, slots: list });
  }
  return out;
}

const reply = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

const real = window.fetch.bind(window);
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const path = new URL(url, location.href).pathname;
  if (!path.startsWith('/api/')) return real(input, init);
  await wait(450);
  let data: Record<string, unknown> = {};
  try { data = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>; } catch { /* corps vide */ }
  if (path === '/api/slots') return reply({ tz: 'Africa/Casablanca', duration: 30, calendar: false, days: days() });
  if (path === '/api/bookings') {
    const start = String(data.start ?? '');
    const dt = new Date(start), l = new Date(dt.getTime() + 3600e3);
    try { sessionStorage.setItem(KEY, JSON.stringify([...pris(), start])); } catch { /* rien */ }
    return reply({ ok: true, label: JOURS[l.getUTCDay()] + ' ' + l.getUTCDate() + ' ' + MOIS[l.getUTCMonth()] + ' à ' + hm(l.getUTCHours() * 60 + l.getUTCMinutes()) });
  }
  if (path === '/api/diagnostic') return reply({ ok: true, redirect: new URL('diagnostic/merci/?enjeu=' + encodeURIComponent(String(data.enjeu ?? '')), root).href });
  return reply({ ok: true });
};
export {};
