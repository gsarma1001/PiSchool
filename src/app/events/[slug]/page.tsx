import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicEventBySlug } from "@/lib/events/data";
import {
  eventModeLabel,
  formatDateRange,
  formatEventSchedule,
  formatDeadline,
  getRouteStatus,
  registrationStatusLabel,
} from "@/lib/events/service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getPublicEventBySlug(slug);
  if (!event) return { title: "Event not found | The Pi School" };
  return {
    title: `${event.name} | The Pi School`,
    description: event.description,
  };
}

function routeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    direct: "Direct",
    school: "Through a school",
    "test-center": "Through a test center",
    team: "Team entry",
    qualification: "Qualification route",
    invitation: "Invitation",
    other: "Other route",
  };
  return labels[type] ?? "Route";
}

function sourceClaimLabel(claim: string): string {
  const labels: Record<string, string> = {
    identity: "event identity",
    schedule: "event schedule",
    mode: "participation mode",
    venue: "venue",
    eligibility: "eligibility",
    "grade-mapping": "grade mapping",
    "registration-route": "registration route",
    "registration-deadline": "registration deadline",
    "registration-status": "registration status",
    preparation: "preparation resource",
  };
  return labels[claim] ?? claim;
}

function sourceAuthorityLabel(authority: string): string {
  const labels: Record<string, string> = {
    organizer: "Official organizer",
    "authorized-body": "Authorized national body",
    "official-provider": "Designated official provider",
  };
  return labels[authority] ?? authority;
}

function reviewFlagLabel(flag: string): string {
  const labels: Record<string, string> = {
    "broken-link": "broken link",
    "changed-dates": "changed dates",
    "conflicting-sources": "conflicting sources",
    "stale-information": "stale information",
  };
  return labels[flag] ?? flag;
}

function registrationActionLabel(type: string): string {
  const labels: Record<string, string> = {
    direct: "Register with the organizer",
    school: "View school registration instructions",
    "test-center": "Find a test center",
    team: "View team entry information",
    qualification: "View qualification process",
    invitation: "View invitation information",
    other: "View official route information",
  };
  return labels[type] ?? "View official route information";
}

function audienceLabel(audience: string): string {
  const labels: Record<string, string> = {
    "school-students": "School students",
    educators: "Educators",
    researchers: "Researchers",
    "general-public": "General public",
  };
  return labels[audience] ?? audience;
}

function deadlinePurposeLabel(purpose?: string): string {
  const labels: Record<string, string> = {
    "student-registration": "Student registration deadline",
    "school-team-registration": "School/team registration deadline",
    "host-purchasing": "Host or competition-manager deadline",
    "organizer-purchasing": "Organizer purchasing deadline",
    "organizer-license": "Organizer license deadline",
  };
  return purpose ? labels[purpose] ?? "Deadline" : "Deadline";
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getPublicEventBySlug(slug);
  if (!event) notFound();

  const now = new Date();
  return (
    <main id="main-content" className="events-page">
      <section className="event-detail-heading page-width">
        <p className="eyebrow">
          <Link href="/events">Math events</Link> / {event.category}
        </p>
        <h1>{event.name}</h1>
        <p className="public-lede">{event.description}</p>
        {event.editorialStatus === "archived" && (
          <p className="event-badge event-badge-muted">Archived edition · {event.edition}</p>
        )}
      </section>

      <div className="event-detail-layout page-width">
        <div className="event-detail-main">
          <section className="event-detail-panel">
            <h2>At a glance</h2>
            <dl className="event-detail-facts">
              <div>
                <dt>Organizer</dt>
                <dd>{event.organizer}</dd>
              </div>
              <div>
                <dt>Event family</dt>
                <dd>{event.familyName ?? event.name}</dd>
              </div>
              <div>
                <dt>Edition / round</dt>
                <dd>{event.edition}{event.round ? ` · ${event.round} round` : ""}</dd>
              </div>
              <div>
                <dt>Entry pathway</dt>
                <dd>
                  {event.entryPathway === "open-entry" ? "Open entry" :
                    event.entryPathway === "qualification-required" ? "Qualification required" :
                      event.entryPathway === "invitation-only" ? "Invitation only" :
                        "Entry pathway unconfirmed"}
                </dd>
              </div>
              <div>
                <dt>Participation format</dt>
                <dd>{event.participationFormat === "unknown" ? "Not confirmed" : event.participationFormat}</dd>
              </div>
              {event.fee && (
                <div>
                  <dt>Published fee</dt>
                  <dd>{event.fee.amount === 0 ? "Free" : `${event.fee.currency} ${event.fee.amount}`}</dd>
                </div>
              )}
              <div>
                <dt>Event dates</dt>
                <dd>{formatEventSchedule(event)}</dd>
              </div>
              {event.schedule.timeZone && (
                <div>
                  <dt>Organizer time zone</dt>
                  <dd>{event.schedule.timeZone}</dd>
                </div>
              )}
              <div>
                <dt>Participation mode</dt>
                <dd>{eventModeLabel(event.mode)}</dd>
              </div>
            </dl>
          </section>

          <section className="event-detail-panel">
            <h2>Schedule and venue</h2>
            {event.schedule.state === "not-announced" ? (
              <p>Event dates not announced.</p>
            ) : (
              <p>{formatEventSchedule(event)}</p>
            )}
            {event.schedule.variants && event.schedule.variants.length > 0 && (
              <ul className="event-detail-list">
                {event.schedule.variants.map((variant) => (
                  <li key={variant.label}>
                    <strong>{variant.label}:</strong> {formatDateRange(variant.startDate, variant.endDate)}
                    {(variant.startTime || variant.endTime) && (
                      <> · {variant.startTime ? `Starts ${variant.startTime}` : ""}
                        {variant.startTime && variant.endTime ? " – " : ""}
                        {variant.endTime ? `Ends ${variant.endTime}` : ""}
                        {variant.timeZone ? ` (${variant.timeZone})` : ""}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {(event.schedule.startTime || event.schedule.endTime) && (
              <p>
                <strong>Published time:</strong>{" "}
                {event.schedule.startTime ? `Starts ${event.schedule.startTime}` : ""}
                {event.schedule.startTime && event.schedule.endTime ? " · " : ""}
                {event.schedule.endTime ? `Ends ${event.schedule.endTime}` : ""}
                {event.schedule.timeZone ? ` (${event.schedule.timeZone})` : ""}
              </p>
            )}
            {event.venues.length ? (
              <ul className="event-detail-list">
                {event.venues.map((venue, index) => {
                  const place = [venue.city, venue.country].filter(Boolean).join(", ");
                  const label = place || venue.country || venue.region || venue.description;
                  return (
                    <li key={`${venue.description}-${index}`}>
                      {label}{label !== venue.description ? ` — ${venue.description}` : ""}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Venue not announced.</p>
            )}
            {event.sessions && event.sessions.length > 0 && (
              <>
                <h3>Local sessions / venues</h3>
                <ul className="event-detail-list">
                  {event.sessions.map((session) => (
                    <li key={session.id}>
                      {[session.host, session.venue.city, session.venue.region, session.venue.country, session.venue.description]
                        .filter(Boolean).join(" · ")}
                      {session.capacity !== undefined ? ` · Published capacity: ${session.capacity}` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="event-detail-panel">
            <h2>Who can participate</h2>
            {event.eligibility.confirmed ? (
              <>
                <p>{event.eligibility.summary}</p>
                <p><strong>Audience:</strong> {event.eligibility.audiences.map(audienceLabel).join(", ")}</p>
                {event.eligibility.divisions.length > 0 && (
                  <p><strong>Divisions:</strong> {event.eligibility.divisions.join(", ")}</p>
                )}
                {event.eligibility.schoolYearLabels.length > 0 && (
                  <p><strong>Organizer school-year labels:</strong> {event.eligibility.schoolYearLabels.join(", ")}</p>
                )}
                {event.eligibility.ageRestrictions.length > 0 && (
                  <p><strong>Age restrictions:</strong> {event.eligibility.ageRestrictions.join("; ")}</p>
                )}
                {event.eligibility.worldwide && (
                  <p><strong>Geographic eligibility:</strong> the source describes participation as worldwide; route/division rules still apply.</p>
                )}
                {event.eligibility.eligibleCountries.length > 0 && (
                  <p><strong>Participant eligibility countries:</strong> {event.eligibility.eligibleCountries.map((code) => ({
                    US: "United States",
                    CA: "Canada",
                    HU: "Hungary",
                  }[code] ?? code)).join(", ")}</p>
                )}
                {event.eligibility.eligibleRegions.length > 0 && !event.eligibility.worldwide && (
                  <p><strong>Participant eligibility region:</strong> {event.eligibility.eligibleRegions.join(", ")}</p>
                )}
              </>
            ) : (
              <p>Eligibility not confirmed. Check the organizer or relevant national organizer.</p>
            )}
            {event.eligibility.geographicRestrictions.map((restriction) => (
              <p className="event-detail-note" key={restriction}>{restriction}</p>
            ))}
            <p className="event-detail-note">
              Venue location describes where an event is hosted; it does not by itself establish
              who may enter. Online participation also does not imply worldwide eligibility.
            </p>
          </section>

          <section className="event-detail-panel">
            <h2>Registration routes</h2>
            {event.registrationRoutes.length ? (
              <div className="event-route-list">
                {event.registrationRoutes.map((route) => {
                  const liveStatus = getRouteStatus(route, now);
                  return (
                    <article className="event-route" key={route.id}>
                      <div className="event-route-heading">
                        <h3>{route.label}</h3>
                        <span className="event-badge">{registrationStatusLabel(liveStatus.status)}</span>
                      </div>
                      <p><strong>Route:</strong> {routeTypeLabel(route.type)}</p>
                      {route.division && <p><strong>Division:</strong> {route.division}</p>}
                      {route.mode && <p><strong>Mode:</strong> {eventModeLabel(route.mode)}</p>}
                      <p>{route.instructions}</p>
                      <p>
                        <strong>{deadlinePurposeLabel(route.deadline?.purpose)}:</strong>{" "}
                        {route.deadline
                          ? formatDeadline(route.deadline)
                          : route.deadlineNote ?? "Not announced"}
                      </p>
                      <p className="event-detail-note">
                        Status checked {route.lastChecked}. Status source:{" "}
                        {event.sources.find((source) => source.id === route.statusSourceId)?.title ??
                          "source not available"}
                      </p>
                      {liveStatus.needsReview && (
                        <p className="event-review-note">
                          The published deadline may have passed or needs rechecking; confirm current
                          status with the organizer.
                        </p>
                      )}
                      {route.registrationUrl && (
                        <a
                          className="event-action-link"
                          href={route.registrationUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {registrationActionLabel(route.type)}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      )}
                      {!route.registrationUrl && <p>Registration link not published.</p>}
                      {route.informationUrl && (
                        <a
                          className="event-action-link"
                          href={route.informationUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          View official route information <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p>Registration link not published. Registration status unknown.</p>
            )}
          </section>

          <section className="event-detail-panel">
            <h2>Preparation resources</h2>
            {event.resources.length ? (
              <ul className="event-resource-list">
                {event.resources.map((resource) => (
                  <li key={`${resource.title}-${resource.url}`}>
                    <a href={resource.url} rel="noreferrer" target="_blank">
                      {resource.title}<span aria-hidden="true"> ↗</span>
                    </a>
                    {resource.division && ` · ${resource.division}`}
                    {resource.year && ` · ${resource.year}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sample questions not published in the official sources reviewed.</p>
            )}
          </section>
        </div>

        <aside className="event-detail-aside">
          <section className="event-detail-panel">
            <h2>Official event information</h2>
            <a className="button button-primary" href={event.officialUrl} rel="noreferrer" target="_blank">
              Visit organizer event page <span aria-hidden="true">↗</span>
            </a>
            {event.sources.map((source) => (
              <div className="event-source" key={source.id}>
                <a href={source.url} rel="noreferrer" target="_blank">{source.title} ↗</a>
                <span>{sourceAuthorityLabel(source.authority)}</span>
                <span>Verified {source.verifiedAt}</span>
                <span>Confirms: {source.claims.map(sourceClaimLabel).join(", ")}</span>
              </div>
            ))}
            <p className="event-detail-note">
              Last reviewed {event.lastVerified}. Next editorial review due {event.nextReview}.
              Details can change; confirm critical information with the organizer.
            </p>
            {event.reviewFlags.length > 0 && (
              <p className="event-review-note">
                Review needed: {event.reviewFlags.map(reviewFlagLabel).join(", ")}.
              </p>
            )}
          </section>
        </aside>
      </div>
      <div className="page-width event-back-link">
        <Link href="/events">← Back to the event directory</Link>
      </div>
    </main>
  );
}
