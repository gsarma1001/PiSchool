import type {
  EventPurpose,
  EventDeadline,
  EventRecord,
  EventSummary,
  RegistrationRoute,
  RegistrationStatus,
} from "./schema";
import { usGradeFilterOptions } from "../curriculum";

export type EventSort = "date" | "deadline" | "name";

export type EventFilters = {
  query: string;
  page: number;
  purpose: EventPurpose | "";
  category: string;
  level: string;
  division: string;
  audience: string;
  registrationRoute: string;
  mode: string;
  includeOnline: boolean;
  includeUnknown: boolean;
  entryPathway: string;
  participationFormat: string;
  freeOnly: boolean;
  venueCountry: string;
  venueRegion: string;
  eligibleCountry: string;
  eligibleRegion: string;
  from: string;
  to: string;
  registrationStatus: string;
  sort: EventSort;
  archived: boolean;
};

export type DeadlineChoice = {
  route: RegistrationRoute;
  deadline: EventDeadline;
};

export type EditorialFinding = {
  eventId: string;
  severity: "missing" | "stale";
  message: string;
};

export function getEventEditorialReport(
  records: readonly EventRecord[],
  now: Date,
): EditorialFinding[] {
  const today = now.toISOString().slice(0, 10);
  const findings: EditorialFinding[] = [];
  for (const event of records) {
    if (event.schedule.state === "not-announced") {
      findings.push({
        eventId: event.id,
        severity: "missing",
        message: "Next edition dates are not announced.",
      });
    }
    if (!event.eligibility.confirmed) {
      findings.push({
        eventId: event.id,
        severity: "missing",
        message: "Edition eligibility has not been confirmed.",
      });
    }
    const studentRoutes = event.registrationRoutes.filter((route) =>
      route.audience !== "educators" && route.audience !== "researchers",
    );
    if (studentRoutes.length === 0) {
      findings.push({
        eventId: event.id,
        severity: "missing",
        message: "No student or public registration/attendance route is recorded.",
      });
    } else if (
      !studentRoutes.every((route) => route.status === "not-required") &&
      !studentRoutes.some((route) => route.deadline?.purpose === "student-registration") &&
      !studentRoutes.some((route) => route.deadlineNote)
    ) {
      findings.push({
        eventId: event.id,
        severity: "missing",
        message: "Student registration deadline or an explanatory note is not recorded.",
      });
    }
    if (event.nextReview < today) {
      findings.push({
        eventId: event.id,
        severity: "stale",
        message: `Editorial review date ${event.nextReview} has passed.`,
      });
    }
    if (event.reviewFlags.length > 0) {
      findings.push({
        eventId: event.id,
        severity: "stale",
        message: `Review flags need attention: ${event.reviewFlags.join(", ")}.`,
      });
    }
  }
  return findings;
}

export function routeMatchesFilters(
  event: EventSummary,
  route: RegistrationRoute,
  filters: Partial<
    Pick<EventFilters, "mode" | "division" | "registrationRoute" | "audience">
  >,
): boolean {
  if (filters.audience) {
    const matchesAudience = route.audience
      ? route.audience === filters.audience
      : event.eligibility.audiences.some(
          (audience) => audience === filters.audience,
        );
    if (!matchesAudience) return false;
  }
  if (filters.mode && (route.mode ?? event.mode) !== filters.mode) return false;
  if (filters.registrationRoute && route.type !== filters.registrationRoute) {
    return false;
  }
  if (filters.division) {
    if (filters.division.startsWith("round:")) {
      if (event.round !== filters.division.slice(6)) return false;
    } else if (route.division) {
      if (
        route.division !== filters.division &&
        !route.division.startsWith(`${filters.division} `)
      ) {
        return false;
      }
    } else if (!event.eligibility.divisions.includes(filters.division)) {
      return false;
    }
  }
  return true;
}

const emptyFilters: EventFilters = {
  query: "",
  page: 1,
  purpose: "",
  category: "",
  level: "",
  division: "",
  audience: "",
  registrationRoute: "",
  mode: "",
  includeOnline: true,
  includeUnknown: false,
  entryPathway: "",
  participationFormat: "",
  freeOnly: false,
  venueCountry: "",
  venueRegion: "",
  eligibleCountry: "",
  eligibleRegion: "",
  from: "",
  to: "",
  registrationStatus: "",
  sort: "date",
  archived: false,
};

const sortValues: EventSort[] = ["date", "deadline", "name"];
const statuses: RegistrationStatus[] = [
  "open",
  "not-yet-open",
  "closed",
  "waitlist",
  "not-required",
  "unknown",
];
const countries: Record<string, string> = {
  CA: "CA",
  HU: "HU",
  US: "US",
};

function isValidQueryDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function parseEventFilters(params: URLSearchParams): EventFilters {
  const sort = params.get("sort");
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const status = params.get("status") ?? "";
  const country = (value: string | null) => {
    const upper = value?.toUpperCase() ?? "";
    return countries[upper] ?? "";
  };

  return {
    ...emptyFilters,
    query: params.get("q")?.trim().slice(0, 120) ?? "",
    page: Number.isSafeInteger(Number(params.get("page"))) && Number(params.get("page")) > 0
      ? Number(params.get("page"))
      : 1,
    purpose: ["compete", "learn-explore", "conference-educator"].includes(params.get("purpose") ?? "")
      ? (params.get("purpose") as EventPurpose)
      : "",
    category: params.get("category") ?? "",
    level: params.get("level") ?? "",
    division: params.get("division") ?? "",
    audience: params.get("audience") ?? "",
    registrationRoute: params.get("route") ?? "",
    mode: ["online", "in-person", "hybrid", "unknown"].includes(params.get("mode") ?? "")
      ? params.get("mode") ?? ""
      : "",
    includeOnline: params.get("online") !== "0",
    includeUnknown: params.get("uncertain") === "1",
    entryPathway: ["open-entry", "qualification-required", "invitation-only", "unknown"].includes(params.get("entry") ?? "")
      ? params.get("entry") ?? ""
      : "",
    participationFormat: ["individual", "team", "both", "unknown"].includes(params.get("format") ?? "")
      ? params.get("format") ?? ""
      : "",
    freeOnly: params.get("free") === "1",
    venueCountry: country(params.get("venue")),
    venueRegion: params.get("venueRegion") ?? "",
    eligibleCountry: country(params.get("eligible")),
    eligibleRegion: params.get("eligibleRegion") ?? "",
    from: isValidQueryDate(from) ? from : "",
    to: isValidQueryDate(to) ? to : "",
    registrationStatus: statuses.includes(status as RegistrationStatus) ? status : "",
    sort: sortValues.includes(sort as EventSort) ? (sort as EventSort) : "date",
    archived: params.get("archived") === "1",
  };
}

export function serializeEventFilters(filters: EventFilters): URLSearchParams {
  const params = new URLSearchParams();
  const entries: [string, string][] = [
    ["q", filters.query.trim()],
    ["page", filters.page > 1 ? String(filters.page) : ""],
    ["purpose", filters.purpose],
    ["category", filters.category],
    ["level", filters.level],
    ["division", filters.division],
    ["audience", filters.audience],
    ["route", filters.registrationRoute],
    ["mode", filters.mode],
    ["online", filters.includeOnline ? "" : "0"],
    ["uncertain", filters.includeUnknown ? "1" : ""],
    ["entry", filters.entryPathway],
    ["format", filters.participationFormat],
    ["free", filters.freeOnly ? "1" : ""],
    ["venue", filters.venueCountry],
    ["venueRegion", filters.venueRegion],
    ["eligible", filters.eligibleCountry],
    ["eligibleRegion", filters.eligibleRegion],
    ["from", filters.from],
    ["to", filters.to],
    ["status", filters.registrationStatus],
    ["sort", filters.sort === "date" ? "" : filters.sort],
    ["archived", filters.archived ? "1" : ""],
  ];
  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }
  return params;
}

function dateInTimeZone(now: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function localDateTimeInTimeZone(now: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function formatInTimeZone(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function timeZoneOffsetAt(timestamp: number, timeZone: string): number {
  const formatted = formatInTimeZone(new Date(timestamp), timeZone);
  const localAsUtc = Date.parse(`${formatted}:00Z`);
  return localAsUtc - timestamp;
}

export function organizerTimeToEpoch(
  date: string,
  time: string,
  timeZone: string,
): number | undefined {
  const target = Date.parse(`${date}T${time}:00Z`);
  if (!Number.isFinite(target)) return undefined;

  const offsets = new Set<number>();
  try {
    for (let hours = -36; hours <= 36; hours += 6) {
      offsets.add(timeZoneOffsetAt(target + hours * 60 * 60 * 1000, timeZone));
    }
  } catch (error) {
    if (error instanceof RangeError) return undefined;
    throw error;
  }

  const candidates = [...offsets]
    .map((offset) => target - offset)
    .filter((timestamp) => formatInTimeZone(new Date(timestamp), timeZone) === `${date}T${time}`);
  const unique = [...new Set(candidates)];
  return unique.length === 1 ? unique[0] : undefined;
}

export function getRouteStatus(
  route: RegistrationRoute,
  now: Date,
): { status: RegistrationStatus; needsReview: boolean } {
  const deadline = route.deadline;
  if (!deadline) return { status: route.status, needsReview: false };

  if (deadline.precision === "date-only") {
    const today = deadline.timeZone ? dateInTimeZone(now, deadline.timeZone) : now.toISOString().slice(0, 10);
    return {
      status: route.status,
      needsReview: deadline.date < today && route.status !== "closed",
    };
  }

  if (!deadline.cutoffTime || !deadline.timeZone) {
    return { status: route.status, needsReview: true };
  }
  const deadlineInstant = organizerTimeToEpoch(
    deadline.date,
    deadline.cutoffTime,
    deadline.timeZone,
  );
  if (deadlineInstant !== undefined && now.valueOf() > deadlineInstant) {
    return { status: "closed", needsReview: true };
  }
  const localNow = localDateTimeInTimeZone(now, deadline.timeZone);
  const localDeadline = `${deadline.date}T${deadline.cutoffTime}`;
  return {
    status: route.status,
    needsReview: deadlineInstant === undefined && localNow > localDeadline,
  };
}

function compareDeadlines(left: DeadlineChoice, right: DeadlineChoice): number {
  if (left.deadline.precision !== right.deadline.precision) {
    if (left.deadline.date !== right.deadline.date) {
      return left.deadline.date.localeCompare(right.deadline.date);
    }
    return left.deadline.precision === "timed" ? -1 : 1;
  }
  if (
    left.deadline.precision === "timed" &&
    right.deadline.precision === "timed"
  ) {
    const leftInstant = left.deadline.cutoffTime && left.deadline.timeZone
      ? organizerTimeToEpoch(left.deadline.date, left.deadline.cutoffTime, left.deadline.timeZone)
      : undefined;
    const rightInstant = right.deadline.cutoffTime && right.deadline.timeZone
      ? organizerTimeToEpoch(right.deadline.date, right.deadline.cutoffTime, right.deadline.timeZone)
      : undefined;
    if (leftInstant !== undefined && rightInstant !== undefined && leftInstant !== rightInstant) {
      return leftInstant - rightInstant;
    }
  }
  if (left.deadline.date !== right.deadline.date) {
    return left.deadline.date.localeCompare(right.deadline.date);
  }
  return left.route.id.localeCompare(right.route.id);
}

export function getUpcomingDeadline(
  event: EventSummary,
  now: Date,
  relevant: Partial<
    Pick<EventFilters, "mode" | "division" | "registrationRoute" | "audience">
  > = {},
): DeadlineChoice | undefined {
  const candidates = event.registrationRoutes.flatMap((route) => {
    if (!routeMatchesFilters(event, route, relevant)) return [];
    if (
      !route.deadline ||
      route.deadline.purpose !== "student-registration" ||
      getRouteStatus(route, now).status === "closed"
    ) return [];
    const deadline = route.deadline;
    if (deadline.precision === "date-only") {
      const today = deadline.timeZone
        ? dateInTimeZone(now, deadline.timeZone)
        : now.toISOString().slice(0, 10);
      if (deadline.date < today) return [];
      return [{ route, deadline }];
    }
    if (!deadline.cutoffTime || !deadline.timeZone) return [];
    const timestamp = organizerTimeToEpoch(
      deadline.date,
      deadline.cutoffTime,
      deadline.timeZone,
    );
    return timestamp !== undefined && timestamp >= now.valueOf()
      ? [{ route, deadline }]
      : [];
  });

  return candidates.sort(compareDeadlines)[0];
}

function countryMatches(event: EventSummary, countryCode: string): boolean {
  return event.eligibility.confirmed &&
    (event.eligibility.worldwide ||
      event.eligibility.eligibleCountries.includes(countryCode));
}

function regionMatches(event: EventSummary, region: string): boolean {
  return event.eligibility.confirmed &&
    (event.eligibility.worldwide ||
      event.eligibility.eligibleRegions.includes(region));
}

export function filterAndSortEvents(
  records: readonly EventSummary[],
  filters: EventFilters,
  now: Date,
): {
  events: EventSummary[];
  uncertainEvents: EventSummary[];
  deadlines: Map<string, DeadlineChoice | undefined>;
  uncertainDeadlines: Map<string, DeadlineChoice | undefined>;
} {
  const today = now.toISOString().slice(0, 10);
  const events = records.filter((event) =>
    event.editorialStatus === "published" ||
    (filters.archived && event.editorialStatus === "archived"),
  ).filter((event) =>
    filters.archived ||
    !event.schedule.endDate ||
    event.schedule.endDate >= today,
  );
  const query = filters.query.toLocaleLowerCase();
  const selectedStatus = filters.registrationStatus as RegistrationStatus | "";
  const candidates = events.filter((event) => {
    if (
      query &&
      !`${event.name} ${event.familyName ?? ""} ${(event.familyAliases ?? []).join(" ")} ${event.organizer} ${event.description}`
        .toLocaleLowerCase()
        .includes(query)
    ) {
      return false;
    }
    if (filters.purpose && event.purpose !== filters.purpose) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.entryPathway && event.entryPathway !== filters.entryPathway) return false;
    if (filters.participationFormat && event.participationFormat !== filters.participationFormat) return false;
    if (filters.freeOnly && (!event.fee || event.fee.amount !== 0)) return false;
    if (!filters.includeOnline && event.mode === "online") return false;
    if (
      filters.division &&
      !event.eligibility.divisions.includes(filters.division) &&
      !event.registrationRoutes.some(
        (route) =>
          route.division === filters.division ||
          route.division?.startsWith(`${filters.division} `),
      ) &&
      !(filters.division.startsWith("round:") && event.round === filters.division.slice(6))
    ) {
      return false;
    }
    if (
      filters.audience &&
      !event.eligibility.audiences.some((audience) => audience === filters.audience) &&
      !event.registrationRoutes.some((route) => route.audience === filters.audience)
    ) {
      return false;
    }
    const hasRouteFilters =
      filters.audience ||
      filters.division ||
      filters.mode ||
      filters.registrationRoute;
    const matchingRoute = event.registrationRoutes.some((route) =>
      routeMatchesFilters(event, route, filters),
    );
    if (
      hasRouteFilters &&
      event.registrationRoutes.length > 0 &&
      !matchingRoute
    ) {
      return false;
    }
    if (
      filters.venueCountry &&
      !event.venues.some((venue) => venue.countryCode === filters.venueCountry)
    ) {
      return false;
    }
    if (
      filters.venueRegion &&
      !event.venues.some((venue) => venue.region === filters.venueRegion)
    ) {
      return false;
    }
    if (
      (filters.from || filters.to) &&
      (event.schedule.state !== "announced" || !event.schedule.startDate)
    ) {
      return false;
    }
    if (
      filters.from &&
      event.schedule.startDate &&
      (event.schedule.endDate ?? event.schedule.startDate) < filters.from
    ) {
      return false;
    }
    if (
      filters.to &&
      event.schedule.startDate &&
      event.schedule.startDate > filters.to
    ) {
      return false;
    }
    if (
      selectedStatus &&
      !event.registrationRoutes.some(
        (route) =>
          routeMatchesFilters(event, route, filters) &&
          getRouteStatus(route, now).status === selectedStatus,
      )
    ) {
      return false;
    }
    return true;
  });

  const hasEligibilityFilter = Boolean(
    filters.level || filters.eligibleCountry || filters.eligibleRegion,
  );
  const isEligibilityUncertain = (event: EventSummary) => {
    if (!filters.includeUnknown) return false;
    if (!event.eligibility.confirmed) return true;
    if (!hasEligibilityFilter) return false;
    if (
      filters.level &&
      !event.eligibility.levels.includes(filters.level) &&
      !event.eligibility.verifiedGradeMappings.some((mapping) => mapping.usGradeId === filters.level) &&
      (
        usGradeFilterOptions.some((grade) => grade.id === filters.level) ||
        event.eligibility.levels.length === 0
      )
    ) return true;
    if (
      filters.eligibleCountry &&
      !event.eligibility.worldwide &&
      event.eligibility.eligibleCountries.length === 0
    ) return true;
    if (
      filters.eligibleRegion &&
      !event.eligibility.worldwide &&
      event.eligibility.eligibleRegions.length === 0
    ) return true;
    return false;
  };
  const confirmedEligibilityMatch = (event: EventSummary) => {
    if (!hasEligibilityFilter) return true;
    if (!event.eligibility.confirmed) return false;
    const levelMatch = !filters.level ||
      event.eligibility.levels.includes(filters.level) ||
      event.eligibility.verifiedGradeMappings.some((mapping) => mapping.usGradeId === filters.level);
    const countryMatch = !filters.eligibleCountry ||
      countryMatches(event, filters.eligibleCountry);
    const regionMatch = !filters.eligibleRegion ||
      regionMatches(event, filters.eligibleRegion);
    return levelMatch && countryMatch && regionMatch;
  };
  const matched = candidates.filter((event) =>
    confirmedEligibilityMatch(event) && !isEligibilityUncertain(event),
  );
  const uncertainEvents = candidates.filter((event) =>
    isEligibilityUncertain(event),
  );
  const deadlines = new Map(
    matched.map((event) => [
      event.id,
      getUpcomingDeadline(event, now, {
        mode: filters.mode,
        division: filters.division,
        registrationRoute: filters.registrationRoute,
        audience: filters.audience,
      }),
    ]),
  );
  const uncertainDeadlines = new Map(
    uncertainEvents.map((event) => [
      event.id,
      getUpcomingDeadline(event, now, {
        mode: filters.mode,
        division: filters.division,
        registrationRoute: filters.registrationRoute,
        audience: filters.audience,
      }),
    ]),
  );
  matched.sort((left, right) => {
    if (filters.sort === "name") {
      return left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
    }
    if (filters.sort === "deadline") {
      const leftDeadline = deadlines.get(left.id);
      const rightDeadline = deadlines.get(right.id);
      if (leftDeadline && rightDeadline) {
        return (
          compareDeadlines(leftDeadline, rightDeadline) ||
          left.name.localeCompare(right.name)
        );
      }
      if (leftDeadline) return -1;
      if (rightDeadline) return 1;
      return left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
    }

    const leftDate = left.schedule.startDate;
    const rightDate = right.schedule.startDate;
    if (leftDate && rightDate) {
      return leftDate.localeCompare(rightDate) || left.name.localeCompare(right.name);
    }
    if (leftDate) return -1;
    if (rightDate) return 1;
    return left.name.localeCompare(right.name) || left.id.localeCompare(right.id);
  });

  uncertainEvents.sort((left, right) => left.name.localeCompare(right.name));
  return { events: matched, uncertainEvents, deadlines, uncertainDeadlines };
}

export function formatEventDate(date?: string): string {
  if (!date) return "Event dates not announced";
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start) return "Event dates not announced";
  if (!end || start === end) return formatEventDate(start);
  return `${formatEventDate(start)} – ${formatEventDate(end)}`;
}

export function formatEventSchedule(event: EventSummary): string {
  if (event.schedule.state === "not-announced" || !event.schedule.startDate) {
    return "Next dates not yet announced";
  }
  if (event.schedule.variants?.length) {
    return event.schedule.variants
      .map((variant) => {
        const dates = formatDateRange(variant.startDate, variant.endDate);
        const times = [
          variant.startTime ? `starts ${variant.startTime}` : "",
          variant.endTime ? `ends ${variant.endTime}` : "",
        ].filter(Boolean);
        const timeDetails = times.length
          ? ` (${times.join(", ")}${variant.timeZone ? ` ${variant.timeZone}` : ""})`
          : "";
        return `${variant.label}: ${dates}${timeDetails}`;
      })
      .join("; ");
  }
  return formatDateRange(event.schedule.startDate, event.schedule.endDate);
}

export function formatDeadline(deadline?: EventDeadline): string {
  if (!deadline) return "Deadline not announced";
  const date = formatEventDate(deadline.date);
  if (deadline.precision === "date-only") return `${date} (date only)`;
  return `${date}, ${deadline.cutoffTime} ${deadline.timeZone}`;
}

export function registrationStatusLabel(status: RegistrationStatus): string {
  const labels: Record<RegistrationStatus, string> = {
    open: "Open",
    "not-yet-open": "Not yet open",
    closed: "Closed",
    waitlist: "Waitlist",
    "not-required": "No registration required",
    unknown: "Registration status unknown",
  };
  return labels[status];
}

export function eventModeLabel(mode: EventSummary["mode"]): string {
  const labels: Record<EventSummary["mode"], string> = {
    online: "Online",
    "in-person": "In person",
    hybrid: "Hybrid",
    unknown: "Mode not confirmed",
  };
  return labels[mode];
}
