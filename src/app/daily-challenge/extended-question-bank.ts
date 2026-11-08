import "server-only";
import type { BankQuestion, QuestionFactory } from "./question-bank";
import type { AnswerRule } from "./domain";
import type { GradeCourse } from "./catalog";

type Difficulty = BankQuestion["difficulty"];

function createQuestion(
  makeQuestion: QuestionFactory,
  id: string,
  topicId: string,
  topic: string,
  course: GradeCourse,
  difficulty: Difficulty,
  subtopic: string,
  prompt: string,
  answer: AnswerRule,
  hint: string,
  steps: string[],
  instructions?: string,
): BankQuestion {
  return makeQuestion(
    id,
    topicId,
    topic,
    [course],
    difficulty,
    subtopic,
    prompt,
    answer,
    hint,
    steps,
    instructions,
  );
}

function wholeNumberQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "whole-number-operations";
  const topic = "Whole-number operations";
  const course: GradeCourse = "Arithmetic and Number Sense";
  const add = (
    difficulty: Difficulty,
    variant: string,
    prompt: string,
    answer: number,
    steps: string[],
  ) =>
    createQuestion(
      make,
      `whole-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty,
      [
        "Adding and subtracting",
        "Multiplying and dividing",
        "Using operation order",
        "Solving a story problem",
        "Reasoning backward",
      ][difficulty - 1],
      prompt,
      { type: "integer", canonical: String(answer) },
      "Write down the operation you need first, then check your arithmetic.",
      steps,
    );
  return [
    add(1, "a", "Find 38 + 27.", 65, ["Add the ones: 8 + 7 = 15.", "Regroup 1 ten and add the tens: 3 + 2 + 1 = 6.", "The sum is 65."]),
    add(1, "b", "Find 74 − 29.", 45, ["Regroup 74 as 6 tens and 14 ones.", "Subtract: 14 − 9 = 5 and 6 − 2 = 4.", "The difference is 45."]),
    add(2, "a", "Find 8 × 7 − 6.", 50, ["Multiply first: 8 × 7 = 56.", "Subtract 6: 56 − 6 = 50."]),
    add(2, "b", "Find 72 ÷ 8 + 19.", 28, ["Divide first: 72 ÷ 8 = 9.", "Add 19: 9 + 19 = 28."]),
    add(3, "a", "Find 6 × (14 − 8) + 5.", 41, ["Evaluate the parentheses: 14 − 8 = 6.", "Multiply: 6 × 6 = 36.", "Add 5 to get 41."]),
    add(3, "b", "Find 96 ÷ (4 × 3) + 17.", 25, ["Evaluate the parentheses: 4 × 3 = 12.", "Divide: 96 ÷ 12 = 8.", "Add 17 to get 25."]),
    add(4, "a", "A library has 8 shelves with 24 books on each. It lends out 37 books. How many books remain?", 155, ["There are 8 × 24 = 192 books before lending.", "Subtract the 37 lent books: 192 − 37 = 155."]),
    add(4, "b", "A school orders 6 boxes of 35 pencils and shares them equally among 7 classes. How many pencils does each class get?", 30, ["There are 6 × 35 = 210 pencils.", "Share equally: 210 ÷ 7 = 30 pencils per class."]),
    add(5, "a", "I multiply a number by 7, then subtract 12. The result is 58. What was the number?", 10, ["Undo subtracting 12: 58 + 12 = 70.", "Undo multiplying by 7: 70 ÷ 7 = 10.", "Check: 10 × 7 − 12 = 58."]),
    add(5, "b", "Four equal teams each receive 18 tokens, with 14 tokens left over. How many tokens were there at first?", 86, ["The teams received 4 × 18 = 72 tokens.", "Add the 14 left over: 72 + 14 = 86."]),
  ];
}

type ArithmeticProblem = {
  prompt: string;
  answer: number;
  subtopic: string;
  steps: string[];
};

function arithmeticQuestions(
  make: QuestionFactory,
  topicId: string,
  topic: string,
  hint: string,
  problems: ArithmeticProblem[],
): BankQuestion[] {
  const course: GradeCourse = "Arithmetic and Number Sense";
  return problems.map((problem, index) =>
    createQuestion(
      make,
      `arith-${topicId}-d${index + 1}`,
      topicId,
      topic,
      course,
      (index + 1) as Difficulty,
      problem.subtopic,
      problem.prompt,
      { type: "integer", canonical: String(problem.answer) },
      hint,
      problem.steps,
      "Enter a whole number.",
    ),
  );
}

function arithmeticTopicQuestions(make: QuestionFactory): BankQuestion[] {
  return [
    ...arithmeticQuestions(make, "place-value", "Place value", "Use the position of each digit to determine its value.", [
      { prompt: "In 4,582, what is the value of the digit 5?", answer: 500, subtopic: "Value of a digit", steps: ["The 5 is in the hundreds place.", "Its value is 5 hundreds, or 500."] },
      { prompt: "In 63,417, what digit is in the ten-thousands place?", answer: 6, subtopic: "Reading a place", steps: ["Starting at the right, the places are ones, tens, hundreds, thousands, and ten-thousands.", "The ten-thousands digit is 6."] },
      { prompt: "In 8,205, what is the value of the digit 2?", answer: 200, subtopic: "Place and value", steps: ["The digit 2 is in the hundreds place.", "2 hundreds equals 200."] },
      { prompt: "What number is made from 7 thousands, 3 hundreds, 0 tens, and 9 ones?", answer: 7309, subtopic: "Composing a number", steps: ["Write each place value: 7,000 + 300 + 0 + 9.", "Combine them to get 7,309."] },
      { prompt: "In 438,726, how much greater is the value of the digit 3 than the value of the digit 7?", answer: 29300, subtopic: "Compare digit values", steps: ["The 3 is in the ten-thousands place, so its value is 30,000.", "The 7 is in the hundreds place, so its value is 700.", "Subtract: 30,000 − 700 = 29,300."] },
    ]),
    ...arithmeticQuestions(make, "comparing-ordering-numbers", "Comparing and ordering numbers", "Compare digits from left to right, paying attention to place value.", [
      { prompt: "Which number is greater: 4,321 or 4,231? Enter the greater number.", answer: 4321, subtopic: "Compare two numbers", steps: ["Both numbers have 4 thousands.", "Compare the hundreds: 3 hundreds is greater than 2 hundreds.", "So 4,321 is greater."] },
      { prompt: "Which is the smallest: 6,105, 6,501, or 6,150? Enter that number.", answer: 6105, subtopic: "Find the least", steps: ["All three have 6 thousands.", "Their hundreds digits are 1, 5, and 1; compare the two with 1 hundred.", "At the tens place, 0 is less than 5, so 6,105 is smallest."] },
      { prompt: "Which is greatest: 28,904, 29,084, or 28,940? Enter that number.", answer: 29084, subtopic: "Compare across place values", steps: ["Compare the ten-thousands: all have 2.", "At the thousands place, 29,084 has 9 while the others have 8.", "Therefore 29,084 is greatest."] },
      { prompt: "How many of these numbers are strictly between 3,400 and 3,500: 3,420, 3,500, 3,399, 3,499?", answer: 2, subtopic: "Reason about an interval", steps: ["3,420 is greater than 3,400 and less than 3,500.", "3,499 also lies strictly between them.", "3,500 is an endpoint and 3,399 is below the interval, so the count is 2."] },
      { prompt: "Use each digit 0, 2, 4, 7, and 9 once to make the greatest possible five-digit number. What is it?", answer: 97420, subtopic: "Arrange digits strategically", steps: ["For the greatest number, place the largest digit in the highest place.", "Arrange the nonzero digits in descending order: 9, 7, 4, 2.", "Put 0 last to make 97,420."] },
    ]),
    ...arithmeticQuestions(make, "addition", "Addition", "Line up place values and regroup whenever a place totals ten or more.", [
      { prompt: "Find 248 + 137.", answer: 385, subtopic: "Add with regrouping", steps: ["Ones: 8 + 7 = 15; write 5 and carry 1 ten.", "Tens: 4 + 3 + 1 = 8; hundreds: 2 + 1 = 3.", "The sum is 385."] },
      { prompt: "Find 1,475 + 2,386.", answer: 3861, subtopic: "Add four-digit numbers", steps: ["Add by place: 5 + 6 = 11, then 7 + 8 + 1 = 16.", "Continue regrouping: 4 + 3 + 1 = 8 and 1 + 2 = 3.", "The sum is 3,861."] },
      { prompt: "Find 4,208 + 3,795 + 896.", answer: 8899, subtopic: "Add three addends", steps: ["First add 4,208 + 3,795 = 8,003.", "Then add 896: 8,003 + 800 = 8,803 and +96 = 8,899.", "The total is 8,899."] },
      { prompt: "A drive collects $1,285, $965, and $1,750. How many dollars are collected altogether?", answer: 4000, subtopic: "Addition in context", steps: ["Add the first two amounts: 1,285 + 965 = 2,250.", "Add the final amount: 2,250 + 1,750 = 4,000.", "The drive collects $4,000."] },
      { prompt: "A number plus 3,675 equals 8,200. What is the number?", answer: 4525, subtopic: "Find a missing addend", steps: ["Subtract the known addend from the sum: 8,200 − 3,675.", "Borrow across the zeroes: 8,200 − 3,000 = 5,200, then 5,200 − 675 = 4,525.", "The missing number is 4,525."] },
    ]),
    ...arithmeticQuestions(make, "subtraction", "Subtraction", "Subtract by place value; regroup from the next place when a digit is too small.", [
      { prompt: "Find 603 − 278.", answer: 325, subtopic: "Regroup across a zero", steps: ["Regroup 603 as 5 hundreds, 9 tens, and 13 ones.", "Subtract ones and tens: 13 − 8 = 5 and 9 − 7 = 2.", "Subtract hundreds: 5 − 2 = 3, so the difference is 325."] },
      { prompt: "Find 5,000 − 1,847.", answer: 3153, subtopic: "Subtract across zeroes", steps: ["Regroup 5,000 as 4 thousands, 9 hundreds, 9 tens, and 10 ones.", "Subtract by place: 10 − 7 = 3, 9 − 4 = 5, and 9 − 8 = 1.", "The remaining thousands are 4 − 1 = 3; the answer is 3,153."] },
      { prompt: "Find 12,004 − 6,879.", answer: 5125, subtopic: "Multi-place regrouping", steps: ["Regroup to subtract the ones: 14 − 9 = 5.", "After regrouping across the zeroes, subtract tens and hundreds: 9 − 7 = 2 and 9 − 8 = 1.", "Subtract thousands: 11 − 6 = 5; the difference is 5,125."] },
      { prompt: "A store has 4,200 notebooks and sells 1,375, then 986 more. How many remain?", answer: 1839, subtopic: "Two-step subtraction", steps: ["After the first sale: 4,200 − 1,375 = 2,825.", "Subtract the second sale: 2,825 − 986 = 1,839.", "There are 1,839 notebooks remaining."] },
      { prompt: "The difference between 10,000 and a number is 6,458. What is the number?", answer: 3542, subtopic: "Reason backward", steps: ["Write the relationship as 10,000 − n = 6,458.", "The missing subtrahend is 10,000 − 6,458.", "So n = 3,542; checking gives 10,000 − 3,542 = 6,458."] },
    ]),
    ...arithmeticQuestions(make, "multiplication", "Multiplication", "Break the multiplication into place-value parts, then combine the partial products.", [
      { prompt: "Find 7 × 8.", answer: 56, subtopic: "Multiplication fact", steps: ["Seven groups of 8 can be counted as 8 + 8 + 8 + 8 + 8 + 8 + 8.", "The total is 56."] },
      { prompt: "Find 24 × 13.", answer: 312, subtopic: "Multiply by tens and ones", steps: ["Split 13 into 10 + 3.", "24 × 10 = 240 and 24 × 3 = 72.", "Add 240 + 72 = 312."] },
      { prompt: "Find 306 × 24.", answer: 7344, subtopic: "Partial products", steps: ["Split 24 into 20 + 4.", "306 × 20 = 6,120 and 306 × 4 = 1,224.", "Add the partial products: 6,120 + 1,224 = 7,344."] },
      { prompt: "A school orders 28 boxes with 36 markers in each box. How many markers are there?", answer: 1008, subtopic: "Multiplication in context", steps: ["Calculate 28 × 36 by splitting 36 into 30 + 6.", "28 × 30 = 840 and 28 × 6 = 168.", "840 + 168 = 1,008 markers."] },
      { prompt: "Find 125 × 48 using a useful place-value decomposition.", answer: 6000, subtopic: "Choose an efficient strategy", steps: ["Rewrite 48 as 50 − 2.", "125 × 50 = 6,250 and 125 × 2 = 250.", "Subtract: 6,250 − 250 = 6,000."] },
    ]),
    ...arithmeticQuestions(make, "division", "Division", "Use multiplication to check each quotient; include a remainder only if the question asks for it.", [
      { prompt: "Find 56 ÷ 7.", answer: 8, subtopic: "Division fact", steps: ["Ask how many groups of 7 make 56.", "Since 7 × 8 = 56, the quotient is 8."] },
      { prompt: "Find 156 ÷ 12.", answer: 13, subtopic: "Two-digit divisor", steps: ["12 × 10 = 120, leaving 36.", "12 × 3 = 36.", "The quotient is 10 + 3 = 13."] },
      { prompt: "Find 936 ÷ 24.", answer: 39, subtopic: "Use compatible products", steps: ["24 × 40 = 960.", "Subtract one group of 24: 960 − 24 = 936.", "Therefore 936 ÷ 24 = 39."] },
      { prompt: "A warehouse packs 1,728 cubes equally into boxes of 24. How many full boxes can it pack?", answer: 72, subtopic: "Division in context", steps: ["24 × 70 = 1,680.", "There are 1,728 − 1,680 = 48 cubes left.", "48 is 2 more groups of 24, so 70 + 2 = 72 boxes."] },
      { prompt: "Find the quotient of 2,457 ÷ 18, not including any remainder.", answer: 136, subtopic: "Quotient and remainder", steps: ["18 × 100 = 1,800, leaving 657.", "18 × 30 = 540, leaving 117; 18 × 6 = 108, leaving 9.", "The quotient is 100 + 30 + 6 = 136, with remainder 9."] },
    ]),
    ...arithmeticQuestions(make, "order-of-operations", "Order of operations", "Evaluate parentheses first, then exponents, multiplication or division, and addition or subtraction.", [
      { prompt: "Find 6 + 3 × 4.", answer: 18, subtopic: "Multiplication before addition", steps: ["Multiply first: 3 × 4 = 12.", "Add 6: 6 + 12 = 18."] },
      { prompt: "Find (24 − 8) ÷ 4 + 5.", answer: 9, subtopic: "Parentheses and division", steps: ["Evaluate parentheses: 24 − 8 = 16.", "Divide: 16 ÷ 4 = 4.", "Add 5 to get 9."] },
      { prompt: "Find 48 ÷ (2 × 3) + 7 × 2.", answer: 22, subtopic: "Multiple operation groups", steps: ["Evaluate parentheses: 2 × 3 = 6.", "Perform division and multiplication: 48 ÷ 6 = 8 and 7 × 2 = 14.", "Add: 8 + 14 = 22."] },
      { prompt: "Find 3 × (18 − 6) ÷ 4 + 5.", answer: 14, subtopic: "Left-to-right operations", steps: ["Parentheses: 18 − 6 = 12; then 3 × 12 = 36.", "Multiply and divide from left to right: 36 ÷ 4 = 9.", "Add 5 to get 14."] },
      { prompt: "Find 120 ÷ [3 × (7 − 2)] + 4².", answer: 24, subtopic: "Nested grouping and exponents", steps: ["Innermost parentheses: 7 − 2 = 5, so 3 × 5 = 15.", "Calculate 120 ÷ 15 = 8 and 4² = 16.", "Add 8 + 16 = 24."] },
    ]),
    ...arithmeticQuestions(make, "rounding-estimation", "Rounding and estimation", "Look at the digit immediately to the right of the place being rounded.", [
      { prompt: "Round 347 to the nearest ten.", answer: 350, subtopic: "Round to tens", steps: ["The tens digit is 4 and the ones digit is 7.", "Since 7 is at least 5, increase the tens digit by 1.", "347 rounds to 350."] },
      { prompt: "Round 5,682 to the nearest hundred.", answer: 5700, subtopic: "Round to hundreds", steps: ["The hundreds digit is 6 and the tens digit is 8.", "Since 8 is at least 5, round the hundreds digit up.", "5,682 rounds to 5,700."] },
      { prompt: "Estimate 398 + 602 by rounding each addend to the nearest hundred. What is the estimate?", answer: 1000, subtopic: "Estimate a sum", steps: ["398 rounds to 400.", "602 rounds to 600.", "The estimated sum is 400 + 600 = 1,000."] },
      { prompt: "Estimate 2,048 + 1,967 by rounding each addend to the nearest thousand.", answer: 4000, subtopic: "Estimate with larger numbers", steps: ["2,048 rounds to 2,000.", "1,967 rounds to 2,000.", "The estimate is 2,000 + 2,000 = 4,000."] },
      { prompt: "Using the usual rule that 5 rounds up, what is the smallest whole number that rounds to 24,000 to the nearest thousand?", answer: 23500, subtopic: "Reason about rounding intervals", steps: ["Numbers from 23,500 through 24,499 round to 24,000 to the nearest thousand.", "The lower endpoint, 23,500, rounds up to 24,000.", "So the smallest whole number is 23,500."] },
    ]),
    ...arithmeticQuestions(make, "factors-multiples", "Factors and multiples", "Use multiplication pairs to identify factors and repeated addition or multiplication to find multiples.", [
      { prompt: "What is the smallest positive factor of 18 that is greater than 1?", answer: 2, subtopic: "Find a factor", steps: ["A factor divides 18 with no remainder.", "2 divides 18 because 2 × 9 = 18, and no positive whole number greater than 1 is smaller than 2."] },
      { prompt: "What is the next multiple of 7 after 35?", answer: 42, subtopic: "Continue a multiple pattern", steps: ["Multiples of 7 increase by 7.", "35 + 7 = 42, so the next multiple is 42."] },
      { prompt: "How many positive common factors do 18 and 30 have?", answer: 4, subtopic: "Common factors", steps: ["The positive factors of 18 are 1, 2, 3, 6, 9, 18.", "The positive factors of 30 include 1, 2, 3, 5, 6, 10, 15, 30.", "The common factors are 1, 2, 3, and 6: four factors."] },
      { prompt: "One bell rings every 6 minutes and another every 8 minutes. If they ring together now, after how many minutes will they next ring together?", answer: 24, subtopic: "Least common multiple", steps: ["List multiples of 6: 6, 12, 18, 24, …", "List multiples of 8: 8, 16, 24, …", "The first shared positive multiple is 24 minutes."] },
      { prompt: "How many positive common factors do 48 and 72 have?", answer: 8, subtopic: "Reason with factor pairs", steps: ["The greatest common factor of 48 and 72 is 24.", "The positive factors of 24 are 1, 2, 3, 4, 6, 8, 12, and 24.", "Each divides both numbers, giving 8 common factors."] },
    ]),
    ...arithmeticQuestions(make, "prime-numbers", "Prime numbers", "A prime number has exactly two positive factors: 1 and itself.", [
      { prompt: "How many positive factors does the prime number 13 have?", answer: 2, subtopic: "Prime factor count", steps: ["The positive factors of 13 are 1 and 13.", "There are exactly 2 positive factors."] },
      { prompt: "What is the smallest prime factor of 51?", answer: 3, subtopic: "Find a prime factor", steps: ["51 is not even, so 2 is not a factor.", "Its digits sum to 5 + 1 = 6, so it is divisible by 3.", "51 ÷ 3 = 17, so the smallest prime factor is 3."] },
      { prompt: "How many of these numbers are prime: 21, 29, 39, and 41?", answer: 2, subtopic: "Classify a set of numbers", steps: ["21 and 39 are divisible by 3, so they are composite.", "29 is not divisible by 2, 3, or 5; 41 is not divisible by 2, 3, or 5.", "Both 29 and 41 are prime, so the count is 2."] },
      { prompt: "How many prime numbers are there from 30 through 40, inclusive?", answer: 2, subtopic: "Check a range", steps: ["The even numbers in the range are composite; 33 and 39 are divisible by 3; 35 is divisible by 5.", "The remaining candidates are 31 and 37.", "Both have no prime divisor up to their square root, so there are 2 primes."] },
      { prompt: "What is the largest prime factor of 84?", answer: 7, subtopic: "Prime factorization", steps: ["Factor 84: 84 = 2 × 42 = 2 × 2 × 21.", "Continue: 21 = 3 × 7, so 84 = 2² × 3 × 7.", "The largest prime factor is 7."] },
    ]),
  ];
}

function ratioQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "ratio-proportions";
  const topic = "Ratios and proportions";
  const course: GradeCourse = "Ratios and Proportional Reasoning";
  const data = [
    [1, "a", 2, 3, 9, "second", "A recipe uses 2 cups of rice for 3 people. At the same rate, how many cups are needed for 9 people?"],
    [1, "b", 3, 4, 9, "first", "A map uses 3 cm for every 4 km. At the same scale, how many kilometers does 9 cm represent?"],
    [2, "a", 5, 2, 14, "second", "A machine makes 5 parts in 2 minutes. At the same rate, how many parts does it make in 14 minutes?"],
    [2, "b", 4, 3, 20, "first", "Four meters of fabric cost $3. At the same rate, what is the cost of 20 meters?"],
    [3, "a", 6, 5, 42, "first", "A drawing uses 6 cm for every 5 m. What real length in meters is represented by 42 cm?"],
    [3, "b", 7, 4, 20, "second", "A runner covers 7 km in 4 days at a steady daily distance. How many kilometers in 20 days?"],
    [4, "a", 3, 5, 40, "second", "A school has 3 science kits for every 5 students. How many kits are needed for 40 students to keep the same ratio?"],
    [4, "b", 8, 3, 15, "second", "A paint mix uses 8 cups of blue for every 3 cups of white. How many cups of blue match 15 cups of white?"],
    [5, "a", 5, 8, 35, "first", "A map scale is 5 cm for 8 km. A route is 35 cm on the map. How long is the route in kilometers?"],
    [5, "b", 9, 4, 28, "second", "A team scores 9 points in 4 rounds at a constant rate. How many points would it score in 28 rounds?"],
  ] as const;
  return data.map(
    ([difficulty, variant, rateA, rateB, input, inputSide, prompt]) => {
    const scaleFactor = input / (inputSide === "first" ? rateA : rateB);
    const answer =
      inputSide === "first"
        ? (rateB * input) / rateA
        : (rateA * input) / rateB;
    return createQuestion(
      make,
      `ratio-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty,
      "Proportional reasoning",
      prompt,
      { type: "integer", canonical: String(answer) },
      "Set up an equivalent ratio, then solve for the missing amount.",
      [
        `The given rate is ${rateA} for every ${rateB}.`,
        `Write an equivalent ratio with ${input} in the matching position.`,
        `Scale both parts by ${scaleFactor}; the missing amount is ${answer}.`,
      ],
    );
    },
  );
}

function geometryQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "pythagorean-theorem";
  const topic = "The Pythagorean theorem";
  const course: GradeCourse = "Geometry";
  const data = [
    [1, "a", 3, 4, 5, "A right triangle has legs 3 and 4 units long. Find the hypotenuse."],
    [1, "b", 5, 12, 13, "A right triangle has legs 5 and 12 units long. Find the hypotenuse."],
    [2, "a", 8, 15, 17, "A right triangle has legs 8 and 15 units long. Find the hypotenuse."],
    [2, "b", 7, 24, 25, "A right triangle has legs 7 and 24 units long. Find the hypotenuse."],
    [3, "a", 5, 13, 12, "A right triangle has a hypotenuse of 13 and one leg of 5. Find the other leg."],
    [3, "b", 9, 15, 12, "A right triangle has a hypotenuse of 15 and one leg of 9. Find the other leg."],
    [4, "a", 6, 10, 8, "A 10-foot ladder rests against a wall. Its base is 6 feet from the wall. How high up the wall does it reach?"],
    [4, "b", 8, 17, 15, "A rectangular garden is 8 meters wide and has a 17-meter diagonal. Find its length."],
    [5, "a", 12, 20, 16, "A right triangular sign has a 20-inch hypotenuse and one 12-inch leg. Find the other leg."],
    [5, "b", 15, 25, 20, "A rectangular court has a 25-meter diagonal and a 15-meter side. Find the other side."],
  ] as const;
  return data.map(([difficulty, variant, first, second, answer, prompt]) =>
    createQuestion(
      make,
      `geometry-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty,
      difficulty <= 2 ? "Finding a hypotenuse" : "Finding a missing leg",
      prompt,
      { type: "integer", canonical: String(answer) },
      "Use a² + b² = c², where c is the hypotenuse.",
      difficulty <= 2
        ? [
            `Substitute the legs: ${first}² + ${second}² = c².`,
            `Add the squares: ${first * first} + ${second * second} = ${first * first + second * second}.`,
            `Take the positive square root: c = ${answer}.`,
          ]
        : [
            `The missing leg squared is ${second}² − ${first}².`,
            `Subtract the squares: ${second * second} − ${first * first} = ${answer * answer}.`,
            `Take the positive square root: the missing leg is ${answer}.`,
          ],
    ),
  );
}

function quadraticQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "quadratic-equations";
  const topic = "Quadratic equations";
  const course: GradeCourse = "Algebra 2";
  const rootsByDifficulty = [
    [[2, 3], [1, 5]],
    [[-2, 4], [-3, 2]],
    [[-4, -1], [3, 6]],
    [[-8, 5], [-8, 3]],
    [[-6, 5], [-4, 3]],
  ] as const;
  return rootsByDifficulty.flatMap((variants, difficultyIndex) =>
    variants.map(([first, second], variantIndex) => {
      const difficulty = (difficultyIndex + 1) as Difficulty;
      const variant = variantIndex === 0 ? "a" : "b";
      const sum = first + second;
      const product = first * second;
      const isRectangleStory = difficulty === 4;
      const isScaledExtension = difficulty === 5 && variantIndex === 1;
      const signedTerm = sum < 0 ? ` + ${-sum}x` : ` − ${sum}x`;
      const signedConstant = product < 0 ? ` − ${-product}` : ` + ${product}`;
      const prompt =
        isRectangleStory
          ? variant === "a"
            ? "A rectangle has side lengths x and x + 3 units and an area of 40 square units. Find the positive value of x."
            : "A rectangle has side lengths x and x + 5 units and an area of 24 square units. Find the positive value of x."
          : isScaledExtension
            ? "Solve 2x² + 2x − 24 = 0."
            : difficulty === 1
          ? `Solve (x ${first < 0 ? `+ ${-first}` : `− ${first}`})(x ${second < 0 ? `+ ${-second}` : `− ${second}`}) = 0.`
          : `Solve x²${signedTerm}${signedConstant} = 0.`;
      const rectangleSteps = [
        variant === "a"
          ? "Write the area equation: x(x + 3) = 40."
          : "Write the area equation: x(x + 5) = 24.",
        `Rearrange and factor: (x ${first < 0 ? `+ ${-first}` : `− ${first}`})(x ${second < 0 ? `+ ${-second}` : `− ${second}`}) = 0.`,
        `The roots are ${first} and ${second}; only the positive side length is valid, so x = ${Math.max(first, second)}.`,
      ];
      return createQuestion(
        make,
        `quadratic-d${difficulty}-${variant}`,
        topicId,
        topic,
        course,
        difficulty,
        difficulty <= 2 ? "Factoring quadratics" : "Using the zero-product property",
        prompt,
        isRectangleStory
          ? { type: "integer", canonical: String(Math.max(first, second)) }
          : {
              type: "unordered-integer-set",
              canonical: [String(first), String(second)],
            },
        "Set each factor equal to zero, or find two numbers with the required sum and product.",
        isRectangleStory
          ? rectangleSteps
          : isScaledExtension
            ? [
                "Factor out 2: 2(x² + x − 12) = 0.",
                "Factor the trinomial: 2(x + 4)(x − 3) = 0.",
                "Set each factor to zero: x = −4 or x = 3.",
              ]
            : [
                `Factor the quadratic as (x ${first < 0 ? `+ ${-first}` : `− ${first}`})(x ${second < 0 ? `+ ${-second}` : `− ${second}`}) = 0.`,
                `Set each factor to zero: x = ${first} or x = ${second}.`,
                `The solution set is {${first}, ${second}}.`,
              ],
        isRectangleStory
          ? "Enter the positive whole-number side length."
          : "Enter both integer solutions separated by a comma, such as {2, -3}. Order does not matter.",
      );
    }),
  );
}

function trigonometryQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "trigonometry-special-angles";
  const topic = "Trigonometric ratios and special angles";
  const courses: GradeCourse[] = ["Trigonometry", "Precalculus"];
  const data = [
    [1, "a", "sin 30°", "1/2", "Use the unit-circle value for sine at 30°."],
    [1, "b", "cos 60°", "1/2", "Use the unit-circle value for cosine at 60°."],
    [2, "a", "tan 45°", "1", "Tangent is sine divided by cosine; at 45° the two values match."],
    [2, "b", "sin 90°", "1", "Locate 90° on the unit circle and read its y-coordinate."],
    [3, "a", "cos 180°", "-1", "Locate 180° on the unit circle and read its x-coordinate."],
    [3, "b", "sin 270°", "-1", "Locate 270° on the unit circle and read its y-coordinate."],
    [4, "a", "sin 30° + cos 60°", "1", "Evaluate both special-angle ratios before adding."],
    [4, "b", "sin 90° − cos 180°", "2", "Evaluate both unit-circle values, then subtract."],
    [5, "a", "If θ is acute and sin θ = 3/5, find cos θ.", "4/5", "Use sin² θ + cos² θ = 1 and choose the positive value because θ is acute."],
    [5, "b", "If θ is acute and tan θ = 3/4, find sin θ.", "3/5", "Draw a right triangle with opposite 3 and adjacent 4, then find its hypotenuse."],
  ] as const;
  return data.map(([difficulty, variant, prompt, answer, hint]) => {
    const steps =
      difficulty === 5 && variant === "a"
        ? ["Use sin² θ + cos² θ = 1.", ["(3/5)² + cos² θ = 1.", "cos² θ = 16/25."].join(" "), "Since θ is acute, cos θ is positive, so cos θ = 4/5."]
        : difficulty === 5
          ? ["Draw a right triangle with opposite side 3 and adjacent side 4.", "The hypotenuse is √(3² + 4²) = 5.", "Therefore sin θ = opposite/hypotenuse = 3/5."]
          : [`Use the special-angle value: ${prompt}.`, `Substitute the known exact value${difficulty >= 4 ? "s" : ""}.`, `The result is ${answer}.`];
    return make(
      `trig-d${difficulty}-${variant}`,
      topicId,
      topic,
      courses,
      difficulty as Difficulty,
      difficulty >= 4 ? "Combining exact trigonometric values" : "Special-angle values",
      prompt,
      {
        type: "fraction",
        canonical: answer,
        acceptDecimal: difficulty === 1 && variant === "a",
      },
      hint,
      steps,
      difficulty === 1 && variant === "a"
        ? "Enter 1/2, an equivalent fraction, or the exact decimal 0.5."
        : "Enter an exact fraction or whole number; equivalent fractions are accepted.",
    );
  });
}

function derivativeQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "derivatives-at-a-point";
  const topic = "Derivatives at a point";
  const course: GradeCourse = "Calculus 1";
  const data = [
    [1, "a", 3, 1, 2, 0, 4],
    [1, "b", -2, 1, 5, 0, 3],
    [2, "a", 2, 2, 3, 1, 2],
    [2, "b", 4, 2, -1, 1, 3],
    [3, "a", 3, 3, -2, 2, 2],
    [3, "b", -2, 3, 5, 2, 3],
    [4, "a", 2, 4, -3, 2, 2],
    [4, "b", -1, 4, 4, 2, 3],
    [5, "a", 3, 5, -2, 3, 2],
    [5, "b", -2, 5, 3, 3, 2],
  ] as const;
  return data.map(([difficulty, variant, a, n, b, m, x]) => {
    const value = a * n * x ** (n - 1) + b * m * x ** (m - 1);
    const formatTerm = (coefficient: number, exponent: number) =>
      `${Math.abs(coefficient)}${exponent === 0 ? "" : exponent === 1 ? "x" : `x^${exponent}`}`;
    const formatPolynomial = (
      terms: Array<{ coefficient: number; exponent: number }>,
    ) =>
      terms
        .filter((term) => term.coefficient !== 0)
        .map((term, index) => {
            const sign =
              index === 0
                ? term.coefficient < 0
                  ? "−"
                  : ""
                : term.coefficient < 0
                  ? " − "
                  : " + ";
            return `${sign}${formatTerm(term.coefficient, term.exponent)}`;
          })
          .join("");
    const expression = formatPolynomial([
      { coefficient: a, exponent: n },
      { coefficient: b, exponent: m },
    ]);
    const derivative = formatPolynomial([
      { coefficient: a * n, exponent: n - 1 },
      { coefficient: b * m, exponent: m - 1 },
    ]);
    return createQuestion(
      make,
      `derivative-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty as Difficulty,
      difficulty <= 2 ? "Power rule" : "Combining polynomial terms",
      `If f(x) = ${expression}, find f′(${x}).`,
      { type: "integer", canonical: String(value) },
      "Apply the power rule to each term, then substitute the given x-value.",
      [
        `Differentiate term by term: f′(x) = ${derivative}.`,
        `Substitute x = ${x} into the derivative.`,
        `Evaluate to get f′(${x}) = ${value}.`,
      ],
    );
  });
}

function integralQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "definite-integrals";
  const topic = "Definite integrals";
  const course: GradeCourse = "Calculus 2";
  const data = [
    [1, "a", 1, 0, 3],
    [1, "b", 2, 0, 4],
    [2, "a", 2, 1, 2],
    [2, "b", 3, 1, 2],
    [3, "a", 3, 2, 2],
    [3, "b", 4, 2, 3],
    [4, "a", 4, 3, 2],
    [4, "b", 2, 3, 3],
    [5, "a", 5, 4, 2],
    [5, "b", 2, 4, 3],
  ] as const;
  return data.map(([difficulty, variant, coefficient, exponent, upper]) => {
    const numerator = coefficient * upper ** (exponent + 1);
    const denominator = exponent + 1;
    const divisor = (a: number, b: number): number =>
      b === 0 ? a : divisor(b, a % b);
    const common = divisor(numerator, denominator);
    const answerNumerator = numerator / common;
    const answerDenominator = denominator / common;
    const canonical =
      answerDenominator === 1
        ? String(answerNumerator)
        : `${answerNumerator}/${answerDenominator}`;
    const answer = { type: "fraction", canonical } as const;
    const term =
      exponent === 0
        ? String(coefficient)
        : `${coefficient}x${exponent > 1 ? `^${exponent}` : ""}`;
    return createQuestion(
      make,
      `integral-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty as Difficulty,
      "Evaluating a definite polynomial integral",
      `Evaluate ∫₀^${upper} ${term} dx.`,
      answer,
      "Find an antiderivative with the power rule, then evaluate the upper and lower bounds.",
      [
        `An antiderivative is ${coefficient}/${exponent + 1} x${exponent + 1 > 1 ? `^${exponent + 1}` : ""}.`,
        `Evaluate from 0 to ${upper}: ${coefficient} × ${upper}^${exponent + 1} / ${exponent + 1} = ${canonical}.`,
        `The definite integral is ${canonical}.`,
      ],
      "Give an exact fraction or whole number. Equivalent fractions are accepted.",
    );
  });
}

function partialDerivativeQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "partial-derivatives";
  const topic = "Partial derivatives";
  const course: GradeCourse = "Multivariable Calculus";
  const data = [
    [1, "a", 2, 2, 3, 1, 2],
    [1, "b", 3, 2, 2, 2, 1],
    [2, "a", 2, 3, 4, 1, 2],
    [2, "b", 3, 3, 2, 2, 1],
    [3, "a", 2, 4, 3, 2, 1],
    [3, "b", 3, 4, 2, 1, 2],
    [4, "a", 2, 5, 4, 1, 2],
    [4, "b", 3, 5, 2, 2, 1],
    [5, "a", 2, 6, 5, 2, 1],
    [5, "b", 3, 6, 2, 1, 2],
  ] as const;
  return data.map(([difficulty, variant, a, m, b, x, y]) => {
    const value = a * m * x ** (m - 1) + b * y;
    return createQuestion(
      make,
      `partial-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty as Difficulty,
      "Evaluating a partial derivative",
      `For f(x, y) = ${a}x^${m} + ${b}xy + y², find ∂f/∂x at (${x}, ${y}).`,
      { type: "integer", canonical: String(value) },
      "When differentiating with respect to x, treat y as a constant.",
      [
        `Differentiate with respect to x: ∂f/∂x = ${a * m}x^${m - 1} + ${b}y.`,
        `Substitute x = ${x} and y = ${y}.`,
        `Evaluate to get ${value}.`,
      ],
      "Enter a whole number.",
    );
  });
}

function differentialEquationQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "differential-equations";
  const topic = "Separable differential equations";
  const course: GradeCourse = "Differential Equations";
  const data = [
    [1, "a", 2, 0, 3, 1],
    [1, "b", 4, 0, 2, 3],
    [2, "a", 2, 1, 2, 3],
    [2, "b", 6, 1, 2, 1],
    [3, "a", 3, 1, 2, 4],
    [3, "b", 4, 1, 3, 2],
    [4, "a", 2, 2, 3, 3],
    [4, "b", 6, 2, 2, 3],
    [5, "a", 4, 3, 2, 3],
    [5, "b", 8, 3, 2, 1],
  ] as const;
  return data.map(([difficulty, variant, coefficient, exponent, initial, x]) => {
    const change =
      (coefficient * x ** (exponent + 1)) / (exponent + 1);
    const answer = initial + change;
    return createQuestion(
      make,
      `ode-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty as Difficulty,
      "Solving an initial-value problem",
      `Solve dy/dx = ${coefficient}x^${exponent} with y(0) = ${initial}. Find y(${x}).`,
      { type: "integer", canonical: String(answer) },
      "Integrate both sides with respect to x, then use the initial condition.",
      [
        `Integrate: y = ${coefficient}/${exponent + 1} x^${exponent + 1} + C.`,
        `Use y(0) = ${initial}, so C = ${initial}.`,
        `Substitute x = ${x}: y(${x}) = ${initial} + ${change} = ${answer}.`,
      ],
      "Enter a whole number.",
    );
  });
}

function determinantQuestions(make: QuestionFactory): BankQuestion[] {
  const topicId = "matrix-determinants";
  const topic = "Matrix determinants";
  const course: GradeCourse = "Linear Algebra";
  const matrices = [
    [1, "a", [[2, 1], [3, 4]]],
    [1, "b", [[5, 2], [1, 3]]],
    [2, "a", [[4, 3], [2, 5]]],
    [2, "b", [[6, 1], [4, 2]]],
    [3, "a", [[1, 2, 0], [0, 3, 1], [2, 0, 4]]],
    [3, "b", [[2, 1, 0], [1, 3, 0], [0, 2, 4]]],
    [4, "a", [[2, 1, 3], [0, 4, 2], [1, 0, 5]]],
    [4, "b", [[3, 2, 1], [1, 4, 0], [2, 1, 3]]],
    [5, "a", [[4, 1, 2], [0, 3, 5], [2, 1, 6]]],
    [5, "b", [[2, 3, 1], [4, 1, 0], [1, 2, 5]]],
  ] as const;
  return matrices.map(([difficulty, variant, matrix]) => {
    const determinant =
      matrix.length === 2
        ? matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
        : matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
          - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
          + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    const rows = matrix.map((row) => `[${row.join(", ")}]`).join(", ");
    const steps =
      matrix.length === 2
        ? [
            `Use ad − bc for the matrix [${rows}].`,
            `${matrix[0][0]} × ${matrix[1][1]} − ${matrix[0][1]} × ${matrix[1][0]} = ${determinant}.`,
          ]
        : [
            "Expand along the first row using the cofactor signs +, −, +.",
            `The three signed minor terms combine to ${determinant}.`,
            `The determinant is ${determinant}.`,
          ];
    return createQuestion(
      make,
      `matrix-d${difficulty}-${variant}`,
      topicId,
      topic,
      course,
      difficulty as Difficulty,
      matrix.length === 2 ? "Determinant of a 2 × 2 matrix" : "Cofactor expansion",
      `Find the determinant of [${rows}].`,
      { type: "integer", canonical: String(determinant) },
      "For a 2 × 2 matrix use ad − bc; for a 3 × 3 matrix, expand by cofactors.",
      steps,
      "Enter a whole number.",
    );
  });
}

export function createExtendedQuestionBank(
  make: QuestionFactory,
): BankQuestion[] {
  return [
    ...arithmeticTopicQuestions(make),
    ...wholeNumberQuestions(make),
    ...ratioQuestions(make),
    ...geometryQuestions(make),
    ...quadraticQuestions(make),
    ...trigonometryQuestions(make),
    ...derivativeQuestions(make),
    ...integralQuestions(make),
    ...partialDerivativeQuestions(make),
    ...differentialEquationQuestions(make),
    ...determinantQuestions(make),
  ];
}
