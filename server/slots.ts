/* Calcul des créneaux réservables : règles de la semaine, jours bloqués, créneaux exceptionnels,
   délai minimal, horizon, plafond par jour, moins les rendez-vous pris et l'occupation de l'agenda. */
import { addDays, dowOf, fromLocal, hm, parseYmd, toLocal, ymd } from './tz';

export interface Settings {
  duration: number; buffer: number; notice: number; horizon: number; maxPerDay: number;
  week: Record<string, [string, string][]>;
  blocked: string[];
  extra: { date: string; from: string; to: string }[];
}
export const DEFAULTS: Settings = {
  duration: 45, buffer: 15, notice: 24, horizon: 21, maxPerDay: 12,
  week: { 1: [['09:00', '13:00'], ['14:30', '18:30']], 2: [['09:00', '13:00'], ['14:30', '18:30']], 3: [['09:00', '13:00'], ['14:30', '18:30']], 4: [['09:00', '13:00'], ['14:30', '18:30']], 5: [['09:00', '12:00']], 6: [], 0: [] },
  blocked: [], extra: [],
};
export interface Busy { start: number; end: number }
export interface Slot { start: number; min: number; label: string }
export interface Day { date: string; slots: Slot[] }

const toMin = (s: string): number => { const [h, m] = s.split(':').map(Number); return (h ?? 0) * 60 + (m ?? 0); };

export function sanitize(s: Partial<Settings>): Settings {
  const n = (v: unknown, a: number, b: number, d: number): number => (typeof v === 'number' && isFinite(v) ? Math.max(a, Math.min(b, Math.round(v))) : d);
  const hhmm = (v: unknown): v is string => typeof v === 'string' && /^\d{2}:\d{2}$/.test(v);
  const week: Settings['week'] = {};
  for (let d = 0; d < 7; d++) {
    const r = (s.week?.[d] ?? DEFAULTS.week[d] ?? []) as unknown[];
    week[d] = (Array.isArray(r) ? r : []).filter((x): x is [string, string] => Array.isArray(x) && hhmm(x[0]) && hhmm(x[1]) && x[0] < x[1]).slice(0, 6);
  }
  return {
    duration: n(s.duration, 10, 120, DEFAULTS.duration),
    buffer: n(s.buffer, 0, 120, DEFAULTS.buffer),
    notice: n(s.notice, 0, 336, DEFAULTS.notice),
    horizon: n(s.horizon, 1, 90, DEFAULTS.horizon),
    maxPerDay: n(s.maxPerDay, 1, 24, DEFAULTS.maxPerDay),
    week,
    blocked: (s.blocked ?? []).filter((x) => typeof x === 'string' && !!parseYmd(x)).slice(0, 400),
    extra: (s.extra ?? []).filter((x) => x && parseYmd(x.date) && hhmm(x.from) && hhmm(x.to) && x.from < x.to).slice(0, 200),
  };
}

/** Créneaux libres de « from » à « to » (dates locales incluses), à partir de l'instant « now ». */
export function computeSlots(S: Settings, now: number, booked: Busy[], busy: Busy[], from?: string, to?: string): Day[] {
  const today = toLocal(now);
  const start = from ? parseYmd(from) ?? today : today;
  const lastAllowed = addDays(today, S.horizon);
  const end = to ? parseYmd(to) ?? lastAllowed : lastAllowed;
  const out: Day[] = [];
  for (let i = 0; i < 120; i++) {
    const day = addDays(start, i);
    const key = ymd(day);
    if (key > ymd(end) || key > ymd(lastAllowed)) break;
    if (key < ymd(today)) continue;
    if (S.blocked.includes(key)) { out.push({ date: key, slots: [] }); continue; }
    const ranges = [...(S.week[dowOf(day)] ?? [])];
    S.extra.forEach((e) => { if (e.date === key) ranges.push([e.from, e.to]); });
    const dayStart = fromLocal(day.y, day.m, day.d, 0), dayEnd = fromLocal(day.y, day.m, day.d, 24 * 60);
    const takenToday = booked.filter((b) => b.start >= dayStart && b.start < dayEnd).length;
    const slots: Slot[] = [];
    const seen = new Set<number>();
    ranges.sort((a, b) => toMin(a[0]) - toMin(b[0])).forEach((r) => {
      for (let m = toMin(r[0]); m + S.duration <= toMin(r[1]); m += S.duration + S.buffer) {
        const t = fromLocal(day.y, day.m, day.d, m), e = t + S.duration * 60000;
        if (seen.has(t)) continue;
        if (t - now < S.notice * 3600e3) continue;
        const clash = (x: Busy): boolean => t < x.end + S.buffer * 60000 && e + S.buffer * 60000 > x.start;
        if (booked.some(clash) || busy.some((x) => t < x.end && e > x.start)) continue;
        seen.add(t);
        slots.push({ start: t, min: m, label: hm(m) });
      }
    });
    out.push({ date: key, slots: slots.sort((a, b) => a.start - b.start).slice(0, Math.max(0, S.maxPerDay - takenToday)) });
  }
  return out;
}
