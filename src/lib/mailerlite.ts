/** MailerLite upsert. The confirmation email is an automation configured in the
 *  MailerLite dashboard, triggered by the subscriber landing in the group — no
 *  email is sent from this code.
 *
 *  This call must never fail a registration: the row is already in D1 by the time
 *  it runs, so every failure is caught and reported as a status string that goes
 *  into registrations.mailerlite_status. */
import type { RegistrationValues } from '../data/registration';

const SUBSCRIBERS = 'https://connect.mailerlite.com/api/subscribers';

export type MailerliteStatus = string;

export interface MailerliteEnv {
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
}

/** MailerLite custom fields are text fields; booleans go in as yes/no. A field
 *  that does not exist on the account is dropped silently by the API — the call
 *  still answers 2xx — so every key below has to be created in the dashboard
 *  first (README, "MailerLite fields").
 *
 *  Since MM-73 every field but the address is optional, so any of these may
 *  travel as an empty string. That is deliberate: the subscriber is created
 *  either way, and an empty custom field is the truthful record of an answer
 *  that was not given. */
const flag = (value: boolean): string => (value ? 'yes' : 'no');

export async function upsertSubscriber(
  values: RegistrationValues,
  env: MailerliteEnv,
): Promise<MailerliteStatus> {
  const key = env.MAILERLITE_API_KEY ?? '';
  if (key === '') return 'skipped';

  const payload: Record<string, unknown> = {
    email: values.email,
    fields: {
      name: values.name,
      github: values.github,
      os: values.os,
      // The joined string, exactly as it goes into the D1 column: MailerLite
      // custom fields are single text values, so several tools travel as
      // "claude-code,cursor".
      tool: values.tool,
      terminal: values.terminal,
      own_hosting: flag(values.own_hosting),
      watch_only: flag(values.watch_only),
    },
  };
  const group = env.MAILERLITE_GROUP_ID ?? '';
  if (group !== '') payload.groups = [group];

  try {
    const response = await fetch(SUBSCRIBERS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok ? 'ok' : `failed:${response.status}`;
  } catch {
    return 'failed:network';
  }
}
