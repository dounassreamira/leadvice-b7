/* /llms.txt : résumé du cabinet pour les moteurs de réponse (texte dans src/content/site/llms.yaml). */
import type { APIRoute } from 'astro';
import { site } from '../lib/content';

export const GET: APIRoute = async () => {
  const d = await site('llms');
  return new Response(String(d.texte), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
