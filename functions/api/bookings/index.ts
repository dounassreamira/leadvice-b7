/* POST /api/bookings : réservation d'un créneau. Le créneau est revérifié au moment d'écrire, et un index
   unique sur l'heure de début empêche toute double réservation. */
import { json, readJson, randomToken, siteUrl, str, type Env } from '../../../server/env';
import { ENJEUX, CAMPAGNES, FORMATS, MAIL_RE, telOk, cleanUtm, ERR } from '../../../server/validate';
import { turnstileOk } from '../../../server/turnstile';
import { computeSlots } from '../../../server/slots';
import { audit, bookedBetween, getSettings } from '../../../server/db';
import { freeBusy, createEvent } from '../../../server/gcal';
import { toLocal, ymd, labelFr } from '../../../server/tz';
import { capi } from '../../../server/capi';
import { confirmMails } from '../../../server/booking-mails';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const d = await readJson<Record<string, unknown>>(request);
  if (!d) return json({ ok: false, error: 'bad_request' }, 400);
  if (str(d.site_web)) return json({ ok: true, label: '' });
  if (!env.DB) return json({ ok: false, error: 'not_configured' }, 503);
  const v = {
    enjeu: Object.keys(ENJEUX).includes(str(d.enjeu, 20)) ? str(d.enjeu, 20) : '',
    entreprise: str(d.entreprise, 160), campagnes: CAMPAGNES.includes(str(d.campagnes, 80)) ? str(d.campagnes, 80) : '',
    nom: str(d.nom, 160), email: str(d.email, 200), tel: str(d.tel, 40), format: FORMATS.includes(str(d.format, 20)) ? str(d.format, 20) : 'Visio',
    consent: d.consent === true, start: Date.parse(str(d.start, 40)), utm: cleanUtm(d.utm),
  };
  const errors: Record<string, string> = {};
  if (!v.enjeu) errors.enjeu = ERR.choix;
  if (!v.entreprise) errors.entreprise = ERR.vide;
  if (!v.campagnes) errors.campagnes = ERR.choix;
  if (!v.nom) errors.nom = ERR.vide;
  if (!MAIL_RE.test(v.email)) errors.email = ERR.mail;
  if (!telOk(v.tel)) errors.tel = ERR.tel;
  if (!v.consent) errors.consent = ERR.accord;
  if (!isFinite(v.start)) errors.start = 'Choisissez un jour puis un horaire.';
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422);
  if (!(await turnstileOk(env, str(d.turnstile, 2048), request.headers.get('CF-Connecting-IP')))) return json({ ok: false, error: 'robot' }, 403);

  // le créneau est-il toujours libre ?
  const S = await getSettings(env);
  const now = Date.now(), day = ymd(toLocal(v.start));
  const [booked, busy] = await Promise.all([bookedBetween(env, v.start - 86400e3, v.start + 86400e3), freeBusy(env, v.start - 86400e3, v.start + 86400e3)]);
  const free = computeSlots(S, now, booked, busy ?? [], day, day)[0]?.slots.some((s) => s.start === v.start);
  if (!free) return json({ ok: false, error: 'taken' }, 409);

  const id = randomToken(8), token = randomToken(24), end = v.start + S.duration * 60000, iso = new Date(now).toISOString();
  try {
    await env.DB.prepare('INSERT INTO bookings (id, start_utc, end_utc, status, nom, email, tel, entreprise, enjeu, campagnes, format, utm, token, version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, v.start, end, 'confirmed', v.nom, v.email, v.tel, v.entreprise, v.enjeu, v.campagnes, v.format, JSON.stringify(v.utm), token, env.SITE_VERSION ?? 'b7', iso, iso).run();
  } catch {
    return json({ ok: false, error: 'taken' }, 409); // l'index unique a refusé : quelqu'un vient de prendre ce créneau
  }
  const label = labelFr(v.start);
  const ev = await createEvent(env, { id, start: v.start, end, summary: `Diagnostic Leadvice, ${v.entreprise}`, description: `${ENJEUX[v.enjeu]?.label}\n${v.nom}, ${v.email}${v.tel ? ', ' + v.tel : ''}\nCampagnes : ${v.campagnes}\nFormat : ${v.format}`, attendee: v.email, visio: v.format === 'Visio' });
  if (ev) await env.DB.prepare('UPDATE bookings SET gcal_id = ?, meet = ? WHERE id = ?').bind(ev.id, ev.meet ?? null, id).run();
  await confirmMails(env, { id, token, start: v.start, end, nom: v.nom, email: v.email, tel: v.tel, entreprise: v.entreprise, enjeu: v.enjeu, campagnes: v.campagnes, format: v.format, meet: ev?.meet ?? null, utm: v.utm }, 'nouveau');
  await audit(env, 'reservation', id, { start: v.start, label });
  const consent = d.consent_pub === true;
  const value = ({ 'Aucune pour le moment': 1, 'Gérées en interne': 2, 'Gérées par une agence': 3, 'Un peu des deux': 3 } as Record<string, number>)[v.campagnes] ?? 1;
  const user = { email: v.email, tel: v.tel, externalId: id, fbc: v.utm.fbc, fbp: str(d.fbp, 120), ip: request.headers.get('CF-Connecting-IP'), ua: request.headers.get('User-Agent') };
  await Promise.all([
    capi(env, 'Lead', str(d.event_lead, 80) || 'lead-' + id, user, { value, currency: 'MAD', enjeu: v.enjeu }, siteUrl(env) + '/', consent),
    capi(env, 'Schedule', str(d.event_schedule, 80) || 'schedule-' + id, user, { enjeu: v.enjeu }, siteUrl(env) + '/', consent),
  ]);
  return json({ ok: true, id, label, format: v.format, manage: `${siteUrl(env)}/diagnostic/rendez-vous/?t=${token}` });
};
