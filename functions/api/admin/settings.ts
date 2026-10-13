/* GET / PUT /api/admin/settings : horaires, durée, pause, délai minimal, horizon, maximum par jour,
   jours bloqués, créneaux exceptionnels. */
import { json, readJson, type Env } from '../../../server/env';
import { audit, getSettings, saveSettings } from '../../../server/db';
import { sanitize, type Settings } from '../../../server/slots';
import { calendarStatus } from '../../../server/gcal';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => json({
  ok: true, settings: await getSettings(env),
  status: { db: !!env.DB, calendar: await calendarStatus(env), email: !!env.RESEND_API_KEY, capi: !!(env.META_CAPI_TOKEN && env.PUBLIC_META_PIXEL_ID), turnstile: !!env.TURNSTILE_SECRET_KEY },
});

export const onRequestPut: PagesFunction<Env> = async ({ request, env, data }) => {
  const body = await readJson<Partial<Settings>>(request);
  if (!body) return json({ ok: false, error: 'bad_request' }, 400);
  if (!env.DB) return json({ ok: false, error: 'not_configured' }, 503);
  const s = sanitize(body);
  await saveSettings(env, s);
  await audit(env, 'reglages', String((data as { user?: string }).user ?? ''), s);
  return json({ ok: true, settings: s });
};
