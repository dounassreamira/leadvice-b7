/* Fichier .ics joint à la confirmation : le rendez-vous s'ajoute à l'agenda du prospect. */
const fmt = (t: number): string => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string): string => s.replace(/[\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
export function ics(o: { uid: string; start: number; end: number; summary: string; description: string; url: string; organizer: string; method?: 'REQUEST' | 'CANCEL'; sequence?: number }): string {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Leadvice//Diagnostic//FR', 'CALSCALE:GREGORIAN', `METHOD:${o.method ?? 'REQUEST'}`,
    'BEGIN:VEVENT', `UID:${o.uid}@leadvice.org`, `DTSTAMP:${fmt(Date.now())}`, `DTSTART:${fmt(o.start)}`, `DTEND:${fmt(o.end)}`,
    `SUMMARY:${esc(o.summary)}`, `DESCRIPTION:${esc(o.description)}`, `URL:${o.url}`, `ORGANIZER;CN=Leadvice:mailto:${o.organizer}`,
    `SEQUENCE:${o.sequence ?? 0}`, `STATUS:${o.method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Diagnostic Leadvice dans une heure', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
export const b64 = (s: string): string => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
