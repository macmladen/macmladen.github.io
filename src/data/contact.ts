/** The contact form's shape. One source for the form markup, the validator and
 *  the D1 columns: every key here is a column name in
 *  migrations/0002_messages.sql. No Astro imports, so the validator that reads
 *  this file stays unit-testable with plain node.
 *
 *  Deliberately a separate file from src/data/registration.ts rather than a
 *  shared "form" module: the two forms answer to different tables and will drift
 *  apart, and one abstraction over both would have to be undone the first time
 *  they do. */

export interface Option {
  value: string;
  label: string;
}

/** The four reasons someone writes. The value is what goes in the D1 column and
 *  the label is what the visitor picks and what the email subject carries, so a
 *  label may be reworded without rewriting stored rows. */
export const topicOptions: Option[] = [
  { value: 'chat', label: 'Casual chat' },
  { value: 'website', label: 'We need a website' },
  { value: 'training', label: 'We need training' },
  { value: 'speaking', label: 'We are calling you as a speaker' },
];

export type ContactField = 'name' | 'email' | 'topic' | 'message';

export interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

/** Field-level messages, plus `form` for anything that is not one field's fault
 *  (the anti-spam check, a database that is not there). */
export type ContactErrors = Partial<Record<ContactField | 'form', string>>;

export const emptyValues: ContactValues = {
  name: '',
  email: '',
  topic: '',
  message: '',
};

/** The label for a stored topic value. Falls back to the raw value, so a row
 *  written before an option was renamed still reads as something. */
export const topicLabel = (value: string): string =>
  topicOptions.find((option) => option.value === value)?.label ?? value;
