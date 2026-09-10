-- The confirmation email's delivery status, from MM-70 on: 'sent', 'skipped'
-- (no MAILERSEND_API_KEY configured) or 'failed:<reason>'. The registration is
-- written before the send is attempted, so a delivery failure never loses one —
-- a row sitting at 'failed:' is a person to write to by hand.
-- Nullable and without a default, like 0003: the rows written before this
-- column existed were never sent a confirmation from here, and a default would
-- claim otherwise.
-- Apply locally:   npx wrangler d1 migrations apply macmladen-registrations --local
-- Apply remotely:  npx wrangler d1 migrations apply macmladen-registrations --remote

ALTER TABLE registrations ADD COLUMN confirmation_status TEXT;
