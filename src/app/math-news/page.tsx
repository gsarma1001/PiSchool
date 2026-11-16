import type { Metadata } from "next";
import { MathNewsDirectory } from "./math-news-directory";

export const metadata: Metadata = {
  title: "Math news | The Pi School",
  description:
    "Reviewed stories about mathematical discoveries, achievements, and ideas from around the world.",
};

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
      </section>

      <MathNewsDirectory />
    </main>
  );
}
