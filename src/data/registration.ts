/** The registration form's shape. One source for the form markup, the
 *  validator and the D1 columns: every key here is a column name in
 *  migrations/0001_registrations.sql. No Astro imports, so the validator that
 *  reads this file stays unit-testable with plain node. */

export interface Option {
  value: string;
  label: string;
}

export const osOptions: Option[] = [
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
  { value: 'linux', label: 'Linux' },
];

/** More than one may be ticked: a participant who has Claude Code and Cursor
 *  installed answers with both. Every ticked value ends up in the one `tool`
 *  column, joined by toolSeparator. */
export const toolOptions: Option[] = [
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'codex', label: 'Codex' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'other', label: 'Other' },
];

/** What separates the ticked tools inside the `tool` column. Declared once so
 *  the form, the validator and anything reading the column agree on it; none of
 *  the option values contains it. */
export const toolSeparator = ',';

export const splitTools = (value: string): string[] =>
  value === '' ? [] : value.split(toolSeparator);

/** How much of the terminal a participant brings. The workshop runs in one, and
 *  the answer decides how much of the first half hour goes on it.
 *
 *  draft: Mladen to approve — the three labels below are his wording, worked up
 *  into full lines. */
export const terminalOptions: Option[] = [
  { value: 'beginner', label: 'Beginner: I have pasted a command or two' },
  {
    value: 'comfortable',
    label: 'Comfortable: npm, npx and git from the terminal are routine',
  },
  { value: 'fluent', label: 'Fluent: the terminal is where I work' },
  { value: 'expert', label: 'Expert: I have full control of the machine' },
];

export type TextField =
  | 'name'
  | 'email'
  | 'github'
  | 'os'
  | 'tool'
  | 'terminal'
  | 'ssh_key';
export type CheckboxField = 'own_hosting' | 'watch_only' | 'newsletter';
export type FieldName = TextField | CheckboxField;

export interface RegistrationValues {
  name: string;
  email: string;
  github: string;
  os: string;
  /** Every ticked tool, joined by toolSeparator. Empty when none is ticked. */
  tool: string;
  terminal: string;
  ssh_key: string;
  own_hosting: boolean;
  watch_only: boolean;
  newsletter: boolean;
}

/** Field-level messages, plus `form` for anything that is not one field's fault
 *  (the anti-spam check, a database that is not there). */
export type RegistrationErrors = Partial<Record<FieldName | 'form', string>>;

export const emptyValues: RegistrationValues = {
  name: '',
  email: '',
  github: '',
  os: '',
  tool: '',
  terminal: '',
  ssh_key: '',
  own_hosting: false,
  watch_only: false,
  newsletter: false,
};

/** The pattern the GitHub username field advertises to the browser and the
 *  validator applies on the server. */
export const githubPattern = '[A-Za-z0-9\\-]{1,39}';

/** An SSH public key, when given, has to start with one of these. */
export const sshKeyPrefixes = ['ssh-ed25519 ', 'ssh-rsa '];
