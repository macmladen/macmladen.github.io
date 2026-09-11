/** Registration validation. Pure functions only — no Astro, no fetch, no
 *  database — so `node scripts/test-validate.mjs` can exercise every rule
 *  without a server. The endpoint calls readForm() then validate().
 *
 *  The two imports below carry their .ts extension on purpose: node's ESM
 *  resolver does not guess extensions, and this file has to load in plain node
 *  as well as through Vite. */
import { person } from '../data/person.ts';
import {
  emptyValues,
  osOptions,
  splitTools,
  sshKeyPrefixes,
  terminalOptions,
  toolOptions,
  toolSeparator,
  type RegistrationErrors,
  type RegistrationValues,
} from '../data/registration.ts';

/** Anything FormData-shaped. getAll() is here for the AI tool checkboxes: they
 *  share one name, so a submission carries as many `tool` entries as boxes were
 *  ticked and get() would see only the first. Keeps this file free of DOM
 *  types. */
export interface FormLike {
  get(name: string): unknown;
  getAll(name: string): unknown[];
}

export const limits = {
  name: 100,
  city: 100,
  email: 254,
  github: 39,
  ssh_key: 2000,
} as const;

/** Only `email` can be missing; the rest speak about a value that was given and
 *  is not one of the answers the form offers, which in practice means a
 *  hand-made request rather than a mistake at the keyboard (MM-73). */
export const messages = {
  nameLong: `A name longer than ${limits.name} characters will not fit.`,
  cityLong: `A city name longer than ${limits.city} characters will not fit.`,
  email: 'That does not look like an email address.',
  github: 'A GitHub username is letters, numbers and hyphens, up to 39 characters.',
  os: 'Please pick one of the operating systems offered.',
  tool: 'Please tick only the AI tools offered.',
  terminal: 'Please pick one of the terminal levels offered.',
  sshKey:
    'An SSH public key starts with "ssh-ed25519 " or "ssh-rsa ". Leave the field empty ' +
    'if you would rather not paste one.',
  sshKeyLong: 'That is longer than an SSH public key should be.',
  duplicate:
    'This address is already registered. The confirmation email should be in your inbox.',
  turnstile: 'The anti-spam check did not go through. Tick it once more and send again.',
  unavailable:
    `Registration is temporarily unavailable. Write to ${person.email} and you will be ` +
    'added by hand.',
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const githubPattern = /^[A-Za-z0-9-]{1,39}$/;

const text = (form: FormLike, field: string): string => {
  const raw = form.get(field);
  return typeof raw === 'string' ? raw.trim() : '';
};

const checked = (form: FormLike, field: string): boolean => form.get(field) !== null && form.get(field) !== undefined;

/** Every value submitted under one name, trimmed, empties dropped. The checkbox
 *  group's counterpart to text(). */
const texts = (form: FormLike, field: string): string[] =>
  form
    .getAll(field)
    .map((raw) => (typeof raw === 'string' ? raw.trim() : ''))
    .filter((value) => value !== '');

/** Submitted form to values. Never throws, never validates: whatever came in is
 *  what the form is re-rendered with when validation then fails. */
export function readForm(form: FormLike): RegistrationValues {
  return {
    ...emptyValues,
    name: text(form, 'name'),
    city: text(form, 'city'),
    email: text(form, 'email').toLowerCase(),
    github: text(form, 'github'),
    os: text(form, 'os'),
    tool: texts(form, 'tool').join(toolSeparator),
    terminal: text(form, 'terminal'),
    ssh_key: text(form, 'ssh_key'),
    own_hosting: checked(form, 'own_hosting'),
    watch_only: checked(form, 'watch_only'),
    newsletter: checked(form, 'newsletter'),
  };
}

/** A watch-only registration carries no answers about a laptop. The form hides
 *  those fields rather than emptying them, so whatever was typed before the box
 *  was ticked is still in the submission — and a value the visitor can no longer
 *  see must not be stored or sent on (MM-72). Applied between readForm() and
 *  validate(), which also means a half-typed GitHub username left behind in a
 *  hidden field can never fail a submission.
 *
 *  Only what the visitor ticked themselves clears the fields. A registration
 *  turned into a watching one by the endpoint because the seats ran out keeps
 *  the answers it was given. */
export function dropLaptopAnswers(values: RegistrationValues): RegistrationValues {
  if (!values.watch_only) return values;
  return {
    ...values,
    github: '',
    os: '',
    tool: '',
    terminal: '',
    ssh_key: '',
    own_hosting: false,
  };
}

/** Field-level errors, empty when everything passes.
 *
 *  Email is the only answer a registration cannot do without: it is where the
 *  confirmation goes and the key the duplicate check uses. Everything else is
 *  optional (MM-73) and is looked at only when it carries a value — an empty
 *  field is an answer the visitor chose not to give, a filled one still has to
 *  be one of the answers the form offers. */
export function validate(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = {};

  if (!emailPattern.test(values.email) || values.email.length > limits.email) {
    errors.email = messages.email;
  }

  if (values.name.length > limits.name) errors.name = messages.nameLong;

  // City is asked of everyone, watchers included, so it is not touched by
  // dropLaptopAnswers(); an empty one is simply an answer not given.
  if (values.city.length > limits.city) errors.city = messages.cityLong;

  if (values.github !== '' && !githubPattern.test(values.github)) {
    errors.github = messages.github;
  }

  if (values.os !== '' && !osOptions.some((option) => option.value === values.os)) {
    errors.os = messages.os;
  }

  // Nothing that was not on offer: a submission carrying a value the form never
  // rendered is not a mistake to explain, it is a made-up one to refuse.
  const tools = splitTools(values.tool);
  if (
    tools.length > 0 &&
    !tools.every((tool) => toolOptions.some((option) => option.value === tool))
  ) {
    errors.tool = messages.tool;
  }

  if (
    values.terminal !== '' &&
    !terminalOptions.some((option) => option.value === values.terminal)
  ) {
    errors.terminal = messages.terminal;
  }

  if (values.ssh_key !== '') {
    if (values.ssh_key.length > limits.ssh_key) errors.ssh_key = messages.sshKeyLong;
    else if (!sshKeyPrefixes.some((prefix) => values.ssh_key.startsWith(prefix))) {
      errors.ssh_key = messages.sshKey;
    }
  }

  return errors;
}

export const hasErrors = (errors: RegistrationErrors): boolean =>
  Object.keys(errors).length > 0;
