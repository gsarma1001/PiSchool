# Daily Challenge question system

## Architecture

The challenge UI uses server actions from
`src/app/daily-challenge/actions.ts`. Those actions call the typed service
defined in `src/app/daily-challenge/question-service/service.ts`; page and
client components do not import the question bank.

`QuestionService` provides:

- `listCourses()` and `listTopics(courseId)` for the curriculum selector.
- `getCoverage()` for readiness derived from actual complete question levels.
- `createDailyChallenge(date, timeZone, courseId, topicId)` for a public,
  level-ordered five-question snapshot.
- `checkAnswer(locator, answer)`, `getHint(locator)`, and `getSolution(locator)`
  for deterministic server-side grading and help.

`createQuestionService(repository)` accepts the `QuestionRepository`
interface. The current `FileQuestionRepository` adapts the server-only
TypeScript question bank. A database adapter can implement the same contract
later; no database or database package is used now.

The service selects one question at each difficulty from eligible bank and
template questions. The seed includes the local challenge date, timezone,
course, topic, and generation version. Question candidates are identified by
stable ID and version, preventing two versions of one item from being confused.
Incomplete topics are unavailable rather than filled from another topic.

## Question record and lifecycle

`BankQuestion` is the authoring record in `question-bank.ts` and
`extended-question-bank.ts`. It includes a stable `id`, immutable `version`,
course/topic IDs, difficulty, prompt, answer rule and canonical answer, hint,
numbered solution steps, optional instructions, publication status, and review
status.

The `question()` factory starts new records as `draft` and `unreviewed`.
Publication and review are assigned separately when the authored records are
assembled into the reviewed question set. The file adapter independently
validates published records (including the canonical answer, required text,
course/topic mapping, and solution structure) and throws on invalid published
content. Passing that validation does not change a record's review status;
only published, mathematically reviewed records are served. Current content
still needs owner/educator review before production use.

Do not edit a published question in place. Add a new version while retaining
the old version in the repository so active snapshots and their answer/help
operations remain resolvable. Keep IDs stable for a continuing question and
increment its version when its content or answer changes. Use a new ID for a
mathematically different question.

The file question bank and answer rules are server-only. Public snapshots
contain the prompt, instructions, identifiers, versions, and safe generation
parameters; they do not contain canonical answers, hints, or solutions.
Generated question IDs use a digest rather than embedding parameter values.
Answer checking and help requests resolve the question version on the server.

## Templates

Parameterized templates live in
`src/app/daily-challenge/question-service/templates.ts`. The current templates
are:

- `integer-arithmetic`, with topic-specific structures for whole-number
  arithmetic, addition, subtraction, multiplication, division, and order of
  operations.
- `fraction-add-subtract`, with like/unlike denominators, mixed numbers,
  contextual addition, and multistep fraction reasoning.
- `linear-equation-one-variable`, with one-step through multistep equations,
  including word problems and variables on both sides.

Each template declares a stable ID, version, supported topics, and explicit
publication/review status. It derives prompt, exact integer/rational answer,
hint, solution, and parameters together from a deterministic seed. Avoid
division by zero, ambiguous equations, and unsupported answer formats. When a
template changes, increment its version and retain the prior version's
generation behavior until no saved snapshots depend on it.

To add a template:

1. Define its supported course/topic IDs and difficulty-specific mathematical
   structures.
2. Derive all problem fields from a single constrained parameter set; use exact
   arithmetic where possible.
3. Give it a new version when changing generation behavior.
4. Add tests for determinism, parameter boundaries, computed answers, hints,
   solutions, and all five levels.
5. Add it to the template registry only after the generated content is
   mathematically checked. Do not generate content with an AI model at request
   time.

## Daily snapshots and student progress

The service returns exactly five public questions in difficulty order. It
selects deterministically from the eligible published bank records and
templates, and rejects duplicate questions or incomplete levels. The browser
saves a versioned challenge snapshot separately from the student's attempts
under the localStorage key `pi-school.daily-challenge`. A started snapshot is
reused after refresh; it is not regenerated from a changed bank. Existing
version-2 attempt records are migrated and their saved question IDs are used
to hydrate a snapshot once.

The template registry retains generators by template version. If a generator
is revised, keep its old generator registered, add the new generator as a
separate version, and select the new version only for new challenges. This
lets answer and help requests for an older saved template snapshot resolve
against its original generation logic.

Attempts, hint/solution views, results, completion dates, and streak history
are device-only. Local calendar dates and the browser's IANA timezone are
captured with the snapshot. There are no accounts, server-side student
records, cross-device sync, or database persistence.

## Tests

Run the focused checks with:

```powershell
npm run test:daily-challenge
npm run typecheck
npm run lint
npm run build
```

The focused suite covers curriculum readiness, deterministic five-level
selection, snapshot restoration, retention of old bank versions, parameterized
integer/fraction/equation generation, answer equivalence, saved-progress
recovery, and local-calendar streak boundaries.
