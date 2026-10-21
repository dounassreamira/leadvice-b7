/* Formulaires d'inscription aux ressources ([data-lead]) : envoi vers /api/lead avec la source de la visite. */
import { readUtm } from './utm';

for (const form of document.querySelectorAll<HTMLFormElement>('form[data-lead]')) {
  const msg = form.parentElement?.querySelector<HTMLElement>('[data-lead-msg]');
  const done = form.parentElement?.querySelector<HTMLElement>('[data-lead-done]');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = (n: string) => form.elements.namedItem(n) as HTMLInputElement | null;
    const email = f('email')!;
    if (!email.checkValidity()) { if (msg) msg.textContent = form.dataset.invalid || ''; email.focus(); return; }
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    btn?.setAttribute('aria-busy', 'true'); if (btn) btn.disabled = true;
    const q = new URLSearchParams(location.search), u = readUtm();
    const interets = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="interets"]:checked')).map((i) => i.value).join(', ');
    const body = {
      email: email.value, prenom: f('prenom')?.value || '', magnet: form.dataset.magnet || 'lettre', interets, site: f('site')?.value || '',
      source: q.get('utm_source') || u.utm_source || 'site', campagne: q.get('utm_campaign') || u.utm_campaign || '', page: location.pathname,
    };
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(String(r.status));
      form.hidden = true;
      if (done) { done.hidden = false; done.focus(); } else if (msg) msg.textContent = form.dataset.ok || '';
    } catch { if (msg) msg.textContent = form.dataset.err || ''; }
    finally { btn?.removeAttribute('aria-busy'); if (btn) btn.disabled = false; }
  });
}
export {};
