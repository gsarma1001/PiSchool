import "server-only";

export type AnswerRule =
  | { type: "integer"; canonical: string }
  | { type: "fraction"; canonical: string; acceptDecimal?: boolean }
  | {
      type: "rounded-decimal";
      canonical: string;
      decimalPlaces: number;
      tolerance: number;
    }
  | { type: "unordered-integer-set"; canonical: string[] };

export type AnswerCheck =
  | { status: "correct" }
  | { status: "incorrect" }
  | { status: "invalid"; message: string };

function parseInteger(value: string): bigint | undefined {
  if (!/^[+-]?\d+$/.test(value)) return undefined;
  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
}

function gcd(a: bigint, b: bigint): bigint {
  const zero = BigInt(0);
  let left = a < zero ? -a : a;
  let right = b < zero ? -b : b;
  while (right !== zero) {
    [left, right] = [right, left % right];
  }
  return left;
}

export function parseFraction(
  value: string,
  acceptDecimal = false,
): [bigint, bigint] | undefined {
  const trimmed = value.trim();
  const match = trimmed.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);

  if (!match) {
    const decimal = acceptDecimal
      ? trimmed.match(/^([+-]?)(\d+)\.(\d+)$/)
      : undefined;
    if (decimal) {
      const scale = BigInt(10) ** BigInt(decimal[3].length);
      const sign = decimal[1] === "-" ? BigInt(-1) : BigInt(1);
      const whole = BigInt(decimal[2]);
      const fractional = BigInt(decimal[3]);
      const numerator = sign * (whole * scale + fractional);
      const divisor = gcd(numerator, scale);
      return [
        numerator / divisor,
        scale / divisor,
      ];
    }
    const integer = parseInteger(trimmed);
    return integer === undefined ? undefined : [integer, BigInt(1)];
  }

  let numerator = BigInt(match[1]);
  let denominator = BigInt(match[2]);
  if (denominator === BigInt(0)) return undefined;
  if (denominator < BigInt(0)) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

function sameFraction(
  left: [bigint, bigint] | undefined,
  right: [bigint, bigint] | undefined,
): boolean {
  return (
    left !== undefined &&
    right !== undefined &&
    left[0] === right[0] &&
    left[1] === right[1]
  );
}

function parseIntegerSet(value: string): string[] | undefined {
  const trimmed = value.trim();
  const contents =
    trimmed.startsWith("{") && trimmed.endsWith("}")
      ? trimmed.slice(1, -1)
      : trimmed;
  if (!contents.trim()) return undefined;

  const items = contents.split(/[;,]/).map((item) => item.trim());
  const parsed = items.map(parseInteger);
  const integers = parsed.filter(
    (item): item is bigint => item !== undefined,
  );
  if (integers.length !== parsed.length) return undefined;
  return integers.map(String).sort();
}

export function checkAnswer(rule: AnswerRule, value: string): AnswerCheck {
  const answer = value.trim();
  if (!answer) {
    return {
      status: "invalid",
      message: "Enter an answer before checking it. This does not count as an attempt.",
    };
  }

  if (rule.type === "integer") {
    const submitted = parseInteger(answer);
    if (submitted === undefined) {
      return {
        status: "invalid",
        message: "Enter a whole number, including a minus sign if needed.",
      };
    }
    return String(submitted) === rule.canonical
      ? { status: "correct" }
      : { status: "incorrect" };
  }

  if (rule.type === "fraction") {
    const submitted = parseFraction(answer, rule.acceptDecimal);
    if (submitted === undefined) {
      return {
        status: "invalid",
        message:
          rule.acceptDecimal
            ? "Enter a fraction, whole number, or exact decimal equivalent."
            : "Enter a fraction such as 3/4 (or a whole number). Decimals are not accepted for this question.",
      };
    }
    return sameFraction(submitted, parseFraction(rule.canonical))
      ? { status: "correct" }
      : { status: "incorrect" };
  }

  if (rule.type === "rounded-decimal") {
    const decimalPattern = new RegExp(
      `^[+-]?\\d+\\.\\d{${rule.decimalPlaces}}$`,
    );
    if (!decimalPattern.test(answer)) {
      return {
        status: "invalid",
        message: `Enter a decimal rounded to exactly ${rule.decimalPlaces} decimal places.`,
      };
    }
    const submitted = Number(answer);
    const expected = Number(rule.canonical);
    if (!Number.isFinite(submitted)) {
      return {
        status: "invalid",
        message: "Enter a valid decimal number.",
      };
    }
    return Math.abs(submitted - expected) < rule.tolerance
      ? { status: "correct" }
      : { status: "incorrect" };
  }

  const submitted = parseIntegerSet(answer);
  if (submitted === undefined) {
    return {
      status: "invalid",
      message:
        "Enter whole-number answers separated by commas, such as {2, -3}.",
    };
  }
  const expected = [...rule.canonical].map((item) => String(BigInt(item))).sort();
  return submitted.length === expected.length &&
    submitted.every((item, index) => item === expected[index])
    ? { status: "correct" }
    : { status: "incorrect" };
}

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

export function chooseDailyIds(
  date: string,
  gradeCourse: string,
  topicId: string,
  pools: Record<number, string[]>,
  seedContext = "",
): string[] {
  let seed = hashSeed(`${date}|${gradeCourse}|${topicId}|${seedContext}`);
  const ids: string[] = [];

  for (let difficulty = 1; difficulty <= 5; difficulty += 1) {
    const pool = pools[difficulty] ?? [];
    if (pool.length === 0) {
      throw new Error(`Missing question pool for difficulty ${difficulty}.`);
    }
    seed = nextRandom(seed);
    ids.push(pool[seed % pool.length]);
  }

  return ids;
}
