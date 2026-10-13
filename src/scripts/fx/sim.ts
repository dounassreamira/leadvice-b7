/* Simulateur « Le chemin de votre budget » : les curseurs recalculent le flux et redessinent la scène. */
import type { SceneHost } from '../scenes/util';

interface Field { id: string; label: string; min: number; max: number; pas: number; defaut: number; unite: string }
interface Mode { onglet: string; etapes: string[]; champs: Field[]; resultats: string[]; phrase: string }
type Config = Record<'lead' | 'ecom', Mode>;

const n = (x: number, d = 0): string => x.toLocaleString('fr-FR', { maximumFractionDigits: d }).replace(/[\u00a0\u202f]/g, '\u00a0');

export function initSim(): void {
  const root = document.getElementById('sim');
  if (!root) return;
  const M = JSON.parse(root.dataset.config ?? '{}') as Config;
  const ctl = document.getElementById('ctl')!, out = document.getElementById('out')!, cv = document.getElementById('simcv') as SceneHost, big = document.getElementById('simbig');
  let mode: 'lead' | 'ecom' = 'lead';
  const V: Record<string, number> = {};
  const key = (id: string): string => id + ':' + mode;
  function build(): void {
    ctl.innerHTML = '';
    M[mode].champs.forEach((f) => {
      V[f.id] = V[key(f.id)] ?? f.defaut;
      const w = document.createElement('div');
      w.className = 'rng';
      w.innerHTML = '<label for="r-' + f.id + '">' + f.label + '<output id="o-' + f.id + '" for="r-' + f.id + '"></output></label><input type="range" id="r-' + f.id + '" min="' + f.min + '" max="' + f.max + '" step="' + f.pas + '" value="' + V[f.id] + '">';
      const i = w.querySelector('input')!;
      i.addEventListener('input', () => { V[f.id] = +i.value; V[key(f.id)] = +i.value; calc(); });
      ctl.appendChild(w);
    });
    cv._stage = M[mode].etapes;
    calc();
  }
  function calc(): void {
    const m = M[mode], b = V.budget ?? 10000, R = m.resultats;
    m.champs.forEach((f) => { const e = document.getElementById('o-' + f.id); if (e) e.textContent = n(V[f.id] ?? 0, f.pas < 1 ? 1 : 0) + f.unite; });
    let cells: [string, string, boolean][], ca: number, k: number;
    if (mode === 'lead') {
      const L = b / (V.cpl ?? 10), Q = L * (V.q ?? 70) / 100; k = Q * (V.c ?? 10) / 100; ca = k * (V.v ?? 5000);
      const cac = k ? b / k : 0;
      cv._flow = { lead: (V.q ?? 70) / 100, client: Math.min(.7, Math.max(.06, (V.c ?? 10) / 100 * 2.2)), ret: ca / b };
      cells = [[n(L), R[0] ?? '', false], [n(V.cpl ?? 0) + ' MAD', (R[1] ?? '').replace('{usd}', n((V.cpl ?? 0) / 10, 1)), false], [n(k), R[2] ?? '', true], [n(cac) + ' MAD', R[3] ?? '', true], [n(ca) + ' MAD', R[4] ?? '', true], ['× ' + n(ca / b, 1), R[5] ?? '', true]];
    } else {
      const Vi = b / (V.cpc ?? 1.2), Cm = Vi * (V.cr ?? 4) / 100; k = Cm * (V.dl ?? 92) / 100; ca = k * (V.pm ?? 450);
      const cpa = k ? b / k : 0;
      cv._flow = { lead: Math.min(.8, Math.max(.12, (V.cr ?? 4) / 100 * 12)), client: (V.dl ?? 92) / 100 * .4, ret: ca / b };
      cells = [[n(Vi), R[0] ?? '', false], [n(Cm), R[1] ?? '', false], [n(k), R[2] ?? '', true], [n(cpa) + ' MAD', R[3] ?? '', true], [n(ca) + ' MAD', R[4] ?? '', true], ['× ' + n(ca / b, 1), R[5] ?? '', true]];
    }
    out.innerHTML = cells.map((c) => '<div' + (c[2] ? ' class="hl"' : '') + '><b>' + c[0] + '</b><span>' + c[1] + '</span></div>').join('');
    if (big) big.innerHTML = m.phrase.replace('{budget}', n(b)).replace('{n}', n(k)).replace('{ca}', n(ca)).replace('{x}', n(ca / b, 1));
    document.dispatchEvent(new CustomEvent('lv:redraw'));
  }
  (['lead', 'ecom'] as const).forEach((m) => {
    document.getElementById('t-' + m)?.addEventListener('click', () => {
      mode = m;
      document.querySelectorAll('.sim-tabs button').forEach((x) => x.setAttribute('aria-selected', x.id === 't-' + m ? 'true' : 'false'));
      build();
    });
  });
  build();
}
