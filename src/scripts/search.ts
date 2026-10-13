/* Recherche sur le site : index Pagefind généré au build, chargé seulement à l'ouverture.
   Résultats instantanés, mot surligné, navigation au clavier, Échap pour fermer. */
import { $, $$ } from './env';

interface PFResult { url: string; excerpt: string; meta: { title?: string } }
interface PFHit { data: () => Promise<PFResult> }
interface Pagefind { init?: () => Promise<void>; options?: (o: Record<string, unknown>) => Promise<void>; debouncedSearch: (q: string) => Promise<{ results: PFHit[] } | null> }

const dlg = $<HTMLDialogElement>('[data-search]')!;
const inp = $<HTMLInputElement>('input', dlg)!;
const res = $('.srch-res', dlg)!;
let pf: Promise<Pagefind | null> | null = null;
let opener: HTMLElement | null = null;
let seq = 0;

function load(): Promise<Pagefind | null> {
  const url = '/pagefind/pagefind.js';
  return (pf ??= import(/* @vite-ignore */ url)
    .then(async (m: Pagefind) => { await m.options?.({ excerptLength: 22 }); await m.init?.(); return m; })
    .catch(() => null));
}

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

function skeleton(): void {
  res.innerHTML = '<div class="srch-sk" aria-label="' + esc(res.dataset.loading ?? '') + '">' + '<i></i><i></i><i></i>'.repeat(3) + '</div>';
}

function none(q: string): void {
  res.innerHTML = '<p class="srch-empty">' + esc(res.dataset.none ?? '') + ' <a class="tlink" href="/diagnostic/" data-page-link>' + esc(res.dataset.noneLink ?? '') + '</a></p>';
  void q;
}

async function run(): Promise<void> {
  const q = inp.value.trim();
  const my = ++seq;
  if (!q) { res.innerHTML = '<p class="srch-empty">' + esc(res.dataset.empty ?? '') + '</p>'; return; }
  const m = await load();
  if (my !== seq) return;
  if (!m) { none(q); return; }
  const r = await m.debouncedSearch(q);
  if (my !== seq || !r) return;
  if (!r.results.length) { none(q); return; }
  const data = await Promise.all(r.results.slice(0, 10).map((h) => h.data()));
  if (my !== seq) return;
  res.innerHTML = data.map((d) => {
    const url = d.url.replace(/\/index\.html$/, '/').replace(/\.html$/, '/');
    return '<a role="listitem" href="' + esc(url) + '"><b>' + esc(d.meta.title ?? url) + '</b><span>' + d.excerpt + '</span></a>';
  }).join('');
}

inp.addEventListener('input', () => { if (inp.value.trim()) skeleton(); void run(); });
inp.addEventListener('keydown', (e) => {
  const l = $$<HTMLAnchorElement>('a', res);
  if (!l.length) return;
  const c = $<HTMLAnchorElement>('a.cur', res);
  let i = c ? l.indexOf(c) : -1;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    i = e.key === 'ArrowDown' ? Math.min(l.length - 1, i + 1) : Math.max(0, i - 1);
    l.forEach((x) => x.classList.remove('cur'));
    l[i]?.classList.add('cur');
    l[i]?.scrollIntoView({ block: 'nearest' });
  }
  if (e.key === 'Enter') { e.preventDefault(); (c ?? l[0])?.click(); }
});
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
$('[data-search-close]', dlg)?.addEventListener('click', () => dlg.close());
dlg.addEventListener('close', () => { window.__lenis?.start(); opener?.focus(); });

export function open(): void {
  opener = document.activeElement as HTMLElement | null;
  if (!dlg.open) dlg.showModal();
  window.__lenis?.stop();
  inp.value = '';
  void run();
  inp.focus();
  void load();
}
