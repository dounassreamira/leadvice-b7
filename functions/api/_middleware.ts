/* Filet de sécurité pour toutes les routes /api/* : une exception imprévue ne renvoie jamais une page brute.
   Formulaire envoyé sans JavaScript : redirection vers la page d'erreur du site ; appel en JavaScript : JSON. */
import { json, siteUrl, type Env } from '../../server/env';

export const onRequest: PagesFunction<Env> = async (ctx) => {
  try {
    return await ctx.next();
  } catch (e) {
    console.error('api', new URL(ctx.request.url).pathname, e instanceof Error ? e.message : e);
    const type = ctx.request.headers.get('Content-Type') ?? '';
    const form = ctx.request.method === 'POST' && !type.includes('application/json');
    return form ? Response.redirect(siteUrl(ctx.env) + '/erreur/?code=500', 303) : json({ ok: false, error: 'server' }, 500);
  }
};
