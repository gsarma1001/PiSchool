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
    id: "condorcet-paradox-topology",
    title: "A geometric view of a voting paradox",
    category: "Topology",
    summary:
      "A group of voters can each rank three choices consistently while their collective pairwise preferences form a cycle. Researchers studied a mathematical model of such preference cycles using topology. In their framework, the contradiction corresponds to a non-orientable surface, which can be a Klein bottle or a projective plane depending on the representation. The model offers a geometric perspective on a classical problem in social choice theory.",
    publisher: "Quanta Magazine",
    sourceUrl: "https://www.quantamagazine.org/how-voting-is-like-a-klein-bottle-20261026/",
    publishedOn: "2026-10-26",
    reviewedOn: "2026-11-13",
  },
  {
    id: "graham-rearrangement-conjecture",
    title: "A 55-year-old conjecture finds a solution through randomness",
    category: "Combinatorics",
    summary:
      "Researchers resolved Ronald Graham’s rearrangement conjecture, a question about ordering numbers so their running sums stay distinct. The problem concerns arithmetic in a finite cyclic setting, like numbers wrapping around a clock. The proof developed across several papers. Quanta describes how probabilistic methods and collaboration contributed to the result.",
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
      "A research team produced another computer-assisted proof of the four-color theorem. The theorem says that four colors suffice to color a planar map so neighboring regions have different colors. The work also offers insight into the structure of planar graphs. It is a new proof of a known theorem, not a newly discovered theorem.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/the-four-color-theorem-gets-a-rare-new-proof-20260910/",
    publishedOn: "2026-09-10",
    reviewedOn: "2026-11-08",
  },
];
