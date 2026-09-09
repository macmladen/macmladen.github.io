/** Unit checks for the contact validator and the topic list. Run with
 *  `node scripts/test-validate-contact.mjs`, or with the registration checks
 *  through `npm test` (node strips the TypeScript types on import; node 22.6+
 *  needs --experimental-strip-types, node 23+ does not). Exits non-zero on the
 *  first failure so it can gate a build later. */
import { readForm, validate, hasErrors, messages, limits } from '../src/lib/validate-contact.ts';
import { topicOptions, topicLabel, emptyValues } from '../src/data/contact.ts';

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
  topic: 'website',
  message: 'We are rebuilding our shop and would like to talk about the front end.',
};

console.log('topics');
{
  check('four topics are offered', topicOptions.length === 4, String(topicOptions.length));
  check(
    'the four keys are the documented ones',
    topicOptions.map((option) => option.value).join(',') === 'chat,website,training,speaking',
    topicOptions.map((option) => option.value).join(','),
  );
  check('every topic has a label', topicOptions.every((option) => option.label.length > 0));
  check('topicLabel resolves a key', topicLabel('speaking') === 'We are calling you as a speaker');
  check('topicLabel falls back to the raw value', topicLabel('retired-key') === 'retired-key');
  check(
    'emptyValues has exactly the four fields',
    Object.keys(emptyValues).join(',') === 'name,email,topic,message',
    Object.keys(emptyValues).join(','),
  );
}

console.log('readForm');
{
  const values = readForm(form(complete));
  check('trims and lowercases the email', values.email === 'ana@example.com', values.email);
  check('keeps the name as typed', values.name === 'Ana Anić', values.name);
  check('carries the topic key through', values.topic === 'website', values.topic);

  const trimmed = readForm(form({ ...complete, name: '  Ana  ', message: `  ${complete.message}  ` }));
  check('trims the name', trimmed.name === 'Ana', trimmed.name);
  check('trims the message', trimmed.message === complete.message);

  const empty = readForm(form({}));
  check(
    'missing fields become empty strings',
    empty.name === '' && empty.email === '' && empty.topic === '' && empty.message === '',
  );

  const odd = readForm(form({ name: new Blob(['x']) }));
  check('a non-string field becomes an empty string', odd.name === '', odd.name);
}

console.log('validate — accepts');
{
  check('a complete message', !hasErrors(validate(readForm(form(complete)))));

  for (const option of topicOptions) {
    check(
      `topic "${option.value}"`,
      !hasErrors(validate(readForm(form({ ...complete, topic: option.value })))),
    );
  }

  const shortest = readForm(form({ ...complete, message: 'a'.repeat(limits.messageMin) }));
  check('a message of exactly the minimum length', !hasErrors(validate(shortest)));

  const longest = readForm(form({ ...complete, message: 'a'.repeat(limits.messageMax) }));
  check('a message of exactly the maximum length', !hasErrors(validate(longest)));

  const longestName = readForm(form({ ...complete, name: 'a'.repeat(limits.name) }));
  check('a name of exactly the limit', !hasErrors(validate(longestName)));
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
  check(
    'an address over the length limit',
    errorsFor({ email: `${'a'.repeat(limits.email)}@example.com` }).email === messages.email,
  );

  check('a topic that is not offered', errorsFor({ topic: 'partnership' }).topic === messages.topic);
  check('no topic', errorsFor({ topic: '' }).topic === messages.topic);
  check(
    'a topic given as a label instead of a key',
    errorsFor({ topic: 'We need a website' }).topic === messages.topic,
  );

  check('an empty message', errorsFor({ message: '' }).message === messages.message);
  check(
    'a message one character under the minimum',
    errorsFor({ message: 'a'.repeat(limits.messageMin - 1) }).message === messages.message,
  );
  check(
    'a message that is only whitespace around a short word',
    errorsFor({ message: '   hi   ' }).message === messages.message,
  );
  check(
    'a message one character over the maximum',
    errorsFor({ message: 'a'.repeat(limits.messageMax + 1) }).message === messages.messageLong,
  );

  const several = errorsFor({ name: '', email: 'nope', topic: 'nope', message: 'no' });
  check(
    'reports every bad field at once',
    Object.keys(several).length === 4 &&
      several.name &&
      several.email &&
      several.topic &&
      several.message,
    Object.keys(several).join(', '),
  );

  check('an empty form fails on all four', Object.keys(validate(readForm(form({})))).length === 4);
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
