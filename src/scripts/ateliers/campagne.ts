/* Atelier « Pilotez une campagne » : six décisions de préparation, huit semaines simulées, bilan.
   Modèle pédagogique simplifié, chiffres fictifs ; les mécanismes sont ceux d'une vraie campagne
   (fatigue des annonces, phase d'apprentissage, plafond des recherches Google, qualification, vitesse de rappel).
   Données et textes : src/content/ateliers/campagne.json. Progression gardée sur l'appareil, rien n'est envoyé. */
import { scrollToY } from '../env';
import { esc, fill, fmt, rng, store } from './util';

type M = Partial<Record<'ctr' | 'q' | 'cvr' | 'cpm' | 'fat' | 'close' | 'cpc' | 'demand', number>>;
interface Client { name: string; pitch: string; budget: number; cpm: number; ctr: number; cvrM: number; cvrG: number; cpc: number; demand: number; qM: number; qG: number; close: number; unit: [string, string]; res: string; lead: string; angle: string[]; offer: string[]; form: string[] }
interface Opt { t?: string; d?: string; k?: number; rank: 1 | 2 | 3; m: M; l: string }
interface Step { id: string; lever: string; q: string; help: string; opts?: Opt[]; slider?: boolean }
interface Action { t: string; d: string; lever: string; once?: boolean }
interface Ev { t: string; d: string; m: M; speedSaves?: boolean }
interface Week { w: number; spend: number; imp: number; clicks: number; clG: number; demand: number; leads: number; qual: number; res: number; fat: number; learn: boolean; split: number; ctr: number }
interface State { sc: string; step: number; ch: Record<string, number>; split: number; week: number; hist: Week[]; base: Week[]; acts: string[]; perm: Record<string, boolean>; budgetMul: number; wsr: number; events: (number | null)[]; seed: number; screen: 'setup' | 'launch' | 'week' | 'final' }
interface Ctx { ref?: boolean; split: number; wsr: number; perm: Record<string, boolean>; budgetMul: number; learn?: boolean }
type T = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function initCampagne(app: HTMLElement, D: { clients: Record<string, Client>; decisions: Step[]; actions: Record<string, Action>; imprevus: Ev[]; ui: T }): void {
  const SC = D.clients, STEPS = D.decisions, ACTIONS = D.actions, EVENTS = D.imprevus, U = D.ui;
  const WEEKS: number = U.semaines;
  const db = store<State>('lv-atelier-acq-v1');
  let S: State | null = null;

  function fresh(sc: string): State {
    const r = rng(sc.length * 7919 + (Date.now() % 100000));
    const ev: (number | null)[] = [], pool = EVENTS.map((_, i) => i);
    for (let w = 1; w <= WEEKS; w++) ev.push(null);
    for (let k = 0; k < 4; k++) {
      const e = pool.splice(Math.floor(r() * pool.length), 1)[0] ?? 0;
      let wk: number;
      do { wk = 1 + Math.floor(r() * (WEEKS - 1)); } while (ev[wk] !== null);
      ev[wk] = e;
    }
    return { sc, step: 0, ch: {}, split: .5, week: 0, hist: [], base: [], acts: [], perm: {}, budgetMul: 1, wsr: 0, events: ev, seed: Math.floor(r() * 1e6), screen: 'setup' };
  }
  const st = (): State => S as State;
  const save = (): void => db.set(st());
  const step = (id: string): Step => STEPS.find((s) => s.id === id)!;
  const opt = (id: string): Opt => step(id).opts![st().ch[id] ?? 0]!;
  const optLabel = (id: string, o: Opt): string => o.t ?? SC[st().sc]![(id === 'frm' ? 'form' : id) as 'angle' | 'offer' | 'form']![o.k ?? 0] ?? '';
  function mods(): Required<M> & { cvrG: number; qG: number } {
    const m: Record<string, number> = { ctr: 1, q: 1, cvr: 1, cpm: 1, fat: 1, close: 1, cvrG: 1, qG: 1 };
    ['aud', 'angle', 'offer', 'crea', 'frm'].forEach((id) => { const o = opt(id).m; for (const k in o) m[k] = (m[k] ?? 1) * (o[k as keyof M] ?? 1); });
    return m as Required<M> & { cvrG: number; qG: number };
  }

  /* le modèle d'une semaine ; ref = la campagne de référence */
  function simWeek(w: number, c: Ctx): Week {
    const s = st(), sc = SC[s.sc]!, m = mods(), r = rng(s.seed + w * 101 + (c.ref ? 7 : 0));
    const noise = (): number => (c.ref ? 1 : .94 + r() * .12);
    const P = c.perm, ei = s.events[w], ev = ei !== null && ei !== undefined ? EVENTS[ei] ?? null : null, em: M = ev ? ev.m : {};
    const budget = sc.budget * c.budgetMul;
    const Bm = budget * c.split, Bg = budget * (1 - c.split);
    const learn = c.learn ? .86 : 1;
    const fat = 1 / (1 + .085 * c.wsr * m.fat);
    const ctr = sc.ctr * m.ctr * (P.abtest ? 1.08 : 1) * (em.ctr ?? 1) * fat * learn;
    const cpm = sc.cpm * m.cpm * (P.exclude ? 1.03 : 1);
    const imp = Bm / cpm * 1000;
    const clM = imp * ctr * noise();
    const cvrM = sc.cvrM * m.cvr * (P.qualif ? .9 : 1) * (em.cvr ?? 1) * (P.landing ? 1.05 : 1);
    const leadsM = clM * cvrM * (P.retarget ? 1.07 : 1);
    const demand = sc.demand * (em.demand ?? 1), cpc = sc.cpc * (em.cpc ?? 1);
    const clG = Bg > 0 ? demand * (1 - Math.exp(-Bg / (demand * cpc))) * noise() : 0;
    const cvrG = sc.cvrG * Math.min(1.25, m.cvr) * (P.qualif ? .92 : 1) * (em.cvr ?? 1) * (P.landing ? 1.18 : 1);
    const leadsG = clG * cvrG;
    const qBoost = (P.qualif ? 1.2 : 1) * (P.exclude ? 1.1 : 1);
    const qM = Math.min(.95, sc.qM * m.q * qBoost), qG = Math.min(.95, sc.qG * Math.sqrt(m.q) * qBoost);
    const qual = leadsM * qM + leadsG * qG;
    const close = sc.close * (P.speed ? 1.35 : 1) * (em.close && !(ev?.speedSaves && P.speed) ? em.close : 1);
    const res = qual * Math.min(.95, close);
    return { w, spend: budget, imp, clicks: clM + clG, clG, demand, leads: leadsM + leadsG, qual, res, fat, learn: !!c.learn, split: c.split, ctr: clM / Math.max(1, imp) };
  }
  /* la campagne de référence : réglages courants (cible large, prix d'appel, brochure, photo, formulaire court),
     50/50, annonces renouvelées toutes les quatre semaines */
  function refWeek(w: number): Week {
    const s = st(), keep = s.ch;
    s.ch = { aud: 0, angle: 2, offer: 1, crea: 0, frm: 0 };
    const r = simWeek(w, { ref: true, split: .5, wsr: w % 4, perm: {}, budgetMul: 1 });
    s.ch = keep;
    return r;
  }

  /* ---------- rendu ---------- */
  const h = (tag: string, html: string, cls?: string): string => '<' + tag + (cls ? ' class="' + cls + '"' : '') + '>' + html + '</' + tag + '>';
  function render(focusSel?: string | null): void {
    app.innerHTML = !S ? intro() : S.screen === 'setup' ? setup() : S.screen === 'launch' ? launch() : S.screen === 'week' ? week() : final();
    bind();
    if (focusSel === null) return;
    const f = app.querySelector<HTMLElement>(focusSel || '[data-focus]') ?? app.querySelector<HTMLElement>('h2');
    if (f) { if (!f.hasAttribute('tabindex') && !/^(BUTTON|A|INPUT)$/.test(f.tagName)) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
  }
  function top(): void { const y = app.getBoundingClientRect().top + scrollY - 100; if (Math.abs(scrollY - y) > 40) scrollToY(y); }
  const bar = (i: number, n: number, label: string): string => '<div class="at-prog"><span>' + esc(label) + '</span><div class="at-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + i + '" aria-label="' + esc(label) + '"><i style="width:' + (i / n * 100) + '%"></i></div></div>';

  function intro(): string {
    const saved = db.get();
    let resume = '';
    if (saved && saved.sc && SC[saved.sc] && saved.screen !== 'final') {
      const etat = saved.screen === 'week' ? fill(U.reprise_semaine, { n: saved.week + 1, total: WEEKS }) : U.reprise_prepa;
      resume = '<div class="at-resume"><p>' + esc(fill(U.reprise, { client: SC[saved.sc]!.name.toLowerCase(), etat })) + '</p><button class="btn btn-main" type="button" data-act="resume">' + esc(U.reprendre) + '</button></div>';
    }
    return '<div class="at-screen">' + resume + h('h2', esc(U.choisir_titre), 'at-h') + '<p class="at-p">' + esc(U.choisir_texte) + '</p>' +
      '<div class="at-cards">' + Object.keys(SC).map((k) => { const s = SC[k]!; return '<button type="button" class="at-card" data-sc="' + k + '"><b>' + esc(s.name) + '</b><span>' + esc(s.pitch) + '</span><em>' + esc(fill(U.budget, { budget: fmt(s.budget) })) + '</em></button>'; }).join('') + '</div>' +
      '<p class="at-note">' + esc(U.note) + '</p></div>';
  }

  function setup(): string {
    const s = st(), stp = STEPS[s.step]!, sc = SC[s.sc]!;
    let body: string;
    if (stp.slider) {
      const v = Math.round(s.split * 100);
      body = '<div class="at-split"><label for="at-split">' + esc(U.part_meta) + '</label><input type="range" id="at-split" min="0" max="100" step="5" value="' + v + '" data-focus><div class="at-split-o"><span>' + esc(U.meta) + ' <b data-o="m">' + v + ' %</b> <small data-o="mdh">' + fmt(sc.budget * v / 100) + ' DH</small></span><span>' + esc(U.google) + ' <b data-o="g">' + (100 - v) + ' %</b> <small data-o="gdh">' + fmt(sc.budget * (100 - v) / 100) + ' DH</small></span></div></div>' +
        '<div class="at-acts"><button class="btn btn-ghost" type="button" data-act="back">' + esc(U.retour) + '</button><button class="btn btn-main" type="button" data-act="next">' + esc(U.voir_plan) + '</button></div>';
    } else {
      body = '<fieldset class="at-opts"><legend class="sr-only">' + esc(stp.q) + '</legend>' + stp.opts!.map((o, i) => {
        const t = optLabel(stp.id, o), d = o.d ?? '';
        return '<label class="at-opt"><input type="radio" name="o" value="' + i + '"' + (s.ch[stp.id] === i ? ' checked' : '') + (i === 0 ? ' data-focus' : '') + '><span><b>' + esc(t) + '</b>' + (d ? '<small>' + esc(d) + '</small>' : '') + '</span></label>';
      }).join('') + '</fieldset><div class="at-acts">' + (s.step > 0 ? '<button class="btn btn-ghost" type="button" data-act="back">' + esc(U.retour) + '</button>' : '<button class="btn btn-ghost" type="button" data-act="quit">' + esc(U.changer_client) + '</button>') +
        '<button class="btn btn-main" type="button" data-act="next"' + (s.ch[stp.id] === undefined ? ' disabled' : '') + '>' + esc(U.suivante) + '</button></div>';
    }
    return '<div class="at-screen">' + bar(s.step + 1, STEPS.length, fill(U.prepa_barre, { n: s.step + 1, total: STEPS.length })) +
      '<p class="at-lever">' + esc(fill(U.levier, { levier: stp.lever })) + '</p>' + h('h2', esc(stp.q), 'at-h') + '<p class="at-p">' + esc(stp.help) + '</p>' + body + '</div>';
  }

  function launch(): string {
    const s = st(), sc = SC[s.sc]!;
    const row = (id: string): string => '<div class="blk"><h3>' + esc(U.plan_lignes[id]) + '</h3><p>' + esc(optLabel(id, opt(id))) + '</p></div>';
    return '<div class="at-screen">' + bar(STEPS.length, STEPS.length, U.prepa_fin) + h('h2', esc(U.plan_titre), 'at-h') +
      '<p class="at-p">' + esc(U.plan_texte) + '</p>' +
      '<div class="at-plan"><div class="lv-blocks">' + ['aud', 'angle', 'offer', 'crea', 'frm'].map(row).join('') +
      '<div class="blk"><h3>' + esc(U.repartition) + '</h3><p>' + esc(fill(U.repartition_texte, { m: Math.round(s.split * 100), g: Math.round((1 - s.split) * 100), budget: fmt(sc.budget) })) + '</p></div></div></div>' +
      '<div class="at-acts"><button class="btn btn-ghost" type="button" data-act="back">' + esc(U.modifier) + '</button><button class="btn btn-main" type="button" data-act="go" data-focus>' + esc(U.lancer) + '</button></div></div>';
  }

  function kpis(r: Week, prev: Week | undefined, sc: Client): string {
    const cpr = r.spend / Math.max(.1, r.res), cpl = r.spend / Math.max(1, r.leads), K = U.kpi;
    const d = (a: number, b: number, inv = false): string => {
      if (!prev) return '';
      const x = (a - b) / Math.max(.0001, b) * 100;
      if (Math.abs(x) < 1) return '<small class="eq">' + esc(K.stable) + '</small>';
      const good = inv ? x < 0 : x > 0;
      return '<small class="' + (good ? 'up' : 'dn') + '">' + (x > 0 ? '+' : '') + fmt(x) + ' %</small>';
    };
    return '<div class="at-kpis">' +
      '<div><span>' + esc(K.depense) + '</span><b>' + fmt(r.spend) + ' DH</b></div>' +
      '<div><span>' + esc(K.clics) + '</span><b>' + fmt(r.clicks) + '</b>' + (prev ? d(r.clicks, prev.clicks) : '') + '</div>' +
      '<div><span>' + esc(sc.lead) + '</span><b>' + fmt(r.leads) + '</b>' + (prev ? d(r.leads, prev.leads) : '') + '</div>' +
      '<div><span>' + esc(K.qualifies) + '</span><b>' + fmt(r.qual) + '</b>' + (prev ? d(r.qual, prev.qual) : '') + '</div>' +
      '<div class="hl"><span>' + esc(sc.res) + '</span><b>' + fmt(r.res) + '</b>' + (prev ? d(r.res, prev.res) : '') + '</div>' +
      '<div class="hl"><span>' + esc(fill(K.cout_par, { unite: sc.unit[0] })) + '</span><b>' + fmt(cpr) + ' DH</b>' + (prev ? d(cpr, prev.spend / Math.max(.1, prev.res), true) : '') + '</div>' +
      '</div><p class="at-sub">' + esc(fill(U.sous_kpi, { cpl: fmt(cpl, 1), part: fmt(r.qual / Math.max(1, r.leads) * 100) })) + '</p>';
  }
  function chart(): string {
    const s = st(), H = s.hist, B = s.base, sc = SC[s.sc]!, G = U.graphe;
    let max = 1;
    H.concat(B).forEach((r) => { max = Math.max(max, r.res); });
    const w = 100 / WEEKS;
    let bars = '';
    for (let i = 0; i < WEEKS; i++) {
      const r = H[i], b = B[i], x = i * w;
      if (b) bars += '<rect x="' + (x + w * .14).toFixed(2) + '" y="' + (100 - b.res / max * 92).toFixed(2) + '" width="' + (w * .3).toFixed(2) + '" height="' + (b.res / max * 92).toFixed(2) + '" class="b0"/>';
      if (r) bars += '<rect x="' + (x + w * .48).toFixed(2) + '" y="' + (100 - r.res / max * 92).toFixed(2) + '" width="' + (w * .38).toFixed(2) + '" height="' + (r.res / max * 92).toFixed(2) + '" class="b1"/>';
    }
    const tbl = '<table class="sr-only"><caption>' + esc(fill(G.legende, { res: sc.res })) + '</caption><tr><th>' + esc(G.semaine) + '</th><th>' + esc(G.vous) + '</th><th>' + esc(G.reference) + '</th></tr>' + H.map((r, i) => '<tr><td>' + (i + 1) + '</td><td>' + fmt(r.res) + '</td><td>' + fmt(B[i]?.res ?? 0) + '</td></tr>').join('') + '</table>';
    return '<figure class="at-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + bars + '</svg><div class="at-weeks" aria-hidden="true">' + Array.from({ length: WEEKS }, (_, i) => '<span>' + esc(fill(G.court, { n: i + 1 })) + '</span>').join('') + '</div><figcaption><span><i class="k1"></i>' + esc(G.votre) + '</span><span><i class="k0"></i>' + esc(G.ref) + '</span></figcaption>' + tbl + '</figure>';
  }
  function comments(r: Week, prev: Week | undefined): string[] {
    const s = st(), sc = SC[s.sc]!, c: string[] = [], Lx = U.lectures;
    if (r.learn) c.push(Lx.apprentissage);
    if (r.fat < .74) c.push(fill(Lx.fatigue, { n: s.wsr }));
    if (r.qual / Math.max(1, r.leads) < .38 && !s.perm.qualif) c.push(Lx.qualif);
    if (r.clG / Math.max(1, r.demand) > .82 && r.split < .5) c.push(Lx.google_plafond);
    if (r.split > .85) c.push(Lx.google_arret);
    if (!s.perm.speed && s.week >= 2 && c.length < 2) c.push(Lx.rappel);
    if (prev && c.length < 2) {
      const a = prev.spend / Math.max(.1, prev.res), b = r.spend / Math.max(.1, r.res), x = (b - a) / a * 100;
      if (x < -3) c.push(fill(Lx.baisse, { unite: sc.unit[0], x: fmt(-x) }));
      else if (x > 3 && c.length === 0) c.push(fill(Lx.hausse, { unite: sc.unit[0], x: fmt(x) }));
    }
    if (!c.length) c.push(Lx.stable);
    return c.slice(0, 2);
  }
  function offerActions(): string[] {
    const s = st(), r = rng(s.seed + s.week * 31), last = s.hist[s.hist.length - 1], picks = ['keep'], want: string[] = [];
    if (last && last.fat < .8) want.push('refresh');
    if (last && last.qual / Math.max(1, last.leads) < .45 && !s.perm.qualif) want.push('qualif');
    if (!s.perm.speed && s.week >= 1) want.push('speed');
    const pool = Object.keys(ACTIONS).filter((k) => k !== 'keep' && !(ACTIONS[k]!.once && s.perm[k]) && !want.includes(k) && !(k === 'refresh' && s.wsr < 2));
    want.forEach((k) => { if (picks.length < 3) picks.push(k); });
    while (picks.length < 3 && pool.length) picks.push(pool.splice(Math.floor(r() * pool.length), 1)[0]!);
    return picks;
  }
  function week(): string {
    const s = st(), sc = SC[s.sc]!, r = s.hist[s.hist.length - 1]!, prev = s.hist[s.hist.length - 2];
    const ni = s.events[s.week + 1], ev = ni !== null && ni !== undefined && s.week + 1 < WEEKS ? EVENTS[ni] ?? null : null;
    const acts = offerActions(), v = Math.round(s.split * 100);
    const head = bar(s.week + 1, WEEKS, fill(U.semaine_barre, { n: s.week + 1, total: WEEKS }));
    const res = h('h2', esc(fill(U.bilan_semaine, { n: s.week + 1 })), 'at-h') + kpis(r, prev, sc) + chart() +
      '<div class="at-read">' + comments(r, prev).map((c) => '<p>' + esc(c) + '</p>').join('') + '</div>';
    if (s.week + 1 >= WEEKS) return '<div class="at-screen">' + head + res + '<div class="at-acts"><button class="btn btn-main" type="button" data-act="end" data-focus>' + esc(U.voir_bilan) + '</button></div></div>';
    const evh = ev ? '<div class="at-ev" role="note"><b>' + esc(fill(U.imprevu, { n: s.week + 2, titre: ev.t })) + '</b><span>' + esc(ev.d) + '</span></div>' : '';
    const dec = '<div class="at-dec"><h3>' + esc(fill(U.decision, { n: s.week + 2 })) + '</h3>' + evh +
      '<fieldset class="at-opts at-opts-sm"><legend class="sr-only">' + esc(U.action_legende) + '</legend>' + acts.map((k, i) => { const a = ACTIONS[k]!; return '<label class="at-opt"><input type="radio" name="a" value="' + k + '"' + (i === 0 ? ' checked' : '') + '><span><b>' + esc(a.t) + '</b><small>' + esc(a.d) + '</small><em>' + esc(a.lever) + '</em></span></label>'; }).join('') + '</fieldset>' +
      '<div class="at-split at-split-sm"><label for="at-split">' + esc(U.repartition_label) + '</label><input type="range" id="at-split" min="0" max="100" step="5" value="' + v + '"><div class="at-split-o"><span>' + esc(U.meta) + ' <b data-o="m">' + v + ' %</b></span><span>' + esc(U.google) + ' <b data-o="g">' + (100 - v) + ' %</b></span></div></div>' +
      '<div class="at-acts"><button class="btn btn-main" type="button" data-act="run">' + esc(fill(U.lancer_semaine, { n: s.week + 2 })) + '</button></div></div>';
    return '<div class="at-screen">' + head + res + dec + '</div>';
  }

  const sum = (a: Week[], k: 'res' | 'spend'): number => a.reduce((t, r) => t + r[k], 0);
  function final(): string {
    const s = st(), sc = SC[s.sc]!, H = s.hist, B = s.base;
    const res = sum(H, 'res'), spend = sum(H, 'spend'), bres = sum(B, 'res'), bspend = sum(B, 'spend');
    const cpr = spend / Math.max(.1, res), bcpr = bspend / Math.max(.1, bres), ratio = bcpr / cpr;
    const grade = (U.notes as { min: number; note: string; texte: string }[]).find((g) => ratio >= g.min) ?? U.notes[U.notes.length - 1];
    const rows = ['aud', 'angle', 'offer', 'crea', 'frm'].map((id) => {
      const o = opt(id), cls = o.rank === 1 ? 'ok' : o.rank === 2 ? 'mid' : 'ko';
      return '<li><span class="at-v ' + cls + '">' + esc(U.rangs[String(o.rank)]) + '</span><div><b>' + esc(step(id).q) + '</b> ' + esc(optLabel(id, o)) + '<p>' + esc(o.l) + '</p></div></li>';
    });
    const P = U.pilotage, nRef = s.acts.filter((a) => a === 'refresh').length, piv: string[] = [];
    piv.push(s.perm.speed ? P.rappel_oui : P.rappel_non);
    piv.push(nRef ? fill(P.renouv_oui, { n: nRef }) : P.renouv_non);
    if (s.perm.qualif) piv.push(P.qualif);
    const learnN = H.filter((r) => r.learn).length;
    if (learnN) piv.push(fill(P.apprentissage, { n: learnN }));
    return '<div class="at-screen">' + h('h2', esc(U.bilan_titre), 'at-h') +
      '<div class="at-final"><div class="at-grade"><b>' + esc(grade.note) + '</b><span>' + esc(grade.texte) + '</span></div>' +
      '<div class="at-tot"><div><span>' + esc(sc.res) + '</span><b><span class="res">' + fmt(res) + '</span></b><small>' + esc(fill(U.reference, { v: fmt(bres) })) + '</small></div>' +
      '<div><span>' + esc(fill(U.kpi.cout_par, { unite: sc.unit[0] })) + '</span><b>' + fmt(cpr) + ' DH</b><small>' + esc(fill(U.reference, { v: fmt(bcpr) + ' DH' })) + '</small></div>' +
      '<div><span>' + esc(U.budget_depense) + '</span><b>' + fmt(spend) + ' DH</b><small>' + esc(fill(U.sur_semaines, { n: WEEKS })) + '</small></div></div></div>' +
      chart() + '<h3 class="at-h4">' + esc(U.decisions_titre) + '</h3><ul class="at-debrief">' + rows.join('') + '</ul>' +
      '<h3 class="at-h4">' + esc(U.pilotage_titre) + '</h3><div class="at-read">' + piv.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>' +
      '<div class="at-cta"><p>' + esc(U.cta_texte) + '</p><div class="at-acts"><a class="btn btn-main" href="/diagnostic/">' + esc(U.diagnostic) + '</a><button class="btn btn-ghost" type="button" data-act="again">' + esc(U.rejouer) + '</button></div></div></div>';
  }

  /* ---------- interactions ---------- */
  function bind(): void {
    app.querySelectorAll<HTMLElement>('[data-sc]').forEach((b) => b.addEventListener('click', () => { S = fresh(b.dataset.sc!); save(); render(); top(); }));
    app.querySelectorAll<HTMLInputElement>('input[name="o"]').forEach((i) => i.addEventListener('change', () => {
      st().ch[STEPS[st().step]!.id] = +i.value; save();
      const n = app.querySelector<HTMLButtonElement>('[data-act="next"]'); if (n) n.disabled = false;
    }));
    const sl = app.querySelector<HTMLInputElement>('#at-split');
    sl?.addEventListener('input', () => {
      const v = +sl.value, sc = SC[st().sc]!;
      app.querySelector('[data-o="m"]')!.textContent = v + ' %';
      app.querySelector('[data-o="g"]')!.textContent = (100 - v) + ' %';
      const a = app.querySelector('[data-o="mdh"]');
      if (a) { a.textContent = fmt(sc.budget * v / 100) + ' DH'; app.querySelector('[data-o="gdh"]')!.textContent = fmt(sc.budget * (100 - v) / 100) + ' DH'; }
      if (st().screen === 'setup') { st().split = v / 100; save(); }
    });
    app.querySelectorAll<HTMLElement>('[data-act]').forEach((b) => b.addEventListener('click', () => act(b.dataset.act!)));
  }
  function act(a: string): void {
    if (a === 'resume') { S = db.get(); render(); top(); return; }
    if (a === 'quit' || a === 'again') { db.clear(); S = null; render(); top(); return; }
    const s = st();
    if (a === 'back') { if (s.screen === 'launch') s.screen = 'setup'; else s.step = Math.max(0, s.step - 1); save(); render(); return; }
    if (a === 'next') { if (s.step < STEPS.length - 1) s.step++; else s.screen = 'launch'; save(); render(); top(); return; }
    if (a === 'go') { s.screen = 'week'; s.week = 0; s.hist = [simWeek(0, { split: s.split, wsr: 0, perm: {}, budgetMul: 1 })]; s.base = [refWeek(0)]; save(); render(); top(); return; }
    if (a === 'run') {
      const k = app.querySelector<HTMLInputElement>('input[name="a"]:checked')?.value ?? 'keep';
      const nv = +app.querySelector<HTMLInputElement>('#at-split')!.value / 100;
      const learn = Math.abs(nv - s.split) > .25;
      s.split = nv; s.acts.push(k);
      if (k === 'refresh') s.wsr = 0; else s.wsr++;
      if (k === 'scale') s.budgetMul *= 1.2;
      if (k === 'cut') s.budgetMul *= .8;
      if (ACTIONS[k]?.once) s.perm[k] = true;
      s.week++;
      s.hist.push(simWeek(s.week, { split: s.split, wsr: s.wsr, perm: { ...s.perm }, budgetMul: s.budgetMul, learn }));
      s.base.push(refWeek(s.week));
      save(); render(); top(); return;
    }
    if (a === 'end') { s.screen = 'final'; save(); render(); top(); }
  }

  render(null);
}
