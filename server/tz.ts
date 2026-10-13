/* Heure de Casablanca : toujours calculée avec l'API Intl, jamais avec un décalage fixe
   (le Maroc change d'heure pendant le Ramadan). */
export const TZ = 'Africa/Casablanca';

const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short' });
const DOW: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export interface Local { y: number; m: number; d: number; h: number; mi: number; dow: number }

/** Date et heure murales à Casablanca pour un instant donné. */
export function toLocal(t: number | Date): Local {
  const parts = Object.fromEntries(fmt.formatToParts(typeof t === 'number' ? new Date(t) : t).map((p) => [p.type, p.value]));
  return { y: +parts.year!, m: +parts.month!, d: +parts.day!, h: +parts.hour!, mi: +parts.minute!, dow: DOW[parts.weekday!] ?? 0 };
}

/** Décalage de Casablanca (en minutes) à un instant donné. */
function offsetAt(t: number): number {
  const l = toLocal(t);
  return (Date.UTC(l.y, l.m - 1, l.d, l.h, l.mi) - Math.floor(t / 60000) * 60000) / 60000;
}

/** Instant UTC correspondant à une heure murale de Casablanca. */
export function fromLocal(y: number, m: number, d: number, minutes: number): number {
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  let t = guess - offsetAt(guess) * 60000;
  t = guess - offsetAt(t) * 60000;
  return t;
}

export const ymd = (l: { y: number; m: number; d: number }): string => `${l.y}-${String(l.m).padStart(2, '0')}-${String(l.d).padStart(2, '0')}`;
export function parseYmd(s: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? { y: +m[1]!, m: +m[2]!, d: +m[3]! } : null;
}
/** Jour suivant (calendrier, indépendant du fuseau). */
export function addDays(s: { y: number; m: number; d: number }, n: number): { y: number; m: number; d: number } {
  const t = new Date(Date.UTC(s.y, s.m - 1, s.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}
export const dowOf = (s: { y: number; m: number; d: number }): number => new Date(Date.UTC(s.y, s.m - 1, s.d)).getUTCDay();

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const hm = (min: number): string => Math.floor(min / 60) + ' h ' + String(min % 60).padStart(2, '0');
/** « mardi 14 octobre à 10 h 00 » (heure de Casablanca). */
export function labelFr(t: number): string {
  const l = toLocal(t);
  return `${JOURS[l.dow]} ${l.d} ${MOIS[l.m - 1]} à ${hm(l.h * 60 + l.mi)}`;
}
