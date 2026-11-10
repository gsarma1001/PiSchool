export type MathNewsStory = {
  id: string;
  title: string;
  category: string;
  summary: string;
  publisher: string;
  sourceUrl: string;
  publishedOn: string;
  reviewedOn: string;
};

export const mathNewsStories: MathNewsStory[] = [
  {
    id: "graham-rearrangement-conjecture",
    title: "A 55-year-old conjecture finds a solution through randomness",
    category: "Combinatorics",
    summary:
      "Researchers resolved Ronald Graham’s rearrangement conjecture, a question about ordering numbers so their running sums stay distinct. Quanta’s report describes how probabilistic methods and collaboration across several papers contributed to the result.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/mathematicians-harness-randomness-to-crack-a-55-year-old-conjecture-20260928/",
    publishedOn: "2026-09-28",
    reviewedOn: "2026-11-08",
  },
  {
    id: "four-color-theorem-proof",
    title: "A new computer-assisted proof revisits the four-color theorem",
    category: "Graph theory",
    summary:
      "A research team produced another computer-assisted proof of the four-color theorem. The work also points to more efficient ways to color maps and graphs and offers insight into planar graph structure; it is a new proof of a known theorem, not a newly discovered theorem.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/the-four-color-theorem-gets-a-rare-new-proof-20260910/",
    publishedOn: "2026-09-10",
    reviewedOn: "2026-11-08",
  },
];
