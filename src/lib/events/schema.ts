import { usGradeFilterOptions, type UsGradeId } from "../curriculum";

export const eventCategories = [
  "conference",
  "competition",
  "olympiad",
  "tournament",
  "modeling-challenge",
  "workshop",
  "educator-workshop",
  "research-meeting",
  "math-circle",
  "festival",
  "student-talk",
] as const;

const eventPurposes: EventPurpose[] = ["compete", "learn-explore", "conference-educator"];
const eventModes: EventMode[] = ["online", "in-person", "hybrid", "unknown"];
const editorialStatuses: EditorialStatus[] = ["draft", "in-review", "published", "archived"];
const audiences: Audience[] = [
  "school-students",
  "educators",
  "researchers",
  "general-public",
];
const routeTypes: RegistrationRouteType[] = [
  "direct",
  "school",
  "test-center",
  "team",
  "qualification",
  "invitation",
  "other",
];
const registrationStatuses: RegistrationStatus[] = [
  "open",
  "not-yet-open",
  "closed",
  "waitlist",
  "not-required",
  "unknown",
];
const sourceClaims: SourceClaim[] = [
  "identity",
  "schedule",
  "mode",
  "venue",
  "eligibility",
  "grade-mapping",
  "registration-route",
  "registration-deadline",
  "registration-status",
  "preparation",
  "fee",
];

export type EventCategory = (typeof eventCategories)[number];
export type EventPurpose =
  | "compete"
  | "learn-explore"
  | "conference-educator";
export type EntryPathway =
  | "open-entry"
  | "qualification-required"
  | "invitation-only"
  | "unknown";
export type ParticipationFormat = "individual" | "team" | "both" | "unknown";
export type DeadlinePurpose =
  | "student-registration"
  | "school-team-registration"
  | "host-purchasing"
  | "organizer-purchasing"
  | "organizer-license";
export type EventMode = "online" | "in-person" | "hybrid" | "unknown";
export type Audience =
  | "school-students"
  | "educators"
  | "researchers"
  | "general-public";
export type EditorialStatus = "draft" | "in-review" | "published" | "archived";
export type RegistrationStatus =
  | "open"
  | "not-yet-open"
  | "closed"
  | "waitlist"
  | "not-required"
  | "unknown";
export type RegistrationRouteType =
  | "direct"
  | "school"
  | "test-center"
  | "team"
  | "qualification"
  | "invitation"
  | "other";

export type SourceClaim =
  | "identity"
  | "schedule"
  | "mode"
  | "venue"
  | "eligibility"
  | "grade-mapping"
  | "registration-route"
  | "registration-deadline"
  | "registration-status"
  | "preparation"
  | "fee";

export type EventSource = {
  id: string;
  url: string;
  title: string;
  authority: "organizer" | "authorized-body" | "official-provider";
  verifiedAt: string;
  claims: SourceClaim[];
};

export type EventDeadline = {
  date: string;
  purpose: DeadlinePurpose;
  precision: "date-only" | "timed";
  cutoffTime?: string;
  timeZone?: string;
};

export type RegistrationRoute = {
  id: string;
  type: RegistrationRouteType;
  label: string;
  instructions: string;
  deadlineNote?: string;
  informationUrl?: string;
  informationSourceId?: string;
  registrationUrl?: string;
  registrationSourceId?: string;
  division?: string;
  audience?: Audience;
  mode?: EventMode;
  status: RegistrationStatus;
  deadline?: EventDeadline;
  statusSourceId: string;
  deadlineSourceId?: string;
  lastChecked: string;
};

export type EventFamily = {
  id: string;
  name: string;
  aliases: string[];
  organizer: string;
  purpose: EventPurpose;
  category: EventCategory;
  description: string;
  audiences: Audience[];
  officialUrl: string;
  preparationLinks: { title: string; url: string }[];
};

export type EventSession = {
  id: string;
  editionId: string;
  host?: string;
  venue: {
    city?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    description: string;
  };
  registrationRouteId?: string;
  capacity?: number;
};

export type EventReviewQueueItem = {
  id: string;
  kind: "organizer-submission" | "source-change";
  familyId?: string;
  editionId?: string;
  receivedAt: string;
  sourceUrls: string[];
  status: "pending-review";
};

export type EventEdition = {
  id: string;
  slug: string;
  familyId: string;
  displayName?: string;
  description?: string;
  edition: string;
  round?: string;
  entryPathway: EntryPathway;
  participationFormat: ParticipationFormat;
  sessions?: EventSession[];
  fee?: {
    amount: number;
    currency: string;
    sourceId: string;
  };
  schedule: {
    state: "announced" | "not-announced";
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    timeZone?: string;
    variants?: {
      label: string;
      startDate: string;
      endDate?: string;
      startTime?: string;
      endTime?: string;
      timeZone?: string;
    }[];
  };
  mode: EventMode;
  venues: {
    city?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    description: string;
  }[];
  eligibility: {
    confirmed: boolean;
    summary: string;
    levels: string[];
    schoolYearLabels: string[];
    audiences: Audience[];
    ageRestrictions: string[];
    divisions: string[];
    eligibleCountries: string[];
    eligibleRegions: string[];
    worldwide: boolean;
    geographicRestrictions: string[];
    verifiedGradeMappings: {
      label: string;
      equivalent: string;
      usGradeId?: UsGradeId;
      sourceId: string;
    }[];
  };
  registrationRoutes: RegistrationRoute[];
  resources: {
    type: "sample-questions" | "past-paper" | "answer-key" | "worked-solutions" | "rules";
    title: string;
    url: string;
    division?: string;
    year?: string;
    sourceId: string;
  }[];
  sources: EventSource[];
  lastVerified: string;
  nextReview: string;
  editorialStatus: EditorialStatus;
  reviewFlags: (
    | "broken-link"
    | "changed-dates"
    | "conflicting-sources"
    | "stale-information"
  )[];
};

export type EventRecord = EventEdition & {
  name: string;
  organizer: string;
  purpose: EventPurpose;
  familyName: string;
  familyAliases: string[];
  category: EventCategory;
  officialUrl: string;
  description: string;
};

export type EventSummary = Omit<EventRecord, "sources" | "resources">;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isDateOnly(value: string): boolean {
  if (!datePattern.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateEventRecords(records: readonly EventRecord[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const editions = new Set<string>();

  for (const event of records) {
    if (!event.id || ids.has(event.id)) {
      throw new Error(`Duplicate or missing event ID: ${event.id}`);
    }
    if (!event.slug || slugs.has(event.slug)) {
      throw new Error(`Duplicate or missing event slug: ${event.slug}`);
    }
    ids.add(event.id);
    slugs.add(event.slug);
    const editionKey = `${event.familyId}\u0000${event.edition}\u0000${event.round ?? ""}\u0000${event.name.trim().toLocaleLowerCase()}`;
    if (editions.has(editionKey)) {
      throw new Error(`Duplicate event family edition record: ${event.id}`);
    }
    editions.add(editionKey);

    if (!eventCategories.includes(event.category) || !eventPurposes.includes(event.purpose)) {
      throw new Error(`Invalid category or purpose for ${event.id}`);
    }
    if (
      !eventModes.includes(event.mode) ||
      !editorialStatuses.includes(event.editorialStatus) ||
      !["open-entry", "qualification-required", "invitation-only", "unknown"].includes(event.entryPathway) ||
      !["individual", "team", "both", "unknown"].includes(event.participationFormat) ||
      event.eligibility.audiences.some((audience) => !audiences.includes(audience))
    ) {
      throw new Error(`Invalid event status, mode, or audience for ${event.id}`);
    }
    if (!isDateOnly(event.lastVerified) || !isDateOnly(event.nextReview)) {
      throw new Error(`Invalid review date for ${event.id}`);
    }
    if (!isHttpsUrl(event.officialUrl)) {
      throw new Error(`Invalid official event URL for ${event.id}`);
    }
    if (event.schedule.state === "announced") {
      if (!event.schedule.startDate || !isDateOnly(event.schedule.startDate)) {
        throw new Error(`Invalid start date for ${event.id}`);
      }
      if (
        event.schedule.endDate &&
        (!isDateOnly(event.schedule.endDate) ||
          event.schedule.endDate < event.schedule.startDate)
      ) {
        throw new Error(`Invalid end date for ${event.id}`);
      }
      if (
        (event.schedule.startTime && !timePattern.test(event.schedule.startTime)) ||
        (event.schedule.endTime && !timePattern.test(event.schedule.endTime))
      ) {
        throw new Error(`Invalid published event time for ${event.id}`);
      }
      if ((event.schedule.startTime || event.schedule.endTime) && !event.schedule.timeZone) {
        throw new Error(`Published event times need an organizer timezone for ${event.id}`);
      }
    }
    if (event.schedule.timeZone && !isTimeZone(event.schedule.timeZone)) {
      throw new Error(`Invalid event timezone for ${event.id}`);
    }
    for (const variant of event.schedule.variants ?? []) {
      if (
        !variant.label ||
        !isDateOnly(variant.startDate) ||
        (variant.endDate &&
          (!isDateOnly(variant.endDate) || variant.endDate < variant.startDate)) ||
        (variant.startTime && !timePattern.test(variant.startTime)) ||
        (variant.endTime && !timePattern.test(variant.endTime)) ||
        ((variant.startTime || variant.endTime) && !variant.timeZone) ||
        (variant.timeZone && !isTimeZone(variant.timeZone))
      ) {
        throw new Error(`Invalid schedule variant for ${event.id}/${variant.label}`);
      }
    }

    const sourceIds = new Set(event.sources.map((source) => source.id));
    if (sourceIds.size !== event.sources.length) {
      throw new Error(`Duplicate source ID for ${event.id}`);
    }
    for (const source of event.sources) {
      if (!isHttpsUrl(source.url) || !isDateOnly(source.verifiedAt)) {
        throw new Error(`Invalid source record for ${event.id}/${source.id}`);
      }
      if (source.claims.some((claim) => !sourceClaims.includes(claim))) {
        throw new Error(`Invalid source claim for ${event.id}/${source.id}`);
      }
    }
    for (const route of event.registrationRoutes) {
      if (
        !routeTypes.includes(route.type) ||
        !registrationStatuses.includes(route.status) ||
        (route.audience && !audiences.includes(route.audience))
      ) {
        throw new Error(`Invalid route type or status for ${event.id}/${route.id}`);
      }
      if (!sourceIds.has(route.statusSourceId)) {
        throw new Error(`Missing status source for ${event.id}/${route.id}`);
      }
      const statusSource = event.sources.find((source) => source.id === route.statusSourceId);
      if (!statusSource?.claims.includes("registration-status")) {
        throw new Error(`Registration status has no supporting claim for ${event.id}/${route.id}`);
      }
      if (
        route.informationUrl &&
        (!route.informationSourceId ||
          !event.sources
            .find((source) => source.id === route.informationSourceId)
            ?.claims.includes("registration-route"))
      ) {
        throw new Error(`Route information has no supporting source for ${event.id}/${route.id}`);
      }
      if (
        route.registrationUrl &&
        (!route.registrationSourceId ||
          !event.sources
            .find((source) => source.id === route.registrationSourceId)
            ?.claims.includes("registration-route"))
      ) {
        throw new Error(`Registration URL has no supporting source for ${event.id}/${route.id}`);
      }
      if (!isDateOnly(route.lastChecked)) {
        throw new Error(`Invalid status check date for ${event.id}/${route.id}`);
      }
      if (
        (route.informationUrl && !isHttpsUrl(route.informationUrl)) ||
        (route.registrationUrl && !isHttpsUrl(route.registrationUrl))
      ) {
        throw new Error(`Invalid route URL for ${event.id}/${route.id}`);
      }
      if (route.deadline) {
        const { date, precision, cutoffTime, timeZone } = route.deadline;
        if (
          ![
            "student-registration",
            "school-team-registration",
            "host-purchasing",
            "organizer-purchasing",
            "organizer-license",
          ].includes(route.deadline.purpose)
        ) {
          throw new Error(`Invalid deadline purpose for ${event.id}/${route.id}`);
        }
        if (!isDateOnly(date)) {
          throw new Error(`Invalid deadline date for ${event.id}/${route.id}`);
        }
        if (precision === "timed" && (!cutoffTime || !timeZone || !timePattern.test(cutoffTime))) {
          throw new Error(`Timed deadline needs time and timezone for ${event.id}/${route.id}`);
        }
        if (timeZone && !isTimeZone(timeZone)) {
          throw new Error(`Invalid deadline timezone for ${event.id}/${route.id}`);
        }
        if (precision === "date-only" && (cutoffTime || timeZone)) {
          throw new Error(`Date-only deadline cannot include a time for ${event.id}/${route.id}`);
        }
        if (
          !route.deadlineSourceId ||
          !event.sources
            .find((source) => source.id === route.deadlineSourceId)
            ?.claims.includes("registration-deadline")
        ) {
          throw new Error(`Registration deadline has no supporting source for ${event.id}/${route.id}`);
        }
      }
    }
    for (const resource of event.resources) {
      if (!sourceIds.has(resource.sourceId)) {
        throw new Error(`Missing resource source for ${event.id}/${resource.title}`);
      }
      if (!isHttpsUrl(resource.url)) {
        throw new Error(`Invalid resource URL for ${event.id}/${resource.title}`);
      }
      if (
        !event.sources
          .find((source) => source.id === resource.sourceId)
          ?.claims.includes("preparation")
      ) {
        throw new Error(`Preparation resource has no supporting claim for ${event.id}/${resource.title}`);
      }
    }
    if (event.fee) {
      if (
        !Number.isFinite(event.fee.amount) ||
        event.fee.amount < 0 ||
        !event.fee.currency ||
        !event.sources
          .find((source) => source.id === event.fee?.sourceId)
          ?.claims.includes("fee")
      ) {
        throw new Error(`Published fee has no valid supporting source for ${event.id}`);
      }
    }
    for (const session of event.sessions ?? []) {
      if (session.editionId !== event.id) {
        throw new Error(`Session references a different edition for ${event.id}/${session.id}`);
      }
      if (
        session.capacity !== undefined &&
        (!Number.isInteger(session.capacity) || session.capacity < 0)
      ) {
        throw new Error(`Invalid session capacity for ${event.id}/${session.id}`);
      }
      if (
        session.registrationRouteId &&
        !event.registrationRoutes.some((route) => route.id === session.registrationRouteId)
      ) {
        throw new Error(`Unknown session registration route for ${event.id}/${session.id}`);
      }
    }
    for (const mapping of event.eligibility.verifiedGradeMappings) {
      if (
        mapping.usGradeId &&
        !usGradeFilterOptions.some((grade) => grade.id === mapping.usGradeId)
      ) {
        throw new Error(`Unknown US grade mapping for ${event.id}/${mapping.label}`);
      }
      if (!sourceIds.has(mapping.sourceId)) {
        throw new Error(`Missing grade-mapping source for ${event.id}/${mapping.label}`);
      }
      if (
        !event.sources
          .find((source) => source.id === mapping.sourceId)
          ?.claims.includes("grade-mapping")
      ) {
        throw new Error(`Grade mapping has no supporting claim for ${event.id}/${mapping.label}`);
      }
    }
    if (event.editorialStatus === "published") {
      const claims = new Set(event.sources.flatMap((source) => source.claims));
      if (!claims.has("identity")) {
        throw new Error(`Published event identity has no official source: ${event.id}`);
      }
      if (event.schedule.state === "announced" && !claims.has("schedule")) {
        throw new Error(`Published event schedule has no official source: ${event.id}`);
      }
      if (event.mode !== "unknown" && !claims.has("mode")) {
        throw new Error(`Published event mode has no official source: ${event.id}`);
      }
      if (
        event.venues.some((venue) => venue.city || venue.country || venue.region) &&
        !claims.has("venue")
      ) {
        throw new Error(`Published event venue has no official source: ${event.id}`);
      }
      if (event.eligibility.confirmed && !claims.has("eligibility")) {
        throw new Error(`Published event eligibility has no official source: ${event.id}`);
      }
    }
  }
}

export function validateEventFamilies(
  families: readonly EventFamily[],
  records: readonly EventRecord[],
): void {
  const familyIds = new Set<string>();
  const familyNames = new Set<string>();
  for (const family of families) {
    if (!family.id || familyIds.has(family.id)) {
      throw new Error(`Duplicate or missing event family ID: ${family.id}`);
    }
    familyIds.add(family.id);
    if (!eventCategories.includes(family.category) || !eventPurposes.includes(family.purpose)) {
      throw new Error(`Invalid category or purpose for event family ${family.id}`);
    }
    for (const alias of [family.name, ...family.aliases]) {
      const key = alias.trim().toLocaleLowerCase();
      if (!key || familyNames.has(key)) {
        throw new Error(`Duplicate or missing event family name or alias: ${alias}`);
      }
      familyNames.add(key);
    }
    if (!isHttpsUrl(family.officialUrl)) {
      throw new Error(`Invalid official event family URL for ${family.id}`);
    }
    for (const resource of family.preparationLinks) {
      if (!resource.title || !isHttpsUrl(resource.url)) {
        throw new Error(`Invalid family preparation link for ${family.id}.`);
      }
    }
  }
  for (const record of records) {
    const family = families.find((item) => item.id === record.familyId);
    if (!familyIds.has(record.familyId) || !family) {
      throw new Error(`Unknown event family for edition ${record.id}: ${record.familyId}`);
    }
    if (
      record.familyName !== family.name ||
      record.organizer !== family.organizer ||
      record.category !== family.category ||
      record.purpose !== family.purpose ||
      record.officialUrl !== family.officialUrl ||
      record.familyAliases.length !== family.aliases.length ||
      record.familyAliases.some((alias, index) => alias !== family.aliases[index])
    ) {
      throw new Error(`Edition family fields do not match its family record: ${record.id}`);
    }
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch (error) {
    if (error instanceof TypeError) return false;
    throw error;
  }
}

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format(new Date(0));
    return true;
  } catch (error) {
    if (error instanceof RangeError) return false;
    throw error;
  }
}
