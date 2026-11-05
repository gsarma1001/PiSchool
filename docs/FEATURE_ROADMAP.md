# The Pi School — Feature Roadmap and Requirements

Updated: November 5, 2026
Suggested repository location: `docs/FEATURE_ROADMAP.md`
Status: Planning baseline. Proposed features are not authorization to implement every phase at once.

## 1. Purpose and relationship to the project plan

Build a welcoming mathematics learning hub that connects personalized tutoring, independent practice, homework help, mathematical exploration, and competition opportunities.

This document supplements `docs/PROJECT_PLAN.md`; it does not replace its original eight prompts. Use stable feature IDs below to link implementation work to the plan. Where priorities differ from earlier suggestions, the sequence in Section 4 is the current recommendation. Implement one selected milestone at a time.

AoPS is a reference for academic presentation and learning patterns. Keep The Pi School's branding, wording, imagery, teaching approach, and implementation original.

## 2. Current state — reported, not independently audited

The owner shared a development report confirming a Next.js App Router, TypeScript, and Tailwind foundation; responsive homepage; shared header/navigation/footer; and passing lint, typecheck, and build checks.

The current repository has not been inspected for this document. Content migration, exact testimonial preservation, contact delivery, accounts, booking, and AI were reported outstanding. Completion of the proposed palette change has not been confirmed.

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
| M0 — Preserve | F01 | Source archive and content reconciliation complete |
| M1 — Design and trust | F02–F05 | Consistent theme, honest learning paths, verified testimonials/team, working inquiries |
| M2 — Resource hub | F06–F10 | Weekly challenge, reviewed opportunities/news, real help schedule, editorial workflow |
| M3 — Practice pilot | F11 | Guest 5/10-question sessions with reliable server-side grading |
| M4 — Assisted learning | F12–F15 | Evaluated AI feedback, reviewed curriculum expansion, optional accounts and targeted review |
| M5 — Advanced experiences | F16–F20 | Selected contest, live-learning, and community features justified by demand and staffing |

M0 remains the next required project phase. The visual theme may be refined independently without publishing unverified content. No calendar dates or delivery estimates are committed here.

## 5. Feature inventory

All statuses below are **proposed / not verified as implemented**, unless explicitly noted.

| ID | Feature | Priority | Dependencies |
| --- | --- | --- | --- |
| F01 | Original-content and testimonial preservation | Required next | Access to public site and private exports where available |
| F02 | Aqua/navy visual theme | Near term | Existing app foundation |
| F03 | Learning-pathway cards | Near term | Reviewed service scope |
| F04 | Testimonials and current tutor profiles | Near term | F01; owner content review |
| F05 | Tutoring pages and contact flow | Near term | Verified services; delivery configuration |
| F06 | Weekly Math Challenge | Near term | Reviewed original questions |
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

Archive homepage, team, FAQs with expanded answers, contact details, images, logos, and existing URLs. The earlier browser review found six distinct homepage testimonial attributions: Saket L, Ishan D, Tanisha R, Ashwin M, Vidhu, and Bhai. Treat this as a reconciliation checkpoint, not an exhaustive source archive or substitute for exact quote capture.

Store stable ID, original wording, displayed name, subject, source URL, capture date, and review status. Preserve an immutable source copy separately from edited marketing content. Deduplicate repeated carousel copies only. Import must be repeatable without creating duplicates.

Private inquiries, unpublished feedback, scheduling records, and client contact information require separate exports. Do not infer their recovery from a public crawl.

**Done when:** every discovered source item is accounted for; exact testimonial comparison passes; missing/private records are listed; outdated tutor information and outcome claims are flagged for owner review.

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

Display verified testimonials in readable cards and a full feedback page. Avoid requiring motion to read quotes. Review current tutor participation, biographies, photographs, subjects and availability. Keep original quotes intact; editorial excerpts must be separately identified and traceable to the complete quote.

**Done when:** published quotes match their archive; no invented stars or outcomes appear; tutor information is reviewed; original attributions remain intact.

### F05 — Tutoring and contact

Explain subjects, session formats, how tutoring works, and actual next steps. Contact fields should collect only necessary information. Use server-side validation, spam controls, and a configured delivery or storage destination. Do not display success if delivery/storage fails. Do not invent pricing.

**Done when:** a real inquiry reaches its intended destination; failure and validation states work; private inquiries are protected; expected response arrangements are accurately described.

### F06 — Weekly Math Challenge

Start with one original reviewed problem per week, labeled by learning level/topic, with a progressive hint and expandable worked solution. Browse without login. Add archived challenges and printable versions later. A challenge may initially be self-checking; do not imply automatic grading unless implemented.

Store question ID/version, prompt, topic, intended level, hint, solution, publication date and review status. Support clear equations and accessible diagrams where needed.

**Done when:** a reviewed problem renders correctly on mobile; hints and solutions are keyboard accessible; publication dates behave correctly; no unreviewed question is published.

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

### F08 — Math Discoveries

Separate **Research Explained**, **Math News**, and **Interesting Facts**. Include learning-level/topic tags, original summaries, sources, publication date, review date and optional diagrams. Explain research uncertainty and distinguish established facts from new claims. Avoid confusing source publication date with your summary's publication date.

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
- [ ] F04 verified feedback and current team published
- [ ] F05 real contact delivery verified
- [ ] F06 first original weekly challenge reviewed
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
