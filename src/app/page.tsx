import Link from "next/link";
import testimonialArchive from "../../content/testimonials.json";

const testimonials = testimonialArchive.testimonials;

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
              sense through advanced courses.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/contact">
                Request a trial lesson <span aria-hidden="true">↗</span>
              </Link>
            </div>
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

      <section aria-labelledby="testimonials-title" className="preservation-section" id="testimonials">
        <div className="preservation-inner page-width">
          <div className="testimonials-heading">
            <p className="eyebrow">Feedback from students</p>
            <h2 id="testimonials-title">
              Real experiences.
              <br />
              <span>Original words.</span>
            </h2>
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

    </main>
  );
}
