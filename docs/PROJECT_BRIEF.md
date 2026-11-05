# Project brief

## Purpose

Create a welcoming, accessible home for The Pi School, beginning with a
responsive tutoring-oriented homepage and a foundation for future math
learning resources.

## Product goals

- Preserve existing public content before republishing it.
- Make tutoring information easy to find without inventing subjects,
  tutor details, prices, availability, or outcomes.
- Provide clear previews of planned learning features without suggesting
  that they are already available.
- Support a future math opportunities hub, math discoveries, homework
  help, and Daily Quick Mind practice.

## Initial audience

Students and families exploring math tutoring and future learning
resources. No student accounts, personal-data collection, booking, or
contact submission flow is included in this foundation.

## Design direction

- Pale aqua `#E6F3F4` page background, blue-gray `#F0F4F8` alternate sections,
  and soft white `#FAFCFD` card surfaces.
- Deep navy `#1D385C` for structure and headings; slate `#293746` for body text.
- Teal `#087F8C` for primary accents, with accessible deeper teal `#076F79`
  for normal-size text links.
- Restrained gold `#F2BE48` and occasional purple `#86239B` accents.
- Readable type, clear focus indicators, responsive layouts, and reduced
  motion when requested by the visitor's device.

## Content integrity

- Preserve original testimonial wording and displayed attribution. The
  six source-site testimonials and one owner-provided testimonial are
  approved and displayed in the local rebuild.
- Do not invent reviews, credentials, outcomes, prices, tutor availability,
  or event dates.
- Label planned features clearly.
- Track source preservation and unresolved items in
  `CONTENT_MIGRATION.md`.

## Technology

- Next.js App Router with TypeScript.
- Tailwind CSS 4 for the utility CSS foundation, with site-specific
  responsive styles in the app stylesheet.
- Evaluate Supabase for future content storage and protected
  administrator access before the editorial dashboard phase.
- No database, authentication, third-party service, or environment
  variable is required for the initial local homepage.

## Out of scope for this foundation

AI, student accounts, booking, contact-form delivery, public event
publishing, curriculum exercises, production deployment, and domain/DNS
changes are not implemented.
