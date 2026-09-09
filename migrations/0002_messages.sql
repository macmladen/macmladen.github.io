-- Messages from the contact form on /contact/.
-- Column names are the form field names (docs/spec-v1.md, "Contact form fields"),
-- so the form, the validator in src/lib/validate-contact.ts and this table cannot
-- drift apart. Same database as the registrations, same D1 binding `DB`.
-- Apply locally:   npx wrangler d1 migrations apply macmladen-registrations --local
-- Apply remotely:  npx wrangler d1 migrations apply macmladen-registrations --remote

CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  -- One of the keys in src/data/contact.ts: chat, website, training, speaking.
  topic       TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  -- SHA-256 of IP_HASH_SALT + the submitting IP; null when either is missing.
  ip_hash     TEXT,
  -- 'pending' until the MailerSend call answers, then 'sent', 'skipped'
  -- (no API key configured) or 'failed:<why>'. The row is kept either way:
  -- a delivery failure must never lose the message.
  mail_status TEXT    NOT NULL DEFAULT 'pending'
);

-- No unique index here, unlike registrations: the same person may write more
-- than once, and a second message is not a duplicate to be refused.
