-- Terminal experience, asked from MM-57 on: beginner, comfortable or fluent,
-- the keys in terminalOptions in src/data/registration.ts.
-- Added as a nullable column rather than NOT NULL because the rows written
-- before this migration never carried an answer, and a default would invent
-- one for them; every row written from here on has a value, because the
-- validator refuses a registration without it.
-- Apply locally:   npx wrangler d1 migrations apply macmladen-registrations --local
-- Apply remotely:  npx wrangler d1 migrations apply macmladen-registrations --remote

ALTER TABLE registrations ADD COLUMN terminal TEXT;
