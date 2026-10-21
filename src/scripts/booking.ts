/* Fenêtre de réservation du diagnostic : qualification, créneau (matin ou après-midi, tous les horaires libres),
   coordonnées, confirmation. <dialog> natif : focus piégé, Échap ferme, focus rendu au bouton d'origine.
   Les créneaux viennent de /api/slots, la réservation part vers /api/bookings. */
import { RM, announce } from './env';
import { readUtm } from './utm';
import { track, eventId, fbp } from './tracking';
import { hasAdConsent } from './consent';
import { mountTurnstile } from './turnstile';

type T = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
interface Slot { start: string; min: number; label: string }
interface Day { date: string; slots: Slot[] }
interface State { enjeu?: string; ent?: string; camp?: string; day?: string; slot?: Slot; label?: string; nom?: string; mail?: string; tel?: string; mode?: string; rappel?: boolean }

let txt: T | null = null;
let dlg: HTMLDialogElement | null = null;
let body: HTMLElement;
let st: State = {};
let opener: HTMLElement | null = null;
let days: Day[] | null = null;
const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
const otherTz = tzLocal !== 'Africa/Casablanca';
const dayParts = (k: string): { y: number; m: number; d: number; dow: number } => { const [y, m, d] = k.split('-').map(Number) as [number, number, number]; return { y, m, d, dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay() }; };
const dayLabel = (k: string): string => { const p = dayParts(k); return JOURS[p.dow] + ' ' + p.d + ' ' + MOIS[p.m - 1]; };
const localTime = (iso: string): string => new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso)).replace(':', ' h ');

async function texts(): Promise<T> {
  if (txt) return txt;
  const r = await fetch(new URL(/* @vite-ignore */ '../reservation.json', import.meta.url).href);
  txt = (await r.json()) as T;
  return txt;
}

function build(t: T): void {
  dlg = document.createElement('dialog');
  dlg.className = 'bk';
  dlg.setAttribute('aria-labelledby', 'bk-t');
  dlg.innerHTML = '<div class="bk-in"><div class="bk-side"><h2 id="bk-t">' + esc(t.titre) + '</h2><p>' + esc(t.texte) + '</p>' +
    '<div class="bk-sum"><div><span>' + esc(t.resume.duree) + '</span><b>' + esc(t.resume.duree_v) + '</b></div><div><span>' + esc(t.resume.creneau) + '</span><b id="bk-c">' + esc(t.resume.creneau_v) + '</b></div><div><span>' + esc(t.resume.fuseau) + '</span><b>' + esc(t.resume.fuseau_v) + '</b></div></div></div>' +
    '<div class="bk-main"><button class="bk-x" type="button" aria-label="' + esc(t.fermer) + '"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="bk-steps" aria-hidden="true"><b class="on"></b><b></b><b></b></div><p class="legend" id="bk-l" aria-live="polite"></p><div id="bk-body"></div></div></div>';
  document.body.appendChild(dlg);
  body = dlg.querySelector<HTMLElement>('#bk-body')!;
  dlg.querySelector('.bk-x')!.addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => { window.__lenis?.start(); document.documentElement.style.overflow = ''; opener?.focus(); });
}

function steps(n: number): void {
  const t = txt!;
  dlg!.querySelectorAll('.bk-steps b').forEach((b, i) => b.classList.toggle('on', i < n));
  dlg!.querySelector('#bk-l')!.textContent = n <= 3 ? String(t.etape).replace('{n}', String(n)) : t.reserve;
}
function err(msg: string, extra = ''): void {
  let e = body.querySelector<HTMLElement>('.err');
  if (!e) { e = document.createElement('div'); e.className = 'err'; e.setAttribute('role', 'alert'); body.appendChild(e); }
  e.innerHTML = '<p>' + esc(msg) + '</p>' + extra;
}
function focusFirst(): void { body.querySelector<HTMLElement>('h3')?.setAttribute('tabindex', '-1'); body.querySelector<HTMLElement>('input, select, button')?.focus(); }

function s1(): void {
  const t = txt!, e = t.e1;
  steps(1);
  body.innerHTML = '<h3>' + esc(e.titre) + '</h3><div class="chips" role="radiogroup" aria-label="' + esc(e.titre) + '">' +
    (t.enjeux as T[]).map((x, i) => '<label class="chip"><input type="radio" name="bk-e" id="bk-e' + i + '" value="' + x.cle + '"' + (st.enjeu === x.cle ? ' checked' : '') + '><span>' + esc(x.nom) + '</span></label>').join('') + '</div>' +
    '<div class="fld"><label for="bk-ent">' + esc(e.entreprise) + '</label><input id="bk-ent" autocomplete="organization" value="' + esc(st.ent ?? '') + '"></div>' +
    '<div class="fld"><label for="bk-camp">' + esc(e.campagnes) + '</label><select id="bk-camp"><option value="">' + esc(e.campagnes_choix) + '</option>' + (t.campagnes as string[]).map((c) => '<option' + (st.camp === c ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select></div>' +
    '<div class="bk-nav"><span></span><button class="btn btn-main" type="button" id="bk-n">' + esc(e.suivant) + '</button></div>';
  body.querySelector('#bk-n')!.addEventListener('click', () => {
    const en = body.querySelector<HTMLInputElement>('input[name="bk-e"]:checked'), ent = body.querySelector<HTMLInputElement>('#bk-ent')!, camp = body.querySelector<HTMLSelectElement>('#bk-camp')!;
    if (!en) { body.querySelector<HTMLInputElement>('input[name="bk-e"]')?.focus(); return err(e.err_enjeu); }
    if (!ent.value.trim()) { ent.focus(); ent.setAttribute('aria-invalid', 'true'); return err(e.err_entreprise); }
    if (!camp.value) { camp.focus(); camp.setAttribute('aria-invalid', 'true'); return err(e.err_campagnes); }
    st.enjeu = en.value; st.ent = ent.value.trim(); st.camp = camp.value;
    track('qualify_lead', { enjeu: st.enjeu, campagnes: st.camp });
    void s2();
  });
}

async function loadSlots(force = false): Promise<Day[] | null> {
  if (days && !force) return days;
  try {
    const r = await fetch('/api/slots', { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(String(r.status));
    days = ((await r.json()) as { days: Day[] }).days;
    return days;
  } catch { return null; }
}

async function s2(force = false, msg = ''): Promise<void> {
  const t = txt!, e = t.e2;
  steps(2);
  body.innerHTML = '<h3>' + esc(e.titre) + '</h3><p class="small bk-help">' + esc(e.aide) + '</p><div class="bk-load" aria-label="' + esc(e.chargement) + '"><i></i><i></i><i></i></div>';
  focusFirst();
  const list = await loadSlots(force);
  if (!list || !list.some((d) => d.slots.length)) {
    body.innerHTML = '<h3>' + esc(e.titre) + '</h3><p class="bk-help">' + esc(e.aucun) + '</p><div class="bk-nav"><button class="btn btn-ghost" type="button" id="bk-b">' + esc(e.retour) + '</button><button class="btn btn-main" type="button" id="bk-r">' + esc(e.rappel) + '</button></div>';
    body.querySelector('#bk-b')!.addEventListener('click', s1);
    body.querySelector('#bk-r')!.addEventListener('click', () => { st.rappel = true; st.slot = undefined; s3(); });
    return;
  }
  const first = dayParts(list[0]!.date), pad = (first.dow + 6) % 7;
  let html = '<h3>' + esc(e.titre) + '</h3><p class="small bk-help">' + esc(e.aide) + '</p><div class="cal" role="group" aria-label="' + esc(e.calendrier) + '">' + (e.jours as string[]).map((j) => '<div class="h" aria-hidden="true">' + esc(j) + '</div>').join('');
  for (let p = 0; p < pad; p++) html += '<span></span>';
  list.forEach((d) => {
    const n = d.slots.length, p = dayParts(d.date);
    html += '<button type="button" data-k="' + d.date + '" class="' + (n ? 'av' : '') + (st.day === d.date ? ' sel' : '') + '"' + (n ? '' : ' disabled') + ' aria-pressed="' + (st.day === d.date) + '" aria-label="' + esc(dayLabel(d.date)) + ', ' + (n ? n + ' ' + (n > 1 ? e.creneaux : e.creneau) : e.complet) + '">' + p.d + '</button>';
  });
  html += '</div><div id="bk-sl"></div><p class="bk-alt"><button type="button" class="tlink" id="bk-r">' + esc(e.rappel) + '</button></p><div class="bk-nav"><button class="btn btn-ghost" type="button" id="bk-b">' + esc(e.retour) + '</button><button class="btn btn-main" type="button" id="bk-n">' + esc(e.suivant) + '</button></div>';
  body.innerHTML = html;
  if (msg) err(msg);
  const showSlots = (k: string, per?: 'am' | 'pm'): void => {
    const d = list.find((x) => x.date === k)!;
    const P = { am: d.slots.filter((s) => s.min < 780), pm: d.slots.filter((s) => s.min >= 780) };
    const cur = per ?? (st.day === k && st.slot ? (st.slot.min < 780 ? 'am' : 'pm') : P.am.length ? 'am' : 'pm');
    const tab = (id: 'am' | 'pm', lab: string): string => { const n = P[id].length; return '<button type="button" role="tab" data-p="' + id + '" aria-selected="' + (cur === id) + '"' + (n ? '' : ' disabled') + '>' + esc(lab) + ' <small>' + (n ? n + ' ' + (n > 1 ? e.creneaux : e.creneau) : e.complet) + '</small></button>'; };
    const label = dayLabel(k);
    body.querySelector('#bk-sl')!.innerHTML = '<div class="bk-day"><p>' + esc(label.charAt(0).toUpperCase() + label.slice(1)) + '</p><div class="per" role="tablist" aria-label="' + esc(e.moments) + '">' + tab('am', e.matin) + tab('pm', e.apres_midi) + '</div></div>' +
      '<div class="slots" role="tabpanel">' + P[cur].map((s) => '<button type="button" data-s="' + s.start + '" aria-pressed="' + (st.slot?.start === s.start) + '" class="' + (st.slot?.start === s.start ? 'sel' : '') + '">' + esc(s.label) + (otherTz ? '<span class="local">' + esc(String(e.local).replace('{h}', localTime(s.start))) + '</span>' : '') + '</button>').join('') + '</div>';
    body.querySelectorAll<HTMLButtonElement>('.per button').forEach((b) => b.addEventListener('click', () => showSlots(k, b.dataset.p as 'am' | 'pm')));
    body.querySelectorAll<HTMLButtonElement>('.slots button').forEach((b) => b.addEventListener('click', () => {
      const s = d.slots.find((x) => x.start === b.dataset.s)!;
      st.slot = s; st.day = k; st.label = dayLabel(k) + ' à ' + s.label;
      dlg!.querySelector('#bk-c')!.textContent = st.label;
      showSlots(k, cur);
      body.querySelector<HTMLButtonElement>('.slots button.sel')?.focus();
      announce(st.label);
    }));
  };
  body.querySelectorAll<HTMLButtonElement>('.cal button.av').forEach((b) => b.addEventListener('click', () => {
    body.querySelectorAll('.cal button').forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); });
    b.classList.add('sel'); b.setAttribute('aria-pressed', 'true');
    if (st.day !== b.dataset.k) st.slot = undefined;
    st.day = b.dataset.k;
    showSlots(st.day!);
  }));
  if (st.day && list.some((x) => x.date === st.day && x.slots.length)) showSlots(st.day);
  body.querySelector('#bk-b')!.addEventListener('click', s1);
  body.querySelector('#bk-r')!.addEventListener('click', () => { st.rappel = true; st.slot = undefined; s3(); });
  body.querySelector('#bk-n')!.addEventListener('click', () => { if (!st.slot || !st.day) return err(e.err); st.rappel = false; s3(); });
}

function s3(): void {
  const t = txt!, e = t.e3;
  steps(3);
  body.innerHTML = '<h3>' + esc(e.titre) + '</h3><p class="small bk-help">' + (st.rappel ? esc(e.choisi_rappel) : esc(e.choisi) + ' <b>' + esc(st.label ?? '') + '</b>') + '</p>' +
    '<div class="fld"><label for="bk-nom">' + esc(e.nom) + '</label><input id="bk-nom" autocomplete="name" value="' + esc(st.nom ?? '') + '"></div>' +
    '<div class="fld"><label for="bk-mail">' + esc(e.email) + '</label><input id="bk-mail" type="email" autocomplete="email" value="' + esc(st.mail ?? '') + '"></div>' +
    '<div class="fld"><label for="bk-tel">' + esc(e.tel) + ' <span class="opt">(facultatif)</span></label><input id="bk-tel" type="tel" autocomplete="tel" value="' + esc(st.tel ?? '') + '" aria-describedby="bk-tel-h"><span class="help" id="bk-tel-h">' + esc(e.tel_aide) + '</span></div>' +
    '<div class="fld"><label for="bk-mode">' + esc(e.format) + '</label><select id="bk-mode">' + (e.formats as string[]).map((f) => '<option' + (st.mode === f ? ' selected' : '') + '>' + esc(f) + '</option>').join('') + '</select></div>' +
    '<label class="consent bk-ok"><input type="checkbox" id="bk-ok"><span>' + esc(e.accord) + '</span></label>' +
    '<input class="hp" type="text" id="bk-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<div id="bk-ts"></div>' +
    '<div class="bk-nav"><button class="btn btn-ghost" type="button" id="bk-b">' + esc(e.retour) + '</button><button class="btn btn-main" type="button" id="bk-n">' + esc(st.rappel ? e.envoyer_rappel : e.envoyer) + '</button></div>';
  let getToken: () => string = () => '';
  void mountTurnstile(body.querySelector<HTMLElement>('#bk-ts')!).then((f) => { getToken = f; });
  body.querySelector('#bk-b')!.addEventListener('click', () => void s2());
  const go = body.querySelector<HTMLButtonElement>('#bk-n')!;
  const submit = async (): Promise<void> => {
    const nom = body.querySelector<HTMLInputElement>('#bk-nom')!, mail = body.querySelector<HTMLInputElement>('#bk-mail')!, tel = body.querySelector<HTMLInputElement>('#bk-tel')!;
    [nom, mail, tel].forEach((x) => x.removeAttribute('aria-invalid'));
    if (!nom.value.trim()) { nom.focus(); nom.setAttribute('aria-invalid', 'true'); return err(e.err_nom); }
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(mail.value.trim())) { mail.focus(); mail.setAttribute('aria-invalid', 'true'); return err(e.err_mail); }
    if (tel.value.trim() && tel.value.replace(/\D/g, '').length < 9) { tel.focus(); tel.setAttribute('aria-invalid', 'true'); return err(e.err_tel); }
    if (!body.querySelector<HTMLInputElement>('#bk-ok')!.checked) { body.querySelector<HTMLInputElement>('#bk-ok')!.focus(); return err(e.err_accord); }
    st.nom = nom.value.trim(); st.mail = mail.value.trim(); st.tel = tel.value.trim(); st.mode = body.querySelector<HTMLSelectElement>('#bk-mode')!.value;
    go.disabled = true; go.classList.add('is-loading'); go.innerHTML = '<span class="spin" aria-hidden="true"></span>' + esc(e.envoi);
    const evLead = eventId('generate_lead'), evSched = eventId('schedule');
    if (st.rappel) {
      /* sans créneau : la demande part comme le formulaire court, l'équipe propose un horaire */
      let r: Response | null = null;
      try {
        r = await fetch('/api/diagnostic', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ court: '1', enjeu: st.enjeu, entreprise: st.ent, campagnes: st.camp, nom: st.nom, email: st.mail, tel: st.tel, consent: true, message: 'Format souhaité : ' + st.mode, utm: readUtm(), site_web: body.querySelector<HTMLInputElement>('#bk-hp')!.value, 'cf-turnstile-response': getToken(), event_id: evLead, consent_pub: hasAdConsent() }) });
      } catch { r = null; }
      go.disabled = false; go.classList.remove('is-loading'); go.textContent = e.envoyer_rappel;
      if (!r || !r.ok) { err(e.err_envoi); return; }
      const j = (await r.json().catch(() => ({}))) as { redirect?: string };
      track('generate_lead', { enjeu: st.enjeu, campagnes: st.camp }, evLead);
      location.href = j.redirect ?? '/diagnostic/merci/?enjeu=' + encodeURIComponent(st.enjeu ?? '');
      return;
    }
    let res: Response | null = null;
    try {
      res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ enjeu: st.enjeu, entreprise: st.ent, campagnes: st.camp, nom: st.nom, email: st.mail, tel: st.tel, format: st.mode, consent: true, start: st.slot!.start, utm: readUtm(), site_web: body.querySelector<HTMLInputElement>('#bk-hp')!.value, turnstile: getToken(), event_lead: evLead, event_schedule: evSched, consent_pub: hasAdConsent(), fbp: fbp() }) });
    } catch { res = null; }
    go.disabled = false; go.classList.remove('is-loading'); go.textContent = e.envoyer;
    if (res?.status === 409) { st.slot = undefined; days = null; dlg!.querySelector('#bk-c')!.textContent = txt!.resume.creneau_v; void s2(true, e.err_pris); return; }
    if (!res || !res.ok) {
      err(e.err_envoi, '<div class="bk-nav"><button class="btn btn-ghost" type="button" data-retry>' + esc(e.reessayer) + '</button><button type="button" class="copy" data-copy="' + esc(t.email) + '" data-done="' + esc(e.copie) + '"><span class="copy-l">' + esc(e.copier) + '</span></button></div>');
      body.querySelector('[data-retry]')?.addEventListener('click', () => void submit());
      return;
    }
    const j = (await res.json()) as { label?: string };
    track('generate_lead', { enjeu: st.enjeu, campagnes: st.camp }, evLead);
    track('schedule', { enjeu: st.enjeu, format: st.mode }, evSched);
    done(j.label || st.label || '');
  };
  go.addEventListener('click', () => void submit());
  focusFirst();
}

function done(label: string): void {
  const t = txt!, f = t.fin;
  steps(4);
  const l = label.charAt(0).toUpperCase() + label.slice(1);
  body.innerHTML = '<div class="bk-ok"><h3 tabindex="-1">' + esc(f.titre) + '</h3><svg viewBox="0 0 600 90" aria-hidden="true"><path id="bk-p" d="M10 70 C 120 70, 150 20, 260 28 S 430 80, 590 22" fill="none" stroke="#6B4EFF" stroke-width="2"/><circle cx="590" cy="22" r="6" fill="#6B4EFF"/></svg>' +
    '<p class="big-text bk-big">' + esc(l) + ', ' + esc(f.en) + ' ' + esc((st.mode ?? '').toLowerCase()) + '.</p>' +
    '<p class="bk-help">' + esc(String(f.texte).replace('{enjeu}', f.enjeux[st.enjeu ?? 'autre'] ?? '').replace('{mail}', st.mail ?? '')) + '</p>' +
    '<div class="bk-nav"><a class="tlink" href="/insights/">' + esc(f.lire) + '</a><button class="btn btn-ghost" type="button" id="bk-f">' + esc(f.fermer) + '</button></div></div>';
  const p = body.querySelector<SVGPathElement>('#bk-p')!, L = p.getTotalLength();
  p.style.strokeDasharray = String(L); p.style.strokeDashoffset = String(RM ? 0 : L);
  if (!RM) requestAnimationFrame(() => { p.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1)'; p.style.strokeDashoffset = '0'; });
  body.querySelector('#bk-f')!.addEventListener('click', close);
  body.querySelector<HTMLElement>('h3')!.focus();
}

function close(): void { dlg?.close(); }

export async function openBooking(a: HTMLElement): Promise<void> {
  const t = await texts().catch(() => null);
  if (!t) { location.href = '/diagnostic/'; return; }
  if (!dlg) build(t);
  opener = a;
  st = {};
  days = null;
  dlg!.querySelector('#bk-c')!.textContent = t.resume.creneau_v;
  track('begin_diagnostic', { page: location.pathname });
  s1();
  dlg!.showModal();
  window.__lenis?.stop();
  focusFirst();
  void loadSlots();
}
