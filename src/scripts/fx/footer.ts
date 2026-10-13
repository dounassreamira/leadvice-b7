/* Pied de page vivant : quelques centaines de particules lavande en trajectoire, qui s'écartent du curseur.
   Chargé seulement à l'approche du pied de page, suspendu hors écran, absent sur mobile et en mouvement réduit. */
import { $ } from '../env';
import { fitCanvas, rnd } from '../scenes/util';

export function init(): void {
  const ftr = $('[data-ftr]'), cv = $<HTMLCanvasElement>('[data-ftr-cv]');
  if (!ftr || !cv) return;
  const r = rnd(5), pts: { u: number; o: number; s: number }[] = [];
  for (let i = 0; i < 160; i++) pts.push({ u: r(), o: r() * 6.28, s: .6 + r() * 1.6 });
  let vis = false, running = false;
  const mouse = { x: -999, y: -999 };
  ftr.addEventListener('pointermove', (e) => { const b = cv.getBoundingClientRect(); mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top; });
  ftr.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  const loop = (now: number): void => {
    if (!vis) { running = false; return; }
    const f = fitCanvas(cv);
    if (f) {
      const t = now / 1000;
      f.ctx.clearRect(0, 0, f.w, f.h);
      for (const q of pts) {
        let x = q.u * f.w, y = f.h * .32 + Math.sin(q.u * 9 + t * .6 + q.o * .2) * f.h * .08 + Math.sin(t + q.o) * 6;
        const dx = x - mouse.x, dy = y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120 && d > 0) { x += dx / d * (120 - d) * .5; y += dy / d * (120 - d) * .5; }
        f.ctx.fillStyle = 'rgba(123,97,255,' + (.25 + q.s * .25) + ')';
        f.ctx.beginPath(); f.ctx.arc(x, y, q.s, 0, 6.283); f.ctx.fill();
      }
    }
    requestAnimationFrame(loop);
  };
  new IntersectionObserver((e) => {
    vis = !!e[0]?.isIntersecting;
    if (vis && !running) { running = true; requestAnimationFrame(loop); }
  }, { rootMargin: '200px' }).observe(ftr);
}
