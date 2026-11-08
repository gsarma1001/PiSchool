import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tutoring | The Pi School",
  description:
    "Explore the math tutoring scope and session formats described by The Pi School.",
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
          skills through advanced classes such as AP Calculus. It does not
          provide an exhaustive subject list, so tell us the course or topic
          you’re asking about.
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
          </div>
        </div>
      </section>
    </main>
  );
}
