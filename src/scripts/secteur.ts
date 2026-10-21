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
    /* le dossier passe de bureau en bureau ; chacun y pose son tampon, après avoir reçu le contenu qui répond à sa question */
    const roles = data.roles as string[], tampons = data.tampons as string[], contenus = data.contenus as string[], n = roles.length;
    const X = roles.map((_, i) => 90 + i * (620 / Math.max(1, n - 1))), Y = 300;
    const desks = roles.map((r, i) => {
      const g = mk('g', { transform: `translate(${X[i]} ${Y})` }, svg);
      mk('circle', { cx: 0, cy: -62, r: 15, fill: '#D6CFFA' }, g);
      mk('path', { d: 'M-24 -22 a24 22 0 0 1 48 0 z', fill: '#D6CFFA' }, g);
      mk('rect', { x: -62, y: -20, width: 124, height: 10, rx: 3, fill: '#2A2350' }, g);
      mk('rect', { x: -52, y: -10, width: 6, height: 34, fill: '#2A2350' }, g); mk('rect', { x: 46, y: -10, width: 6, height: 34, fill: '#2A2350' }, g);
      const t = mk('text', { y: 52, 'text-anchor': 'middle', class: 'sct-t' }, g); t.textContent = r;
      const chip = mk('g', { opacity: 0 }, g);
      mk('rect', { x: -66, y: 64, width: 132, height: 30, rx: 6, fill: '#fff', stroke: '#B4A6FF' }, chip);
      const ct = mk('text', { y: 84, 'text-anchor': 'middle', class: 'sct-t' }, chip); ct.textContent = contenus[i] ?? '';
      const st = mk('g', { opacity: 0, transform: `translate(0 -118) rotate(${i % 2 ? 5 : -5})` }, g);
      const last = i === n - 1;
      mk('rect', { x: -62, y: -16, width: 124, height: 30, rx: 4, fill: last ? '#FFF4EF' : '#F3F0FB', stroke: last ? '#C2410C' : '#7B61FF', 'stroke-width': 1.6 }, st);
      const stt = mk('text', { y: 4, 'text-anchor': 'middle', class: last ? 'sct-st' : 'sct-sv' }, st); stt.textContent = tampons[i] ?? '';
      return { g, chip, st, head: g.querySelector('circle')!, body: g.querySelector('path')! };
    });
    const fold = mk('g', {}, svg);
    mk('path', { d: 'M-34 -24 h22 l6 6 h40 v40 h-68 z', fill: '#7B61FF' }, fold);
    mk('rect', { x: -28, y: -10, width: 40, height: 4, rx: 2, fill: '#fff', opacity: .8 }, fold); mk('rect', { x: -28, y: -2, width: 28, height: 4, rx: 2, fill: '#fff', opacity: .6 }, fold);
    const ft = mk('text', { y: 42, 'text-anchor': 'middle', class: 'sct-t' }, fold); ft.textContent = data.dossier;
    const fin = mk('text', { x: 400, y: 70, 'text-anchor': 'middle', class: 'sct-o' }, svg); fin.textContent = data.centre;
    const seg = .7 / Math.max(1, n - 1);
    update = (p) => {
      const pos = cl((p - .08) / .7) * (n - 1), i0 = Math.floor(pos), f = pos - i0, k = ease(f);
      const x = i0 >= n - 1 ? X[n - 1]! : X[i0]! + (X[i0 + 1]! - X[i0]!) * k, y = Y - 150 - Math.sin(f * Math.PI) * 40 * (i0 < n - 1 ? 1 : 0);
      fold.setAttribute('transform', `translate(${x} ${y + (p > .86 ? -10 * ease(cl((p - .86) / .1)) : 0)}) scale(${1 + .25 * ease(cl((p - .86) / .1))})`);
      desks.forEach((d, i) => {
        const reached = pos >= i - .02, near = Math.abs(pos - i) < .7;
        (d.chip as SVGElement).setAttribute('opacity', String(near || (reached && p > .86) ? 1 : reached ? .45 : 0));
        const sk = cl((pos - i + .02) / .25);
        (d.st as SVGElement).setAttribute('opacity', String(reached ? sk : 0));
        d.head.setAttribute('fill', reached ? (i === n - 1 ? '#FF7A59' : '#7B61FF') : '#D6CFFA');
        d.body.setAttribute('fill', reached ? (i === n - 1 ? '#FF7A59' : '#7B61FF') : '#D6CFFA');
      });
      (fin as SVGElement).style.opacity = String(cl((p - .88) / .08));
      void seg;
    };
  }

  if (kind === 'ecom') {
    /* quatre étapes réelles : la commande sur le téléphone, la confirmation WhatsApp, le colis, la porte.
       Certains clients ne répondent pas, d'autres refusent le colis ; seuls les colis payés s'empilent. */
    const st = data.etapes_chemin as string[], X: [number, number, number, number] = [100, 300, 500, 700], Y = 250;
    mk('path', { d: `M60 ${Y + 60} L740 ${Y + 60}`, stroke: '#DEDAE8', 'stroke-width': 2, 'stroke-dasharray': '3 7', fill: 'none' }, svg);
    X.forEach((x, i) => { const t = mk('text', { x, y: Y + 96, 'text-anchor': 'middle', class: 'sct-t' }, svg); t.textContent = st[i] ?? ''; });
    /* 1. téléphone et notification */
    const ph = mk('g', { transform: `translate(${X[0]} ${Y - 20})` }, svg);
    mk('rect', { x: -32, y: -62, width: 64, height: 124, rx: 12, fill: '#16131F' }, ph); mk('rect', { x: -27, y: -55, width: 54, height: 110, rx: 8, fill: '#FBFAFD' }, ph);
    const notif = mk('g', {}, ph); mk('rect', { x: -24, y: -44, width: 48, height: 26, rx: 5, fill: '#fff', stroke: '#B4A6FF' }, notif); mk('rect', { x: -19, y: -37, width: 30, height: 4, rx: 2, fill: '#16131F' }, notif); mk('rect', { x: -19, y: -28, width: 20, height: 4, rx: 2, fill: '#B4A6FF' }, notif);
    /* 2. bulle WhatsApp */
    const wa = mk('g', { transform: `translate(${X[1]} ${Y - 40})` }, svg);
    mk('rect', { x: -78, y: -40, width: 150, height: 34, rx: 10, fill: '#fff', stroke: '#DEDAE8' }, wa);
    const q = mk('text', { x: -68, y: -18, class: 'sct-t' }, wa); q.textContent = data.question;
    const rep = mk('g', {}, wa); mk('rect', { x: -40, y: 4, width: 112, height: 30, rx: 10, fill: '#D9FDD3' }, rep);
    const rt = mk('text', { x: -30, y: 24, class: 'sct-t' }, rep); rt.textContent = data.reponse;
    /* 3. le colis étiqueté */
    const bx = mk('g', { transform: `translate(${X[2]} ${Y - 10})` }, svg);
    mk('rect', { x: -40, y: -34, width: 80, height: 62, rx: 3, fill: '#D9B38C', stroke: '#9C7A55' }, bx); mk('rect', { x: -6, y: -34, width: 12, height: 62, fill: '#C79E74' }, bx); mk('rect', { x: 8, y: -4, width: 26, height: 18, rx: 2, fill: '#fff' }, bx);
    /* 4. la porte */
    const dr = mk('g', { transform: `translate(${X[3]} ${Y - 10})` }, svg);
    mk('path', { d: 'M-48 -10 L0 -50 L48 -10 Z', fill: '#2A2350' }, dr); mk('rect', { x: -40, y: -10, width: 80, height: 60, fill: '#fff', stroke: '#DEDAE8' }, dr); mk('rect', { x: -12, y: 10, width: 24, height: 40, rx: 2, fill: '#7B61FF' }, dr);
    const N = 11, fate = Array.from({ length: N }, (_, i) => { const r = hash(i + 7); return r < .2 ? 1 : r < .36 ? 3 : 9; }); /* 1 : sans réponse, 3 : refusé, 9 : livré et payé */
    const boxes = fate.map(() => { const g = mk('g', {}, svg); mk('rect', { x: -11, y: -9, width: 22, height: 18, rx: 2, fill: '#D9B38C', stroke: '#9C7A55' }, g); mk('rect', { x: -2, y: -9, width: 4, height: 18, fill: '#C79E74' }, g); return g; });
    const tagNo = mk('text', { x: X[1], y: Y + 130, 'text-anchor': 'middle', class: 'sct-t' }, svg); tagNo.textContent = data.sans_reponse;
    const tagRef = mk('text', { x: X[3] - 70, y: Y + 130, 'text-anchor': 'middle', class: 'sct-t' }, svg); tagRef.textContent = data.refuse;
    const stamp = mk('g', { transform: `translate(${X[3] + 10} ${Y - 92}) rotate(-6)`, opacity: 0 }, svg); mk('rect', { x: -40, y: -16, width: 80, height: 30, rx: 4, fill: '#FFF4EF', stroke: '#C2410C', 'stroke-width': 1.6 }, stamp);
    const stt = mk('text', { y: 4, 'text-anchor': 'middle', class: 'sct-st' }, stamp); stt.textContent = data.paye;
    const count = mk('text', { x: 740, y: 90, 'text-anchor': 'end', class: 'sct-k' }, svg);
    update = (p) => {
      let delivered = 0, refused = 0, silent = 0, ordered = 0;
      boxes.forEach((b, i) => {
        const t = cl((p - .02 - i * .032) / .5), pos = ease(t) * 3;
        if (t > 0) ordered++;
        const stop = fate[i] === 1 ? 1 : 3;
        let x: number, y = Y + 50, o = t > 0 ? 1 : 0;
        if (pos < stop) { const k = Math.floor(pos), f = pos - k; x = X[k]! + (X[Math.min(3, k + 1)]! - X[k]!) * f; }
        else {
          x = X[stop]!;
          const after = cl((p - .02 - i * .032 - .5 * (stop / 3)) / .08);
          if (fate[i] === 1) { silent++; y += after * 30; o = 1 - .8 * after; }
          else if (fate[i] === 3) { refused++; x -= after * 70; o = 1 - .7 * after; }
          else { delivered++; x += 54 + ((delivered - 1) % 2) * 24; y -= 4 + Math.floor((delivered - 1) / 2) * 20; }
        }
        b.setAttribute('transform', `translate(${x} ${y})`); (b as SVGElement).style.opacity = String(o);
      });
      (notif as SVGElement).style.opacity = String(.4 + .6 * Math.abs(Math.sin(p * 20)));
      (rep as SVGElement).style.opacity = String(cl((p - .2) / .1));
      (tagNo as SVGElement).style.opacity = String(silent ? 1 : 0); (tagRef as SVGElement).style.opacity = String(refused ? 1 : 0);
      (stamp as SVGElement).setAttribute('opacity', String(cl((p - .8) / .1)));
      count.textContent = ordered ? `${delivered} ${data.livrees} ${ordered} ${data.commandees}` : '';
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
