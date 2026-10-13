/* Textes de la fenêtre de réservation, chargés seulement à l'ouverture (rien sur les autres pages). */
import type { APIRoute } from 'astro';
import { site } from '../lib/content';
export const GET: APIRoute = async () => new Response(JSON.stringify({ ...(await site('reservation')), email: (await site()).email }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
