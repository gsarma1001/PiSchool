"use server";

import "server-only";
import type {
  DailyChallengeSnapshot,
  PublicQuestion,
  QuestionLocator,
} from "./question-service/types";
import { getQuestionService } from "./question-service/service";
import type { AnswerCheck } from "./domain";

export type DailyQuestion = PublicQuestion;

export async function getDailyQuestionSet(
  date: string,
  timeZone: string,
  gradeCourse: string,
  topicId: string,
  existingQuestionIds?: string[],
): Promise<DailyChallengeSnapshot | undefined> {
  const service = getQuestionService();
  const courseId = service.listCourses().find(
    (course) => course.name === gradeCourse,
  )?.id;
  if (!courseId) return undefined;
  return service.createDailyChallenge(
    date,
    timeZone,
    courseId,
    topicId,
    existingQuestionIds,
  );
}

export async function checkDailyAnswer(
  locator: QuestionLocator,
  answer: string,
): Promise<AnswerCheck> {
  return getQuestionService().checkAnswer(locator, answer);
}

export async function getQuestionHint(
  locator: QuestionLocator,
): Promise<string> {
  const hint = getQuestionService().getHint(locator);
  if (!hint) throw new Error("The hint for this question is unavailable.");
  return hint;
}

export async function getQuestionSolution(
  locator: QuestionLocator,
): Promise<string[]> {
  const solution = getQuestionService().getSolution(locator);
  if (!solution) throw new Error("The worked solution is unavailable.");
  return solution;
}
