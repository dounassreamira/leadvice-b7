/* Toutes les routes /api/admin/* exigent une session Cloudflare Access valide. */
import { json, type Env } from '../../../server/env';
import { accessUser } from '../../../server/access';

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const user = await accessUser(ctx.request, ctx.env);
  if (!user) return json({ ok: false, error: ctx.env.ACCESS_TEAM_DOMAIN ? 'forbidden' : 'access_not_configured' }, 403);
  ctx.data = { user };
  return ctx.next();
};
