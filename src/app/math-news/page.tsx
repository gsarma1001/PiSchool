import type { Metadata } from "next";
import Link from "next/link";
import { mathNewsStories } from "@/lib/math-news/data";

export const metadata: Metadata = {
  title: "Math news | The Pi School",
  description:
    "Reviewed stories about mathematical discoveries, achievements, and ideas from around the world.",
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export default function MathNewsPage() {
  return (
    <main className="events-page" id="main-content">
      <section aria-labelledby="math-news-title" className="events-heading page-width">
        <p className="eyebrow">Mathematics around the world</p>
        <h1 id="math-news-title">Math news</h1>
        <p className="public-lede">
          Discoveries, achievements, and ideas from across mathematics. Each
          story is summarized for readers and links to its original reporting.
        </p>
        <p className="events-heading-links">
          <Link href="/#explore">Back to Explore</Link>
        </p>
      </section>

      <section
        aria-label="Reviewed math news stories"
        className="math-news-list page-width"
      >
        {mathNewsStories.map((story) => (
          <article className="math-news-card" key={story.id}>
            <div className="math-news-card-meta">
              <span className="event-badge">{story.category}</span>
              <time dateTime={story.publishedOn}>
                Published {formatDate(story.publishedOn)}
              </time>
            </div>
            <h2>{story.title}</h2>
            <p>{story.summary}</p>
            <p className="math-news-source">
              Source: {story.publisher} · Reviewed {formatDate(story.reviewedOn)}
            </p>
            <a href={story.sourceUrl} rel="noreferrer" target="_blank">
              Read the original story <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
