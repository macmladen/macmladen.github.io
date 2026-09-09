/** Contact form validation. Pure functions only — no Astro, no fetch, no
 *  database — so `node scripts/test-validate-contact.mjs` can exercise every
 *  rule without a server. The endpoint calls readForm() then validate().
 *
 *  A sibling of src/lib/validate.ts, not a generalisation of it: the two forms
 *  write to different tables and their rules already differ (this one has no
 *  duplicate check and a minimum message length), so they are kept apart and
 *  each stays readable on its own.
 *
 *  The two imports below carry their .ts extension on purpose: node's ESM
 *  resolver does not guess extensions, and this file has to load in plain node
 *  as well as through Vite. */
import { person } from '../data/person.ts';
import {
  emptyValues,
  topicOptions,
  type ContactErrors,
  type ContactValues,
} from '../data/contact.ts';

/** Anything with a FormData-shaped get(). Keeps this file free of DOM types. */
export interface FormLike {
  get(name: string): unknown;
}

export const limits = {
  name: 100,
  email: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

export const messages = {
  name: 'Please add your name.',
  nameLong: `A name longer than ${limits.name} characters will not fit.`,
  email: 'That does not look like an email address.',
  topic: 'Please pick what this is about.',
  message: `Please write at least ${limits.messageMin} characters, so there is something to answer.`,
  messageLong: `That is longer than ${limits.messageMax} characters. Send the short version and the rest by email.`,
  turnstile: 'The anti-spam check did not go through. Tick it once more and send again.',
  unavailable:
    `The form is temporarily unavailable. Write to ${person.email} directly and the ` +
    'message will reach him just the same.',
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (form: FormLike, field: string): string => {
  const raw = form.get(field);
  return typeof raw === 'string' ? raw.trim() : '';
};

/** Submitted form to values. Never throws, never validates: whatever came in is
 *  what the form is re-rendered with when validation then fails. */
export function readForm(form: FormLike): ContactValues {
  return {
    ...emptyValues,
    name: text(form, 'name'),
    email: text(form, 'email').toLowerCase(),
    topic: text(form, 'topic'),
    message: text(form, 'message'),
  };
}

/** Field-level errors, empty when everything passes. */
export function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (values.name === '') errors.name = messages.name;
  else if (values.name.length > limits.name) errors.name = messages.nameLong;

  if (!emailPattern.test(values.email) || values.email.length > limits.email) {
    errors.email = messages.email;
  }

  if (!topicOptions.some((option) => option.value === values.topic)) {
    errors.topic = messages.topic;
  }

  if (values.message.length < limits.messageMin) errors.message = messages.message;
  else if (values.message.length > limits.messageMax) errors.message = messages.messageLong;

  return errors;
}

export const hasErrors = (errors: ContactErrors): boolean => Object.keys(errors).length > 0;
