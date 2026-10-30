# Project rules

- Implement one prompt or phase at a time. Read `docs/PROJECT_PLAN.md` before starting work, and update its completion status as work progresses.
- Inspect the existing workspace before creating or changing files. Preserve existing work; never replace an existing project or make unrelated changes.
- Keep project documentation in `docs/`. Track source-content capture and reconciliation in `docs/CONTENT_MIGRATION.md`.
- Preserve source wording and displayed attributions exactly when migrating testimonials. Record provenance, distinguish verified source content from assumptions, and do not fabricate missing content.
- Never invent reviews, prices, credentials, outcomes, event dates, tutor availability, or other factual claims.
- Clearly label demonstration data; do not present it as real published content.
- Keep secrets, answer keys, and grading logic server-side. Never commit secrets; use environment variables and a secret-free `.env.example` if one is added.
- Do not change the production website, domain, DNS, or live content as part of local development.
- Follow the architecture and design decisions in the project plan. For a new website, use Next.js App Router, TypeScript, and Tailwind CSS, and document the actual compatible dependency versions.
- Do not implement future phases until requested. In particular, do not add AI features or student accounts as part of the initial foundation.
- Validate changes with the smallest relevant existing checks, and report what works, what was verified, and what remains incomplete.
