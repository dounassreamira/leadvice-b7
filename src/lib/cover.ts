/* Couverture d'article : une illustration-objet propre à chaque article (pile de fiches, ticket de caisse, fil et
   barre de recherche…), en SVG généré au build, avec une animation d'entrée légère coupée en mouvement réduit.
   Les textes dessinés viennent de src/content/site/couvertures.yaml. */
type D = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
const SANS = 'Hanken Grotesk, system-ui, sans-serif', SERIF = 'Young Serif, Georgia, serif';
const ink = '#16131F', grey = '#5B566C', line = '#E2DDF2', violet = '#7B61FF', brand = '#301781', coral = '#FF7A59', coralInk = '#C2410C';
const T = (x: number, y: number, s: string, size: number, col = ink, extra = ''): string => `<text x="${x}" y="${y}" font-family="${SANS}" font-weight="600" font-size="${size}" fill="${col}" ${extra}>${esc(s)}</text>`;
const TS = (x: number, y: number, s: string, size: number, col = ink, extra = ''): string => `<text x="${x}" y="${y}" font-family="${SERIF}" font-size="${size}" fill="${col}" ${extra}>${esc(s)}</text>`;
const card = (x: number, y: number, w: number, h: number, r = 8, extra = ''): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#fff" stroke="${line}" ${extra}/>`;
const bar = (x: number, y: number, w: number, h = 8, col = line): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${col}"/>`;
const IN = (i: number, inner: string): string => `<g class="cv-in" style="animation-delay:${(i * .08).toFixed(2)}s">${inner}</g>`;

function body(slug: string, d: D): string {
  switch (slug) {
    case 'plus-de-leads-ne-veut-pas-dire-plus-de-clients': {
      let s = '';
      for (let i = 0; i < 12; i++) s += IN(i, card(110 + (i % 2) * 6, 270 - i * 17, 150, 40, 6) + `<circle cx="${132 + (i % 2) * 6}" cy="${290 - i * 17}" r="7" fill="#D6CFFA"/>` + bar(146 + (i % 2) * 6, 285 - i * 17, 80, 7, '#CFC8E4'));
      s += T(110, 335, d.gauche, 18, grey);
      [0, 1, 2].forEach((k) => { s += IN(13 + k * 2, card(370 + k * 70, 150 - k * 14, 120, 156, 6) + bar(386 + k * 70, 176 - k * 14, 70) + bar(386 + k * 70, 192 - k * 14, 86) + bar(386 + k * 70, 208 - k * 14, 56) + `<path d="M${388 + k * 70} ${270 - k * 14} c 14 -18, 22 8, 36 -6 s 18 10, 34 -4" fill="none" stroke="${brand}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${468 + k * 70}" cy="${262 - k * 14}" r="11" fill="${coral}"/>`); });
      return s + T(370, 335, d.droite, 18, coralInk);
    }
    case 'trouver-le-bon-angle': {
      const A = (d.angles ?? []) as string[]; let s = '';
      A.forEach((a, k) => {
        const x = 70 + k * 180, win = k === 1;
        s += IN(k * 2, `${card(x, 60, 150, 236, 10, win ? `stroke="${coral}" stroke-width="3"` : '')}<rect x="${x + 12}" y="74" width="126" height="120" rx="6" fill="url(#cvg)"/><circle cx="${x + 75}" cy="134" r="28" fill="#fff" opacity=".9"/><circle cx="${x + 75}" cy="134" r="12" fill="${violet}"/>${TS(x + 12, 226, a, 20, ink)}${bar(x + 12, 242, 110 - k * 14)}${bar(x + 12, 258, 80)}`);
        if (win) s += IN(8, `<g transform="translate(${x + 118} 52) rotate(8)"><rect x="-38" y="-14" width="76" height="28" rx="4" fill="#FFF4EF" stroke="${coralInk}" stroke-width="1.8"/>${T(0, 5, d.retenu, 14, coralInk, 'text-anchor="middle" font-weight="700"')}</g>`);
      });
      return s;
    }
    case 'meta-ads-ou-google-ads': {
      let s = IN(0, `<rect x="110" y="40" width="150" height="290" rx="24" fill="${ink}"/><rect x="118" y="48" width="134" height="274" rx="18" fill="#FBFAFD"/>`);
      [0, 1, 2].forEach((k) => { s += IN(1 + k, card(128, 64 + k * 84, 114, 74, 6) + `<rect x="134" y="70" width="102" height="40" rx="4" fill="${k === 1 ? 'url(#cvg)' : '#EFEBF8'}" transform="translate(0 ${k * 84})"/>` + bar(134, 118 + k * 84, 70, 6)); });
      s += T(110, 352, d.gauche, 18, grey);
      s += IN(5, `<rect x="330" y="96" width="250" height="44" rx="22" fill="#fff" stroke="${line}"/><circle cx="352" cy="118" r="8" fill="none" stroke="${grey}" stroke-width="2.4"/><path d="M358 124 l6 6" stroke="${grey}" stroke-width="2.4"/>${T(370, 123, d.recherche, 14, ink)}`);
      [0, 1, 2].forEach((k) => { s += IN(6 + k, `${bar(330, 166 + k * 52, 150, 9, k === 0 ? violet : '#B4A6FF')}${bar(330, 182 + k * 52, 230, 7)}${bar(330, 194 + k * 52, 180, 7)}`); });
      return s + T(330, 352, d.droite, 18, grey);
    }
    case 'cpl-cpa-cout-par-opportunite': {
      const L = (d.lignes ?? []) as [string, string][];
      let s = IN(0, `<path d="M200 30 h240 v290 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 l-12 10 l-12 -10 z" fill="#fff" stroke="${line}"/>${TS(320, 70, d.titre, 20, ink, 'text-anchor="middle"')}<path d="M222 86 h196" stroke="${line}" stroke-dasharray="4 4"/>`);
      L.forEach((l, k) => { const last = k === L.length - 1; s += IN(2 + k * 2, `${T(222, 130 + k * 44, l[0], 15, last ? ink : grey)}${T(418, 130 + k * 44, l[1], 16, last ? coralInk : ink, 'text-anchor="end" font-weight="700"')}`); });
      return s + IN(11, `<path d="M222 ${116 + L.length * 44} h196" stroke="${ink}" stroke-width="1.5"/>`);
    }
    case 'arabe-ou-francais-langue-publicites-maroc': {
      const X = (d.textes ?? []) as string[][], Lg = (d.langues ?? []) as string[]; let s = '';
      X.forEach((t, k) => { const x = 60 + k * 180, rtl = k < 2, at = rtl ? `text-anchor="start" direction="rtl"` : ''; s += IN(k * 2, `${card(x, 70, 160, 220, 10)}<rect x="${x + 12}" y="84" width="136" height="104" rx="6" fill="url(#cvg)"/>${t.map((l, j) => T(rtl ? x + 148 : x + 12, 218 + j * 22, l, 15, ink, at)).join('')}${T(x + 12, 276, Lg[k] ?? '', 13, grey)}`); });
      return s;
    }
    case 'audit-marketing-sept-signes': {
      let s = IN(0, `${card(170, 24, 300, 316, 6)}${TS(196, 64, d.titre, 20)}<path d="M196 80 h248" stroke="${line}"/>`);
      for (let k = 0; k < 7; k++) s += IN(1 + k, `${bar(226, 104 + k * 32, 200 - (k % 3) * 40, 8)}${bar(226, 116 + k * 32, 140 - (k % 2) * 30, 6, '#EFEBF8')}<circle cx="${150}" cy="${110 + k * 32}" r="12" fill="${coral}"/>${T(150, 115 + k * 32, String(k + 1), 13, '#fff', 'text-anchor="middle" font-weight="700"')}<path d="M163 ${110 + k * 32} h52" stroke="${coralInk}" stroke-width="1.4" stroke-dasharray="3 3"/>`);
      return s;
    }
    default: return `<circle cx="320" cy="180" r="40" fill="${violet}"/>`;
  }
}

export function coverSVG(slug: string, _cat: string, label: string, data: D = {}): string {
  return `<svg class="cover" viewBox="0 0 640 360" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><linearGradient id="cvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#301781"/><stop offset="1" stop-color="#7B61FF"/></linearGradient></defs>` +
    `<style>@media (prefers-reduced-motion: no-preference){.cv-in{animation:cvin .7s cubic-bezier(.2,.7,.2,1) both}}@keyframes cvin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>` +
    `<rect width="640" height="360" fill="#EEEAF5"/>` + body(slug, data[slug] ?? {}) + '</svg>';
}
