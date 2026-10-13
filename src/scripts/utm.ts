/* Suivi UTM : à l'arrivée, on garde pour la session la source de la visite (première visite conservée,
   jamais écrasée par la navigation interne). Envoyé seulement avec une demande de diagnostic. */
const KEY = 'lv-utm';
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;
export type Utm = Partial<Record<(typeof FIELDS)[number] | 'landing' | 'referrer' | 'fbc', string>>;

export function captureUtm(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(location.search);
    const u: Utm = { landing: location.pathname };
    for (const f of FIELDS) { const v = q.get(f); if (v) u[f] = v.slice(0, 200); }
    if (document.referrer && !document.referrer.startsWith(location.origin)) u.referrer = document.referrer.slice(0, 300);
    if (u.fbclid) u.fbc = 'fb.1.' + Date.now() + '.' + u.fbclid;
    sessionStorage.setItem(KEY, JSON.stringify(u));
  } catch { /* stockage indisponible : rien n'est gardé */ }
}

export function readUtm(): Utm {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Utm; } catch { return {}; }
}
