/** MailerSend transactional sends: the contact form's message to Mladen's inbox
 *  (MM-63) and the registration confirmation to the registrant (MM-70). The
 *  domain macmladen.com is verified (DKIM, SPF and return-path all true,
 *  docs/mail-setup.md), so the From address may be on it.
 *
 *  Neither call may ever fail the submission behind it: the row is already in D1
 *  by the time it runs, so every failure is caught and reported as a status
 *  string that goes into that row — messages.mail_status for the contact
 *  message, registrations.confirmation_status for the confirmation.
 *
 *  The .ts extensions on the imports are deliberate, as in validate.ts:
 *  src/lib/confirmation.ts reads FROM from this file and has to load in plain
 *  node for its unit test, where the resolver does not guess extensions. */
import { topicLabel, type ContactValues } from '../data/contact.ts';
import { person } from '../data/person.ts';

const EMAIL = 'https://api.mailersend.com/v1/email';

/** A no-reply sender on the one verified domain, shared by both mails. Each one
 *  sets its own reply_to: a contact message is answered to the visitor who sent
 *  it, a confirmation to Mladen. */
export const FROM = { email: 'no-reply@macmladen.com', name: 'macmladen.com' } as const;

export type MailStatus = string;

export interface MailerSendEnv {
  MAILERSEND_API_KEY?: string;
}

/** The one POST both mails go through. Answers 'skipped' when no key is
 *  configured, 'sent' on a 2xx and 'failed:<reason>' on anything else, and
 *  never throws.
 *
 *  Tracking is turned off message by message because the plan refuses to turn it
 *  off at domain level (docs/mail-setup.md); a caller may override it, but
 *  neither of these two mails is one to measure. */
export async function send(
  payload: Record<string, unknown>,
  env: MailerSendEnv,
): Promise<MailStatus> {
  const key = env.MAILERSEND_API_KEY ?? '';
  if (key === '') return 'skipped';

  try {
    const response = await fetch(EMAIL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        settings: { track_clicks: false, track_opens: false },
        ...payload,
      }),
    });
    return response.ok ? 'sent' : `failed:${response.status}`;
  } catch {
    return 'failed:network';
  }
}

/** Plain text only — there is nothing in a contact message that HTML would say
 *  better, and a text part alone keeps the mail out of the shape spam filters
 *  look at hardest. */
const body = (values: ContactValues): string =>
  [
    `Topic:   ${topicLabel(values.topic)}`,
    `Name:    ${values.name}`,
    `Email:   ${values.email}`,
    '',
    values.message,
    '',
    '--',
    'Sent from the contact form on macmladen.com',
  ].join('\n');

export async function sendMessage(
  values: ContactValues,
  env: MailerSendEnv,
): Promise<MailStatus> {
  return send(
    {
      from: FROM,
      to: [{ email: person.email, name: person.name }],
      reply_to: { email: values.email, name: values.name },
      subject: `[macmladen.com] ${topicLabel(values.topic)} from ${values.name}`,
      text: body(values),
    },
    env,
  );
}
