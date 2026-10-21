/* Page diagnostic : un exemple de plan tapé à la machine au fil du défilement.
   Le nom saisi par le visiteur est tapé dans l'en-tête ; clavier AZERTY, sonnette à chaque fin de ligne. */
const story = document.querySelector<HTMLElement>('[data-tw]');
if (story) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paper = story.querySelector<HTMLElement>('.tw-paper')!, win = story.querySelector<HTMLElement>('.tw-window')!;
  const kb = story.querySelector<HTMLElement>('.tw-kb')!, bell = story.querySelector<HTMLElement>('.tw-bell')!, stage = story.querySelector<HTMLElement>('.tw-stage')!;
  const input = document.querySelector<HTMLInputElement>('#tw-co');
  const SRC = story.dataset.src || '', DEF = story.dataset.def || '';
  const keys: Record<string, HTMLElement> = {};
  ['1234567890', 'AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'].forEach((r) => {
    const d = document.createElement('div'); d.className = 'tw-row';
    for (const ch of r) { const k = document.createElement('div'); k.className = 'tw-key'; k.textContent = ch; d.appendChild(k); keys[ch] = k; }
    kb.appendChild(d);
  });
  { const d = document.createElement('div'); d.className = 'tw-row'; const k = document.createElement('div'); k.className = 'tw-key space'; d.appendChild(k); kb.appendChild(d); keys[' '] = k; }
  const kbH = () => Math.max(140, Math.min(230, innerHeight * .28));
  stage.style.setProperty('--kb', kbH() + 'px');

  type Ch = { el: HTMLElement; ch: string };
  let seq: Ch[] = [], shown = 0, tops: number[] = [], lefts: number[] = [];
  const pos = (e: HTMLElement | null) => { let t = 0, l = 0; while (e && e !== paper) { t += e.offsetTop; l += e.offsetLeft; e = e.offsetParent as HTMLElement | null; } return [t, l] as const; };
  const measure = () => { const m = seq.map((o) => pos(o.el)); tops = m.map((v) => v[0]); lefts = m.map((v) => v[1]); };

  const render = () => {
    paper.textContent = ''; seq = [];
    const name = (input?.value || DEF).trim() || DEF;
    const s = SRC.replace('{nom}', name.replace(/[{}~*#|]/g, ''));
    let red = false, bold = false;
    const add = (ch: string, parent: HTMLElement = paper) => {
      const sp = document.createElement('span'); sp.textContent = ch;
      if (red) sp.classList.add('r'); if (bold) sp.classList.add('b');
      parent.appendChild(sp); seq.push({ el: sp, ch }); return sp;
    };
    for (let i = 0; i < s.length; i++) {
      const ch = s[i]!;
      if (ch === '~') { red = !red; continue; }
      if (ch === '*') { bold = !bold; continue; }
      if (ch === '#') { add('█').classList.add('r'); continue; }
      if (ch === '{') {
        const end = s.indexOf('}', i), [bad = '', good = ''] = s.slice(i + 1, end).split('|');
        const w = document.createElement('span'); w.className = 'wrong'; paper.appendChild(w);
        for (const c of bad) add(c, w);
        const xs = document.createElement('span'); xs.className = 'xs'; w.appendChild(xs);
        for (let k = 0; k < bad.length; k++) add('x', xs);
        add(' '); for (const c of good) add(c);
        i = end; continue;
      }
      add(ch);
    }
    shown = 0;
    story.style.height = reduce ? '' : (seq.length * (innerWidth < 700 ? 2.2 : 2.8) + innerHeight) + 'px';
    measure(); update();
  };

  const keyOf = (ch: string) => keys[ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()] ?? null;
  let lastKey: HTMLElement | null = null, keyT = 0, bellT = 0;
  const update = () => {
    const r = story.getBoundingClientRect(), span = Math.max(1, story.offsetHeight - innerHeight);
    const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / span));
    const n = Math.round(p * seq.length);
    if (n > shown) for (let i = shown; i < n; i++) seq[i]!.el.classList.add('v');
    else for (let i = n; i < shown; i++) seq[i]!.el.classList.remove('v');
    const prev = shown; shown = n;
    if (reduce) return;
    const cur = Math.max(0, n - 1), lineY = win.clientHeight * .62;
    const shiftX = innerWidth > 800 ? (paper.clientWidth / 2 - (lefts[cur] ?? 0)) * .18 : 0;
    paper.style.transform = `translate(calc(-50% + ${shiftX}px), ${lineY - (tops[cur] ?? 0) - 20}px)`;
    const c = seq[cur];
    if (n !== prev && c) {
      const k = c.ch === '\n' ? null : keyOf(c.ch);
      lastKey?.classList.remove('down');
      if (k) { k.classList.add('down'); lastKey = k; clearTimeout(keyT); keyT = window.setTimeout(() => k.classList.remove('down'), 110); }
      if (c.ch === '\n' && seq[cur - 1]?.ch !== '\n') { bell.classList.add('on'); clearTimeout(bellT); bellT = window.setTimeout(() => bell.classList.remove('on'), 380); }
    }
  };
  let raf = false;
  addEventListener('scroll', () => { if (!raf) { raf = true; requestAnimationFrame(() => { raf = false; update(); }); } }, { passive: true });
  addEventListener('resize', () => { stage.style.setProperty('--kb', kbH() + 'px'); measure(); update(); });
  input?.addEventListener('input', render);
  document.fonts?.ready.then(() => { measure(); update(); });
  render();
}
export {};
