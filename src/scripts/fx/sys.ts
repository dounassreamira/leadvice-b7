/* Accueil, « C'est un système » : six briques arrivent en désordre et se rangent autour de la stratégie. */
import { $, $$, RM } from '../env';

export async function init(): Promise<void> {
  const sys = $('[data-sys]');
  if (!sys) return;
  const words = $$('span[data-a]', sys), core = $('.core', sys);
  let last = 0;
  const start = [[-160, -210], [230, -150], [-250, 40], [190, 170], [-90, 220], [260, 40]];
  const place = (k: number): void => {
    const w = sys.clientWidth, h = sys.clientHeight, R = Math.min(w, h) * .38;
    words.forEach((el, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 3, tx = Math.cos(a) * R, ty = Math.sin(a) * R * .95;
      const sx = (start[i]?.[0] ?? 0) * (w / 600), sy = (start[i]?.[1] ?? 0) * (h / 600);
      const x = sx + (tx - sx) * k, y = sy + (ty - sy) * k;
      el.style.transform = 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) rotate(' + ((1 - k) * (i % 2 ? 8 : -8)) + 'deg)';
      el.style.color = k > .95 ? 'var(--ink)' : 'var(--ink-3)';
    });
    if (core) core.style.opacity = String(.25 + .75 * k);
  };
  place(RM ? 1 : 0);
  addEventListener('resize', () => place(RM ? 1 : last));
  if (RM) return;
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({ trigger: sys, start: 'top 85%', end: 'center 45%', scrub: 1, onUpdate: (s) => { last = s.progress; place(s.progress); } });
}
