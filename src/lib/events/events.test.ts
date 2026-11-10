import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { eventFamilies, eventRecords, getPublishedEvents } from "./data";
import {
  filterAndSortEvents,
  formatDeadline,
  getEventEditorialReport,
  getRouteStatus,
  getUpcomingDeadline,
  organizerTimeToEpoch,
  parseEventFilters,
  serializeEventFilters,
  type EventFilters,
} from "./service";
import {
  validateEventFamilies,
  validateEventRecords,
  type EventRecord,
  type RegistrationRoute,
} from "./schema";
import { eventSourceLeads, validateEventSourceLeads } from "./source-registry";

function route(
  id: string,
  deadline?: Omit<NonNullable<RegistrationRoute["deadline"]>, "purpose"> & {
    purpose?: NonNullable<RegistrationRoute["deadline"]>["purpose"];
  },
  status: RegistrationRoute["status"] = "open",
): RegistrationRoute {
  return {
    id,
    type: "direct",
    label: id,
    instructions: "Test-only route.",
    status,
    statusSourceId: "test-source",
    lastChecked: "2026-01-01",
    ...(deadline
      ? { deadline: { purpose: "student-registration" as const, ...deadline } }
      : {}),
  };
}

function fixture(
  id: string,
  registrationRoutes: RegistrationRoute[],
): EventRecord {
  const base = eventRecords[0];
  return {
    ...base,
    id,
    slug: id,
    name: id,
    registrationRoutes,
    editorialStatus: "published",
  };
}

const noFilters = (): EventFilters =>
  parseEventFilters(new URLSearchParams());

describe("event directory filters and source boundaries", () => {
  it("round-trips combined filters into shareable URL state", () => {
    const filters = parseEventFilters(
      new URLSearchParams(
        "q=amc&purpose=compete&category=competition&level=grade-8-and-below&mode=in-person&online=0&uncertain=1&entry=open-entry&format=individual&venue=US&eligible=US&from=2027-01-01&to=2027-01-31&status=unknown&sort=name",
      ),
    );
    const serialized = serializeEventFilters(filters);
    assert.equal(serialized.get("q"), "amc");
    assert.equal(serialized.get("venue"), "US");
    assert.equal(serialized.get("eligible"), "US");
    assert.equal(serialized.get("sort"), "name");
    assert.equal(serialized.get("purpose"), "compete");
    assert.equal(serialized.get("online"), "0");
    assert.deepEqual(parseEventFilters(serialized), filters);
    const filtered = filterAndSortEvents(
      getPublishedEvents(true),
      filters,
      new Date("2026-11-07T12:00:00Z"),
    ).events;
    assert.deepEqual(filtered.map((event) => event.id), ["maa-amc-8-2026-27"]);

    const invalid = parseEventFilters(
      new URLSearchParams("venue=ZZ&from=2027-02-31&sort=latest&archived=1"),
    );
    assert.equal(invalid.venueCountry, "");
    assert.equal(invalid.from, "");
    assert.equal(invalid.sort, "date");
    assert.equal(invalid.archived, true);
  });

  it("supports non-school audiences without treating them as grade-filter matches", () => {
    const researcherEvent = fixture("research-conference", []);
    researcherEvent.category = "conference";
    researcherEvent.eligibility = {
      ...researcherEvent.eligibility,
      audiences: ["researchers"],
      levels: [],
      schoolYearLabels: [],
      ageRestrictions: [],
      divisions: [],
    };
    const records = filterAndSortEvents(
      [researcherEvent],
      { ...noFilters(), audience: "researchers" },
      new Date("2026-01-01T00:00:00Z"),
    ).events;
    assert.deepEqual(records.map((event) => event.id), ["research-conference"]);
    assert.deepEqual(
      filterAndSortEvents(
        [researcherEvent],
        { ...noFilters(), level: "grade-8-and-below" },
        new Date("2026-01-01T00:00:00Z"),
      ).events,
      [],
    );
  });

  it("applies audience and registration-route filters to the same route", () => {
    const splitRoutes = fixture("split-routes", [
      {
        ...route("student-school"),
        type: "school",
        audience: "school-students",
      },
      {
        ...route("educator-direct"),
        type: "direct",
        audience: "educators",
      },
    ]);
    const now = new Date("2026-01-01T00:00:00Z");

    assert.deepEqual(
      filterAndSortEvents(
        [splitRoutes],
        {
          ...noFilters(),
          audience: "educators",
          registrationRoute: "school",
        },
        now,
      ).events,
      [],
    );
    assert.deepEqual(
      filterAndSortEvents(
        [splitRoutes],
        {
          ...noFilters(),
          audience: "educators",
          registrationRoute: "direct",
        },
        now,
      ).events.map((event) => event.id),
      ["split-routes"],
    );
  });

  it("keeps venue country separate from entrant eligibility", () => {
    const records = getPublishedEvents(true);
    const venueHungary = filterAndSortEvents(
      records,
      { ...noFilters(), venueCountry: "HU" },
      new Date("2026-11-07T12:00:00Z"),
    ).events;
    assert.deepEqual(venueHungary.map((event) => event.id), ["imo-2027"]);

    const eligibleHungary = filterAndSortEvents(
      records,
      { ...noFilters(), eligibleCountry: "HU", includeOnline: true },
      new Date("2026-11-07T12:00:00Z"),
    ).events;
    assert.deepEqual(eligibleHungary.map((event) => event.id), ["purple-comet-2027"]);

    const eligibleUs = filterAndSortEvents(
      records,
      { ...noFilters(), eligibleCountry: "US", archived: true },
      new Date("2026-11-07T12:00:00Z"),
    ).events;
    assert.ok(eligibleUs.some((event) => event.id === "maa-amc-8-2026-27"));
    assert.ok(eligibleUs.some((event) => event.id === "comc-2026"));
    assert.ok(!eligibleUs.some((event) => event.id === "imo-2027"));

    const europeVenue = filterAndSortEvents(
      records,
      { ...noFilters(), venueRegion: "Europe" },
      new Date("2026-11-07T12:00:00Z"),
    ).events;
    assert.deepEqual(europeVenue.map((event) => event.id), ["imo-2027"]);
  });

  it("matches organizer grade labels without inventing grade equivalencies", () => {
    const records = getPublishedEvents(true);
    const gradeEight = filterAndSortEvents(
      records,
      { ...noFilters(), level: "grade-8-and-below" },
      new Date("2026-11-07T12:00:00Z"),
    ).events;
    assert.deepEqual(gradeEight.map((event) => event.id), ["maa-amc-8-2026-27"]);
    assert.deepEqual(
      eventRecords.find((event) => event.id === "maa-amc-8-2026-27")
        ?.eligibility.verifiedGradeMappings,
      [],
    );

    const unsupportedMapping = {
      ...eventRecords[0],
      eligibility: {
        ...eventRecords[0].eligibility,
        verifiedGradeMappings: [
          {
            label: "Grade 8",
            equivalent: "Middle school",
            sourceId: "maa-amc",
          },
        ],
      },
    };
    assert.throws(
      () => validateEventRecords([unsupportedMapping]),
      /Grade mapping has no supporting claim/,
    );
  });

  it("uses the verified K–12 mapping and keeps online mode separate from eligibility", () => {
    const records = getPublishedEvents();
    const kindergarten = filterAndSortEvents(
      records,
      { ...noFilters(), level: "kindergarten" },
      new Date("2026-11-08T12:00:00Z"),
    );
    assert.deepEqual(kindergarten.events.map((event) => event.id), ["math-kangaroo-usa-2027"]);

    const eligibleUnitedStates = filterAndSortEvents(
      records,
      { ...noFilters(), eligibleCountry: "US" },
      new Date("2026-11-08T12:00:00Z"),
    );
    assert.ok(eligibleUnitedStates.events.some((event) => event.id === "math-kangaroo-usa-2027"));

    const ineligibleHungary = filterAndSortEvents(
      records,
      { ...noFilters(), eligibleCountry: "HU", includeUnknown: true },
      new Date("2026-11-08T12:00:00Z"),
    );
    assert.ok(!ineligibleHungary.events.some((event) => event.id === "math-kangaroo-usa-2027"));
    assert.ok(!ineligibleHungary.uncertainEvents.some((event) => event.id === "math-kangaroo-usa-2027"));
  });

  it("matches US elementary grades only when an official grade mapping exists", () => {
    const event = fixture("verified-elementary-event", []);
    event.eligibility = {
      ...event.eligibility,
      confirmed: true,
      levels: [],
      verifiedGradeMappings: [
        {
          label: "Local primary-year division",
          equivalent: "US Grade 3",
          usGradeId: "grade-3",
          sourceId: "test-source",
        },
      ],
    };
    const now = new Date("2026-01-01T00:00:00Z");
    assert.deepEqual(
      filterAndSortEvents(
        [event],
        { ...noFilters(), level: "grade-3" },
        now,
      ).events.map((item) => item.id),
      ["verified-elementary-event"],
    );
    assert.deepEqual(
      filterAndSortEvents(
        [event],
        { ...noFilters(), level: "grade-2" },
        now,
      ).events,
      [],
    );

    event.eligibility.verifiedGradeMappings = [];
    assert.deepEqual(
      filterAndSortEvents(
        [event],
        { ...noFilters(), level: "grade-3" },
        now,
      ).events,
      [],
    );
  });

  it("keeps unknown eligibility out of confirmed matches and labels it separately", () => {
    const unknownOnlineEvent = fixture("unknown-online-event", []);
    unknownOnlineEvent.mode = "online";
    unknownOnlineEvent.eligibility = {
      ...unknownOnlineEvent.eligibility,
      confirmed: false,
      summary: "Eligibility has not been verified.",
      levels: [],
      schoolYearLabels: [],
      eligibleCountries: [],
      eligibleRegions: [],
      worldwide: false,
      verifiedGradeMappings: [],
    };
    const filters = {
      ...noFilters(),
      eligibleCountry: "US",
      includeOnline: true,
    };
    const excluded = filterAndSortEvents(
      [unknownOnlineEvent],
      filters,
      new Date("2026-11-07T12:00:00Z"),
    );
    assert.deepEqual(excluded.events, []);
    assert.deepEqual(excluded.uncertainEvents, []);

    const included = filterAndSortEvents(
      [unknownOnlineEvent],
      { ...filters, includeUnknown: true },
      new Date("2026-11-07T12:00:00Z"),
    );
    assert.deepEqual(included.events, []);
    assert.deepEqual(included.uncertainEvents.map((event) => event.id), ["unknown-online-event"]);
  });

  it("validates source leads, family references, and duplicate editions", () => {
    assert.doesNotThrow(() => validateEventSourceLeads(eventSourceLeads));
    assert.doesNotThrow(() => validateEventFamilies(eventFamilies, eventRecords));
    assert.throws(
      () => validateEventFamilies([...eventFamilies, eventFamilies[0]], eventRecords),
      /Duplicate or missing event family ID/,
    );
    assert.throws(
      () => validateEventRecords([
        eventRecords[0],
        { ...eventRecords[0], id: "duplicate-edition", slug: "duplicate-edition" },
      ]),
      /Duplicate event family edition record/,
    );
  });

  it("reports missing editorial information and overdue verification", () => {
    const report = getEventEditorialReport(
      [
        {
          ...eventRecords.find((event) => event.id === "australian-maths-competition-2027-draft")!,
          nextReview: "2026-01-01",
        },
      ],
      new Date("2026-11-08T12:00:00Z"),
    );
    assert.ok(report.some((finding) => finding.severity === "missing" && finding.message.includes("dates")));
    assert.ok(report.some((finding) => finding.severity === "missing" && finding.message.includes("eligibility")));
    assert.ok(report.some((finding) => finding.severity === "stale" && finding.message.includes("review date")));
  });

  it("excludes drafts by default and exposes archived editions only on request", () => {
    const now = new Date("2026-11-07T12:00:00Z");
    const allRecords = eventRecords;
    const current = filterAndSortEvents(allRecords, noFilters(), now).events;
    assert.ok(current.every((event) => event.editorialStatus === "published"));
    assert.ok(!current.some((event) => event.id === "comc-2026"));
    assert.ok(!current.some((event) => event.id === "australian-maths-competition-2027-draft"));

    const withArchive = filterAndSortEvents(
      allRecords,
      { ...noFilters(), archived: true },
      now,
    ).events;
    assert.ok(withArchive.some((event) => event.id === "comc-2026"));
    assert.ok(!withArchive.some((event) => event.id === "australian-maths-competition-2027-draft"));

    const closedArchive = filterAndSortEvents(
      allRecords,
      { ...noFilters(), archived: true, registrationStatus: "closed" },
      now,
    ).events;
    assert.deepEqual(closedArchive.map((event) => event.id), [
      "comc-2026",
      "math-kangaroo-usa-2027",
    ]);
  });
});

describe("event deadlines and organizer time zones", () => {
  it("converts valid local times and rejects daylight-saving gaps and ambiguities", () => {
    assert.equal(
      new Date(
        organizerTimeToEpoch("2026-03-08", "03:30", "America/New_York") ?? 0,
      ).toISOString(),
      "2026-03-08T07:30:00.000Z",
    );
    assert.equal(
      organizerTimeToEpoch("2026-03-08", "02:30", "America/New_York"),
      undefined,
    );
    assert.equal(
      organizerTimeToEpoch("2026-11-01", "01:30", "America/New_York"),
      undefined,
    );
  });

  it("does not turn a date-only deadline into midnight or auto-close it", () => {
    const dateOnly = route("date-only", {
      date: "2026-11-06",
      precision: "date-only",
    });
    const state = getRouteStatus(dateOnly, new Date("2026-11-07T12:00:00Z"));
    assert.deepEqual(state, { status: "open", needsReview: true });
    assert.equal(formatDeadline(dateOnly.deadline), "Nov 6, 2026 (date only)");
  });

  it("marks a passed timed deadline closed and requests an editorial recheck", () => {
    const timed = route("timed", {
      date: "2026-11-07",
      precision: "timed",
      cutoffTime: "12:00",
      timeZone: "America/New_York",
    });
    assert.deepEqual(
      getRouteStatus(timed, new Date("2026-11-07T17:01:00Z")),
      { status: "closed", needsReview: true },
    );
  });

  it("does not infer an open status from a future deadline", () => {
    const unknown = route(
      "unknown-status",
      {
        date: "2026-11-08",
        precision: "timed",
        cutoffTime: "12:00",
        timeZone: "America/New_York",
      },
      "unknown",
    );
    assert.deepEqual(
      getRouteStatus(unknown, new Date("2026-11-07T12:00:00Z")),
      { status: "unknown", needsReview: false },
    );
  });

  it("selects the earliest relevant route and sorts known deadlines before unknown", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const multiRoute = fixture("routes", [
      route("division-later", {
        date: "2026-01-04",
        precision: "date-only",
      }),
      route("division-earlier", {
        date: "2026-01-02",
        precision: "timed",
        cutoffTime: "18:30",
        timeZone: "America/New_York",
      }),
      route("closed-route", {
        date: "2026-01-01",
        precision: "timed",
        cutoffTime: "12:00",
        timeZone: "UTC",
      }, "closed"),
    ]);
    const dateOnly = fixture("date-only-event", [
      route("date-only", { date: "2026-01-03", precision: "date-only" }),
    ]);
    const unknown = fixture("unknown-event", [route("unknown")]);
    const earliest = getUpcomingDeadline(multiRoute, now);
    assert.equal(earliest?.route.id, "division-earlier");

    const result = filterAndSortEvents(
      [unknown, dateOnly, multiRoute],
      { ...noFilters(), sort: "deadline" },
      now,
    ).events;
    assert.deepEqual(result.map((event) => event.id), [
      "routes",
      "date-only-event",
      "unknown-event",
    ]);
  });

  it("orders timed deadlines by their actual instants and route-specific dates", () => {
    const tokyo = fixture("tokyo", [
      route("tokyo-route", {
        date: "2026-01-02",
        precision: "timed",
        cutoffTime: "09:00",
        timeZone: "Asia/Tokyo",
      }),
    ]);
    const newYork = fixture("new-york", [
      route("new-york-route", {
        date: "2026-01-01",
        precision: "timed",
        cutoffTime: "18:30",
        timeZone: "America/New_York",
      }),
    ]);
    const result = filterAndSortEvents(
      [tokyo, newYork],
      { ...noFilters(), sort: "deadline" },
      new Date("2026-01-01T00:00:00Z"),
    ).events;
    assert.deepEqual(result.map((event) => event.id), ["new-york", "tokyo"]);
  });

  it("places timed deadlines before a date-only deadline on the same day", () => {
    const timed = fixture("timed", [
      route("timed-route", {
        date: "2026-01-02",
        precision: "timed",
        cutoffTime: "23:59",
        timeZone: "Pacific/Honolulu",
      }),
    ]);
    const dateOnly = fixture("date-only", [
      route("date-route", { date: "2026-01-02", precision: "date-only" }),
    ]);
    const result = filterAndSortEvents(
      [dateOnly, timed],
      { ...noFilters(), sort: "deadline" },
      new Date("2026-01-01T00:00:00Z"),
    ).events;
    assert.deepEqual(result.map((event) => event.id), ["timed", "date-only"]);
  });

  it("uses division, mode, and registration-route filters to select a deadline", () => {
    const event = fixture("multi-route", [
      {
        ...route("online-middle", {
          date: "2026-01-02",
          precision: "date-only",
        }),
        type: "team",
        division: "Middle",
        mode: "online",
      },
      {
        ...route("in-person-high", {
          date: "2026-01-03",
          precision: "date-only",
        }),
        type: "school",
        division: "High",
        mode: "in-person",
      },
    ]);
    const selected = getUpcomingDeadline(
      event,
      new Date("2026-01-01T00:00:00Z"),
      { mode: "in-person", division: "High", registrationRoute: "school" },
    );
    assert.equal(selected?.route.id, "in-person-high");
  });

  it("never exposes MAA host-purchasing deadlines as student deadlines", () => {
    const now = new Date("2026-11-08T12:00:00Z");
    const amc8 = eventRecords.find((event) => event.id === "maa-amc-8-2026-27");
    const amc10b = eventRecords.find((event) => event.id === "maa-amc-10-b-2026");
    assert.ok(amc8);
    assert.ok(amc10b);

    assert.equal(
      getUpcomingDeadline(amc8, now, { audience: "school-students" }),
      undefined,
    );
    const newManagerDeadline = getUpcomingDeadline(amc8, now, {
      audience: "educators",
      registrationRoute: "school",
    });
    assert.equal(newManagerDeadline, undefined);
    assert.equal(
      amc8.registrationRoutes.find((route) => route.id === "new-manager-registration")?.deadline?.purpose,
      "host-purchasing",
    );

    const bundleDeadline = getUpcomingDeadline(amc10b, now, {
      audience: "educators",
      division: "AMC 10",
    });
    assert.equal(bundleDeadline, undefined);
    assert.equal(
      amc10b.registrationRoutes.find((route) => route.id === "additional-site-bundles")?.deadline?.purpose,
      "organizer-license",
    );

    assert.deepEqual(
      filterAndSortEvents(
        [amc8],
        {
          ...noFilters(),
          audience: "educators",
          registrationStatus: "unknown",
        },
        now,
      ).events,
      [],
    );
  });

  it("keeps regional editions as separate event-date variants", () => {
    const comc = eventRecords.find((event) => event.id === "comc-2026");
    assert.ok(comc);
    const schedule = filterAndSortEvents(
      [comc],
      { ...noFilters(), archived: true },
      new Date("2026-11-07T12:00:00Z"),
    ).events[0]?.schedule;
    assert.equal(schedule?.variants?.length, 2);
    assert.equal(schedule?.variants?.[0].startDate, "2026-10-29");
    assert.equal(schedule?.variants?.[1].startDate, "2026-10-30");
  });
});
