/* POST /api/diagnostic : formulaire de diagnostic (pleine page, landing pages, ou sans JavaScript).
   Validation, Turnstile et champ piège, qualification interne, e-mail à Leadvice et accusé de réception. */
import { json, readForm, randomToken, siteUrl, str, type Env } from '../../server/env';
import { parseDemande, priorite, ENJEUX } from '../../server/validate';
import { turnstileOk } from '../../server/turnstile';
import { sendMail, layout, signature, internalTo } from '../../server/email';
import { capi } from '../../server/capi';
import { audit } from '../../server/db';
import { labelFr } from '../../server/tz';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { data, html } = await readForm(request);
  const back = (q: string): Response => Response.redirect(siteUrl(env) + q, 303);
  if (str(data.site_web)) return html ? back('/diagnostic/merci/') : json({ ok: true }); // champ piège rempli : on ne fait rien
  const court = data.court === '1' || data.court === true;
  const { v, errors } = parseDemande(data, court);
  if (Object.keys(errors).length) return html ? back('/diagnostic/#erreur-erreur') : json({ ok: false, errors }, 422);
  /* Sans JavaScript, le widget anti-robots ne peut pas s'afficher : la demande passe avec le seul champ piège
     et l'e-mail interne le signale. */
  const tk = str(data['cf-turnstile-response'], 2048), sansJs = html && !tk;
  if (!sansJs && !(await turnstileOk(env, tk, request.headers.get('CF-Connecting-IP')))) return html ? back('/diagnostic/#erreur-robot') : json({ ok: false, error: 'robot' }, 403);
  if (!env.RESEND_API_KEY && !env.DB) return html ? back('/diagnostic/#erreur-envoi') : json({ ok: false, error: 'not_configured' }, 503);

  const id = randomToken(8), prio = priorite(v), enjeu = ENJEUX[v.enjeu]?.label ?? v.enjeu;
  const now = Date.now();
  if (env.DB) {
    try { await env.DB.prepare('INSERT INTO requests (id, created_at, priorite, data) VALUES (?, ?, ?, ?)').bind(id, new Date(now).toISOString(), prio, JSON.stringify({ ...v, version: env.SITE_VERSION ?? 'b7' })).run(); } catch { /* table facultative */ }
  }
  const lines: [string, string][] = [
    ['Enjeu', enjeu + (v.autre ? ` (${v.autre})` : '')], ['Entreprise', v.entreprise], ['Secteur', v.secteur], ['Taille', v.taille], ['Rôle', v.role],
    ['Démarrage', v.quand], ['Campagnes aujourd\'hui', v.campagnes], ['Nom', v.nom], ['E-mail', v.email], ['Téléphone', v.tel], ['Message', v.message],
    ['Formulaire', v.source || (court ? 'landing page' : '/diagnostic/')], ['Page d\'entrée', v.utm.landing ?? ''], ['utm_source', v.utm.utm_source ?? ''], ['utm_medium', v.utm.utm_medium ?? ''],
    ['utm_campaign', v.utm.utm_campaign ?? ''], ['utm_term', v.utm.utm_term ?? ''], ['utm_content', v.utm.utm_content ?? ''], ['gclid', v.utm.gclid ?? ''], ['fbclid', v.utm.fbclid ?? ''],
    ['Vérification anti-robots', sansJs && env.TURNSTILE_SECRET_KEY ? 'non (envoi sans JavaScript)' : ''], ['Version du site', env.SITE_VERSION ?? 'b7'], ['Reçue le', labelFr(now) + ' (heure de Casablanca)'],
  ];
  const text = lines.filter(([, x]) => x).map(([k, x]) => `${k} : ${x}`).join('\n');
  const subject = `[Diagnostic — ${prio === 'haute' ? 'Priorité haute' : 'À qualifier'}] ${v.entreprise} · ${enjeu}`;
  const sentIn = await sendMail(env, internalTo(env), subject, text, layout(text.split('\n')), [], v.email);
  const prenom = v.nom.split(/\s+/)[0] ?? v.nom;
  const ack = `Bonjour ${prenom},\n\nMerci pour votre demande. Nous l'avons bien reçue et nous la lisons avec attention.\n\nNous revenons vers vous sous un jour ouvré pour fixer le créneau de votre diagnostic : 45 minutes, en visio ou par téléphone, pour regarder ensemble vos campagnes, vos chiffres et votre offre.\n\nVotre enjeu : ${ENJEUX[v.enjeu]?.merci ?? enjeu}.\n\n${signature()}`;
  await sendMail(env, v.email, 'Votre demande de diagnostic est bien reçue', ack, layout(ack.split('\n\n')), [], internalTo(env));
  await audit(env, 'demande', id, { prio, envoi: sentIn });
  const eventId = str(data.event_id, 80) || 'lead-' + id;
  await capi(env, 'Lead', eventId, { email: v.email, tel: v.tel, externalId: id, fbc: v.utm.fbc, ip: request.headers.get('CF-Connecting-IP'), ua: request.headers.get('User-Agent') }, { content_name: 'diagnostic', enjeu: v.enjeu, value: v.campagnes === 'Aucune pour le moment' ? 1 : 2, currency: 'MAD' }, siteUrl(env) + '/diagnostic/', data.consent_pub === true || data.consent_pub === '1');
  const merci = `/diagnostic/merci/?enjeu=${encodeURIComponent(v.enjeu)}`;
  return html ? back(merci) : json({ ok: true, redirect: merci });
};
