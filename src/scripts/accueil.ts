/* Accueil « Parcours » : plan-séquence de l'ouverture, fil qui descend la page, mini-scènes des sections.
   Tout est piloté par le défilement (progression de 0 à 1 par scène) ; rien ne joue seul pendant la lecture. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const vh = () => innerHeight;
const prog = (el: Element, a = .85, b = .35) => { const r = el.getBoundingClientRect(); return reduce ? 1 : cl((vh() * a - r.top) / (vh() * (a - b) + r.height * .5)); };
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag: string, attrs: Record<string, string | number>, parent?: Element) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, String(attrs[k])); parent?.appendChild(e); return e as SVGGeometryElement; };
type Dashed = SVGGeometryElement & { _L?: number };
const dash = (el: Dashed) => { const L = el.getTotalLength(); el.style.strokeDasharray = String(L); el.style.strokeDashoffset = String(L); el._L = L; return el; };
const draw = (el: Dashed, k: number) => { el.style.strokeDashoffset = String((el._L ?? 0) * (1 - cl(k))); };
const hdr = $('[data-hdr]');

/* ---------- ouverture : plan-séquence ---------- */
const story = $('[data-pc-story]')!, stage = $('[data-pc-stage]')!, world = $('[data-pc-world]')!, dot = $('[data-pc-dot]')!;
const lineSvg = $<SVGSVGElement>('[data-pc-line]')!, ghost = $<SVGPathElement>('.ghost', lineSvg)!, trail = $<SVGPathElement>('.trail', lineSvg)!;
const anchors = [0, 1, 2, 3, 4].map((i) => $(`[data-pc-anchor="${i}"]`)!);
const feed = $('[data-pc-feed]')!, delay = $('[data-pc-delay]')!, delaySteps = JSON.parse(delay.dataset.steps || '[]') as { titre: string; sous: string }[];
const typed = $$('[data-type]', story);
const T: [number, number][] = [[0, .12], [.12, .22], [.22, .32], [.32, .4], [.4, .56], [.56, .64], [.64, .78], [.78, .86], [.86, 1]];
let A: [number, number][] = [], segs: SVGPathElement[] = [], lens: number[] = [], total = 0;
function layout(): void {
  if (reduce) return;
  segs.forEach((p) => p.remove());
  world.style.transform = 'none'; feed.style.setProperty('--fy', '-90px');
  const w = world.getBoundingClientRect();
  A = anchors.map((e): [number, number] => { const r = e.getBoundingClientRect(); return [r.left - w.left + r.width / 2, r.top - w.top + r.height / 2]; });
  const a0 = A[0]!; let d = `M${a0[0]} ${a0[1]}`; segs = [];
  for (let i = 1; i < A.length; i++) {
    const [x0, y0] = A[i - 1]!, [x1, y1] = A[i]!, top = vh() * .12;
    /* le fil passe au-dessus des textes, puis descend droit sur sa cible */
    const s = `C ${x0 + (x1 - x0) * .3} ${Math.max(top, y0 - vh() * .38)}, ${x1} ${Math.max(top, y1 - vh() * .42)}, ${x1} ${y1}`; d += ' ' + s;
    const p = mk('path', { d: `M${x0} ${y0} ${s}` }, lineSvg) as unknown as SVGPathElement; p.style.display = 'none'; segs.push(p);
  }
  ghost.setAttribute('d', d); trail.setAttribute('d', d);
  lens = segs.map((p) => p.getTotalLength()); total = lens.reduce((a, b) => a + b, 0); trail.style.strokeDasharray = String(total);
}
const N = [19, 13, 51], DAWN = [70, 52, 140], D = [246, 245, 251];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i]! - v) * t));
function hero(): void {
  const r = story.getBoundingClientRect();
  if (reduce) { hdr?.classList.toggle('on-dark', r.bottom > 80 && r.top < 40); return; }
  const P = cl(-r.top / (story.offsetHeight - vh()));
  let seg = 0, f = 0;
  for (let i = 0; i < T.length; i++) { const [a, b] = T[i]!; if (P >= a && P <= b) { if (i % 2) { seg = (i - 1) / 2; f = ease((P - a) / (b - a)); } else seg = i / 2; break; } }
  let x: number, y: number, tr: number;
  if (seg >= segs.length) { [x, y] = A[A.length - 1]!; tr = total; }
  else { const pt = f ? segs[seg]!.getPointAtLength(lens[seg]! * f) : { x: A[seg]![0], y: A[seg]![1] }; x = pt.x; y = pt.y; tr = lens.slice(0, seg).reduce((a, b) => a + b, 0) + lens[seg]! * f; }
  trail.style.strokeDashoffset = String(total - tr);
  const camX = Math.max(-(world.offsetWidth - innerWidth), Math.min(0, innerWidth * (innerWidth >= 900 ? .64 : .5) - x));
  world.style.transform = `translateX(${camX}px)`;
  dot.style.transform = `translate(${x + camX}px, ${y}px)`;
  const dayT = cl((P - .78) / .1), dawnT = cl((P - .72) / .06);
  const bg = dayT > 0 ? mix(DAWN, D, dayT) : mix(N, DAWN, dawnT);
  stage.style.setProperty('--bg', `rgb(${bg})`);
  /* le texte suit la luminosité réelle du fond */
  const light = (.2126 * bg[0]! + .7152 * bg[1]! + .0722 * bg[2]!) / 255 > .55;
  stage.classList.toggle('day', light);
  stage.style.setProperty('--fg', light ? '#16131F' : '#F4F2FB');
  stage.style.setProperty('--aura', light ? '.5' : '1');
  hdr?.classList.toggle('on-dark', !light && r.bottom > 80);
  feed.style.setProperty('--fy', `${-cl(P / .1) * 90}px`);
  anchors[0]!.classList.toggle('hit', P > .09);
  typed.forEach((b, i) => { const s = b.dataset.type || '', k = cl(cl((P - .41) / .12) * 3 - i); b.textContent = s.slice(0, Math.round(s.length * k)); });
  $('[data-pc-send]')!.classList.toggle('on', P > .54);
  $('[data-pc-notif]')!.classList.toggle('on', P > .66);
  $('[data-pc-call]')!.classList.toggle('on', P > .7);
  $('[data-pc-signed]')!.classList.toggle('on', P > .93);
  delay.classList.toggle('on', P > .55 && P < .9);
  const ds = delaySteps[P < .72 ? 0 : 1];
  if (ds) { $('b', delay)!.textContent = ds.titre; $('small', delay)!.textContent = ds.sous; }
}

/* ---------- le fil qui descend la page ---------- */
const flow = $('[data-pc-flow]')!, rail = $<SVGSVGElement>('[data-pc-rail]')!, railLine = $<SVGPathElement>('.l', rail)!, railGhost = $<SVGPathElement>('.g', rail)!, railDot = $('[data-pc-rail-dot]')!;
let nodes: HTMLElement[] = [], railLen = 0, stopLen: number[] = [];
function railLayout(): void {
  nodes.forEach((n) => n.remove()); nodes = [];
  const fr = flow.getBoundingClientRect(), W = flow.clientWidth, wide = W >= 900;
  const xL = wide ? Math.max(24, (W - 1240) / 2 + 18) : 14;
  const stops = $$('[data-stop]', flow).map((s): [number, number] => { const h = $('h2', s)!; return [xL, h.getBoundingClientRect().top - fr.top + 22]; });
  const er = $('[data-pc-target]')!.getBoundingClientRect();
  const pts: [number, number][] = [[xL, 0], ...stops.slice(0, -1), [er.left - fr.left + er.width / 2, er.top - fr.top + er.height / 2]];
  const p0 = pts[0]!; let d = `M${p0[0]} ${p0[1]}`;
  const tmp = document.createElementNS(NS, 'path');
  stopLen = [0];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!, [x1, y1] = pts[i]!, dy = y1 - y0, sw = wide ? 30 : 5;
    if (i === pts.length - 1) d += ` L${x0} ${y1 - 110} C ${x0} ${y1 - 40}, ${x1} ${y1 - 70}, ${x1} ${y1}`;
    else d += ` C ${x0 + (i % 2 ? sw : -sw)} ${y0 + dy * .45}, ${x1 + (i % 2 ? -sw : sw)} ${y1 - dy * .45}, ${x1} ${y1}`;
    tmp.setAttribute('d', d); stopLen.push(tmp.getTotalLength());
  }
  railGhost.setAttribute('d', d); railLine.setAttribute('d', d);
  railLen = railLine.getTotalLength(); railLine.style.strokeDasharray = String(railLen);
  pts.slice(1, -1).forEach(([x, y]) => { const n = document.createElement('div'); n.className = 'pc-node'; n.style.left = x + 'px'; n.style.top = y + 'px'; flow.appendChild(n); nodes.push(n); });
}
function railUpdate(): void {
  const fr = flow.getBoundingClientRect(), focus = vh() * .55 - fr.top;
  let lo = 0, hi = railLen;
  if (reduce) lo = railLen; else for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (railLine.getPointAtLength(m).y < focus) lo = m; else hi = m; }
  const L = Math.max(0, Math.min(railLen, lo));
  railLine.style.strokeDashoffset = String(railLen - L);
  const p = railLine.getPointAtLength(L);
  railDot.style.transform = `translate(${p.x}px, ${p.y}px)`;
  railDot.style.opacity = L > 2 && !reduce ? '1' : '0';
  nodes.forEach((n, i) => n.classList.toggle('on', L >= stopLen[i + 1]! - 1));
}

/* ---------- pertes : une scène par phrase ---------- */
const B: Record<string, HTMLElement> = {};
$$('[data-brk]').forEach((el) => { B[el.dataset.brk!] = el; $$<SVGGeometryElement>('.tie', el).forEach((t) => dash(t)); });
const swap = (el: Element, b: boolean) => { el.textContent = (b ? (el as HTMLElement).dataset.b : (el as HTMLElement).dataset.a) || ''; };
function pertes(): void {
  { const el = B.call!, p = prog(el, .9, .3), after = p >= .55;
    draw($('.tie', el) as unknown as Dashed, (p - .55) / .3);
    ($('.t1-p', el) as unknown as SVGElement).style.opacity = String(after ? .4 + .6 * cl((p - .8) / .1) : 1 - .75 * cl(p / .45));
    $('.t1-bub', el)!.setAttribute('opacity', String(cl((p - .55) / .12)));
    swap($('.t1-call', el)!, after); swap($('.t1-gap', el)!, after);
    const st = $('.t1-state', el) as unknown as SVGElement; swap(st, after);
    st.style.opacity = String(after ? cl((p - .82) / .1) : cl((p - .3) / .12)); st.style.fill = after ? '#C2410C' : '#6B4EFF';
    $('.t1-dot', el)!.setAttribute('fill', after && p > .82 ? '#FF7A59' : '#B4A6FF');
    el.classList.toggle('done', after); }
  { const el = B.attr!, p = prog(el, .9, .3), res = p >= .78;
    const svg = $('svg', el)!, W = JSON.parse((svg as unknown as HTMLElement).dataset.at || '{}') as { un?: string; plus?: string };
    const ads = $$('.t2-ad', el), stamps = $$('.t2-st > g', el);
    /* quatre ventes arrivent : B, A, B, B ; chaque tampon se pose sur l'annonce qui l'a amenée */
    const hits = [1, 0, 1, 1], at = [.22, .36, .5, .62], n = [0, 0, 0];
    stamps.forEach((g, i) => {
      const k = ease(cl((p - at[i]!) / .1)), ad = hits[i]!, x = 12 + ad * 104 + 44 + (i === 3 ? 10 : i === 2 ? -10 : 0), y0 = -20, y1 = 54 + (i % 2) * 8;
      g.setAttribute('opacity', String(cl((p - at[i]!) / .04)));
      g.setAttribute('transform', `translate(${x} ${y0 + (y1 - y0) * k}) rotate(${-8 + i * 5}) scale(${1.4 - .4 * k})`);
      if (k >= 1) n[ad]!++;
    });
    ads.forEach((g, i) => {
      $('.t2-n', g)!.textContent = n[i] + ' ' + (n[i] === 1 ? W.un : W.plus);
      const cut = i === 2 ? ease(cl((p - .78) / .1)) : 0, grow = ease(cl((p - .8) / .12));
      ($('.t2-cut', g) as unknown as SVGElement).setAttribute('opacity', String(cut));
      (g as unknown as SVGElement).style.opacity = String(1 - .45 * cut);
      $('.t2-bar', g)!.setAttribute('width', String(i === 2 ? 44 * (1 - grow) : i === 1 ? 44 + 40 * grow : 44));
      $('rect', g)!.setAttribute('stroke', i === 1 && res ? '#7B61FF' : '#DEDAE8');
    });
    ($('.t2-res', el) as unknown as SVGElement).style.opacity = String(cl((p - .85) / .1));
    el.classList.toggle('done', res); }
  { const el = B.lang!, p = prog(el, .9, .3), k = ease(cl((p - .4) / .3));
    draw($('.tie', el) as unknown as Dashed, (p - .4) / .25);
    ($('.t3-a', el) as unknown as SVGElement).style.transform = `translateX(${k * 14}px)`;
    ($('.t3-b', el) as unknown as SVGElement).style.transform = `translateX(${-k * 14}px)`;
    const tab = $('.t3-tab', el) as unknown as SVGElement; tab.setAttribute('opacity', String(cl((p - .6) / .15))); tab.style.transform = `translateY(${(1 - cl((p - .6) / .15)) * 10}px)`;
    el.classList.toggle('done', p >= .75); }
}

/* ---------- expertises : les objets du métier, animés au défilement (dessinés par motion.ts) ---------- */
const xcv = $$<HTMLCanvasElement>('.pc-xcv');
function expertises(): void {
  xcv.forEach((c) => { c.dataset.p = String(reduce ? 1 : prog(c.closest('.pc-xc') as HTMLElement, .95, .3).toFixed(3)); });
}

/* ---------- système : les liens se tracent un par un ---------- */
const sysv = $('[data-pc-sys]')!, PIECES = JSON.parse(sysv.dataset.pieces || '[]') as string[];
const pts = PIECES.map((_, i): [number, number] => { const a = -Math.PI / 2 + i * Math.PI / 3; return [180 + Math.cos(a) * 128, 160 + Math.sin(a) * 118]; });
const spokes = pts.map(([x, y]) => dash(mk('path', { d: `M${x} ${y} L180 160` }, $('.sy-l', sysv)!)));
const ring = dash(mk('path', { d: 'M' + pts.map((p) => p.join(' ')).join(' L') + ' Z' }, $('.sy-l', sysv)!));
const nodes6 = pts.map(([x, y], i) => { const g = mk('g', {}, $('.sy-n', sysv)!); mk('rect', { x: x - 46, y: y - 16, width: 92, height: 32, rx: 6, fill: '#fff', stroke: '#DEDAE8' }, g); const t = mk('text', { x, y: y + 5, 'text-anchor': 'middle', class: 'sv-b' }, g); t.textContent = PIECES[i] ?? ''; return g; });
function systeme(): void {
  const p = prog(sysv, .9, .35);
  nodes6.forEach((g, i) => { const k = cl(p * 7 - i * .8); (g as unknown as SVGElement).style.opacity = String(.35 + .65 * k); g.querySelector('rect')!.setAttribute('stroke', k >= 1 ? '#7B61FF' : '#DEDAE8'); });
  spokes.forEach((s, i) => draw(s, p * 7 - i * .8 - .3));
  draw(ring, (p - .75) / .2);
}

/* ---------- pour qui, méthode : les éléments s'allument au passage ---------- */
const fit = $$('.pc-fit li'), steps = $$('[data-pc-steps] li');
const mark = (els: HTMLElement[], at: number) => els.forEach((li) => li.classList.toggle('on', reduce || li.getBoundingClientRect().top < vh() * at));

/* ---------- le plan s'écrit ---------- */
const doc = $('[data-pc-doc]')!, writing = $$('[data-t]', doc), totalChars = writing.reduce((a, e) => a + (e.dataset.t || '').length, 0), stamp = $('[data-pc-stamp]')!;
function plan(): void {
  const p = prog(doc, .9, .35);
  let n = Math.round(cl(p / .85) * totalChars), cur: HTMLElement | null = null;
  for (const e of writing) { const s = e.dataset.t || '', k = Math.max(0, Math.min(s.length, n)); e.textContent = s.slice(0, k); e.classList.remove('cur'); if (k > 0 && k < s.length && !cur) cur = e; n -= s.length; }
  cur?.classList.add('cur');
  const s = cl((p - .88) / .08); stamp.style.setProperty('--so', String(s)); stamp.style.setProperty('--sc', String(1.8 - .8 * s));
}

/* ---------- ateliers ---------- */
const W: Record<string, HTMLElement> = {}; $$('[data-w]').forEach((el) => { W[el.dataset.w!] = el; });
const wbars = Array.from({ length: 8 }, (_, i) => mk('rect', { x: 14 + i * 36, width: 22, rx: 2, fill: '#B4A6FF' }, $('.wa-b', W.camp!)!)), WH = [18, 26, 22, 34, 30, 44, 52, 60];
function ateliers(): void {
  { const p = prog(W.camp!, .9, .35); let d = '';
    wbars.forEach((b, i) => { const k = cl(p * 9 - i), h = WH[i]! * k; b.setAttribute('y', String(76 - h)); b.setAttribute('height', String(h)); b.setAttribute('fill', i === 2 && k > .9 ? '#FF7A59' : '#B4A6FF'); if (k > 0) d += (d ? ' L' : 'M') + (25 + i * 36) + ' ' + (72 - h); });
    $('.wa-l', W.camp!)!.setAttribute('d', d); }
  { const p = prog(W.page!, .9, .35);
    $$('.wp-b rect', W.page!).forEach((r, i) => { const k = ease(cl(p * 5 - i)); (r as unknown as SVGElement).style.opacity = String(k); (r as unknown as SVGElement).style.transform = `translateX(${(1 - k) * (i % 2 ? 40 : -40)}px)`; }); }
}

/* ---------- formulaire de l'exemple de plan : /api/lead, source conservée ---------- */
const form = $<HTMLFormElement>('[data-pc-lead]'), msg = $('[data-pc-msg]');
form?.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const email = (form.elements.namedItem('email') as HTMLInputElement);
  if (!email.checkValidity()) { email.reportValidity(); return; }
  const q = new URLSearchParams(location.search);
  const body = { email: email.value, magnet: form.dataset.magnet, site: (form.elements.namedItem('site') as HTMLInputElement).value, source: q.get('utm_source') || 'site', campagne: q.get('utm_campaign') || '', page: location.pathname };
  try {
    const r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(String(r.status));
    if (msg) msg.textContent = form.dataset.ok || ''; form.reset();
  } catch { if (msg) msg.textContent = form.dataset.err || ''; }
});

function all(): void { hero(); railUpdate(); pertes(); expertises(); systeme(); mark(fit, .85); mark(steps, .62); plan(); ateliers(); }
function relayout(): void { layout(); railLayout(); all(); }
relayout();
let ticking = false;
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; all(); }); } }, { passive: true });
let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(relayout, 150); });
document.fonts?.ready.then(relayout);
addEventListener('load', relayout);
$$('.pc-faq details').forEach((d) => d.addEventListener('toggle', () => { railLayout(); railUpdate(); }));
/* la scène du dirham est épinglée par motion.ts après le premier rendu : on recalcule le fil quand la page change de hauteur */
new ResizeObserver(() => { railLayout(); railUpdate(); }).observe(flow);
export {};
