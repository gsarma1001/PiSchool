import Link from "next/link";
import testimonialArchive from "../../content/testimonials.json";

const testimonials = testimonialArchive.testimonials;

const plannedFeatures = [
  {
    number: "01",
    title: "Schedule your first trial lesson",
    description:
      "Tell us about the student’s grade or course and the math support you’re looking for.",
    label: "Get started",
    symbol: "π",
    style: "feature-card-teal",
    href: "/contact",
    linkLabel: "Get started",
  },
  {
    number: "02",
    title: "Math opportunities",
    description:
      "Browse math competitions, Olympiads, conferences, and other events, with official details and eligibility clearly shown.",
    label: "Explore",
    symbol: "↗",
    style: "feature-card-gold",
    href: "/events",
    linkLabel: "Browse math events",
  },
  {
    number: "03",
    title: "Math news",
    description:
      "Read reviewed stories about mathematical discoveries, achievements, and ideas from around the world.",
    label: "Read stories",
    symbol: "∑",
    style: "feature-card-blue",
    href: "/math-news",
    linkLabel: "Read math news",
  },
  {
    number: "04",
    title: "Homework help",
    description:
      "Tell us what you need help with. For now, homework questions go through our tutoring inquiry form.",
    label: "Send an inquiry",
    symbol: "□",
    style: "feature-card-cream",
    href: "/contact",
    linkLabel: "Ask for homework help",
  },
  {
    number: "05",
    title: "Daily Challenge",
    description:
      "Practice with five daily questions, supportive feedback, hints, and worked solutions.",
    label: "Practice now",
    symbol: "?",
    style: "feature-card-blue",
    href: "/daily-challenge",
    linkLabel: "Open Daily Challenge",
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
              A welcoming place to explore mathematics, from early number
              sense through advanced courses. Find out what practice and
              tutoring information is currently available.
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
            <p className="eyebrow eyebrow-dark">
              Kindergarten through advanced math
            </p>
            <h2 id="tutoring-title">
              Math makes more sense
              <br />
              <span>when it feels personal.</span>
            </h2>
            <p>
              The Pi School is preparing a clear, student-centered home for
              math tutoring and learning. The source FAQ describes support
              from foundational skills through advanced classes; exact subjects,
              tutor information, and current availability still need confirmation.
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
              Explore tutoring, practice, math events, and stories. Each card
              links to the relevant page or inquiry form.
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
                    aria-label={feature.linkLabel ?? `Explore ${feature.title}`}
                    className="feature-arrow feature-card-link"
                    href={feature.href}
                  >
                    {feature.linkLabel ?? "Explore"} <span aria-hidden="true">↗</span>
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
