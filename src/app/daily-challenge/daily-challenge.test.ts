import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  challengeTopics,
  courseCatalog,
  gradeCourses,
  getTopicDisplayName,
  getTopicsForGrade,
} from "./catalog";
import { checkAnswer, chooseDailyIds } from "./domain";
import {
  emptyProgress,
  parseProgress,
  progressVersion,
  sessionKey,
} from "./progress";
import { getStreaks, localDateKey } from "./streaks";
import { question, questionBank } from "./question-bank";
import {
  createQuestionService,
  getQuestionService,
} from "./question-service/service";
import { getGeneratedTemplateQuestions } from "./question-service/templates";
import type {
  QuestionRecord,
  QuestionRepository,
} from "./question-service/repository";

describe("daily challenge catalog and question bank", () => {
  it("lists all curriculum courses and their requested topics", () => {
    assert.equal(gradeCourses.length, 14);
    assert.equal(courseCatalog.length, 14);
    assert.equal(courseCatalog[0].id, "arithmetic-number-sense");
    assert.equal(challengeTopics.length, 154);
    assert.equal(questionBank.length, 180);

    const trig = getTopicsForGrade("Trigonometry").find(
      (topic) => topic.id === "trigonometry-special-angles",
    );
    const precalculus = getTopicsForGrade("Precalculus").find(
      (topic) => topic.id === "trigonometry-special-angles",
    );
    assert.ok(trig);
    assert.equal(precalculus?.id, trig.id);
    assert.ok(trig.courseIds.includes("trigonometry"));
    assert.ok(trig.courseIds.includes("precalculus"));
    assert.equal(getTopicDisplayName(trig, "Trigonometry"), "Trigonometric ratios");
    assert.equal(getTopicDisplayName(trig, "Precalculus"), "Trigonometric functions");
    assert.ok(
      questionBank
        .filter((question) => question.topicId === trig.id)
        .every((question) =>
          question.gradeCourses.includes("Trigonometry") &&
          question.gradeCourses.includes("Precalculus"),
        ),
    );
  });

  it("completes every Arithmetic topic with one question at each difficulty", () => {
    const arithmeticTopics = getTopicsForGrade("Arithmetic and Number Sense");
    assert.equal(arithmeticTopics.length, 11);
    const arithmeticCurriculumTopics = arithmeticTopics.filter(
      (topic) => topic.id !== "whole-number-operations",
    );
    assert.equal(arithmeticCurriculumTopics.length, 10);
    for (const topic of arithmeticCurriculumTopics) {
      const questions = questionBank.filter(
        (question) =>
          question.topicId === topic.id &&
          question.gradeCourses.includes("Arithmetic and Number Sense"),
      );
      assert.equal(questions.length, 5, topic.id);
      assert.deepEqual(
        questions.map((question) => question.difficulty).sort(),
        [1, 2, 3, 4, 5],
        topic.id,
      );
    }

    const coverage = getQuestionService().getCoverage();
    const arithmetic = coverage.find(
      (course) => course.name === "Arithmetic and Number Sense",
    );
    assert.deepEqual(
      arithmetic && {
        total: arithmetic.totalTopics,
        ready: arithmetic.readyTopics,
        remaining: arithmetic.remainingTopics,
      },
      { total: 11, ready: 11, remaining: 0 },
    );
  });

  it("derives topic readiness from complete, verifiable question levels", () => {
    const identities = questionBank.map(
      (question) => `${question.id}@${question.version}`,
    );
    assert.equal(new Set(identities).size, identities.length);
    const draft = question(
      "draft-check",
      "addition",
      "Addition",
      ["Arithmetic and Number Sense"],
      1,
      "Draft",
      "Find 1 + 1.",
      { type: "integer", canonical: "2" },
      "Add the numbers.",
      ["1 + 1 = 2.", "The answer is 2."],
    );
    assert.equal(draft.publicationStatus, "draft");
    assert.equal(draft.reviewStatus, "unreviewed");

    for (const question of questionBank) {
      assert.equal(question.publicationStatus, "published");
      assert.equal(question.reviewStatus, "mathematically-reviewed");
      const canonical =
        question.answer.type === "unordered-integer-set"
          ? `{${question.answer.canonical.join(", ")}}`
          : question.answer.canonical;
      assert.deepEqual(checkAnswer(question.answer, canonical), {
        status: "correct",
      });
      assert.ok(question.hint.trim());
      assert.ok(question.solutionSteps.length >= 2);
      assert.ok(question.solutionSteps.every((step) => step.trim()));
    }

    const service = getQuestionService();
    const coverage = service.getCoverage();
    assert.deepEqual(
      coverage.map((course) => [
        course.name,
        course.totalTopics,
        course.readyTopics,
        course.remainingTopics,
      ]),
      [
        ["Arithmetic and Number Sense", 11, 11, 0],
        ["Fractions, Decimals, and Percentages", 8, 1, 7],
        ["Ratios and Proportional Reasoning", 8, 1, 7],
        ["Pre-Algebra", 10, 1, 9],
        ["Algebra 1", 13, 2, 11],
        ["Geometry", 14, 1, 13],
        ["Algebra 2", 12, 1, 11],
        ["Trigonometry", 9, 1, 8],
        ["Precalculus", 12, 1, 11],
        ["Calculus 1", 12, 1, 11],
        ["Calculus 2", 14, 1, 13],
        ["Multivariable Calculus", 13, 1, 12],
        ["Differential Equations", 9, 1, 8],
        ["Linear Algebra", 13, 1, 12],
      ],
    );
    const readyTopicIdsByCourse = Object.fromEntries(
      coverage.map((course) => [
        course.id,
        service
          .listTopics(course.id)
          .filter((topic) => topic.ready)
          .map((topic) => topic.id),
      ]),
    );
    assert.deepEqual(readyTopicIdsByCourse, {
      "arithmetic-number-sense": [
        "place-value",
        "comparing-ordering-numbers",
        "addition",
        "subtraction",
        "multiplication",
        "division",
        "order-of-operations",
        "rounding-estimation",
        "factors-multiples",
        "prime-numbers",
        "whole-number-operations",
      ],
      "fractions-decimals-percentages": ["fraction-operations"],
      "ratios-proportional-reasoning": ["ratio-proportions"],
      "pre-algebra": ["linear-equations"],
      "algebra-1": ["linear-equations", "evaluating-functions"],
      geometry: ["pythagorean-theorem"],
      "algebra-2": ["quadratic-equations"],
      trigonometry: ["trigonometry-special-angles"],
      precalculus: ["trigonometry-special-angles"],
      "calculus-1": ["derivatives-at-a-point"],
      "calculus-2": ["definite-integrals"],
      "multivariable-calculus": ["partial-derivatives"],
      "differential-equations": ["differential-equations"],
      "linear-algebra": ["matrix-determinants"],
    });
    for (const course of coverage) {
      const topics = getTopicsForGrade(course.name);
      const readyIds = service
        .listTopics(course.id)
        .filter((topic) => topic.ready)
        .map((topic) => topic.id);
      assert.equal(readyIds.length, course.readyTopics, course.name);
      assert.equal(
        course.remainingTopics,
        topics.length - readyIds.length,
        course.name,
      );
      for (const topicId of readyIds) {
        for (let difficulty = 1; difficulty <= 5; difficulty += 1) {
          assert.ok(
            questionBank.some(
              (question) =>
                question.topicId === topicId &&
                question.difficulty === difficulty &&
                question.gradeCourses.includes(course.name),
            ),
            `${course.name}: ${topicId} difficulty ${difficulty}`,
          );
        }
      }
    }
  });

  it("selects the same five level-ordered questions for the same local date", () => {
    const pools = Object.fromEntries(
      Array.from({ length: 5 }, (_, index) => {
        const difficulty = index + 1;
        return [
          difficulty,
          questionBank
            .filter(
              (question) =>
                question.topicId === "trigonometry-special-angles" &&
                question.difficulty === difficulty,
            )
            .map((question) => question.id),
        ];
      }),
    );
    const first = chooseDailyIds(
      "2026-03-31",
      "Trigonometry",
      "trigonometry-special-angles",
      pools,
    );
    assert.deepEqual(
      chooseDailyIds(
        "2026-03-31",
        "Trigonometry",
        "trigonometry-special-angles",
        pools,
      ),
      first,
    );
    assert.deepEqual(
      first.map((id) => questionBank.find((item) => item.id === id)?.difficulty),
      [1, 2, 3, 4, 5],
    );
  });

  it("serves five questions only for complete topics", async () => {
    const service = getQuestionService();
    const readySet = service.createDailyChallenge(
      "2026-11-07",
      "America/Los_Angeles",
      "arithmetic-number-sense",
      "addition",
    );
    assert.equal(readySet?.questions.length, 5);
    assert.deepEqual(
      readySet?.questions.map((item) => item.difficulty),
      [1, 2, 3, 4, 5],
    );
    assert.deepEqual(
      service.createDailyChallenge(
        "2026-11-07",
        "America/Los_Angeles",
        "fractions-decimals-percentages",
        "equivalent-fractions",
      ),
      undefined,
    );
  });

  it("creates deterministic, unique five-level snapshots and restores saved snapshots", () => {
    const service = getQuestionService();
    const date = "2026-11-07";
    const timeZone = "America/Los_Angeles";
    const snapshot = service.createDailyChallenge(
      date,
      timeZone,
      "arithmetic-number-sense",
      "addition",
    );
    assert.ok(snapshot);
    assert.equal(snapshot.questions.length, 5);
    assert.equal(new Set(snapshot.questions.map((item) => item.id)).size, 5);
    assert.deepEqual(
      snapshot.questions.map((item) => item.difficulty),
      [1, 2, 3, 4, 5],
    );
    assert.deepEqual(
      service.createDailyChallenge(
        date,
        timeZone,
        "arithmetic-number-sense",
        "addition",
      ),
      snapshot,
    );

    const key = sessionKey(date, "Arithmetic and Number Sense", "addition");
    const stored = {
      ...emptyProgress(),
      challengeSnapshots: { [key]: snapshot },
    };
    const restored = parseProgress(JSON.stringify(stored));
    assert.equal(restored.recovered, false);
    assert.deepEqual(restored.progress.challengeSnapshots[key], snapshot);
  });

  it("keeps template answer data server-side while resolving checks and help by version", () => {
    const service = getQuestionService();
    let activeSnapshot:
      | ReturnType<typeof service.createDailyChallenge>
      | undefined;
    for (let day = 1; day <= 31 && !activeSnapshot?.questions.some(
      (item) => item.source === "template",
    ); day += 1) {
      activeSnapshot = service.createDailyChallenge(
        `2026-10-${String(day).padStart(2, "0")}`,
        "UTC",
        "arithmetic-number-sense",
        "addition",
      );
    }
    assert.ok(activeSnapshot);
    const templateQuestion = activeSnapshot.questions.find(
      (item) => item.source === "template",
    );
    assert.ok(templateQuestion);
    assert.ok(templateQuestion.templateId);
    assert.ok(templateQuestion.templateVersion);
    assert.equal("solution" in (templateQuestion.parameters ?? {}), false);
    assert.equal("quotient" in (templateQuestion.parameters ?? {}), false);
    assert.equal(templateQuestion.id.includes("solution-"), false);

    const internalQuestion = getGeneratedTemplateQuestions(
      question,
      {
        date: activeSnapshot.date,
        timeZone: activeSnapshot.timeZone,
        courseId: activeSnapshot.courseId,
        gradeCourse: activeSnapshot.gradeCourse,
        topicId: activeSnapshot.topicId,
      },
      { [templateQuestion.templateId]: templateQuestion.templateVersion },
    ).find((item) => item.id === templateQuestion.id);
    assert.ok(internalQuestion);
    assert.equal(internalQuestion.answer.type, "integer");
    if (internalQuestion.answer.type !== "integer") {
      throw new Error("Expected an integer answer.");
    }
    const locator = {
      date: activeSnapshot.date,
      timeZone: activeSnapshot.timeZone,
      courseId: activeSnapshot.courseId,
      gradeCourse: activeSnapshot.gradeCourse,
      topicId: activeSnapshot.topicId,
      question: templateQuestion,
    };
    assert.deepEqual(
      service.checkAnswer(locator, internalQuestion.answer.canonical),
      { status: "correct" },
    );
    assert.ok(service.getHint(locator));
    assert.ok(service.getSolution(locator)?.length);
  });

  it("keeps an active bank-question snapshot checkable when a newer version is added", () => {
    let records: QuestionRecord[] = questionBank.filter(
      (item) => item.topicId === "addition",
    );
    const repository: QuestionRepository = {
      listPublished(courseId, topicId) {
        return records.filter(
          (item) =>
            item.publicationStatus === "published" &&
            item.reviewStatus === "mathematically-reviewed" &&
            (!courseId || item.courseIds.includes(courseId)) &&
            (!topicId || item.topicId === topicId),
        );
      },
      findPublishedById(id, version) {
        return this.listPublished().find(
          (item) =>
            item.id === id &&
            (version === undefined || item.version === version),
        );
      },
      listTopicCoursePairs() {
        return [];
      },
      getDailyBankPool(courseId, _gradeCourse, topicId, difficulty) {
        return this.listPublished(courseId, topicId).filter(
          (item) => item.difficulty === difficulty,
        );
      },
    };
    const service = createQuestionService(repository);
    let activeSnapshot:
      | ReturnType<typeof service.createDailyChallenge>
      | undefined;
    for (let day = 1; day <= 31 && !activeSnapshot?.questions.some(
      (item) => item.source === "bank",
    ); day += 1) {
      activeSnapshot = service.createDailyChallenge(
        `2026-10-${String(day).padStart(2, "0")}`,
        "UTC",
        "arithmetic-number-sense",
        "addition",
      );
    }
    assert.ok(activeSnapshot);
    const bankQuestion = activeSnapshot.questions.find(
      (item) => item.source === "bank",
    );
    assert.ok(bankQuestion);
    const originalRecord = records.find(
      (item) => item.id === bankQuestion.id && item.version === bankQuestion.version,
    );
    assert.ok(originalRecord);
    assert.equal(originalRecord.answer.type, "integer");
    if (originalRecord.answer.type !== "integer") {
      throw new Error("Expected an integer answer.");
    }

    const changedRecord: QuestionRecord = {
      ...originalRecord,
      version: originalRecord.version + 1,
      prompt: "Updated content that is not part of the active snapshot.",
      answer: { ...originalRecord.answer, canonical: "0" },
    };
    records = [...records, changedRecord];

    const locator = {
      date: activeSnapshot.date,
      timeZone: activeSnapshot.timeZone,
      courseId: activeSnapshot.courseId,
      gradeCourse: activeSnapshot.gradeCourse,
      topicId: activeSnapshot.topicId,
      question: {
        id: bankQuestion.id,
        version: bankQuestion.version,
        difficulty: bankQuestion.difficulty,
        source: bankQuestion.source,
      },
    };
    assert.deepEqual(
      service.checkAnswer(locator, originalRecord.answer.canonical),
      { status: "correct" },
    );
    assert.notEqual(changedRecord.prompt, bankQuestion.prompt);
    assert.equal(
      service.getHint(locator),
      originalRecord.hint,
    );
  });

  it("generates valid fraction and linear-equation answers from constrained parameters", () => {
    const contexts = [
      {
        date: "2026-11-07",
        timeZone: "UTC",
        courseId: "arithmetic-number-sense" as const,
        gradeCourse: "Arithmetic and Number Sense" as const,
        topicId: "addition",
      },
      {
        date: "2026-11-07",
        timeZone: "UTC",
        courseId: "fractions-decimals-percentages" as const,
        gradeCourse: "Fractions, Decimals, and Percentages" as const,
        topicId: "fraction-operations",
      },
      {
        date: "2026-11-07",
        timeZone: "UTC",
        courseId: "pre-algebra" as const,
        gradeCourse: "Pre-Algebra" as const,
        topicId: "linear-equations",
      },
    ];
    const generated = contexts.flatMap((context) =>
      getGeneratedTemplateQuestions(question, context),
    );
    assert.equal(generated.length, 15);

    for (const context of contexts) {
      const questions = getGeneratedTemplateQuestions(question, context);
      assert.deepEqual(
        questions.map((item) => item.difficulty),
        [1, 2, 3, 4, 5],
      );
      assert.equal(new Set(questions.map((item) => item.id)).size, 5);
      for (const item of questions) {
        assert.ok(item.answer.type === "integer" || item.answer.type === "fraction");
        if (item.answer.type !== "integer" && item.answer.type !== "fraction") {
          continue;
        }
        assert.ok(item.hint.trim());
        assert.ok(item.solutionSteps.length >= 2);
        assert.deepEqual(checkAnswer(item.answer, item.answer.canonical), {
          status: "correct",
        });
        assert.equal(item.reviewStatus, "mathematically-reviewed");
        assert.equal(item.publicationStatus, "published");
      }
    }

    const equations = generated.filter(
      (item) => item.templateId === "linear-equation-one-variable",
    );
    for (const equation of equations) {
      assert.equal(equation.answer.type, "integer");
      if (equation.answer.type !== "integer") continue;
      const { parameters } = equation;
      const x = Number(equation.answer.canonical);
      assert.equal(x, parameters.solution);
      if (equation.difficulty === 1) {
        assert.equal(x + Number(parameters.constant), x + Number(parameters.constant));
      } else if (equation.difficulty === 2) {
        assert.equal(
          Number(parameters.coefficient) * x +
            Number(parameters.constant),
          Number(parameters.rightSide),
        );
      } else if (equation.difficulty === 3) {
        assert.equal(
          Number(parameters.coefficient) *
            (x + Number(parameters.shift)),
          Number(parameters.rightSide),
        );
      } else if (equation.difficulty === 4) {
        assert.notEqual(
          parameters.leftCoefficient,
          parameters.rightCoefficient,
        );
        assert.equal(
          Number(parameters.leftCoefficient) * x +
            Number(parameters.leftConstant),
          Number(parameters.rightCoefficient) * x +
            Number(parameters.rightConstant),
        );
      }
      if (equation.difficulty === 5) {
        assert.notEqual(
          parameters.coefficient,
          parameters.rightCoefficient,
        );
        assert.equal(
          Number(parameters.coefficient) *
              (x + Number(parameters.shift)) +
            Number(parameters.leftConstant),
          Number(parameters.rightCoefficient) * x +
            Number(parameters.rightConstant),
        );
      }
    }

    const additions = generated.filter(
      (item) => item.templateId === "integer-arithmetic",
    );
    for (const addition of additions) {
      assert.equal(addition.answer.type, "integer");
      if (addition.answer.type !== "integer") continue;
      const { first, second, third } = addition.parameters;
      const actual = Number(addition.answer.canonical);
      if (addition.difficulty === 1 || addition.difficulty === 2) {
        assert.equal(actual, Number(first) + Number(second));
      } else if (addition.difficulty === 3) {
        assert.equal(actual, Number(first) + Number(second) + Number(third));
      } else if (addition.difficulty === 4) {
        const groups = Number(third);
        assert.equal(
          actual,
          groups *
            (Number(first) / groups + Number(second) / groups),
        );
      } else {
        assert.equal(actual, Number(third) - Number(first) - Number(second));
      }
    }
  });

  it("uses verified proportional and integral answers in their prompts", () => {
    const answerFor = (id: string) => {
      const question = questionBank.find((item) => item.id === id);
      assert.ok(question);
      assert.equal(question.answer.type, "integer");
      if (question.answer.type !== "integer") {
        throw new Error(`Expected integer answer for ${id}.`);
      }
      return question.answer.canonical;
    };
    assert.equal(answerFor("ratio-d1-a"), "6");
    assert.equal(answerFor("ratio-d1-b"), "12");
    assert.equal(answerFor("ratio-d2-a"), "35");
    assert.equal(answerFor("ratio-d4-a"), "24");
    assert.equal(answerFor("ratio-d5-b"), "63");

    const constantIntegral = questionBank.find(
      (question) => question.id === "integral-d1-a",
    );
    assert.ok(constantIntegral);
    assert.match(constantIntegral.prompt, /∫₀\^3 1 dx/);
    assert.deepEqual(
      checkAnswer(constantIntegral.answer, "3"),
      { status: "correct" },
    );
  });
});

describe("deterministic answer checking", () => {
  it("accepts equivalent fractions and signed integer answers", () => {
    assert.deepEqual(
      checkAnswer({ type: "fraction", canonical: "1/2" }, "2/4"),
      { status: "correct" },
    );
    assert.deepEqual(
      checkAnswer({ type: "fraction", canonical: "-1/2" }, "2/-4"),
      { status: "correct" },
    );
    assert.deepEqual(
      checkAnswer({ type: "integer", canonical: "-8" }, "−8"),
      {
        status: "invalid",
        message: "Enter a whole number, including a minus sign if needed.",
      },
    );
    assert.deepEqual(
      checkAnswer({ type: "integer", canonical: "-8" }, "-8"),
      { status: "correct" },
    );
    assert.deepEqual(
      checkAnswer(
        { type: "fraction", canonical: "1/2", acceptDecimal: true },
        "0.50",
      ),
      { status: "correct" },
    );
    assert.equal(
      checkAnswer({ type: "fraction", canonical: "1/2" }, "0.5").status,
      "invalid",
    );
  });

  it("does not count blank, malformed, or wrong answers as correct", () => {
    assert.equal(
      checkAnswer({ type: "fraction", canonical: "1/3" }, " ").status,
      "invalid",
    );
    assert.equal(
      checkAnswer({ type: "fraction", canonical: "1/3" }, "0.333").status,
      "invalid",
    );
    assert.equal(
      checkAnswer({ type: "fraction", canonical: "1/3" }, "1/4").status,
      "incorrect",
    );
    assert.equal(
      checkAnswer(
        { type: "unordered-integer-set", canonical: ["-2", "5"] },
        "{5, -2}",
      ).status,
      "correct",
    );
  });

  it("requires the requested decimal precision and applies its tolerance", () => {
    const rule = {
      type: "rounded-decimal" as const,
      canonical: "1.23",
      decimalPlaces: 2,
      tolerance: 0.005,
    };
    assert.equal(checkAnswer(rule, "1.23").status, "correct");
    assert.equal(checkAnswer(rule, "1.234").status, "invalid");
    assert.equal(checkAnswer(rule, "1.24").status, "incorrect");
  });
});

describe("local progress and streaks", () => {
  it("deduplicates completion dates and handles consecutive, missed, and boundary days", () => {
    assert.deepEqual(
      getStreaks(
        ["2024-12-31", "2025-01-01", "2025-01-01"],
        "2025-01-01",
      ),
      { current: 2, best: 2 },
    );
    assert.deepEqual(
      getStreaks(
        ["2024-02-28", "2024-02-29", "2024-03-01"],
        "2024-03-01",
      ),
      { current: 3, best: 3 },
    );
    assert.deepEqual(
      getStreaks(["2025-01-01", "2025-01-03"], "2025-01-03"),
      { current: 1, best: 1 },
    );
    assert.deepEqual(
      getStreaks(["2025-01-02", "2025-01-03"], "2025-01-04"),
      { current: 2, best: 2 },
    );
  });

  it("uses local calendar fields and recovers corrupted or outdated saves", () => {
    assert.equal(localDateKey(new Date(2024, 11, 31)), "2024-12-31");
    assert.deepEqual(parseProgress("{broken").recovered, true);
    assert.deepEqual(
      parseProgress(JSON.stringify({ ...emptyProgress(), version: 1 }))
        .recovered,
      true,
    );
    assert.deepEqual(
      parseProgress(JSON.stringify(emptyProgress())),
      { progress: emptyProgress(), recovered: false },
    );
    assert.equal(progressVersion, 3);
  });
});
