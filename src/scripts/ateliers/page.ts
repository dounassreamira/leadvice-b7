/* Atelier « Construisez une page qui convertit » : assembler, auditer, alléger, bilan.
   Clients fictifs ; les règles sont celles que nous appliquons sur les sites que nous construisons.
   Données et textes : src/content/ateliers/page.json. Progression gardée sur l'appareil, rien n'est envoyé. */
import { scrollToY } from '../env';
import { esc, fill, fmt, store } from './util';

type G = 'cl' | 'cf' | 'sp' | 'cv';
interface Client { name: string; t: string[]; cta: string; s: string }
interface Opt { t?: string; k?: number | 'cta'; g: Partial<Record<G, number>>; kb?: number; why: string }
interface Block { id: string; q: string; opts: Opt[] }
interface Zone { id: string; bad: boolean; why?: string }
interface Item { id: string; t: string; kb: number; v: number }
interface State { lvl: number; cl: string | null; ch: Record<string, number>; last?: string | null; s1: number | null; found: string[]; okz?: string[]; miss: number; hints: number; t0: number; s2: number | null; sel: Record<string, boolean>; s3: number | null; msg?: string; hintTxt?: string }
type T = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function initPage(app: HTMLElement, D: { clients: Record<string, Client>; blocs: Block[]; audit: Zone[]; elements: Item[]; indices: Record<string, string>; ui: T }): void {
  const CL = D.clients, BLOCKS = D.blocs, AUD = D.audit, ITEMS = D.elements, HINTS = D.indices, U = D.ui, A = U.apercu, PG = U.page;
  const BASE_KB: number = U.base_kb, LIMIT: number = U.limite;
  const NBAD = AUD.filter((a) => a.bad).length;
  const clamp = (v: number): number => Math.max(0, Math.min(100, Math.round(v)));
  const lcp = (kb: number): number => .6 + kb / 1100;
  /* la meilleure sélection possible sous la limite (12 éléments : 4 096 combinaisons) */
  const BEST = ((): number => {
    let best = 0;
    for (let m = 0; m < (1 << ITEMS.length); m++) {
      let kb = BASE_KB, v = 0;
      ITEMS.forEach((it, i) => { if (m & (1 << i)) { kb += it.kb; v += it.v; } });
      if (lcp(kb) <= LIMIT && v > best) best = v;
    }
    return best;
  })();
  const db = store<State>('lv-atelier-site-v1');
  const fresh = (): State => ({ lvl: 0, cl: null, ch: {}, s1: null, found: [], miss: 0, hints: 0, t0: 0, s2: null, sel: {}, s3: null });
  let S: State = db.get() ?? fresh();
  const save = (): void => db.set(S);
  const top = (): void => { const y = app.getBoundingClientRect().top + scrollY - 100; if (Math.abs(scrollY - y) > 40) scrollToY(y); };

  function steps(): string {
    return '<ol class="st-lv">' + (U.niveaux as string[]).map((l, i) => {
      const c = i < S.lvl ? 'done' : i === S.lvl ? 'now' : '';
      return '<li class="' + c + '"' + (i === S.lvl ? ' aria-current="step"' : '') + '><b>' + esc(i < 3 ? fill(U.niveau, { n: i + 1 }) : U.fin) + '</b><span>' + esc(l) + '</span></li>';
    }).join('') + '</ol>';
  }
  function render(focus?: string | false): void {
    let html = steps();
    if (S.lvl === 0) html += S.cl ? lvl1() : pick();
    else if (S.lvl === 1) html += lvl2();
    else if (S.lvl === 2) html += lvl3();
    else html += fin();
    app.innerHTML = html;
    bind();
    if (focus === false) return;
    const f = app.querySelector<HTMLElement>(focus || '[data-focus]') ?? app.querySelector<HTMLElement>('.at-h');
    if (f) { if (!/^(BUTTON|A|INPUT)$/.test(f.tagName)) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
  }

  /* ---------- niveau 1 ---------- */
  function pick(): string {
    return '<div class="at-screen"><h2 class="at-h">' + esc(U.n1_titre) + '</h2><p class="at-p">' + esc(U.n1_texte) + '</p>' +
      '<div class="at-cards">' + Object.keys(CL).map((k) => '<button type="button" class="at-card" data-cl="' + k + '"><b>' + esc(CL[k]!.name) + '</b><span>' + esc(CL[k]!.t[2]) + '</span></button>').join('') + '</div>' +
      '<p class="at-note">' + esc(U.note) + '</p></div>';
  }
  const label = (o: Opt): string => { const c = CL[S.cl!]!; if (o.k === 'cta') return c.cta; if (typeof o.k === 'number') return c.t[o.k] ?? ''; return o.t ?? ''; };
  function gauges(): Record<G, number> & { kb: number; lcp: number } {
    const g: Record<G, number> = { cl: 40, cf: 50, sp: 70, cv: 25 };
    let kb = BASE_KB;
    BLOCKS.forEach((b) => { const i = S.ch[b.id]; if (i === undefined) return; const o = b.opts[i]!; (Object.keys(o.g) as G[]).forEach((k) => { g[k] += o.g[k] ?? 0; }); kb += o.kb ?? 0; });
    (Object.keys(g) as G[]).forEach((k) => { g[k] = clamp(g[k]); });
    return { ...g, kb, lcp: lcp(kb) };
  }
  function gaugeHtml(g: ReturnType<typeof gauges>): string {
    return '<div class="st-g" aria-live="polite">' + (['cl', 'cf', 'sp', 'cv'] as G[]).map((k) => { const v = g[k]; return '<div><span>' + esc(U.jauges[k]) + '</span><b>' + v + '</b><i style="--v:' + v + '%" class="' + (v >= 70 ? 'hi' : v < 40 ? 'lo' : '') + '"></i></div>'; }).join('') +
      '<p class="st-lcp">' + esc(fill(U.affichage, { t: fmt(g.lcp, 1) })).replace(/(\d+,\d) s/, '<b>$1 s</b>') + ' ' + esc(g.lcp <= 2 ? U.objectif_ok : U.objectif_ko) + '</p></div>';
  }
  function preview(): string {
    const c = CL[S.cl!]!;
    const get = (id: string): { i: number; l: string } | null => { const b = BLOCKS.find((x) => x.id === id)!; const i = S.ch[id]; return i === undefined ? null : { i, l: label(b.opts[i]!) }; };
    const t = get('t'), s = get('s'), v = get('v'), b = get('b'), p = get('p'), f = get('f'), ty = get('ty'), ct = get('c');
    const font = ty ? ['st-f1', 'st-f4', 'st-f0'][ty.i] : '';
    const ph = (txt: string): string => '<div class="ph">' + esc(txt) + '</div>';
    const vis = v ? '<div class="pv-vis v' + v.i + '"><span>' + esc(A.visuels[v.i]) + '</span></div>' : ph(A.visuel);
    const proof = p ? (p.i === 1 ? '<div class="pv-proof"><i></i><i></i><i></i><span>' + esc(A.avis) + '</span></div>' : p.i === 0 ? '<div class="pv-proof bad">' + esc(A.numero1) + '</div>' : '') : ph(A.preuve);
    const nf = f ? [3, 5, 11][f.i] ?? 3 : 0;
    const form = f ? '<div class="pv-form">' + '<i></i>'.repeat(Math.min(nf, 6)) + (nf > 6 ? '<small>' + esc(fill(A.champs, { n: nf - 6 })) + '</small>' : '') + '</div>' : ph(A.formulaire);
    const btn = b ? '<div class="pv-btn">' + esc(b.l) + '</div>' : ph(A.bouton);
    const cont = ct ? (ct.i === 0 ? '<div class="pv-bar"><span>' + esc(A.appeler) + '</span><span>' + esc(A.whatsapp) + '</span></div>' : ct.i === 2 ? '<div class="pv-chat">' + esc(A.chat) + '</div>' : '<div class="pv-foot">' + esc(A.tel_image) + '</div>') : '';
    return '<div class="st-phone ' + font + '" aria-label="' + esc(A.aria) + '" role="img"><div class="pv-top"><i></i><span>' + esc(c.name.replace(/^Une? /, '')) + '</span></div>' +
      (t ? '<p class="pv-t">' + esc(t.l) + '</p>' : ph(A.titre)) + (s ? (s.i === 2 ? '' : '<p class="pv-s">' + esc(s.i === 0 ? A.sous_titre_leader : c.s) + '</p>') : ph(A.sous_titre)) +
      vis + proof + form + btn + cont + '</div>';
  }
  const score1 = (g: ReturnType<typeof gauges>): number => clamp((g.cl + g.cf + g.sp + g.cv) / 4);
  function lvl1(): string {
    const g = gauges(), n = Object.keys(S.ch).length;
    const next = BLOCKS.find((b) => S.ch[b.id] === undefined);
    const last = S.last ? BLOCKS.find((b) => b.id === S.last) : null;
    const fb = last ? '<div class="st-fb" role="status"><b>' + esc(last.q + ' : ' + label(last.opts[S.ch[last.id]!]!)) + '</b><p>' + esc(last.opts[S.ch[last.id]!]!.why) + '</p></div>' : '';
    const q = next
      ? '<fieldset class="at-opts"><legend class="at-lg">' + esc(next.q) + ' <small>' + esc(fill(U.sur, { n: n + 1, total: BLOCKS.length })) + '</small></legend>' + next.opts.map((o, i) => '<button type="button" class="at-opt at-optb" data-pick="' + next.id + ':' + i + '"' + (i === 0 ? ' data-focus' : '') + '><span><b>' + esc(label(o)) + '</b></span></button>').join('') + '</fieldset>'
      : '<div class="st-done"><p>' + esc(fill(U.assemblee, { s: '§' })).replace('§', '<b class="res">' + score1(g)) + '</b></p><div class="at-acts"><button class="btn btn-ghost" type="button" data-act="redo1">' + esc(U.refaire) + '</button><button class="btn btn-main" type="button" data-act="to2" data-focus>' + esc(U.vers2) + '</button></div></div>';
    return '<div class="at-screen"><h2 class="at-h">' + esc(U.n1_titre) + '</h2><div class="st-l1"><div class="st-left">' + gaugeHtml(g) + fb + q + '</div><div class="st-right">' + preview() + '</div></div></div>';
  }

  /* ---------- niveau 2 ---------- */
  function z(id: string, html: string): string {
    const f = S.found.includes(id);
    return '<button type="button" class="au-z' + (f ? ' found' : '') + (S.okz?.includes(id) ? ' fine' : '') + '" data-z="' + id + '"' + (f ? ' aria-pressed="true"' : '') + '>' + html + (f ? '<em aria-hidden="true">' + (S.found.indexOf(id) + 1) + '</em>' : '') + '</button>';
  }
  function lvl2(): string {
    if (!S.t0) { S.t0 = Date.now(); save(); }
    const nf = S.found.length;
    const page = '<div class="au-page" role="group" aria-label="' + esc(U.page_aria) + '">' +
      '<div class="au-hdr">' + z('logo', '<span class="au-logo">' + esc(PG.logo) + '</span>') + z('menu', '<span class="au-menu">' + esc(PG.menu) + '</span>') + '</div>' +
      z('pop', '<span class="au-pop">' + esc(PG.pop) + ' <i>×</i></span>') +
      z('h1', '<span class="au-h1">' + esc(PG.h1) + '</span>') +
      z('low', '<span class="au-low">' + esc(PG.low) + '</span>') +
      z('img', '<span class="au-img">' + esc(PG.img[0]) + '<br>' + esc(PG.img[1]) + '</span>') +
      '<div class="au-row">' + z('more', (PG.more as string[]).map((m) => '<span class="au-more">' + esc(m) + ' <u>' + esc(PG.more_lien) + '</u></span>').join('')) + z('team', '<span class="au-team">' + esc(PG.team) + '</span>') + '</div>' +
      '<div class="au-row">' + z('quote', '<span class="au-quote">' + esc(PG.quote[0]) + '<br><small>' + esc(PG.quote[1]) + '</small></span>') + z('hours', '<span class="au-hours">' + esc(PG.hours) + '</span>') + '</div>' +
      z('form', '<span class="au-form"><b>' + esc(PG.form[0]) + '</b><span>' + esc(PG.form[1]) + '</span></span>') +
      z('btn', '<span class="au-btn">' + esc(PG.btn) + '</span>') +
      '<div class="au-foot">' + z('tel', '<span class="au-tel">' + esc(PG.tel) + '</span>') + z('addr', '<span class="au-addr">' + esc(PG.addr) + '</span>') + z('legal', '<span class="au-legal">' + esc(PG.legal) + '</span>') + '</div></div>';
    const list = S.found.map((id, i) => '<li><b>' + (i + 1) + '</b><p>' + esc(AUD.find((x) => x.id === id)?.why ?? '') + '</p></li>').join('');
    const hint = S.hintTxt ? '<p class="au-hint" role="status">' + esc(S.hintTxt) + '</p>' : '';
    const msg = S.msg ? '<p class="au-msg" role="status">' + esc(S.msg) + '</p>' : '';
    const done = nf === NBAD;
    return '<div class="at-screen"><h2 class="at-h">' + esc(U.n2_titre) + '</h2><p class="at-p">' + esc(fill(U.n2_texte, { n: NBAD })) + '</p>' +
      '<div class="au-wrap"><div>' + page + '</div><div class="au-side"><div class="au-count" aria-live="polite"><b>' + esc(fill(U.trouvees, { n: nf, total: NBAD })) + '</b> ' + esc(U.trouvees_l) + '<span>' + esc(fill(S.miss > 1 ? U.torts : U.tort, { n: S.miss })) + ', ' + esc(fill(S.hints > 1 ? U.indices_n : U.indice_n, { n: S.hints })) + '</span></div>' + msg + hint +
      '<div class="at-acts">' + (done ? '<button class="btn btn-main" type="button" data-act="end2" data-focus>' + esc(U.score) + '</button>' : '<button class="btn btn-ghost" type="button" data-act="hint">' + esc(U.indice) + '</button><button class="btn btn-ghost" type="button" data-act="end2">' + esc(U.fini) + '</button>') + '</div>' +
      (list ? '<ol class="au-list">' + list + '</ol>' : '') + '</div></div></div>';
  }
  const score2 = (): number => clamp(S.found.length / NBAD * 100 - S.miss * 4 - S.hints * 5);

  /* ---------- niveau 3 ---------- */
  function lvl3(): string {
    let kb = BASE_KB;
    ITEMS.forEach((it) => { if (S.sel[it.id]) kb += it.kb; });
    const t = lcp(kb), ok = t <= LIMIT;
    const rows = ITEMS.map((it) => '<label class="w-it"><input type="checkbox" data-it="' + it.id + '"' + (S.sel[it.id] ? ' checked' : '') + '><span><b>' + esc(it.t) + '</b><small>' + esc(fill(U.ko, { n: fmt(it.kb) })) + '</small></span></label>').join('');
    return '<div class="at-screen"><h2 class="at-h">' + esc(U.n3_titre) + '</h2><p class="at-p">' + esc(fill(U.n3_texte, { base: BASE_KB, limite: fmt(LIMIT, 1) })) + '</p>' +
      '<div class="w-wrap"><div class="w-list">' + rows + '</div><div class="w-side" aria-live="polite"><div class="w-meter ' + (ok ? 'ok' : 'ko') + '"><span>' + esc(U.affichage_court) + '</span><b>' + fmt(t, 1) + ' s</b><i style="--v:' + Math.min(100, t / 4 * 100) + '%"></i><small>' + esc(fill(U.objectif_poids, { limite: fmt(LIMIT, 1), kb: fmt(kb) })) + '</small></div>' +
      (ok ? '' : '<p class="au-msg">' + esc(U.trop_lourd) + '</p>') +
      '<div class="at-acts"><button class="btn btn-main" type="button" data-act="end3"' + (ok ? '' : ' disabled') + '>' + esc(U.valider) + '</button></div></div></div></div>';
  }
  const score3 = (): number => { let v = 0; ITEMS.forEach((it) => { if (S.sel[it.id]) v += it.v; }); return clamp(v / BEST * 100); };

  /* ---------- bilan ---------- */
  function fin(): string {
    const tot = Math.round(((S.s1 ?? 0) + (S.s2 ?? 0) + (S.s3 ?? 0)) / 3);
    const m = (U.mentions as { min: number; texte: string }[]).find((x) => tot >= x.min)?.texte ?? '';
    const lost = ITEMS.filter((it) => S.sel[it.id] && it.v < 7).map((it) => it.t.toLowerCase());
    const miss = ITEMS.filter((it) => !S.sel[it.id] && it.v >= 10).map((it) => it.t.toLowerCase());
    const l3 = (lost.length ? fill(U.garde, { liste: lost.join(', ') }) : '') + (miss.length ? fill(U.oublie, { liste: miss.join(', ') }) : lost.length ? '' : U.parfait);
    return '<div class="at-screen"><h2 class="at-h">' + esc(U.bilan) + '</h2><div class="at-final"><div class="at-grade"><b>' + tot + '</b><span>' + esc(m) + '</span></div>' +
      '<div class="at-tot">' + [S.s1, S.s2, S.s3].map((v, i) => '<div><span>' + esc(U.niveaux[i]) + '</span><b>' + (v ?? 0) + '</b><small>' + esc(U.sur100) + '</small></div>').join('') + '</div></div>' +
      '<h3 class="at-h4">' + esc(U.retenir) + '</h3><div class="at-read"><p>' + esc(U.retenir_1) + '</p><p>' + esc(U.retenir_2) + '</p><p>' + esc(l3) + '</p></div>' +
      '<div class="at-cta"><p>' + esc(U.cta_texte) + '</p><div class="at-acts"><a class="btn btn-main" href="/diagnostic/">' + esc(U.diagnostic) + '</a><a class="btn btn-ghost" href="/expertises/sites-web/">' + esc(U.sites_web) + '</a><button class="btn btn-ghost" type="button" data-act="restart">' + esc(U.recommencer) + '</button></div></div></div>';
  }

  /* ---------- interactions ---------- */
  function bind(): void {
    app.querySelectorAll<HTMLElement>('[data-cl]').forEach((b) => b.addEventListener('click', () => { S.cl = b.dataset.cl!; save(); render(); top(); }));
    app.querySelectorAll<HTMLElement>('[data-pick]').forEach((b) => b.addEventListener('click', () => { const [id, i] = b.dataset.pick!.split(':') as [string, string]; S.ch[id] = +i; S.last = id; save(); render(); }));
    app.querySelectorAll<HTMLElement>('[data-z]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.z!, a = AUD.find((x) => x.id === id)!;
      if (S.found.includes(id)) return;
      if (a.bad) { S.found.push(id); S.msg = U.bien_vu; S.hintTxt = ''; }
      else { S.okz ??= []; if (!S.okz.includes(id)) { S.okz.push(id); S.miss++; } S.msg = U.rien; }
      save(); render('[data-z="' + id + '"]');
    }));
    app.querySelectorAll<HTMLInputElement>('[data-it]').forEach((c) => c.addEventListener('change', () => { S.sel[c.dataset.it!] = c.checked; save(); render('[data-it="' + c.dataset.it + '"]'); }));
    app.querySelectorAll<HTMLElement>('[data-act]').forEach((b) => b.addEventListener('click', () => act(b.dataset.act!)));
  }
  function act(a: string): void {
    if (a === 'redo1') { S.ch = {}; S.last = null; S.cl = null; save(); render(); top(); return; }
    if (a === 'to2') { S.s1 = score1(gauges()); S.lvl = 1; S.t0 = 0; S.msg = ''; save(); render(); top(); return; }
    if (a === 'hint') { const left = AUD.filter((x) => x.bad && !S.found.includes(x.id)); if (left.length) { S.hints++; S.hintTxt = fill(U.indice_pre, { t: HINTS[left[0]!.id] ?? '' }); } save(); render(false); return; }
    if (a === 'end2') { S.s2 = score2(); S.lvl = 2; save(); render(); top(); return; }
    if (a === 'end3') { S.s3 = score3(); S.lvl = 3; save(); render(); top(); return; }
    if (a === 'restart') { S = fresh(); save(); render(); top(); }
  }
  render(false);
}
