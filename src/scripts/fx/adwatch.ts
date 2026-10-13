/* Les annonces dessinées s'animent quand elles entrent à l'écran (chronomètre, bulle, vapeur). */
import { $$ } from '../env';
export function init(): void {
  $$('[data-adwatch]').forEach((v) => {
    const io = new IntersectionObserver((es) => { if (es[0]?.isIntersecting) { v.classList.add('in'); io.disconnect(); } }, { threshold: .4 });
    io.observe(v);
  });
}
