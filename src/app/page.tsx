import Link from "next/link";
import testimonialArchive from "../../content/testimonials.json";

const testimonials = testimonialArchive.testimonials;

const plannedFeatures = [
  {
    number: "01",
    title: "Daily Quick Mind",
    description:
      "Short, focused math practice is planned for a future release. The first reviewed topics are still to be selected.",
    label: "Planned",
    symbol: "√",
    style: "feature-card-teal",
  },
  {
    number: "02",
    title: "Math opportunities",
    description:
      "A future guide to competitions, Olympiads, conferences, and other opportunities—with sources checked before publishing.",
    label: "Planned",
    symbol: "↗",
    style: "feature-card-gold",
  },
  {
    number: "03",
    title: "Math discoveries",
    description:
      "Research explainers, math news, and interesting facts are planned for a later phase.",
    label: "Planned",
    symbol: "∑",
    style: "feature-card-blue",
  },
  {
    number: "04",
    title: "Homework help",
    description:
      "A homework-help calendar is planned. No session schedule or registration is available in this preview.",
    label: "Planned",
    symbol: "□",
    style: "feature-card-cream",
  },
  {
    number: "05",
    title: "Daily Math Challenge",
    description:
      "A new original problem with progressive hints and a worked solution will be published each day after review.",
    label: "Preparing",
    symbol: "?",
    style: "feature-card-blue",
    href: "/daily-challenge",
  },
];

export default function Home() {
  return (
    <main id="main-content">
      <section aria-labelledby="hero-title" className="hero-section" id="home">
        <div className="hero-inner page-width">
          <div className="hero-copy">
            <p className="eyebrow">
              <span aria-hidden="true" className="eyebrow-dot" />
              A new chapter in math learning
            </p>
            <h1 id="hero-title">
              Build understanding.
              <br />
              <span>Grow confidence.</span>
              <br />
              Discover math.
            </h1>
            <p className="hero-description">
              A welcoming starting point for tutoring and a growing collection
              of ways to explore mathematics.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/tutoring">
                Explore tutoring <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-text" href="#explore">
                See what&apos;s planned <span aria-hidden="true">↓</span>
              </Link>
            </div>
            <p className="hero-note">
              Owner-reviewed student feedback is now shared below. Tutor
              details remain unpublished until verified.
            </p>
          </div>

          <div aria-hidden="true" className="hero-art">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <span className="math-spark spark-one">+</span>
            <span className="math-spark spark-two">·</span>
            <span className="math-spark spark-three">−</span>
            <div className="math-note">
              <span className="note-label">A little curiosity</span>
              <span className="note-equation">x + y = ?</span>
              <span className="note-caption">Start with a question.</span>
              <span className="note-stamp">π</span>
            </div>
            <div className="art-caption">
              <span className="caption-line" />
              Room to think, space to grow
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="hero-bottom-line" />
      </section>

      <section aria-labelledby="tutoring-title" className="tutoring-section" id="tutoring">
        <div className="section-grid page-width">
          <div className="section-intro">
            <p className="eyebrow eyebrow-dark">Start with the foundations</p>
            <h2 id="tutoring-title">
              Math makes more sense
              <br />
              <span>when it feels personal.</span>
            </h2>
            <p>
              The Pi School is preparing a clear, student-centered home for
              tutoring and math learning. Specific subjects, tutor information,
              and session availability will be added only after they are
              confirmed.
            </p>
            <Link className="inline-link" href="#explore">
              Explore what&apos;s taking shape <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="tutoring-details">
            <article className="tutoring-detail">
              <span aria-hidden="true" className="detail-icon icon-circle">
                01
              </span>
              <div>
                <h3>A thoughtful starting point</h3>
                <p>
                  A place to find a path into tutoring without guessing at
                  details that have not yet been verified.
                </p>
              </div>
            </article>
            <article className="tutoring-detail">
              <span aria-hidden="true" className="detail-icon icon-diamond">
                +
              </span>
              <div>
                <h3>Room for different formats</h3>
                <p>
                  Individual, semi-private, and group formats are listed in the
                  project source plan; current availability still needs
                  confirmation.
                </p>
              </div>
            </article>
            <article className="tutoring-detail">
              <span aria-hidden="true" className="detail-icon icon-square">
                π
              </span>
              <div>
                <h3>Built with care</h3>
                <p>
                  Student testimonials are displayed with their original wording
                  and attributions. Tutor details still need review.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title" className="features-section" id="explore">
        <div className="page-width">
          <div className="features-heading">
            <div>
              <p className="eyebrow eyebrow-dark">A little more to explore</p>
              <h2 id="features-title">
                More ways to meet
                <br />
                <span>the world of math.</span>
              </h2>
            </div>
            <p>
              These ideas are part of the roadmap—not live services yet. Each
              preview is labeled so it&apos;s clear what is planned.
            </p>
          </div>

          <div className="feature-grid">
            {plannedFeatures.map((feature) => (
              <article
                className={`feature-card ${feature.style}`}
                key={feature.number}
              >
                <div className="feature-topline">
                  <span className="feature-number">{feature.number}</span>
                  <span className="status-label">
                    <span aria-hidden="true" />
                    {feature.label}
                  </span>
                </div>
                <span aria-hidden="true" className="feature-symbol">
                  {feature.symbol}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.href ? (
                  <Link
                    aria-label={`Visit ${feature.title}`}
                    className="feature-arrow feature-card-link"
                    href={feature.href}
                  >
                    Explore <span aria-hidden="true">↗</span>
                  </Link>
                ) : (
                  <span aria-hidden="true" className="feature-arrow">
                    ↗
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="testimonials-title" className="preservation-section" id="testimonials">
        <div className="preservation-inner page-width">
          <div className="testimonials-heading">
            <p className="eyebrow">Feedback from students</p>
            <h2 id="testimonials-title">
              Real experiences.
              <br />
              <span>Original words.</span>
            </h2>
            <p>
              Owner-reviewed feedback, shown with its original wording and
              displayed attribution.
            </p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.id}>
                <span aria-hidden="true" className="testimonial-quote-mark">
                  “
                </span>
                <blockquote>{testimonial.quote}</blockquote>
                <div className="testimonial-attribution">
                  <p>{testimonial.displayedAttribution}</p>
                  <span>{testimonial.displayedSubject}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="next-step-title" className="closing-section">
        <div className="closing-inner page-width">
          <p className="eyebrow">The work starts with a good question</p>
          <h2 id="next-step-title">
            Ready to see where
            <br />
            <span>math can take you?</span>
          </h2>
          <p>
            Tutoring details and contact options will be added after the
            existing content has been reviewed.
          </p>
          <Link className="button button-light" href="/contact">
            Request tutoring <span aria-hidden="true">↑</span>
          </Link>
        </div>
        <span aria-hidden="true" className="closing-decoration closing-left">
          ∑
        </span>
        <span aria-hidden="true" className="closing-decoration closing-right">
          ∞
        </span>
      </section>
    </main>
  );
}
