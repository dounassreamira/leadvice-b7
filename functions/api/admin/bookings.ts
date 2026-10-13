/* GET /api/admin/bookings : rendez-vous à venir (ou tous avec ?tous=1) ; ?format=csv pour l'export. */
import { json, type Env } from '../../../server/env';
import type { Booking } from '../../../server/db';
import { labelFr } from '../../../server/tz';
import { ENJEUX } from '../../../server/validate';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ ok: false, error: 'not_configured' }, 503);
  const u = new URL(request.url), all = u.searchParams.get('tous') === '1';
  const r = await env.DB.prepare(`SELECT * FROM bookings ${all ? '' : "WHERE start_utc >= ? AND status = 'confirmed'"} ORDER BY start_utc ${all ? 'DESC' : 'ASC'} LIMIT 500`).bind(...(all ? [] : [Date.now() - 3600e3])).all<Booking>();
  const rows = (r.results ?? []).map((b) => ({ id: b.id, label: labelFr(b.start_utc), start: new Date(b.start_utc).toISOString(), status: b.status, nom: b.nom, email: b.email, tel: b.tel, entreprise: b.entreprise, enjeu: ENJEUX[b.enjeu]?.label ?? b.enjeu, campagnes: b.campagnes, format: b.format, outcome: b.outcome, value: b.value, utm: b.utm, version: b.version }));
  if (u.searchParams.get('format') === 'csv') {
    const cols = ['label', 'status', 'nom', 'email', 'tel', 'entreprise', 'enjeu', 'campagnes', 'format', 'outcome', 'value', 'version', 'utm'] as const;
    const q = (x: unknown): string => '"' + String(x ?? '').replace(/"/g, '""') + '"';
    const csv = '﻿' + [cols.join(';'), ...rows.map((x) => cols.map((c) => q(x[c])).join(';'))].join('\r\n');
    return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="rendez-vous-leadvice.csv"', 'Cache-Control': 'no-store' } });
  }
  return json({ ok: true, bookings: rows });
};
