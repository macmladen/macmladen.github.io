-- Live questions from the room during the workshop (MM-84), and the two
-- switches that decide what the workshop page offers while it is running.
-- Apply locally:   npx wrangler d1 migrations apply macmladen-registrations --local
-- Apply remotely:  npx wrangler d1 migrations apply macmladen-registrations --remote

CREATE TABLE IF NOT EXISTS questions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  -- Optional: a question may be asked without a name, and an unnamed one is
  -- stored as NULL rather than an empty string, like the nullable columns on
  -- registrations.
  name       TEXT,
  body       TEXT    NOT NULL,
  -- When the question was marked answered from the stage; NULL while it waits.
  -- It is the covered flag and the record of when, in one column.
  covered_at TEXT,
  -- SHA-256 of IP_HASH_SALT + the submitting IP; null when either is missing,
  -- exactly as in registrations and messages.
  ip_hash    TEXT
);

-- Two switches Mladen flips by hand from the command line during the day: the
-- registration form closes when the room is settled, the questions open when
-- the workshop starts. They live in the database rather than in the build
-- because the site is static and a rebuild in front of a room is not a plan.
CREATE TABLE IF NOT EXISTS workshop_state (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- '1' is open, anything else is closed. Registration starts open (it has been
-- open since M5 shipped) and questions start closed.
INSERT OR IGNORE INTO workshop_state (key, value) VALUES
  ('registration_open', '1'),
  ('questions_open', '0');
