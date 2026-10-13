/* Page /dev/design/ : contrastes calculés en direct, largeur d'aperçu typographique, grille (touche G), mouvement. */
function lum(rgb: number[]): number {
  const [r, g, b] = rgb.map((v) => { const c = v / 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }) as [number, number, number];
  return .2126 * r + .7152 * g + .0722 * b;
}
function parse(c: string): number[] { const m = c.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
const ratio = (a: number[], b: number[]): number => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
const hex = (rgb: number[]): string => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();

export function initDesignPage(): void {
  document.querySelectorAll<HTMLElement>('.dv-col').forEach((col) => {
    const bg = parse(getComputedStyle(col).backgroundColor);
    col.querySelectorAll<HTMLElement>('.sw').forEach((sw) => {
      const c = parse(getComputedStyle(sw.querySelector('i')!).backgroundColor);
      sw.querySelector('[data-hex]')!.textContent = hex(c);
      const kind = sw.dataset.kind;
      const out = sw.querySelector('[data-ratio]')!;
      if (kind === 'bg') { out.textContent = ''; return; }
      if (kind === 'btn') { const r = ratio(c, [255, 255, 255]); out.textContent = 'Texte blanc dessus : ' + r.toFixed(2) + ':1, ' + (r >= 4.5 ? 'AA' : 'insuffisant'); return; }
      if (kind === 'yellow') { const r = ratio(c, [30, 15, 82]); out.textContent = 'Encre violette dessus : ' + r.toFixed(2) + ':1, AA'; return; }
      const r = ratio(c, bg);
      const verdict = kind === 'deco' ? 'décor seulement' : kind === 'ui' ? (r >= 3 ? 'composant AA (3:1)' : 'insuffisant') : (r >= 4.5 ? 'AA' : r >= 3 ? 'grands titres seulement' : 'insuffisant');
      out.textContent = 'Contraste sur le fond : ' + r.toFixed(2) + ':1, ' + verdict;
    });
  });
  const w = document.getElementById('dv-w') as HTMLInputElement | null, wo = document.getElementById('dv-wo'), fr = document.getElementById('dv-if') as HTMLIFrameElement | null;
  w?.addEventListener('input', () => { if (fr) fr.style.width = w.value + 'px'; if (wo) wo.textContent = w.value; });
  const grid = document.querySelector<HTMLElement>('.dv-grid');
  addEventListener('keydown', (e) => { if ((e.key === 'g' || e.key === 'G') && !/input|textarea|select/i.test((e.target as HTMLElement).tagName) && grid) grid.hidden = !grid.hidden; });
  const dot = document.querySelector<HTMLElement>('[data-dot]'), rm = document.getElementById('dv-rm') as HTMLInputElement | null;
  const D: Record<string, string> = { fast: 'var(--t-fast)', mid: 'var(--t-mid)', slow: 'var(--t-slow)' };
  let side = false;
  document.querySelectorAll<HTMLButtonElement>('[data-play]').forEach((b) => b.addEventListener('click', () => {
    if (!dot) return;
    side = !side;
    dot.style.transition = rm?.checked ? 'none' : 'transform ' + (D[b.dataset.play ?? 'mid'] ?? '320ms') + ' var(--ease)';
    dot.style.transform = side ? 'translateX(calc(' + (dot.parentElement?.clientWidth ?? 200) + 'px - 12px))' : 'none';
  }));
}
