/** Everything this site does to the D1 `messages` table — the contact form's
 *  counterpart to src/lib/registrations.ts. The database is typed structurally
 *  by that file, so no Cloudflare types package is needed here either. */
import type { ContactValues } from '../data/contact';
import { hashIp, type D1Like } from './registrations';

/** The salted SHA-256 of the submitting IP is the same operation for both
 *  forms, so it is not written twice. It lives in registrations.ts because that
 *  is where it was first needed; re-exported here so the contact endpoint can
 *  take everything about its row from one module. */
export { hashIp };
export type { D1Like };

/** Inserts the message and returns its id. mail_status starts as 'pending' and
 *  is overwritten once the MailerSend call has answered. Unlike registrations
 *  there is no unique key: the same person may write twice, and a second
 *  message about a different thing is not a mistake to be refused. */
export async function insertMessage(
  db: D1Like,
  values: ContactValues,
  ipHash: string | null,
): Promise<number> {
  const row = await db
    .prepare(
      `INSERT INTO messages
         (name, email, topic, message, ip_hash, mail_status)
       VALUES (?, ?, ?, ?, ?, 'pending')
       RETURNING id`,
    )
    .bind(values.name, values.email, values.topic, values.message, ipHash)
    .first<{ id: number }>();

  if (!row) throw new Error('The message insert returned no id.');
  return row.id;
}

export async function setMailStatus(db: D1Like, id: number, status: string): Promise<void> {
  await db.prepare('UPDATE messages SET mail_status = ? WHERE id = ?').bind(status, id).run();
}
