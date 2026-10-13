/* Formulaire de diagnostic : version pleine page (six étapes) et version courte des landing pages.
   Sans JavaScript, le formulaire s'envoie tel quel vers /api/diagnostic. Avec JavaScript : une question par
   écran, trajectoire d'étapes, validation à la sortie du champ puis à l'envoi, résumé des erreurs avec liens,
   sauvegarde dans la session, « Recommencer » et sortie de page confirmés, envoi avec états de chargement
   et d'erreur. */
import { RM, $, $$, announce } from './env';
import { readUtm } from './utm';
import { track, eventId, fbp } from './tracking';
import { hasAdConsent } from './consent';
import { mountTurnstile } from './turnstile';
import { confirmDialog } from './confirm';

type T = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const MAIL = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;
const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

export function initDiag(form: HTMLFormElement): void {
  const t = JSON.parse(form.dataset.t ?? '{}') as T;
  const court = form.dataset.court === '1';
  const KEY = 'lv-diag-' + (court ? location.pathname : 'page');
  const sets = $$<HTMLFieldSetElement>('fieldset[data-s]', form);
  const go = $<HTMLButtonElement>('[data-go]', form)!;
  const back = $<HTMLButtonElement>('[data-back]', form);
  const restart = $<HTMLButtonElement>('[data-restart]', form);
  const sum = $<HTMLElement>('[data-sum]', form)!;
  const stepl = $<HTMLElement>('[data-stepl]', form);
  const bars = $$('[data-track] b', form);
  const status = $<HTMLElement>('[data-status]', form)!;
  const ts = $<HTMLElement>('[data-turnstile]', form);
  let step = 1, started = false, sending = false, sent = false;
  let token: (() => string) | null = null;
  const touched = new Set<string>();
  form.noValidate = true;
  form.classList.add('is-js');

  /* ---------- valeurs, sauvegarde de la session ---------- */
  const values = (): Record<string, string> => {
    const o: Record<string, string> = {};
    new FormData(form).forEach((v, k) => { if (typeof v === 'string' && !['site_web', 'utm', 'event_id', 'consent_pub', 'cf-turnstile-response'].includes(k)) o[k] = v; });
    return o;
  };
  const save = (): void => { try { sessionStorage.setItem(KEY, JSON.stringify({ v: values(), step })); } catch { /* stockage indisponible : rien n'est perdu à l'écran */ } };
  const restore = (): void => {
    let d: { v: Record<string, string>; step: number } | null = null;
    try { d = JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); } catch { d = null; }
    if (!d) return;
    Object.entries(d.v).forEach(([k, v]) => {
      const els = $$<HTMLInputElement>(`[name="${CSS.escape(k)}"]`, form);
      els.forEach((el) => {
        if (el.type === 'radio') el.checked = el.value === v;
        else if (el.type === 'checkbox') el.checked = v === el.value;
        else if (el.type !== 'hidden') el.value = v;
      });
    });
    if (!court && d.step > 1 && d.step <= sets.length) step = d.step;
    started = Object.keys(d.v).some((k) => k !== 'court' && k !== 'source' && d!.v[k]);
  };

  /* ---------- « Autre » : précision facultative ---------- */
  const autreW = $<HTMLElement>('[data-autre]', form);
  const syncAutre = (): void => { if (autreW) autreW.hidden = (form.elements.namedItem('enjeu') as RadioNodeList | null)?.value !== 'autre'; };

  /* ---------- erreurs ---------- */
  const fieldWrap = (el: Element): HTMLElement | null => el.closest<HTMLElement>('.fld, .consent-w, fieldset');
  function clearErr(el: HTMLElement): void {
    el.removeAttribute('aria-invalid');
    const w = fieldWrap(el);
    w?.querySelector('.ferr')?.remove();
    const desc = (el.getAttribute('aria-describedby') ?? '').split(' ').filter((x) => x && !x.endsWith('-e')).join(' ');
    if (desc) el.setAttribute('aria-describedby', desc); else el.removeAttribute('aria-describedby');
  }
  function setErr(el: HTMLElement, msg: string): void {
    clearErr(el);
    el.setAttribute('aria-invalid', 'true');
    const p = document.createElement('p');
    p.className = 'ferr'; p.id = (el.id || el.getAttribute('name')) + '-e'; p.textContent = msg;
    const w = fieldWrap(el);
    const type = (el as HTMLInputElement).type;
    if (type === 'radio') w?.querySelector('.choices, .chips')?.after(p);
    else if (type === 'checkbox') w?.appendChild(p);
    else el.after(p);
    el.setAttribute('aria-describedby', ((el.getAttribute('aria-describedby') ?? '') + ' ' + p.id).trim());
  }
  /** Contrôle d'un champ ; renvoie le message d'erreur ou ''. */
  function check(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
    const v = el.value.trim(), E = t.erreurs;
    if (el instanceof HTMLInputElement && el.type === 'radio') return (form.elements.namedItem(el.name) as RadioNodeList).value ? '' : E.choix;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.required && !el.checked ? E.accord : '';
    if (el.required && !v) return el instanceof HTMLSelectElement && 'choix' in el.dataset ? E.choix : E.vide;
    if (el.type === 'email' && v && !MAIL.test(v)) return E.mail;
    if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 9) return E.tel;
    return '';
  }
  function validate(fs: HTMLElement[]): boolean {
    const errs: { el: HTMLElement; msg: string }[] = [];
    const seen = new Set<string>();
    fs.forEach((f) => $$<HTMLInputElement>('input, select, textarea', f).forEach((el) => {
      if (el.type === 'hidden' || el.closest('[hidden]') || el.closest('.hp')) return;
      if (el.type === 'radio') { if (seen.has(el.name)) return; seen.add(el.name); if (!el.required) return; }
      const msg = check(el);
      const target = el.type === 'radio' ? $$<HTMLInputElement>(`input[name="${el.name}"]`, form)[0]! : el;
      if (msg) { errs.push({ el: target, msg }); setErr(target, msg); } else clearErr(target);
    }));
    if (errs.length < 2) { sum.hidden = true; sum.innerHTML = ''; errs[0]?.el.focus(); return !errs.length; }
    sum.innerHTML = '<h3>' + esc(String(t.erreurs.resume).replace('{n}', String(errs.length))) + '</h3><ul>' +
      errs.map((x) => '<li><a href="#' + x.el.id + '">' + esc(x.msg) + '</a></li>').join('') + '</ul>';
    sum.hidden = false;
    errs[0]!.el.focus();
    return false;
  }
  sum.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    document.getElementById(a.hash.slice(1))?.focus();
  });
  form.addEventListener('focusout', (e) => {
    const el = e.target as HTMLInputElement;
    if (!el.name || el.type === 'radio' || el.type === 'hidden' || !touched.has(el.name)) return;
    const msg = check(el);
    if (msg) setErr(el, msg); else clearErr(el);
  });

  /* ---------- étapes ---------- */
  function show(focus = true): void {
    if (court) return;
    sets.forEach((s, i) => { s.hidden = i !== step - 1; });
    bars.forEach((b, i) => b.classList.toggle('on', i < step));
    if (stepl) stepl.textContent = String(t.etape).replace('{n}', String(step));
    if (back) back.hidden = step === 1;
    if (restart) restart.hidden = !started;
    go.textContent = step === sets.length ? t.boutons.envoyer : t.boutons.continuer;
    sum.hidden = true;
    if (step === sets.length && ts && !token) void mountTurnstile(ts).then((f) => { token = f; });
    if (focus) {
      const l = $<HTMLElement>('legend', sets[step - 1]!);
      if (l) { l.tabIndex = -1; l.focus({ preventScroll: true }); }
      const top = form.getBoundingClientRect().top + scrollY - 120;
      if (scrollY > top) scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
    }
  }

  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.name) touched.add(el.name);
    if (!started) { started = true; if (restart) restart.hidden = false; track('begin_diagnostic', { page: location.pathname, formulaire: court ? 'court' : 'complet' }); }
    if (el.getAttribute('aria-invalid') === 'true') { const msg = check(el); if (!msg) clearErr(el); }
    if (el.type === 'radio') { clearErr($$<HTMLInputElement>(`input[name="${el.name}"]`, form)[0]!); }
    if (el.name === 'enjeu') syncAutre();
    save();
  });
  form.addEventListener('change', () => save());

  back?.addEventListener('click', () => { step = Math.max(1, step - 1); show(); save(); });
  restart?.addEventListener('click', async () => {
    const R = t.recommencer;
    if (!(await confirmDialog({ titre: R.titre, texte: R.texte, ok: R.effacer, annuler: R.garder }))) return;
    form.reset();
    $$('.ferr', form).forEach((x) => x.remove());
    $$('[aria-invalid]', form).forEach((x) => x.removeAttribute('aria-invalid'));
    try { sessionStorage.removeItem(KEY); } catch { /* rien */ }
    started = false; step = 1; syncAutre(); show();
  });

  /* ---------- envoi ---------- */
  async function send(): Promise<void> {
    if (sending) return;
    sending = true;
    go.disabled = true;
    const label = go.textContent;
    go.textContent = t.boutons.envoi;
    go.setAttribute('aria-busy', 'true');
    status.hidden = true;
    const id = eventId('generate_lead');
    const data: Record<string, unknown> = { ...values(), court: court ? '1' : '0', utm: { ...readUtm(), fbp: fbp() }, event_id: id, consent_pub: hasAdConsent() ? '1' : '0', site_web: (form.elements.namedItem('site_web') as HTMLInputElement | null)?.value ?? '' };
    const tk = token?.() ?? ($<HTMLInputElement>('[name="cf-turnstile-response"]', form)?.value ?? '');
    if (tk) data['cf-turnstile-response'] = tk;
    let res: Response | null = null;
    try {
      res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
    } catch { res = null; }
    const j = res ? ((await res.json().catch(() => ({}))) as { ok?: boolean; redirect?: string; errors?: Record<string, string>; error?: string }) : {};
    sending = false;
    go.disabled = false;
    go.removeAttribute('aria-busy');
    go.textContent = label;
    if (res?.ok && j.ok) {
      sent = true;
      track('generate_lead', { enjeu: data.enjeu, campagnes: data.campagnes, formulaire: court ? 'court' : 'complet' }, id);
      try { sessionStorage.removeItem(KEY); } catch { /* rien */ }
      if (court) return done();
      location.href = j.redirect ?? '/diagnostic/merci/?enjeu=' + encodeURIComponent(String(data.enjeu ?? ''));
      return;
    }
    if (res?.status === 422 && j.errors) {
      /* le serveur a refusé une réponse : on revient à la première étape concernée */
      const names = Object.keys(j.errors);
      const idx = court ? 0 : sets.findIndex((s) => names.some((n) => s.querySelector(`[name="${n}"]`)));
      if (!court && idx >= 0) { step = idx + 1; show(false); }
      validate(court ? sets : [sets[step - 1]!]);
      return;
    }
    if (j.error === 'robot') { window.turnstile?.reset(); fail(t.erreurs.robot, false); return; }
    fail(t.erreurs.envoi, true);
  }
  function fail(msg: string, retry: boolean): void {
    status.hidden = false;
    status.innerHTML = '<p>' + esc(msg) + '</p><div class="st-acts">' +
      (retry ? '<button type="button" class="btn btn-ghost" data-retry>' + esc(t.erreurs.reessayer) + '</button>' : '') +
      '<button type="button" class="tlink copy" data-copy="contact@leadvice.org"><span class="copy-l">' + esc(t.erreurs.copier) + '</span></button></div>';
    status.querySelector<HTMLButtonElement>('[data-retry]')?.addEventListener('click', () => void send());
    status.focus();
  }
  function done(): void {
    const d = form.parentElement?.querySelector<HTMLElement>('[data-done]');
    if (!d) return;
    form.hidden = true;
    d.hidden = false;
    const p = d.querySelector<SVGPathElement>('path[data-draw]');
    if (p) {
      const L = p.getTotalLength();
      p.style.strokeDasharray = String(L); p.style.strokeDashoffset = String(RM ? 0 : L);
      if (!RM) requestAnimationFrame(() => requestAnimationFrame(() => { p.style.transition = 'stroke-dashoffset .9s cubic-bezier(.65,0,.35,1)'; p.style.strokeDashoffset = '0'; }));
    }
    const h = d.querySelector<HTMLElement>('h2, h3');
    h?.setAttribute('tabindex', '-1');
    h?.focus();
    announce(h?.textContent ?? '');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (sending) return;
    if (court) { if (validate(sets)) void send(); return; }
    if (!validate([sets[step - 1]!])) return;
    if (step === 5) track('qualify_lead', { enjeu: values().enjeu, campagnes: values().campagnes });
    if (step < sets.length) { step++; show(); save(); return; }
    void send();
  });

  /* ---------- quitter une demande commencée ---------- */
  if (!court) {
    document.addEventListener('click', async (e) => {
      if (!started || sent || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.closest('dialog') || form.contains(a) && a.hash) return;
      const u = new URL(a.href, location.href);
      if (u.origin === location.origin && u.pathname === location.pathname) return;
      if (!/^https?:$/.test(u.protocol)) return;
      e.preventDefault();
      const Q = t.quitter;
      if (await confirmDialog({ titre: Q.titre, texte: Q.texte, ok: Q.quitter, annuler: Q.continuer })) location.href = a.href;
    });
  }

  restore();
  syncAutre();
  if (court) {
    go.textContent = t.boutons.envoyer;
    /* la vérification anti-robots se charge au premier champ touché, jamais au chargement de la page */
    if (ts) form.addEventListener('focusin', () => { if (!token) void mountTurnstile(ts).then((f) => { token = f; }); }, { once: true });
  }
  else show(false);
}
