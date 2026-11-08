import "server-only";
import {
  challengeTopics,
  courseCatalog,
  getTopicDisplayName,
  getTopicsForGrade,
  type CourseId,
  type GradeCourse,
} from "../catalog";
import { checkAnswer, chooseDailyIds, type AnswerCheck } from "../domain";
import { question } from "../question-bank";
import { FileQuestionRepository } from "./file-question-repository";
import type { QuestionRepository, QuestionRecord } from "./repository";
import {
  getGeneratedTemplateQuestions,
  type GeneratedQuestion,
} from "./templates";
import type {
  ChallengeDifficulty,
  CourseCoverage,
  DailyChallengeSnapshot,
  PublicCourse,
  PublicQuestion,
  PublicTopic,
  QuestionLocator,
  QuestionService,
} from "./types";

const generationVersion = 1 as const;

function isLocalDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

function isTimeZone(value: string): boolean {
  if (!value || value.length > 100) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function validCourseTopic(
  courseId: CourseId,
  topicId: string,
): { gradeCourse: GradeCourse; topic: (typeof challengeTopics)[number] } | undefined {
  const course = courseCatalog.find((item) => item.id === courseId);
  const topic = challengeTopics.find(
    (item) => item.id === topicId && item.courseIds.includes(courseId),
  );
  return course && topic
    ? { gradeCourse: course.name, topic }
    : undefined;
}

function isQuestionLocator(value: QuestionLocator): boolean {
  if (!value || typeof value !== "object" || !value.question) return false;
  const question = value.question;
  if (
    typeof value.date !== "string" ||
    typeof value.timeZone !== "string" ||
    typeof value.courseId !== "string" ||
    typeof value.gradeCourse !== "string" ||
    typeof value.topicId !== "string" ||
    typeof question.id !== "string" ||
    question.id.length > 300 ||
    !Number.isInteger(question.version) ||
    question.version < 1 ||
    ![1, 2, 3, 4, 5].includes(question.difficulty) ||
    (question.source !== "bank" && question.source !== "template")
  ) {
    return false;
  }
  if (question.source === "template") {
    return (
      typeof question.templateId === "string" &&
      question.templateId.length <= 100 &&
      Number.isInteger(question.templateVersion) &&
      (question.templateVersion ?? 0) > 0 &&
      Boolean(question.parameters) &&
      typeof question.parameters === "object" &&
      Object.values(question.parameters ?? {}).every(
        (parameter) =>
          (typeof parameter === "number" && Number.isFinite(parameter)) ||
          (typeof parameter === "string" && parameter.length <= 100),
      )
    );
  }
  return true;
}

function templateQuestions(
  date: string,
  timeZone: string,
  courseId: CourseId,
  gradeCourse: GradeCourse,
  topicId: string,
  requestedVersions?: Record<string, number>,
): GeneratedQuestion[] {
  return getGeneratedTemplateQuestions(question, {
    date,
    timeZone,
    courseId,
    gradeCourse,
    topicId,
  }, requestedVersions).filter(
    (item) =>
      item.publicationStatus === "published" &&
      item.reviewStatus === "mathematically-reviewed",
  );
}

function allQuestionsForDay(
  repository: QuestionRepository,
  date: string,
  timeZone: string,
  courseId: CourseId,
  gradeCourse: GradeCourse,
  topicId: string,
): (QuestionRecord | GeneratedQuestion)[] {
  return [
    ...repository.listPublished(courseId, topicId),
    ...templateQuestions(date, timeZone, courseId, gradeCourse, topicId),
  ];
}

function selectionKey(item: QuestionRecord | GeneratedQuestion): string {
  return `${item.id}@${item.version}`;
}

function publicTemplateParameters(
  parameters: GeneratedQuestion["parameters"],
): GeneratedQuestion["parameters"] {
  return Object.fromEntries(
    Object.entries(parameters).filter(
      ([key]) => key !== "solution" && key !== "quotient",
    ),
  );
}

function toPublicQuestion(
  item: QuestionRecord | GeneratedQuestion,
  courseId: CourseId,
  gradeCourse: GradeCourse,
): PublicQuestion {
  const generated =
    "source" in item && item.source === "template" ? item : undefined;
  return {
    id: item.id,
    version: item.version,
    courseId,
    gradeCourse,
    topicId: item.topicId,
    topic: getTopicDisplayName(
      challengeTopics.find((topic) => topic.id === item.topicId)!,
      gradeCourse,
    ),
    subtopic: item.subtopic,
    difficulty: item.difficulty,
    prompt: item.prompt,
    ...(item.instructions ? { instructions: item.instructions } : {}),
    source: generated ? "template" : "bank",
    ...(generated
      ? {
          templateId: generated.templateId,
          templateVersion: generated.templateVersion,
          parameters: publicTemplateParameters(generated.parameters),
        }
      : {}),
  };
}

function recordForLocator(
  repository: QuestionRepository,
  locator: QuestionLocator,
): QuestionRecord | GeneratedQuestion | undefined {
  if (!isQuestionLocator(locator)) return undefined;
  const match = validCourseTopic(locator.courseId, locator.topicId);
  if (!match || match.gradeCourse !== locator.gradeCourse) return undefined;
  if (
    !isLocalDateKey(locator.date) ||
    !isTimeZone(locator.timeZone) ||
    ![1, 2, 3, 4, 5].includes(locator.question.difficulty)
  ) {
    return undefined;
  }

  if (locator.question.source === "bank") {
    const item = repository.findPublishedById(
      locator.question.id,
      locator.question.version,
    );
    if (
      !item ||
      !item.courseIds.includes(locator.courseId) ||
      item.topicId !== locator.topicId ||
      item.difficulty !== locator.question.difficulty
    ) {
      return undefined;
    }
    return item;
  }

  const templateId = locator.question.templateId;
  const templateVersion = locator.question.templateVersion;
  if (!templateId || !templateVersion) return undefined;
  const generated = templateQuestions(
    locator.date,
    locator.timeZone,
    locator.courseId,
    locator.gradeCourse,
    locator.topicId,
    { [templateId]: templateVersion },
  ).find(
    (item) =>
      item.id === locator.question.id &&
      item.version === locator.question.version &&
      item.difficulty === locator.question.difficulty &&
      item.templateId === templateId &&
      item.templateVersion === templateVersion &&
      JSON.stringify(publicTemplateParameters(item.parameters)) ===
        JSON.stringify(locator.question.parameters),
  );
  return generated;
}

function isReady(
  repository: QuestionRepository,
  date: string,
  timeZone: string,
  courseId: CourseId,
  gradeCourse: GradeCourse,
  topicId: string,
): boolean {
  const questions = allQuestionsForDay(
    repository,
    date,
    timeZone,
    courseId,
    gradeCourse,
    topicId,
  );
  return ([1, 2, 3, 4, 5] as ChallengeDifficulty[]).every((difficulty) =>
    questions.some((item) => item.difficulty === difficulty),
  );
}

function getCoverage(repository: QuestionRepository): CourseCoverage[] {
  const date = "2026-01-01";
  const timeZone = "UTC";
  return courseCatalog
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((course) => {
      const topics = getTopicsForGrade(course.name);
      const readyTopics = topics.filter((topic) =>
        isReady(repository, date, timeZone, course.id, course.name, topic.id),
      ).length;
      return {
        ...course,
        totalTopics: topics.length,
        readyTopics,
        remainingTopics: topics.length - readyTopics,
      };
    });
}

function listCourses(): PublicCourse[] {
  return courseCatalog
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((item) => ({ ...item }));
}

function listTopics(
  repository: QuestionRepository,
  courseId: CourseId,
): PublicTopic[] {
  const course = courseCatalog.find((item) => item.id === courseId);
  if (!course) return [];
  const date = "2026-01-01";
  const timeZone = "UTC";
  return getTopicsForGrade(course.name).map((topic) => ({
    id: topic.id,
    label: getTopicDisplayName(topic, course.name),
    description: topic.description,
    courseId,
    order: topic.order,
    ready: isReady(repository, date, timeZone, courseId, course.name, topic.id),
  }));
}

function createDailyChallenge(
  repository: QuestionRepository,
  date: string,
  timeZone: string,
  courseId: CourseId,
  topicId: string,
  existingQuestionIds?: string[],
): DailyChallengeSnapshot | undefined {
  const match = validCourseTopic(courseId, topicId);
  if (!match || !isLocalDateKey(date) || !isTimeZone(timeZone)) return undefined;

  let selected: (QuestionRecord | GeneratedQuestion)[];
  if (existingQuestionIds) {
    if (existingQuestionIds.length !== 5) return undefined;
    selected = existingQuestionIds.map((id) => {
      const item =
        repository.findPublishedById(id) ??
        templateQuestions(date, timeZone, courseId, match.gradeCourse, topicId).find(
          (questionItem) => questionItem.id === id,
        );
      if (!item) throw new Error(`Saved challenge question ${id} is no longer available.`);
      return item;
    });
    if (
      selected.some((item, index) => item.difficulty !== index + 1) ||
      new Set(selected.map((item) => item.id)).size !== 5
    ) {
      return undefined;
    }
  } else {
    const available = allQuestionsForDay(
      repository,
      date,
      timeZone,
      courseId,
      match.gradeCourse,
      topicId,
    );
    const pools: Record<number, string[]> = {};
    const availableByKey = new Map(
      available.map((item) => [selectionKey(item), item]),
    );
    for (let difficulty = 1 as ChallengeDifficulty; difficulty <= 5; difficulty = (difficulty + 1) as ChallengeDifficulty) {
      pools[difficulty] = available
        .filter((item) => item.difficulty === difficulty)
        .map(selectionKey);
    }
    if ([1, 2, 3, 4, 5].some((difficulty) => pools[difficulty].length === 0)) {
      return undefined;
    }
    const keys = chooseDailyIds(date, match.gradeCourse, topicId, pools, `${timeZone}|generation-${generationVersion}`);
    selected = keys.map((key) => {
      const item = availableByKey.get(key);
      if (!item) throw new Error(`Selected challenge question ${key} is missing.`);
      return item;
    });
    if (new Set(selected.map((item) => item.id)).size !== 5) {
      throw new Error("Daily challenge selection returned duplicate questions.");
    }
  }

  return {
    version: 1,
    generationVersion,
    date,
    timeZone,
    courseId,
    gradeCourse: match.gradeCourse,
    topicId,
    questions: selected.map((item) =>
      toPublicQuestion(item, courseId, match.gradeCourse),
    ),
  };
}

function check(
  repository: QuestionRepository,
  locator: QuestionLocator,
  answer: string,
): AnswerCheck {
  if (typeof answer !== "string" || answer.length > 200) {
    return {
      status: "invalid",
      message: "We couldn’t read that answer. Check the format and try again.",
    };
  }
  const item = recordForLocator(repository, locator);
  if (!item) {
    return {
      status: "invalid",
      message: "This question is no longer available. Reload the saved challenge.",
    };
  }
  return checkAnswer(item.answer, answer);
}

export function createQuestionService(
  repository: QuestionRepository = new FileQuestionRepository(),
): QuestionService {
  return {
    listCourses,
    listTopics: (courseId) => listTopics(repository, courseId),
    getCoverage: () => getCoverage(repository),
    createDailyChallenge: (date, timeZone, courseId, topicId, existingIds) =>
      createDailyChallenge(
        repository,
        date,
        timeZone,
        courseId,
        topicId,
        existingIds,
      ),
    checkAnswer: (locator, answer) => check(repository, locator, answer),
    getHint(locator) {
      if (!isQuestionLocator(locator)) return undefined;
      return recordForLocator(repository, locator)?.hint;
    },
    getSolution(locator) {
      if (!isQuestionLocator(locator)) return undefined;
      return recordForLocator(repository, locator)?.solutionSteps;
    },
  };
}

const service = createQuestionService();

export function getQuestionService(): QuestionService {
  return service;
}

export function getQuestionServiceCatalog() {
  const courses = service.listCourses();
  return {
    courses,
    topics: courses.map((course) => ({
      courseId: course.id,
      topics: service.listTopics(course.id),
    })),
    coverage: service.getCoverage(),
  };
}
