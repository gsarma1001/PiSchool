# The Pi School

A responsive Next.js tutoring website with a shared site shell, tutoring
information, approved student testimonials, a server-side tutoring inquiry
form, a local Daily Math Challenge pilot, a curated math events directory,
and an initial Math News page.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer

## Run locally

From the repository root:

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Stop the development
server with `Ctrl+C`.

The site pages work without email configuration. The contact form will
clearly report that an inquiry was **not sent** until Resend is configured.

### Configure inquiry email locally

1. Create a Resend account and API key.
2. Verify a sender domain you control in Resend and complete its DNS setup.
   Use an address on that verified domain as the sender; do not use the
   recipient's Gmail address as the sender.
3. Copy the example environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Edit `.env.local` and set:
   - `RESEND_API_KEY` to the Resend API key.
   - `INQUIRY_FROM_EMAIL` to an address on the verified sender domain.
   - `INQUIRY_TO_EMAIL` to `thepischooltutoring@gmail.com`.
5. Restart `npm run dev` after changing environment variables.
6. Submit a clearly identified test inquiry from `/contact`, confirm it
   arrives in the intended inbox, and use Reply to verify it targets the
   address entered in the form.

These are server-only variables; do not prefix them with `NEXT_PUBLIC_` or
commit `.env.local`. The checked-in `.env.example` contains placeholders.

### Production configuration

Before deploying, add the same three variables to the hosting provider's
server-side environment settings. Verify the sender domain with Resend and
configure the host to trust and sanitize its forwarded client-IP headers.
Rebuild/redeploy after changing production variables. Keep the Resend key
secret and never expose it to browser code.

The inquiry handler validates fields on the server, includes a hidden
honeypot, and applies a small in-process rate limit. In-process limits are
best-effort and do not coordinate across serverless instances; configure a
hosting-level rate limit before public production use.

The form reports success only after Resend accepts the request. Provider
acceptance does not itself guarantee final inbox delivery, so verify delivery
and Reply-To behavior in the recipient inbox during the launch test.

## Final validation and hardening status

The site has been checked end-to-end on the local build: the main pages respond
successfully, the app's internal links resolve without broken routes, and the
daily-challenge and event validation suites pass. The production build also
completes successfully. The remaining live-delivery dependency is the email
provider configuration (Resend sender verification and recipient inbox
validation), not the app logic itself.

## Daily Math Challenge

Open `/daily-challenge` and choose a US grade/level followed by a topic.
The shared curriculum currently defines Kindergarten, Grades 1–12, and
college/advanced math labels, along with 14 course IDs and 173 topics. The
Daily Challenge has 19 elementary topics across Kindergarten–Grade 5, with
five generated, progressively difficult multiple-choice questions for each
topic. It also retains existing middle-school, high-school, college, and
advanced math topics. Grade level remains distinct from course and topic.
Elementary challenge content is a starter set, not complete grade coverage,
and still needs independent educator review before production use.

The 19 currently playable elementary topics are:

- Kindergarten: counting collections, comparing quantities, patterns, shapes.
- Grade 1: addition/subtraction within 20, tens and ones, time and shapes.
- Grade 2: place value to 1,000, equal groups, money and simple data.
- Grade 3: multiplication/division, fractions, area and perimeter.
- Grade 4: multidigit arithmetic, fractions, angles and measurement.
- Grade 5: decimal/fraction operations, volume, expressions and coordinate
  grids.

More requested strands remain gaps; see
[docs/CURRICULUM_SCOPE.md](docs/CURRICULUM_SCOPE.md). The shared grade
configuration lives in `src/lib/curriculum.ts`; add a grade/topic there and in
the challenge catalog, then add reviewed question-bank or versioned template
content and tests before marking it ready.

Arithmetic and Number Sense is fully banked for this pass: all 10 requested
topics have five authored problems each, plus the retained whole-number
mixed-review bank. Other course banks remain starter coverage, not complete
course curricula. Shared topic/question sets, such as trigonometric ratios
under Trigonometry and Precalculus, are not duplicated.

Daily questions are selected deterministically for the local calendar date,
grade/course level, and topic. Answer checking and answer keys stay server-side;
progress and streaks are saved in versioned local storage on the current
device only. This is not an adaptive system, account, or cross-device sync.
Review question content before any production publication.
See [docs/DAILY_CHALLENGE_QUESTION_SYSTEM.md](docs/DAILY_CHALLENGE_QUESTION_SYSTEM.md)
for the question-service interface, repository contract, content lifecycle,
templates, and content authoring rules.

The curated event directory preserves organizer eligibility language. US
grade filters match only explicit source-backed grade mappings. Math Kangaroo
USA's verified 2027 rules include US Grades K–12; other events appear for
elementary grades only when their own official rules and mappings support it.

The Math Events directory groups opportunities by purpose and presents
mobile-friendly cards. Event families are stored separately from annual
editions; organizers, entry pathways, locations, and eligibility remain
source-backed fields. Unconfirmed eligibility is shown separately and is never
treated as a confirmed match. AMC host/organizer purchasing deadlines are not
displayed as student deadlines. Run `npm run report:events` to see missing
edition information and records whose next editorial review date has passed.
See [docs/EVENT_DIRECTORY_EDITORIAL.md](docs/EVENT_DIRECTORY_EDITORIAL.md) for
the editorial workflow, source registry, verified listings, and research
backlog. This is a curated starting collection, not a complete worldwide
calendar.

## Checks

```powershell
npm run lint
npm run typecheck
npm run test:daily-challenge
npm run test:events
npm run build
```

To serve the production build locally after building:

```powershell
npm run start
```

## Stack

| Package | Version |
|---|---|
| Next.js | 16.4.3 |
| React | 19.3.0 |
| React DOM | 19.3.0 |
| `@tailwindcss/turbopack` | 4.3.3 |
| Tailwind CSS | 4.3.3 |
| TypeScript | 5.9.3 |
| ESLint | 10.13.0 |
| `eslint-config-next` | 16.4.3 |
| `@types/node` | 20.19.43 |
| `@types/react` | 19.3.0 |
| `@types/react-dom` | 19.3.0 |

Exact resolved dependency versions are recorded in `package-lock.json`.

## Project documents

- `AGENTS.md` — permanent project rules.
- `docs/PROJECT_PLAN.md` — source plan and phase status.
- `docs/PROJECT_BRIEF.md` — initial goals and constraints.
- `docs/IMPLEMENTATION_PLAN.md` — staged implementation and exit criteria.
- `docs/FEATURE_ROADMAP.md` — feature requirements and verified status.
- `docs/CONTENT_MIGRATION.md` — content capture and reconciliation tracker.
- `docs/CURRICULUM_SCOPE.md` — future curriculum boundaries and open
  questions.

## Scope and deployment

This repository is for local development; it does not modify the live
website or domain. The inquiry form is not production-ready until email
credentials and a verified sender are configured, rate limiting is provided
at the hosting edge, and an end-to-end inbox/Reply-To test is completed.
Booking, student accounts, a database, and AI are not part of this inquiry
flow.
