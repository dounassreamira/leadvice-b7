/* POST /api/admin/bookings/:id : { action: 'cancel' } ; { action: 'move', start } ; { action: 'tenu', value } ;
   { action: 'signe', value }. « Diagnostic tenu » et « Client signé » envoient les événements hors ligne
   (QualifiedLead, Purchase) à l'API Conversions de Meta. */
import { json, readJson, siteUrl, str, type Env } from '../../../../server/env';
import { audit, type Booking } from '../../../../server/db';
import { cancelEvent, moveEvent } from '../../../../server/gcal';
import { confirmMails } from '../../../../server/booking-mails';
import { capi } from '../../../../server/capi';

export const onRequestPost: PagesFunction<Env, 'id'> = async ({ request, env, params, data }) => {
  if (!env.DB) return json({ ok: false, error: 'not_configured' }, 503);
  const b = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(String(params.id)).first<Booking>();
  if (!b) return json({ ok: false, error: 'not_found' }, 404);
  const d = (await readJson<Record<string, unknown>>(request)) ?? {};
  const now = new Date().toISOString(), who = String((data as { user?: string }).user ?? '');
  const mail = { id: b.id, token: b.token, start: b.start_utc, end: b.end_utc, nom: b.nom, email: b.email, tel: b.tel, entreprise: b.entreprise, enjeu: b.enjeu, campagnes: b.campagnes, format: b.format, meet: b.meet, utm: JSON.parse(b.utm || '{}') };
  if (d.action === 'cancel') {
    await env.DB.prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?").bind(now, b.id).run();
    if (b.gcal_id) await cancelEvent(env, b.gcal_id);
    await confirmMails(env, mail, 'annule');
    await audit(env, 'annulation', b.id, { par: who });
    return json({ ok: true });
  }
  if (d.action === 'move') {
    const start = Date.parse(str(d.start, 40)), end = start + (b.end_utc - b.start_utc);
    if (!isFinite(start)) return json({ ok: false, error: 'bad_request' }, 400);
    try { await env.DB.prepare('UPDATE bookings SET start_utc = ?, end_utc = ?, reminded_day = 0, reminded_hour = 0, updated_at = ? WHERE id = ?').bind(start, end, now, b.id).run(); }
    catch { return json({ ok: false, error: 'taken' }, 409); }
    if (b.gcal_id) await moveEvent(env, b.gcal_id, start, end);
    await confirmMails(env, { ...mail, start, end }, 'deplace');
    await audit(env, 'deplacement', b.id, { par: who, vers: start });
    return json({ ok: true });
  }
  if (d.action === 'tenu' || d.action === 'signe') {
    const value = Math.max(0, Number(d.value) || 0);
    await env.DB.prepare('UPDATE bookings SET outcome = ?, value = ?, updated_at = ? WHERE id = ?').bind(d.action, value || null, now, b.id).run();
    const utm = mail.utm as { fbc?: string };
    const sent = await capi(env, d.action === 'tenu' ? 'QualifiedLead' : 'Purchase', `${d.action}-${b.id}`, { email: b.email, tel: b.tel, externalId: b.id, fbc: utm.fbc }, { value, currency: 'MAD' }, siteUrl(env) + '/diagnostic/', true);
    await audit(env, d.action, b.id, { par: who, value, envoye: sent });
    return json({ ok: true, sent });
  }
  return json({ ok: false, error: 'bad_request' }, 400);
};
