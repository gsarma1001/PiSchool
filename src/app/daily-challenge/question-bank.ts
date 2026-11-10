import "server-only";
import { createExtendedQuestionBank } from "./extended-question-bank";
import type { AnswerRule } from "./domain";
import {
  getCourseByName,
  type CourseId,
  type GradeCourse,
  type QuestionVisual,
} from "./catalog";

export type BankQuestion = {
  id: string;
  version: number;
  courseIds: CourseId[];
  publicationStatus: "draft" | "published";
  reviewStatus: "unreviewed" | "mathematically-reviewed";
  gradeCourses: GradeCourse[];
  topicId: string;
  topic: string;
  subtopic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  answer: AnswerRule;
  hint: string;
  solutionSteps: string[];
  instructions?: string;
  visual?: QuestionVisual;
};

export function question(
  id: string,
  topicId: string,
  topic: string,
  gradeCourses: GradeCourse[],
  difficulty: BankQuestion["difficulty"],
  subtopic: string,
  prompt: string,
  answer: AnswerRule,
  hint: string,
  solutionSteps: string[],
  instructions?: string,
  version = 1,
  visual?: QuestionVisual,
): BankQuestion {
  const courseIds = gradeCourses.map((gradeCourse) => {
    const course = getCourseByName(gradeCourse);
    if (!course) throw new Error(`Unknown course for question ${id}.`);
    return course.id;
  });
  return {
    id,
    version,
    courseIds,
    publicationStatus: "draft",
    reviewStatus: "unreviewed",
    topicId,
    topic,
    gradeCourses,
    difficulty,
    subtopic,
    prompt,
    answer,
    hint,
    solutionSteps,
    instructions,
    visual,
  };
}

export type QuestionFactory = typeof question;

const fractionGrades: GradeCourse[] = ["Fractions, Decimals, and Percentages"];
const equationGrades: GradeCourse[] = ["Pre-Algebra", "Algebra 1"];
const functionGrades: GradeCourse[] = ["Algebra 1"];

const initialQuestionBank: BankQuestion[] = [
  question(
    "frac-d1-a", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 1, "Like denominators", "Find 1/4 + 2/4.",
    { type: "fraction", canonical: "3/4" },
    "The denominators already match, so add the numerators.",
    ["Keep the denominator 4.", "Add the numerators: 1 + 2 = 3.", "The answer is 3/4."],
    "Enter a fraction such as 3/4, or an equivalent fraction.",
  ),
  question(
    "frac-d1-b", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 1, "Common denominators", "Find 1/3 + 1/6.",
    { type: "fraction", canonical: "1/2" },
    "Rewrite 1/3 using denominator 6 before adding.",
    ["Rewrite 1/3 as 2/6.", "Add: 2/6 + 1/6 = 3/6.", "Reduce 3/6 to 1/2."],
    "Enter a fraction such as 1/2, or an equivalent fraction.",
  ),
  question(
    "frac-d2-a", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 2, "Unlike denominators", "Find 3/8 + 1/4.",
    { type: "fraction", canonical: "5/8" },
    "Write both fractions with denominator 8.",
    ["Rewrite 1/4 as 2/8.", "Add 3/8 + 2/8.", "The result is 5/8."],
    "Enter a fraction such as 5/8, or an equivalent fraction.",
  ),
  question(
    "frac-d2-b", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 2, "Unlike denominators", "Find 5/6 − 1/3.",
    { type: "fraction", canonical: "1/2" },
    "Rewrite 1/3 in sixths, then subtract the numerators.",
    ["Rewrite 1/3 as 2/6.", "Subtract: 5/6 − 2/6 = 3/6.", "Reduce 3/6 to 1/2."],
    "Enter a fraction such as 1/2, or an equivalent fraction.",
  ),
  question(
    "frac-d3-a", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 3, "Mixed numbers", "Find 2 1/4 + 1 2/3. Give your answer as a fraction.",
    { type: "fraction", canonical: "47/12" },
    "Convert both mixed numbers to improper fractions, then use a common denominator.",
    ["Convert: 2 1/4 = 9/4 and 1 2/3 = 5/3.", "Use denominator 12: 9/4 = 27/12 and 5/3 = 20/12.", "Add to get 47/12."],
    "Give the answer as a fraction. Equivalent fractions are accepted.",
  ),
  question(
    "frac-d3-b", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 3, "Mixed numbers", "Find 4 1/2 − 2 3/4. Give your answer as a fraction.",
    { type: "fraction", canonical: "7/4" },
    "Convert each mixed number to fourths before subtracting.",
    ["Convert: 4 1/2 = 18/4 and 2 3/4 = 11/4.", "Subtract: 18/4 − 11/4 = 7/4.", "The result is 7/4."],
    "Give the answer as a fraction. Equivalent fractions are accepted.",
  ),
  question(
    "frac-d4-a", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 4, "Word problems", "A hiker walks 2/3 mile in the morning and 3/4 mile in the afternoon. How many miles does the hiker walk in all? Give a fraction.",
    { type: "fraction", canonical: "17/12" },
    "Add the two distances using a common denominator.",
    ["The least common denominator of 3 and 4 is 12.", "Rewrite and add: 2/3 + 3/4 = 8/12 + 9/12.", "The total is 17/12 miles."],
    "Give the total as a fraction. Equivalent fractions are accepted.",
  ),
  question(
    "frac-d4-b", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 4, "Word problems", "A bottle has 7/8 liter of water. After 1/3 liter is poured out, how much remains? Give a fraction.",
    { type: "fraction", canonical: "13/24" },
    "Subtract 1/3 from 7/8 after rewriting both with denominator 24.",
    ["Rewrite: 7/8 = 21/24 and 1/3 = 8/24.", "Subtract: 21/24 − 8/24 = 13/24.", "There are 13/24 liter left."],
    "Give the amount as a fraction. Equivalent fractions are accepted.",
  ),
  question(
    "frac-d5-a", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 5, "Multi-step fraction reasoning", "Find 1 1/2 − (2/3 + 1/4). Give your answer as a fraction.",
    { type: "fraction", canonical: "7/12" },
    "Evaluate the parentheses first, then subtract from 1 1/2.",
    ["Inside the parentheses: 2/3 + 1/4 = 8/12 + 3/12 = 11/12.", "Convert 1 1/2 to 18/12.", "Subtract: 18/12 − 11/12 = 7/12."],
    "Give the answer as a fraction. Equivalent fractions are accepted.",
  ),
  question(
    "frac-d5-b", "fraction-operations", "Adding and subtracting fractions",
    fractionGrades, 5, "Multi-step fraction reasoning", "Find 2/5 + 3/4 − 1/10. Give your answer as a fraction.",
    { type: "fraction", canonical: "21/20" },
    "Use a common denominator of 20 for all three fractions.",
    ["Rewrite as twentieths: 2/5 = 8/20, 3/4 = 15/20, and 1/10 = 2/20.", "Combine: 8/20 + 15/20 − 2/20.", "The result is 21/20."],
    "Give the answer as a fraction. Equivalent fractions are accepted.",
  ),

  question(
    "lin-d1-a", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 1, "Inverse operations", "Solve: x + 4 = 9.",
    { type: "integer", canonical: "5" },
    "Undo adding 4 by subtracting 4 from both sides.",
    ["Subtract 4 from both sides: x = 9 − 4.", "So x = 5.", "Check: 5 + 4 = 9."],
  ),
  question(
    "lin-d1-b", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 1, "Inverse operations", "Solve: x − 7 = −2.",
    { type: "integer", canonical: "5" },
    "Undo subtracting 7 by adding 7 to both sides.",
    ["Add 7 to both sides: x = −2 + 7.", "So x = 5.", "Check: 5 − 7 = −2."],
  ),
  question(
    "lin-d2-a", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 2, "Two-step equations", "Solve: 3x + 5 = 20.",
    { type: "integer", canonical: "5" },
    "Undo the addition first, then undo multiplication by 3.",
    ["Subtract 5: 3x = 15.", "Divide by 3: x = 5.", "Check: 3(5) + 5 = 20."],
  ),
  question(
    "lin-d2-b", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 2, "Equations with division", "Solve: x/4 − 2 = 3.",
    { type: "integer", canonical: "20" },
    "Add 2 to both sides, then multiply both sides by 4.",
    ["Add 2: x/4 = 5.", "Multiply by 4: x = 20.", "Check: 20/4 − 2 = 3."],
  ),
  question(
    "lin-d3-a", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 3, "Distributive property", "Solve: 2(x + 3) = 18.",
    { type: "integer", canonical: "6" },
    "Divide both sides by 2, then undo adding 3.",
    ["Divide by 2: x + 3 = 9.", "Subtract 3: x = 6.", "Check: 2(6 + 3) = 18."],
  ),
  question(
    "lin-d3-b", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 3, "Variables on both sides", "Solve: 5x − 2 = 3x + 10.",
    { type: "integer", canonical: "6" },
    "Subtract 3x from both sides, then isolate x.",
    ["Subtract 3x: 2x − 2 = 10.", "Add 2 and divide by 2: x = 6.", "Check: both sides equal 28."],
  ),
  question(
    "lin-d4-a", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 4, "Modeling a situation", "Four identical notebooks and a $3 delivery fee cost $31 total. If each notebook costs x dollars, solve 4x + 3 = 31. What is x?",
    { type: "integer", canonical: "7" },
    "First remove the fixed delivery fee, then divide the remaining cost equally among four notebooks.",
    ["Subtract 3: 4x = 28.", "Divide by 4: x = 7.", "Each notebook costs $7."],
  ),
  question(
    "lin-d4-b", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 4, "Modeling a situation", "A number is increased by 8, and then the result is doubled to get 34. Solve 2(x + 8) = 34. What is the number?",
    { type: "integer", canonical: "9" },
    "Undo the doubling first. Then undo adding 8.",
    ["Divide by 2: x + 8 = 17.", "Subtract 8: x = 9.", "Check: 2(9 + 8) = 34."],
  ),
  question(
    "lin-d5-a", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 5, "Nested operations", "Solve: 3(2x − 1) + 4 = 25.",
    { type: "integer", canonical: "4" },
    "Distribute 3, combine constants, then isolate x.",
    ["Distribute: 6x − 3 + 4 = 25, so 6x + 1 = 25.", "Subtract 1 and divide by 6: x = 4.", "Check: 3(8 − 1) + 4 = 25."],
  ),
  question(
    "lin-d5-b", "linear-equations", "Solving linear equations in one variable",
    equationGrades, 5, "Variables on both sides with grouping", "Solve: 4(x + 2) − 3 = 2x + 17.",
    { type: "integer", canonical: "6" },
    "Distribute before collecting the x terms on one side.",
    ["Distribute and combine: 4x + 5 = 2x + 17.", "Subtract 2x and 5: 2x = 12.", "Divide by 2: x = 6."],
  ),

  question(
    "fun-d1-a", "evaluating-functions", "Evaluating functions",
    functionGrades, 1, "Substitution", "If f(x) = x + 4, find f(3).",
    { type: "integer", canonical: "7" },
    "Replace every x with 3.",
    ["Substitute: f(3) = 3 + 4.", "Add to get 7.", "Therefore f(3) = 7."],
  ),
  question(
    "fun-d1-b", "evaluating-functions", "Evaluating functions",
    functionGrades, 1, "Negative inputs", "If g(x) = 2x − 1, find g(−2).",
    { type: "integer", canonical: "-5" },
    "Substitute −2 for x and keep the negative sign inside the multiplication.",
    ["g(−2) = 2(−2) − 1.", "Calculate −4 − 1.", "Therefore g(−2) = −5."],
  ),
  question(
    "fun-d2-a", "evaluating-functions", "Evaluating functions",
    functionGrades, 2, "Powers", "If f(x) = x² + 2, find f(3).",
    { type: "integer", canonical: "11" },
    "Substitute 3 for x, square first, then add 2.",
    ["f(3) = 3² + 2.", "3² = 9, so 9 + 2 = 11.", "Therefore f(3) = 11."],
  ),
  question(
    "fun-d2-b", "evaluating-functions", "Evaluating functions",
    functionGrades, 2, "Decimal inputs", "If h(x) = 0.4x + 1.2, find h(2.5). Enter your answer rounded to exactly two decimal places.",
    { type: "rounded-decimal", canonical: "2.20", decimalPlaces: 2, tolerance: 0.005 },
    "Substitute 2.5 for x, multiply, and then add 1.2.",
    ["h(2.5) = 0.4(2.5) + 1.2.", "0.4 × 2.5 = 1.0; then 1.0 + 1.2 = 2.2.", "To two decimal places, enter 2.20."],
    "Enter a decimal with exactly two digits after the decimal point.",
  ),
  question(
    "fun-d3-a", "evaluating-functions", "Evaluating functions",
    functionGrades, 3, "Substitution with powers and negatives", "If f(x) = 2x² − 3x, find f(−2).",
    { type: "integer", canonical: "14" },
    "Use parentheses around −2 when squaring and multiplying.",
    ["f(−2) = 2(−2)² − 3(−2).", "(−2)² = 4, so 2(4) + 6.", "The value is 8 + 6 = 14."],
  ),
  question(
    "fun-d3-b", "evaluating-functions", "Evaluating functions",
    functionGrades, 3, "Function rules with grouping", "If g(x) = (x + 1)² − 4, find g(3).",
    { type: "integer", canonical: "12" },
    "Evaluate inside the parentheses before squaring.",
    ["g(3) = (3 + 1)² − 4.", "Square 4 to get 16.", "16 − 4 = 12."],
  ),
  question(
    "fun-d4-a", "evaluating-functions", "Evaluating functions",
    functionGrades, 4, "Interpreting a function in context", "A tank’s water amount after t hours is P(t) = 12 − 2t liters. How many liters remain after 4 hours? Find P(4).",
    { type: "integer", canonical: "4" },
    "Substitute 4 for t in the rule.",
    ["P(4) = 12 − 2(4).", "Multiply: 2(4) = 8.", "12 − 8 = 4 liters."],
  ),
  question(
    "fun-d4-b", "evaluating-functions", "Evaluating functions",
    functionGrades, 4, "Interpreting a function in context", "A moving object’s distance after s seconds is d(s) = 3s + 1 meters. How far has it traveled after 5 seconds? Find d(5).",
    { type: "integer", canonical: "16" },
    "Replace s with 5, then follow the multiplication before addition.",
    ["d(5) = 3(5) + 1.", "Multiply: 3(5) = 15.", "15 + 1 = 16 meters."],
  ),
  question(
    "fun-d5-a", "evaluating-functions", "Evaluating functions",
    functionGrades, 5, "Combining function values", "If f(x) = 2x + 1, find f(3) + f(6).",
    { type: "integer", canonical: "20" },
    "Evaluate the function separately at 3 and 6, then add the results.",
    ["f(3) = 2(3) + 1 = 7.", "f(6) = 2(6) + 1 = 13.", "Add: 7 + 13 = 20."],
  ),
  question(
    "fun-d5-b", "evaluating-functions", "Evaluating functions",
    functionGrades, 5, "Difference of function values", "If g(x) = x² − x, find g(−2) − g(3).",
    { type: "integer", canonical: "0" },
    "Evaluate each value carefully, paying attention to the negative input.",
    ["g(−2) = (−2)² − (−2) = 4 + 2 = 6.", "g(3) = 3² − 3 = 9 − 3 = 6.", "Subtract: 6 − 6 = 0."],
  ),
];

const reviewedQuestionBank: BankQuestion[] = [
  ...initialQuestionBank,
  ...createExtendedQuestionBank(question),
].map((item) => ({
  ...item,
  publicationStatus: "published",
  reviewStatus: "mathematically-reviewed",
}));

export const questionBank: BankQuestion[] = reviewedQuestionBank;
