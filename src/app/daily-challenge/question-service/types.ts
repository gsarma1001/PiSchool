import type { CourseId, GradeCourse, QuestionVisual } from "../catalog";
import type { AnswerCheck, AnswerRule } from "../domain";

export type ChallengeDifficulty = 1 | 2 | 3 | 4 | 5;

export type PublicCourse = {
  id: CourseId;
  name: GradeCourse;
  description: string;
  order: number;
};

export type PublicTopic = {
  id: string;
  label: string;
  description: string;
  courseId: CourseId;
  gradeCourse: GradeCourse;
  order: number;
  ready: boolean;
};

export type PublicQuestion = {
  id: string;
  version: number;
  courseId: CourseId;
  gradeCourse: GradeCourse;
  topicId: string;
  topic: string;
  subtopic: string;
  difficulty: ChallengeDifficulty;
  prompt: string;
  instructions?: string;
  choices?: { id: string; label: string }[];
  visual?: QuestionVisual;
  source: "bank" | "template";
  templateId?: string;
  templateVersion?: number;
  parameters?: Record<string, number | string>;
};

export type DailyChallengeSnapshot = {
  version: 1;
  generationVersion: 1;
  date: string;
  timeZone: string;
  courseId: CourseId;
  gradeCourse: GradeCourse;
  topicId: string;
  questions: PublicQuestion[];
};

export type QuestionLocator = Pick<
  DailyChallengeSnapshot,
  "date" | "timeZone" | "courseId" | "gradeCourse" | "topicId"
> & {
  question: Pick<
    PublicQuestion,
    | "id"
    | "version"
    | "difficulty"
    | "source"
    | "templateId"
    | "templateVersion"
    | "parameters"
  >;
};

export type QuestionService = {
  listCourses(): PublicCourse[];
  listTopics(courseId: CourseId, gradeCourse?: GradeCourse): PublicTopic[];
  getCoverage(): CourseCoverage[];
  createDailyChallenge(
    date: string,
    timeZone: string,
    courseId: CourseId,
    topicId: string,
    existingQuestionIds?: string[],
  ): DailyChallengeSnapshot | undefined;
  checkAnswer(locator: QuestionLocator, answer: string): AnswerCheck;
  getHint(locator: QuestionLocator): string | undefined;
  getSolution(locator: QuestionLocator): string[] | undefined;
};

export type CourseCoverage = PublicCourse & {
  totalTopics: number;
  readyTopics: number;
  remainingTopics: number;
};

export type AnswerType = AnswerRule["type"];
