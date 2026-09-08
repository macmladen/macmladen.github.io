-- Registrations for the WordCamp Belgrade 2026 workshop.
-- Column names are the form field names (docs/spec-v1.md, "Form fields"), so the
-- form, the validator in src/lib/validate.ts and this table cannot drift apart.
-- Apply locally:   npx wrangler d1 migrations apply macmladen-registrations --local
-- Apply remotely:  npx wrangler d1 migrations apply macmladen-registrations --remote

CREATE TABLE IF NOT EXISTS registrations (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  name              TEXT    NOT NULL,
  email             TEXT    NOT NULL,
  github            TEXT    NOT NULL,
  os                TEXT    NOT NULL,
  tool              TEXT    NOT NULL,
  ssh_key           TEXT,
  own_hosting       INTEGER NOT NULL DEFAULT 0,
  watch_only        INTEGER NOT NULL DEFAULT 0,
  newsletter        INTEGER NOT NULL DEFAULT 0,
  -- SHA-256 of IP_HASH_SALT + the submitting IP; null when either is missing.
  ip_hash           TEXT,
  -- 'pending' until the MailerLite call answers, then 'ok', 'skipped' or 'failed:<why>'.
  mailerlite_status TEXT    NOT NULL DEFAULT 'pending'
);

-- One registration per address: the duplicate check in the endpoint is the
-- friendly message, this index is the guarantee.
CREATE UNIQUE INDEX IF NOT EXISTS registrations_email ON registrations (email);
