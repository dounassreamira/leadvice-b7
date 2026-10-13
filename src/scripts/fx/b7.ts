/* Acquisition (B7) : « Du brief au client signé », un objet suivi en six étapes, puis « Le plan que vous recevez »,
   des blocs qui s'assemblent en document. En mouvement réduit, état final sans épinglage. */
import { $, $$, RM } from '../env';

export function init(): void {
  const hh = (): number => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 72;
  const prog = (el: HTMLElement): number => { const r = el.getBoundingClientRect(), h = hh(), span = r.height - (innerHeight - h); return Math.min(1, Math.max(0, (h - r.top) / Math.max(1, span))); };
  const ad = $('#lv-ad'), plan = $('#lv-plan');
  if (!ad && !plan) return;
  const stage = ad ? $('.lv-stage', ad) : null, panes = ad ? $$('.lv-obj > div', ad) : [], steps = ad ? $$('.lv-steps li', ad) : [];
  let cur = -1;
  const setAd = (s: number): void => {
    if (s === cur || !stage) return; cur = s; stage.setAttribute('data-s', String(s));
    panes.forEach((d, i) => d.classList.toggle('lv-on', i === s));
    steps.forEach((li, i) => { li.classList.toggle('lv-on', i <= s); li.classList.toggle('lv-cur', i === s); });
  };
  const blks = plan ? $$('.blk', plan) : [], stamp = plan ? $('.stamp', plan) : null;
  const SC = [[-260, -120, -9], [180, -200, 7], [320, 60, -6], [-340, 140, 8], [240, 220, -11], [-60, 260, 5]];
  const ez = (t: number): number => 1 - Math.pow(1 - t, 3);
  const setPlan = (p: number): void => {
    const m = innerWidth < 900 ? .45 : 1;
    blks.forEach((b, i) => {
      const t = RM ? 1 : ez(Math.min(1, Math.max(0, (p * 1.5 - i * .1) / .55))), k = 1 - t, s = SC[i % SC.length]!;
      b.style.transform = k > .001 ? 'translate(' + ((s[0] ?? 0) * k * m).toFixed(1) + 'px,' + ((s[1] ?? 0) * k * m).toFixed(1) + 'px) rotate(' + ((s[2] ?? 0) * k).toFixed(2) + 'deg)' : '';
      b.style.opacity = (.35 + .65 * t).toFixed(2);
    });
    stamp?.classList.toggle('lv-on', RM || p > .8);
  };
  if (RM) { if (ad) { setAd(5); steps.forEach((li) => li.classList.add('lv-on')); } if (plan) setPlan(1); return; }
  let ticking = false;
  const upd = (): void => { ticking = false; if (ad) setAd(Math.min(5, Math.floor(prog(ad) * 6.3))); if (plan) setPlan(prog(plan)); };
  const req = (): void => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  window.__lenis?.on('scroll', req);
  upd();
}
