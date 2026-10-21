/* POST /api/lead : inscription à une ressource (exemple de plan, guide, lettre).
   Champ piège, validation, enregistrement D1 (une ligne par e-mail et par ressource), source UTM conservée,
   e-mail interne, et transfert facultatif vers l'outil d'envoi (Brevo) si la clé est configurée. */
import { json, readForm, randomToken, siteUrl, str, type Env } from '../../server/env';
import { sendMail, layout, signature, internalTo } from '../../server/email';

type LeadEnv = Env & { BREVO_API_KEY?: string; BREVO_LIST_ID?: string };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onRequestPost: PagesFunction<LeadEnv> = async ({ request, env }) => {
  const { data, html } = await readForm(request);
  /* sans JavaScript, le formulaire est posté directement : on renvoie vers la page d'origine ou vers la page d'erreur */
  const from = /^\/[a-z0-9/_-]*$/i.test(str(data.page, 200)) ? str(data.page, 200) : '/ressources/';
  const back = (q: string): Response => Response.redirect(siteUrl(env) + q, 303);
  if (str(data.site)) return html ? back(from + '?inscrit=1') : json({ ok: true }); // champ piège rempli : on ne fait rien
  const email = str(data.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return html ? back('/erreur/?code=400') : json({ ok: false, error: 'email' }, 422);
  const v = {
    email, prenom: str(data.prenom, 80), magnet: str(data.magnet, 60) || 'lettre', interets: str(data.interets, 200),
    lettre: data.lettre === '1' || data.lettre === true || str(data.magnet, 60) === 'lettre',
    fichier: /^\/ressources\/[a-z0-9._-]+$/i.test(str(data.fichier, 200)) ? str(data.fichier, 200) : '',
    source: str(data.source, 80) || 'site', campagne: str(data.campagne, 120), page: str(data.page, 200),
  };
  if (!env.DB && !env.RESEND_API_KEY && !env.BREVO_API_KEY) return html ? back('/erreur/?code=503') : json({ ok: false, error: 'not_configured' }, 503);
  let fresh = true; // une seule réponse automatique par adresse et par ressource (évite d'utiliser le formulaire pour inonder une boîte)
  if (env.DB) {
    try {
      const res = await env.DB.prepare('INSERT OR IGNORE INTO leads (id, email, prenom, magnet, interets, source, campagne, page, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(randomToken(8), v.email, v.prenom, v.magnet, [v.interets, v.lettre ? 'lettre mensuelle' : ''].filter(Boolean).join(', '), v.source, v.campagne, v.page, new Date().toISOString()).run();
      fresh = (res.meta?.changes ?? 1) > 0;
    } catch { /* table créée par migrations/0002_leads.sql */ }
  }
  if (env.BREVO_API_KEY && env.BREVO_LIST_ID) {
    try {
      await fetch('https://api.brevo.com/v3/contacts', { method: 'POST', headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ email: v.email, attributes: { PRENOM: v.prenom, RESSOURCE: v.magnet, LETTRE: v.lettre, SOURCE: v.source, CAMPAGNE: v.campagne }, ...(v.lettre ? { listIds: [Number(env.BREVO_LIST_ID)] } : {}), updateEnabled: true }) });
    } catch { /* l'inscription reste enregistrée dans D1 */ }
  }
  /* accusé de réception au visiteur : il reçoit ce qui lui a été promis à l'écran */
  const base = siteUrl(env);
  const recu: Record<string, { sujet: string; texte: string[]; cta?: { label: string; url: string } }> = {
    'exemple-plan': { sujet: "Votre exemple de plan d'acquisition", texte: ["Bonjour,", "Voici l'exemple de plan que vous avez demandé. C'est la forme du document que nous écrivons après chaque diagnostic : ce qui freine vos ventes, puis ce qu'il faut changer, semaine par semaine. Les chiffres de l'exemple sont illustratifs.", "Si vous voulez le vôtre, le diagnostic dure 45 minutes et il est offert."], cta: { label: "Voir l'exemple de plan", url: base + '/diagnostic/#plan-exemple' } },
    lettre: { sujet: 'Votre inscription aux ressources Leadvice', texte: ["Bonjour,", "C'est noté : vous recevrez nos prochaines ressources dès leur sortie, puis une lettre par mois sur ce qui marche en acquisition au Maroc. Pour vous désinscrire, répondez simplement à cet e-mail."] },
  };
  const r = recu[v.magnet] ?? { sujet: 'Votre ressource Leadvice', texte: ["Bonjour" + (v.prenom ? ' ' + v.prenom : '') + ",", 'Merci pour votre demande. Voici votre ressource.' + (v.lettre ? " Vous recevrez aussi notre lettre mensuelle ; pour vous désinscrire, répondez simplement à cet e-mail." : '')], cta: v.fichier ? { label: 'Télécharger la ressource', url: base + v.fichier } : undefined };
  const corps = [...r.texte, ...(r.cta ? [r.cta.url] : []), signature()].join('\n\n');
  if (!fresh) return html ? back(from + '?inscrit=1') : json({ ok: true });
  await sendMail(env, v.email, r.sujet, corps, layout([...r.texte, signature()], r.cta), [], internalTo(env));

  const text = [['Ressource', v.magnet], ['Lettre mensuelle', v.lettre ? 'oui' : 'non'], ['E-mail', v.email], ['Prénom', v.prenom], ['Intérêts', v.interets], ['Source', v.source], ['Campagne', v.campagne], ['Page', v.page]]
    .filter(([, x]) => x).map(([k, x]) => `${k} : ${x}`).join('\n');
  await sendMail(env, internalTo(env), `[Ressource] ${v.magnet} · ${v.email}`, text, layout(text.split('\n')), [], v.email);
  return html ? back(from + '?inscrit=1') : json({ ok: true });
};
