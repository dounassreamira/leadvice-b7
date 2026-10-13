/* GET /api/bookings/:token : le rendez-vous ; POST { action: 'cancel' | 'move', start } : annuler ou déplacer
   depuis le lien reçu par e-mail. */
import { json, readJson, str, type Env } from '../../../server/env';
import { audit, bookedBetween, getSettings, type Booking } from '../../../server/db';
import { cancelEvent, freeBusy, moveEvent } from '../../../server/gcal';
import { computeSlots } from '../../../server/slots';
import { labelFr, toLocal, ymd } from '../../../server/tz';
import { confirmMails } from '../../../server/booking-mails';

async function find(env: Env, token: string): Promise<Booking | null> {
  if (!env.DB || !/^[a-f0-9]{48}$/.test(token)) return null;
  return env.DB.prepare('SELECT * FROM bookings WHERE token = ?').bind(token).first<Booking>();
}
const view = (b: Booking): Record<string, unknown> => ({ status: b.status, start: new Date(b.start_utc).toISOString(), label: labelFr(b.start_utc), format: b.format, entreprise: b.entreprise, past: b.start_utc < Date.now() });

export const onRequestGet: PagesFunction<Env, 'token'> = async ({ env, params }) => {
  const b = await find(env, String(params.token));
  return b ? json({ ok: true, booking: view(b) }) : json({ ok: false, error: 'not_found' }, 404);
};

export const onRequestPost: PagesFunction<Env, 'token'> = async ({ request, env, params }) => {
  const b = await find(env, String(params.token));
  if (!b || !env.DB) return json({ ok: false, error: 'not_found' }, 404);
  if (b.status !== 'confirmed' || b.start_utc < Date.now()) return json({ ok: false, error: 'closed' }, 409);
  const d = (await readJson<Record<string, unknown>>(request)) ?? {};
  const mail = { id: b.id, token: b.token, start: b.start_utc, end: b.end_utc, nom: b.nom, email: b.email, tel: b.tel, entreprise: b.entreprise, enjeu: b.enjeu, campagnes: b.campagnes, format: b.format, meet: b.meet, utm: JSON.parse(b.utm || '{}') };
  const now = new Date().toISOString();
  if (d.action === 'cancel') {
    await env.DB.prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?").bind(now, b.id).run();
    if (b.gcal_id) await cancelEvent(env, b.gcal_id);
    await confirmMails(env, mail, 'annule');
    await audit(env, 'annulation', b.id, { par: 'prospect' });
    return json({ ok: true, booking: view({ ...b, status: 'cancelled' }) });
  }
  if (d.action === 'move') {
    const start = Date.parse(str(d.start, 40));
    if (!isFinite(start)) return json({ ok: false, error: 'bad_request' }, 400);
    const S = await getSettings(env), day = ymd(toLocal(start));
    const [booked, busy] = await Promise.all([bookedBetween(env, start - 86400e3, start + 86400e3, b.id), freeBusy(env, start - 86400e3, start + 86400e3)]);
    const busyOthers = (busy ?? []).filter((x) => !(x.start === b.start_utc && x.end === b.end_utc));
    if (!computeSlots(S, Date.now(), booked, busyOthers, day, day)[0]?.slots.some((s) => s.start === start)) return json({ ok: false, error: 'taken' }, 409);
    const end = start + S.duration * 60000;
    try { await env.DB.prepare('UPDATE bookings SET start_utc = ?, end_utc = ?, reminded_day = 0, reminded_hour = 0, updated_at = ? WHERE id = ?').bind(start, end, now, b.id).run(); }
    catch { return json({ ok: false, error: 'taken' }, 409); }
    if (b.gcal_id) await moveEvent(env, b.gcal_id, start, end);
    await confirmMails(env, { ...mail, start, end }, 'deplace');
    await audit(env, 'deplacement', b.id, { de: b.start_utc, vers: start });
    return json({ ok: true, booking: view({ ...b, start_utc: start, end_utc: end }) });
  }
  return json({ ok: false, error: 'bad_request' }, 400);
};
