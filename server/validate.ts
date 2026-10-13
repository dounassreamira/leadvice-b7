/* Validation côté serveur, messages humains, qualification interne (jamais affichée). */
import { str } from './env';

export const ENJEUX: Record<string, { label: string; merci: string }> = {
  leads: { label: 'Générer plus de leads qualifiés', merci: 'générer plus de leads qualifiés' },
  conv: { label: 'Améliorer la conversion', merci: 'transformer plus de contacts en clients' },
  strat: { label: 'Clarifier la stratégie', merci: 'savoir où aller, et par quoi commencer' },
  crea: { label: 'Renouveler la création', merci: 'trouver le message qui fait agir' },
  pilot: { label: 'Mieux piloter la performance', merci: 'transformer vos chiffres en décisions' },
  autre: { label: 'Autre', merci: 'noté, nous le regardons de près' },
};
export const SECTEURS = ['Immobilier', 'Banque et assurance', 'Éducation', 'Santé', 'Distribution', 'E-commerce', 'Industrie', 'Services B2B', 'Tourisme et transport', 'Autre'];
export const TAILLES = ['Moins de 10 salariés', '10 à 49', '50 à 249', '250 et plus'];
export const ROLES = ['Dirigeant(e)', 'Direction marketing', 'Direction commerciale', 'Autre'];
export const QUAND = ['Dès que possible', 'Dans les trois prochains mois', "Je me renseigne pour l'instant"];
export const CAMPAGNES = ['Aucune pour le moment', 'Gérées en interne', 'Gérées par une agence', 'Un peu des deux'];
export const FORMATS = ['Visio', 'Téléphone'];
export const ERR = {
  vide: 'Ce champ est nécessaire pour vous répondre.',
  choix: 'Choisissez une réponse pour continuer.',
  mail: 'Indiquez une adresse e-mail professionnelle, par exemple nom@entreprise.ma',
  tel: 'Indiquez un numéro joignable, par exemple +212 6 00 00 00 00',
  accord: 'Nous avons besoin de votre accord pour vous recontacter.',
};
export const MAIL_RE = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
export const telOk = (t: string): boolean => !t || t.replace(/\D/g, '').length >= 9;

export interface Utm { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string; gclid?: string; fbclid?: string; fbc?: string; landing?: string; referrer?: string }
export function cleanUtm(v: unknown): Utm {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const k = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'fbc', 'landing', 'referrer'] as const;
  const out: Utm = {};
  k.forEach((x) => { const s = str(o[x], 300); if (s) out[x] = s; });
  return out;
}

export interface Demande {
  enjeu: string; autre: string; entreprise: string; secteur: string; taille: string; role: string; quand: string; campagnes: string;
  nom: string; email: string; tel: string; message: string; consent: boolean; source: string; utm: Utm;
}
const pick = (v: unknown, list: string[]): string => { const s = str(v, 120); return list.includes(s) ? s : ''; };

/** Formulaire de diagnostic (pleine page ou version courte des landing pages). */
export function parseDemande(d: Record<string, unknown>, court: boolean): { v: Demande; errors: Record<string, string> } {
  const v: Demande = {
    enjeu: Object.keys(ENJEUX).includes(str(d.enjeu, 20)) ? str(d.enjeu, 20) : '',
    autre: str(d.autre, 300),
    entreprise: str(d.entreprise, 160),
    secteur: pick(d.secteur, SECTEURS),
    taille: pick(d.taille, TAILLES),
    role: pick(d.role, ROLES),
    quand: pick(d.quand, QUAND),
    campagnes: pick(d.campagnes, CAMPAGNES),
    nom: str(d.nom, 160),
    email: str(d.email, 200),
    tel: str(d.tel, 40),
    message: str(d.message, 3000),
    consent: d.consent === true || d.consent === 'on' || d.consent === '1' || d.consent === 'true',
    source: str(d.source, 120),
    utm: cleanUtm(typeof d.utm === 'string' ? safeParse(d.utm) : d.utm),
  };
  const e: Record<string, string> = {};
  if (!v.enjeu) e.enjeu = ERR.choix;
  if (!v.entreprise) e.entreprise = ERR.vide;
  if (!court) {
    if (!v.secteur) e.secteur = ERR.vide;
    if (!v.taille) e.taille = ERR.vide;
    if (!v.role) e.role = ERR.choix;
    if (!v.quand) e.quand = ERR.choix;
  }
  if (!v.campagnes) e.campagnes = ERR.choix;
  if (!v.nom) e.nom = ERR.vide;
  if (!MAIL_RE.test(v.email)) e.email = ERR.mail;
  if (!telOk(v.tel)) e.tel = ERR.tel;
  if (!v.consent) e.consent = ERR.accord;
  return { v, errors: e };
}
function safeParse(s: string): unknown { try { return JSON.parse(s); } catch { return {}; } }

/** Qualification interne : prioritaire si 50 salariés et plus, démarrage dès que possible ou campagnes déjà actives. */
export function priorite(v: { taille?: string; quand?: string; campagnes?: string }): 'haute' | 'a-qualifier' {
  const grande = v.taille === '50 à 249' || v.taille === '250 et plus';
  const vite = v.quand === 'Dès que possible';
  const actives = !!v.campagnes && v.campagnes !== 'Aucune pour le moment';
  return grande || vite || actives ? 'haute' : 'a-qualifier';
}
