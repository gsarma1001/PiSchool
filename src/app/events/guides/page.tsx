import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beginner guides to math events | The Pi School",
  description:
    "Friendly guides to choosing a math event, preparing, understanding eligibility, and registering.",
};

const guides = [
  {
    id: "choose",
    title: "Choosing an event that fits",
    paragraphs: [
      "Start with what sounds interesting: solving problems, learning with a team, sharing research, or meeting other math learners. Then compare the event's level, format, experience expected, and the time you can set aside.",
      "Read the organizer's eligibility rules before planning. A host country is not automatically an eligible country, and an online event may still restrict who can enter. Ask a parent, teacher, or organizer when a rule is unclear.",
      "For younger students, a parent or guardian can help compare the official age, grade, and division rules. The directory uses US grade filters only when a published mapping is verified; otherwise, it keeps the organizer's original school-year wording.",
    ],
  },
  {
    id: "event-types",
    title: "Competitions, Olympiads, tournaments, workshops, and conferences",
    paragraphs: [
      "The directory groups opportunities by purpose: Compete; Learn & Explore; and Conferences & Educator Events. Competitions, tournaments, Olympiads, and modeling challenges appear under Compete. Student workshops, math circles, festivals, and community talks appear under Learn & Explore.",
      "A workshop's audience matters: a student workshop belongs under Learn & Explore, while a teacher workshop belongs under Conferences & Educator Events. Conferences and research meetings are grouped there too. Check the audience on the official event page.",
      "The word Olympiad does not tell you how to enter. Listings distinguish open entry, qualification required, and invitation only only when the organizer's rules support that pathway.",
    ],
  },
  {
    id: "prepare",
    title: "Preparing with official materials",
    paragraphs: [
      "When available, begin with official sample questions or past papers for your division. Try a few problems without a timer first, then use the organizer's timing and rules to practice.",
      "Use answer keys and worked solutions from the organizer or an authorized source. A directory link points to the source; it does not mean Pi School owns or reproduces those materials.",
    ],
  },
  {
    id: "register",
    title: "Understanding registration routes",
    paragraphs: [
      "Some events are open entry. Others require qualification or an invitation. Registration may be direct or go through a school, approved test center, team supervisor, or host. Follow the route and entry pathway named by the organizer; they are related but not interchangeable.",
      "For international finals, ask whether your country has a national organizer or selection process. An event listing is not a promise that every visitor can register.",
      "Families supporting a younger participant can check with the school or event organizer about supervision and the permitted entry route. Do not assume a school-age event accepts elementary students unless its official rules say so.",
    ],
  },
  {
    id: "dates",
    title: "Deadlines, time zones, divisions, and school years",
    paragraphs: [
      "Event dates and registration deadlines are different. A date-only deadline has no published cutoff time, so do not assume a midnight closing time. If an organizer gives a time, read it in the organizer's stated time zone.",
      "Read the rules for the exact division and entry route you plan to use. School-year labels vary by country, and age cutoffs may use a specific reference date. Do not rely on an unverified grade-equivalency chart.",
      "If a young student needs help, a parent or guardian can read the organizer's instructions with them. A grade filter showing no events means this curated collection has no matching verified entries; it does not mean no events exist elsewhere.",
    ],
  },
];

export default function EventGuidesPage() {
  return (
    <main id="main-content" className="events-page">
      <section className="events-heading page-width">
        <p className="eyebrow">A welcoming first step</p>
        <h1>Beginner guides to math events</h1>
        <p className="public-lede">
          You do not need to know everything before exploring. These guides help families
          compare opportunities and find the organizer&apos;s own instructions.
        </p>
        <p className="events-heading-links"><Link href="/events">Browse the curated directory</Link></p>
      </section>
      <section className="event-guides page-width" aria-label="Math event guides">
        <nav className="event-guide-toc" aria-label="On this page">
          {guides.map((guide) => <a href={`#${guide.id}`} key={guide.id}>{guide.title}</a>)}
        </nav>
        {guides.map((guide) => (
          <article className="event-guide-section" id={guide.id} key={guide.id}>
            <h2>{guide.title}</h2>
            {guide.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </article>
        ))}
        <p className="event-detail-note">
          Event-specific rules, eligibility, and deadlines can change. Always use the current
          official organizer information before making plans.
        </p>
      </section>
    </main>
  );
}
