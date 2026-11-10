import {
  elementaryChallengeLevels,
  type ElementaryLevelId,
  type ElementaryLevelLabel,
} from "../../lib/curriculum";

export const courseCatalog = [
  { id: "arithmetic-number-sense", name: "Arithmetic and Number Sense", description: "Build fluency with whole numbers and the place-value system.", order: 1 },
  { id: "fractions-decimals-percentages", name: "Fractions, Decimals, and Percentages", description: "Represent and calculate with fractional and equivalent quantities.", order: 2 },
  { id: "ratios-proportional-reasoning", name: "Ratios and Proportional Reasoning", description: "Model multiplicative relationships between quantities.", order: 3 },
  { id: "pre-algebra", name: "Pre-Algebra", description: "Strengthen number reasoning and prepare for symbolic algebra.", order: 4 },
  { id: "algebra-1", name: "Algebra 1", description: "Study equations, functions, and foundational algebraic models.", order: 5 },
  { id: "geometry", name: "Geometry", description: "Reason about shapes, measurements, transformations, and proof.", order: 6 },
  { id: "algebra-2", name: "Algebra 2", description: "Extend function, polynomial, and equation concepts.", order: 7 },
  { id: "trigonometry", name: "Trigonometry", description: "Explore angles, trigonometric functions, and their applications.", order: 8 },
  { id: "precalculus", name: "Precalculus", description: "Connect advanced function topics and prepare for calculus.", order: 9 },
  { id: "calculus-1", name: "Calculus 1", description: "Study limits, derivatives, and introductory integration.", order: 10 },
  { id: "calculus-2", name: "Calculus 2", description: "Explore integration techniques, applications, and series.", order: 11 },
  { id: "multivariable-calculus", name: "Multivariable Calculus", description: "Extend calculus to functions of several variables and vector fields.", order: 12 },
  { id: "differential-equations", name: "Differential Equations", description: "Model change using equations involving derivatives.", order: 13 },
  { id: "linear-algebra", name: "Linear Algebra", description: "Study linear systems, matrices, vector spaces, and transformations.", order: 14 },
] as const;

export type CourseId = (typeof courseCatalog)[number]["id"];
export type GradeCourse =
  | (typeof courseCatalog)[number]["name"]
  | ElementaryLevelLabel;

export type QuestionVisual = {
  kind: "counters" | "array" | "comparison";
  label: string;
  count: number;
  rows?: number;
  columns?: number;
  groups?: { label: string; count: number }[];
};

export type ChallengeTopic = {
  id: string;
  label: string;
  description: string;
  courseIds: CourseId[];
  levelIds?: ElementaryLevelId[];
  courseLabels?: Partial<Record<CourseId, string>>;
  order: number;
};

const arithmetic: CourseId = "arithmetic-number-sense";
const fractions: CourseId = "fractions-decimals-percentages";
const ratios: CourseId = "ratios-proportional-reasoning";
const preAlgebra: CourseId = "pre-algebra";
const algebra1: CourseId = "algebra-1";
const geometry: CourseId = "geometry";
const algebra2: CourseId = "algebra-2";
const trigonometry: CourseId = "trigonometry";
const precalculus: CourseId = "precalculus";
const calculus1: CourseId = "calculus-1";
const calculus2: CourseId = "calculus-2";
const multivariable: CourseId = "multivariable-calculus";
const differentialEquations: CourseId = "differential-equations";
const linearAlgebra: CourseId = "linear-algebra";

export const challengeTopics: ChallengeTopic[] = [
  { id: "kindergarten-counting", label: "Counting collections", description: "Count small groups of familiar objects and connect each object to one number.", courseIds: ["arithmetic-number-sense"], levelIds: ["kindergarten"], order: 1 },
  { id: "kindergarten-comparing", label: "Comparing quantities", description: "Compare groups and decide which has more, fewer, or the same number.", courseIds: ["arithmetic-number-sense"], levelIds: ["kindergarten"], order: 2 },
  { id: "kindergarten-patterns", label: "Patterns", description: "Notice and continue simple repeating and growing patterns.", courseIds: ["arithmetic-number-sense"], levelIds: ["kindergarten"], order: 3 },
  { id: "kindergarten-shapes", label: "Shapes and attributes", description: "Recognize familiar flat shapes and describe sides and corners.", courseIds: ["arithmetic-number-sense"], levelIds: ["kindergarten"], order: 4 },

  { id: "grade-1-add-subtract", label: "Addition and subtraction within 20", description: "Build and solve addition and subtraction situations with numbers to 20.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-1"], order: 1 },
  { id: "grade-1-place-value", label: "Tens and ones", description: "Read, compose, and compare two-digit numbers using tens and ones.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-1"], order: 2 },
  { id: "grade-1-time-shapes", label: "Time and shape attributes", description: "Read hour and half-hour times and describe simple shape attributes.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-1"], order: 3 },

  { id: "grade-2-place-value", label: "Place value to 1,000", description: "Use hundreds, tens, and ones to compose and compare three-digit numbers.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-2"], order: 1 },
  { id: "grade-2-equal-groups", label: "Equal groups and skip counting", description: "Represent equal groups, repeated addition, and skip-counting patterns.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-2"], order: 2 },
  { id: "grade-2-money-data", label: "Money and simple data", description: "Solve simple money totals and read small data displays.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-2"], order: 3 },

  { id: "grade-3-multiplication-division", label: "Multiplication and division", description: "Connect multiplication facts, equal groups, arrays, and fair sharing.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-3"], order: 1 },
  { id: "grade-3-fractions", label: "Fractions as equal parts", description: "Read and compare simple fractions as equal parts of a whole.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-3"], order: 2 },
  { id: "grade-3-area-perimeter", label: "Area and perimeter", description: "Measure rectangular arrays and reason about the boundary of shapes.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-3"], order: 3 },

  { id: "grade-4-multidigit-operations", label: "Multidigit arithmetic", description: "Use place-value strategies for larger whole-number operations.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-4"], order: 1 },
  { id: "grade-4-fractions", label: "Equivalent fractions and fraction operations", description: "Recognize equivalent fractions and combine fractions with like denominators.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-4"], order: 2 },
  { id: "grade-4-angles-measure", label: "Angles and measurement", description: "Measure angles and convert within a single measurement system.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-4"], order: 3 },

  { id: "grade-5-decimals-fractions", label: "Decimal and fraction operations", description: "Calculate with decimals and add or subtract fractions with unlike denominators.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-5"], order: 1 },
  { id: "grade-5-volume", label: "Volume", description: "Find the volume of rectangular prisms using unit cubes and dimensions.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-5"], order: 2 },
  { id: "grade-5-expressions-coordinates", label: "Expressions and coordinate grids", description: "Evaluate numerical expressions and read points in the first quadrant.", courseIds: ["arithmetic-number-sense"], levelIds: ["grade-5"], order: 3 },

  { id: "place-value", label: "Place value", description: "Read, compose, and compare the value of digits in whole numbers.", courseIds: [arithmetic], order: 1 },
  { id: "comparing-ordering-numbers", label: "Comparing and ordering numbers", description: "Use place value and number lines to compare and arrange whole numbers.", courseIds: [arithmetic], order: 2 },
  { id: "addition", label: "Addition", description: "Add whole numbers using place value, regrouping, and estimation.", courseIds: [arithmetic], order: 3 },
  { id: "subtraction", label: "Subtraction", description: "Subtract whole numbers, including regrouping and unknown differences.", courseIds: [arithmetic], order: 4 },
  { id: "multiplication", label: "Multiplication", description: "Use equal groups, area, and place-value strategies to multiply.", courseIds: [arithmetic], order: 5 },
  { id: "division", label: "Division", description: "Divide whole numbers and interpret quotients and remainders.", courseIds: [arithmetic], order: 6 },
  { id: "order-of-operations", label: "Order of operations", description: "Evaluate numerical expressions in the correct sequence.", courseIds: [arithmetic], order: 7 },
  { id: "rounding-estimation", label: "Rounding and estimation", description: "Round whole numbers and use estimates to reason about answers.", courseIds: [arithmetic], order: 8 },
  { id: "factors-multiples", label: "Factors and multiples", description: "Identify factor pairs, common factors, and multiples.", courseIds: [arithmetic], order: 9 },
  { id: "prime-numbers", label: "Prime numbers", description: "Classify prime and composite numbers using their factors.", courseIds: [arithmetic], order: 10 },
  { id: "whole-number-operations", label: "Whole-number operations (mixed review)", description: "Practice mixed whole-number operations in multistep and applied settings.", courseIds: [arithmetic], order: 11 },

  { id: "equivalent-fractions", label: "Equivalent fractions", description: "Generate and recognize fractions that name the same value.", courseIds: [fractions], order: 1 },
  { id: "comparing-fractions", label: "Comparing fractions", description: "Compare fractions using benchmarks, common denominators, and reasoning.", courseIds: [fractions], order: 2 },
  { id: "fraction-operations", label: "Adding and subtracting fractions", description: "Add and subtract fractions and mixed numbers with unlike denominators.", courseIds: [fractions], order: 3 },
  { id: "multiplying-dividing-fractions", label: "Multiplying and dividing fractions", description: "Multiply fractions and divide by multiplying by the reciprocal.", courseIds: [fractions], order: 4 },
  { id: "mixed-numbers", label: "Mixed numbers", description: "Convert between mixed numbers and improper fractions and use them in calculations.", courseIds: [fractions], order: 5 },
  { id: "decimal-operations", label: "Decimal operations", description: "Compute with decimals while attending to place value.", courseIds: [fractions], order: 6 },
  { id: "fraction-decimal-percent-conversions", label: "Fraction–decimal–percent conversions", description: "Convert values among fraction, decimal, and percent forms.", courseIds: [fractions], order: 7 },
  { id: "percent-applications", label: "Percent applications", description: "Solve practical problems involving a percent of a quantity.", courseIds: [fractions], order: 8 },

  { id: "ratios", label: "Ratios", description: "Represent and interpret comparisons between quantities.", courseIds: [ratios], order: 1 },
  { id: "unit-rates", label: "Unit rates", description: "Find and interpret a rate for one unit.", courseIds: [ratios], order: 2 },
  { id: "equivalent-ratios", label: "Equivalent ratios", description: "Scale ratios while preserving the relationship between quantities.", courseIds: [ratios], order: 3 },
  { id: "ratio-proportions", label: "Proportions", description: "Solve for unknown quantities in equivalent ratios.", courseIds: [ratios], order: 4 },
  { id: "proportional-relationships", label: "Proportional relationships", description: "Recognize and model relationships with a constant ratio.", courseIds: [ratios], order: 5 },
  { id: "scale-drawings", label: "Scale drawings", description: "Use scale factors to relate drawing lengths to real lengths.", courseIds: [ratios], order: 6 },
  { id: "percent-change", label: "Percent change", description: "Calculate and interpret percent increase and decrease.", courseIds: [ratios], order: 7 },
  { id: "discounts-tax-tips", label: "Discounts, tax, and tips", description: "Apply percents to prices, tax, and gratuities.", courseIds: [ratios], order: 8 },

  { id: "integer-operations", label: "Integer operations", description: "Add, subtract, multiply, and divide positive and negative integers.", courseIds: [preAlgebra], order: 1 },
  { id: "absolute-value", label: "Absolute value", description: "Interpret absolute value as distance from zero.", courseIds: [preAlgebra], order: 2 },
  { id: "numerical-expressions", label: "Numerical expressions", description: "Evaluate numerical expressions using operation properties and grouping.", courseIds: [preAlgebra], order: 3 },
  { id: "properties-of-operations", label: "Properties of operations", description: "Use operation properties to rewrite and simplify calculations.", courseIds: [preAlgebra], order: 4 },
  { id: "simplifying-expressions", label: "Simplifying expressions", description: "Combine like terms and use the distributive property.", courseIds: [preAlgebra], order: 5 },
  { id: "linear-equations", label: "One-step and two-step equations", description: "Solve equations by applying inverse operations to both sides.", courseIds: [preAlgebra, algebra1], order: 6 },
  { id: "introductory-inequalities", label: "Introductory inequalities", description: "Represent and solve simple inequalities.", courseIds: [preAlgebra], order: 7 },
  { id: "exponents", label: "Exponents", description: "Interpret powers and evaluate expressions with integer exponents.", courseIds: [preAlgebra], order: 8 },
  { id: "square-roots", label: "Square roots", description: "Relate square roots to perfect squares and estimate roots.", courseIds: [preAlgebra], order: 9 },
  { id: "coordinate-plane", label: "Coordinate plane", description: "Plot and interpret points in all four quadrants.", courseIds: [preAlgebra], order: 10 },

  { id: "multistep-equations", label: "Multistep equations", description: "Solve equations involving grouping, like terms, and variables on both sides.", courseIds: [algebra1], order: 1 },
  { id: "linear-inequalities", label: "Linear inequalities", description: "Solve and represent linear inequalities.", courseIds: [algebra1], order: 2 },
  { id: "slope", label: "Slope", description: "Find and interpret the rate of change of a line.", courseIds: [algebra1], order: 3 },
  { id: "graphing-linear-equations", label: "Graphing linear equations", description: "Graph lines from equations, tables, and intercepts.", courseIds: [algebra1], order: 4 },
  { id: "writing-linear-equations", label: "Writing linear equations", description: "Build a linear equation from points, slope, or context.", courseIds: [algebra1], order: 5 },
  { id: "systems-of-equations", label: "Systems of equations", description: "Solve and interpret pairs of linear equations.", courseIds: [algebra1], order: 6 },
  { id: "evaluating-functions", label: "Function notation", description: "Evaluate a function rule for given inputs.", courseIds: [algebra1], order: 7 },
  { id: "exponent-rules", label: "Exponent rules", description: "Simplify expressions using laws of exponents.", courseIds: [algebra1], order: 8 },
  { id: "polynomial-operations", label: "Polynomial operations", description: "Add, subtract, and multiply polynomials.", courseIds: [algebra1], order: 9 },
  { id: "factoring", label: "Factoring", description: "Factor polynomials using common factors and patterns.", courseIds: [algebra1], order: 10 },
  { id: "quadratic-equations", label: "Quadratic equations", description: "Solve quadratic equations using appropriate methods.", courseIds: [algebra1, algebra2], order: 11 },
  { id: "exponential-growth-decay", label: "Exponential growth and decay", description: "Model repeated multiplicative change with exponential expressions.", courseIds: [algebra1], order: 12 },

  { id: "angle-relationships", label: "Angle relationships", description: "Use angle sums and relationships to find unknown measures.", courseIds: [geometry], order: 1 },
  { id: "parallel-lines-transversals", label: "Parallel lines and transversals", description: "Use corresponding, alternate, and same-side angle relationships.", courseIds: [geometry], order: 2 },
  { id: "triangle-properties", label: "Triangle properties", description: "Reason with triangle angle sums and side relationships.", courseIds: [geometry], order: 3 },
  { id: "congruence", label: "Congruence", description: "Identify congruent figures and apply triangle congruence criteria.", courseIds: [geometry], order: 4 },
  { id: "similarity", label: "Similarity", description: "Use proportional sides and equal angles in similar figures.", courseIds: [geometry], order: 5 },
  { id: "right-triangles", label: "Right triangles", description: "Reason about side lengths and angles in right triangles.", courseIds: [geometry], order: 6 },
  { id: "pythagorean-theorem", label: "Pythagorean theorem", description: "Find missing side lengths in right triangles.", courseIds: [geometry], order: 7 },
  { id: "polygons", label: "Polygons", description: "Analyze angle measures and properties of polygons.", courseIds: [geometry], order: 8 },
  { id: "circles", label: "Circles", description: "Work with radius, diameter, circumference, and area.", courseIds: [geometry], order: 9 },
  { id: "perimeter-area", label: "Perimeter and area", description: "Calculate boundary lengths and areas of plane figures.", courseIds: [geometry], order: 10 },
  { id: "surface-area-volume", label: "Surface area and volume", description: "Measure three-dimensional figures and their capacity.", courseIds: [geometry], order: 11 },
  { id: "transformations", label: "Transformations", description: "Describe translations, reflections, rotations, and dilations.", courseIds: [geometry], order: 12 },
  { id: "coordinate-geometry", label: "Coordinate geometry", description: "Use coordinates and distance relationships to analyze figures.", courseIds: [geometry], order: 13 },
  { id: "proofs", label: "Proofs", description: "Build logical arguments from definitions and established facts.", courseIds: [geometry], order: 14 },

  { id: "complex-numbers", label: "Complex numbers", description: "Compute with complex numbers and use the imaginary unit.", courseIds: [algebra2], order: 1 },
  { id: "quadratic-functions", label: "Quadratic functions", description: "Analyze quadratic graphs, features, and representations.", courseIds: [algebra2], order: 2 },
  { id: "polynomial-functions", label: "Polynomial functions", description: "Analyze polynomial behavior, zeros, and end behavior.", courseIds: [algebra2], order: 3 },
  { id: "polynomial-division", label: "Polynomial division", description: "Divide polynomials and interpret quotient and remainder.", courseIds: [algebra2], order: 4 },
  { id: "rational-expressions-equations", label: "Rational expressions and equations", description: "Simplify rational expressions and solve rational equations.", courseIds: [algebra2], order: 5 },
  { id: "radical-functions-equations", label: "Radical functions and equations", description: "Evaluate radical functions and solve radical equations.", courseIds: [algebra2], order: 6 },
  { id: "exponential-functions", label: "Exponential functions", description: "Analyze exponential functions and their transformations.", courseIds: [algebra2], order: 7 },
  { id: "logarithms", label: "Logarithms", description: "Use logarithms as inverses of exponential functions.", courseIds: [algebra2], order: 8 },
  { id: "nonlinear-systems", label: "Systems of nonlinear equations", description: "Solve systems that include nonlinear relationships.", courseIds: [algebra2], order: 9 },
  { id: "sequences-series", label: "Sequences and series", description: "Represent and analyze arithmetic and geometric sequences and sums.", courseIds: [algebra2], order: 10 },
  { id: "conic-sections", label: "Conic sections", description: "Recognize and analyze circles, parabolas, ellipses, and hyperbolas.", courseIds: [algebra2], order: 11 },

  { id: "degree-radian-measure", label: "Degree and radian measure", description: "Convert angle measures and relate radians to arc length.", courseIds: [trigonometry], order: 1 },
  { id: "unit-circle", label: "Unit circle", description: "Use coordinates on the unit circle to find trigonometric values.", courseIds: [trigonometry], order: 2 },
  { id: "trigonometry-special-angles", label: "Trigonometric ratios", description: "Use special angles and the unit circle to evaluate trigonometric functions and ratios.", courseIds: [trigonometry, precalculus], courseLabels: { [precalculus]: "Trigonometric functions" }, order: 3 },
  { id: "trig-graphs", label: "Trigonometric graphs", description: "Interpret and transform graphs of trigonometric functions.", courseIds: [trigonometry], order: 4 },
  { id: "inverse-trig-functions", label: "Inverse trigonometric functions", description: "Use inverse functions to find angles from trigonometric values.", courseIds: [trigonometry], order: 5 },
  { id: "trig-identities", label: "Trigonometric identities", description: "Apply fundamental identities to rewrite expressions.", courseIds: [trigonometry], order: 6 },
  { id: "trig-equations", label: "Trigonometric equations", description: "Solve trigonometric equations over specified intervals.", courseIds: [trigonometry], order: 7 },
  { id: "laws-sines-cosines", label: "Laws of sines and cosines", description: "Solve oblique triangles using the sine and cosine laws.", courseIds: [trigonometry], order: 8 },
  { id: "trig-applications", label: "Trigonometric applications", description: "Model periodic and triangle-based real-world situations.", courseIds: [trigonometry], order: 9 },

  { id: "function-transformations", label: "Function transformations", description: "Describe shifts, reflections, and stretches of functions.", courseIds: [precalculus], order: 1 },
  { id: "domain-range", label: "Domain and range", description: "Determine allowable inputs and resulting outputs.", courseIds: [precalculus], order: 2 },
  { id: "function-composition", label: "Composition", description: "Build and evaluate composite functions.", courseIds: [precalculus], order: 3 },
  { id: "inverse-functions", label: "Inverse functions", description: "Find and verify inverse functions and their domains.", courseIds: [precalculus], order: 4 },
  { id: "polynomial-rational-functions", label: "Polynomial and rational functions", description: "Analyze zeros, asymptotes, and end behavior.", courseIds: [precalculus], order: 5 },
  { id: "exponential-logarithmic-models", label: "Exponential and logarithmic models", description: "Model and interpret exponential and logarithmic change.", courseIds: [precalculus], order: 6 },
  { id: "polar-coordinates", label: "Polar coordinates", description: "Convert coordinates and interpret polar representations.", courseIds: [precalculus], order: 7 },
  { id: "parametric-equations", label: "Parametric equations", description: "Represent curves with parameterized coordinates.", courseIds: [precalculus], order: 8 },
  { id: "vectors", label: "Vectors", description: "Represent vectors and calculate with their components.", courseIds: [precalculus], order: 9 },
  { id: "precalculus-sequences", label: "Sequences", description: "Recognize and represent patterns in sequences.", courseIds: [precalculus], order: 10 },
  { id: "introductory-limits", label: "Introductory limits", description: "Estimate limits from graphs, tables, and simple expressions.", courseIds: [precalculus], order: 11 },

  { id: "limits", label: "Limits", description: "Evaluate limits using graphs, algebra, and limit laws.", courseIds: [calculus1], order: 1 },
  { id: "continuity", label: "Continuity", description: "Determine continuity and classify discontinuities.", courseIds: [calculus1], order: 2 },
  { id: "derivative-definition", label: "Derivative definition", description: "Interpret and calculate derivatives from the difference quotient.", courseIds: [calculus1], order: 3 },
  { id: "derivatives-at-a-point", label: "Differentiation rules", description: "Differentiate functions and evaluate derivatives at a point.", courseIds: [calculus1], order: 4 },
  { id: "implicit-differentiation", label: "Implicit differentiation", description: "Differentiate relations where variables are not isolated.", courseIds: [calculus1], order: 5 },
  { id: "related-rates", label: "Related rates", description: "Connect changing quantities through differentiated relationships.", courseIds: [calculus1], order: 6 },
  { id: "linear-approximation", label: "Linear approximation", description: "Use tangent lines to approximate nearby function values.", courseIds: [calculus1], order: 7 },
  { id: "optimization", label: "Optimization", description: "Use derivatives to find and justify extrema in context.", courseIds: [calculus1], order: 8 },
  { id: "curve-analysis", label: "Curve analysis", description: "Use derivatives to describe increasing, decreasing, and concavity.", courseIds: [calculus1], order: 9 },
  { id: "antiderivatives", label: "Antiderivatives", description: "Find families of functions with a given derivative.", courseIds: [calculus1], order: 10 },
  { id: "definite-integrals", label: "Definite integrals", description: "Evaluate definite integrals and interpret accumulated change.", courseIds: [calculus1, calculus2], order: 11 },
  { id: "fundamental-theorem-calculus", label: "Fundamental theorem of calculus", description: "Connect definite integrals and antiderivatives.", courseIds: [calculus1], order: 12 },

  { id: "substitution", label: "Substitution", description: "Use a change of variable to simplify integrals.", courseIds: [calculus2], order: 1 },
  { id: "integration-by-parts", label: "Integration by parts", description: "Integrate products using the integration-by-parts rule.", courseIds: [calculus2], order: 2 },
  { id: "trigonometric-integrals", label: "Trigonometric integrals", description: "Integrate products and powers of trigonometric functions.", courseIds: [calculus2], order: 3 },
  { id: "trigonometric-substitution", label: "Trigonometric substitution", description: "Use trigonometric substitutions to evaluate radical integrals.", courseIds: [calculus2], order: 4 },
  { id: "partial-fractions", label: "Partial fractions", description: "Decompose rational functions before integrating.", courseIds: [calculus2], order: 5 },
  { id: "improper-integrals", label: "Improper integrals", description: "Evaluate integrals with infinite limits or unbounded integrands.", courseIds: [calculus2], order: 6 },
  { id: "area-volume-applications", label: "Area and volume applications", description: "Use integrals to calculate areas and volumes.", courseIds: [calculus2], order: 7 },
  { id: "arc-length", label: "Arc length", description: "Calculate the length of a curve using integration.", courseIds: [calculus2], order: 8 },
  { id: "calculus-sequences", label: "Sequences", description: "Analyze sequence limits and behavior.", courseIds: [calculus2], order: 9 },
  { id: "convergence-tests", label: "Convergence tests", description: "Determine whether infinite series converge.", courseIds: [calculus2], order: 10 },
  { id: "power-series", label: "Power series", description: "Represent functions and determine intervals of convergence.", courseIds: [calculus2], order: 11 },
  { id: "taylor-series", label: "Taylor series", description: "Construct and use polynomial approximations from derivatives.", courseIds: [calculus2], order: 12 },
  { id: "polar-parametric-calculus", label: "Polar and parametric calculus", description: "Differentiate and integrate polar or parameterized curves.", courseIds: [calculus2], order: 13 },

  { id: "vectors-3d-geometry", label: "Vectors and 3D geometry", description: "Compute with vectors and describe points and lines in space.", courseIds: [multivariable], order: 1 },
  { id: "vector-valued-functions", label: "Vector-valued functions", description: "Analyze position, velocity, and acceleration functions.", courseIds: [multivariable], order: 2 },
  { id: "partial-derivatives", label: "Partial derivatives", description: "Differentiate multivariable functions with respect to one variable.", courseIds: [multivariable], order: 3 },
  { id: "gradients", label: "Gradients", description: "Calculate gradient vectors and interpret their direction.", courseIds: [multivariable], order: 4 },
  { id: "directional-derivatives", label: "Directional derivatives", description: "Find rates of change in specified directions.", courseIds: [multivariable], order: 5 },
  { id: "tangent-planes", label: "Tangent planes", description: "Approximate surfaces near a point with tangent planes.", courseIds: [multivariable], order: 6 },
  { id: "multivariable-optimization", label: "Multivariable optimization", description: "Find and classify extrema of functions of several variables.", courseIds: [multivariable], order: 7 },
  { id: "lagrange-multipliers", label: "Lagrange multipliers", description: "Optimize functions subject to constraints.", courseIds: [multivariable], order: 8 },
  { id: "multiple-integrals", label: "Double and triple integrals", description: "Integrate over planar and three-dimensional regions.", courseIds: [multivariable], order: 9 },
  { id: "vector-fields", label: "Vector fields", description: "Represent and analyze vector-valued fields.", courseIds: [multivariable], order: 10 },
  { id: "line-integrals", label: "Line integrals", description: "Integrate scalar or vector fields along curves.", courseIds: [multivariable], order: 11 },
  { id: "surface-integrals", label: "Surface integrals", description: "Integrate scalar or vector fields over surfaces.", courseIds: [multivariable], order: 12 },
  { id: "vector-calculus-theorems", label: "Green’s, Stokes’, and divergence theorems", description: "Relate integrals over regions, boundaries, and surfaces.", courseIds: [multivariable], order: 13 },

  { id: "slope-fields", label: "Slope fields", description: "Interpret direction fields and approximate solution curves.", courseIds: [differentialEquations], order: 1 },
  { id: "differential-equations", label: "Separable equations", description: "Solve first-order differential equations by separating variables.", courseIds: [differentialEquations], order: 2 },
  { id: "first-order-linear-equations", label: "First-order linear equations", description: "Solve first-order linear equations with integrating factors.", courseIds: [differentialEquations], order: 3 },
  { id: "exponential-logistic-models", label: "Exponential and logistic models", description: "Model growth and limited-population behavior with differential equations.", courseIds: [differentialEquations], order: 4 },
  { id: "second-order-equations", label: "Second-order equations", description: "Solve and interpret second-order differential equations.", courseIds: [differentialEquations], order: 5 },
  { id: "initial-value-problems", label: "Initial-value problems", description: "Apply initial conditions to select a particular solution.", courseIds: [differentialEquations], order: 6 },
  { id: "systems-differential-equations", label: "Systems of differential equations", description: "Analyze coupled differential equation systems.", courseIds: [differentialEquations], order: 7 },
  { id: "laplace-transforms", label: "Laplace transforms", description: "Use transforms to solve differential equations.", courseIds: [differentialEquations], order: 8 },
  { id: "numerical-methods", label: "Numerical methods", description: "Approximate differential equation solutions numerically.", courseIds: [differentialEquations], order: 9 },

  { id: "linear-systems", label: "Linear systems", description: "Represent and solve systems using matrix notation.", courseIds: [linearAlgebra], order: 1 },
  { id: "row-reduction", label: "Row reduction", description: "Use elementary row operations to solve and analyze systems.", courseIds: [linearAlgebra], order: 2 },
  { id: "matrix-operations", label: "Matrix operations", description: "Add, multiply, and scale matrices.", courseIds: [linearAlgebra], order: 3 },
  { id: "inverse-matrices", label: "Inverse matrices", description: "Find and use inverse matrices when they exist.", courseIds: [linearAlgebra], order: 4 },
  { id: "matrix-determinants", label: "Determinants", description: "Calculate determinants and interpret their properties.", courseIds: [linearAlgebra], order: 5 },
  { id: "vector-spaces", label: "Vector spaces", description: "Reason about sets with vector space operations.", courseIds: [linearAlgebra], order: 6 },
  { id: "subspaces", label: "Subspaces", description: "Determine whether a subset satisfies the subspace conditions.", courseIds: [linearAlgebra], order: 7 },
  { id: "linear-independence", label: "Linear independence", description: "Determine whether vectors have nontrivial linear relations.", courseIds: [linearAlgebra], order: 8 },
  { id: "basis-dimension", label: "Basis and dimension", description: "Find bases and determine the dimension of a vector space.", courseIds: [linearAlgebra], order: 9 },
  { id: "linear-transformations", label: "Linear transformations", description: "Represent and analyze linear maps between vector spaces.", courseIds: [linearAlgebra], order: 10 },
  { id: "eigenvalues-eigenvectors", label: "Eigenvalues and eigenvectors", description: "Find eigenvalues and corresponding eigenvectors.", courseIds: [linearAlgebra], order: 11 },
  { id: "orthogonality", label: "Orthogonality", description: "Use inner products, orthogonal vectors, and projections.", courseIds: [linearAlgebra], order: 12 },
  { id: "least-squares", label: "Least squares", description: "Find approximate solutions by minimizing squared error.", courseIds: [linearAlgebra], order: 13 },
];

export const gradeCourses: GradeCourse[] = [
  ...elementaryChallengeLevels
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((level) => level.label),
  ...courseCatalog
  .slice()
  .sort((left, right) => left.order - right.order)
  .map((course) => course.name),
];

export function getCourseByName(gradeCourse: GradeCourse) {
  const selectedCourse = courseCatalog.find((course) => course.name === gradeCourse);
  if (selectedCourse) return selectedCourse;
  const level = elementaryChallengeLevels.find((item) => item.label === gradeCourse);
  return courseCatalog.find((course) => course.id === level?.courseId);
}

export function getTopicsForGrade(gradeCourse: GradeCourse): ChallengeTopic[] {
  const course = getCourseByName(gradeCourse);
  if (!course) return [];
  const elementaryLevel = elementaryChallengeLevels.find(
    (item) => item.label === gradeCourse,
  );
  return challengeTopics
    .filter(
      (topic) =>
        topic.courseIds.includes(course.id) &&
        (elementaryLevel
          ? topic.levelIds?.includes(elementaryLevel.id)
          : !topic.levelIds),
    )
    .sort((left, right) => left.order - right.order);
}

export function getTopicDisplayName(
  topic: ChallengeTopic,
  gradeCourse: GradeCourse,
): string {
  const course = getCourseByName(gradeCourse);
  return (course && topic.courseLabels?.[course.id]) || topic.label;
}
