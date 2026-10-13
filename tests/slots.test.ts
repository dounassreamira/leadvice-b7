// Tests du calcul des créneaux : npm test
import { fromLocal, toLocal, labelFr } from '../server/tz';
import { computeSlots, DEFAULTS, sanitize } from '../server/slots';
let fails = 0;
const eq = (a: unknown, b: unknown, msg: string): void => { if (JSON.stringify(a) !== JSON.stringify(b)) { fails++; console.log('ÉCHEC', msg, a, '≠', b); } else console.log('ok  ', msg); };

// fuseau : heure d'été habituelle (UTC+1) et Ramadan (UTC+0) sans décalage fixe
eq(new Date(fromLocal(2026, 10, 14, 600)).toISOString(), '2026-10-14T09:00:00.000Z', '14 octobre 2026, 10 h à Casablanca = 9 h UTC');
eq(new Date(fromLocal(2026, 3, 1, 600)).toISOString(), '2026-03-01T10:00:00.000Z', '1er mars 2026 (Ramadan), 10 h = 10 h UTC');
eq(toLocal(Date.parse('2026-03-01T10:00:00Z')).h, 10, 'lecture de l\'heure locale pendant le Ramadan');
eq(labelFr(Date.parse('2026-10-14T09:00:00Z')), 'mercredi 14 octobre à 10 h 00', 'libellé en toutes lettres');

// délai minimal : rien avant 24 h
const now = Date.parse('2026-10-13T08:00:00Z'); // mardi 13 octobre, 9 h à Casablanca
const S = sanitize(DEFAULTS);
const days = computeSlots(S, now, [], []);
eq(days[0]?.slots.length, 0, 'aujourd\'hui : aucun créneau (délai de 24 h)');
const wed = days.find((d) => d.date === '2026-10-14')!;
eq(wed.slots[0]?.label, '9 h 00', 'mercredi : premier créneau 9 h 00 (plus de 24 h)');
eq(wed.slots.map((s) => s.label), ['9 h 00', '10 h 00', '11 h 00', '12 h 00', '14 h 30', '15 h 30', '16 h 30', '17 h 30'], 'mercredi : créneaux de 45 min, pause 15 min');
// samedi et dimanche fermés, vendredi matin seulement
eq(days.find((d) => d.date === '2026-10-17')?.slots.length, 0, 'samedi fermé');
eq(days.find((d) => d.date === '2026-10-16')?.slots.map((s) => s.label), ['9 h 00', '10 h 00', '11 h 00'], 'vendredi matin');
// jour bloqué
const blocked = computeSlots(sanitize({ ...DEFAULTS, blocked: ['2026-10-14'] }), now, [], []);
eq(blocked.find((d) => d.date === '2026-10-14')?.slots.length, 0, 'jour bloqué');
// créneau pris et occupation de l'agenda
const t10 = fromLocal(2026, 10, 14, 600);
const withBooking = computeSlots(S, now, [{ start: t10, end: t10 + 45 * 60000 }], [{ start: fromLocal(2026, 10, 14, 870), end: fromLocal(2026, 10, 14, 930) }]);
eq(withBooking.find((d) => d.date === '2026-10-14')?.slots.map((s) => s.label), ['9 h 00', '11 h 00', '12 h 00', '15 h 30', '16 h 30', '17 h 30'], 'réservation et agenda Google retirés');
// créneau exceptionnel un samedi
const extra = computeSlots(sanitize({ ...DEFAULTS, extra: [{ date: '2026-10-17', from: '10:00', to: '12:00' }] }), now, [], []);
eq(extra.find((d) => d.date === '2026-10-17')?.slots.map((s) => s.label), ['10 h 00', '11 h 00'], 'créneau exceptionnel le samedi');
// horizon
eq(days[days.length - 1]?.date, '2026-11-03', 'horizon de 21 jours');
// plafond par jour
const cap = computeSlots(sanitize({ ...DEFAULTS, maxPerDay: 3 }), now, [], []);
eq(cap.find((d) => d.date === '2026-10-14')?.slots.length, 3, 'plafond de 3 par jour');
// Ramadan : les créneaux restent à 9 h heure locale
const ram = computeSlots(S, Date.parse('2026-02-26T08:00:00Z'), [], [], '2026-03-02', '2026-03-02');
eq(new Date(ram[0]!.slots[0]!.start).toISOString(), '2026-03-02T09:00:00.000Z', 'Ramadan : 9 h locale = 9 h UTC');
if (fails) { console.log(fails + ' échec(s)'); process.exit(1); } else console.log('Tous les tests passent.');
