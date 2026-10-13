/* E-mails liés aux rendez-vous : confirmation (avec .ics et lien pour déplacer ou annuler), déplacement,
   annulation, rappels, et notification interne. */
import { type Env, siteUrl } from './env';
import { sendMail, layout, signature, internalTo } from './email';
import { ics, b64 } from './ics';
import { labelFr } from './tz';
import { ENJEUX, priorite } from './validate';
import type { Utm } from './validate';

export interface BookingMail { id: string; token: string; start: number; end: number; nom: string; email: string; tel: string; entreprise: string; enjeu: string; campagnes: string; format: string; meet: string | null; utm: Utm; sequence?: number }
type Kind = 'nouveau' | 'deplace' | 'annule' | 'rappel-veille' | 'rappel-heure';

export async function confirmMails(env: Env, b: BookingMail, kind: Kind): Promise<void> {
  const label = labelFr(b.start), manage = `${siteUrl(env)}/diagnostic/rendez-vous/?t=${b.token}`;
  const prenom = b.nom.split(/\s+/)[0] ?? b.nom;
  const lieu = b.format === 'Visio' ? (b.meet ? `En visio : ${b.meet}` : 'En visio : le lien vous parvient avec l\'invitation.') : `Par téléphone : nous vous appelons${b.tel ? ' au ' + b.tel : ''}.`;
  const enjeu = ENJEUX[b.enjeu]?.merci ?? b.enjeu;
  const file = ics({ uid: b.id, start: b.start, end: b.end, summary: 'Diagnostic Leadvice', description: `${lieu}\nDéplacer ou annuler : ${manage}`, url: manage, organizer: internalTo(env), method: kind === 'annule' ? 'CANCEL' : 'REQUEST', sequence: b.sequence ?? (kind === 'deplace' ? 1 : 0) });
  const att = kind === 'rappel-veille' || kind === 'rappel-heure' ? [] : [{ filename: 'diagnostic-leadvice.ics', content: b64(file) }];
  const T: Record<Kind, { s: string; p: string[] }> = {
    nouveau: { s: `Votre diagnostic Leadvice : ${label}`, p: [`Bonjour ${prenom},`, `C'est réservé : ${label}, heure de Casablanca, pour 45 minutes.`, lieu, `Votre enjeu : ${enjeu}. Nous regarderons ensemble vos campagnes, vos chiffres et votre offre.`, 'Le rendez-vous est joint à cet e-mail pour votre agenda. Un rappel vous parvient la veille.'] },
    deplace: { s: `Diagnostic déplacé : ${label}`, p: [`Bonjour ${prenom},`, `Votre diagnostic est déplacé au ${label}, heure de Casablanca.`, lieu] },
    annule: { s: 'Votre diagnostic est annulé', p: [`Bonjour ${prenom},`, `Votre diagnostic du ${label} est annulé. Vous pouvez réserver un autre créneau quand vous le souhaitez.`] },
    'rappel-veille': { s: `Demain : votre diagnostic Leadvice, ${label}`, p: [`Bonjour ${prenom},`, `Rappel : votre diagnostic a lieu demain, ${label}, heure de Casablanca.`, lieu] },
    'rappel-heure': { s: 'Dans une heure : votre diagnostic Leadvice', p: [`Bonjour ${prenom},`, `Votre diagnostic commence dans une heure, ${label}.`, lieu] },
  };
  const t = T[kind];
  const paras = [...t.p, signature()];
  const cta = kind === 'annule' ? { label: 'Réserver un autre créneau', url: `${siteUrl(env)}/diagnostic/` } : { label: 'Déplacer ou annuler', url: manage };
  await sendMail(env, b.email, t.s, paras.join('\n\n') + `\n\n${cta.label} : ${cta.url}`, layout(paras, cta), att, internalTo(env));
  if (kind === 'rappel-veille' || kind === 'rappel-heure') return;
  const prio = priorite({ campagnes: b.campagnes });
  const lines = [`Rendez-vous : ${label} (${b.format})`, `Statut : ${kind === 'nouveau' ? 'nouvelle réservation' : kind === 'deplace' ? 'déplacé' : 'annulé'}`, `Enjeu : ${ENJEUX[b.enjeu]?.label ?? b.enjeu}`, `Entreprise : ${b.entreprise}`, `Campagnes aujourd'hui : ${b.campagnes}`, `Nom : ${b.nom}`, `E-mail : ${b.email}`, `Téléphone : ${b.tel || 'non indiqué'}`,
    ...Object.entries(b.utm).map(([k, v]) => `${k} : ${v}`), `Version du site : ${env.SITE_VERSION ?? 'b7'}`];
  const subj = `[Diagnostic — ${prio === 'haute' ? 'Priorité haute' : 'À qualifier'}] ${b.entreprise} · ${kind === 'nouveau' ? label : kind === 'deplace' ? 'déplacé au ' + label : 'annulé'}`;
  await sendMail(env, internalTo(env), subj, lines.join('\n'), layout(lines), att, b.email);
}
