# The Pi School — Feature Roadmap and Requirements

Updated: November 8, 2026
Suggested repository location: `docs/FEATURE_ROADMAP.md`
Status: Planning baseline. Proposed features are not authorization to implement every phase at once.

## 1. Purpose and relationship to the project plan

Build a welcoming mathematics learning hub that connects personalized tutoring, independent practice, homework help, mathematical exploration, and competition opportunities.

This document supplements `docs/PROJECT_PLAN.md`; it does not replace its original eight prompts. Use stable feature IDs below to link implementation work to the plan. Where priorities differ from earlier suggestions, the sequence in Section 4 is the current recommendation. Implement one selected milestone at a time.

AoPS is a reference for academic presentation and learning patterns. Keep The Pi School's branding, wording, imagery, teaching approach, and implementation original.

## 2. Current state — checked November 7, 2026

The local application has a Next.js App Router, TypeScript, Tailwind styling, a responsive shared site shell, a homepage, tutoring and contact pages, and seven owner-approved testimonials published locally. F05 includes a short inquiry form with server-side validation, a honeypot, a best-effort in-process rate limit, and Resend email delivery code. Local email environment variables are populated, but a test request was rejected by Resend with HTTP 403 because `thepischools.com` is not verified. No email was accepted or sent; F05 delivery is not complete.

The public source archive and F01 reconciliation are complete. On 2026-11-07, the owner confirmed reviewing the flagged team/contact/outcome-claim content and confirmed no private records were collected or kept for this website. The review did not record specific corrections or republication approvals, so flagged details remain unverified and must not be presented as current facts. The testimonial portion of F04 is complete locally; current tutor profiles remain unverified and unpublished. Booking, accounts, database-backed storage, and AI are not implemented.

F06 has a working local daily challenge route with a typed question-service and repository boundary, a server-only file bank, and deterministic templates for integer arithmetic, fraction addition/subtraction, linear equations, and 19 elementary topics. The shared catalog defines 14 advanced course IDs and 173 topics: 154 advanced-course topics plus Kindergarten–Grade 5 topics. Each elementary topic has a grade-scoped five-question generated set with selectable answers and optional accessible visuals. Ten Arithmetic and Number Sense topics each have five authored questions (one at every difficulty), as well as a retained complete mixed-review topic. Readiness is derived from complete coverage. Other topics remain “Coming soon” unless an existing complete bank or supported template supplies all five difficulties. The five-question daily set is selected by local date, timezone, grade/course level, topic, and generation version, then cached as a versioned public snapshot separately from attempts in device-local storage. Answer checking, hints, and solutions stay server-side. No account, cross-device sync, database, AI, or production publishing workflow is included. Elementary and authored content have not received separate owner/educator review for production. See `docs/DAILY_CHALLENGE_QUESTION_SYSTEM.md` and `docs/CURRICULUM_SCOPE.md`.

The shared curriculum labels Kindergarten, US Grades 1–12, and college/advanced math while keeping grade separate from course and topic. K–5 challenge coverage is a starter set, not a complete grade-by-grade curriculum; topic gaps and further review are tracked in `docs/CURRICULUM_SCOPE.md`.

F07's local directory redesign is complete: seven published editions across
seven event families, one archived edition, and one non-public draft. Families
and annual editions are separately modeled; the public view has purpose tabs,
URL-backed filters, compact cards, separate uncertain-eligibility results,
and student-only deadline handling. Thirty-two source leads remain research
starting points, not verified event listings. No verified upcoming conference,
student workshop, or university tournament is published; the global
30–40-family expansion remains open. See
`docs/EVENT_DIRECTORY_EDITORIAL.md` for exact sources and limitations.

Do not mark a feature complete solely because its navigation, mockup, or placeholder exists.

## 3. Product principles

- Help students build understanding and confidence, from foundations through advanced mathematics.
- Connect independent practice to approachable human tutoring.
- Preserve original client feedback exactly, including attribution.
- Publish only verified availability, credentials, results, sources, and event dates.
- Launch small reviewed learning experiences before expanding coverage.
- Make public browsing and initial practice useful without requiring an account.
- Provide accessible mobile layouts, keyboard operation, and mathematical notation.
- Keep private student information and answer keys out of public responses.

## 4. Delivery sequence

| Milestone | Scope | Exit condition |
| --- | --- | --- |
| M0 — Preserve | F01 | Complete — source archive and content reconciliation complete |
| M1 — Design and trust | F02–F05 | Consistent theme, honest learning paths, verified testimonials/team, working inquiries |
| M2 — Resource hub | F06–F10 | Daily challenge, reviewed opportunities/news, real help schedule, editorial workflow |
| M3 — Practice pilot | F11 | Guest 5/10-question sessions with reliable server-side grading |
| M4 — Assisted learning | F12–F15 | Evaluated AI feedback, reviewed curriculum expansion, optional accounts and targeted review |
| M5 — Advanced experiences | F16–F20 | Selected contest, live-learning, and community features justified by demand and staffing |

M0 / F01 is complete. F07 — Worldwide math events and beginner guides has been implemented locally in M2; see the verified-coverage and editorial-gap notes below. The Kindergarten–Grade 5 expansion updates F06 and F07 without completing the broader curriculum. The visual theme may be refined independently without publishing unverified content. No calendar dates or delivery estimates are committed here.

## 5. Feature inventory

The inventory defines scope and dependencies. Current verified completion is recorded in Section 2 and each feature specification below.

| ID | Feature | Priority | Dependencies |
| --- | --- | --- | --- |
| F01 | Original-content and testimonial preservation | Complete | Archive and owner reconciliation complete; no private records were collected or kept |
| F02 | Aqua/navy visual theme | Near term | Existing app foundation |
| F03 | Learning-pathway cards | Near term | Reviewed service scope |
| F04 | Testimonials and current tutor profiles | Near term | F01; owner content review |
| F05 | Tutoring pages and contact flow | Near term | Verified services; delivery configuration |
| F06 | Daily Math Challenge | Near term | Reviewed original questions |
| F07 | Worldwide math events and beginner guides | Near term | Official-source verification |
| F08 | Math Discoveries: research, news, facts | Near term | Editorial review |
| F09 | Weekly homework-help calendar | Near term | Confirmed schedule and registration method |
| F10 | Editorial/admin dashboard | Near term | Database, admin authentication and authorization |
| F11 | Daily Quick Mind pilot | Pilot | Reviewed question bank and mathematical grader |
| F12 | AI explanations and reasoning review | Later | F11; evaluation, usage and privacy controls |
| F13 | Full curriculum expansion through Calculus IV | Later | F11; curriculum definition and review |
| F14 | Parent-managed accounts and progress dashboard | Later | Account/access design and retention decisions |
| F15 | Adaptive difficulty and targeted review | Later | F11, F14; validated learning-history interpretation |
| F16 | Timed practice contests | Future | Sufficient reviewed/licensed content |
| F17 | Tutor videos and searchable concept library | Future | Content production capacity |
| F18 | Live math circles and collaborative sessions | Future | Facilitators, schedule, suitable participation controls |
| F19 | Multiplayer challenges and leaderboards | Future | Reliable scoring and active user demand |
| F20 | Moderated forums and mentored research | Future | Sustained moderation/mentor capacity |

## 6. Near-term feature specifications

### F01 — Preserve original content

Archive homepage, team, FAQs with expanded answers, contact details, images, logos, and existing URLs. Six distinct homepage testimonials were captured from the public carousel (Saket L, Ishan D, Tanisha R, Ashwin M, Vidhu, and Bhai); the owner supplied one additional testimonial. All seven are preserved and approved for local publication.

Store stable ID, original wording, displayed name, subject, source URL, capture date, and review status. Preserve an immutable source copy separately from edited marketing content. Deduplicate repeated carousel copies only. Import must be repeatable without creating duplicates.

Private inquiries, unpublished feedback, scheduling records, and client contact information require separate exports. Do not infer their recovery from a public crawl.

**Done when:** every discovered source item is accounted for; exact testimonial comparison passes; missing/private records are listed or confirmed not applicable; outdated tutor information and outcome claims are flagged and reviewed by the owner. Specific corrections and publication approval remain prerequisites before reuse of flagged content.

**Status:** Complete for archive and reconciliation. The owner completed the flagged-content review and confirmed that no private records were collected or kept (2026-11-07). Tutor, contact, and outcome-claim details remain flagged because the review did not record specific corrections or approval to republish them.

### F02 — Visual theme

Use this proposed AoPS-inspired palette. Values are design recommendations, not extracted AoPS brand values.

| Semantic role | Value |
| --- | --- |
| Main background | Pale aqua `#E6F3F4` |
| Alternate section | Blue-gray `#F0F4F8` |
| Headings / strong actions | Navy `#1D385C` |
| Links / selection | Teal `#087F8C` |
| Limited challenge accent | Purple `#86239B` |
| Decorative accent | Gold `#F2BE48` |
| Cards / fields | Soft white `#FAFCFD` |
| Body text | Slate `#293746` |

Define semantic theme tokens. Favor aqua backgrounds, light cards, navy headings/footer, restrained shadows and minimal motion. Verify actual foreground/background contrast; tokens alone do not guarantee accessibility. Gold is primarily decorative.

**Done when:** desktop/mobile pages use consistent tokens; focus/hover/error states remain clear; contrast is checked; existing content and behavior are preserved.

### F03 — Learning pathways

Add three clear entry cards: **Build Foundations**, **Get Homework Help**, and **Explore Challenges**. Each explains its intended learner and links to a real destination. Preserve non-math services if still offered. Keep Kindergarten–Calculus IV as a long-term curriculum scope, not a current availability claim.

**Done when:** every card has an honest description and working destination; unavailable experiences are clearly labeled; navigation remains manageable on mobile.

### F04 — Testimonials and tutor profiles

Seven owner-approved testimonials are published in readable cards on the local homepage, with original wording and attributions. Avoid requiring motion to read quotes. Current tutor participation, biographies, photographs, subjects and availability still need review; no tutor profiles are being represented as current.

**Status:** testimonial publication is complete locally; tutor-profile review and publication remain incomplete.

**Done when:** published quotes match their archive; no invented stars or outcomes appear; tutor information is reviewed; original attributions remain intact.

### F05 — Tutoring and contact

Explain the source-confirmed broad math scope and tutoring formats, and provide a request path without implying current availability. The contact form collects only parent/guardian name, reply email, student grade or course, and requested help. It validates on the server, includes a hidden honeypot and best-effort in-process rate limit, and sends through Resend using server-only `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`, and `INQUIRY_TO_EMAIL`. The intended recipient is `thepischooltutoring@gmail.com`; the sender must be an address on a domain verified with Resend. The owner still needs to configure these values and production edge rate limiting.

**Status:** routes, form, validation, spam controls, and delivery code are implemented locally. The test inquiry was rejected with HTTP 403: Resend reports that `thepischools.com` is not verified. Verify the domain in Resend, then repeat the inbox/Reply-To test. No test inquiry has been delivered.

**Done when:** a real inquiry reaches its intended destination; failure and validation states work; private inquiries are protected; expected response arrangements are accurately described. A provider acceptance is not proof of final inbox receipt.

### F06 — Daily Math Challenge

A daily set contains five problems for one selected course/level and topic, in ascending difficulty. Each item has a progressive hint and worked solution. Visitors can practice without login. The current question bank is authored and version-controlled in server-side code; archived challenges, printable versions, and a content publishing workflow remain future work.

Each bank item has a unique ID, eligible course/levels, topic/subtopic, difficulty, prompt, structured answer rule, hint, worked-solution steps, and optional answer-format instructions. Keep answer keys and grading logic out of client code. Use clear notation and accessible diagrams if later content requires them.

**Status:** the responsive daily challenge is implemented locally at `/daily-challenge`; the former `/weekly-challenge` path redirects there. Students choose a course/level, search its topics, and start only topics with verified question coverage for all five difficulty levels. The catalog contains 14 courses and 154 distinct topics, including the complete requested Arithmetic and Number Sense topic set. Each of its ten requested topics has five authored questions; the retained whole-number mixed-review bank is also complete. Other existing complete banks remain playable, while incomplete catalog topics are marked “Coming soon.” The same trigonometric-ratio questions are shared under Trigonometry and Precalculus without duplication. The coverage table is derived from the bank, not manually maintained.

Answer keys and deterministic answer checking remain server-side. The initial rules handle integers, equivalent fractions, explicitly permitted exact decimal equivalents, fixed-place decimals with a per-question tolerance, and unordered integer solution sets. Blank/unreadable submissions do not count as attempts. Hints and worked solutions unlock help-completion credit. Versioned local storage restores the current session, results, and local-calendar streak history; replaying a completed same-day challenge returns its original result. This is a starter collection, not a complete curriculum or production editorial system. Independent owner/educator review remains open before production use.

Focused checks cover question-bank completeness and canonical answers, stable daily selection, answer formats, corrupted/outdated local progress, and streak rules across duplicates, gaps, and calendar boundaries. Local browser checks cover wrong/blank answers, progression, help, refresh recovery, same-day replay, multiple topics on one day, and the mobile results layout.

**Done when:** the local pilot remains reliable and accessible; wider curriculum coverage and independent content review are complete before a production publishing process is introduced.

### F07 — Worldwide math events and beginner guides

Cover math conferences, competitions, Olympiads, tournaments, and workshops worldwide. Include local through international events and clearly distinguish the venue's location from where entrants are eligible to participate.

**Timing.** Add the requirements now. Build the directory in M2 after the content preservation and site foundation milestones. Launch with a small set of verified events across several regions and online formats, then expand country by country and through verified organizer submissions. Treat worldwide coverage as the long-term scope and track which regions and organizers are covered.

| Listing field | What to capture |
| --- | --- |
| Event and organizer | Name, organizer, category, edition, and official event URL |
| Event schedule | Start/end dates and organizer time zone |
| Mode and location | Online, in person, or hybrid. Include city and country for in-person participation |
| Eligibility | Eligible grades, original local year labels, age cutoffs, divisions, and geographic restrictions where applicable. Use equivalent grade filters only where the mapping is verified. Label conferences for educators, researchers, or other audiences when school grades do not apply |
| Registration route | Direct official registration link when available. Label school or test-center registration, team entry, qualification, invitation, or other requirements when applicable |
| Registration deadline | Last date to register, with the cutoff time and time zone if published. Show distinct deadlines by division, participation mode, or registration route when they differ |
| Registration status | Open, not yet open, closed, waitlist, or unknown, based on the organizer's information |
| Preparation materials | Optional links to official sample questions, past papers, answer keys, or worked solutions. Label which division or year the material covers when known. Link to organizer materials and reproduce them only when permission allows |
| Verification | Source URL for each key detail as needed, last verified date, and editorial status |

Provide search and filters by grade/level, event type, mode, country/region, event dates, and registration status. Let families sort by upcoming registration deadline and distinguish event dates from deadlines on cards and detail pages. Show explicit states such as “Deadline not announced,” “Registration link not published,” or “Sample questions not published” when appropriate. Preserve date-only deadlines without inventing cutoff times. Keep organizer time zones visible when converting a timed deadline for the visitor.

Start with manual verification and publish only reviewed entries. Recheck active listings before deadlines, flag broken links and date changes for review, archive past editions, and keep separate editions or rounds where eligibility or deadlines differ. Future automated discovery should create drafts for editorial review. Beginner guides should explain how to choose an event, prepare, and register through the official route.

**Done when:** published listings are traceable to official sources and show verified dates, participation mode, eligibility, registration details, and sample resources when available. Filters and deadline sorting work across regions, and the directory handles unknown details, closed registration, and archived events clearly.

#### F07 implementation contract and M2 status

The site foundation and content-preservation dependencies are complete, so
implementation proceeds in M2. The directory is a curated first release, not
comprehensive worldwide coverage. Preserve the existing site shell, palette,
typography, and navigation across `/events`, `/events/[slug]`, and
`/events/guides`. The implemented directory groups events by purpose, uses
responsive event cards, keeps primary filters brief and additional filters
collapsed, shows removable filter chips, and keeps archived editions hidden
by default. Confirmed matches and uncertain eligibility are separate groups.
Details include the event family and edition, schedule, mode and venue,
distinct eligibility, divisions, registration routes and purpose-labeled
deadlines/statuses, official preparation resources, source links,
last-verified date, next review, and editorial state.

The validated version-controlled model stores event families separately from
annual editions and derives a flattened public read model. Families have stable
IDs, names/aliases, organizer, intended purpose and audience, detailed type,
official homepage, and preparation links. Editions have stable IDs/slugs,
family ID, year/season, date-only or timed schedules, organizer timezone,
online/in-person/hybrid mode, multiple venues and local sessions, original
school-year labels, age/cutoff rules, divisions, entry pathway, participation
format, verified fee when available, geographic eligibility independent from
venue, and sourced grade mappings. Registration deadlines have explicit
purposes for student, school/team, host, or organizer purchasing. Schema
validation never substitutes for content review.
Only official organizers, authorized national bodies, or designated official
providers support published facts. Unknown details remain explicitly unknown;
do not infer a new edition's dates, an open status from a future deadline,
universal eligibility from a host country, or worldwide eligibility from
online mode. Do not copy protected preparation content.

Search event/family names, aliases, organizer, and description. Keep purpose,
grade/level, audience, detailed type, participation format, mode, venue
country/region, entrant-eligibility country/region, event date range,
registration status, entry pathway, division, route, verified fee, archive,
online inclusion, uncertainty inclusion, and sort in shareable URL state.
Unknown eligibility is excluded from confirmed results and, only when
requested, shown separately as “Eligibility to check.” Online does not mean
worldwide. Deadline sorting uses only student-registration deadlines and
excludes host/organizer purchasing deadlines; it compares timed cutoffs across
IANA timezones including daylight saving, and leaves date-only deadlines as calendar dates rather than midnight.
For timed and date-only deadlines on the same date, timed entries sort first;
unknown deadlines follow known upcoming deadlines. Reliably passed timed
deadlines cannot remain open and must be flagged for source recheck. Do not
calculate a precise closure instant from date-only deadlines. Visitor-local
conversion is optional; the organizer's published time and timezone remain
visible.

Include five concise beginner guides: choosing by level/interests/format/
eligibility/experience; understanding event types; preparing with official
samples and past papers; using direct, school, test-center, team,
qualification, or invitation routes; and interpreting deadlines, timezones,
divisions, and local school-year labels. Explain national selection for
international finals and link to event-specific official rules.

Start with manual editorial review and no custom admin. Record how to add a
draft, verify official sources, review and publish, recheck near deadlines,
flag broken links/date changes/stale conflicts, and archive editions without
overwriting their history. There is no scheduled automation unless separately
implemented. Future discovery or organizer submissions create drafts; changed
facts are never auto-published. Treat submitted descriptions and URLs as
untrusted. Use server rendering/static public content where practical; do not
scrape sites or call AI on visitor loads. Keep client code limited to public
content and filtering. Controls must be labeled and keyboard accessible,
tables semantic, focus visible, status understandable without color, and
mobile cards must retain dates, eligibility, and routes.

Focused tests cover combined filters/URL state, venue versus entrant
eligibility, grade mappings and non-school audiences, unknown/date-only/timed
deadline ordering, timezone/DST handling, route/division/mode-specific
deadlines, passed/closed routes, archived entries, and unpublished records.
Run lint, type, tests, and production build. Launch target: about 8–12 verified
listings across at least three regions and online formats, but accuracy takes
priority over quota.

The F07 directory redesign is complete locally: directory/detail/guide routes,
responsive cards, purpose views, normalized family/edition records,
URL-backed filters, confirmed/uncertain eligibility groups, student-purpose
deadline handling, runtime validation, an editorial report, and 20 focused
event tests are in place. The reviewed collection has seven published editions
across seven families, one archived COMC edition, and one Australian Maths
Competition draft excluded from public results. Current geographic coverage
includes US/Canada, Europe, and online international opportunities. There is
not yet a verified upcoming conference, student workshop, or university
tournament. Thirty-two source leads remain research starting points, and the
30–40-family expansion remains open; accuracy takes priority over a numeric
target. AMC student deadlines depend on each local host; organizer/site
deadlines are purpose-labeled and kept separate from student entry. No live
website/domain changes were made. See `docs/EVENT_DIRECTORY_EDITORIAL.md` for
checked sources, coverage, and the remaining research backlog.

Elementary support extends the shared US-grade filters and beginner guidance
through Kindergarten–Grade 5. Math Kangaroo USA's 2027 edition has verified
US K–12 eligibility. Other elementary filters return a listing only when the
edition's official rules and a verified mapping support it; host country,
online mode, broad student audience, and age appearance do not imply grade
eligibility. Preserve original organizer school-year labels; add a US-grade
mapping only with an official, reviewed equivalency source. Beginner guides
include parent/guardian guidance for younger participants.

### F08 — Math Discoveries

Separate **Research Explained**, **Math News**, and **Interesting Facts**. Include learning-level/topic tags, original summaries, sources, publication date, review date and optional diagrams. Explain research uncertainty and distinguish established facts from new claims. Avoid confusing source publication date with your summary's publication date.

**Progress:** A small, manually reviewed Math News page is now available at `/math-news`, linked from Explore. It contains two source-linked stories and is an initial slice of F08 only; research explainers, interesting facts, topic/level filters, and an editorial publishing workflow remain future work. Stories are static, curated records—not a live feed.

**Done when:** every published item is reviewed and attributed; summaries are original; links work; research claims reflect the source; no unsupported feed content appears.

### F09 — Homework-help calendar

Desktop week view and mobile agenda. Display subject/level, tutor, start/end time, timezone, online/in-person format, availability and registration action. Default timezone: America/Los_Angeles; label conversions clearly. Support recurrence and exceptions, daylight-saving changes, cancellations and calendar downloads.

First release may use configured external registration or a clearly labeled inquiry action. Inquiry is not reservation. Native booking later needs transactional capacity enforcement, duplicate prevention, cancellations and confirmations. Never expose private meeting links or student rosters publicly.

**Done when:** actual sessions are published; mobile agenda works; timezone/recurrence checks pass; actions accurately reflect booking behavior; empty weeks have a useful message.

### F10 — Editorial dashboard

Admin-only draft, preview, publish, edit, archive and export for opportunities, discoveries, challenges, help sessions, testimonials and tutor profiles. Require server/database authorization, not merely a hidden menu. Public users see only published public data. Record reviewer and verification timestamps; support stable IDs and idempotent imports.

**Done when:** authorized changes work; unauthorized reads/writes are denied; drafts/private data remain private; content export and restore procedure are documented.

## 7. Daily Quick Mind and later learning features

### F11 — Practice pilot

Flow: level → topic → subtopic → 5 or 10 questions → answer submission → score and explanations → suggested review or relevant help session.

Begin with elementary arithmetic, Algebra 1 equations, Algebra 2 quadratics, precalculus functions and Calculus I derivatives. Publish only subtopics with enough reviewed questions/templates for both session lengths. Keep other topics unavailable or clearly coming soon.

Question records need ID/version, objective, prompt, response type, key, worked solution, difficulty, domain, units, precision/tolerance rules and verification status. Use reviewed originals or permitted sources. Keep keys and grading server-side. Validate submitted IDs against the issued session; handle repeat submissions predictably. Never execute arbitrary student input.

Use exact/numeric/equivalence checks suitable to the question. Distinguish correct, incorrect, unanswered and needs-review results. Define the score denominator explicitly when review is pending. Do not count uncertain grading automatically as wrong. Solutions appear only after submission.

Guest practice initially requires no name/email and does not persist answers or send them to AI by default. If local session recovery is introduced, disclose storage and provide clearing behavior.

**Done when:** both lengths work end-to-end; equivalent fractions, signs, invalid input, domain/rounding rules, forged IDs and repeated submissions are checked; no keys leak; results remain useful without AI.

### F12 — AI feedback

Use AI to explain validated results in appropriate language. AI cannot override the deterministic key. Written-reasoning review uses a rubric and provisional assessment; uncertainty yields needs review. Treat student text as data, validate structured output, enforce input/rate/spending limits and provide timeout fallbacks.

Before enabling processing for children, document the age/parental-consent approach, data sent, provider retention configuration and deletion behavior. Keep non-AI practice available.

**Release gate:** representative evaluation set demonstrates acceptable grading/explanation behavior; privacy decisions are implemented; provider failure does not break practice. Generated questions enter review, never automatic publication.

### F13 — Curriculum expansion

Configurable levels: Kindergarten–Grade 5; middle-school foundations/prealgebra; Algebra 1; Geometry; Algebra 2; Precalculus; Statistics; Calculus I–IV. Support multiple curriculum mappings where appropriate. Calculus IV scope requires an explicit owner-approved definition; course titles vary.

Publish in reviewed batches. Advanced grading must address extraneous roots, multiple valid answers, units, integration constants, matrices and multivariable notation as relevant.

**Release gate:** each subtopic has documented objectives, adequate reviewed content, verified solutions and relevant grading checks. A visible menu alone is not coverage.

### F14 — Accounts and progress

Optional parent-managed access, session history and understandable topic summaries. Define parent/student/tutor/admin permissions; retention; export; deletion; and account recovery. Tutors see only assigned students. Separate guest access from account-linked storage.

**Release gate:** allow/deny access checks pass; history reflects actual work; no fabricated progress; data lifecycle is documented and usable.

### F15 — Adaptive learning and targeted review

Use validated question tags and history to recommend review, adjust difficulty and revisit weak concepts. Explain recommendations and let learners choose topics. Distinguish practice performance from demonstrated mastery; one short quiz is insufficient evidence of broad mastery.

**Release gate:** explicit recommendation rules, educational review, representative evaluation and useful behavior with limited history.

## 8. Future backlog — optional, not current implementation scope

| ID | First useful version | Conditions before development |
| --- | --- | --- |
| F16 | Timed original practice sets with solutions | Enough reviewed content; clear timing/accommodations and scoring rules; no implied official affiliation |
| F17 | Short tutor-created explanations linked to topics | Production/review capacity; captions/transcripts; search by level/topic |
| F18 | Facilitated small-group math circles | Confirmed hosts, participation expectations, registration and privacy arrangements |
| F19 | Opt-in friendly challenges | Reliable scoring, sufficient usage, age-appropriate identities, anti-abuse design; avoid public student data |
| F20a | Moderated topic discussions | Named moderation owners, reporting/escalation workflow and sustainable participation |
| F20b | Small mentored exploration projects | Qualified mentors, original project scope, suitable supervision and clear expectations |

Forums, multiplayer contests and research programs should follow demonstrated demand, not delay the tutoring/resource launch.

## 9. Content and technical foundations

Recommended entities: testimonials, tutors, services, inquiries, opportunities, discovery_posts, challenges, help_sessions, curriculum_nodes, question_versions and practice_sessions. Add users, parent/student relationships, attempts, recommendations and registrations only when the corresponding phase requires them.

Use repository-controlled migrations and repeatable imports. Distinguish public content, confidential inquiries, practice answer keys and optional student records. Keep provider credentials server-side. Preserve existing URL redirects and domain email records during launch.

Editorial publication workflow: draft → source/content review → preview → published → reviewed again or archived. Do not auto-publish scraped news or generated learning content. Check permissions for third-party questions, images and solutions.

Initial metrics: working inquiries, practice completion, help-session interest/registrations and resource usage. Add analytics only after defining what is collected; avoid storing children's raw answers or identities merely for engagement metrics.

## 10. Implementation prompts

### A — Add this document to repository planning (documentation only)

```text
Read AGENTS.md, docs/PROJECT_PLAN.md and docs/FEATURE_ROADMAP.md.
Reconcile this feature roadmap with the existing plan without deleting
the original eight prompts or overwriting existing work.
Link the roadmap from the project plan and README.
Map feature IDs to milestones. Preserve reported vs verified status.
Keep content preservation as the next required phase.
Record unresolved decisions rather than inventing answers.
Do not implement application features in this task.
Summarize the documentation changes.
```

### B — Implement one selected feature

```text
Read AGENTS.md, docs/PROJECT_PLAN.md and docs/FEATURE_ROADMAP.md.
Implement feature [FEATURE_ID] only, including its stated dependencies
and acceptance criteria. Inspect the existing implementation first.
If a prerequisite is missing, identify the concrete gap and implement
only the prerequisite work needed within this feature's authorized scope.
Never fabricate source content, dates, availability or results.
Keep future features out of scope and preserve existing behavior.
Run appropriate checks and inspect desktop/mobile behavior when relevant.
Update the roadmap with actual completed work, verification and open items.
Do not mark the feature complete if it is only a placeholder or mockup.
Do not modify production, DNS or the live domain.
```

### C — Audit readiness before expanding practice

```text
Review F11 through F15 in docs/FEATURE_ROADMAP.md and the actual code.
Report implemented, partial and missing requirements with evidence.
Check grading reliability, question review, key isolation, data access,
AI fallbacks and the distinction between scores and mastery claims.
Recommend the smallest next reviewed curriculum batch.
Do not enable new AI processing or publish unreviewed content.
```

## 11. Decisions still needed

- Which non-math tutoring services remain active?
- Which tutors and availability are current?
- What are the actual homework-help hours and registration method?
- Is help free, paid, or included with tutoring?
- Which countries, organizers, and grade bands should the first worldwide directory listings prioritize?
- Who reviews math questions and publishes weekly content?
- What exactly should Calculus IV cover?
- When is persistent progress valuable enough to introduce accounts?
- What AI usage budget and data-processing configuration are acceptable?

These do not block preserving content or applying the visual theme.

## 12. Completion checklist

- [ ] F01 archived and reconciled
- [ ] F02 theme reviewed on desktop/mobile
- [ ] F03 pathways link to honest destinations
- [x] F04 owner-approved testimonials published in the local rebuild
- [ ] F04 current tutor profiles reviewed and published
- [ ] F05 real contact delivery verified
- [ ] F06 first original daily challenge reviewed and daily publishing process confirmed
- [ ] F07 worldwide math events directory launched with verified listings and preparation links where available
- [ ] F08 discovery content reviewed and attributed
- [ ] F09 real help schedule and registration verified
- [ ] F10 admin access and publication workflow verified
- [ ] F11 guest practice pilot and grading verified
- [ ] F12 AI evaluation and data-processing decisions complete
- [ ] F13 curriculum batches individually reviewed
- [ ] F14 optional account access/data lifecycle verified
- [ ] F15 adaptation evaluated before mastery claims
- [ ] Future features selected individually based on demand

## 13. Reference inspiration

The earlier review used these official AoPS pages as feature references:
- https://artofproblemsolving.com/
- https://artofproblemsolving.com/resources
- https://artofproblemsolving.com/school/handbook/current/alcumus

Observed patterns included adaptive practice, worked solutions, competition
training, video explanations, live sessions and community learning. These
references document inspiration, not a commitment to reproduce their system.

## Change log

| Date | Change |
| --- | --- |
| 2026-10-30 | Consolidated original requested additions, AoPS-inspired ideas, proposed palette, staged requirements, dependencies, acceptance criteria and implementation prompts. |
