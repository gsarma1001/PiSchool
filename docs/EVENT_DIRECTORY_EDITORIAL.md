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

## Initial review coverage and limitations

The reviewed collection currently has seven published editions: MAA AMC 8,
AMC 10 B, and AMC 12 B (United States/Canada); Purple Comet! Math Meet 2027
(online, with its published eligibility restrictions); IMO 2027 (Budapest;
participant eligibility and participation mode remain unconfirmed); Math
Kangaroo USA 2027 (U.S. grades K–12, no next event date announced); and a
specific UW Monthly Math Hour student talk on November 22, 2026. The 2026
Canadian Open Mathematics Challenge is available only in the archive view. One
Australian Maths Competition 2027 record remains a non-public draft.

Official pages reviewed on 2026-11-08:

- [MAA AMC overview](https://maa.org/student-programs/amc/) — current
  2026–27 dates, published age/grade rules, approved-site and student
  registration instructions.
- [MAA AMC registration page](https://maa.org/amcreg/) — site/competition
  manager registration status and deadlines, verified on 2026-11-08.
- [Purple Comet! Math Meet](https://purplecomet.org/) and its
  [official FAQ](https://purplecomet.org/faq) — 2027 dates, online/international
  format, team supervision, and competitive/noncompetitive eligibility.
- [IMO 2027 official edition page](https://www.imo-official.org/editions/2027/)
  — edition, Budapest host location, and dates.
- [COMC 2026 official event page](https://cms.math.ca/competitions/comc/comc2026/)
  and [eligibility/proctoring page](https://cms.math.ca/competitions/comc/comc2026/eligibility/)
  — past edition dates, status, eligibility, proctoring, and official problem set.
- [Math Kangaroo USA competition page](https://mathkangaroo.org/mks/math-kangaroo-competition/)
  and [2027 registration page](https://mathkangaroo.org/mks/registration/) —
  U.S. grade eligibility, location restrictions, available routes, status, and
  published fee. The next contest date was not published in the reviewed pages.
- [UW Monthly Math Hour](https://sites.math.washington.edu/~mathcircle/mathhour/)
  — the November 22, 2026 talk, Grades 6–10 audience, Seattle venue, free
  attendance, and no-registration-required route.
- Berkeley Math Tournament and MATHCOUNTS official pages were checked as
  research leads but did not provide a reviewed edition record during this
  pass. Their source links, along with the remaining leads, remain in
  `src/lib/events/source-registry.ts`; a source lead is not a verified event
  listing.
- [Australian Maths Trust AMC overview](https://www.amt.edu.au/amc) — sufficient
  to identify the organizer and event series, but not to publish 2027 dates,
  mode, eligibility, or registration.

The MAA registration page confirmed site/competition-manager registration was
open when reviewed on 2026-11-08. It lists AMC 10 B and AMC 12 B additional
student-license bundle orders through 2026-11-12 at 11:59 PM ET, AMC 8 new
manager site registration through 2027-01-05 at 11:59 PM ET, and AMC 8 late
registration for returning managers through 2027-01-14 at 11:59 PM ET. These
are educator/site routes, not student entry deadlines. Student registration
availability, direct student links, and student deadlines remain unknown. The
AMC 8 additional-bundle deadline published for 2027-01-26 is conditional on a
site's scheduled contest date and is not represented as a universal deadline.
Timed open statuses are derived from the verified organizer status and close
after their cutoff; recheck source information near and after those dates.

The collection has no verified upcoming conference, student workshop, or
university tournament yet and does not provide country-by-country coverage.
Thirty-two source leads are recorded, not represented as checked events.
KPMT (Newport Knights of Pi Math Tournament), BMT (Berkeley Math Tournament),
and BmMT (Berkeley mini Math Tournament) are distinct opportunities; do not
merge their records or infer organizer, eligibility, or entry pathway from
similar names. This is an editorial research backlog, not an implemented
automation or publication schedule. Expand only when official,
edition-specific sources have been reviewed.

The directory offers URL-backed purpose views and filters, mobile event cards,
separate confirmed and “Eligibility to check” results, archived editions, and
student-purpose deadline sorting. `npm run report:events` reports missing
edition information and records whose next editorial review date has passed.
Future source imports and organizer submissions must enter human review; no
submission form or automated source-change monitor is running.
