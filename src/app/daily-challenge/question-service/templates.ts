import "server-only";
import { createHash } from "node:crypto";
import {
  challengeTopics,
  type CourseId,
  type GradeCourse,
  type QuestionVisual,
} from "../catalog";
import { checkAnswer, type AnswerRule } from "../domain";
import { question, type BankQuestion, type QuestionFactory } from "../question-bank";
import type { ChallengeDifficulty } from "./types";
import type { QuestionRecord } from "./repository";

export type TemplateParameters = Record<string, number | string>;

export type GeneratedQuestion = QuestionRecord & {
  source: "template";
  templateId: string;
  templateVersion: number;
  parameters: TemplateParameters;
};

type GenerationContext = {
  date: string;
  timeZone: string;
  courseId: CourseId;
  gradeCourse: GradeCourse;
  topicId: string;
};

const generationVersion = 1;
const templates = [
  {
    id: "integer-arithmetic",
    version: 1,
    publicationStatus: "published",
    reviewStatus: "mathematically-reviewed",
    topicIds: [
      "whole-number-operations",
      "addition",
      "subtraction",
      "multiplication",
      "division",
      "order-of-operations",
    ],
    generators: [{ version: 1, generate: integerQuestion }],
  },
  {
    id: "fraction-add-subtract",
    version: 1,
    publicationStatus: "published",
    reviewStatus: "mathematically-reviewed",
    topicIds: ["fraction-operations"],
    generators: [{ version: 1, generate: fractionQuestion }],
  },
  {
    id: "linear-equation-one-variable",
    version: 1,
    publicationStatus: "published",
    reviewStatus: "mathematically-reviewed",
    topicIds: ["linear-equations"],
    generators: [{ version: 1, generate: linearEquationQuestion }],
  },
  {
    id: "elementary-math-foundations",
    version: 1,
    publicationStatus: "published",
    reviewStatus: "mathematically-reviewed",
    topicIds: [
      "kindergarten-counting",
      "kindergarten-comparing",
      "kindergarten-patterns",
      "kindergarten-shapes",
      "grade-1-add-subtract",
      "grade-1-place-value",
      "grade-1-time-shapes",
      "grade-2-place-value",
      "grade-2-equal-groups",
      "grade-2-money-data",
      "grade-3-multiplication-division",
      "grade-3-fractions",
      "grade-3-area-perimeter",
      "grade-4-multidigit-operations",
      "grade-4-fractions",
      "grade-4-angles-measure",
      "grade-5-decimals-fractions",
      "grade-5-volume",
      "grade-5-expressions-coordinates",
    ],
    generators: [{ version: 1, generate: elementaryQuestion }],
  },
] as const;

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextRandom(seed: number): number {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return (value ^ (value >>> 14)) >>> 0;
}

function randomInt(seed: number, min: number, max: number): number {
  return min + (nextRandom(seed) % (max - min + 1));
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function signedTerm(value: number): string {
  return value < 0 ? `− ${Math.abs(value)}` : `+ ${value}`;
}

function fraction(numerator: number, denominator: number): string {
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  const top = (numerator / divisor) * sign;
  const bottom = Math.abs(denominator / divisor);
  return bottom === 1 ? String(top) : `${top}/${bottom}`;
}

function makeGenerated(
  makeQuestion: QuestionFactory,
  context: GenerationContext,
  difficulty: ChallengeDifficulty,
  templateId: string,
  parameters: TemplateParameters,
  subtopic: string,
  prompt: string,
  answer: string | AnswerRule,
  hint: string,
  solutionSteps: string[],
  answerType: "integer" | "fraction" = "integer",
  instructions?: string,
  templateVersion: number = templates.find((item) => item.id === templateId)?.version ?? 1,
  visual?: QuestionVisual,
): GeneratedQuestion {
  const template = templates.find((item) => item.id === templateId);
  if (
    !template ||
    templateVersion === undefined ||
    !template.generators.some((item) => item.version === templateVersion) ||
    !template.topicIds.includes(context.topicId as never)
  ) {
    throw new Error(`Template ${templateId} does not support ${context.topicId}.`);
  }
  const parameterKey = Object.entries(parameters)
    .map(([key, value]) => `${key}-${String(value).replace(/[^a-zA-Z0-9-]/g, "")}`)
    .join("-");
  const parameterDigest = createHash("sha256")
    .update(parameterKey)
    .digest("hex")
    .slice(0, 16);
  const id = `tpl-${templateId}-v${templateVersion}-${context.courseId}-${context.topicId}-d${difficulty}-${parameterDigest}`;
  const topic = context.topicId;
  const label = topicLabel(topic);
  const item: BankQuestion = question(
    id,
    topic,
    label,
    [context.gradeCourse],
    difficulty,
    subtopic,
    prompt,
    typeof answer === "string"
      ? answerType === "fraction"
        ? { type: "fraction", canonical: answer }
        : { type: "integer", canonical: answer }
      : answer,
    hint,
    solutionSteps,
    instructions,
    templateVersion,
    visual,
  );
  return {
    ...item,
    source: "template",
    templateId,
    templateVersion,
    parameters,
    publicationStatus: template.publicationStatus,
    reviewStatus: template.reviewStatus,
  };
}

function topicLabel(topicId: string): string {
  const labels: Record<string, string> = {
    "whole-number-operations": "Whole-number operations",
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",
    division: "Division",
    "order-of-operations": "Order of operations",
    "fraction-operations": "Adding and subtracting fractions",
    "linear-equations": "Solving linear equations in one variable",
  };
  return labels[topicId] ??
    challengeTopics.find((topic) => topic.id === topicId)?.label ??
    topicId;
}

function integerQuestion(
  makeQuestion: QuestionFactory,
  context: GenerationContext,
  difficulty: ChallengeDifficulty,
  seed: number,
  templateVersion: number = 1,
): GeneratedQuestion {
  const topicId = context.topicId;
  let a = randomInt(seed, 12, 45);
  let b = randomInt(nextRandom(seed), 5, 28);
  let c = randomInt(nextRandom(nextRandom(seed)), 3, 18);
  let prompt: string;
  let answer: number;
  let subtopic: string;
  let steps: string[];
  let parameters: TemplateParameters;

  if (topicId === "subtraction") {
    a += 50;
    if (b > a) [a, b] = [b, a];
    if (difficulty === 1) {
      prompt = `Find ${a} − ${b}.`;
      answer = a - b;
      subtopic = "Subtract whole numbers";
      steps = [`Subtract ${b} from ${a}.`, `The difference is ${answer}.`];
    } else if (difficulty === 2) {
      const start = a * 100 + b * 10 + c;
      const take = b * 10 + c;
      prompt = `Find ${start} − ${take}.`;
      answer = start - take;
      subtopic = "Regroup across place values";
      steps = [`Subtract the hundreds, tens, and ones: ${start} − ${take}.`, `The difference is ${answer}.`];
      a = start;
      b = take;
    } else if (difficulty === 3) {
      const start = a * 100 + c;
      const first = b * 10;
      const second = c;
      prompt = `Find ${start} − ${first} − ${second}.`;
      answer = start - first - second;
      subtopic = "Combine successive differences";
      steps = [`Subtract ${first}: ${start} − ${first} = ${start - first}.`, `Subtract ${second}: ${start - first} − ${second} = ${answer}.`];
      a = start;
      b = first;
      c = second;
    } else if (difficulty === 4) {
      const original = a * 10 + b;
      const sold = c * 10 + b;
      prompt = `A library has ${original} books and lends out ${sold}. How many books remain?`;
      answer = original - sold;
      subtopic = "Subtraction in context";
      steps = [`Start with ${original} books.`, `Subtract the ${sold} books lent out: ${original} − ${sold} = ${answer}.`];
      a = original;
      b = sold;
    } else {
      const difference = a * 10 + c;
      const subtrahend = b * 10;
      prompt = `A number minus ${subtrahend} equals ${difference}. What is the number?`;
      answer = difference + subtrahend;
      subtopic = "Reason backward";
      steps = [`Undo subtracting ${subtrahend} by adding it to ${difference}.`, `The number is ${difference} + ${subtrahend} = ${answer}.`];
      a = difference;
      b = subtrahend;
    }
    parameters = { minuend: a, subtrahend: b, extra: c };
  } else if (topicId === "multiplication") {
    if (difficulty === 1) {
      a = randomInt(seed, 3, 9);
      b = randomInt(nextRandom(seed), 4, 9);
      prompt = `Find ${a} × ${b}.`;
      answer = a * b;
      subtopic = "Multiplication fact";
      steps = [`Think of ${a} groups of ${b}.`, `${a} × ${b} = ${answer}.`];
    } else if (difficulty === 2) {
      a = randomInt(seed, 12, 34);
      b = randomInt(nextRandom(seed), 11, 19);
      prompt = `Find ${a} × ${b} by splitting ${b} into tens and ones.`;
      answer = a * b;
      subtopic = "Partial products";
      steps = [`Split ${b} into ${Math.floor(b / 10) * 10} + ${b % 10}.`, `${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10} and ${a} × ${b % 10} = ${a * (b % 10)}.`, `Add the partial products to get ${answer}.`];
    } else if (difficulty === 3) {
      a = randomInt(seed, 101, 240);
      b = randomInt(nextRandom(seed), 21, 39);
      prompt = `Find ${a} × ${b}.`;
      answer = a * b;
      subtopic = "Multiply with place-value decomposition";
      steps = [`Split ${b} into ${Math.floor(b / 10) * 10} + ${b % 10}.`, `Calculate ${a} × ${Math.floor(b / 10) * 10} and ${a} × ${b % 10}.`, `Combine the partial products: ${answer}.`];
    } else if (difficulty === 4) {
      a = randomInt(seed, 18, 35);
      b = randomInt(nextRandom(seed), 24, 48);
      prompt = `A school orders ${a} boxes with ${b} markers in each. How many markers are there?`;
      answer = a * b;
      subtopic = "Multiplication in context";
      steps = [`There are ${a} equal groups of ${b}.`, `Multiply: ${a} × ${b} = ${answer} markers.`];
    } else {
      a = randomInt(seed, 18, 45);
      b = randomInt(nextRandom(seed), 15, 39);
      const near = Math.ceil(b / 10) * 10;
      prompt = `Find ${a} × ${b} by rewriting ${b} as ${near} − ${near - b}.`;
      answer = a * b;
      subtopic = "Choose an efficient strategy";
      steps = [`Rewrite: ${a} × ${b} = ${a} × (${near} − ${near - b}).`, `Calculate ${a} × ${near} = ${a * near} and ${a} × ${near - b} = ${a * (near - b)}.`, `Subtract: ${a * near} − ${a * (near - b)} = ${answer}.`];
    }
    parameters = { factorA: a, factorB: b };
  } else if (topicId === "division") {
    const divisor = randomInt(seed, 3, 12);
    const quotient = randomInt(nextRandom(seed), 4, 18);
    a = divisor * quotient;
    b = divisor;
    if (difficulty <= 2) {
      prompt = `Find ${a} ÷ ${b}.`;
      answer = quotient;
      subtopic = difficulty === 1 ? "Division fact" : "Use multiplication to divide";
      steps = [`Ask how many groups of ${b} make ${a}.`, `Since ${b} × ${quotient} = ${a}, the quotient is ${quotient}.`];
    } else if (difficulty === 3) {
      const secondDivisor = randomInt(nextRandom(nextRandom(seed)), 3, 9);
      const secondQuotient = randomInt(nextRandom(seed + 19), 3, 11);
      a = secondDivisor * secondQuotient;
      b = secondDivisor;
      prompt = `Find ${a} ÷ ${b} + ${quotient}.`;
      answer = secondQuotient + quotient;
      subtopic = "Division before addition";
      steps = [`Divide first: ${a} ÷ ${b} = ${secondQuotient}.`, `Add ${quotient}: ${secondQuotient} + ${quotient} = ${answer}.`];
    } else if (difficulty === 4) {
      const boxes = randomInt(seed, 25, 80);
      const each = randomInt(nextRandom(seed), 12, 35);
      a = boxes * each;
      b = each;
      prompt = `${a} markers are packed equally into boxes of ${b}. How many full boxes are packed?`;
      answer = boxes;
      subtopic = "Division in context";
      steps = [`Divide the total markers by markers per box: ${a} ÷ ${b}.`, `${b} × ${boxes} = ${a}, so ${boxes} full boxes are packed.`];
    } else {
      const divisor5 = randomInt(seed, 12, 24);
      const quotient5 = randomInt(nextRandom(seed), 35, 90);
      const remainder = randomInt(nextRandom(seed + 29), 1, divisor5 - 1);
      a = divisor5 * quotient5 + remainder;
      b = divisor5;
      prompt = `Find the quotient of ${a} ÷ ${b}, not including any remainder.`;
      answer = quotient5;
      subtopic = "Quotient and remainder";
      steps = [`${b} × ${quotient5} = ${b * quotient5}, leaving remainder ${remainder}.`, `Because ${remainder} is less than ${b}, the quotient is ${quotient5}.`];
    }
    parameters = { dividend: a, divisor: b, quotient: answer };
  } else if (topicId === "order-of-operations") {
    const x = randomInt(seed, 2, 9);
    const y = randomInt(nextRandom(seed), 2, 8);
    const z = randomInt(nextRandom(nextRandom(seed)), 3, 12);
    if (difficulty === 1) {
      prompt = `Find ${x} + ${y} × ${z}.`;
      answer = x + y * z;
      subtopic = "Multiplication before addition";
      steps = [`Multiply first: ${y} × ${z} = ${y * z}.`, `Add ${x}: ${x} + ${y * z} = ${answer}.`];
    } else if (difficulty === 2) {
      prompt = `Find (${x} + ${y}) × ${z}.`;
      answer = (x + y) * z;
      subtopic = "Parentheses first";
      steps = [`Evaluate parentheses: ${x} + ${y} = ${x + y}.`, `Multiply: ${x + y} × ${z} = ${answer}.`];
    } else if (difficulty === 3) {
      prompt = `Find ${z * (x + y)} ÷ ${z} + ${x}.`;
      answer = x + y + x;
      subtopic = "Multiple operation groups";
      steps = [`Divide and multiply from left to right: ${z * (x + y)} ÷ ${z} = ${x + y}.`, `Add ${x}: ${x + y} + ${x} = ${answer}.`];
    } else if (difficulty === 4) {
      prompt = `Find ${x} × (${y} + ${z}) − ${x}.`;
      answer = x * (y + z) - x;
      subtopic = "Expression in context";
      steps = [`Add inside parentheses: ${y} + ${z} = ${y + z}.`, `Multiply: ${x} × ${y + z} = ${x * (y + z)}.`, `Subtract ${x}: the result is ${answer}.`];
    } else {
      prompt = `Find ${x}² + ${y} × (${z} − ${x}).`;
      answer = x * x + y * (z - x);
      subtopic = "Exponents and nested grouping";
      steps = [`Parentheses: ${z} − ${x} = ${z - x}.`, `Exponent and multiplication: ${x}² = ${x * x}; ${y} × ${z - x} = ${y * (z - x)}.`, `Add: ${x * x} + ${y * (z - x)} = ${answer}.`];
    }
    parameters = { first: x, second: y, third: z };
  } else if (topicId === "addition") {
    if (difficulty === 1) {
      a = randomInt(seed, 12, 49);
      b = randomInt(nextRandom(seed), 11, 48);
      prompt = `Find ${a} + ${b}.`;
      answer = a + b;
      subtopic = "Add two whole numbers";
      steps = [`Add the ones and tens: ${a} + ${b}.`, `The sum is ${answer}.`];
    } else if (difficulty === 2) {
      a = randomInt(seed, 125, 487);
      b = randomInt(nextRandom(seed), 236, 579);
      prompt = `Find ${a} + ${b}. Show how you regroup.`;
      answer = a + b;
      subtopic = "Regroup across place values";
      steps = [`Add the ones, tens, and hundreds, regrouping when a place totals 10 or more.`, `${a} + ${b} = ${answer}.`];
    } else if (difficulty === 3) {
      a = randomInt(seed, 235, 789);
      b = randomInt(nextRandom(seed), 128, 576);
      c = randomInt(nextRandom(nextRandom(seed)), 147, 468);
      prompt = `Find ${a} + ${b} + ${c}.`;
      answer = a + b + c;
      subtopic = "Add three whole numbers";
      steps = [`Add ${a} + ${b} = ${a + b}.`, `Add the third number: ${a + b} + ${c} = ${answer}.`];
    } else if (difficulty === 4) {
      const groups = randomInt(seed, 3, 8);
      const first = randomInt(nextRandom(seed), 125, 475);
      const second = randomInt(nextRandom(seed + 13), 135, 495);
      a = groups * first;
      b = groups * second;
      prompt = `A school collects ${first} books from each of ${groups} classes and ${second} books from each of the same ${groups} classes. How many books are collected in all?`;
      answer = groups * (first + second);
      subtopic = "Addition in equal-group context";
      steps = [`Add the two amounts per class: ${first} + ${second} = ${first + second}.`, `There are ${groups} classes, so ${groups} × ${first + second} = ${answer} books in all.`];
      c = groups;
    } else {
      const total = randomInt(seed, 1200, 4800);
      const firstPart = randomInt(nextRandom(seed), 350, total - 450);
      const secondPart = randomInt(nextRandom(seed + 17), 125, total - firstPart - 1);
      const missing = total - firstPart - secondPart;
      a = firstPart;
      b = secondPart;
      c = total;
      prompt = `Three numbers add to ${total}. Two of them are ${firstPart} and ${secondPart}. What is the third number?`;
      answer = missing;
      subtopic = "Reason backward to find an addend";
      steps = [`Add the known numbers: ${firstPart} + ${secondPart} = ${firstPart + secondPart}.`, `Subtract that sum from the total: ${total} − ${firstPart + secondPart} = ${missing}.`, `Check: ${firstPart} + ${secondPart} + ${missing} = ${total}.`];
    }
    parameters = { first: a, second: b, third: c };
  } else {
    if (difficulty === 1) {
      prompt = `Find ${a} + ${b}.`;
      answer = a + b;
      subtopic = "Add whole numbers";
      steps = [`Add the ones and tens: ${a} + ${b}.`, `The sum is ${answer}.`];
    } else if (difficulty === 2) {
      prompt = `Find ${a} × ${b} − ${c}.`;
      answer = a * b - c;
      subtopic = "Multiplication before subtraction";
      steps = [`Multiply first: ${a} × ${b} = ${a * b}.`, `Subtract ${c}: ${a * b} − ${c} = ${answer}.`];
    } else if (difficulty === 3) {
      prompt = `Find ${a} × (${b} − ${c}) + ${c}.`;
      answer = a * (b - c) + c;
      subtopic = "Evaluate a grouped expression";
      steps = [`Parentheses: ${b} − ${c} = ${b - c}.`, `Multiply: ${a} × ${b - c} = ${a * (b - c)}.`, `Add ${c} to get ${answer}.`];
    } else if (difficulty === 4) {
      const groups = randomInt(seed, 4, 12);
      const each = randomInt(nextRandom(seed), 16, 38);
      const takeAway = randomInt(nextRandom(seed + 31), 10, 55);
      prompt = `A library has ${groups} shelves with ${each} books on each. It lends out ${takeAway} books. How many remain?`;
      answer = groups * each - takeAway;
      subtopic = "Multi-step story problem";
      steps = [`Find the starting total: ${groups} × ${each} = ${groups * each}.`, `Subtract the books lent out: ${groups * each} − ${takeAway} = ${answer}.`];
      a = groups;
      b = each;
      c = takeAway;
    } else {
      const multiplier = randomInt(seed, 3, 9);
      const subtract = randomInt(nextRandom(seed), 8, 34);
      const target = randomInt(nextRandom(seed + 7), 45, 99);
      answer = Math.ceil((target + subtract) / multiplier);
      const result = answer * multiplier - subtract;
      prompt = `I multiply a whole number by ${multiplier}, then subtract ${subtract}. The result is ${result}. What was the number?`;
      answer = (result + subtract) / multiplier;
      subtopic = "Reason backward";
      steps = [`Undo subtracting ${subtract}: ${result} + ${subtract} = ${result + subtract}.`, `Undo multiplying by ${multiplier}: ${result + subtract} ÷ ${multiplier} = ${answer}.`, `Check: ${answer} × ${multiplier} − ${subtract} = ${result}.`];
      a = multiplier;
      b = subtract;
      c = result;
    }
    parameters = { first: a, second: b, third: c };
  }

  return makeGenerated(
    question,
    context,
    difficulty,
    "integer-arithmetic",
    parameters,
    subtopic,
    prompt,
    String(answer),
    "Work one operation at a time, following the structure of the expression or situation.",
    steps,
    "integer",
    undefined,
    templateVersion,
  );
}

function fractionQuestion(
  makeQuestion: QuestionFactory,
  context: GenerationContext,
  difficulty: ChallengeDifficulty,
  seed: number,
  templateVersion: number = 1,
): GeneratedQuestion {
  let d1 = randomInt(seed, 2, 8);
  let d2 = d1 === 2 ? 3 : randomInt(nextRandom(seed), 2, 8);
  if (d2 === d1) d2 = d1 === 8 ? d1 - 1 : d1 + 1;
  let n1 = randomInt(nextRandom(nextRandom(seed)), 1, d1 - 1);
  let n2 = randomInt(nextRandom(seed + 41), 1, d2 - 1);
  const subtract = (seed & 1) === 1;
  if (difficulty === 2 && subtract && n1 * d2 < n2 * d1) {
    [n1, n2] = [n2, n1];
    [d1, d2] = [d2, d1];
  }
  let numerator: number;
  let denominator: number;
  let prompt: string;
  let steps: string[];
  let subtopic: string;
  let parameters: TemplateParameters;

  if (difficulty === 1) {
    numerator = subtract ? Math.max(n1, n2) - Math.min(n1, n2) : n1 + n2;
    denominator = d1;
    prompt = `Find ${subtract ? `${Math.max(n1, n2)}/${d1} − ${Math.min(n1, n2)}/${d1}` : `${n1}/${d1} + ${n2}/${d1}`}. Give a fraction.`;
    steps = [`The denominators match, so ${subtract ? "subtract" : "add"} the numerators.`, `The result is ${numerator}/${denominator}; reduce if possible.`];
    subtopic = "Like denominators";
    parameters = { numerator1: subtract ? Math.max(n1, n2) : n1, numerator2: subtract ? Math.min(n1, n2) : n2, denominator };
  } else if (difficulty === 2) {
    const common = d1 * d2;
    const left = n1 * d2;
    const right = n2 * d1;
    numerator = subtract ? Math.abs(left - right) : left + right;
    denominator = common;
    prompt = `Find ${subtract ? `${n1}/${d1} − ${n2}/${d2}` : `${n1}/${d1} + ${n2}/${d2}`}. Give a fraction.`;
    steps = [`Use common denominator ${common}: ${n1}/${d1} = ${left}/${common} and ${n2}/${d2} = ${right}/${common}.`, `${subtract ? "Subtract" : "Add"} the numerators: ${left} ${subtract ? "−" : "+"} ${right} = ${subtract ? left - right : left + right}.`, `Reduce the result to ${fraction(subtract ? left - right : left + right, common)}.`];
    subtopic = "Unlike denominators";
    parameters = {
      numerator1: n1,
      denominator1: d1,
      numerator2: n2,
      denominator2: d2,
      subtract: subtract ? 1 : 0,
    };
  } else if (difficulty === 3) {
    const whole1 = randomInt(seed, 1, 4);
    const whole2 = randomInt(nextRandom(seed), 1, 3);
    const top1 = whole1 * d1 + n1;
    const top2 = whole2 * d2 + n2;
    const common = d1 * d2;
    const total = subtract ? top1 * d2 - top2 * d1 : top1 * d2 + top2 * d1;
    numerator = total;
    denominator = common;
    prompt = `Find ${subtract ? `${whole1} ${n1}/${d1} − ${whole2} ${n2}/${d2}` : `${whole1} ${n1}/${d1} + ${whole2} ${n2}/${d2}`}. Give a fraction.`;
    steps = [`Convert the mixed numbers: ${whole1} ${n1}/${d1} = ${top1}/${d1} and ${whole2} ${n2}/${d2} = ${top2}/${d2}.`, `Use denominator ${common}: ${top1 * d2}/${common} ${subtract ? "−" : "+"} ${top2 * d1}/${common}.`, `The answer is ${fraction(total, common)}.`];
    subtopic = "Mixed numbers";
    parameters = {
      whole1,
      numerator1: n1,
      denominator1: d1,
      whole2,
      numerator2: n2,
      denominator2: d2,
      subtract: subtract ? 1 : 0,
    };
  } else if (difficulty === 4) {
    const common = d1 * d2;
    numerator = n1 * d2 + n2 * d1;
    denominator = common;
    prompt = `A trail is ${n1}/${d1} mile long. A hiker walks it and then continues ${n2}/${d2} mile farther. What total distance is walked? Give a fraction of a mile.`;
    steps = [`Rewrite both distances with denominator ${common}: ${n1 * d2}/${common} and ${n2 * d1}/${common}.`, `Add: ${n1 * d2}/${common} + ${n2 * d1}/${common} = ${fraction(numerator, denominator)}.`, `The total distance is ${fraction(numerator, denominator)} mile.`];
    subtopic = "Fraction addition in context";
    parameters = { numerator1: n1, denominator1: d1, numerator2: n2, denominator2: d2 };
  } else {
    const d3 = randomInt(seed + 53, 2, 7);
    const n3 = randomInt(nextRandom(seed + 53), 1, d3 - 1);
    const common = d1 * d2 * d3;
    const term1 = n1 * d2 * d3;
    const term2 = n2 * d1 * d3;
    const term3 = n3 * d1 * d2;
    numerator = term1 + term2 - term3;
    denominator = common;
    prompt = `Find ${n1}/${d1} + ${n2}/${d2} − ${n3}/${d3}. Give a fraction.`;
    steps = [`Use common denominator ${common}: rewrite each fraction as ${term1}/${common}, ${term2}/${common}, and ${term3}/${common}.`, `Combine numerators: ${term1} + ${term2} − ${term3} = ${numerator}.`, `Reduce ${numerator}/${common} to ${fraction(numerator, common)}.`];
    subtopic = "Multi-step fraction reasoning";
    parameters = { numerator1: n1, denominator1: d1, numerator2: n2, denominator2: d2, numerator3: n3, denominator3: d3 };
  }

  const normalized = fraction(numerator, denominator);
  return makeGenerated(
    question,
    context,
    difficulty,
    "fraction-add-subtract",
    parameters,
    subtopic,
    prompt,
    normalized,
    "Use a common denominator before combining numerators; reduce the final fraction.",
    steps,
    "fraction",
    "Give the answer as a fraction. Equivalent fractions are accepted.",
    templateVersion,
  );
}

function linearEquationQuestion(
  makeQuestion: QuestionFactory,
  context: GenerationContext,
  difficulty: ChallengeDifficulty,
  seed: number,
  templateVersion: number = 1,
): GeneratedQuestion {
  const x = randomInt(seed, -8, 12);
  let a = randomInt(nextRandom(seed), 2, 8);
  let b = randomInt(nextRandom(seed + 61), -9, 12);
  let c = randomInt(nextRandom(seed + 127), 2, 9);
  let prompt: string;
  let steps: string[];
  let subtopic: string;
  let parameters: TemplateParameters;

  if (difficulty === 1) {
    b = randomInt(nextRandom(seed + 61), -12, 12);
    const rhs = x + b;
    prompt = `Solve: x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} = ${rhs}.`;
    steps = [`Undo ${b < 0 ? "subtracting" : "adding"} ${Math.abs(b)} on both sides.`, `x = ${rhs} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${x}.`, `Check by substituting x = ${x}.`];
    subtopic = "One-step equation";
    parameters = { coefficient: 1, constant: b, solution: x };
  } else if (difficulty === 2) {
    a = randomInt(nextRandom(seed), 2, 8);
    b = randomInt(nextRandom(seed + 61), -12, 12);
    const rhs = a * x + b;
    prompt = `Solve: ${a}x ${b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`} = ${rhs}.`;
    steps = [`Undo the constant: ${a}x = ${rhs} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${a * x}.`, `Divide both sides by ${a}: x = ${x}.`, `Check in the original equation.`];
    subtopic = "Two-step equation";
    parameters = { coefficient: a, constant: b, rightSide: rhs, solution: x };
  } else if (difficulty === 3) {
    a = randomInt(nextRandom(seed), 2, 7);
    b = randomInt(nextRandom(seed + 61), 1, 9);
    const rhs = a * (x + b);
    prompt = `Solve: ${a}(x + ${b}) = ${rhs}.`;
    steps = [`Divide both sides by ${a}: x + ${b} = ${x + b}.`, `Subtract ${b}: x = ${x}.`, `Substitute x = ${x}: ${a}(${x} + ${b}) = ${rhs}.`];
    subtopic = "Distributive property";
    parameters = { coefficient: a, shift: b, rightSide: rhs, solution: x };
  } else if (difficulty === 4) {
    a = randomInt(nextRandom(seed), 5, 9);
    c = randomInt(nextRandom(seed + 23), 2, 4);
    if (a === c) c = a - 1;
    b = randomInt(nextRandom(seed + 61), 2, 12);
    const rhs = a * x + b;
    const rightConstant = rhs - c * x;
    prompt = `A number is multiplied by ${a} and then ${b} is added. This equals ${c} times the number plus ${rightConstant}. What is the number?`;
    steps = [`Write the equation: ${a}x + ${b} = ${c}x + ${rightConstant}.`, `Subtract ${c}x and ${b}: ${a - c}x = ${rightConstant - b}.`, `Divide by ${a - c}: x = ${x}.`];
    subtopic = "Equation from a word problem";
    parameters = { leftCoefficient: a, leftConstant: b, rightCoefficient: c, rightConstant, solution: x };
  } else {
    a = randomInt(nextRandom(seed), 3, 8);
    c = randomInt(nextRandom(seed + 23), 1, 3);
    if (a === c) c = a - 1;
    b = randomInt(nextRandom(seed + 61), 2, 8);
    const leftConstant = randomInt(nextRandom(seed + 83), -9, 12);
    const rhs = a * (x + b) + leftConstant;
    const rightConstant = rhs - c * x;
    prompt = `Solve: ${a}(x + ${b}) ${signedTerm(leftConstant)} = ${c}x ${signedTerm(rightConstant)}.`;
    steps = [`Distribute: ${a}x + ${a * b} ${signedTerm(leftConstant)} = ${c}x ${signedTerm(rightConstant)}.`, `Collect x terms and constants: ${a - c}x = ${rightConstant - a * b - leftConstant}.`, `Divide by ${a - c}; x = ${x}. Check in the original equation.`];
    subtopic = "Multi-step equation with variables on both sides";
    parameters = { coefficient: a, shift: b, leftConstant, rightCoefficient: c, rightConstant, solution: x };
  }

  return makeGenerated(
    makeQuestion,
    context,
    difficulty,
    "linear-equation-one-variable",
    parameters,
    subtopic,
    prompt,
    String(x),
    "Undo operations in reverse order, keeping both sides of the equation balanced.",
    steps,
    "integer",
    undefined,
    templateVersion,
  );
}

function choiceAnswer(
  correct: string,
  distractors: string[],
  valueType: "integer" | "fraction" | "text",
  seed: number,
): AnswerRule {
  const ruleFor = (): AnswerRule =>
    valueType === "fraction"
        ? { type: "fraction", canonical: correct }
        : { type: "integer", canonical: correct };
  const isEquivalentToCorrect = (value: string) =>
    valueType === "text"
      ? value === correct
      : checkAnswer(ruleFor(), value).status === "correct";
  const optionCount =
    ["Group A", "Group B", "Same", "Acute", "Right", "Obtuse"].includes(correct)
      ? 3
      : 4;
  const values = [...new Set([correct, ...distractors])]
    .filter((value) => value === correct || !isEquivalentToCorrect(value))
    .slice(0, optionCount);
  const denominator = Number(correct.split("/")[1]) || 1;
  for (let fallback = 1; values.length < optionCount; fallback += 1) {
    const candidate =
      valueType === "integer"
        ? String(Number(correct) + fallback)
        : valueType === "fraction"
          ? `${fallback}/${denominator}`
          : `Other choice ${fallback}`;
    if (!values.includes(candidate) && !isEquivalentToCorrect(candidate)) {
      values.push(candidate);
    }
  }
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swap = nextRandom(seed + index) % (index + 1);
    [values[index], values[swap]] = [values[swap], values[index]];
  }
  return {
    type: "choice",
    canonical: correct,
    valueType,
    options: values.map((value, index) => ({
      id: `choice-${String.fromCharCode(65 + index)}`,
      label: value,
      value,
    })),
  };
}

function elementaryQuestion(
  makeQuestion: QuestionFactory,
  context: GenerationContext,
  difficulty: ChallengeDifficulty,
  seed: number,
  templateVersion: number = 1,
): GeneratedQuestion {
  let prompt: string;
  let subtopic: string;
  let answer = "";
  let distractors: string[] = [];
  let valueType: "integer" | "fraction" | "text" = "integer";
  let hint: string;
  let steps: string[];
  let visual: QuestionVisual | undefined;
  const parameters: TemplateParameters = { difficulty };
  const a = randomInt(seed, 2, 9);
  const b = randomInt(nextRandom(seed), 2, 9);
  const c = randomInt(nextRandom(seed + 13), 1, 8);

  switch (context.topicId) {
    case "kindergarten-counting": {
      const count = difficulty === 4
        ? c + randomInt(seed, 1, 6)
        : difficulty < 3
          ? randomInt(seed, 1, 5 + difficulty)
          : randomInt(seed, 6, 10 + difficulty);
      answer = String(count);
      distractors = [String(Math.max(0, count - 1)), String(count + 1), String(count + 2)];
      subtopic = difficulty < 3 ? "Count the objects" : "Count and reason";
      prompt = difficulty < 3
        ? "How many stars do you see?"
        : difficulty < 5
          ? `There are ${count - c} blocks. How many more make ${count}?`
          : `You have ${count} counters and add ${c}. How many counters are there now?`;
      if (difficulty === 4) answer = String(c);
      if (difficulty === 5) answer = String(count + c);
      if (difficulty === 4) distractors = [String(c - 1), String(c + 1), String(count)];
      if (difficulty === 5) distractors = [String(count + c - 1), String(count + c + 1), String(count + c + 2)];
      visual = difficulty <= 3
        ? { kind: "counters", label: "Stars", count }
        : undefined;
      hint = "Touch or count each object once. For a missing part, count on to the total.";
      steps = [`Count the objects or identify the missing part.`, `The answer is ${answer}.`];
      parameters.count = count;
      parameters.extra = c;
      break;
    }
    case "kindergarten-comparing": {
      let left = randomInt(seed, 1, 5 + difficulty);
      let right = randomInt(nextRandom(seed), 1, 5 + difficulty);
      if (difficulty === 4 && right > left) [left, right] = [right, left];
      const difference = Math.abs(left - right);
      if (difficulty <= 2) {
        answer = left > right ? "Group A" : left < right ? "Group B" : "Same";
        distractors = ["Group A", "Group B", "Same"].filter((item) => item !== answer);
        valueType = "text";
        prompt = "Which group has more counters, or are they the same?";
        visual = {
          kind: "comparison",
          label: "Compare the two groups",
          count: left + right,
          groups: [
            { label: "Group A", count: left },
            { label: "Group B", count: right },
          ],
        };
      } else {
        answer = String(difference);
        distractors = [String(difference + 1), String(Math.max(0, difference - 1)), String(difference + 2)];
        prompt = `Group A has ${left} counters and Group B has ${right}. How many more counters are in the larger group?`;
      }
      if (difficulty === 1) {
        visual = {
          kind: "comparison",
          label: "Compare the two groups",
          count: left + right,
          groups: [
            { label: "Group A", count: left },
            { label: "Group B", count: right },
          ],
        };
      } else if (difficulty === 2) {
        prompt = `Group A has ${left}. Group B has ${right}. Which group has more, or are they the same?`;
      } else if (difficulty === 4) {
        prompt = `Mia has ${left} shells. Leo has ${right}. How many shells must Leo find to have as many as Mia?`;
        answer = String(Math.max(0, left - right));
        distractors = [String(Math.max(0, left - right) + 1), String(Math.abs(left - right)), String(left + right)];
      } else if (difficulty === 5) {
        prompt = `There are ${left} red blocks and ${right} blue blocks. How many blocks are there altogether?`;
        answer = String(left + right);
        distractors = [String(left + right - 1), String(left + right + 1), String(Math.abs(left - right))];
      }
      subtopic = difficulty <= 2 ? "Compare two groups" : "Find the difference";
      hint = "Line up the groups or count on from the smaller group.";
      steps = [`Compare or count on between the two groups.`, `The answer is ${answer}.`];
      parameters.left = left;
      parameters.right = right;
      break;
    }
    case "kindergarten-patterns": {
      const symbol = difficulty % 2 === 0 ? "● ▲ ● ▲" : "★ ○ ★ ○";
      const answerText = difficulty < 3
        ? (difficulty % 2 === 0 ? "Circle" : "Star")
        : String(a + (difficulty === 3 ? 3 : 2));
      answer = answerText;
      valueType = difficulty < 3 ? "text" : "integer";
      prompt = difficulty < 3
        ? `What comes next in this pattern? ${symbol} …`
        : `The pattern starts ${a}, ${a + 1}, ${a + 2}. What is the next number?`;
      distractors = valueType === "text"
        ? ["Triangle", "Square", answerText === "Star" ? "Circle" : "Star"]
        : [String(Number(answerText) - 1), String(Number(answerText) + 1), String(Number(answerText) + 2)];
      if (difficulty === 4) {
        prompt = `The pattern goes ${a}, ${a + 2}, ${a + 4}. What comes next?`;
        answer = String(a + 6);
      }
      if (difficulty === 5) {
        prompt = `The pattern goes ${a}, ${a + 2}, ${a + 4}, __, ${a + 8}. What number is missing?`;
        answer = String(a + 6);
      }
      subtopic = "Continue a pattern";
      hint = "Look at what repeats or how much the numbers change each time.";
      steps = [`Find the repeating part or count the same jump each time.`, `The next or missing part is ${answer}.`];
      parameters.start = a;
      parameters.difficulty = difficulty;
      break;
    }
    case "kindergarten-shapes": {
      const shape = difficulty % 2 === 0 ? "Square" : "Triangle";
      answer = shape;
      valueType = "text";
      if (difficulty === 1) {
        prompt = "Which shape has three straight sides?";
      } else if (difficulty === 2) {
        prompt = "Which shape has four equal sides and four corners?";
        answer = "Square";
      } else if (difficulty === 3) {
        prompt = "Which shape has no straight sides and no corners?";
        answer = "Circle";
      } else if (difficulty === 4) {
        prompt = "Which shape has four corners and opposite sides equal?";
        answer = "Rectangle";
      } else {
        prompt = "A shape has three corners. What is its name?";
        answer = "Triangle";
      }
      distractors = ["Circle", "Square", "Triangle", "Rectangle"].filter((item) => item !== answer);
      subtopic = "Name a shape";
      hint = "Count straight sides and corners, or notice whether the sides are curved.";
      steps = [`Check the number of sides and corners in the description.`, `${answer} matches the description.`];
      break;
    }
    case "grade-1-add-subtract": {
      const first =
        difficulty < 3
          ? randomInt(seed, 3, 10)
          : randomInt(seed, 3, 19);
      const second =
        difficulty < 3
          ? randomInt(nextRandom(seed), 1, 9)
          : randomInt(nextRandom(seed), 1, 20 - first);
      if (difficulty === 1) {
        prompt = `Find ${first} + ${second}.`;
        answer = String(first + second);
      } else if (difficulty === 2) {
        const total = Math.min(20, first + second);
        prompt = `Find ${total} − ${second}.`;
        answer = String(total - second);
      } else if (difficulty === 3) {
        prompt = `${first} + __ = ${first + second}. What number is missing?`;
        answer = String(second);
      } else if (difficulty === 4) {
        prompt = `There are ${first} birds. ${second} more arrive. How many birds are there now?`;
        answer = String(first + second);
      } else {
        const total = first + second;
        prompt = `There are ${total} apples. ${second} are eaten. How many are left?`;
        answer = String(first);
      }
      const n = Number(answer);
      distractors = [String(n - 1), String(n + 1), String(n + 2)];
      subtopic = difficulty < 3 ? "Add and subtract within 20" : "Find a missing part";
      hint = "Use a number line or count on. For subtraction, count back or find the missing part.";
      steps = [`Write the numbers in the story or equation.`, `Add or subtract: ${answer}.`];
      parameters.first = first;
      parameters.second = second;
      break;
    }
    case "grade-1-place-value":
    case "grade-2-place-value":
    case "grade-4-multidigit-operations": {
      const grade2 = context.topicId === "grade-2-place-value";
      const grade4 = context.topicId === "grade-4-multidigit-operations";
      const base = grade4
        ? randomInt(seed, 120, 640)
        : grade2
          ? randomInt(seed, 120, 850)
          : randomInt(seed, 21, 89);
      if (!grade4 && difficulty <= 2) {
        const tens = Math.floor(base / 10) * 10;
        const ones = base % 10;
        prompt = difficulty === 1
          ? `In ${base}, what is the value of the ${ones} in the ones place?`
          : `What number is made from ${tens} and ${ones} ones?`;
        answer = difficulty === 1 ? String(ones) : String(base);
      } else if (!grade4 && difficulty === 3) {
        prompt = `Write ${Math.floor(base / 100) ? `${Math.floor(base / 100)} hundreds, ` : ""}${Math.floor((base % 100) / 10)} tens, and ${base % 10} ones as a number.`;
        answer = String(base);
      } else if (grade4 && difficulty === 1) {
        prompt = `Find ${base} + ${b * 10}.`;
        answer = String(base + b * 10);
      } else if (grade4 && difficulty === 2) {
        prompt = `Find ${base * 2} − ${base}.`;
        answer = String(base);
      } else if (grade4 && difficulty === 3) {
        prompt = `Find ${a * 123} × ${a}.`;
        answer = String(a * 123 * a);
      } else if (grade4 && difficulty === 4) {
        prompt = `A school orders ${a} boxes with ${b * 10} pencils in each box. How many pencils is that?`;
        answer = String(a * b * 10);
      } else if (!grade2 && !grade4 && difficulty === 4) {
        prompt = `What is 10 less than ${base}?`;
        answer = String(base - 10);
      } else if (!grade2 && !grade4) {
        prompt = `What is 10 more than ${base}?`;
        answer = String(base + 10);
      } else if (difficulty === 4) {
        prompt = `Round ${base} to the nearest ten.`;
        answer = String(Math.round(base / 10) * 10);
      } else {
        prompt = `Round ${base} to the nearest hundred.`;
        answer = String(Math.round(base / 100) * 100);
      }
      const result = Number(answer);
      distractors = [String(result + 10), String(Math.max(0, result - 10)), String(result + 1)];
      subtopic = grade4 ? "Use place value with larger numbers" : "Tens, hundreds, and ones";
      hint = "Break the number into place-value parts before calculating or rounding.";
      steps = [`Identify the place-value parts shown.`, `Combine them to get ${answer}.`];
      parameters.base = base;
      break;
    }
    case "grade-1-time-shapes": {
      answer = difficulty % 2 === 0 ? "2:30" : "4:00";
      valueType = "text";
      if (difficulty === 1) prompt = "The short hand points to 4 and the long hand points to 12. What time is it?";
      if (difficulty === 2) prompt = "The short hand is between 2 and 3. The long hand points to 6. What time is it?";
      if (difficulty === 3) { prompt = "Thirty minutes after 5:00 is what time?"; answer = "5:30"; }
      if (difficulty === 4) { prompt = "One hour after 6:30 is what time?"; answer = "7:30"; }
      if (difficulty === 5) { prompt = "It is 3:30. What time will it be in one hour?"; answer = "4:30"; }
      distractors = ["2:00", "3:30", "4:30", "5:00"].filter((item) => item !== answer);
      subtopic = "Read and use time";
      hint = "The long hand at 12 means :00. At 6, it means :30.";
      steps = [`Read the hour and minute hands or count forward by one hour.`, `The time is ${answer}.`];
      break;
    }
    case "grade-2-equal-groups":
    case "grade-3-multiplication-division": {
      const groups = randomInt(seed, 2, difficulty + 3);
      const each = randomInt(nextRandom(seed), 2, 5 + Math.min(difficulty, 3));
      if (difficulty === 1) {
        prompt = `There are ${groups} groups with ${each} in each group. How many are there altogether?`;
        answer = String(groups * each);
        visual = { kind: "array", label: `${groups} rows of ${each}`, rows: groups, columns: each, count: groups * each };
      } else if (difficulty === 2) {
        prompt = `Find ${groups} × ${each}.`;
        answer = String(groups * each);
      } else if (difficulty === 3) {
        prompt = `${groups * each} objects are shared equally among ${groups} children. How many does each child get?`;
        answer = String(each);
      } else if (difficulty === 4) {
        prompt = `There are ${groups} bags with ${each} marbles in each. How many marbles are there?`;
        answer = String(groups * each);
      } else {
        prompt = `${groups} × __ = ${groups * each}. What number is missing?`;
        answer = String(each);
      }
      const result = Number(answer);
      distractors = [String(result + 1), String(Math.max(0, result - 1)), String(result + groups)];
      subtopic = difficulty <= 2 ? "Equal groups and arrays" : "Multiply and divide";
      hint = "Draw equal groups or an array. Multiplication counts all the equal groups.";
      steps = [`There are ${groups} equal groups of ${each}.`, `Multiply or divide to find ${answer}.`];
      parameters.groups = groups;
      parameters.each = each;
      break;
    }
    case "grade-2-money-data": {
      const centsA = randomInt(seed, 10, 90);
      const centsB = randomInt(nextRandom(seed), 10, 90);
      const cents = difficulty <= 3 ? centsA + centsB : Math.max(centsA, centsB) - Math.min(centsA, centsB);
      valueType = "text";
      prompt = difficulty <= 3
        ? `A pencil costs $${(centsA / 100).toFixed(2)} and an eraser costs $${(centsB / 100).toFixed(2)}. What is the total cost?`
        : `Cats got ${centsA} votes and dogs got ${centsB} votes. How many more votes did the larger group get?`;
      if (difficulty <= 3) {
        answer = `$${(cents / 100).toFixed(2)}`;
        distractors = [
          `$${((cents + 1) / 100).toFixed(2)}`,
          `$${(Math.max(0, cents - 1) / 100).toFixed(2)}`,
          `$${((cents + 2) / 100).toFixed(2)}`,
        ];
      } else {
        answer = String(Math.abs(centsA - centsB));
        distractors = [
          String(Number(answer) + 1),
          String(Math.max(0, Number(answer) - 1)),
          String(Number(answer) + 2),
        ];
      }
      subtopic = difficulty <= 3 ? "Add money amounts" : "Compare simple data";
      hint = "Line up dollars and cents, or compare the two counts and find the difference.";
      steps = [`Combine or compare the two amounts.`, `The answer is ${answer}.`];
      parameters.amountA = centsA;
      parameters.amountB = centsB;
      break;
    }
    case "grade-3-fractions":
    case "grade-4-fractions":
    case "grade-5-decimals-fractions": {
      const numeratorA = randomInt(seed, 1, 3);
      const denominator = difficulty < 3 ? 4 : 8;
      const numeratorB = randomInt(nextRandom(seed), 1, denominator - numeratorA);
      let numerator = numeratorA + numeratorB;
      let answerValue = fraction(numerator, denominator);
      if (context.topicId === "grade-3-fractions") {
        numerator = difficulty <= 2 ? numeratorA : Math.min(denominator, numeratorA + numeratorB);
        answerValue = fraction(numerator, denominator);
        prompt = difficulty <= 2
          ? `A shape is split into ${denominator} equal parts. ${numeratorA} parts are shaded. Which fraction is shaded?`
          : `Which is greater: ${numeratorA}/${denominator} or ${numeratorB}/${denominator}?`;
        if (difficulty >= 3) {
          answerValue = numeratorA >= numeratorB ? `${numeratorA}/${denominator}` : `${numeratorB}/${denominator}`;
          valueType = "fraction";
        } else {
          valueType = "fraction";
        }
      } else if (context.topicId === "grade-4-fractions") {
        if (difficulty <= 2) {
          prompt = `Which fraction is equivalent to ${numeratorA}/${denominator}?`;
          answerValue = `${numeratorA * 2}/${denominator * 2}`;
          valueType = "fraction";
        } else {
          prompt = `Find ${numeratorA}/${denominator} + ${numeratorB}/${denominator}. Give a fraction.`;
          answerValue = fraction(numeratorA + numeratorB, denominator);
          valueType = "fraction";
        }
      } else {
        const decimalA = randomInt(seed, 11, 45) / 10;
        const decimalB = randomInt(nextRandom(seed), 11, 35) / 10;
        if (difficulty <= 3) {
          prompt = `Find ${decimalA.toFixed(1)} + ${decimalB.toFixed(1)}.`;
          answerValue = (decimalA + decimalB).toFixed(1);
          valueType = "text";
        } else {
          prompt = `Find ${numeratorA}/${denominator} + ${numeratorB}/${denominator}. Give a fraction.`;
          answerValue = fraction(numeratorA + numeratorB, denominator);
          valueType = "fraction";
        }
        parameters.decimalA = decimalA;
        parameters.decimalB = decimalB;
      }
      answer = answerValue;
      distractors = valueType === "fraction"
        ? [`${numeratorA}/${denominator}`, `${numeratorA + 1}/${denominator}`, "1/2"]
        : valueType === "text"
          ? ["1/2", "2/3", "3/4"].filter((item) => item !== answerValue)
          : [];
      subtopic = context.topicId === "grade-3-fractions" ? "Fractions as equal parts" : context.topicId === "grade-4-fractions" ? "Equivalent fractions and like denominators" : "Decimal and fraction operations";
      hint = "Use equal-sized parts. For fractions, keep a common denominator; for decimals, line up the decimal points.";
      steps = [`Represent each amount in equal parts.`, `Combine or compare the parts to get ${answerValue}.`];
      parameters.numeratorA = numeratorA;
      parameters.numeratorB = numeratorB;
      parameters.denominator = denominator;
      break;
    }
    case "grade-3-area-perimeter": {
      const length = randomInt(seed, 2, 5 + difficulty);
      const width = randomInt(nextRandom(seed), 2, 5);
      const area = length * width;
      if (difficulty <= 2) {
        prompt = `A rectangle is ${length} units long and ${width} units wide. What is its area in square units?`;
        answer = String(area);
        visual = { kind: "array", label: `${length} rows of ${width} square units`, rows: length, columns: width, count: area };
      } else if (difficulty === 3) {
        prompt = `A rectangle has length ${length} and width ${width}. What is its perimeter?`;
        answer = String(2 * (length + width));
      } else if (difficulty === 4) {
        prompt = `A rectangle has area ${area} square units and width ${width}. What is its length?`;
        answer = String(length);
      } else {
        prompt = `A garden is ${length} meters by ${width} meters. How many meters of fencing go around it?`;
        answer = String(2 * (length + width));
      }
      const result = Number(answer);
      distractors = [String(result + 1), String(Math.max(1, result - 1)), String(length + width)];
      subtopic = difficulty <= 2 ? "Find area with an array" : "Area and perimeter";
      hint = "Area counts square units inside. Perimeter adds all the side lengths around the outside.";
      steps = [`Use ${difficulty <= 2 || difficulty === 4 ? "length × width" : "2 × (length + width)"}.`, `The answer is ${answer}.`];
      parameters.length = length;
      parameters.width = width;
      break;
    }
    case "grade-4-angles-measure": {
      const angle = randomInt(seed, 2, 16) * 10;
      answer = String(difficulty < 3 ? (difficulty === 1 ? 90 : angle) : (180 - angle));
      prompt = difficulty === 1
        ? "How many degrees are in a right angle?"
        : difficulty === 2
          ? `An angle is ${angle}°. Is it acute, right, or obtuse?`
          : difficulty === 3
            ? `A straight angle is 180°. One part is ${angle}°. How many degrees are in the other part?`
            : difficulty === 4
              ? `Convert ${a} meters to centimeters.`
              : `A ribbon is 2 meters long. How many centimeters long is it?`;
      if (difficulty === 2) {
        answer = angle < 90 ? "Acute" : angle === 90 ? "Right" : "Obtuse";
        valueType = "text";
      }
      if (difficulty === 4) answer = String(a * 100);
      if (difficulty === 5) answer = "200";
      distractors = valueType === "text"
        ? ["Acute", "Right", "Obtuse"].filter((item) => item !== answer)
        : [String(Number(answer) + 10), String(Math.max(0, Number(answer) - 10)), String(Number(answer) + 20)];
      subtopic = difficulty <= 3 ? "Angle measures" : "Metric conversions";
      hint = "A right angle is 90°. One meter is 100 centimeters.";
      steps = [`Use the angle fact or conversion: 1 meter = 100 centimeters.`, `The answer is ${answer}${valueType === "text" ? "" : "° or units"}.`];
      parameters.angle = angle;
      break;
    }
    case "grade-5-volume": {
      const length = randomInt(seed, 2, 6);
      const width = randomInt(nextRandom(seed), 2, 5);
      const height = randomInt(nextRandom(seed + 17), 2, 4);
      const volume = length * width * height;
      prompt = difficulty <= 2
        ? `A box is ${length} cubes long, ${width} cubes wide, and ${height} cubes tall. How many unit cubes fill it?`
        : difficulty <= 4
          ? `Find the volume of a rectangular prism with length ${length}, width ${width}, and height ${height}.`
          : `A box has a base with area ${length * width} square units and height ${height}. What is its volume?`;
      answer = String(volume);
      const result = Number(answer);
      distractors = [String(result + length), String(result - width), String(length * width)];
      subtopic = "Volume of rectangular prisms";
      hint = "Find how many cubes cover one layer, then multiply by the number of layers.";
      steps = [`Find the base layer: ${length} × ${width} = ${length * width}.`, `Multiply by height: ${length * width} × ${height} = ${answer} cubic units.`];
      visual = difficulty === 1
        ? { kind: "array", label: "Unit cubes in one layer", rows: length, columns: width, count: length * width }
        : undefined;
      parameters.length = length;
      parameters.width = width;
      parameters.height = height;
      break;
    }
    case "grade-5-expressions-coordinates": {
      if (difficulty <= 3) {
        const start = randomInt(seed, 2, 8);
        const multiplier = randomInt(nextRandom(seed), 2, 5);
        prompt = difficulty === 1
          ? `Evaluate ${start} + ${multiplier}.`
          : difficulty === 2
            ? `Evaluate ${start} × ${multiplier} + 2.`
            : `Evaluate (${start} + 2) × ${multiplier}.`;
        answer = String(difficulty === 1 ? start + multiplier : difficulty === 2 ? start * multiplier + 2 : (start + 2) * multiplier);
        parameters.start = start;
        parameters.multiplier = multiplier;
      } else {
        const x = randomInt(seed, 1, 8);
        const y = randomInt(nextRandom(seed), 1, 8);
        prompt = difficulty === 4
          ? `On a coordinate grid, move ${x} spaces right and ${y} spaces up from (0, 0). Which point do you reach?`
          : `Point A is at (${x}, ${y}). How many units right is it from the y-axis?`;
        answer = difficulty === 4 ? `(${x}, ${y})` : String(x);
        valueType = difficulty === 4 ? "text" : "integer";
        parameters.x = x;
        parameters.y = y;
      }
      distractors = valueType === "text"
        ? ["(1, 2)", "(2, 1)", "(3, 3)"].filter((item) => item !== answer)
        : [String(Number(answer) + 1), String(Math.max(0, Number(answer) - 1)), String(Number(answer) + 2)];
      subtopic = difficulty <= 3 ? "Evaluate numerical expressions" : "Read coordinate points";
      hint = "Follow the operation order, or read the horizontal coordinate first.";
      steps = [`Apply the operations in order or identify the x-coordinate.`, `The answer is ${answer}.`];
      break;
    }
    default:
      throw new Error(`No elementary generator exists for ${context.topicId}.`);
  }

  const rule = choiceAnswer(answer, distractors, valueType, seed);
  return makeGenerated(
    makeQuestion,
    context,
    difficulty,
    "elementary-math-foundations",
    parameters,
    subtopic,
    prompt!,
    rule,
    hint!,
    steps!,
    "integer",
    "Choose one answer. A parent or teacher can help read the question if needed.",
    templateVersion,
    visual,
  );
}

export function getGeneratedTemplateQuestions(
  makeQuestion: QuestionFactory,
  context: GenerationContext,
  requestedVersions?: Record<string, number>,
): GeneratedQuestion[] {
  const applicable = templates.filter((template) =>
    template.topicIds.includes(context.topicId as never),
  );
  const generated: GeneratedQuestion[] = [];
  for (const template of applicable) {
    const templateVersion = requestedVersions?.[template.id] ?? template.version;
    const registeredGenerator = template.generators.find(
      (item) => item.version === templateVersion,
    );
    if (!registeredGenerator) continue;
    for (let difficulty = 1 as ChallengeDifficulty; difficulty <= 5; difficulty = (difficulty + 1) as ChallengeDifficulty) {
      const seed = hashSeed(
        `${context.date}|${context.timeZone}|${context.courseId}|${context.topicId}|${difficulty}|${generationVersion}|${template.id}|${templateVersion}`,
      );
      const item = registeredGenerator.generate(
        makeQuestion,
        context,
        difficulty,
        seed,
        templateVersion,
      );
      generated.push(item);
    }
  }
  return generated;
}

export function listSupportedTemplateIds(): string[] {
  return templates.map(({ id }) => id);
}
