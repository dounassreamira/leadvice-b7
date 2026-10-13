/* GET /api/slots?from=AAAA-MM-JJ&to=AAAA-MM-JJ : créneaux libres (règles, moins réservations, moins agenda Google). */
import { json, type Env } from '../../server/env';
import { computeSlots } from '../../server/slots';
import { bookedBetween, getSettings } from '../../server/db';
import { freeBusy } from '../../server/gcal';
import { TZ } from '../../server/tz';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const u = new URL(request.url);
  const S = await getSettings(env);
  const now = Date.now();
  const horizonEnd = now + (S.horizon + 2) * 86400e3;
  const [booked, busy] = await Promise.all([bookedBetween(env, now, horizonEnd), freeBusy(env, now, horizonEnd)]);
  const days = computeSlots(S, now, booked, busy ?? [], u.searchParams.get('from') ?? undefined, u.searchParams.get('to') ?? undefined);
  return json({ tz: TZ, duration: S.duration, calendar: busy !== null, days: days.map((d) => ({ date: d.date, slots: d.slots.map((s) => ({ start: new Date(s.start).toISOString(), min: s.min, label: s.label })) })) }, 200, { 'Cache-Control': 'no-store' });
};
