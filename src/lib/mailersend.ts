/** MailerSend transactional send: the contact form's message, delivered to
 *  Mladen's inbox. The domain macmladen.com is verified (DKIM, SPF and
 *  return-path all true, docs/mail-setup.md), so the From address may be on it.
 *
 *  This call must never fail a submission: the row is already in D1 by the time
 *  it runs, so every failure is caught and reported as a status string that goes
 *  into messages.mail_status. */
import { topicLabel, type ContactValues } from '../data/contact';
import { person } from '../data/person';

const EMAIL = 'https://api.mailersend.com/v1/email';

/** A no-reply sender on the one verified domain. The visitor's own address goes
 *  in reply_to, so hitting Reply in the inbox answers the person, not the form. */
const FROM = { email: 'no-reply@macmladen.com', name: 'macmladen.com' } as const;

export type MailStatus = string;

export interface MailerSendEnv {
  MAILERSEND_API_KEY?: string;
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
  const key = env.MAILERSEND_API_KEY ?? '';
  if (key === '') return 'skipped';

  const payload = {
    from: FROM,
    // info@ rather than person.email: the MailerSend account is still a
    // sandbox with a unique-recipient cap, and info@macmladen.com is one of
    // the addresses it already accepted; the Cloudflare catch-all forwards
    // both to the same inbox. Back to person.email once the account is approved.
    to: [{ email: 'info@macmladen.com', name: person.name }],
    reply_to: { email: values.email, name: values.name },
    subject: `[macmladen.com] ${topicLabel(values.topic)} from ${values.name}`,
    text: body(values),
    // The plan refuses to turn tracking off at domain level, so every message
    // turns it off for itself (docs/mail-setup.md).
    settings: { track_clicks: false, track_opens: false },
  };

  try {
    const response = await fetch(EMAIL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response.ok ? 'sent' : `failed:${response.status}`;
  } catch {
    return 'failed:network';
  }
}
