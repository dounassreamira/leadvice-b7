/* Comportements communs à toutes les pages : en-tête, menus, mode sombre, recherche, réservation,
   bouton flottant, retour en haut, cookies, suivi des UTM, copier, surligneur. Le reste (scènes,
   défilement lissé, fil conducteur) est chargé après le premier rendu par motion.ts. */
import { $, $$, RM, FINE, root, syncPalette, scrollToY, announce, idle } from './env';
import { initConsent, openCookies } from './consent';
import { captureUtm } from './utm';

/* Version de démonstration : les appels /api/* reçoivent des réponses simulées, rien ne part. */
if (import.meta.env.PUBLIC_DEMO) await import('./demo');

const path = location.pathname;

/* ---------- toute nouvelle page s'ouvre en haut ---------- */
const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type ?? '';
function toTop(): void { if (location.hash || navType === 'back_forward') return; window.scrollTo(0, 0); }
toTop();
addEventListener('load', () => { toTop(); setTimeout(toTop, 60); });

/* ---------- mode sombre ---------- */
const thBtn = $<HTMLButtonElement>('[data-theme-toggle]');
function paintTheme(): void {
  const dark = root.getAttribute('data-theme') === 'dark';
  if (thBtn) {
    thBtn.setAttribute('aria-pressed', String(dark));
    thBtn.setAttribute('aria-label', (dark ? thBtn.dataset.lLight : thBtn.dataset.lDark) ?? '');
  }
  $<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0F0A24' : '#FBFAFD');
  syncPalette();
}
thBtn?.addEventListener('click', () => {
  const dark = root.getAttribute('data-theme') !== 'dark';
  if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
  try { localStorage.setItem('lv-theme', dark ? 'dark' : 'light'); } catch { /* stockage indisponible */ }
  paintTheme();
  document.dispatchEvent(new CustomEvent('lv:theme'));
});
paintTheme();

/* ---------- en-tête ---------- */
const hdr = $('[data-hdr]');
const prog = $('.progress', hdr ?? document);
const showProgress = document.body.hasAttribute('data-progress');
function hdrH(): void { if (hdr) root.style.setProperty('--hdr-h', hdr.offsetHeight + 'px'); }
hdrH();
addEventListener('resize', hdrH);

/* sous-menu Expertises : survol sur ordinateur (fermeture après 200 ms), clic et clavier partout */
const dd = $('[data-dd]');
if (dd) {
  const t = $<HTMLButtonElement>('.dd-t', dd)!;
  const m = $('.dd-m', dd)!;
  let timer = 0;
  const set = (o: boolean): void => {
    clearTimeout(timer);
    dd.classList.toggle('open', o);
    t.setAttribute('aria-expanded', String(o));
    m.inert = !o;
  };
  t.addEventListener('click', () => {
    const o = !dd.classList.contains('open');
    set(o);
    if (o) $<HTMLAnchorElement>('a', m)?.focus();
  });
  if (FINE) {
    dd.addEventListener('mouseenter', () => set(true));
    dd.addEventListener('mouseleave', () => { timer = window.setTimeout(() => set(false), 200); });
  }
  dd.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dd.classList.contains('open')) { set(false); t.focus(); }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && dd.classList.contains('open')) {
      e.preventDefault();
      const l = $$<HTMLAnchorElement>('a', m);
      const i = l.indexOf(document.activeElement as HTMLAnchorElement);
      l[(i + (e.key === 'ArrowDown' ? 1 : l.length - 1)) % l.length]?.focus();
    }
  });
  dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget as Node | null)) set(false); });
  document.addEventListener('click', (e) => { if (!dd.contains(e.target as Node)) set(false); });
}

/* menu mobile : focus piégé, Échap, défilement bloqué derrière */
const mnav = $('#mnav');
const mOpen = $<HTMLButtonElement>('[data-menu-open]');
function menu(o: boolean): void {
  if (!mnav || !mOpen) return;
  mnav.hidden = !o;
  mOpen.setAttribute('aria-expanded', String(o));
  document.body.classList.toggle('menu-open', o);
  if (o) { window.__lenis?.stop(); $<HTMLElement>('a, button:not([data-menu-close])', mnav)?.focus(); }
  else { window.__lenis?.start(); mOpen.focus(); }
}
mOpen?.addEventListener('click', () => menu(true));
$('[data-menu-close]')?.addEventListener('click', () => menu(false));
mnav?.addEventListener('click', (e) => {
  const x = (e.target as Element).closest<HTMLButtonElement>('[data-m-exp]');
  if (x) {
    const sub = $('#m-sub');
    const o = x.getAttribute('aria-expanded') === 'true';
    x.setAttribute('aria-expanded', String(!o));
    if (sub) sub.hidden = o;
  }
});
document.addEventListener('keydown', (e) => {
  if (!mnav || mnav.hidden) return;
  if (e.key === 'Escape') { menu(false); return; }
  if (e.key === 'Tab') {
    const f = $$<HTMLElement>('a[href], button:not([disabled])', mnav).filter((x) => x.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
addEventListener('pageshow', () => { if (mnav && !mnav.hidden) menu(false); });

/* un lien vers la page en cours remonte en haut au lieu de recharger */
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || u.pathname !== path || u.hash) return;
  if (a.hasAttribute('data-replay')) return;
  e.preventDefault();
  if (mnav && !mnav.hidden) menu(false);
  scrollToY(0);
});

/* ---------- réservation du diagnostic : chaque bouton ouvre la fenêtre (chargée à la demande) ---------- */
let bookingMod: Promise<typeof import('./booking')> | null = null;
const loadBooking = (): Promise<typeof import('./booking')> => (bookingMod ??= import('./booking'));
/* tout lien vers la page diagnostic (adresse absolue, ou relative dans un aperçu) */
const isDiag = (a: HTMLAnchorElement): boolean => /\/diagnostic\/(index\.html)?$/.test(new URL(a.href, location.href).pathname);
if (!/\/diagnostic\/(index\.html)?$/.test(path) && !path.startsWith('/admin/')) {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
    if (!a || !isDiag(a) || a.hasAttribute('data-page-link') || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
    e.preventDefault();
    if (mnav && !mnav.hidden) menu(false);
    void loadBooking().then((m) => m.openBooking(a));
  });
  document.addEventListener('pointerover', (e) => {
    const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
    if (a && isDiag(a)) void loadBooking();
  }, { passive: true });
}

/* boutons explicites « Réserver un créneau » (page diagnostic, gestion d'un rendez-vous) */
document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest?.<HTMLElement>('[data-booking]');
  if (!b) return;
  e.preventDefault();
  void loadBooking().then((m) => m.openBooking(b));
});

/* ---------- recherche (Pagefind, chargée à l'ouverture) ---------- */
let searchMod: Promise<typeof import('./search')> | null = null;
const openSearch = (): void => { void (searchMod ??= import('./search')).then((m) => m.open()); };
$$('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch));
document.addEventListener('keydown', (e) => {
  const tag = (document.activeElement?.tagName ?? '').toLowerCase();
  const typing = /input|textarea|select/.test(tag) || (document.activeElement as HTMLElement | null)?.isContentEditable;
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
    if ($<HTMLDialogElement>('[data-search]')?.open) return;
    e.preventDefault();
    openSearch();
  }
});

/* ---------- bouton flottant, fil d'Ariane fixé, retour en haut ---------- */
const fab = $('[data-fab]');
const btt = $<HTMLButtonElement>('[data-btt]');
const crumb = $('main .crumb');
let cbar: HTMLElement | null = null;
if (crumb) {
  cbar = document.createElement('nav');
  cbar.className = 'cbar';
  cbar.setAttribute('aria-label', "Fil d'Ariane (rappel)");
  cbar.innerHTML = '<div class="cbar-in">' + crumb.innerHTML + '</div>';
  cbar.inert = true;
  document.body.appendChild(cbar);
}
const ftr = $('[data-ftr]');
let lastY = 0;
let ticking = false;
function onScroll(): void {
  ticking = false;
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  const menuOpen = !!mnav && !mnav.hidden;
  hdr?.classList.toggle('solid', y > 40);
  hdr?.classList.toggle('hide', y > 300 && y > lastY && !menuOpen);
  if (cbar && crumb) {
    const past = crumb.getBoundingClientRect().bottom < 0;
    cbar.classList.toggle('on', past);
    cbar.inert = !past;
    cbar.classList.toggle('up', !!hdr?.classList.contains('hide'));
  }
  if (fab) {
    const inScene = innerWidth < 760 && $$('section.scene').some((sc) => { const b = sc.getBoundingClientRect(); return b.top < innerHeight * .5 && b.bottom > innerHeight * .5; });
    const vio = $$('.violet, [data-hide-fab]').some((v) => { const b = v.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; });
    const ft = ftr ? ftr.getBoundingClientRect().top > innerHeight * .9 : true;
    fab.classList.toggle('on', !inScene && !vio && ft && y > innerHeight * .5);
  }
  btt?.classList.toggle('on', y > innerHeight * 2);
  if (prog && showProgress) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  lastY = y;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
btt?.addEventListener('click', () => {
  scrollToY(0);
  $<HTMLElement>('.skip')?.focus({ preventScroll: true });
});

/* ---------- copier ---------- */
document.addEventListener('click', async (e) => {
  const b = (e.target as Element).closest?.<HTMLButtonElement>('[data-copy]');
  if (!b) return;
  const txt = b.dataset.copy === '@url' ? location.href.split('#')[0] ?? location.href : b.dataset.copy ?? '';
  const label = $('.copy-l', b);
  const before = label?.textContent ?? '';
  try {
    await navigator.clipboard.writeText(txt);
  } catch {
    /* repli : le texte est sélectionné pour une copie manuelle */
    const r = document.createRange();
    const target = b.previousElementSibling ?? b;
    r.selectNodeContents(target);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  }
  b.classList.add('done');
  if (label) label.textContent = b.dataset.done ?? '';
  announce(b.dataset.done ?? '');
  setTimeout(() => { b.classList.remove('done'); if (label) label.textContent = before; }, 2000);
});

/* ---------- surligneur : un trait jaune derrière les derniers mots du titre de page ---------- */
function highlight(el: Element): void {
  if (el.querySelector('.lv-hl')) return;
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Node | null, last: Text | null = null;
  while ((n = w.nextNode())) if (n.nodeValue?.trim()) last = n as Text;
  if (!last || !last.nodeValue) return;
  const t = last.nodeValue;
  const m = t.match(/(\S+)(\s*)$/);
  if (!m || m.index === undefined) return;
  let start = m.index;
  if ((m[1] ?? '').replace(/[^\wÀ-ÿ]/g, '').length < 5) {
    const m2 = t.slice(0, start).match(/(\S+\s+)$/);
    if (m2?.[1]) start -= m2[1].length;
  }
  const after = last.splitText(start);
  after.splitText((after.nodeValue ?? '').replace(/\s+$/, '').length);
  const s = document.createElement('span');
  s.className = 'lv-hl';
  after.parentNode?.insertBefore(s, after);
  s.appendChild(after);
  if (RM || !('IntersectionObserver' in window)) { s.classList.add('on'); return; }
  /* on observe le titre lui-même : son contenu peut être redécoupé en lignes par motion.ts */
  const io = new IntersectionObserver((es) => {
    if (es[0]?.isIntersecting) { io.disconnect(); setTimeout(() => el.querySelector('.lv-hl')?.classList.add('on'), 350); }
  }, { threshold: .5 });
  io.observe(el);
}
$$('.phero h1, .violet h2, [data-hl]').forEach(highlight);

/* ---------- grain papier, calculé une fois ---------- */
try {
  const g = document.createElement('canvas');
  g.width = g.height = 180;
  const x = g.getContext('2d');
  if (x) {
    const im = x.createImageData(180, 180);
    let seed = 42;
    for (let i = 0; i < im.data.length; i += 4) {
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      const v = 120 + ((seed >>> 0) % 10000) / 10000 * 135;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    root.style.setProperty('--grain', 'url(' + g.toDataURL('image/png') + ')');
    root.classList.add('grain');
  }
} catch { /* sans grain */ }

/* ---------- « Revoir l'ouverture » ---------- */
$$<HTMLAnchorElement>('[data-replay]').forEach((a) => a.addEventListener('click', (e) => {
  if (path === '/') {
    e.preventDefault();
    scrollToY(0);
    document.dispatchEvent(new CustomEvent('lv:replay'));
  } else {
    try { sessionStorage.setItem('lv-replay', '1'); } catch { /* sans stockage */ }
  }
}));

/* ---------- filtres (Réalisations, Insights) : sans JavaScript, tout reste affiché ---------- */
$$('[data-filters]').forEach((bar) => {
  const scope = document.querySelector(bar.dataset.filters ?? '');
  if (!scope) return;
  bar.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('button[data-f]');
    if (!b) return;
    $$('button[data-f]', bar).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.f ?? 'all';
    let n = 0;
    $$('[data-cat]', scope).forEach((it) => { const show = f === 'all' || (it.dataset.cat ?? '').split(' ').includes(f); it.hidden = !show; if (show) n++; });
    announce(n + (n > 1 ? ' éléments affichés' : ' élément affiché'));
    document.dispatchEvent(new CustomEvent('lv:refresh'));
  });
});

/* ---------- FAQ : une seule question ouverte à la fois sur mobile ---------- */
$$<HTMLDetailsElement>('[data-faq] details').forEach((d) => d.addEventListener('toggle', () => {
  if (!d.open || innerWidth >= 760) return;
  d.parentElement?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((o) => { if (o !== d) o.open = false; });
}));

/* ---------- cookies, UTM ---------- */
captureUtm();
initConsent();
$$('[data-cookies-open]').forEach((b) => b.addEventListener('click', () => openCookies(true)));

/* ---------- le reste après le premier rendu ---------- */
const start = (): void => idle(() => { void import('./motion').then((m) => m.init()); });
if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
