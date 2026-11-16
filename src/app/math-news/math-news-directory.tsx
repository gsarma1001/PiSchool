"use client";

import { useMemo, useState } from "react";
import {
  mathNewsStories,
  type MathNewsAudience,
} from "@/lib/math-news/data";

const audiences: { id: MathNewsAudience | ""; label: string }[] = [
  { id: "", label: "All readers" },
  { id: "K-2", label: "Kindergarten–Grade 2" },
  { id: "grades-3-5", label: "Grades 3–5" },
  { id: "grades-6-8", label: "Grades 6–8" },
  { id: "grades-9-12", label: "Grades 9–12" },
  { id: "college-adults", label: "College / adults" },
];

const paywallLabels = {
  "not-observed": "Paywall not observed during review",
  "abstract-only": "Abstract checked; full-text access not confirmed",
  unconfirmed: "Paywall status not confirmed",
} as const;

function sortableDate(value: string): string {
  const [year, month = "00", day = "00"] = value.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function formatDate(value: string): string {
  const parts = value.split("-");
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) {
    const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, 1));
    return new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function audienceLabel(audience: MathNewsAudience): string {
  return audiences.find((item) => item.id === audience)?.label ?? audience;
}

export function MathNewsDirectory() {
  const [audience, setAudience] = useState<MathNewsAudience | "">("");
  const stories = useMemo(
    () =>
      mathNewsStories
        .filter((story) => !audience || story.audience === audience)
        .sort((left, right) =>
          sortableDate(right.publishedOn).localeCompare(
            sortableDate(left.publishedOn),
          ),
        ),
    [audience],
  );

  return (
    <>
      <div className="math-news-filters page-width">
        <label htmlFor="math-news-audience">Stories for</label>
        <select
          id="math-news-audience"
          onChange={(event) => {
            const selectedAudience = audiences.find(
              (option) => option.id === event.target.value,
            );
            setAudience(selectedAudience?.id ?? "");
          }}
          value={audience}
        >
          {audiences.map((option) => (
            <option key={option.id || "all"} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p aria-atomic="true" aria-live="polite">
          Showing {stories.length} {stories.length === 1 ? "story" : "stories"},
          newest first.
        </p>
      </div>

      <section
        aria-label="Reviewed math news stories"
        className="math-news-list page-width"
      >
        {stories.length ? (
          stories.map((story) => (
            <article className="math-news-card" key={story.id}>
              <div className="math-news-card-meta">
                <span className="event-badge">{story.category}</span>
                <span className="event-badge">{audienceLabel(story.audience)}</span>
                <time dateTime={story.publishedOn}>
                  Published {formatDate(story.publishedOn)}
                </time>
              </div>
              <h2>{story.title}</h2>
              <p>{story.summary}</p>
              {story.tryThis && (
                <p className="math-news-try-this">
                  <strong>Try this:</strong> {story.tryThis}
                </p>
              )}
              <p className="math-news-source">
                Publisher: {story.publisher} · Reviewed {formatDate(story.reviewedOn)}
                {" · "}
                {paywallLabels[story.paywallStatus]}
              </p>
              <a href={story.sourceUrl} rel="noreferrer" target="_blank">
                Read the original story <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))
        ) : (
          <div className="events-empty" role="status">
            <h2>No stories for this audience yet</h2>
            <p>Choose another audience to see the reviewed Math News collection.</p>
          </div>
        )}
      </section>
    </>
  );
}
