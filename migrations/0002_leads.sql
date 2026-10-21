-- Inscriptions aux ressources (lead magnets, lettre d'information). À exécuter une fois dans la console D1.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  prenom TEXT NOT NULL DEFAULT '',
  magnet TEXT NOT NULL,          -- ressource demandée (exemple-plan, lettre, guides…)
  interets TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'site',
  campagne TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_magnet ON leads (email, magnet);
