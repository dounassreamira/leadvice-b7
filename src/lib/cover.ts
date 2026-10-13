/* Couverture d'article générée au build : un motif par catégorie, proportions tirées d'une graine dérivée du slug.
   Chaque article a sa couverture, toujours la même (Stratégie : nœud qui se résout, Acquisition : faisceau,
   Création : trois cartes, Business : courbe). */
function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed: number): () => number { let x = seed || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 10000) / 10000; }; }

export function coverSVG(slug: string, cat: string, label: string): string {
  const r = rng(hash(slug));
  let s = '<svg class="cover" viewBox="0 0 640 360" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><rect width="640" height="360" fill="#EEEAF5"/>';
  const g = '#9C97A8', v = '#6B4EFF', d = '#301781';
  if (cat === 'Stratégie') {
    for (let i = 0; i < 9; i++) { const y0 = 60 + r() * 240, c1 = r() * 360, c2 = r() * 360; s += '<path d="M40 ' + y0.toFixed(0) + ' C 200 ' + c1.toFixed(0) + ', 260 ' + c2.toFixed(0) + ', 380 180" fill="none" stroke="' + g + '" stroke-width="1.4" opacity=".55"/>'; }
    s += '<path d="M380 180 L600 180" stroke="' + v + '" stroke-width="3"/><circle cx="600" cy="180" r="8" fill="' + v + '"/><circle cx="380" cy="180" r="5" fill="' + d + '"/>';
  } else if (cat === 'Acquisition') {
    s += '<path d="M70 180 L600 ' + (40 + r() * 40).toFixed(0) + ' L600 ' + (280 + r() * 40).toFixed(0) + ' Z" fill="' + v + '" opacity=".1"/>';
    for (let j = 0; j < 70; j++) { const x = 150 + r() * 460, y = 30 + r() * 300, inb = Math.abs(y - 180) < (x - 70) * .22 && r() > .5; s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (inb ? 5 : 3.5) + '" fill="' + (inb ? v : g) + '" opacity="' + (inb ? 1 : .45) + '"/>'; }
    s += '<rect x="52" y="150" width="34" height="60" rx="6" fill="#1E0F52"/><rect x="57" y="156" width="24" height="48" rx="3" fill="#fff"/>';
  } else if (cat === 'Création') {
    const win = Math.floor(r() * 3);
    for (let k = 0; k < 3; k++) { const a = (k - 1) * (8 + r() * 6), cx = 320 + (k - 1) * 150; s += '<g transform="rotate(' + a.toFixed(1) + ' ' + cx + ' 190)"><rect x="' + (cx - 62) + '" y="70" width="124" height="200" rx="10" fill="#fff" stroke="' + (k === win ? v : '#CFC9DA') + '" stroke-width="' + (k === win ? 3 : 1.4) + '"/><rect x="' + (cx - 50) + '" y="84" width="100" height="90" rx="4" fill="' + (k === win ? '#E4DEFF' : '#F1EEF6') + '"/><rect x="' + (cx - 50) + '" y="186" width="80" height="7" rx="3" fill="#DCD6E6"/><rect x="' + (cx - 50) + '" y="200" width="56" height="7" rx="3" fill="#DCD6E6"/><rect x="' + (cx - 50) + '" y="236" width="100" height="18" rx="3" fill="' + (k === win ? v : d) + '"/></g>'; }
  } else {
    const pts: [number, number][] = [], n = 9;
    for (let q = 0; q < n; q++) pts.push([70 + q * 62, 290 - Math.pow(q / (n - 1), 1.6) * (170 + r() * 40) - r() * 18]);
    pts.forEach((p, q) => { s += '<rect x="' + (p[0] - 12) + '" y="' + p[1].toFixed(0) + '" width="24" height="' + (310 - p[1]).toFixed(0) + '" fill="' + (q === n - 1 ? v : '#DCD6E6') + '" opacity="' + (q === n - 1 ? 1 : .8) + '"/>'; });
    s += '<path d="M' + pts.map((p) => p[0] + ' ' + (p[1] - 14).toFixed(0)).join(' L') + '" fill="none" stroke="' + d + '" stroke-width="2.5"/>';
  }
  return s + '</svg>';
}
