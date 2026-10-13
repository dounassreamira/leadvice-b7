/* Worker des rappels : toutes les 15 minutes, envoie le rappel de la veille (entre 24 h et 23 h avant)
   et celui d'une heure avant. Il partage la base D1 du site. */
import type { Env } from '../../server/env';
import type { Booking } from '../../server/db';
import { confirmMails } from '../../server/booking-mails';

async function run(env: Env): Promise<void> {
  if (!env.DB) return;
  const now = Date.now();
  const day = await env.DB.prepare("SELECT * FROM bookings WHERE status = 'confirmed' AND reminded_day = 0 AND start_utc BETWEEN ? AND ?").bind(now + 3600e3 * 2, now + 3600e3 * 24).all<Booking>();
  for (const b of day.results ?? []) {
    await confirmMails(env, { id: b.id, token: b.token, start: b.start_utc, end: b.end_utc, nom: b.nom, email: b.email, tel: b.tel, entreprise: b.entreprise, enjeu: b.enjeu, campagnes: b.campagnes, format: b.format, meet: b.meet, utm: {} }, 'rappel-veille');
    await env.DB.prepare('UPDATE bookings SET reminded_day = 1 WHERE id = ?').bind(b.id).run();
  }
  const hour = await env.DB.prepare("SELECT * FROM bookings WHERE status = 'confirmed' AND reminded_hour = 0 AND start_utc BETWEEN ? AND ?").bind(now, now + 3600e3 * 1.25).all<Booking>();
  for (const b of hour.results ?? []) {
    await confirmMails(env, { id: b.id, token: b.token, start: b.start_utc, end: b.end_utc, nom: b.nom, email: b.email, tel: b.tel, entreprise: b.entreprise, enjeu: b.enjeu, campagnes: b.campagnes, format: b.format, meet: b.meet, utm: {} }, 'rappel-heure');
    await env.DB.prepare('UPDATE bookings SET reminded_hour = 1, reminded_day = 1 WHERE id = ?').bind(b.id).run();
  }
}

export default {
  async scheduled(_e: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> { ctx.waitUntil(run(env)); },
} satisfies ExportedHandler<Env>;
