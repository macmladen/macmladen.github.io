/** Unit checks for the registration confirmation email (MM-70). Run with
 *  `node scripts/test-confirmation.mjs`. No network: the payload builder is
 *  pure, and this reads it line by line. Exits non-zero on the first failure. */
import { confirmationPayload, confirmationText, subject } from '../src/lib/confirmation.ts';
import { FROM } from '../src/lib/mailersend.ts';
import { emptyValues } from '../src/data/registration.ts';
import { workshop } from '../src/data/workshop.ts';
import { person } from '../src/data/person.ts';

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

const registrant = { ...emptyValues, name: 'Ana Anić', email: 'ana@example.com' };
const payload = confirmationPayload(registrant);

console.log('addresses');
{
  check('from is the no-reply sender on the verified domain', payload.from.email === 'no-reply@macmladen.com', payload.from.email);
  check('to is the registrant', payload.to.length === 1 && payload.to[0].email === 'ana@example.com');
  check('to carries the name when there is one', payload.to[0].name === 'Ana Anić');
  check('reply_to is Mladen', payload.reply_to.email === person.email, payload.reply_to.email);
  check('reply_to is not the no-reply address', payload.reply_to.email !== FROM.email);

  const anonymous = confirmationPayload({ ...emptyValues, email: 'bo@example.com' });
  check('to carries no name when none was given', anonymous.to[0].name === undefined);
}

console.log('subject');
{
  check(
    'the approved subject, unchanged',
    payload.subject === 'You are registered: WordPress, Docker and AI agents, WordCamp Belgrade',
    payload.subject,
  );
  check('the module and the payload agree', payload.subject === subject);
}

console.log('body');
{
  const text = payload.text;
  check('greets the registrant by name', text.startsWith('Hi Ana Anić,\n'), text.slice(0, 20));
  check('says they are on the list', text.includes('You are on the list for the workshop on '));
  check('carries the day and the hours', text.includes('Friday 18 September, 12:20–13:40'));
  check('carries the venue and the street', text.includes('Dom Omladine Beograda, Makedonska 22'));
  check('names what to install', text.includes('install Docker, DDEV, git and your AI tool, and have a GitHub account'));
  check('links the repository from the data file', text.includes(workshop.repoUrl));
  check('names the day the guide lands', text.includes(workshop.prepDeadline));
  check('says watching is fine', text.includes('Watching without a laptop is fine too.'));
  check('signs off', text.endsWith('See you there,\nMladen'));
  check('is plain text, no markup', !/[<>]/.test(text));

  check('greets someone who gave no name', confirmationText('').startsWith('Hi there,\n'));
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
