**You can rebuild the site without its original code.** The key is to preserve its content first, launch the redesigned tutoring site, and then add the learning features in manageable stages.

I reviewed your homepage, team page, and FAQ page. Your domain currently displays an embedded Azure-hosted website, which explains why simply downloading the homepage would miss much of the content.

I’m assuming you mean **Visual Studio Code with an AI coding assistant**, such as GitHub Copilot or Codex. The prompts below can be used sequentially in its coding chat.

## Implementation status — 2026-10-29

The current implementation scope is limited to the requested repository structure: root `AGENTS.md`, this plan, and `docs/CONTENT_MIGRATION.md`. The project rules and content-preservation tracker are in place. No application, homepage, or additional project documents have been created, and no existing website content has been extracted.

| Prompt or phase | Status | Notes |
|---|---|---|
| Prompt 1 — Establish the project and working rules | Partially complete | Permanent rules and the content migration tracker are recorded. The application foundation, minimal homepage, and other Prompt 1 deliverables are not implemented in the current file scope. |
| Phase 0 — Preserve | Not started | Content capture and reconciliation remain outstanding; see `docs/CONTENT_MIGRATION.md`. |
| Phase 1 — Redesign | Not started | No website has been built. |
| Phase 2 — Math hub | Not started | Future phase; not implemented. |
| Phase 3 — Daily Quick Mind pilot | Not started | Future phase; not implemented. |
| Phase 4 — Expand learning | Not started | Future phase; not implemented. |
| Phase 5 — Launch and operate | Not started | Future phase; production website and domain have not been changed. |

## 1. What to preserve before rebuilding

Your current site has **six distinct testimonials**. The scrolling display repeats them, so the migration should remove display duplicates while preserving each original statement.

| Client attribution | Subject or label |
|---|---|
| Saket L | AP Calculus AB |
| Ishan D | Algebra 2 |
| Tanisha R | Calculus 1 / Math 151 |
| Ashwin M | Algebra 2 |
| Vidhu | Algebra 1 |
| Bhai | @Bhai |

Also preserve:

- Tutor biographies and photographs.
- Tutoring formats: individual, semi-private, and group.
- FAQ questions and expanded answers.
- Contact information, logo, images, and existing page URLs.
- Existing claims about results, marked for your review before republication.

**Public content is recoverable; private data requires a separate export.** Contact submissions, client email addresses, scheduling records, or unpublished feedback will not necessarily be available from the website. Check the existing hosting account, form provider, email inbox, or original developer for those records.

Some team information also needs updating: the current page labels Abhay and other tutors as NCHS juniors. Preserve the original content, then review which biographies and tutor availability should appear on the new site.

## 2. Recommended project phases

| Phase | Deliverable | Completion requirement |
|---|---|---|
| **0. Preserve** | Content archive and migration checklist | Every testimonial and existing page accounted for |
| **1. Redesign** | Modern tutoring website | Mobile-friendly pages, working contact form, accurate content |
| **2. Math hub** | Competitions, conferences, news, facts, and homework calendar | You can maintain content without editing code |
| **3. Daily Quick Mind pilot** | Five- or ten-question practice sessions | Reliable scoring for a small set of topics |
| **4. Expand learning** | Kindergarten through Calculus IV, AI feedback, optional progress history | Each published topic passes curriculum and grading checks |
| **5. Launch and operate** | Domain migration, monitoring, backups | Content reconciled, critical flows tested, rollback available |

**My recommended first public release is Phases 0–2.** You would have a polished, useful site to share while Daily Quick Mind is developed and tested separately.

Avoid launching hundreds of AI-generated topics at once. The interface can support the full curriculum from the beginning, while only reviewed topics become available.

## 3. Website structure and design

Suggested navigation:

**Home · Tutoring · Daily Quick Mind · Math Opportunities · Math Discoveries · Homework Help · About**

Keep **Get Tutoring Help** as the primary action.

| Page | Purpose |
|---|---|
| Home | Explain your approach, establish trust, and introduce practice and resources |
| Tutoring | Subjects, learning levels, session formats, and how to get started |
| Daily Quick Mind | Choose level → topic → subtopic → 5 or 10 questions |
| Math Opportunities | Competitions, Olympiads, conferences, and registration deadlines |
| Math Discoveries | Research explainers, interesting news, and mathematical facts |
| Homework Help | Weekly schedule, eligibility, session details, and registration |
| About / Team | Your story and current tutors |
| Testimonials | All preserved client feedback |
| FAQ / Contact | Practical information and inquiries |

For the visual direction, I suggest **warm white, deep navy, teal, and a restrained gold accent**, with generous spacing and subtle mathematical illustrations. Use readable typography and visible testimonials. Keep motion minimal so the site feels calm and academically focused.

A possible homepage headline:

> **Build understanding. Grow confidence. Discover the joy of math.**

Keep the existing non-math tutoring services visible if you still offer them; a stronger math focus does not require removing them.

## 4. Technical approach

My proposed stack is:

| Area | Proposed approach |
|---|---|
| Website | Next.js, TypeScript, Tailwind CSS |
| Database and admin authentication | Supabase |
| Hosting | Vercel, or Azure if you prefer to retain that environment |
| Mathematical display | Accessible equation rendering |
| Grading | Server-side mathematical checking, supported by AI explanations |
| Content maintenance | Protected admin dashboard |
| Initial student access | Guest practice; accounts added only when needed |

Next.js documents the App Router and TypeScript setup. Supabase supports database access policies, and Vercel provides preview deployments so you can review changes before replacing the live site. [Next.js](https://nextjs.org/docs/app/getting-started?utm_source=chatgpt.com)

**AI should explain answers, while a mathematical checker determines correctness wherever possible.** Equivalent fractions, factored expressions, units, rounding, and calculus answers need explicit rules. For example, indefinite integrals must allow equivalent answers that differ by a constant.

For “K–Calc 4,” make the curriculum configurable. Calculus IV is not a universal course definition; its scope should be confirmed against the curriculum you want to support.

## 5. Prompts to build the project

Paste these **one at a time**. Review the result of each phase before moving on.

### Prompt 1 — Establish the project and working rules

```text
Act as a senior full-stack engineer and education product designer.

We are rebuilding The Pi School website at https://thepischools.com/.
I own the website but do not have its source code.

Goals:
1. Preserve existing content, especially client testimonials.
2. Create a sleek, accessible, education-focused design.
3. Add math competitions, Olympiad information, and conferences.
4. Add math research, news, and interesting facts.
5. Add a weekly math homework-help calendar.
6. Add Daily Quick Mind practice, eventually covering Kindergarten
   through Calculus IV.

First inspect this workspace. Do not overwrite an existing project.

For a new project, use Next.js App Router, TypeScript, and Tailwind CSS.
Use current stable, compatible dependencies and document the versions.
Plan for Supabase and a protected admin dashboard.

Create:
- AGENTS.md with project rules
- docs/PROJECT_BRIEF.md
- docs/IMPLEMENTATION_PLAN.md
- docs/CONTENT_MIGRATION.md
- docs/CURRICULUM_SCOPE.md
- .env.example without secrets
- README.md with setup instructions

Rules:
- Implement one phase at a time.
- Preserve testimonial wording and displayed attribution exactly.
- Never invent reviews, prices, credentials, outcomes, or event dates.
- Clearly separate demonstration data from real published content.
- Keep secrets, answer keys, and grading logic server-side.
- Do not change the existing domain or production website.
- Report what works, what was verified, and what remains incomplete.

Implement the project foundation and a minimal working homepage.
Do not implement AI or student accounts yet.
```

### Prompt 2 — Archive and reconcile the existing content

```text
Implement Phase 0: content preservation.

Review https://thepischools.com/ and its linked pages.
The domain currently embeds an Azure-hosted site; inspect the embedded
content as well as the outer page.

Capture:
- Homepage content
- All unique testimonials
- Team biographies and photographs
- FAQ questions and expanded answers
- Contact details
- Logos and other relevant assets
- Existing page URLs and links

The reviewed homepage contains six distinct testimonial attributions:
Saket L, Ishan D, Tanisha R, Ashwin M, Vidhu, and Bhai.
Use this as a reconciliation check, not as a substitute for extraction.
Check for additional testimonials elsewhere.

Preserve original testimonial text exactly.
Deduplicate repeated carousel copies without merging distinct reviews.
Store source URL, capture date, original attribution, and subject label.

Create:
- content/original-site/
- content/testimonials.json
- content/team.json
- content/faqs.json
- docs/CONTENT_RECONCILIATION.md
- docs/URL_REDIRECT_MAP.md

Keep an immutable original archive separate from edited website copy.
Use stable IDs and an idempotent import process.

Flag outdated biographies, unverified outcome claims, inaccessible
assets, and content that could not be captured.
Do not claim that public extraction backs up private form submissions.

If browsing is unavailable, create an import template and clearly list
the missing source material. Do not fabricate replacement content.

Show a reconciliation report with source counts, imported counts,
duplicates removed, and unresolved items.
```

### Prompt 3 — Build the redesigned tutoring website

```text
Implement Phase 1 using the preserved content.

Design direction:
- Warm white background
- Deep navy headings
- Teal primary accent and restrained gold highlights
- Spacious layouts and readable typography
- Subtle mathematical illustrations
- Calm, education-focused presentation
- Minimal animation and reduced-motion support

Build:
- Home
- Tutoring
- About / Team
- Testimonials
- FAQ
- Contact

Homepage sections:
1. Hero with “Get Tutoring Help” and “Try Daily Quick Mind”
2. Tutoring subjects and learning levels
3. Individual, semi-private, and group formats
4. Explanation of the teaching approach
5. Preserved client testimonials
6. Previews of opportunities, discoveries, and homework help
7. Final contact action

Keep testimonials readable without requiring an animated carousel.
Do not publish outdated biographies or unverified claims as current.
Do not invent prices or tutor availability.

Implement a working contact form with server-side validation, spam
protection, and clear success/failure states.
If an external delivery service is not configured, explicitly show the
configuration requirement; never display a false success message.

Ensure responsive layouts, keyboard access, labeled inputs, useful
page titles, and working navigation.
Verify the production build and the primary contact journey.
```

### Prompt 4 — Add the math hub and editorial dashboard

```text
Implement Phase 2: Math Opportunities and Math Discoveries.

Create a protected administrator dashboard with draft, preview,
publish, edit, archive, and export functions.

Math Opportunities:
- Competition, Olympiad, conference, workshop categories
- Grade/age eligibility
- Location and online/in-person format
- Event start/end dates
- Separate registration deadline
- Organizer and official source URL
- Timezone
- Last verified date
- Registration status: open, closed, unknown
- Audience: student, parent, educator, researcher
- Search and filters
- Automatic past-event archiving

Do not infer that registration is open merely because an event is future.
Do not invent upcoming dates or deadlines.
Publish real events only after verifying their official sources.

Math Discoveries:
- Research explainers
- Math news
- Interesting mathematical facts
- Learning-level tags
- Original source link, publication date, and last-reviewed date
- Clear distinction between research, news, and evergreen facts

Write original summaries and link to source material.
Do not republish full third-party articles.

Begin with manual editorial publishing.
Any later automated imports must enter a review queue.

Implement database migrations, access controls, and repeatable seed
imports. Public visitors may read published content; only authorized
admins may change it. Verify both allowed and denied access.
```

### Prompt 5 — Add the weekly homework-help calendar

```text
Add the Math Homework Help feature.

Provide:
- Desktop weekly calendar
- Mobile agenda/list view
- Week navigation
- Subject and learning-level filters
- Session details
- Tutor, format, capacity, and registration status
- Clearly displayed timezone, defaulting to America/Los_Angeles
- Add-to-calendar download

Admins can create recurring sessions and edit or cancel individual
occurrences. Handle daylight-saving changes correctly.

For the first release, sessions may link to a configured external
registration page. If none exists, provide a clearly labeled inquiry
option rather than pretending to reserve a place.

If implementing native booking:
- Enforce capacity in the database
- Prevent duplicate registrations and concurrent overbooking
- Support cancellation and confirmation
- Keep student identities and private meeting links off public pages

Do not invent a real weekly schedule.
Use clearly labeled sample sessions only in development.

Verify mobile usability, recurring-session exceptions, timezone
display, cancellations, and registration behavior.
```

### Prompt 6 — Build Daily Quick Mind with reliable scoring

```text
Implement a Daily Quick Mind pilot.

User flow:
1. Select learning level
2. Select topic
3. Select subtopic
4. Select 5 or 10 questions
5. Complete the practice
6. Submit answers
7. See score, feedback, worked solutions, and suggested review

Create a configurable curriculum taxonomy spanning Kindergarten
through Calculus IV. Document the proposed scope of each calculus
course; do not assume Calculus IV has a universal definition.

Publish only a small reviewed pilot:
- Elementary arithmetic
- Algebra 1 equations
- Algebra 2 quadratics
- Precalculus functions
- Calculus I derivatives

Keep other curriculum entries unpublished or clearly coming soon.

Use reviewed questions and validated parameterized templates first.
For each question, store:
- Stable ID and version
- Learning objective
- Prompt and answer format
- Correct answer and worked solution
- Domain, units, precision, and tolerance rules where applicable
- Difficulty and verification status

Support exact numbers, fractions, multiple choice, and bounded
algebraic equivalence checking.

Keep answer keys server-side.
Validate submissions against the session’s question IDs.
Do not evaluate arbitrary student input as executable code.
Do not reveal solutions before submission.

Use guest sessions initially, without requiring names or email.
Do not persist guest answers or send them to an AI service by default.

Results must distinguish correct, incorrect, unanswered, and
“needs review.” Never count an ungraded answer as automatically wrong.

Verify equivalent fractions, negative signs, rounding, invalid input,
domain restrictions, and forged or repeated submissions.
```

### Prompt 7 — Add AI explanations and expand the curriculum

```text
Extend Daily Quick Mind with server-side AI feedback.

Use an AI-provider adapter so the provider can be changed later.
Keep credentials server-side.

For mathematically checkable answers:
- The mathematical grader determines correctness.
- AI explains the verified result in age-appropriate language.
- AI must not override the validated answer key.

For written reasoning:
- Use a defined rubric and provisional scoring.
- Return “needs review” when the result is uncertain.
- Treat student text as untrusted data, never as instructions.
- Validate structured model responses before displaying them.

Provide a useful result even when AI times out or is unavailable.
Add request limits, input limits, usage tracking, and configurable
spending caps.

Before enabling AI for children, document the data sent to the
provider, retention settings, and the age/parental-consent approach.
Keep guest practice available without AI processing.

AI-generated questions must enter a validation/review pipeline.
Do not publish generated questions directly.

Expand curriculum in reviewed batches. Address:
- Multiple valid answers
- Extraneous roots
- Domain restrictions
- Units and significant figures
- Indefinite integrals and constants of integration
- Matrices and multivariable notation where applicable

Create an evaluation set for grading and explanation accuracy.
Document which topics are ready and which remain unsupported.

Add optional parent-managed progress history only after its access,
retention, export, and deletion behavior is defined and verified.
```

### Prompt 8 — Prepare the launch and domain migration

```text
Prepare the site for production without changing live DNS yet.

Verify:
- Every preserved testimonial matches its source exactly
- Content and asset reconciliation is complete
- Current tutor information is approved
- Contact delivery works
- Admin access is restricted
- Event dates and source links are accurate
- Calendar registration behaves honestly
- Practice scoring passes the evaluation set
- Answer keys and secrets are absent from browser responses
- Mobile, keyboard, and screen-reader journeys are usable
- Build, type checks, and relevant tests pass

Prepare:
- SEO metadata and sitemap
- Redirects for existing indexed URLs
- Custom-domain and HTTPS instructions
- Database/content backups and a restore procedure
- Error monitoring and AI spending alerts
- Privacy documentation matching actual behavior
- Launch checklist and rollback instructions

Inspect existing DNS records before proposing changes.
Preserve email-related MX, SPF, DKIM, and DMARC records.
Check both the root domain and www.

Provide a preview deployment for review.
List any missing credentials or unresolved launch blockers.
Document the exact final domain-switch steps.
Do not claim deployment or migration is complete until verified.
```

**Start with Prompts 1–3.** That gives you the most valuable foundation: preserved client feedback and a polished tutoring website. Then add the resource hub and calendar before tackling the broader practice platform.