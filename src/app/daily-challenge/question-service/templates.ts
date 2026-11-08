import "server-only";
import { createHash } from "node:crypto";
import type { CourseId, GradeCourse } from "../catalog";
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
  canonical: string,
  hint: string,
  solutionSteps: string[],
  answerType: "integer" | "fraction" = "integer",
  instructions?: string,
  templateVersion: number = templates.find((item) => item.id === templateId)?.version ?? 1,
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
    answerType === "fraction"
      ? { type: "fraction", canonical }
      : { type: "integer", canonical },
    hint,
    solutionSteps,
    instructions,
    templateVersion,
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
  return labels[topicId] ?? topicId;
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
