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
| Phase 2 — Math hub | Not started | Protected publishing workflow and source-verified opportunity/discovery content. |
| Phase 3 — Daily Quick Mind pilot | Not started | Reviewed topics and validated server-side grading for a small pilot. |
| Phase 4 — Expand learning | Not started | Curriculum scope confirmed and each released topic passes content and grading checks. |
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

## Phase 3 — Daily Quick Mind pilot

Create a small reviewed practice pilot with server-side answer keys and
deterministic grading. Keep unsupported topics unpublished. Do not add AI
or student accounts in this phase.

## Phase 4 — Expand learning

Confirm the curriculum taxonomy, including the locally intended meaning
of Calculus IV. Expand only in reviewed batches, with explicit evaluation
for answer equivalence and domain restrictions.

## Phase 5 — Launch and operate

Verify content, privacy, access controls, backups, monitoring, and rollback
before any production proposal. Do not alter live DNS or the existing
website without separate explicit authorization.
