# The Pi School launch roadmap update and Copilot prompt

November 17, 2026

## Roadmap update

Insert this section after the delivery sequence in `docs/FEATURE_ROADMAP.md`. Use the feature IDs to update existing entries in place. Phase 1 and Phase 2 are release groupings for this review. Keep the existing milestone IDs.

The public staging review found that the six distinct production homepage testimonials are represented on staging, alongside an additional Algebra 1 testimonial. Daily Challenge, Events, and Math News are visible in staging navigation. Staging inquiry delivery remains unverified.

| Phase | Roadmap item | Origin | Scope and acceptance |
| --- | --- | --- | --- |
| 1 | F04/F05 Parent FAQ | Production FAQ | Explain lesson format and frequency, homework help, what happens during a lesson, trial and regular pricing, what happens after inquiry, and cancellation. Cancellations made less than 24 hours before the scheduled session are ineligible for refunds or make-up classes. Link the FAQ from the footer and Get started. |
| 1 | F04 Tutor cards and About | Production Team page | Publish current bios, course coverage, regular rates, and a sentence about each tutor’s approach. Add an About page with Abhay’s founder story and teaching experience as a math tutor and swim instructor. Preserve testimonial wording and attribution. |
| 1 | F05 Direct support and trial inquiry | Production support links and staging review | Use thepischooltutoring@gmail.com in the FAQ, contact page, and footer. The initial lesson is a 45-minute 1:1 trial. Trial price and delivery format are separate owner inputs. Explain inquiry follow-up and verify deployed delivery and confirmation. |
| 1 | F01 Legacy routes | Production navigation | Keep /faq and /contact usable. Route /team to the current tutor section or page. Verify against the deployment that will serve the production domain. |
| 1 | F03/F11 Practice entry and next step | Khan Academy mastery paths | Use existing grade/course and topic options. After a completed set, link to one reviewed follow-up topic, using a prerequisite for a known gap where available. Keep the experience available to guests. |
| 2 | F18 Semi-private and group lessons | Production tutoring formats | If demand and staffing support it, pilot one course-level group. Publish the format, eligibility, group size, price, and schedule when confirmed. |
| 2 | F11/F15 Readiness check | IXL Diagnostic and Khan Academy Readiness Check | Pilot a brief Algebra 1 readiness check. Show observed strengths and one or two recommended practice topics linked to existing sets. |
| 2 | F14 Parent progress updates | Khan Academy parent reports | Pilot tutor-written updates covering practice, independent skills, and next steps. Use feedback from parents to scope any future dashboard. |
| 2 | F07 Competition starter guides | Existing Events directory and roadmap | Pilot guides across elementary, middle, and high school. Include verified eligibility, registration deadlines, official sample problems, and a suggested first week of practice. |
| 2 | F09 Weekly homework-help hour | Production FAQ and existing roadmap | Pilot one staffed slot with a published time zone, grade coverage, and signup instructions. Use attendance and repeat demand to evaluate expansion. |

Keep Phase 1 tutoring copy aligned with services on offer. Leave legacy aggregate outcome claims, the placeholder phone number, 24/7 support claims, and non-math services out of launch copy unless their current status is verified.

## Phase 1 GitHub Copilot prompt

Implement the Phase 1 launch updates for The Pi School in the existing Next.js repository. Inspect AGENTS.md, current routes, shared tutor data, contact/Resend implementation, Daily Challenge, and project docs. Work locally in the existing development workflow, preserving unrelated changes and existing public features. Prepare the changes for staging validation. Production deployment and DNS changes are outside this task.

### Tutor cards and About

Use one shared source for tutor bios, coverage, regular lesson durations, and rates wherever they appear. Replace biography placeholders. Use the wording below as launch copy. The final sentence in each bio describes the intended teaching approach and avoids claiming additional credentials.

| Tutor | Bio and approach | Courses and regular rate |
| --- | --- | --- |
| Abhay | Abhay founded The Pi School and is a first-year student in UC Berkeley’s Management, Entrepreneurship, & Technology (M.E.T.) program. He has experience as a math tutor and swim instructor. He explains why concepts work and uses relatable examples to connect them to new problems. | Precalculus and advanced math beyond it. $25 per 50 minutes. |
| Sneha | Sneha is a high school student who enjoys math. She helps students break problems into manageable steps and practice explaining their reasoning. | Elementary and middle school math, with support through Algebra 2. $20 per 45 minutes. |
| Meera | Meera is a middle school student who tutors elementary math. She uses simple examples and gives students time to work through problems at their own pace. | Elementary math. $20 per 45 minutes. |

Add an About page linked from the footer. Suggested founder copy: “Abhay founded The Pi School. His experience teaching math and swimming shaped how he works with students: break a new skill into steps, give students time to try it, and adjust the explanation when they get stuck.” Point families to the current tutor cards and trial inquiry. Preserve testimonial text and attribution. Make /team resolve to the current tutor cards and keep /contact and /faq usable.

### Parent FAQ and contact

Add a parent FAQ linked from Get started and the footer. Cover what happens in a typical lesson, homework help, who teaches which courses, the trial, regular lesson rates and duration, inquiry follow-up, and cancellation. Use this confirmed policy verbatim: “Cancellations made less than 24 hours before the scheduled session are ineligible for refunds or make-up classes.” Publish a mailto link for thepischooltutoring@gmail.com in the FAQ, on contact, and in the footer. The public support address is independent of the configured Resend sender and recipient.

State that the first lesson is a 45-minute one-on-one trial. Use repository evidence or owner-supplied details for trial price, delivery format, cadence, and reply commitments. Where those details are missing, use family-facing wording that they will be confirmed before scheduling and list the open decisions in the handoff. Make clear that the inquiry requests follow-up and that scheduling happens after a reply. Retain server-side validation and minimal parent/guardian intake. Confirm receipt only after successful handling and give a clear direct-email fallback on failure. Keep credentials in the existing server-side configuration.

### Daily Challenge

Make the existing grade or course selector easy to find and use. Add one next-topic link at the end of a completed set. Use a reviewed prerequisite link when there is a known gap, and otherwise use a related reviewed topic when available. Use existing question and topic data, support guests, and avoid dead links or claims of diagnostic precision.

### Docs and staging checks

- Update `docs/FEATURE_ROADMAP.md` and the relevant project or implementation plan entries using the roadmap section above. Record Phase 2 as backlog.
- Run the repository’s lint, typecheck, build, and relevant tests. Verify mobile and keyboard access for the FAQ, tutor cards, and practice navigation.
- Verify /team, /faq, and /contact, consistency of tutor rates and durations, preservation of testimonials, and a completed practice journey at an elementary and an advanced level.
- Verify a staging inquiry reaches the configured inbox using clearly labeled test data, and verify success and failure handling. If staging access or email configuration prevents an end-to-end check, report the exact pending check and how to run it. Never include secret values in output.
- Report changed files, test results, staging verification status, and any unresolved owner inputs.
