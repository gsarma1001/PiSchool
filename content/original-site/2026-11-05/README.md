# Public source capture — 2026-11-05

This directory is a date-stamped archive of publicly accessible source
pages and linked public image assets. Files are source snapshots, not
edited publication copy. Do not edit them to reconcile or rewrite content;
put review notes in `docs/CONTENT_MIGRATION.md`.

## Captured pages

| Archive file | Source URL | HTTP |
|---|---|---:|
| `outer-domain.html` | <https://thepischools.com/> | 200 |
| `homepage.html` | <https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/> | 200 |
| `team.html` | <https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/team> | 200 |
| `faq.html` | <https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/faq> | 200 |
| `contact.html` | <https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/contact> | 200 |

The outer page is a frameset embedding the Azure Static Web App. The
captured HTML preserves the source page markup. FAQ answer bodies are
rendered by interactive accordions and are not present in the initial
HTML response; all seven were opened in the public page and their
displayed text is preserved separately in `content/faqs.json`.

The live homepage accessibility snapshot contained the six unique
testimonials in four repeated carousel copies each. Their exact displayed
text, attributions, and subjects are in `content/testimonials.json`;
three duplicate copies per quote (18 total) are represented once there.

## Captured images

| Archive file | Source URL | Displayed use |
|---|---|---|
| `assets/logo-nobg.png` | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/_app/immutable/assets/logo-nobg.DAz_tsNE.png` | Shared header/footer logo; source alt text is `SAHF logo` / `Logo` |
| `assets/team/abhay.DWXHMbmy.jpg` | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/_app/immutable/assets/abhay.DWXHMbmy.jpg` | Abhay |
| `assets/team/aanya.Dl_Qlea1.jpg` | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/_app/immutable/assets/aanya.Dl_Qlea1.jpg` | Aanya |
| `assets/team/samya.DfgZbpVX.jpg` | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/_app/immutable/assets/samya.DfgZbpVX.jpg` | Samya |
| `assets/team/chandan.D0epL_C-.jpg` | `https://purple-wave-0b8d2aa1e.6.azurestaticapps.net/_app/immutable/assets/chandan.D0epL_C-.jpg` | Chandan C. |
| `assets/testimonial-avatar-saket.png` | `https://avatar.vercel.sh/saket` | Saket L testimonial avatar |
| `assets/testimonial-avatar-ishand.png` | `https://avatar.vercel.sh/ishand` | Ishan D testimonial avatar |
| `assets/testimonial-avatar-tanishar.png` | `https://avatar.vercel.sh/tanishar` | Tanisha R testimonial avatar |
| `assets/testimonial-avatar-ashwinm.png` | `https://avatar.vercel.sh/ashwinm` | Ashwin M testimonial avatar |
| `assets/testimonial-avatar-vidhu.png` | `https://avatar.vercel.sh/vidhu` | Vidhu testimonial avatar |
| `assets/testimonial-avatar-bhai.png` | `https://avatar.vercel.sh/bhai` | Bhai testimonial avatar |

## URL and access observations

The linked public routes discovered in the shared navigation/footer are
`/`, `/team`, `/faq`, and `/contact`. The homepage also links to the
`#features` anchor. Direct checks of `/about`, `/testimonials`, and
`/tutoring` on the Azure host returned HTTP 404. `robots.txt` and
`sitemap.xml` were also unavailable (HTTP 404).

The embedded site's canonical metadata names
`https://thepischool.com/` (singular), whereas the requested outer site is
`https://thepischools.com/` (plural). This mismatch needs owner review;
the archive does not assume either domain should be changed.

## Private records

No private submissions, client email addresses, scheduling records,
unpublished feedback, or account data were accessed or copied into this
archive. See `docs/CONTENT_MIGRATION.md` for the separate owner export
checklist.
