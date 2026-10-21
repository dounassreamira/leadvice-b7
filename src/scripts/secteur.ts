/* Scènes des pages secteurs, pilotées par le défilement (progression 0 à 1 sur la scène épinglée).
   Immobilier : une façade de nuit, chaque fenêtre est un acheteur. B2B : des décideurs qui convergent.
   E-commerce : des colis qui vont de la commande à la livraison, certains tombent en route. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const mk = (tag: string, a: Record<string, string | number>, p: Element) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, String(a[k])); p.appendChild(e); return e as SVGElement; };
const hash = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = Record<string, any>;

const sec = document.querySelector<HTMLElement>('[data-sct]');
if (sec) {
  const svg = sec.querySelector<SVGSVGElement>('.sct-svg')!, caps = Array.from(sec.querySelectorAll<HTMLElement>('.sct-cap p'));
  const data = JSON.parse(sec.dataset.sctData || '{}') as Data, kind = sec.dataset.sct;
  let update: (p: number) => void = () => {};

  if (kind === 'immo') {
    mk('rect', { x: 250, y: 30, width: 300, height: 420, rx: 4, fill: '#1C1640' }, svg);
    mk('rect', { x: 236, y: 22, width: 328, height: 14, rx: 3, fill: '#2A2350' }, svg);
    const wins: SVGElement[] = [];
    for (let j = 0; j < 9; j++) for (let i = 0; i < 6; i++) wins.push(mk('rect', { x: 268 + i * 46, y: 52 + j * 44, width: 32, height: 26, rx: 2, fill: '#2A2350' }, svg));
    const order = wins.map((w, i) => ({ w, r: hash(i + 3) })).sort((a, b) => a.r - b.r).map((o) => o.w);
    const L = data.legendes as Data, leg: [string, string][] = [['#9C97B5', L.vues], ['#7B61FF', L.demandes], ['#FF7A59', L.visites], ['#FFC93C', L.reservation]];
    leg.forEach(([c, t], i) => { mk('rect', { x: 600, y: 150 + i * 40, width: 18, height: 14, rx: 2, fill: c }, svg); const tx = mk('text', { x: 628, y: 162 + i * 40, class: 'sct-t' }, svg); tx.textContent = t; });
    update = (p) => {
      const nVues = Math.round(cl(p / .3) * 40), nDem = Math.round(cl((p - .3) / .3) * 14), nVis = Math.round(cl((p - .6) / .25) * 5), res = p > .87;
      order.forEach((w, i) => {
        let c = '#2A2350';
        if (i < nVues) c = nDem > 0 ? '#3A3170' : '#9C97B5';
        if (i < nDem) c = nVis > 0 ? '#5B4AB0' : '#7B61FF';
        if (i < nVis) c = '#FF7A59';
        if (i === 0 && res) c = '#FFC93C';
        w.setAttribute('fill', c);
        w.style.filter = i === 0 && res ? 'drop-shadow(0 0 10px rgba(255,201,60,.9))' : '';
      });
    };
  }

  if (kind === 'b2b') {
    const roles = data.roles as string[], cx = 400, cy = 230;
    const home = roles.map((_, i): [number, number] => { const a = -Math.PI / 2 + i * (2 * Math.PI / roles.length); return [cx + Math.cos(a) * 300, cy + Math.sin(a) * 180]; });
    const seat = roles.map((_, i): [number, number] => { const a = -Math.PI / 2 + i * (2 * Math.PI / roles.length); return [cx + Math.cos(a) * 150, cy + Math.sin(a) * 110]; });
    const lines = roles.map(() => mk('line', { stroke: '#B4A6FF', 'stroke-width': 1.5 }, svg));
    const table = mk('ellipse', { cx, cy, rx: 0, ry: 0, fill: '#FF7A59' }, svg);
    const centre = mk('text', { x: cx, y: cy + 7, 'text-anchor': 'middle', class: 'sct-o' }, svg); centre.textContent = data.centre;
    const src = mk('circle', { cx: 60, cy: 230, r: 8, fill: '#7B61FF' }, svg);
    const msgs = roles.map(() => mk('circle', { r: 7, fill: '#7B61FF' }, svg));
    const nodes = roles.map((r) => { const g = mk('g', {}, svg); mk('circle', { r: 30, fill: '#fff', stroke: '#DEDAE8', 'stroke-width': 2.5 }, g); const t = mk('text', { y: 52, 'text-anchor': 'middle', class: 'sct-t' }, g); t.textContent = r; return g; });
    update = (p) => {
      const conv = ease(cl((p - .6) / .25));
      nodes.forEach((g, i) => {
        const h = home[i]!, s = seat[i]!, x = h[0] + (s[0] - h[0]) * conv, y = h[1] + (s[1] - h[1]) * conv;
        g.setAttribute('transform', `translate(${x} ${y})`);
        const hit = cl((p - .3) / .3) * roles.length > i + .9;
        g.querySelector('circle')!.setAttribute('stroke', hit ? '#7B61FF' : '#DEDAE8');
        g.querySelector('circle')!.setAttribute('fill', hit ? '#F0ECFF' : '#fff');
        (g as SVGElement).style.opacity = String(.55 + .45 * cl(p / .2));
        const k = cl((p - .3) / .3) * roles.length - i, m = msgs[i]!;
        m.style.opacity = k > 0 && k < 1 ? '1' : '0';
        const t = cl(k); m.setAttribute('cx', String(60 + (h[0] - 60) * t)); m.setAttribute('cy', String(230 + (h[1] - 230) * t));
        const ln = lines[i]!; ln.setAttribute('x1', String(x)); ln.setAttribute('y1', String(y)); ln.setAttribute('x2', String(cx)); ln.setAttribute('y2', String(cy)); ln.style.opacity = String(conv * .8);
      });
      src.style.opacity = String(1 - conv);
      const o = cl((p - .85) / .1); table.setAttribute('rx', String(86 * o)); table.setAttribute('ry', String(46 * o)); centre.style.opacity = String(o);
    };
  }

  if (kind === 'ecom') {
    const st = data.etapes_chemin as string[], X = [110, 300, 500, 690], Y = 220;
    mk('path', { d: `M60 ${Y} L740 ${Y}`, stroke: '#DEDAE8', 'stroke-width': 2, 'stroke-dasharray': '3 7', fill: 'none' }, svg);
    const dots = X.map((x, i) => { mk('text', { x, y: Y + 50, 'text-anchor': 'middle', class: 'sct-t' }, svg).textContent = st[i] ?? ''; return mk('circle', { cx: x, cy: Y, r: 10, fill: '#DEDAE8' }, svg); });
    const N = 24, boxes = Array.from({ length: N }, () => mk('rect', { width: 20, height: 16, rx: 2, fill: '#E2C066', stroke: '#8F6A22', 'stroke-width': 1 }, svg));
    const fate = boxes.map((_, i) => { const r = hash(i + 7); return r < .2 ? 1 : r < .38 ? 3 : 9; }); /* 1 : non confirmée, 3 : refusée, 9 : livrée */
    const count = mk('text', { x: 740, y: 120, 'text-anchor': 'end', class: 'sct-k' }, svg);
    update = (p) => {
      let delivered = 0;
      boxes.forEach((b, i) => {
        const t = cl(p * 1.25 - i * .018), pos = ease(t) * 3; /* 0 à 3 : de la commande à la livraison */
        const stop = fate[i] === 1 ? 1 : fate[i] === 3 ? 3 : 3;
        let x: number, y = Y - 8, o = t > 0 ? 1 : 0, c = '#E2C066';
        if (pos < stop) { const k = Math.floor(pos), f = pos - k; x = X[k]! + (X[Math.min(3, k + 1)]! - X[k]!) * f; }
        else {
          x = X[stop]!;
          const after = (pos - stop) + (t >= 1 ? 1 : 0);
          if (fate[i] === 1) { y += after * 140; o = 1 - cl(after); c = '#9C97B5'; }
          else if (fate[i] === 3) { x -= after * 120; y += after * 60; o = 1 - cl(after * .8); c = '#9C97B5'; }
          else { c = '#FF7A59'; delivered++; x += 16 + (delivered % 4) * 6; y -= 30 + Math.floor(delivered / 4) * 18; }
        }
        b.setAttribute('x', String(x - 10)); b.setAttribute('y', String(y)); b.style.opacity = String(o); b.setAttribute('fill', c);
      });
      dots.forEach((d, i) => d.setAttribute('fill', p * 1.25 * 3 > i ? (i === 3 ? '#FF7A59' : '#7B61FF') : '#DEDAE8'));
      count.textContent = delivered ? `${delivered} livrées` : '';
    };
  }

  const tick = () => {
    const r = sec.getBoundingClientRect(), p = reduce ? 1 : cl(-r.top / Math.max(1, sec.offsetHeight - innerHeight));
    update(p);
    caps.forEach((c) => { const [a, b] = (c.dataset.at || '0-1').split('-').map(Number); c.classList.toggle('on', p >= (a ?? 0) && p < (b ?? 1)); });
  };
  let raf = false;
  addEventListener('scroll', () => { if (!raf) { raf = true; requestAnimationFrame(() => { raf = false; tick(); }); } }, { passive: true });
  tick();
}
export {};
