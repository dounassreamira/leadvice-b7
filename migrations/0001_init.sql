-- Base D1 du diagnostic Leadvice. À exécuter une fois dans la console D1 de Cloudflare (ou : wrangler d1 execute).
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,          -- JSON : durée, pause, délai minimal, horizon, maximum par jour, horaires, jours bloqués, créneaux exceptionnels
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  start_utc INTEGER NOT NULL,   -- millisecondes UTC
  end_utc INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',  -- confirmed, cancelled, moved
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  tel TEXT NOT NULL DEFAULT '',
  entreprise TEXT NOT NULL,
  enjeu TEXT NOT NULL,
  campagnes TEXT NOT NULL,
  format TEXT NOT NULL,
  utm TEXT NOT NULL DEFAULT '{}',
  token TEXT NOT NULL UNIQUE,   -- lien de gestion reçu par e-mail
  gcal_id TEXT,
  meet TEXT,
  reminded_day INTEGER NOT NULL DEFAULT 0,
  reminded_hour INTEGER NOT NULL DEFAULT 0,
  outcome TEXT,                 -- tenu, signe
  value REAL,
  version TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- un seul rendez-vous confirmé par heure de début : aucune double réservation possible
CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_start ON bookings (start_utc) WHERE status = 'confirmed';
CREATE INDEX IF NOT EXISTS bookings_start ON bookings (start_utc);
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  priorite TEXT NOT NULL,
  data TEXT NOT NULL            -- JSON : toutes les réponses et les UTM
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  action TEXT NOT NULL,
  ref TEXT NOT NULL,
  detail TEXT
);
