/* Administration du diagnostic : horaires, règles, jours bloqués, créneaux exceptionnels, rendez-vous
   (déplacer, annuler, diagnostic tenu, client signé), export CSV et état des connexions. Tout passe par
   /api/admin/*, protégé par Cloudflare Access. */
import { DEFAULTS, type Settings } from '../../server/slots';
import { fromLocal } from '../../server/tz';
import { confirmDialog } from './confirm';
import { announce } from './env';

type T = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
interface Row { id: string; label: string; start: string; status: string; nom: string; email: string; tel: string; entreprise: string; enjeu: string; campagnes: string; format: string; outcome: string | null; value: number | null }
const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const clone = <X>(x: X): X => JSON.parse(JSON.stringify(x)) as X;
const RULES = ['duration', 'buffer', 'notice', 'horizon', 'maxPerDay'] as const;
const LIM: Record<(typeof RULES)[number], [number, number, number]> = { duration: [10, 120, 5], buffer: [0, 120, 5], notice: [0, 336, 1], horizon: [1, 90, 1], maxPerDay: [1, 24, 1] };

export function initAdmin(root: HTMLElement): void {
  const t = JSON.parse(root.dataset.t ?? '{}') as T;
  const $ = <E extends HTMLElement = HTMLElement>(s: string): E => root.querySelector<E>(s)!;
  let S: Settings = clone(DEFAULTS);
  const fmt = (k: string): string => { const [y, m, d] = k.split('-').map(Number) as [number, number, number]; return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d))); };
  const say = (el: HTMLElement, msg: string, bad = false): void => { el.textContent = msg; el.classList.toggle('bad-t', bad); announce(msg); };

  /* ---------- horaires de la semaine ---------- */
  function week(): void {
    const w = $('[data-week]'), W = t.semaine;
    w.innerHTML = '';
    (t.jours as [number, string][]).forEach(([n, name]) => {
      const r = (S.week[n] ??= []);
      const row = document.createElement('div');
      row.className = 'ad-day';
      row.innerHTML = '<div class="ad-nm"><input type="checkbox" id="d' + n + '"' + (r.length ? ' checked' : '') + '><label for="d' + n + '">' + esc(name) + '</label></div><div class="ad-rgs"></div>';
      const rg = row.querySelector<HTMLElement>('.ad-rgs')!;
      if (!r.length) rg.innerHTML = '<span class="small ad-off">' + esc(W.indisponible) + '</span>';
      r.forEach((x, i) => {
        const e = document.createElement('div');
        e.className = 'ad-rg';
        e.innerHTML = '<input type="time" value="' + x[0] + '" aria-label="' + esc(name + ', ' + W.debut + ' ' + (i + 1)) + '"><span>' + esc(W.a) + '</span><input type="time" value="' + x[1] + '" aria-label="' + esc(name + ', ' + W.fin + ' ' + (i + 1)) + '"><button class="mini" type="button">' + esc(W.retirer) + '</button>';
        const [a, b] = Array.from(e.querySelectorAll('input'));
        a!.addEventListener('change', () => { x[0] = a!.value; });
        b!.addEventListener('change', () => { x[1] = b!.value; });
        e.querySelector('button')!.addEventListener('click', () => { r.splice(i, 1); week(); });
        rg.appendChild(e);
      });
      if (r.length) {
        const add = document.createElement('button');
        add.className = 'mini'; add.type = 'button'; add.textContent = W.ajouter;
        add.addEventListener('click', () => { r.push(['14:00', '17:00']); week(); });
        rg.appendChild(add);
      }
      row.querySelector('input[type=checkbox]')!.addEventListener('change', (e) => { S.week[n] = (e.target as HTMLInputElement).checked ? [['09:00', '13:00']] : []; week(); root.querySelector<HTMLElement>('#d' + n)?.focus(); });
      w.appendChild(row);
    });
  }

  /* ---------- jours bloqués et créneaux exceptionnels ---------- */
  function lists(): void {
    const bl = $('[data-blist]'), xl = $('[data-xlist]');
    bl.innerHTML = S.blocked.length ? '' : '<span class="small">' + esc(t.bloques.vide) + '</span>';
    S.blocked.sort().forEach((k, i) => {
      const d = document.createElement('div');
      d.innerHTML = '<span>' + esc(fmt(k)) + '</span><button class="mini" type="button">' + esc(t.bloques.retirer) + '</button>';
      d.querySelector('button')!.addEventListener('click', () => { S.blocked.splice(i, 1); lists(); });
      bl.appendChild(d);
    });
    xl.innerHTML = S.extra.length ? '' : '<span class="small">' + esc(t.extra.vide) + '</span>';
    S.extra.forEach((x, i) => {
      const d = document.createElement('div');
      d.innerHTML = '<span>' + esc(fmt(x.date) + ', ' + x.from + ' ' + t.semaine.a + ' ' + x.to) + '</span><button class="mini" type="button">' + esc(t.extra.retirer) + '</button>';
      d.querySelector('button')!.addEventListener('click', () => { S.extra.splice(i, 1); lists(); });
      xl.appendChild(d);
    });
  }
  function rules(): void {
    RULES.forEach((k) => {
      const el = $<HTMLInputElement>('#r-' + k), [a, b] = LIM[k];
      el.value = String(S[k]);
      el.onchange = () => { S[k] = Math.max(a, Math.min(b, Math.round(+el.value || 0))); el.value = String(S[k]); };
    });
  }
  $('[data-badd]').addEventListener('click', () => {
    const v = $<HTMLInputElement>('#bdate').value;
    if (v && !S.blocked.includes(v)) { S.blocked.push(v); lists(); }
  });
  $('[data-xadd]').addEventListener('click', () => {
    const d = $<HTMLInputElement>('#xdate').value, f = $<HTMLInputElement>('#xfrom').value, to = $<HTMLInputElement>('#xto').value;
    if (d && f && to && f < to) { S.extra.push({ date: d, from: f, to }); lists(); }
  });
  const saved = $('[data-saved]');
  $('[data-save]').addEventListener('click', async () => {
    try {
      const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(S) });
      const j = (await r.json()) as { ok?: boolean; settings?: Settings; error?: string };
      if (!j.ok || !j.settings) throw new Error(j.error);
      S = j.settings; week(); lists(); rules();
      say(saved, t.enregistre);
    } catch (e) { say(saved, (e as Error).message === 'not_configured' ? t.base_config : t.erreur, true); }
  });
  $('[data-reset]').addEventListener('click', () => { S = clone(DEFAULTS); week(); lists(); rules(); say(saved, t.defaut_ok); });

  /* ---------- état des connexions ---------- */
  function status(st: Record<string, boolean | string>): void {
    const V = t.etat.valeurs;
    $('[data-status]').innerHTML = (['db', 'calendar', 'email', 'capi', 'turnstile'] as const).map((k) => {
      const v = st[k], key = typeof v === 'boolean' ? (v ? 'oui' : 'non') : String(v), ok = v === true || v === 'connecte';
      return '<div><span>' + esc(t.etat[k]) + '</span><b class="' + (ok ? 'ok' : 'off') + '">' + esc(V[key] ?? key) + '</b></div>';
    }).join('');
  }

  /* ---------- rendez-vous ---------- */
  let all = false;
  const bk = $('[data-bks]'), R = t.rdv;
  async function act(id: string, body: Record<string, unknown>): Promise<{ ok: boolean; status: number }> {
    try {
      const r = await fetch('/api/admin/bookings/' + encodeURIComponent(id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = (await r.json()) as { ok?: boolean };
      return { ok: !!j.ok, status: r.status };
    } catch { return { ok: false, status: 0 }; }
  }
  async function bookings(note = ''): Promise<void> {
    let rows: Row[] = [];
    try {
      const r = await fetch('/api/admin/bookings' + (all ? '?tous=1' : ''));
      const j = (await r.json()) as { ok?: boolean; bookings?: Row[] };
      rows = j.bookings ?? [];
    } catch { rows = []; }
    bk.innerHTML = (note ? '<p class="ad-note" role="status">' + esc(note) + '</p>' : '') + (rows.length ? '' : '<p class="small">' + esc(R.vide) + '</p>');
    rows.forEach((x) => {
      const d = document.createElement('div');
      d.className = 'ad-bk';
      const open = x.status === 'confirmed' && Date.parse(x.start) > Date.now();
      d.innerHTML = '<p><b>' + esc(x.label.charAt(0).toUpperCase() + x.label.slice(1)) + '</b>' + (x.status !== 'confirmed' ? ' <span class="ad-tag">' + esc(R.statuts[x.status] ?? x.status) + '</span>' : '') + (x.outcome ? ' <span class="ad-tag on">' + esc(R.resultats[x.outcome] ?? x.outcome) + (x.value ? ', ' + esc(x.value) + ' MAD' : '') + '</span>' : '') + '</p>' +
        '<p>' + esc(x.nom) + ', ' + esc(x.entreprise) + '</p><p class="small">' + esc([x.email, x.tel, x.enjeu, x.campagnes, x.format].filter(Boolean).join(' · ')) + '</p>' +
        '<div class="ad-acts">' + (open ? '<button class="mini" type="button" data-a="move">' + esc(R.deplacer) + '</button><button class="mini" type="button" data-a="cancel">' + esc(R.annuler) + '</button>' : '') +
        (x.status === 'confirmed' ? '<button class="mini" type="button" data-a="tenu">' + esc(R.tenu) + '</button><button class="mini" type="button" data-a="signe">' + esc(R.signe) + '</button>' : '') + '</div><div class="ad-sub"></div>';
      const sub = d.querySelector<HTMLElement>('.ad-sub')!;
      d.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((b) => b.addEventListener('click', async () => {
        const a = b.dataset.a!;
        if (a === 'cancel') {
          const C = R.confirmation;
          if (!(await confirmDialog({ titre: C.titre, texte: C.texte, ok: C.annuler, annuler: C.garder }))) return;
          const r = await act(x.id, { action: 'cancel' });
          return void bookings(r.ok ? R.annulation : R.erreur);
        }
        if (a === 'move') {
          sub.innerHTML = '<div class="ad-rg"><label class="small">' + esc(R.nouvelle_date) + '<input type="date" data-d></label><label class="small">' + esc(R.nouvelle_heure) + '<input type="time" step="300" data-h></label><button class="mini" type="button" data-ok>' + esc(R.confirmer) + '</button><button class="mini" type="button" data-x>' + esc(R.fermer) + '</button></div>';
          sub.querySelector<HTMLInputElement>('[data-d]')!.focus();
          sub.querySelector('[data-x]')!.addEventListener('click', () => { sub.innerHTML = ''; b.focus(); });
          sub.querySelector('[data-ok]')!.addEventListener('click', async () => {
            const dv = sub.querySelector<HTMLInputElement>('[data-d]')!.value, hv = sub.querySelector<HTMLInputElement>('[data-h]')!.value;
            if (!dv || !hv) return;
            const [y, m, dd] = dv.split('-').map(Number) as [number, number, number], [hh, mm] = hv.split(':').map(Number) as [number, number];
            const r = await act(x.id, { action: 'move', start: new Date(fromLocal(y, m, dd, hh * 60 + mm)).toISOString() });
            void bookings(r.ok ? R.deplace : r.status === 409 ? R.pris : R.erreur);
          });
          return;
        }
        /* diagnostic tenu / client signé : valeur facultative, puis événement hors ligne */
        sub.innerHTML = '<div class="ad-rg"><label class="small">' + esc(a === 'tenu' ? R.valeur : R.montant) + '<input type="number" min="0" step="100" inputmode="numeric" data-v></label><button class="mini" type="button" data-ok>' + esc(R.envoyer) + '</button><button class="mini" type="button" data-x>' + esc(R.fermer) + '</button></div>';
        sub.querySelector<HTMLInputElement>('[data-v]')!.focus();
        sub.querySelector('[data-x]')!.addEventListener('click', () => { sub.innerHTML = ''; b.focus(); });
        sub.querySelector('[data-ok]')!.addEventListener('click', async () => {
          const r = await act(x.id, { action: a, value: Number(sub.querySelector<HTMLInputElement>('[data-v]')!.value) || 0 });
          void bookings(r.ok ? R.marque : R.erreur);
        });
      }));
      bk.appendChild(d);
    });
  }
  $<HTMLInputElement>('#tous').addEventListener('change', (e) => { all = (e.target as HTMLInputElement).checked; void bookings(); });

  /* ---------- chargement ---------- */
  (async () => {
    const gate = $('[data-gate]');
    try {
      const r = await fetch('/api/admin/settings', { headers: { Accept: 'application/json' } });
      const j = (await r.json()) as { ok?: boolean; settings?: Settings; status?: Record<string, boolean | string>; error?: string };
      if (r.status === 403) { gate.textContent = j.error === 'access_not_configured' ? t.acces_config : t.acces; return; }
      if (!j.ok || !j.settings) throw new Error('settings');
      S = j.settings;
      if (j.status) status(j.status);
      if (j.status && !j.status.db) say(saved, t.base_config, true);
    } catch { gate.textContent = t.acces; return; }
    gate.hidden = true;
    root.querySelector<HTMLElement>('[data-app]')!.hidden = false;
    week(); lists(); rules();
    void bookings();
  })();
}
