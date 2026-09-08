/** Unit checks for the registration validator and the registration window.
 *  Run with `node scripts/test-validate.mjs` (node strips the TypeScript types
 *  on import; node 22.6+ needs --experimental-strip-types, node 23+ does not).
 *  Exits non-zero on the first failure so it can gate a build later. */
import { readForm, validate, hasErrors, messages, limits } from '../src/lib/validate.ts';
import { isRegistrationOpen, workshop } from '../src/data/workshop.ts';

let passed = 0;
const failures = [];

const check = (name, condition, detail = '') => {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail === '' ? '' : ` — ${detail}`}`);
    console.log(`  FAIL ${name}${detail === '' ? '' : ` — ${detail}`}`);
  }
};

/** The shape the endpoint hands to readForm: a real FormData. */
const form = (fields) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
};

const complete = {
  name: 'Ana Anić',
  email: 'Ana@Example.COM',
  github: 'ana-anic',
  os: 'linux',
  tool: 'claude-code',
  ssh_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI ana@example.com',
  own_hosting: 'yes',
  newsletter: 'yes',
};

console.log('readForm');
{
  const values = readForm(form(complete));
  check('trims and lowercases the email', values.email === 'ana@example.com', values.email);
  check('keeps the name as typed', values.name === 'Ana Anić', values.name);
  check('ticked checkbox becomes true', values.own_hosting === true);
  check('absent checkbox becomes false', values.watch_only === false);
  check('newsletter is carried through', values.newsletter === true);

  const trimmed = readForm(form({ ...complete, name: '  Ana  ', github: ' ana ' }));
  check('trims name and github', trimmed.name === 'Ana' && trimmed.github === 'ana');

  const empty = readForm(form({}));
  check('missing fields become empty strings', empty.name === '' && empty.ssh_key === '');
  check('missing checkboxes become false', empty.own_hosting === false);
}

console.log('validate — accepts');
{
  check('a complete registration', !hasErrors(validate(readForm(form(complete)))));

  const minimal = readForm(
    form({ name: 'Bo', email: 'bo@example.com', github: 'bo', os: 'macos', tool: 'other' }),
  );
  check('the minimum: no SSH key, no checkboxes', !hasErrors(validate(minimal)));

  const rsa = readForm(form({ ...complete, ssh_key: 'ssh-rsa AAAAB3NzaC1yc2E bo@example.com' }));
  check('an ssh-rsa key', !hasErrors(validate(rsa)));
}

console.log('validate — rejects');
{
  const errorsFor = (overrides) => validate(readForm(form({ ...complete, ...overrides })));

  check('a missing name', errorsFor({ name: '' }).name === messages.name);
  check('a whitespace-only name', errorsFor({ name: '   ' }).name === messages.name);
  check(
    'a name over the limit',
    errorsFor({ name: 'a'.repeat(limits.name + 1) }).name === messages.nameLong,
  );

  check('an address with no @', errorsFor({ email: 'ana.example.com' }).email === messages.email);
  check('an address with no domain dot', errorsFor({ email: 'ana@example' }).email === messages.email);
  check('an address with a space', errorsFor({ email: 'a n@example.com' }).email === messages.email);
  check('a missing address', errorsFor({ email: '' }).email === messages.email);

  check('a GitHub name with an underscore', errorsFor({ github: 'ana_anic' }).github === messages.github);
  check('a GitHub name with a slash', errorsFor({ github: 'macmladen/repo' }).github === messages.github);
  check('a GitHub name of 40 characters', errorsFor({ github: 'a'.repeat(40) }).github === messages.github);
  check('an empty GitHub name', errorsFor({ github: '' }).github === messages.github);
  check('a GitHub name of 39 characters passes', errorsFor({ github: 'a'.repeat(39) }).github === undefined);

  check('an operating system that is not offered', errorsFor({ os: 'haiku' }).os === messages.os);
  check('no operating system', errorsFor({ os: '' }).os === messages.os);
  check('a tool that is not offered', errorsFor({ tool: 'notepad' }).tool === messages.tool);
  check('no tool', errorsFor({ tool: '' }).tool === messages.tool);

  check(
    'an SSH key with the wrong prefix',
    errorsFor({ ssh_key: 'ssh-dss AAAA' }).ssh_key === messages.sshKey,
  );
  check(
    'an SSH key that is only a comment',
    errorsFor({ ssh_key: 'my key' }).ssh_key === messages.sshKey,
  );
  check(
    'ssh-ed25519 without the separating space',
    errorsFor({ ssh_key: 'ssh-ed25519AAAA' }).ssh_key === messages.sshKey,
  );
  check(
    'an SSH key over the limit',
    errorsFor({ ssh_key: `ssh-rsa ${'A'.repeat(limits.ssh_key)}` }).ssh_key === messages.sshKeyLong,
  );

  const several = errorsFor({ name: '', email: 'nope', github: 'no_pe' });
  check(
    'reports every bad field at once',
    Object.keys(several).length === 3 && several.name && several.email && several.github,
    Object.keys(several).join(', '),
  );
}

console.log('registration window');
{
  const dayBefore = Date.parse('2026-09-15T09:00:00+02:00');
  const dayAfter = Date.parse('2026-09-16T00:00:01+02:00');
  check('open on the close date itself', isRegistrationOpen(dayBefore) === true);
  check('closed the moment after', isRegistrationOpen(dayAfter) === false);
  check('closed well after the workshop', isRegistrationOpen(Date.parse('2026-10-01')) === false);
  check('closeDate matches closesAt', workshop.closeDate === workshop.closesAt.slice(0, 10));
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
