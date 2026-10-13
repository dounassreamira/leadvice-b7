/* Fenêtre de confirmation : <dialog> natif, focus piégé, Échap annule, focus rendu à l'élément d'origine.
   Deux usages : quitter un diagnostic commencé, et « Recommencer » dans le formulaire. */
interface Opts { titre: string; texte?: string; ok: string; annuler: string; danger?: boolean }

export function confirmDialog(o: Opts): Promise<boolean> {
  const from = document.activeElement as HTMLElement | null;
  const d = document.createElement('dialog');
  d.className = 'cf';
  d.setAttribute('aria-labelledby', 'cf-t');
  if (o.texte) d.setAttribute('aria-describedby', 'cf-d');
  const h = document.createElement('h2'); h.id = 'cf-t'; h.textContent = o.titre; d.appendChild(h);
  if (o.texte) { const p = document.createElement('p'); p.id = 'cf-d'; p.textContent = o.texte; d.appendChild(p); }
  const acts = document.createElement('div'); acts.className = 'acts';
  const keep = document.createElement('button'); keep.type = 'button'; keep.className = 'btn btn-main'; keep.textContent = o.annuler;
  const go = document.createElement('button'); go.type = 'button'; go.className = 'btn btn-ghost'; go.textContent = o.ok;
  acts.append(keep, go); d.appendChild(acts);
  document.body.appendChild(d);
  return new Promise((resolve) => {
    let res = false;
    keep.addEventListener('click', () => d.close());
    go.addEventListener('click', () => { res = true; d.close(); });
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
    d.addEventListener('close', () => { d.remove(); from?.focus?.(); resolve(res); });
    d.showModal();
    keep.focus();
  });
}
