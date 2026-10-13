/* Mouvement : scènes dessinées, défilement lissé (Lenis), scènes épinglées et effets au défilement (GSAP).
   Chargé après le premier rendu : rien ici ne retarde la lecture du titre. Sans JavaScript ou en mouvement
   réduit, chaque scène affiche son état final. */
import { $, $$, RM, FINE, C } from './env';
import { fitCanvas, ss, type SceneFn, type SceneHost } from './scenes/util';

type Loader = () => Promise<{ default: SceneFn }>;
const SCENES = import.meta.glob<{ default: SceneFn }>('./scenes/s-*.ts') as Record<string, Loader>;

interface Live { el: SceneHost; cv: HTMLCanvasElement; fn: SceneFn; p: number; vis: boolean; mini: boolean; auto: boolean; stat: boolean; i: number }
const live: Live[] = [];
let raf = 0;
let dirty = true;

async function makeScene(el: SceneHost, i: number): Promise<Live | null> {
  const cv = el.tagName === 'CANVAS' ? (el as unknown as HTMLCanvasElement) : el.querySelector('canvas');
  const name = el.getAttribute('data-scene');
  const load = name ? SCENES[`./scenes/s-${name}.ts`] : undefined;
  if (!cv || !load) return null;
  const fn = (await load()).default;
  const stat = el.hasAttribute('data-static');
  const s: Live = { el, cv, fn, p: RM || stat ? 1 : 0, vis: true, mini: el.hasAttribute('data-mini'), auto: el.hasAttribute('data-auto'), stat, i };
  live.push(s);
  return s;
}

function drawAll(now: number): void {
  const t = now / 1000;
  for (const s of live) {
    const rb = s.el.getBoundingClientRect();
    s.vis = rb.bottom > -100 && rb.top < innerHeight + 100 && rb.height > 0;
    if (!s.vis) continue;
    const f = fitCanvas(s.cv);
    if (!f) continue;
    f.ctx.clearRect(0, 0, f.w, f.h);
    const manual = s.el.dataset.p;
    const p = manual != null ? parseFloat(manual) : s.auto ? (RM ? 1 : Math.sin(t * .7 + s.i) * .5 + .5) : s.p;
    s.fn(f.ctx, f.w, f.h, p, RM ? 0 : t, s.mini, s.el);
  }
}

function frame(now: number): void {
  if (!RM) drawAll(now);
  else if (dirty) { drawAll(0); dirty = false; }
  raf = requestAnimationFrame(frame);
}

/* en mouvement réduit, on ne redessine que lorsque quelque chose change */
const redraw = (): void => { dirty = true; };
addEventListener('resize', redraw);
addEventListener('scroll', redraw, { passive: true });
document.addEventListener('lv:theme', redraw);
document.addEventListener('lv:redraw', redraw);

export async function init(): Promise<void> {
  const hosts = $$<SceneHost>('[data-scene]');
  await Promise.all(hosts.map((el, i) => makeScene(el, i)));
  if (live.length) raf = requestAnimationFrame(frame);
  void raf;

  /* souris au-dessus des scènes qui réagissent au curseur */
  $$<SceneHost>('[data-mouse]').forEach((el) => {
    el._mouse = null;
    el.addEventListener('pointermove', (e) => { const b = el.getBoundingClientRect(); el._mouse = { x: e.clientX - b.left, y: e.clientY - b.top }; });
    el.addEventListener('pointerleave', () => { el._mouse = null; });
  });
  document.addEventListener('lv:replay', () => { live.forEach((s) => { s.el._t0 = null; }); });
  try { if (sessionStorage.getItem('lv-replay')) { sessionStorage.removeItem('lv-replay'); live.forEach((s) => { s.el._t0 = null; }); } } catch { /* sans stockage */ }

  /* modules propres à certaines pages */
  const extras: Promise<unknown>[] = [];
  if ($('[data-pfield]')) extras.push(import('./fx/pfield').then((m) => m.init()));
  if ($('[data-ftr-cv]') && !RM && innerWidth > 600) extras.push(import('./fx/footer').then((m) => m.init()));
  if ($('#orbs')) extras.push(import('./fx/orbs').then((m) => m.init()));
  if ($('[data-sys]')) extras.push(import('./fx/sys').then((m) => m.init()));
  if ($('[data-adwatch]')) extras.push(import('./fx/adwatch').then((m) => m.init()));
  if ($('#lv-ad, #lv-plan')) extras.push(import('./fx/b7').then((m) => m.init()));
  $$('[data-light]').forEach(splitWords);
  $$('[data-rise]').forEach(splitLines);

  if (RM) { litAll(); await Promise.all(extras); return; }

  const [{ gsap }, { ScrollTrigger: ST }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ST);

  /* défilement lissé, coupé au toucher */
  if (FINE) {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ lerp: .1, wheelMultiplier: 1, anchors: { offset: -90 } });
    window.__lenis = lenis as unknown as Window['__lenis'];
    lenis.on('scroll', ST.update);
    gsap.ticker.add((tm) => { lenis.raf(tm * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* scènes épinglées */
  for (const s of live) {
    if (s.auto || s.stat || s.el.tagName === 'CANVAS' || s.el.dataset.p != null) continue;
    const steps = $$('.cap > *', s.el), dots = $$('.scene-dots b', s.el);
    let len = parseFloat(s.el.getAttribute('data-len') || '250');
    if (innerWidth < 760) len *= .6;
    ST.create({
      trigger: s.el, start: 'top top', end: '+=' + len + '%', pin: true, scrub: 1,
      onUpdate(self) {
        s.p = self.progress;
        steps.forEach((c, i) => {
          const r = (c.getAttribute('data-at') || '0-1').split('-').map(parseFloat);
          const a = r[0] ?? 0, b = r[1] ?? 1;
          const on = s.p >= a && s.p < b + (b >= 1 ? .01 : 0);
          c.classList.toggle('on', on);
          dots[i]?.classList.toggle('on', on);
        });
        const k = ss(.01, .1, s.p);
        $$('[data-hero-out]', s.el).forEach((hero) => { hero.style.opacity = String(1 - k); hero.style.transform = 'translateY(' + (-k * 70) + 'px)'; hero.style.visibility = k > .99 ? 'hidden' : 'visible'; });
        $$('[data-hero-in]', s.el).forEach((h2) => { h2.style.opacity = String(ss(.07, .13, s.p)); });
      },
    });
    /* premier état visible avant tout défilement */
    $$('.cap > *', s.el).forEach((c) => { const r = (c.getAttribute('data-at') || '0-1').split('-').map(parseFloat); c.classList.toggle('on', (r[0] ?? 0) === 0); });
  }

  /* texte qui s'allume au fil de la lecture */
  $$('[data-light]').forEach((el) => {
    const ws = $$('.w', el);
    ST.create({ trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true, onUpdate(self) { const n = Math.round(self.progress * ws.length); ws.forEach((w, i) => w.classList.toggle('lit', i < n)); } });
  });
  /* titres révélés ligne par ligne, une fois */
  $$('[data-rise]').forEach((el) => {
    gsap.from($$('.mask-line > span', el), { yPercent: 70, opacity: .2, duration: .9, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  /* parallaxe : 40 px au plus */
  $$('[data-speed]').forEach((el) => {
    const sp = parseFloat(el.getAttribute('data-speed') || '0');
    gsap.fromTo(el, { y: sp * 80 }, { y: -sp * 80, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  /* chiffres qui se composent */
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.getAttribute('data-count') || '0'), pre = el.getAttribute('data-pre') || '', final = el.textContent ?? '';
    const o = { v: 0 };
    ST.create({ trigger: el, start: 'top 90%', once: true, onEnter() {
      gsap.fromTo(o, { v: 0 }, { v: end, duration: 1.6, ease: 'power2.out', onUpdate() { el.textContent = pre + Math.round(o.v).toLocaleString('fr-FR').replace(/[\u00a0\u202f]/g, '\u00a0'); }, onComplete() { el.textContent = final; } });
    } });
  });
  /* méthode : le rail se remplit */
  $$('.rail').forEach((r) => {
    const bar = $('.rail-bar i', r), st = $$('.step', r);
    ST.create({ trigger: r, start: 'top 60%', end: 'bottom 60%', scrub: true, onUpdate(self) {
      if (bar) bar.style.transform = 'scaleY(' + self.progress + ')';
      const idx = Math.min(st.length - 1, Math.floor(self.progress * st.length));
      st.forEach((s2, i) => s2.classList.toggle('on', i <= idx));
    } });
  });
  /* défilement horizontal (ordinateur) */
  $$('[data-h]').forEach((sec) => {
    const track = $('.htrack', sec);
    if (!track || innerWidth < 760) return;
    gsap.to(track, { x: () => -(track.scrollWidth - sec.clientWidth + 64), ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + (track.scrollWidth - sec.clientWidth), pin: true, scrub: 1, invalidateOnRefresh: true } });
  });
  /* cartes empilées */
  const cards = $$('[data-stack] .card');
  cards.forEach((c, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(c, { scale: .92, filter: 'brightness(.94)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 25%', scrub: true } });
  });
  /* le défilement accélère le bandeau de logos */
  const mq = $$('.marquee');
  if (mq.length) ST.create({ start: 0, end: 'max', onUpdate(self) { const v = Math.min(Math.abs(self.getVelocity()) / 1200, 3); mq.forEach((m) => { m.style.animationDuration = (38 / (1 + v)) + 's'; }); } });
  /* phrase sur la courbe */
  const tp = $('#tp');
  if (tp) gsap.fromTo(tp, { attr: { startOffset: '18%' } }, { attr: { startOffset: '0%' }, ease: 'none', scrollTrigger: { trigger: tp.closest('svg'), start: 'top bottom', end: 'bottom top', scrub: true } });

  await Promise.all(extras);
  if ($('main[data-thread]') && !document.body.hasAttribute('data-no-thread')) {
    const { initThread } = await import('./fx/thread');
    initThread(ST, gsap);
  }

  /* les épinglages sont créés par type : on les remet dans l'ordre de la page avant de calculer */
  ST.sort();
  ST.refresh();
  if (document.fonts?.ready) void document.fonts.ready.then(() => ST.refresh());
  document.addEventListener('lv:refresh', () => ST.refresh());
}

function splitWords(el: HTMLElement): void {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.innerHTML = words.map((w) => '<span class="w">' + w.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string) + '</span>').join(' ');
}
function splitLines(el: HTMLElement): void {
  if (RM) return;
  const html = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = html.map((l) => '<span class="mask-line"><span>' + l.trim() + '</span></span>').join('');
}
function litAll(): void { $$('[data-light] .w').forEach((w) => w.classList.add('lit')); }

export { C };
