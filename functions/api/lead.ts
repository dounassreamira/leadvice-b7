/* POST /api/lead : inscription à une ressource (exemple de plan, guide, lettre).
   Champ piège, validation, enregistrement D1 (une ligne par e-mail et par ressource), source UTM conservée,
   e-mail interne, et transfert facultatif vers l'outil d'envoi (Brevo) si la clé est configurée. */
import { json, readForm, randomToken, str, type Env } from '../../server/env';
import { sendMail, layout, internalTo } from '../../server/email';

type LeadEnv = Env & { BREVO_API_KEY?: string; BREVO_LIST_ID?: string };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onRequestPost: PagesFunction<LeadEnv> = async ({ request, env }) => {
  const { data } = await readForm(request);
  if (str(data.site)) return json({ ok: true }); // champ piège rempli : on ne fait rien
  const email = str(data.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: 'email' }, 422);
  const v = {
    email, prenom: str(data.prenom, 80), magnet: str(data.magnet, 60) || 'lettre', interets: str(data.interets, 200),
    source: str(data.source, 80) || 'site', campagne: str(data.campagne, 120), page: str(data.page, 200),
  };
  if (!env.DB && !env.RESEND_API_KEY && !env.BREVO_API_KEY) return json({ ok: false, error: 'not_configured' }, 503);
  if (env.DB) {
    try {
      await env.DB.prepare('INSERT OR IGNORE INTO leads (id, email, prenom, magnet, interets, source, campagne, page, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(randomToken(8), v.email, v.prenom, v.magnet, v.interets, v.source, v.campagne, v.page, new Date().toISOString()).run();
    } catch { /* table créée par migrations/0002_leads.sql */ }
  }
  if (env.BREVO_API_KEY && env.BREVO_LIST_ID) {
    try {
      await fetch('https://api.brevo.com/v3/contacts', { method: 'POST', headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ email: v.email, attributes: { PRENOM: v.prenom, RESSOURCE: v.magnet, SOURCE: v.source, CAMPAGNE: v.campagne }, listIds: [Number(env.BREVO_LIST_ID)], updateEnabled: true }) });
    } catch { /* l'inscription reste enregistrée dans D1 */ }
  }
  const text = [['Ressource', v.magnet], ['E-mail', v.email], ['Prénom', v.prenom], ['Intérêts', v.interets], ['Source', v.source], ['Campagne', v.campagne], ['Page', v.page]]
    .filter(([, x]) => x).map(([k, x]) => `${k} : ${x}`).join('\n');
  await sendMail(env, internalTo(env), `[Ressource] ${v.magnet} · ${v.email}`, text, layout(text.split('\n')), [], v.email);
  return json({ ok: true });
};
