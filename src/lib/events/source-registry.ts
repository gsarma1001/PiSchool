export type EventSourceLead = {
  id: string;
  organization: string;
  focus: string;
  url: string;
  role: "organizer" | "discovery-only";
};

export const eventSourceLeads: EventSourceLead[] = [
  { id: "math-kangaroo", organization: "Math Kangaroo USA", focus: "Elementary and school-age competitions", url: "https://mathkangaroo.org/", role: "organizer" },
  { id: "noetic-learning", organization: "Noetic Learning", focus: "Elementary and middle-school contests", url: "https://www.noetic-learning.com/mathcontest/index.jsp", role: "organizer" },
  { id: "moems", organization: "MOEMS", focus: "Elementary and middle-school contests", url: "https://www.moems.org/", role: "organizer" },
  { id: "mathcounts", organization: "MATHCOUNTS", focus: "Middle-school competitions", url: "https://mathcounts.org/", role: "organizer" },
  { id: "mathleague", organization: "mathleague.org", focus: "School-age competitions", url: "https://mathleague.org/", role: "organizer" },
  { id: "maa-amc", organization: "Mathematical Association of America", focus: "AMC competitions", url: "https://maa.org/student-programs/amc/", role: "organizer" },
  { id: "berkeley-math-tournament", organization: "Berkeley Math Tournament", focus: "Middle- and high-school tournament", url: "https://berkeley.mt/", role: "organizer" },
  { id: "hmmt", organization: "Harvard-MIT Mathematics Tournament", focus: "High-school tournament", url: "https://www.hmmt.org/", role: "organizer" },
  { id: "pumac", organization: "Princeton University Mathematics Competition", focus: "High-school competition", url: "https://pumac.princeton.edu/", role: "organizer" },
  { id: "cmimc", organization: "Carnegie Mellon competitions", focus: "Secondary-school competitions", url: "https://cmimc.com/competitions", role: "organizer" },
  { id: "purple-comet", organization: "Purple Comet! Math Meet", focus: "Online team competition", url: "https://www.purplecomet.org/", role: "organizer" },
  { id: "comap-contests", organization: "COMAP", focus: "Modeling challenges", url: "https://comap.org/contests", role: "organizer" },
  { id: "himcm-midmcm", organization: "COMAP", focus: "HiMCM and MidMCM", url: "https://comap.org/contests/himcm-midmcm", role: "organizer" },
  { id: "immc", organization: "COMAP", focus: "IM²C modeling challenge", url: "https://www.comap.org/contests/immc", role: "organizer" },
  { id: "newport-clubs", organization: "Newport High School", focus: "Washington school clubs; distinguish KPMT", url: "https://newporthigh.bsd405.org/student-life/clubs-and-activities", role: "organizer" },
  { id: "washington-student-math-association", organization: "Washington Student Math Association", focus: "Washington competitions", url: "https://hub.wastudentmath.org/Competitions", role: "organizer" },
  { id: "uw-monthly-math-hour", organization: "University of Washington", focus: "Student talks and math circles", url: "https://sites.math.washington.edu/~mathcircle/mathhour/", role: "organizer" },
  { id: "waterloo-cemc", organization: "University of Waterloo CEMC", focus: "Canadian contests", url: "https://cemc.uwaterloo.ca/contests", role: "organizer" },
  { id: "ukmt", organization: "UK Mathematics Trust", focus: "United Kingdom competitions", url: "https://ukmt.org.uk/competitions", role: "organizer" },
  { id: "australian-maths-trust", organization: "Australian Maths Trust", focus: "Australian competitions", url: "https://amt.edu.au/competitions", role: "organizer" },
  { id: "hbcse-olympiads", organization: "Homi Bhabha Centre for Science Education", focus: "India Olympiad program", url: "https://olympiads.hbcse.tifr.res.in/", role: "organizer" },
  { id: "singapore-mathematical-society", organization: "Singapore Mathematical Society", focus: "Singapore Mathematical Olympiad", url: "https://sgmathsociety.org/singapore-mathematical-olympiad-smo/", role: "organizer" },
  { id: "south-african-mathematics-foundation", organization: "South African Mathematics Foundation", focus: "South African math calendar", url: "https://www.samf.ac.za/en/maths-calendar", role: "organizer" },
  { id: "imo-national-organizers", organization: "International Mathematical Olympiad", focus: "National organization directory", url: "https://www.imo-official.org/countries/", role: "organizer" },
  { id: "egmo", organization: "European Girls' Mathematical Olympiad", focus: "European girls' Olympiad", url: "https://www.egmo.org/", role: "organizer" },
  { id: "julia-robinson-math-festival", organization: "Julia Robinson Mathematics Festival", focus: "Student math festivals", url: "https://jrmf.org/", role: "organizer" },
  { id: "math-circle-network", organization: "Math Circle Network", focus: "Math circles and learning programs", url: "https://mathcircles.org/", role: "organizer" },
  { id: "stanford-math-festivals", organization: "Stanford mathematics festivals", focus: "Student math festivals", url: "https://mathcircle.spcs.stanford.edu/mathematics-festivals", role: "organizer" },
  { id: "maa-mathfest", organization: "Mathematical Association of America", focus: "MathFest conference", url: "https://maa.org/events/mathfest-program/", role: "organizer" },
  { id: "nctm-calendar", organization: "National Council of Teachers of Mathematics", focus: "Educator events", url: "https://my.nctm.org/events/calendar", role: "organizer" },
  { id: "high-school-opportunity", organization: "High School Opportunity", focus: "Discovery lead only; verify with event organizer", url: "https://highschoolopportunity.org/categories/competitions/math", role: "discovery-only" },
  { id: "prepscholar-competitions", organization: "PrepScholar", focus: "Discovery lead only; verify with event organizer", url: "https://blog.prepscholar.com/high-school-math-competitions", role: "discovery-only" },
  { id: "comap-blog", organization: "COMAP", focus: "Discovery lead; verify current facts on the event page", url: "https://www.comap.org/blog/item/math-competitions-for-students", role: "discovery-only" },
];

export function validateEventSourceLeads(
  leads: readonly EventSourceLead[],
): void {
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const lead of leads) {
    let url: URL;
    try {
      url = new URL(lead.url);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Invalid source lead URL for ${lead.id}.`);
      }
      throw error;
    }
    if (
      !lead.id ||
      ids.has(lead.id) ||
      url.protocol !== "https:" ||
      urls.has(url.href)
    ) {
      throw new Error(`Duplicate or invalid event source lead: ${lead.id}`);
    }
    ids.add(lead.id);
    urls.add(url.href);
  }
}

validateEventSourceLeads(eventSourceLeads);
