# Implementation plan

This plan tracks work against `PROJECT_PLAN.md`. Implement each phase only
when requested, preserving the existing source material and avoiding
production changes.

## Current status

| Prompt or phase | Status | Exit criteria |
|---|---|---|
| Prompt 1 — Foundation and homepage | Complete | App Router, TypeScript, Tailwind, responsive shared shell and homepage; required docs and setup instructions; ESLint, TypeScript, production build, and HTTP 200 homepage content checks passed. |
| Phase 0 — Preserve | Complete | Accessible public pages, assets, six unique source testimonials, seven expanded FAQs, and one owner-provided testimonial are archived. The owner completed the flagged-content review and confirmed no private records were collected or kept. Specific publication decisions for flagged tutor/contact/claims content remain subject to verification; see `docs/CONTENT_MIGRATION.md`. |
| Phase 1 — Redesign | Foundation only | Responsive homepage, shared header/footer, and testimonials are implemented. Reviewed tutoring/team/FAQ/contact pages and a configured contact flow remain future work. |
| Phase 2 — Math hub | Partial — F06/F07 elementary support updated locally; F07 directory redesign complete; broader content coverage remains | K–5 challenge topics and shared US-grade event filters are implemented locally. F07 has seven published editions across seven families, one archived edition, and one non-public draft. Math Kangaroo USA's 2027 edition has verified US K–12 eligibility; broader coverage remains incomplete and the directory lacks a verified upcoming conference, workshop, or university tournament. |
| Phase 3 — Daily Quick Mind pilot | Not started | Reviewed topics and validated server-side grading for a small pilot. |
| Phase 4 — Expand learning | Partial — K–5 challenge starter set added | 19 elementary topics have deterministic five-question challenge sets. Broader topic coverage, educator review, remaining grade/course mappings, and advanced curriculum expansion remain open. |
| Phase 5 — Launch and operate | Not started | Content, critical flows, backups, monitoring, and rollback verified; domain switch remains a separately approved action. |

## Prompt 1 — Foundation and homepage

1. Inspect the repository and keep existing documentation intact.
2. Set up Next.js App Router, TypeScript, and Tailwind CSS.
3. Build a responsive shared header, navigation, footer, and minimal
   education-focused homepage.
4. Mark future features as planned and withhold unverified testimonials and
   tutor details.
5. Document project goals, implementation stages, curriculum boundaries,
   environment setup, and local commands.
6. Verify lint, TypeScript, production build, and the rendered local
   homepage before marking complete.

## Phase 0 — Preserve

Use `docs/CONTENT_MIGRATION.md` as the source inventory and reconciliation
checklist. Preserve original wording, displayed attribution, capture date,
and source URL. Mark items that need owner review. Never treat public
content capture as a backup of private form submissions.

## Phase 1 — Redesign

Only begin after content has been reviewed. Add the public tutoring,
team, testimonial, FAQ, and contact pages based on verified source
material. Implement contact delivery only with server-side validation,
spam protection, and truthful configured/unconfigured states.

## Phase 2 — Math hub

Add opportunities and discoveries as editorial content with official
sources and review dates. Evaluate Supabase for hosted content and
protected administrator access. Restrict create/edit/publish operations
to authorized administrators. Do not invent dates or registration status.

### F07 — Worldwide math events and beginner guides (M2)

**Dependencies:** Phase 0 content preservation and the site foundation are
complete. Implement the local F07 directory now; do not implement later
features or change the live site/domain.

**Routes and user experience**

- `/events`: purpose views, searchable directory, mobile-friendly event cards,
  shared source data, reduced primary filters, collapsed additional filters,
  removable filter chips, result count, event-date/student-deadline/name
  sorting, URL-persisted state with back/forward, clear-all, no-results state,
  confirmed and uncertain eligibility groups, and archived editions hidden
  unless requested.
- `/events/[slug]`: edition/round details, organizer, dates and any published
  times/timezone, mode and physical venue, entrant eligibility/geographic
  restrictions, divisions, registration route(s), route-specific deadline and
  status, official preparation resources, source records, review dates, and
  descriptive official links.
- `/events/guides`: concise beginner guidance on selecting an event, event
  types, official preparation resources, registration routes, and deadlines,
  timezones, divisions, and local school-year terms. Explain national
  qualification for some international finals.
- Add the shared Events navigation link and retain existing design,
  responsive shell, focus behavior, and mobile navigation.

**Data and editorial model**

Use typed, runtime-validated, version-controlled structured content outside
presentation code, with a data-access boundary that could later use a database
or CMS. Store event families separately from annual editions and derive a
flattened read model for the public UI. Families have stable IDs, names and
aliases, organizer, purpose/category, intended audience, official homepage,
and preparation links. Editions have stable IDs/slugs, family ID, year/season,
round, date-only or timed schedule and timezone, mode, venues and local
sessions, original local school-year labels, age limits and cutoffs,
divisions, entry pathway, participation format, verified fee when available,
geographic eligibility independent from venue, verified grade mappings with
sources, and unknown eligibility.

Model multiple registration routes (direct, school, test-center, team,
qualification, invitation, other), each with URL/instructions/prerequisites,
division/mode, opening date if known, deadline date precision and published
cutoff/timezone, organizer-reported status, status source, and last checked
date. Support official samples/past papers/keys/solutions with type/title/
division/year/source. Record official source URL, authority, verified date, and
claims supported; event last-verified/next-review dates; draft/in-review/
published/archived status; and broken-link/date-change/conflict/stale flags.
Keep test fixtures separate. Valid schema does not mean reviewed content.

Only publish exact-edition claims sourced to an official organizer,
authorized national body, or designated official provider. Never infer a new
edition's dates, an open status from a future deadline, entrant eligibility
from venue country, or worldwide eligibility from online mode. Explicitly
display unpublished dates, deadlines, links, samples, eligibility, and status
as unknown. Do not reproduce protected source materials without permission.

**Filtering, deadlines, and presentation**

Search event/family names, aliases, organizer, and description. Keep purpose,
grade/level, audience, detailed event type, participation format and mode,
venue country/region, entrant-eligibility country/region, event date range,
registration status, entry pathway, division, route, verified fee, archive,
online inclusion, uncertainty inclusion, and sort in URL query parameters.
Unknown eligibility is excluded from confirmed results and, only when
requested, appears in a separately labeled “Eligibility to check” group.
Online mode never implies geographic eligibility. Restore all filters on
back/forward navigation.

Deadline sort selects only the earliest student-registration deadline for
current route/division/mode filters; host or organizer purchasing and license
deadlines are never treated as student deadlines. Compare timed cutoffs as actual
instants using IANA timezone rules, including daylight-saving changes. Keep
date-only deadlines as dates, never midnight. If timed and date-only cutoffs
share a date, timed sorts first. Unknown deadlines follow known upcoming
deadlines; closed/passed routes and archives have explicit handling. A
reliably passed timed deadline cannot still display open and must flag a
recheck. Do not calculate a precise closure instant from date-only data.
Always retain organizer time/timezone; local visitor conversion is optional.

**Maintenance and acceptance**

Document a manual workflow to create drafts, confirm sources, review/publish,
recheck active entries near deadlines, flag broken links or changed/stale
claims, and archive old editions without overwriting them. No custom admin,
automated scrape, scheduled link check, or automatic publication is in scope.
Future discovery/submissions create drafts and are treated as untrusted input.
Use server-rendered/static public content where practical and do not call AI or
scrape organizers on page load. Provide semantic tables, labeled keyboard
controls, visible focus, textual status, and mobile cards retaining dates,
eligibility, and routes.

Test combined filters and URL state; venue vs entrant eligibility; supported
grade mappings and non-school audiences; unknown/date-only/timed deadline
sorts; timezone/DST conversion; distinct route/division/mode deadlines;
expired/closed and archived records; and exclusion of drafts/unreviewed
records. Run lint, type, tests, and build. Aim for 8–12 reviewed entries across
three or more regions and online formats, but prioritize accuracy.

**Implementation status:** The redesign and normalized family/edition model
are complete locally. Seven editions across seven families are published; one
edition is archived and one draft is excluded. Source leads are recorded
separately from verified event editions. MAA site/competition-manager
deadlines are purpose-labeled; AMC student deadlines depend on each local host
and are not published. No verified upcoming conference, workshop, or
university tournament is included, and the 30–40-family expansion remains a
research goal. Twenty focused event tests and the editorial report pass; full
lint, typecheck, and production build are required for each release check. See
`docs/EVENT_DIRECTORY_EDITORIAL.md`; do not present unknown details as facts.

## Phase 3 — Daily Quick Mind pilot

Create a small reviewed practice pilot with server-side answer keys and
deterministic grading. Keep unsupported topics unpublished. Do not add AI
or student accounts in this phase.

## Phase 4 — Expand learning

Confirm the curriculum taxonomy, including the locally intended meaning
of Calculus IV. Expand only in reviewed batches, with explicit evaluation
for answer equivalence and domain restrictions.

### Kindergarten and elementary scope extension

The shared curriculum in `src/lib/curriculum.ts` defines US Kindergarten,
Grades 1–12, and college/advanced level labels. Grade is separate from course
and topic; the Daily Challenge currently provides four Kindergarten topics
and three topics each for Grades 1–5. See `docs/CURRICULUM_SCOPE.md` for exact
topic names and gaps. K–5 options use the existing Arithmetic and Number Sense
course ID internally while keeping grade-specific topic lists and saved
selection labels.

Elementary questions are deterministic, use server-validated multiple-choice
answers, and expose accessible labels and optional HTML visuals. Add topics
through the shared curriculum and challenge catalog, then add a versioned,
reviewed question bank or template and tests covering generated parameters,
answers, progression, visual accessibility, and existing advanced courses.
Categorical questions use only the available answer choices rather than
padding with generic distractors. Do not claim complete grade coverage or
independent educator review until it has occurred.

F07 uses the same US-grade option IDs, but event editors may assign one only
when the exact edition's official rules support it. Preserve organizer grade
labels and map international school years only with a sourced, verified
equivalency. Math Kangaroo USA's 2027 edition is verified for US Grades K–12;
other elementary matches remain dependent on official source review. See
`docs/EVENT_DIRECTORY_EDITORIAL.md`.

**Validation (November 8, 2026):** The 17 Daily Challenge tests, 17 event
tests, ESLint, TypeScript, and production build pass. Production-browser
checks covered Kindergarten, Grades 3 and 5, Pre-Algebra, Calculus 1, the
unmatched Grade 3 event filter, and mobile layouts; Kindergarten visual
comparison choices are keyboard accessible and the checked mobile viewport
has no horizontal overflow. Independent educator review and the documented
curriculum and event-content gaps remain outstanding.

## Phase 5 — Launch and operate

Verify content, privacy, access controls, backups, monitoring, and rollback
before any production proposal. Do not alter live DNS or the existing
website without separate explicit authorization.
