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

export const toolOptions: Option[] = [
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'codex', label: 'Codex' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'other', label: 'Other' },
];

export type TextField = 'name' | 'email' | 'github' | 'os' | 'tool' | 'ssh_key';
export type CheckboxField = 'own_hosting' | 'watch_only' | 'newsletter';
export type FieldName = TextField | CheckboxField;

export interface RegistrationValues {
  name: string;
  email: string;
  github: string;
  os: string;
  tool: string;
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
  ssh_key: '',
  own_hosting: false,
  watch_only: false,
  newsletter: false,
};

/** The pattern the GitHub username field advertises to the browser and the
 *  validator applies on the server. */
export const githubPattern = '[A-Za-z0-9-]{1,39}';

/** An SSH public key, when given, has to start with one of these. */
export const sshKeyPrefixes = ['ssh-ed25519 ', 'ssh-rsa '];
