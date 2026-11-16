export type MathNewsAudience =
  | "K-2"
  | "grades-3-5"
  | "grades-6-8"
  | "grades-9-12"
  | "college-adults";

export type MathNewsPaywallStatus =
  | "not-observed"
  | "abstract-only"
  | "unconfirmed";

export type MathNewsStory = {
  id: string;
  title: string;
  category: string;
  audience: MathNewsAudience;
  summary: string;
  tryThis?: string;
  publisher: string;
  sourceUrl: string;
  publishedOn: string;
  reviewedOn: string;
  paywallStatus: MathNewsPaywallStatus;
};

export const mathNewsStories: MathNewsStory[] = [
  {
    id: "condorcet-paradox-topology",
    title: "How Voting Is Like a Klein Bottle",
    category: "Topology",
    audience: "grades-6-8",
    summary:
      "A group of voters can each rank three choices consistently while their collective pairwise preferences form a cycle. Researchers studied a mathematical model of such preference cycles using topology. In their framework, the contradiction corresponds to a non-orientable surface, which can be a Klein bottle or a projective plane depending on the representation. The model offers a geometric perspective on a classical problem in social choice theory.",
    tryThis:
      "Make three groups of voters with different rankings of A, B, and C, then compare each pair of choices.",
    publisher: "Quanta Magazine",
    sourceUrl: "https://www.quantamagazine.org/how-voting-is-like-a-klein-bottle-20261026/",
    publishedOn: "2026-10-26",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "ai-exponential-time-hypothesis",
    title: "AI Refutes 30-Year-Old Mathematical Assumption in Computer Science",
    category: "Algorithms",
    audience: "grades-9-12",
    summary:
      "OpenAI says its models found an algorithm that appears to contradict the exponential time hypothesis, an assumption about how quickly certain difficult puzzles can be solved. Experts quoted in the article stress that the claim still needs confirmation. The hypothesis underpins many results about algorithmic limits, but disproving it would not answer the separate P versus NP question. The story distinguishes a striking claim from a result that has completed independent review.",
    tryThis:
      "Compare trying every possible answer with using a shortcut, and ask how the work might grow as a puzzle gets larger.",
    publisher: "New Scientist",
    sourceUrl:
      "https://www.newscientist.com/article/2596045-ai-refutes-30-year-old-mathematical-assumption-in-computer-science/",
    publishedOn: "2026-10-27",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "quasi-riemann-hypothesis-ai",
    title: "AI Proved the Quasi-Riemann Hypothesis. What Happens Now?",
    category: "Number theory",
    audience: "college-adults",
    summary:
      "OpenAI announced a proof of the quasi-Riemann hypothesis, a weaker statement related to the famous Riemann hypothesis about prime numbers. Number theorists quoted by Quanta describe the result as important while examining how the proof fits with established mathematics. The article explains that the full Riemann hypothesis remains open. It reports an active mathematical review, not a resolution of the original problem.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/ai-proved-the-quasi-riemann-hypothesis-what-happens-now-20261019/",
    publishedOn: "2026-10-19",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "symmetrical-venn-diagram",
    title: "AI Finds Bafflingly Complex but Beautiful Symmetrical Venn Diagram",
    category: "Combinatorics",
    audience: "grades-6-8",
    summary:
      "A software developer used two AI models to search for rotationally symmetrical Venn diagrams with many sets. The article reports examples with 17 and 19 sets, extending earlier examples with fewer sets. These diagrams represent all possible relationships among sets, though the largest examples are far too intricate to read easily. The story describes a computational search and the checks used to examine its results.",
    tryThis:
      "Draw two or three overlapping circles and label the regions to see how each one represents a different combination.",
    publisher: "New Scientist",
    sourceUrl:
      "https://www.newscientist.com/article/2591415-ai-finds-bafflingly-complex-but-beautiful-symmetrical-venn-diagram/",
    publishedOn: "2026-10-05",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "fourth-spatial-dimension",
    title: "What Does the Fourth Dimension Actually Look Like?",
    category: "Topology",
    audience: "grades-6-8",
    summary:
      "Mathematicians use topology to reason about spaces with more than three spatial dimensions. In this Quanta podcast, mathematician Maggie Miller discusses how knots behave differently in four dimensions. She describes work resolving a question about knotted surfaces that had been open since 1982. The conversation connects abstract geometry with visual models and familiar ideas such as loops and surfaces.",
    tryThis:
      "Compare how a tangled loop might move on a flat page, in a room, and in an imagined extra direction.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/what-does-the-fourth-dimension-actually-look-like-20261001/",
    publishedOn: "2026-10-01",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "graham-rearrangement-conjecture",
    title: "Mathematicians Harness Randomness To Crack a 55-Year-Old Conjecture",
    category: "Combinatorics",
    audience: "grades-6-8",
    summary:
      "A long-standing question asks whether a set of nonzero numbers can be ordered so that its running sums are all different in finite clock arithmetic. Several mathematicians resolved the conjecture through a sequence of papers using ideas from different areas. The problem may have been inspired by juggling, where repeated landing times would spoil a pattern. Randomness helped researchers find structure in a setting with strict constraints.",
    tryThis:
      "Choose a small clock size, add numbers one at a time, and track whether any running totals repeat.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/mathematicians-harness-randomness-to-crack-a-55-year-old-conjecture-20260928/",
    publishedOn: "2026-09-28",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "four-color-theorem-new-proof",
    title: "The Four-Color Theorem Gets a Rare New Proof",
    category: "Graph theory",
    audience: "grades-3-5",
    summary:
      "The four-color theorem says that any map can be colored with four colors so neighboring regions have different colors. A research team has produced another computer-assisted proof of this long-established theorem. The new method also gives researchers a more efficient way to color maps and graphs. It is a new proof of a known result, not a newly discovered theorem.",
    tryThis:
      "Draw a map with several connected regions and see whether you can color it without matching colors on neighboring regions.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/the-four-color-theorem-gets-a-rare-new-proof-20260910/",
    publishedOn: "2026-09-10",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "graph-sandwich-conjecture",
    title: "Mathematicians Build a Long-Awaited Graph Sandwich",
    category: "Graph theory",
    audience: "grades-6-8",
    summary:
      "The sandwich conjecture asks whether a large random graph can be placed between two simpler graphs in a mathematically useful way. Three mathematicians completed a proof after years of progress on the problem. The result connects two models of randomness and can help researchers study networks. Quanta introduces the idea through the surprising image of one graph being sandwiched between two others.",
    tryThis:
      "Draw a few points and lines, then see how adding or removing connections changes the network.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/mathematicians-build-long-awaited-graph-sandwich-20260918/",
    publishedOn: "2026-09-18",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "adaptive-materials-mathematical-framework",
    title: "Mathematical Framework Connects Biological Principles to Adaptive Materials",
    category: "Mathematical modeling",
    audience: "grades-3-5",
    summary:
      "MIT researchers developed a mathematical framework for translating how natural materials behave into engineered designs. They illustrate the approach with pine cones, whose scales respond to changes in humidity. The framework links behavior at different scales and turns the design into manufacturing instructions. The researchers describe possible future uses in soft robotic grippers and shape-changing structures.",
    tryThis:
      "Notice how a pine cone changes as it dries, then imagine what other objects could respond to heat or moisture.",
    publisher: "MIT News",
    sourceUrl:
      "https://news.mit.edu/2026/mathematical-framework-connects-biological-principles-manufacturable-adaptive-material-0817",
    publishedOn: "2026-08-17",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "hong-wang-fields-medal",
    title: "Hong Wang Wins 2026 Fields Medal for Work on the Kakeya Conjecture",
    category: "Harmonic analysis",
    audience: "college-adults",
    summary:
      "Hong Wang received a 2026 Fields Medal after proving the three-dimensional Kakeya conjecture with collaborator Joshua Zahl. The problem connects harmonic analysis, geometry, and partial differential equations. Quanta's profile describes how the pair's proof was checked and refined before its publication. Wang is the third woman to receive the Fields Medal.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/hong-wang-wins-2026-fields-medal-the-third-woman-ever-20260723/",
    publishedOn: "2026-07-23",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "yu-deng-fields-medal",
    title: "Yu Deng Wins a Fields Medal for Work on Randomness and Waves",
    category: "Mathematical physics",
    audience: "college-adults",
    summary:
      "Yu Deng received a 2026 Fields Medal for research on equations that describe interacting waves and particles. His work studies how randomness moves through these systems and how larger-scale patterns can emerge. Quanta's profile connects the technical research to Deng's mathematical approach and personal path. The award recognizes work spanning probability, equations, and mathematical physics.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/yu-deng-wins-the-fields-medal-2026-for-his-work-on-the-random-data-problem-20260723/",
    publishedOn: "2026-07-23",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "mathnet-olympiad-problems",
    title: "MIT Team Opens a Large Collection of Olympiad-Level Math Problems",
    category: "Problem solving",
    audience: "grades-9-12",
    summary:
      "Researchers at MIT, KAUST, and HUMAIN assembled MathNet, a collection of more than 30,000 expert-authored problems and solutions. The set covers 47 countries, 17 languages, and 143 competitions. Its sources include official competition booklets spanning several decades. The searchable collection is intended for research and for students preparing for mathematics competitions.",
    tryThis:
      "Choose one problem from a competition archive and compare your solution with the published explanation.",
    publisher: "MIT News",
    sourceUrl:
      "https://news.mit.edu/2026/mit-scientists-build-worlds-largest-collection-olympiad-level-math-problems-open-0424",
    publishedOn: "2026-04-24",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "putnam-math-competition-mit-2026",
    title: "MIT Takes Top Team Honors in the 86th Putnam Math Competition",
    category: "Competition",
    audience: "grades-9-12",
    summary:
      "MIT's team placed first in the 86th William Lowell Putnam Mathematical Competition. Four of the five Putnam Fellows, the competition's highest-ranked students, were from MIT, and Jessica Wan received the Elizabeth Lowell Putnam Prize. The article also describes a seminar where students practice solving and explaining difficult problems. It shows how collaborative preparation can accompany individual competition work.",
    publisher: "MIT News",
    sourceUrl:
      "https://news.mit.edu/2026/mit-takes-top-team-honors-putnam-math-competition-0423",
    publishedOn: "2026-04-23",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "finger-counting-addition-skills",
    title: "The Role of Children’s Finger Counting History on Their Addition Skills",
    category: "Early numeracy",
    audience: "K-2",
    summary:
      "Researchers studied how children's history of finger counting relates to their addition skills. The longitudinal study tracked children as their counting strategies changed over time. The article's publication record lists it in Developmental Psychology, volume 62, issue 4, in April 2026. Its question is useful for families: fingers can help represent quantities while a child is learning number relationships.",
    publisher: "Developmental Psychology (American Psychological Association)",
    sourceUrl: "https://doi.org/10.1037/dev0002099",
    publishedOn: "2026-04",
    reviewedOn: "2026-11-13",
    paywallStatus: "unconfirmed",
  },
  {
    id: "crowd-walking-mathematical-model",
    title: "Mathematicians Uncover the Logic Behind How People Walk in Crowds",
    category: "Mathematical modeling",
    audience: "grades-3-5",
    summary:
      "MIT researchers studied how pedestrian paths form orderly lanes or become tangled in busy spaces. They used mathematical analysis, computer simulations, and experiments with people walking through a crowd. The team identified angular spread, or how many directions people move, as an important factor in the transition. The work may help planners design safer and more efficient public spaces.",
    tryThis:
      "Watch people move through a busy hallway and notice whether they form lanes or weave in many directions.",
    publisher: "MIT News",
    sourceUrl:
      "https://news.mit.edu/2025/mathematicians-uncover-logic-behind-how-crowds-walk-0324",
    publishedOn: "2025-03-24",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "math-skills-market-school",
    title: "Study in India Shows Kids Use Different Math Skills at Work vs. School",
    category: "Math education",
    audience: "grades-3-5",
    summary:
      "A study in India compared children who work in markets with students who do not. Market-working children often solved practical price and change problems quickly but found some school-style arithmetic difficult. Students who did well on classroom problems could struggle with similar calculations in a market setting. The researchers found that success in one context did not automatically transfer to the other.",
    tryThis:
      "Try the same arithmetic problem once as a number sentence and once as a shopping question.",
    publisher: "MIT News",
    sourceUrl:
      "https://news.mit.edu/2025/study-shows-kids-use-different-math-skills-work-vs-school-0205",
    publishedOn: "2025-02-05",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "at-17-hannah-cairo",
    title: "At 17, Hannah Cairo Solved a Major Math Mystery",
    category: "Harmonic analysis",
    audience: "grades-9-12",
    summary:
      "At 17, Hannah Cairo disproved a 40-year-old conjecture about how certain mathematical functions behave. She developed the counterexample after encountering the problem in an advanced course at UC Berkeley. The result challenged assumptions that mathematicians had held for decades. Quanta's profile describes her path through self-directed study, math circles, and advanced university classes.",
    publisher: "Quanta Magazine",
    sourceUrl:
      "https://www.quantamagazine.org/at-17-hannah-cairo-solved-a-major-math-mystery-20250801/",
    publishedOn: "2025-08-01",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "early-math-games-systematic-review",
    title: "The Role of Math Games for Children’s Early Math Learning: A Systematic Review",
    category: "Early numeracy",
    audience: "K-2",
    summary:
      "A systematic review examined research on math games for children from preschool through third grade. It compared game settings, game types, math content, and how long children played. The review describes design features that researchers have examined rather than naming one best game. The authors call for more comparisons across settings and closer study of which features support learning.",
    publisher: "Journal of Numerical Cognition",
    sourceUrl: "https://eric.ed.gov/?id=EJ1480581",
    publishedOn: "2025",
    reviewedOn: "2026-11-13",
    paywallStatus: "abstract-only",
  },
  {
    id: "mit-calculus-project",
    title: "MIT Undergraduates Help U.S. High Schoolers Tackle Calculus",
    category: "Math education",
    audience: "grades-9-12",
    summary:
      "MIT's Calculus Project pairs university students and alumni with high school students for weekly tutoring. The program began with a summer camp and expanded to work with school districts across the United States. The article describes tutoring coordinated with school staff and teachers. It presents calculus support as both academic help and a chance for students to connect with mentors.",
    publisher: "MIT News",
    sourceUrl:
      "https://news.mit.edu/2026/mit-undergraduates-help-us-high-schoolers-tackle-calculus-0310",
    publishedOn: "2026-03-10",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
  {
    id: "identifying-stages-pattern-recognition",
    title: "Identifying Stages of Pattern Recognition: Evidence for a Three-Stage Developmental Model",
    category: "Early algebra",
    audience: "grades-3-5",
    summary:
      "Researchers studied how children recognize repeating and growing patterns. They found three developmental profiles: noticing regularity, identifying a repeating unit, and recognizing how a pattern grows. The profiles were associated with grade level and other learner characteristics. The study highlights why explaining a pattern's rule can be as important as continuing it.",
    tryThis:
      "Make a growing pattern with blocks and explain how many blocks will be added at each step.",
    publisher: "Frontiers in Education",
    sourceUrl:
      "https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1861516/full",
    publishedOn: "2026",
    reviewedOn: "2026-11-13",
    paywallStatus: "not-observed",
  },
];
