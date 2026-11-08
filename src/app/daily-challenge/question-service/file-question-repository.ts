import "server-only";
import { getCourseByName, getTopicsForGrade } from "../catalog";
import { checkAnswer } from "../domain";
import { questionBank } from "../question-bank";
import type { CourseId, GradeCourse } from "../catalog";
import type { ChallengeDifficulty } from "./types";
import type { QuestionRecord, QuestionRepository } from "./repository";

const publishedRecords: QuestionRecord[] = questionBank;

function validatePublishedRecord(question: QuestionRecord): boolean {
  const answer = question.answer;
  const validAnswer =
    (answer.type === "integer" && typeof answer.canonical === "string") ||
    (answer.type === "fraction" && typeof answer.canonical === "string") ||
    (answer.type === "rounded-decimal" &&
      typeof answer.canonical === "string" &&
      Number.isInteger(answer.decimalPlaces) &&
      answer.decimalPlaces >= 0 &&
      Number.isFinite(answer.tolerance) &&
      answer.tolerance >= 0) ||
    (answer.type === "unordered-integer-set" &&
      Array.isArray(answer.canonical) &&
      answer.canonical.length > 0 &&
      answer.canonical.every((value) => typeof value === "string"));
  if (
    !question.id.trim() ||
    !Number.isInteger(question.version) ||
    question.version < 1 ||
    !question.topicId.trim() ||
    !question.prompt.trim() ||
    !question.subtopic.trim() ||
    !question.hint.trim() ||
    !Array.isArray(question.solutionSteps) ||
    question.solutionSteps.length < 2 ||
    !question.solutionSteps.every(
      (step) => typeof step === "string" && step.trim(),
    ) ||
    !validAnswer ||
    !question.courseIds.length ||
    !question.gradeCourses.length
  ) {
    return false;
  }
  const courseIds = question.gradeCourses.map(
    (gradeCourse) => getCourseByName(gradeCourse)?.id,
  );
  if (
    courseIds.some((courseId) => !courseId || !question.courseIds.includes(courseId)) ||
    question.courseIds.some((courseId) => !courseIds.includes(courseId)) ||
    question.gradeCourses.some(
      (gradeCourse) =>
        !getTopicsForGrade(gradeCourse).some(
          (topic) => topic.id === question.topicId,
        ),
    )
  ) {
    return false;
  }
  const canonical =
    answer.type === "unordered-integer-set"
      ? `{${answer.canonical.join(", ")}}`
      : answer.canonical;
  return checkAnswer(answer, canonical).status === "correct";
}

export class FileQuestionRepository implements QuestionRepository {
  constructor() {
    const identities = new Set<string>();
    for (const question of publishedRecords) {
      const identity = `${question.id}@${question.version}`;
      if (identities.has(identity)) {
        throw new Error(`Duplicate question identity ${identity}.`);
      }
      identities.add(identity);
      if (
        question.publicationStatus === "published" &&
        !validatePublishedRecord(question)
      ) {
        throw new Error(
          `Published question ${question.id} failed question-bank validation.`,
        );
      }
    }
  }

  listPublished(courseId?: CourseId, topicId?: string): QuestionRecord[] {
    return publishedRecords.filter(
      (question) =>
        question.publicationStatus === "published" &&
        question.reviewStatus === "mathematically-reviewed" &&
        (!courseId || question.courseIds.includes(courseId)) &&
        (!topicId || question.topicId === topicId),
    );
  }

  findPublishedById(
    id: string,
    version?: number,
  ): QuestionRecord | undefined {
    return this.listPublished().find(
      (question) =>
        question.id === id &&
        (version === undefined || question.version === version),
    );
  }

  listTopicCoursePairs(): { courseId: CourseId; topicId: string }[] {
    const pairs = new Map<string, { courseId: CourseId; topicId: string }>();
    for (const question of this.listPublished()) {
      for (const courseId of question.courseIds) {
        const key = `${courseId}|${question.topicId}`;
        pairs.set(key, { courseId, topicId: question.topicId });
      }
    }
    return [...pairs.values()];
  }

  getDailyBankPool(
    courseId: CourseId,
    gradeCourse: GradeCourse,
    topicId: string,
    difficulty: ChallengeDifficulty,
  ): QuestionRecord[] {
    const course = getCourseByName(gradeCourse);
    if (!course || course.id !== courseId) return [];
    return this.listPublished(courseId, topicId).filter(
      (question) => question.difficulty === difficulty,
    );
  }
}
