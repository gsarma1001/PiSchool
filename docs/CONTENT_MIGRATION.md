# Content migration tracker

This tracker distinguishes captured public source material from private records and content that still needs owner review. The archive is a preservation copy, not approved publication copy.

## Capture status

- **Capture date:** 2026-11-05
- **Public capture:** Complete for the accessible pages and assets listed below.
- **Reconciliation:** Six unique homepage testimonials captured from the public carousel, plus one additional testimonial supplied by the owner. Seven testimonial cards are approved for the local rebuild. Seven expanded FAQ entries were captured.
- **Next required project phase:** Content preservation remains active until the owner reviews flagged items and locates any private records worth retaining.
- **Live site:** No live website, domain, DNS, or content was changed.

The requested site is `https://thepischools.com/`. It serves an outer frameset that embeds `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/`. `picampus-school.com` is unrelated and is not part of this archive. A separate research agent mistakenly opened that site during investigation; its content was not included or used as source material.

## Archived public sources

The immutable page snapshots, linked image assets, and capture notes are under `content/original-site/2026-11-05/`.

| Page or content | Source | Archive | Status and notes |
|---|---|---|---|
| Outer domain | `https://thepischools.com/` | `outer-domain.html` | Captured; HTML frameset points to the Azure-hosted site. |
| Homepage | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/` | `homepage.html` | Captured; includes public page content and navigation. |
| Team | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/team` | `team.html` | Captured; four tutor biographies and public profile content are in the snapshot. |
| FAQ | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/faq` | `faq.html`, `faq-expanded-transcript.md`, and `content/faqs.json` | Captured; all seven interactive answers were expanded and recorded. |
| Contact | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/contact` | `contact.html` | Captured; public contact links and page claims are preserved. |
| Logo, tutor photos, testimonial avatars | Azure-hosted image URLs and `https://avatar.vercel.sh/` URLs | `assets/` | Logo, four tutor photographs, and six displayed testimonial avatars saved. Source URLs and uses are recorded in the archive README. |

All five page requests returned HTTP 200. The accessible navigation routes are `/`, `/team`, `/faq`, and `/contact`; the homepage also links to `#features`. Direct checks of `/about`, `/testimonials`, `/tutoring`, `robots.txt`, and `sitemap.xml` on the Azure host returned HTTP 404. The accessible homepage and linked pages contained no additional testimonial records.

## Testimonial reconciliation

`content/testimonials.json` contains the exact quote text, displayed attribution, subject, and review status. Six records were captured from the homepage with source URL and capture date; the seventh was supplied by the owner and is identified as owner-provided without an invented source URL or capture date. The original homepage source copy remains in the archive.

| Displayed attribution | Exact displayed subject |
|---|---|
| Saket L | AP Calculus AB |
| Ishan D | Algebra 2 |
| Tanisha R | Calculus 1 \| Math 151 |
| Ashwin M | Algebra 2 |
| Vidhu | Algebra 1 |
| Anonymous | Algebra 1 |
| Bhai | @Bhai |

The rendered scrolling carousel displayed **24 cards: six unique source testimonials, each shown four times**. The structured archive retains one copy of each and omits the **18 repeated display copies**. The owner added and reviewed one additional testimonial, bringing the local publication set to seven. All seven have owner approval for publication in the local rebuild; this does not change the live site.

## Content captured but requiring owner review

- **Tutor profiles:** Abhay, Aanya, Samya, and Chandan C. are shown as “NCHS Junior.” Confirm current bios, school/year references, consent, and availability before reuse.
- **Public contact details conflict:** the contact page links to `tel:+1234567890` and `mailto:info@thepischool.com`; the FAQ links to `thepischool@gmail.com`. Confirm the correct public phone and email. The phone number appears placeholder-like and must not be published without verification.
- **Domain metadata conflict:** the embedded pages use canonical URLs on `https://thepischool.com/` (singular), while the requested outer site is `https://thepischools.com/` (plural). Confirm the intended domain; no domain changes were made.
- **Unverified claims:** the archived pages include academic outcome claims (including GPA and AP results), “24/7 Support,” and “50+ students.” Verify evidence and approval before any reuse.
- **Testimonials:** seven cards are owner-approved and displayed in the local rebuild. The six public-source quotes retain their archive provenance; the additional owner-provided item has no external source URL or capture date recorded.

## Missing and private records

No private records were accessed or copied into Git. Public-page capture is not a backup of private service data. If records should be retained, locate and export them directly from the service(s) originally used:

- Contact-form submissions and inquiry history, if a form provider or database was configured.
- Client/student names, email addresses, phone numbers, and other contact records.
- Tutoring schedules, attendance, booking or cancellation records, and calendar entries.
- Email correspondence and any unpublished feedback, testimonials, or consent records.
- Account, payment, or other client records held by a provider.

The public pages do not establish which services hold these records. Check the original hosting/cloud account, form or scheduling provider, business email inbox, and any payment/account provider. Keep any export in an owner-controlled private location outside the repository; `/content/private/` is gitignored if used locally. Do not commit private records.

## Reconciliation checklist

- [x] Archive the requested outer site and accessible homepage, team, FAQ, and contact pages.
- [x] Capture the logo, tutor photos, and displayed testimonial avatars with source URLs.
- [x] Record all seven expanded FAQ answers.
- [x] Capture and deduplicate the six unique testimonials; reconcile the 24-card carousel display.
- [x] Add the owner-provided testimonial and approve all seven for local publication.
- [x] Record accessible routes, unavailable routes, and the canonical-domain discrepancy.
- [x] List private-record categories separately without copying private data.
- [x] Flag claims, tutor details, contact details, and testimonials for owner review.
- [ ] Owner review of current team information, contact details, and outcome claims.
- [ ] Owner locates and exports any private records that should be retained.

## Archive index

See `content/original-site/2026-11-05/README.md` for the detailed file inventory, source asset URLs, and capture notes. Structured public content is in `content/testimonials.json` and `content/faqs.json`.
