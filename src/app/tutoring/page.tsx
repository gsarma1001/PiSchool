import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutoring | The Pi School",
  description:
    "Ask about math tutoring from foundational skills through advanced courses. Current subjects and availability need confirmation.",
};

const sessionFormats = [
  {
    title: "One-on-one tutoring",
    description: "Individual support tailored to a student’s needs.",
  },
  {
    title: "Semi-private tutoring",
    description: "Two students learning together at a similar level.",
  },
  {
    title: "Group tutoring",
    description: "Groups of three or more students at a similar level.",
  },
];

export default function TutoringPage() {
  return (
    <main className="public-page" id="main-content">
      <section aria-labelledby="tutoring-page-title" className="public-hero page-width">
        <p className="eyebrow eyebrow-dark">Math tutoring</p>
        <h1 id="tutoring-page-title">
          Find a way to learn
          <br />
          <span>that fits your needs.</span>
        </h1>
        <p className="public-lede">
          The Pi School’s source FAQ describes math tutoring from foundational
          skills through advanced classes such as AP Calculus. This broad scope
          includes questions from Kindergarten through college and advanced
          math; it is not a guarantee that every grade or course is currently
          available. Tell us the student’s US grade or course so the team can
          confirm whether it can help.
        </p>
        <Link className="button button-primary" href="/contact">
          Request tutoring <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section aria-labelledby="formats-title" className="public-section">
        <div className="page-width">
          <div className="public-section-heading">
            <p className="eyebrow eyebrow-dark">Session formats</p>
            <h2 id="formats-title">Learn together or one-on-one.</h2>
          </div>
          <div className="service-grid">
            {sessionFormats.map((format) => (
              <article className="service-card" key={format.title}>
                <h3>{format.title}</h3>
                <p>{format.description}</p>
              </article>
            ))}
          </div>

          <div className="service-note">
            <h3>What the source FAQ says</h3>
            <p>
              Sessions are described as one hour, typically once a week, with
              frequency adjustable by need. Most classes are described as
              online, with some in-person accommodations in Bothell and
              Redmond.
            </p>
            <p>
              These details were captured from the existing public FAQ. Please
              ask about current subjects, format, location, and availability;
              the owner has not yet reconfirmed them for the new site.
            </p>
            <p>
              For a younger student, a parent or guardian can send the inquiry.
              Share only a grade or course and the kind of math support needed;
              do not include a child’s full name or sensitive personal details.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
