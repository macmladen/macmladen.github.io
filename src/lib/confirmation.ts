/** The registration confirmation: the one mail this site sends to a visitor.
 *  Builds the MailerSend payload and nothing else, so the endpoint hands it to
 *  send() in mailersend.ts and `node scripts/test-confirmation.mjs` can read
 *  every line of it without a network.
 *
 *  Every fact in the text — the day, the hours, the venue, the repository, the
 *  date the guide lands — comes from src/data/workshop.ts, and the reply address
 *  from src/data/person.ts, so the mail cannot drift from the page.
 *
 *  The .ts extensions on the imports are on purpose, as in validate.ts: node's
 *  ESM resolver does not guess them, and this file has to load in plain node as
 *  well as through Vite. */
import type { RegistrationValues } from '../data/registration.ts';
import { person } from '../data/person.ts';
import { workshop } from '../data/workshop.ts';
import { timeOfDay, weekdayAndDate } from './dates.ts';
import { FROM, send, type MailerSendEnv, type MailStatus } from './mailersend.ts';

/** Approved by Mladen on 2026-09-10, subject and body both — his wording, not a
 *  draft, with only the facts filled in from the data files. */
export const subject =
  'You are registered: WordPress, Docker and AI agents, WordCamp Belgrade';

/** The name is optional since MM-73, and "Hi ," is not a greeting. */
const ANYONE = 'there';

/** "Friday 18 September, 12:20–13:40" */
const when = `${weekdayAndDate(workshop.start)}, ${timeOfDay(workshop.start)}–${timeOfDay(workshop.end)}`;

/** "Dom Omladine Beograda, Makedonska 22" — the venue and its street, the way
 *  someone standing in front of it would say it. */
const where = `${workshop.venue}, ${workshop.street}`;

export const confirmationText = (name: string): string =>
  [
    `Hi ${name === '' ? ANYONE : name},`,
    '',
    `You are on the list for the workshop on ${when}, ${where}.`,
    '',
    `Before you come: install Docker, DDEV, git and your AI tool, and have a GitHub ` +
      `account. The preparation guide and the demo project are at ${workshop.repoUrl}; ` +
      `the full guide lands there by ${workshop.prepDeadline}.`,
    '',
    'Watching without a laptop is fine too.',
    '',
    'See you there,',
    'Mladen',
  ].join('\n');

/** The payload as MailerSend takes it. Reply-To is Mladen's own address: an
 *  answer to a confirmation is a question for him, not for a no-reply box. */
export const confirmationPayload = (
  values: RegistrationValues,
): Record<string, unknown> => ({
  from: FROM,
  to: [values.name === '' ? { email: values.email } : { email: values.email, name: values.name }],
  reply_to: { email: person.email, name: person.name },
  subject,
  text: confirmationText(values.name),
});

/** 'sent', 'skipped' (no API key) or 'failed:<reason>'; never throws. The
 *  registration is already written by the time this runs. */
export async function sendConfirmation(
  values: RegistrationValues,
  env: MailerSendEnv,
): Promise<MailStatus> {
  return send(confirmationPayload(values), env);
}
