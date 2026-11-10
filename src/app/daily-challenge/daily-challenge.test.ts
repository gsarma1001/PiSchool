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
import { elementaryChallengeLevels } from "../../lib/curriculum";

describe("daily challenge catalog and question bank", () => {
  it("lists all curriculum courses and their requested topics", () => {
    assert.equal(gradeCourses.length, 20);
    assert.equal(courseCatalog.length, 14);
    assert.equal(courseCatalog[0].id, "arithmetic-number-sense");
    assert.equal(challengeTopics.length, 173);
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

  it("provides grade-scoped elementary topics and five accessible choice questions", () => {
    const expectedTopicCounts = [4, 3, 3, 3, 3, 3];
    for (const [index, level] of elementaryChallengeLevels.entries()) {
      assert.equal(gradeCourses.includes(level.label), true);
      const topics = getTopicsForGrade(level.label);
      assert.equal(topics.length, expectedTopicCounts[index]);
      assert.ok(topics.every((topic) => topic.levelIds?.includes(level.id)));

      for (const topic of topics) {
        const context = {
          date: "2026-11-08",
          timeZone: "UTC",
          courseId: level.courseId,
          gradeCourse: level.label,
          topicId: topic.id,
        };
        const generated = getGeneratedTemplateQuestions(question, context);
        assert.deepEqual(
          generated.map((item) => item.difficulty),
          [1, 2, 3, 4, 5],
          `${level.label}: ${topic.id}`,
        );
        for (const item of generated) {
          assert.equal(item.answer.type, "choice");
          if (item.answer.type !== "choice") continue;
          const expectedChoiceCount = [
            "Group A",
            "Group B",
            "Same",
            "Acute",
            "Right",
            "Obtuse",
          ].includes(item.answer.canonical)
            ? 3
            : 4;
          assert.equal(item.answer.options.length, expectedChoiceCount);
          assert.equal(
            new Set(item.answer.options.map((option) => option.value)).size,
            expectedChoiceCount,
          );
          assert.ok(
            item.answer.options.every(
              (option) => !option.label.startsWith("Other choice"),
            ),
          );
          assert.ok(item.answer.options.some((option) => option.value === item.answer.canonical));
          assert.ok(item.hint.trim());
          assert.equal(item.solutionSteps.length >= 2, true);
          const correct = item.answer.options.find(
            (option) => option.value === item.answer.canonical,
          );
          assert.ok(correct);
          for (const option of item.answer.options) {
            assert.deepEqual(
              checkAnswer(item.answer, option.id),
              option.value === item.answer.canonical
                ? { status: "correct" }
                : { status: "incorrect" },
              `${level.label}: ${topic.id} difficulty ${item.difficulty} option ${option.label}`,
            );
          }
          if (topic.id === "grade-1-add-subtract") {
            assert.ok(
              Number(item.parameters.first) + Number(item.parameters.second) <= 20,
              `Grade 1 addition values stay within 20 at difficulty ${item.difficulty}`,
            );
          }
          if (topic.id === "kindergarten-comparing" && item.difficulty === 4) {
            assert.ok(Number(item.parameters.left) >= Number(item.parameters.right));
          }
        }

        const snapshot = getQuestionService().createDailyChallenge(
          context.date,
          context.timeZone,
          context.courseId,
          context.topicId,
        );
        assert.equal(snapshot?.gradeCourse, level.label);
        assert.equal(snapshot?.questions.length, 5);
        assert.ok(snapshot?.questions.every(
          (item) =>
            item.choices !== undefined &&
            item.choices.length >= 3 &&
            item.choices.length <= 4 &&
            item.parameters === undefined,
        ));
        const publicQuestion = snapshot?.questions[0];
        const privateQuestion = generated.find(
          (item) => item.id === publicQuestion?.id,
        );
        assert.ok(publicQuestion);
        assert.ok(privateQuestion?.answer.type === "choice");
        if (privateQuestion?.answer.type !== "choice") continue;
        const correctChoice = publicQuestion.choices?.find(
          (choice) =>
            privateQuestion.answer.type === "choice" &&
            privateQuestion.answer.options.find(
              (option) => option.id === choice.id,
            )?.value === privateQuestion.answer.canonical,
        );
        assert.ok(correctChoice);
        assert.deepEqual(
          getQuestionService().checkAnswer(
            {
              date: snapshot.date,
              timeZone: snapshot.timeZone,
              courseId: snapshot.courseId,
              gradeCourse: snapshot.gradeCourse,
              topicId: snapshot.topicId,
              question: publicQuestion,
            },
            correctChoice.id,
          ),
          { status: "correct" },
        );
      }
    }
  });

  it("keeps generated grade-level problems valid across changing daily seeds", () => {
    const kindergarten = elementaryChallengeLevels[0];
    const grade1 = elementaryChallengeLevels[1];
    const grade2 = elementaryChallengeLevels[2];
    const grade4 = elementaryChallengeLevels[4];
    for (let day = 1; day <= 28; day += 1) {
      const date = `2026-10-${String(day).padStart(2, "0")}`;
      const context = (
        level: (typeof elementaryChallengeLevels)[number],
        topicId: string,
      ) => ({
        date,
        timeZone: "UTC",
        courseId: level.courseId,
        gradeCourse: level.label,
        topicId,
      });
      const grade1Questions = getGeneratedTemplateQuestions(
        question,
        context(grade1, "grade-1-add-subtract"),
      );
      for (const item of grade1Questions) {
        const first = Number(item.parameters.first);
        const second = Number(item.parameters.second);
        assert.ok(first + second <= 20, `${date}: Grade 1 values stay within 20`);
        const expected = item.difficulty === 3
          ? second
          : item.difficulty === 4
            ? first + second
            : item.difficulty === 5
              ? first
              : item.difficulty === 2
                ? first
                : first + second;
        assert.equal(item.answer.type, "choice");
        if (item.answer.type === "choice") {
          assert.equal(item.answer.canonical, String(expected), `${date}: ${item.prompt}`);
        }
      }

      const comparison = getGeneratedTemplateQuestions(
        question,
        context(kindergarten, "kindergarten-comparing"),
      );
      const catchUp = comparison.find((item) => item.difficulty === 4);
      assert.ok(catchUp);
      assert.ok(
        Number(catchUp.parameters.left) >= Number(catchUp.parameters.right),
        `${date}: a student never needs to collect a negative number of objects`,
      );

      const angles = getGeneratedTemplateQuestions(
        question,
        context(grade4, "grade-4-angles-measure"),
      );
      const classification = angles.find((item) => item.difficulty === 2);
      assert.ok(classification);
      const angle = Number(classification.parameters.angle);
      const expectedClass = angle < 90 ? "Acute" : angle === 90 ? "Right" : "Obtuse";
      assert.equal(classification.answer.type, "choice");
      if (classification.answer.type === "choice") {
        assert.equal(classification.answer.canonical, expectedClass, `${date}: ${angle}°`);
      }

      const money = getGeneratedTemplateQuestions(
        question,
        context(grade2, "grade-2-money-data"),
      ).find((item) => item.difficulty === 1);
      assert.ok(money);
      assert.match(money.prompt, /\$\d+\.\d{2}/);
      assert.equal(money.answer.type, "choice");
      if (money.answer.type === "choice") {
        assert.match(money.answer.canonical, /^\$\d+\.\d{2}$/);
      }
    }
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
        ["Kindergarten", 4, 4, 0],
        ["Grade 1", 3, 3, 0],
        ["Grade 2", 3, 3, 0],
        ["Grade 3", 3, 3, 0],
        ["Grade 4", 3, 3, 0],
        ["Grade 5", 3, 3, 0],
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
        course.name,
        service
          .listTopics(course.id, course.name)
          .filter((topic) => topic.ready)
          .map((topic) => topic.id),
      ]),
    );
    assert.deepEqual(readyTopicIdsByCourse, {
      Kindergarten: [
        "kindergarten-counting",
        "kindergarten-comparing",
        "kindergarten-patterns",
        "kindergarten-shapes",
      ],
      "Grade 1": [
        "grade-1-add-subtract",
        "grade-1-place-value",
        "grade-1-time-shapes",
      ],
      "Grade 2": [
        "grade-2-place-value",
        "grade-2-equal-groups",
        "grade-2-money-data",
      ],
      "Grade 3": [
        "grade-3-multiplication-division",
        "grade-3-fractions",
        "grade-3-area-perimeter",
      ],
      "Grade 4": [
        "grade-4-multidigit-operations",
        "grade-4-fractions",
        "grade-4-angles-measure",
      ],
      "Grade 5": [
        "grade-5-decimals-fractions",
        "grade-5-volume",
        "grade-5-expressions-coordinates",
      ],
      "Arithmetic and Number Sense": [
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
      "Fractions, Decimals, and Percentages": ["fraction-operations"],
      "Ratios and Proportional Reasoning": ["ratio-proportions"],
      "Pre-Algebra": ["linear-equations"],
      "Algebra 1": ["linear-equations", "evaluating-functions"],
      Geometry: ["pythagorean-theorem"],
      "Algebra 2": ["quadratic-equations"],
      Trigonometry: ["trigonometry-special-angles"],
      Precalculus: ["trigonometry-special-angles"],
      "Calculus 1": ["derivatives-at-a-point"],
      "Calculus 2": ["definite-integrals"],
      "Multivariable Calculus": ["partial-derivatives"],
      "Differential Equations": ["differential-equations"],
      "Linear Algebra": ["matrix-determinants"],
    });
    for (const course of coverage) {
      const topics = getTopicsForGrade(course.name);
      const readyIds = service
        .listTopics(course.id, course.name)
        .filter((topic) => topic.ready)
        .map((topic) => topic.id);
      assert.equal(readyIds.length, course.readyTopics, course.name);
      assert.equal(
        course.remainingTopics,
        topics.length - readyIds.length,
        course.name,
      );
      for (const topicId of readyIds) {
        const generated = getGeneratedTemplateQuestions(question, {
          date: "2026-01-01",
          timeZone: "UTC",
          courseId: course.id,
          gradeCourse: course.name,
          topicId,
        });
        for (let difficulty = 1; difficulty <= 5; difficulty += 1) {
          assert.ok(
            questionBank.some((question) =>
              question.topicId === topicId &&
              question.difficulty === difficulty &&
              question.gradeCourses.includes(course.name),
            ) || generated.some((item) => item.difficulty === difficulty),
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
