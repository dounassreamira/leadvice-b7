/* Accès à la base D1 : réglages, réservations, demandes, journal. */
import type { Env } from './env';
import { DEFAULTS, sanitize, type Busy, type Settings } from './slots';

export async function getSettings(env: Env): Promise<Settings> {
  if (!env.DB) return DEFAULTS;
  try {
    const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('booking').first<{ value: string }>();
    return row ? sanitize(JSON.parse(row.value) as Partial<Settings>) : DEFAULTS;
  } catch { return DEFAULTS; }
}
export async function saveSettings(env: Env, s: Settings): Promise<void> {
  if (!env.DB) throw new Error('db');
  await env.DB.prepare("INSERT INTO settings (key, value, updated_at) VALUES ('booking', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(JSON.stringify(s), new Date().toISOString()).run();
}
export async function bookedBetween(env: Env, from: number, to: number, exceptId?: string): Promise<Busy[]> {
  if (!env.DB) return [];
  const r = await env.DB.prepare("SELECT start_utc, end_utc FROM bookings WHERE status = 'confirmed' AND start_utc < ? AND end_utc > ? AND id != ?").bind(to, from, exceptId ?? '').all<{ start_utc: number; end_utc: number }>();
  return (r.results ?? []).map((x) => ({ start: x.start_utc, end: x.end_utc }));
}
export async function audit(env: Env, action: string, ref: string, detail: unknown): Promise<void> {
  if (!env.DB) return;
  try { await env.DB.prepare('INSERT INTO audit_log (at, action, ref, detail) VALUES (?, ?, ?, ?)').bind(new Date().toISOString(), action, ref, JSON.stringify(detail).slice(0, 4000)).run(); } catch { /* journal facultatif */ }
}
export interface Booking {
  id: string; start_utc: number; end_utc: number; status: string; nom: string; email: string; tel: string; entreprise: string; enjeu: string;
  campagnes: string; format: string; utm: string; token: string; gcal_id: string | null; meet: string | null; created_at: string; updated_at: string;
  reminded_day: number; reminded_hour: number; outcome: string | null; value: number | null; version: string | null;
}
