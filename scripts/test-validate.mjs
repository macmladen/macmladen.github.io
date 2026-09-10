/** Unit checks for the registration validator and the registration window.
 *  Run with `node scripts/test-validate.mjs` (node strips the TypeScript types
 *  on import; node 22.6+ needs --experimental-strip-types, node 23+ does not).
 *  Exits non-zero on the first failure so it can gate a build later. */
import {
  dropLaptopAnswers,
  readForm,
  validate,
  hasErrors,
  messages,
  limits,
} from '../src/lib/validate.ts';
import { isBeforeStart, isRegistrationOpen, workshop } from '../src/data/workshop.ts';

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

/** The shape the endpoint hands to readForm: a real FormData. An array value is
 *  appended once per entry, which is how the AI tool checkboxes arrive: several
 *  values under the one name `tool`. */
const form = (fields) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const one of Array.isArray(value) ? value : [value]) data.append(key, one);
  }
  return data;
};

const complete = {
  name: 'Ana Anić',
  email: 'Ana@Example.COM',
  github: 'ana-anic',
  os: 'linux',
  tool: ['claude-code', 'cursor'],
  terminal: 'comfortable',
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

  check('several ticked tools join with a comma', values.tool === 'claude-code,cursor', values.tool);
  check('the terminal answer comes through', values.terminal === 'comfortable', values.terminal);

  const oneTool = readForm(form({ ...complete, tool: 'codex' }));
  check('one ticked tool is that value alone', oneTool.tool === 'codex', oneTool.tool);

  const trimmed = readForm(form({ ...complete, name: '  Ana  ', github: ' ana ' }));
  check('trims name and github', trimmed.name === 'Ana' && trimmed.github === 'ana');

  const empty = readForm(form({}));
  check('missing fields become empty strings', empty.name === '' && empty.ssh_key === '');
  check('missing checkboxes become false', empty.own_hosting === false);
  check('no tool ticked is an empty string', empty.tool === '', empty.tool);
  check('no terminal answer is an empty string', empty.terminal === '', empty.terminal);
}

console.log('validate — accepts');
{
  check('a complete registration', !hasErrors(validate(readForm(form(complete)))));

  // Since MM-73 the minimum is one address: everything else helps Mladen
  // prepare and may be left alone.
  const minimal = readForm(form({ email: 'bo@example.com' }));
  check('the minimum: an email and nothing else', !hasErrors(validate(minimal)));

  for (const field of ['name', 'github', 'os', 'tool', 'terminal']) {
    const errors = validate(readForm(form({ ...complete, [field]: '' })));
    check(`${field} may be left empty`, !hasErrors(errors), Object.keys(errors).join(', '));
  }

  const noToolAtAll = validate(readForm(form({ ...complete, tool: [] })));
  check('no tool field at all', !hasErrors(noToolAtAll), Object.keys(noToolAtAll).join(', '));

  const everyTool = readForm(
    form({ ...complete, tool: ['claude-code', 'codex', 'cursor', 'other'] }),
  );
  check('all four tools ticked', !hasErrors(validate(everyTool)));

  for (const level of ['beginner', 'comfortable', 'fluent', 'expert']) {
    check(`terminal ${level}`, validate(readForm(form({ ...complete, terminal: level }))).terminal === undefined);
  }

  const rsa = readForm(form({ ...complete, ssh_key: 'ssh-rsa AAAAB3NzaC1yc2E bo@example.com' }));
  check('an ssh-rsa key', !hasErrors(validate(rsa)));
}

console.log('validate — rejects');
{
  const errorsFor = (overrides) => validate(readForm(form({ ...complete, ...overrides })));

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
  check('a GitHub name of 39 characters passes', errorsFor({ github: 'a'.repeat(39) }).github === undefined);

  check('an operating system that is not offered', errorsFor({ os: 'haiku' }).os === messages.os);
  check('a tool that is not offered', errorsFor({ tool: 'notepad' }).tool === messages.tool);
  check(
    'one made-up tool among two real ones',
    errorsFor({ tool: ['claude-code', 'notepad', 'cursor'] }).tool === messages.tool,
  );
  check(
    'a comma-separated string in one field is not a way in',
    errorsFor({ tool: 'claude-code,notepad' }).tool === messages.tool,
  );

  check(
    'a terminal level that is not offered',
    errorsFor({ terminal: 'wizard' }).terminal === messages.terminal,
  );

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

  const several = errorsFor({ email: 'nope', github: 'no_pe', os: 'haiku' });
  check(
    'reports every bad field at once',
    Object.keys(several).length === 3 && several.email && several.github && several.os,
    Object.keys(several).join(', '),
  );
}

console.log('watch-only registrations');
{
  const watching = dropLaptopAnswers(readForm(form({ ...complete, watch_only: 'yes' })));
  check('github is dropped', watching.github === '', watching.github);
  check('the operating system is dropped', watching.os === '', watching.os);
  check('the AI tools are dropped', watching.tool === '', watching.tool);
  check('the terminal answer is dropped', watching.terminal === '', watching.terminal);
  check('the SSH key is dropped', watching.ssh_key === '', watching.ssh_key);
  check('own hosting is dropped', watching.own_hosting === false);
  check('the name is kept', watching.name === 'Ana Anić', watching.name);
  check('the email is kept', watching.email === 'ana@example.com', watching.email);
  check('the newsletter answer is kept', watching.newsletter === true);
  check('watch_only stays ticked', watching.watch_only === true);
  check('a watch-only registration validates', !hasErrors(validate(watching)));

  const laptop = readForm(form(complete));
  check('a laptop registration is handed back untouched', dropLaptopAnswers(laptop) === laptop);

  // The form hides the laptop fields rather than emptying them, so a submission
  // can carry whatever was typed before the box was ticked. None of it may fail
  // the registration.
  const stale = dropLaptopAnswers(
    readForm(form({ ...complete, watch_only: 'yes', github: 'no_pe', ssh_key: 'not a key' })),
  );
  check('a stale value in a hidden field cannot fail it', !hasErrors(validate(stale)));
}

console.log('registration window');
{
  // Both instants are read from the data object rather than typed out again:
  // the close date moved once already (MM-62) and left this file behind.
  const onCloseDate = Date.parse(workshop.closeDate);
  const justAfterClose = Date.parse(workshop.closesAt) + 1000;
  check('open on the close date itself', isRegistrationOpen(onCloseDate) === true);
  check('closed the moment after', isRegistrationOpen(justAfterClose) === false);
  check('closed well after the workshop', isRegistrationOpen(Date.parse('2026-10-01')) === false);
  check('closeDate matches closesAt', workshop.closeDate === workshop.closesAt.slice(0, 10));
}

console.log('the workshop itself (MM-74)');
{
  // Same rule as above: every instant is derived from the data object, so
  // moving the cut-off moves the checks with it.
  const start = Date.parse(workshop.startsAt);
  check('before the cut-off', isBeforeStart(start - 1000) === true);
  check('not at the cut-off itself', isBeforeStart(start) === false);
  check('not a minute later', isBeforeStart(start + 60_000) === false);
  check('not the day after', isBeforeStart(Date.parse('2026-09-19')) === false);

  // The ten-minute grace Mladen asked for: the cut-off is the scheduled start
  // plus ten minutes, and it is still inside the session's own hour.
  check(
    'the cut-off is ten minutes past the scheduled start',
    start - Date.parse(workshop.start) === 10 * 60_000,
    `${start - Date.parse(workshop.start)} ms`,
  );
  check('the cut-off is before the session ends', start < Date.parse(workshop.end));

  // Registration is shut by the time the room opens, whichever cut-off is
  // reached first.
  check('registration is not open at the cut-off', isRegistrationOpen(start) === false);
  check(
    'registration is not open during the session',
    isRegistrationOpen(start + 60_000) === false,
  );
  check('the close date is before the cut-off', Date.parse(workshop.closesAt) < start);
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
