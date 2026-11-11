# Math event directory: content and editorial workflow

The public directory is a curated starting collection, not comprehensive
worldwide coverage. It is not a registration service. Stable event-family
records and annual-edition records live separately in
`src/lib/events/data.ts`; the family record owns the name, aliases, organizer,
purpose, detailed type, official homepage, and preparation links. Edition
records point to a family and own edition-specific dates, eligibility, entry
pathway, participation, fees, routes, deadlines, sources, and review status.
`EventRecord` is a validated flattened read model for the public UI. Types,
runtime checks, public filtering, deadline handling, and URL-state helpers live
in `src/lib/events/schema.ts` and `src/lib/events/service.ts`. Public pages are
server-rendered. The directory receives published records and, when requested,
archived records; draft and in-review records are excluded. No database, CMS,
organizer-site scraping, or visitor-page network calls are used.

## Record and publication rules

Each family has a stable ID, aliases, organizer, purpose, detailed event type,
intended audiences, official homepage, and optional preparation links. Each
edition has a stable ID, family ID, edition year/season, optional round,
schedule with date-only support, mode and venues, separate entrant eligibility,
entry pathway, participation format, optional fee, local sessions, route-specific
registration information, preparation resources, source records, review dates,
editorial status, and review flags. A route can have its own purpose-specific
deadline, division, mode, status, source, and last-checked date. Keep
`informationUrl` for official route instructions
separate from `registrationUrl` for an actual signup form. Show “Register” only
when the route is direct and an actual registration URL is available. A
date-only deadline must not have a time or timezone.
Timed deadlines retain the organizer's local time and IANA timezone.

Only publish after checking the exact edition or round against an official
organizer, authorized national body, or designated official provider. Verify
the schedule, mode, venue, eligibility, route and status, deadline, and
preparation material where published. Add source URLs, the claims each source
supports, and the actual date checked. Represent unpublished facts as unknown
instead of filling them from a previous edition. A host country is not entrant
eligibility; online mode does not imply worldwide eligibility. Grade
equivalencies require an authoritative supporting source.

The shared US-grade filters include Kindergarten and Grades 1–12. When
recording a verified grade mapping, retain the organizer's exact grade/year
label in `label`, identify the mapped US grade with `usGradeId`, and cite a
source whose claims include `grade-mapping`. Do not map an event to an
elementary grade because it is online, hosted in a particular country, or has
a general school-student audience. A broad age range is not a US grade
equivalency. If the official rules do not explicitly support elementary
participants or a defensible sourced mapping, leave that grade unmapped; the
event should not match an elementary grade filter.

Schema validation checks data structure and source references; it is not
mathematical or editorial review. A valid record remains a draft until a
reviewer checks the claims and deliberately changes `editorialStatus` to
`published`. Never use test fixtures as event content.

## Manual editor workflow

1. Add a family to `eventFamilies` only once, with its stable ID, aliases,
   organizer, purpose, event type, audience, official homepage, and sourced
   preparation links. Add a separate edition to `eventEditions` with a stable
   ID, slug, and family ID. Start with
   `editorialStatus: "draft"`, unknown schedule/mode/eligibility/registration
   wherever official details are not yet available, and no inferred dates.
2. Verify the exact edition and route on official sources. Add each source
   under `sources`, assign a stable source ID, authority type, exact URL,
   actual `verifiedAt` date, and claim list. Link every registration route,
   resource, and verified grade mapping to its source ID.
   For US grade filters, add `usGradeId` only for an explicitly supported
   grade with an authoritative `grade-mapping` source. Preserve international
   school-year terms verbatim and leave equivalencies unset unless verified.
3. Keep venue geography, eligible countries/regions, audience, school-year
   wording, divisions, and age cutoffs in their own fields. Do not copy
   organizer descriptions or sample material unless its reuse is permitted.
   Treat submitted descriptions and URLs as untrusted; verify URLs and facts
   independently and allow only HTTPS official sources.
4. Run `npm run report:events` to surface missing publication information and
   overdue review dates. Then run `npm run test:events`, `npm run typecheck`,
   `npm run lint`, and `npm run build`. Review the generated detail page and
   source labels. Schema success alone is not approval.
5. After human review, change the record to `published`, set `lastVerified`
   to the actual review date, and choose a practical `nextReview`. Keep the
   route's status based on organizer information, not on whether a deadline is
   in the future.
6. Recheck active listings before their registration deadlines and event
   dates. In the first release, editors must perform and record checks
   manually; no link checker or recurring review job is implemented or
   scheduled. If a link breaks, dates change, or sources conflict, add the
   matching `reviewFlags` value and promptly correct, unpublish, or archive
   the record after review.
7. Archive an ended edition by changing its editorial status to `archived`.
   Keep its dates, sources, route history, and edition intact. Do not overwrite
   it with next year's edition; create a new record and stable slug.
8. Organizer submissions or future discovery tools must create drafts for
   review. Never automatically publish facts found in changed pages.

## Dates, statuses, and sorting

The UI always distinguishes event dates from registration deadlines. A
date-only deadline stays a date and is never represented as midnight. Timed
deadlines are converted using their IANA timezone; daylight-saving gaps and
ambiguous repeated local times are not guessed. A reliably elapsed timed
deadline is displayed as closed and flagged for organizer rechecking. A
date-only deadline is not automatically closed; if its date is past and the
organizer still reports an open-like status, the UI flags it for review without
inventing a closure instant.

Deadline sorting selects the earliest relevant **student-registration**
deadline after the active division, participation-mode, and route filters.
Host purchasing, organizer purchasing, and organizer license deadlines are not
student deadlines and are never used for student-deadline cards or sorting.
For timed routes it compares
the actual instants, including across time zones. If a timed and a date-only
deadline share a calendar date, timed entries sort first; date-only entries
remain date values. Closed and past timed routes are excluded from upcoming
deadline sorting. Unknown deadlines remain after known upcoming deadlines.
Other equal sort keys resolve by event name and then stable event or route ID.
The directory filters and sort are encoded in URL query parameters, and browser
back/forward restores the prior state.

## Source review and catalog update — 2026-11-10

The directory now has 12 published editions, two archived editions, and one
non-public draft. The published additions are the 2026–27 MATHCOUNTS series,
Berkeley Math Tournament 2026, MOEMS 2026–27, Noetic Learning Math Contest
Fall 2026 School Edition, and Primary Mathematics Challenge 2026. Berkeley
mini Math Tournament (BmMT) 2026 is archived. BMT and BmMT remain separate
families; the in-person and online routes, dates, and status are kept distinct
within their respective editions. The Math Kangaroo record remains the source
for verified U.S. Kindergarten–Grade 12 coverage; MOEMS adds Grades 4–8,
Noetic adds Grades 2–8, and MATHCOUNTS adds Grades 6–8.

Event facts are stored in the repository catalog at `src/lib/events/data.ts`,
not in page components. `src/app/events/page.tsx` reads published records from
that catalog, and the detail route reads the same records by slug. No event
families or edition facts were found embedded in a page component. The
source-review process is editorial and offline: review an organizer's
edition-specific pages, update the family/edition records and source claims,
record the actual check date, then run `npm run report:events`,
`npm run test:events`, `npm run typecheck`, `npm run lint`, and `npm run build`.
Check the directory search/details after a catalog update; page UI code should
not need to change for new or refreshed records. There is no automated page
scraper, import command, or scheduled source-refresh workflow.

### Official organizer pages checked on 2026-11-10

- [MATHCOUNTS rules and FAQ](https://www.mathcounts.org/programs/competition-rules-faq),
  [critical dates](https://www.mathcounts.org/programs/critical-dates),
  [registration](https://www.mathcounts.org/registration), and
  [chapter/state search](https://www.mathcounts.org/programs/chapter-state-competition-search):
  Grades 6–8, school/chapter/state/national schedule, 2027 national venue,
  school and Non-School Competitor routes, and the December 15 regular-rate
  registration deadline. Local chapter dates vary and the organizer updates
  its search page; the directory does not invent a local session.
- [BMT 2026 in-person](https://berkeley.mt/events/bmt-2026/) and
  [online](https://berkeley.mt/events/bmt-2026-online/): grade-12-and-below
  eligibility, separate dates, venues/mode, registration route, the
  in-person capacity/waitlist status, and online registration deadline.
- [BmMT 2026 in-person](https://berkeley.mt/events/bmmt-2026/) and
  [online](https://berkeley.mt/events/bmmt-2026-online/): Grade 8 and below,
  no lower age limit, distinct dates, worldwide entrant eligibility,
  registration routes/deadlines, and the Berkeley venue for the in-person
  edition. Both 2026 sessions are archived.
- [MOEMS](https://www.moems.org/): all five 2026–27 administration windows,
  Division E Grades 4–6, Division M Grades 6–8, up-to-35-student teams, paper
  and online formats, and the March 31 score-entry deadline. The enrollment
  link was not available at the checked URL; student enrollment status and
  deadline remain unconfirmed. Score-entry deadlines are not represented as
  student registration deadlines.
- [Noetic Learning contest details](https://www.noetic-learning.com/mathcontest/details.jsp),
  [FAQ](https://www.noetic-learning.com/mathcontest/faq.jsp), and
  [At-Home details](https://www.noetic-learning.com/mathcontest/details_athome.jsp):
  Fall 2026 dates, regular/late registration dates, school-team versus
  at-home routes, paper/online format, and official sample/past-test links.
  At-home participation is a separate format and does not qualify for official
  awards. Late registration had ended by the review date.
- [Primary Mathematics Challenge](https://www.primarymathschallenge.org.uk/pmc):
  November 9–20 window, ages 9–11, school-only ordering, worldwide school
  participation, online/PDF/paper modes, and separate paper-pack versus
  online/PDF order deadlines. Age eligibility is not mapped to a US grade.
- [MAA AMC overview](https://maa.org/student-programs/amc/) and
  [registration page](https://maa.org/amcreg/): current A/B and AMC 8 dates,
  eligibility, approved-site process, and manager/license deadlines. Site and
  student routes are not conflated.

Previously reviewed sources remain in the catalog: [Purple Comet](https://purplecomet.org/),
[IMO 2027](https://www.imo-official.org/editions/2027/), [COMC 2026](https://cms.math.ca/competitions/comc/comc2026/),
[Math Kangaroo USA](https://mathkangaroo.org/mks/), [UW Monthly Math Hour](https://sites.math.washington.edu/~mathcircle/mathhour/),
and [Australian Maths Trust](https://www.amt.edu.au/amc). The Australian 2027
edition remains a draft until its dates, eligibility, and route are published.

### Research backlog and coverage gaps

`src/lib/events/source-registry.ts` retains organizer leads for Newport High
School clubs (including the Knights of Pi/KPMT lead), Washington Student Math
Association, UW Math Hour, MAA AMC, Berkeley BMT/BmMT, Math Kangaroo, Noetic,
MOEMS, MATHCOUNTS, Purple Comet, COMAP, Waterloo CEMC, UKMT, Australian Maths
Trust, national olympiad organizers linked from IMO, Julia Robinson Math
Festival, Math Circle Network, Stanford festivals, MAA MathFest, and NCTM.
These source leads are not themselves verified active listings. In particular,
the Newport clubs page did not establish KPMT's current event dates, eligibility,
registration, or exact event identity, so no KPMT edition was published.

Additional organizer leads include Bebras, Bay Area Math Olympiad, Mandelbrot,
and SEAMO, all marked discovery-only pending edition-level review. The
following were not added as active events: Bebras' page did not render useful
content without JavaScript; WMTC was blocked by a CAPTCHA; North Star's
candidate domain did not resolve; Rocket City Math League domains were
ambiguous; Math League search results included stale material and similarly
named organizations; Online Math Open appeared inactive; Caribou Contests
appeared to have ceased operations; and the official international Kangaroo
organizer domain remains unresolved. Third-party directories (High School
Opportunity, PrepScholar, and general search results) were used only to find
leads; their claims were not imported as event facts.

Still open: verify an edition and registration details for KPMT and WSMA; check
MOEMS enrollment status through an accessible organizer enrollment page; review
the current Australian Maths Competition edition; expand verified CEMC, UKMT,
COMAP/modeling, Olympiad, student workshop/festival, MathFest, and NCTM
listings; and extend country-by-country coverage. The directory is not yet a
comprehensive global calendar. No student workshop, festival session, or
school-age conference was added without an official edition/session page.

The MAA registration page lists manager/site and license deadlines separately
from student enrollment; those are not represented as student deadlines.
Time-limited status should be rechecked after the stated date. The directory
has URL-backed filters, confirmed and “Eligibility to check” result groups,
archived editions, and student-purpose deadline sorting. `npm run
report:events` identifies missing information and overdue reviews. No
submission form, automated source monitor, or scheduled refresh is running.
