/* Champ de points en haut des pages sans scène : les points s'organisent lentement en une forme liée à la page
   (grille pour Réalisations, deux trajectoires qui se rejoignent pour le Cabinet, lignes pour Insights). */
import { $$, RM, C } from '../env';

function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed: number): () => number { let x = seed || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 10000) / 10000; }; }

export function init(): void {
  $$<HTMLCanvasElement>('[data-pfield]').forEach((cv) => {
    const kind = cv.dataset.pfield ?? 'grid';
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const rr = rng(hash(kind)), N = 150, P: { x: number; y: number; ph: number; k: number }[] = [];
    for (let n = 0; n < N; n++) P.push({ x: rr(), y: rr(), ph: rr() * 6.28, k: n });
    const target = (q: { k: number }, w: number, h: number): [number, number, boolean] => {
      if (kind === 'grid') { const c = q.k % 8, row = Math.floor(c / 4), col = c % 4, cx = w * (.2 + col * .2), cy = h * (.32 + row * .32), a = q.k / N * 6.28 * 3, rad = 16 + (q.k % 5) * 3; return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, q.k % 8 === 3]; }
      if (kind === 'two') { const t2 = (q.k % 75) / 74, side = q.k < 75 ? -1 : 1; return [w * (.1 + t2 * .8), h * .5 + side * Math.pow(1 - t2, 1.6) * h * .32, t2 > .7]; }
      const line = q.k % 10, t3 = Math.floor(q.k / 10) / 14;
      return [w * (.12 + t3 * (line % 3 === 2 ? .45 : .72)), h * (.14 + line * .075), line === 0];
    };
    let W = 0, H = 0, vis = true;
    new IntersectionObserver((es) => { vis = !!es[0]?.isIntersecting; }).observe(cv);
    const t0 = performance.now();
    const draw = (now: number): void => {
      if (vis) {
        const d = Math.min(window.devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
        if (r.width !== W || r.height !== H) { W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); }
        ctx.clearRect(0, 0, W, H);
        const t = (now - t0) / 1000, k = RM ? 1 : Math.min(1, t / 3.2), e = k * k * (3 - 2 * k);
        for (const q of P) {
          const tg = target(q, W, H), wob = RM ? 0 : 1;
          const x = q.x * W + (tg[0] - q.x * W) * e + Math.sin(t * .8 + q.ph) * 2 * wob, y = q.y * H + (tg[1] - q.y * H) * e + Math.cos(t * .7 + q.ph) * 2 * wob;
          ctx.globalAlpha = tg[2] ? 1 : .55; ctx.fillStyle = tg[2] && e > .6 ? C.sig : C.ink3;
          ctx.beginPath(); ctx.arc(x, y, tg[2] ? 3 : 2.2, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      if (!RM || now - t0 < 100) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  });
}
