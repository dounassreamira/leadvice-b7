/* Consentement : refus par défaut (Google Consent Mode v2), deux boutons de même poids, personnalisation
   par catégorie. Les outils de mesure ne sont chargés qu'après accord et seulement si leur identifiant
   est défini (PUBLIC_GTM_ID, PUBLIC_META_PIXEL_ID, PUBLIC_LINKEDIN_PARTNER_ID). Sans identifiant, rien n'est chargé. */
const KEY = 'lv-consent';
interface Consent { mesure: boolean; pub: boolean; at: number }

const GTM = import.meta.env.PUBLIC_GTM_ID as string | undefined;
const PIXEL = import.meta.env.PUBLIC_META_PIXEL_ID as string | undefined;
const LINKEDIN = import.meta.env.PUBLIC_LINKEDIN_PARTNER_ID as string | undefined;

function get(): Consent | null {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') as Consent | null; } catch { return null; }
}

function gtag(...a: unknown[]): void {
  (window.dataLayer = window.dataLayer || []).push(a.length === 1 ? a[0] : arguments);
}

function add(src: string, inline?: string): void {
  const s = document.createElement('script');
  if (inline) s.text = inline; else { s.src = src; s.async = true; }
  document.head.appendChild(s);
}

let loaded = { gtm: false, pixel: false, li: false };
function apply(c: Consent): void {
  gtag('consent', 'update', {
    analytics_storage: c.mesure ? 'granted' : 'denied',
    ad_storage: c.pub ? 'granted' : 'denied',
    ad_user_data: c.pub ? 'granted' : 'denied',
    ad_personalization: c.pub ? 'granted' : 'denied',
  });
  (window.dataLayer = window.dataLayer || []).push({ event: 'consent_update', analytics_storage: c.mesure ? 'granted' : 'denied', ad_storage: c.pub ? 'granted' : 'denied' });
  if (GTM && (c.mesure || c.pub) && !loaded.gtm) {
    loaded.gtm = true;
    (window.dataLayer = window.dataLayer || []).push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    add('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM));
  }
  if (PIXEL && c.pub && !loaded.pixel) {
    loaded.pixel = true;
    add('', "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','" + PIXEL.replace(/\D/g, '') + "');fbq('track','PageView');");
  }
  if (LINKEDIN && c.pub && !loaded.li) {
    loaded.li = true;
    add('', "window._linkedin_partner_id='" + LINKEDIN.replace(/\D/g, '') + "';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);");
    add('https://snap.licdn.com/li/lms-analytics/insight.min.js');
  }
}

function save(mesure: boolean, pub: boolean): void {
  const c: Consent = { mesure, pub, at: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* sans stockage, le choix vaut pour la page */ }
  apply(c);
  close();
}

let ck: HTMLElement | null = null;
let opener: HTMLElement | null = null;
function close(): void {
  ck?.remove();
  ck = null;
  document.body.classList.remove('ck-open');
  opener?.focus();
  opener = null;
}

export function openCookies(detail: boolean): void {
  close();
  const tpl = document.getElementById('tpl-cookies') as HTMLTemplateElement | null;
  if (!tpl) return;
  if (detail) opener = document.activeElement as HTMLElement | null;
  const frag = tpl.content.cloneNode(true) as DocumentFragment;
  ck = frag.querySelector('.ck');
  if (!ck) return;
  const cur = get() ?? { mesure: false, pub: false, at: 0 };
  const m = ck.querySelector<HTMLInputElement>('[data-ck-m]');
  const p = ck.querySelector<HTMLInputElement>('[data-ck-p]');
  if (m) m.checked = cur.mesure;
  if (p) p.checked = cur.pub;
  const show = (d: boolean): void => {
    ck?.querySelectorAll<HTMLElement>('[data-ck-detail]').forEach((x) => { x.hidden = !d; });
    const simple = ck?.querySelector<HTMLElement>('[data-ck-simple]');
    if (simple) simple.hidden = d;
  };
  show(detail);
  ck.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-ck]');
    if (!b) return;
    const a = b.dataset.ck;
    if (a === 'refuse') save(false, false);
    else if (a === 'accept') save(true, true);
    else if (a === 'detail') { show(true); m?.focus(); }
    else if (a === 'save') save(!!m?.checked, !!p?.checked);
  });
  document.body.appendChild(frag);
  document.body.classList.add('ck-open');
  if (detail) m?.focus();
}

export function hasAdConsent(): boolean { return !!get()?.pub; }

export function initConsent(): void {
  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  const c = get();
  if (c) apply(c);
  else if (!location.pathname.startsWith('/admin/') && !location.pathname.startsWith('/dev/')) setTimeout(() => { if (!get()) openCookies(false); }, 900);
}
