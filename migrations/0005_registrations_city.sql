-- The registrant's city, asked from MM-78 on. Optional, free text up to 100
-- characters, and asked of everyone: it is not a laptop question, so a watcher
-- answers it too.
-- Nullable and without a default, like 0003 and 0004: the rows written before
-- this column existed were never asked, and a default would invent an answer
-- for them. An unanswered city is stored as NULL rather than an empty string.
-- Apply locally:   npx wrangler d1 migrations apply macmladen-registrations --local
-- Apply remotely:  npx wrangler d1 migrations apply macmladen-registrations --remote

ALTER TABLE registrations ADD COLUMN city TEXT;
