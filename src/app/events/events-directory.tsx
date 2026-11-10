"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { EventPurpose, EventSummary } from "@/lib/events/schema";
import { eventCategories } from "@/lib/events/schema";
import { usGradeFilterOptions } from "@/lib/curriculum";
import {
  eventModeLabel,
  filterAndSortEvents,
  formatEventSchedule,
  formatDeadline,
  getRouteStatus,
  parseEventFilters,
  routeMatchesFilters,
  serializeEventFilters,
  type DeadlineChoice,
  type EventFilters,
} from "@/lib/events/service";

type Props = {
  initialQuery: string;
  initialEvents: EventSummary[];
};

const purposes: { id: EventPurpose | ""; label: string }[] = [
  { id: "", label: "All events" },
  { id: "compete", label: "Compete" },
  { id: "learn-explore", label: "Learn & Explore" },
  { id: "conference-educator", label: "Conferences & Educator Events" },
];

const categoryLabels: Record<(typeof eventCategories)[number], string> = {
  conference: "Conference",
  competition: "Competition",
  olympiad: "Olympiad",
  tournament: "Tournament",
  "modeling-challenge": "Modeling challenge",
  workshop: "Workshop",
  "educator-workshop": "Educator workshop",
  "research-meeting": "Research meeting",
  "math-circle": "Math circle",
  festival: "Festival",
  "student-talk": "Student talk",
};

const routeLabels: Record<string, string> = {
  direct: "Direct",
  school: "Through a school or host",
  "test-center": "Through a test center",
  team: "Team entry",
  qualification: "Qualification route",
  invitation: "Invitation",
  other: "See event details",
};

const audienceLabels: Record<string, string> = {
  "school-students": "Students",
  educators: "Educators",
  researchers: "Researchers",
  "general-public": "Students and community",
};

const pathwayLabels: Record<string, string> = {
  "open-entry": "Open entry",
  "qualification-required": "Qualification required",
  "invitation-only": "Invitation only",
  unknown: "Entry pathway unconfirmed",
};

function firstRoute(event: EventSummary) {
  return event.registrationRoutes.find((route) =>
    route.audience !== "educators" && route.audience !== "researchers",
  ) ?? event.registrationRoutes[0];
}

function relevantRoute(
  event: EventSummary,
  filters: EventFilters,
  deadline: DeadlineChoice | undefined,
) {
  if (deadline) return deadline.route;
  return event.registrationRoutes.find((route) =>
    routeMatchesFilters(event, route, filters),
  ) ?? firstRoute(event);
}

function audienceText(event: EventSummary): string {
  const audiences = [...new Set(event.eligibility.audiences)];
  return audiences.map((audience) => audienceLabels[audience] ?? audience).join(", ") ||
    "Audience not confirmed";
}

function countryName(code: string): string {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
}

function eligibilityText(event: EventSummary): string {
  if (!event.eligibility.confirmed) return "Eligibility to check";
  const grades = event.eligibility.schoolYearLabels.join(", ");
  const ages = event.eligibility.ageRestrictions.join("; ");
  return [grades, ages].filter(Boolean).join(" · ") || "See organizer eligibility rules";
}

function venueSummary(event: EventSummary): string {
  if (event.mode === "online") return "Online";
  const venues = event.venues.map((venue) => {
    const place = [...new Set([venue.city, venue.region, venue.country].filter(Boolean))].join(", ");
    return place || venue.description;
  });
  return [eventModeLabel(event.mode), ...venues].join(" · ");
}

function registrationText(event: EventSummary, route: ReturnType<typeof firstRoute>, now: Date) {
  if (event.editorialStatus === "archived") return "Past edition";
  if (!route) return "Registration status unconfirmed";
  const liveStatus = getRouteStatus(route, now);
  const status = liveStatus.status;
  if (
    status === "open" &&
    (liveStatus.needsReview || event.nextReview < now.toISOString().slice(0, 10))
  ) return "Registration status unconfirmed";
  if (status === "open") return "Registration open";
  if (status === "not-yet-open") return "Registration not yet open";
  if (status === "closed") return "Registration closed";
  if (status === "waitlist") return "Waitlist";
  if (status === "not-required") return "No registration required";
  return "Registration status unconfirmed";
}

function studentDeadline(event: EventSummary, route: ReturnType<typeof firstRoute>, deadline?: DeadlineChoice) {
  if (deadline) return formatDeadline(deadline.deadline);
  const knownDeadline = route?.deadline?.purpose === "student-registration"
    ? route.deadline
    : event.registrationRoutes.find((item) => item.deadline?.purpose === "student-registration")?.deadline;
  if (knownDeadline) return formatDeadline(knownDeadline);
  const note = route?.deadlineNote ??
    event.registrationRoutes.find((item) => item.deadlineNote)?.deadlineNote;
  if (note) return note;
  return "Student registration deadline not announced";
}

function activeFilters(filters: EventFilters): { key: keyof EventFilters; label: string }[] {
  const chips: { key: keyof EventFilters; label: string }[] = [];
  if (filters.query) chips.push({ key: "query", label: `Search: ${filters.query}` });
  if (filters.purpose) chips.push({ key: "purpose", label: purposes.find((item) => item.id === filters.purpose)?.label ?? filters.purpose });
  if (filters.level) chips.push({ key: "level", label: `Grade/age: ${usGradeFilterOptions.find((item) => item.id === filters.level)?.label ?? filters.level}` });
  if (filters.venueCountry) chips.push({ key: "venueCountry", label: `Venue country: ${filters.venueCountry}` });
  if (filters.venueRegion) chips.push({ key: "venueRegion", label: `Venue region: ${filters.venueRegion}` });
  if (!filters.includeOnline) chips.push({ key: "includeOnline", label: "Online opportunities excluded" });
  if (filters.mode) chips.push({ key: "mode", label: `Format: ${filters.mode}` });
  if (filters.participationFormat) chips.push({ key: "participationFormat", label: `Participation: ${filters.participationFormat}` });
  if (filters.category) chips.push({ key: "category", label: `Type: ${categoryLabels[filters.category as keyof typeof categoryLabels] ?? filters.category}` });
  if (filters.audience) chips.push({ key: "audience", label: `Audience: ${audienceLabels[filters.audience] ?? filters.audience}` });
  if (filters.division) chips.push({ key: "division", label: `Division: ${filters.division}` });
  if (filters.registrationRoute) chips.push({ key: "registrationRoute", label: `Route: ${routeLabels[filters.registrationRoute] ?? filters.registrationRoute}` });
  if (filters.eligibleCountry) chips.push({ key: "eligibleCountry", label: `Eligibility country: ${filters.eligibleCountry}` });
  if (filters.eligibleRegion) chips.push({ key: "eligibleRegion", label: `Eligibility region: ${filters.eligibleRegion}` });
  if (filters.from) chips.push({ key: "from", label: `From: ${filters.from}` });
  if (filters.to) chips.push({ key: "to", label: `Through: ${filters.to}` });
  if (filters.registrationStatus) chips.push({ key: "registrationStatus", label: `Status: ${filters.registrationStatus}` });
  if (filters.entryPathway) chips.push({ key: "entryPathway", label: pathwayLabels[filters.entryPathway] ?? filters.entryPathway });
  if (filters.freeOnly) chips.push({ key: "freeOnly", label: "Free only" });
  if (filters.includeUnknown) chips.push({ key: "includeUnknown", label: "Include eligibility to check" });
  if (filters.archived) chips.push({ key: "archived", label: "Include archived editions" });
  if (filters.sort !== "date") chips.push({ key: "sort", label: `Sort: ${filters.sort === "name" ? "name" : "student deadline"}` });
  return chips;
}

export function EventsDirectory({ initialQuery, initialEvents }: Props) {
  const [filters, setFilters] = useState<EventFilters>(() =>
    parseEventFilters(new URLSearchParams(initialQuery)),
  );
  const [queryInput, setQueryInput] = useState(filters.query);
  const [now, setNow] = useState(() => new Date());
  const divisions = Array.from(new Set(initialEvents.flatMap((event) => [
    ...event.eligibility.divisions,
    ...event.registrationRoutes.flatMap((route) => route.division ? [route.division] : []),
    ...(event.round ? [`round:${event.round}`] : []),
  ]))).sort();
  const venueCountries = Array.from(new Map(initialEvents.flatMap((event) =>
    event.venues.flatMap((venue) => venue.countryCode && venue.country
      ? [[venue.countryCode, venue.country] as const]
      : []),
  ))).sort((a, b) => a[1].localeCompare(b[1]));
  const venueRegions = Array.from(new Set(initialEvents.flatMap((event) =>
    event.venues.flatMap((venue) => venue.region ? [venue.region] : []),
  ))).sort();
  const eligibleCountries = Array.from(new Set(initialEvents.flatMap((event) =>
    event.eligibility.eligibleCountries,
  ))).sort();
  const eligibleRegions = Array.from(new Set(initialEvents.flatMap((event) =>
    event.eligibility.eligibleRegions,
  ))).sort();

  function updateVenueLocation(value: string) {
    if (value.startsWith("region:")) {
      applyFilters({ ...filters, venueCountry: "", venueRegion: value.slice(7) });
    } else {
      applyFilters({ ...filters, venueCountry: value, venueRegion: "" });
    }
  }

  useEffect(() => {
    function syncFromLocation() {
      const current = parseEventFilters(new URLSearchParams(window.location.search));
      setFilters(current);
      setQueryInput(current.query);
    }
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const { events, uncertainEvents, deadlines, uncertainDeadlines } = useMemo(
    () => filterAndSortEvents(initialEvents, filters, now),
    [filters, initialEvents, now],
  );

  function applyFilters(next: EventFilters) {
    const query = serializeEventFilters(next).toString();
    window.history.pushState(null, "", query ? `/events?${query}` : "/events");
    setFilters(next);
  }

  function updateFilter<K extends keyof EventFilters>(key: K, value: EventFilters[K]) {
    const next = { ...filters, [key]: value };
    if (key === "mode" && value === "online") next.includeOnline = true;
    applyFilters(next);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilter("query", queryInput.trim());
  }

  function clearFilters() {
    window.history.pushState(null, "", "/events");
    setFilters(parseEventFilters(new URLSearchParams()));
    setQueryInput("");
  }

  function clearFilter(key: keyof EventFilters) {
    const defaults = parseEventFilters(new URLSearchParams());
    const next = { ...filters, [key]: defaults[key] };
    if (key === "query") setQueryInput("");
    applyFilters(next);
  }

  function renderEventCard(event: EventSummary, deadline?: DeadlineChoice) {
    const route = relevantRoute(event, filters, deadline);
    const studentRoute = event.registrationRoutes.find((item) => item.deadline?.purpose === "student-registration");
    const deadlineRoute = route?.deadline?.purpose === "student-registration" ? route : studentRoute ?? route;
    const status = registrationText(event, route, now);
    const grades = eligibilityText(event);
    const signupUrl = route?.registrationUrl;
    return (
      <article className="event-result-card" key={event.id}>
        <div className="event-result-heading">
          <div>
            <p className="event-result-kicker">
              {categoryLabels[event.category]} · {audienceText(event)}
              {event.editorialStatus === "archived" ? " · Archived edition" : ""}
            </p>
            <h2><Link href={`/events/${event.slug}`}>{event.name}</Link></h2>
            <p className="event-result-organizer">{event.organizer}</p>
            <p className="event-result-description">{event.description}</p>
          </div>
          <span className="event-status-label">{status}</span>
        </div>
        <dl className="event-result-facts">
          <div><dt>Grades / ages</dt><dd>{grades}</dd></div>
          <div><dt>Format and location</dt><dd>{venueSummary(event)}</dd></div>
          <div><dt>Dates</dt><dd>{formatEventSchedule(event)}</dd></div>
          <div><dt>Student registration deadline</dt><dd>{studentDeadline(event, deadlineRoute, deadline)}</dd></div>
          <div><dt>Participation</dt><dd>{event.participationFormat === "individual" ? "Individual" : event.participationFormat === "team" ? "Team" : event.participationFormat === "both" ? "Individual or team" : "Not confirmed"}</dd></div>
          <div><dt>Entry pathway</dt><dd>{pathwayLabels[event.entryPathway]}</dd></div>
          <div><dt>Registration route</dt><dd>{route?.label ?? "See event details"}</dd></div>
        </dl>
        <div className="event-result-actions">
          {signupUrl ? <a className="button button-primary" href={signupUrl} rel="noreferrer" target="_blank">Official registration</a> : null}
          <Link className="button button-secondary" href={`/events/${event.slug}`}>View details</Link>
        </div>
      </article>
    );
  }

  const chips = activeFilters(filters);

  return (
    <section className="events-directory page-width" aria-label="Math events directory">
      <nav className="events-purpose-tabs" aria-label="Opportunity purpose">
        {purposes.map((purpose) => (
          <button
            aria-pressed={filters.purpose === purpose.id}
            className={filters.purpose === purpose.id ? "is-selected" : ""}
            key={purpose.id || "all"}
            onClick={() => updateFilter("purpose", purpose.id)}
            type="button"
          >
            {purpose.label}
          </button>
        ))}
      </nav>

      <form className="events-filters" onSubmit={submitSearch}>
        <label className="events-filter-search">
          Search by event, organizer, or keyword
          <div className="events-search-row">
            <input
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Try a topic or organizer"
              type="search"
              value={queryInput}
            />
            <button className="button button-primary" type="submit">Search</button>
          </div>
        </label>
        <label>
          Student grade / age
          <select onChange={(event) => updateFilter("level", event.target.value)} value={filters.level}>
            <option value="">All grades and ages</option>
            {usGradeFilterOptions.map((grade) => (
              <option key={grade.id} value={grade.id}>{grade.label}</option>
            ))}
            {[...new Set(initialEvents.flatMap((event) => event.eligibility.levels))]
              .filter((level) => !usGradeFilterOptions.some((grade) => grade.id === level))
              .sort()
              .map((level) => <option key={level} value={level}>{level.replaceAll("-", " ")}</option>)}
          </select>
        </label>
        <label>
          Venue location
          <select
            onChange={(event) => updateVenueLocation(event.target.value)}
            value={filters.venueRegion ? `region:${filters.venueRegion}` : filters.venueCountry}
          >
            <option value="">Any venue</option>
            {venueCountries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            {venueRegions.map((region) => <option key={region} value={`region:${region}`}>{region}</option>)}
          </select>
        </label>
        <label className="events-check-filter">
          <input
            checked={filters.includeOnline}
            onChange={(event) => updateFilter("includeOnline", event.target.checked)}
            type="checkbox"
          />
          Include online opportunities
        </label>

        <details className="events-more-filters">
          <summary>More filters</summary>
          <div className="events-more-filter-grid">
            <label>
              Detailed event type
              <select onChange={(event) => updateFilter("category", event.target.value)} value={filters.category}>
                <option value="">All event types</option>
                {eventCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
            </label>
            <label>
              Audience
              <select onChange={(event) => updateFilter("audience", event.target.value)} value={filters.audience}>
                <option value="">All audiences</option>
                <option value="school-students">Students</option>
                <option value="educators">Educators</option>
                <option value="researchers">Researchers</option>
                <option value="general-public">General public</option>
              </select>
            </label>
            <label>
              Individual / team participation
              <select onChange={(event) => updateFilter("participationFormat", event.target.value)} value={filters.participationFormat}>
                <option value="">All formats</option>
                <option value="individual">Individual</option>
                <option value="team">Team</option>
                <option value="both">Individual or team</option>
              </select>
            </label>
            <label>
              Division / round
              <select onChange={(event) => updateFilter("division", event.target.value)} value={filters.division}>
                <option value="">All divisions / rounds</option>
                {divisions.map((division) => <option key={division} value={division}>{division.startsWith("round:") ? `${division.slice(6)} round` : division}</option>)}
              </select>
            </label>
            <label>
              Participation mode
              <select onChange={(event) => updateFilter("mode", event.target.value)} value={filters.mode}>
                <option value="">Any mode</option>
                <option value="online">Online</option>
                <option value="in-person">In person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label>
              Registration route
              <select onChange={(event) => updateFilter("registrationRoute", event.target.value)} value={filters.registrationRoute}>
                <option value="">Any route</option>
                {Object.entries(routeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label>
              Participant eligibility country
              <select onChange={(event) => updateFilter("eligibleCountry", event.target.value)} value={filters.eligibleCountry}>
                <option value="">Any / not specified</option>
                {eligibleCountries.map((code) => <option key={code} value={code}>{countryName(code)}</option>)}
              </select>
            </label>
            <label>
              Participant eligibility region
              <select onChange={(event) => updateFilter("eligibleRegion", event.target.value)} value={filters.eligibleRegion}>
                <option value="">Any / not specified</option>
                {eligibleRegions.map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
            </label>
            <label>
              Event dates from
              <input onChange={(event) => updateFilter("from", event.target.value)} type="date" value={filters.from} />
            </label>
            <label>
              Event dates through
              <input onChange={(event) => updateFilter("to", event.target.value)} type="date" value={filters.to} />
            </label>
            <label>
              Registration status
              <select onChange={(event) => updateFilter("registrationStatus", event.target.value)} value={filters.registrationStatus}>
                <option value="">Any status</option>
                <option value="open">Registration open</option>
                <option value="not-yet-open">Not yet open</option>
                <option value="closed">Closed</option>
                <option value="waitlist">Waitlist</option>
                <option value="not-required">No registration required</option>
                <option value="unknown">Unconfirmed</option>
              </select>
            </label>
            <label>
              Entry pathway
              <select onChange={(event) => updateFilter("entryPathway", event.target.value)} value={filters.entryPathway}>
                <option value="">Any pathway</option>
                {Object.entries(pathwayLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label>
              Sort results
              <select onChange={(event) => updateFilter("sort", event.target.value as EventFilters["sort"])} value={filters.sort}>
                <option value="date">Upcoming dates</option>
                <option value="deadline">Student registration deadline</option>
                <option value="name">Event name</option>
              </select>
            </label>
            <label className="events-check-filter">
              <input checked={filters.freeOnly} onChange={(event) => updateFilter("freeOnly", event.target.checked)} type="checkbox" />
              Free only (verified fees)
            </label>
            <label className="events-check-filter">
              <input checked={filters.includeUnknown} onChange={(event) => updateFilter("includeUnknown", event.target.checked)} type="checkbox" />
              Include “eligibility to check”
            </label>
            <label className="events-check-filter">
              <input checked={filters.archived} onChange={(event) => updateFilter("archived", event.target.checked)} type="checkbox" />
              Include archived editions
            </label>
          </div>
          <p className="events-filter-help">
            Venue location is where an event happens. Participant eligibility is a separate organizer rule. Online does not mean worldwide entry.
          </p>
        </details>
      </form>

      {chips.length > 0 && (
        <div className="events-active-filters" aria-label="Active filters">
          <span>Filters:</span>
          {chips.map((chip, index) => (
            <button key={`${chip.key}-${index}`} onClick={() => clearFilter(chip.key)} type="button">
              {chip.label} <span aria-hidden="true">×</span>
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          <button className="events-clear-all" onClick={clearFilters} type="button">Clear all</button>
        </div>
      )}

      <div className="events-results-head">
        <p aria-live="polite" aria-atomic="true">
          <strong>{events.length}</strong> confirmed {events.length === 1 ? "match" : "matches"}
          {uncertainEvents.length > 0 ? ` · ${uncertainEvents.length} eligibility to check` : ""}
        </p>
        <label>
          Sort
          <select onChange={(event) => updateFilter("sort", event.target.value as EventFilters["sort"])} value={filters.sort}>
            <option value="date">Upcoming dates</option>
            <option value="deadline">Student deadline</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {events.length > 0 ? (
        <div className="events-result-list">{events.map((event) => renderEventCard(event, deadlines.get(event.id)))}</div>
      ) : (
        <div className="events-empty" role="status">
          <h2>No confirmed opportunities match those filters</h2>
          <p>Try a broader grade or location, include online opportunities, or clear filters.</p>
          <button className="button button-primary" onClick={clearFilters} type="button">Clear filters</button>
        </div>
      )}

      {uncertainEvents.length > 0 && (
        <section className="events-uncertain" aria-labelledby="events-uncertain-heading">
          <h2 id="events-uncertain-heading">Eligibility to check</h2>
          <p>These opportunities may match, but the organizer information we reviewed does not confirm the selected eligibility. Check the rules before planning.</p>
          <div className="events-result-list">
            {uncertainEvents.map((event) => renderEventCard(event, uncertainDeadlines.get(event.id)))}
          </div>
        </section>
      )}
    </section>
  );
}
