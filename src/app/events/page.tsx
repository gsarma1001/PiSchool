import type { Metadata } from "next";
import Link from "next/link";
import { EventsDirectory } from "./events-directory";
import { parseEventFilters, serializeEventFilters } from "@/lib/events/service";
import { getPublishedEventSummaries } from "@/lib/events/data";

export const metadata: Metadata = {
  title: "Math events | The Pi School",
  description:
    "Explore math competitions, workshops, festivals, and more from Kindergarten through advanced mathematics.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
  }
  const initialQuery = serializeEventFilters(parseEventFilters(params)).toString();

  return (
    <main id="main-content" className="events-page">
      <section className="events-heading page-width">
        <p className="eyebrow">Explore mathematics</p>
        <h1>Find your next math opportunity</h1>
        <p className="public-lede">
          Explore competitions, workshops, festivals, and more—from Kindergarten through
          advanced mathematics.
        </p>
        <p className="events-heading-links">
          <Link href="/events/guides">New to math events? Start here.</Link>
        </p>
        <p className="events-source-note">
          Details checked against organizer sources. Confirm current rules before registering.
        </p>
      </section>
      <EventsDirectory
        initialQuery={initialQuery}
        initialEvents={getPublishedEventSummaries(true)}
      />
    </main>
  );
}
