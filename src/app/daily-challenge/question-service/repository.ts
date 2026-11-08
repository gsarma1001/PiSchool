import type { CourseId, GradeCourse } from "../catalog";
import type { BankQuestion } from "../question-bank";
import type { ChallengeDifficulty } from "./types";

export type QuestionRecord = BankQuestion & {
  version: number;
  courseIds: CourseId[];
  publicationStatus: "draft" | "published";
  reviewStatus: "unreviewed" | "mathematically-reviewed";
};

export interface QuestionRepository {
  listPublished(courseId?: CourseId, topicId?: string): QuestionRecord[];
  findPublishedById(id: string, version?: number): QuestionRecord | undefined;
  listTopicCoursePairs(): { courseId: CourseId; topicId: string }[];
  getDailyBankPool(
    courseId: CourseId,
    gradeCourse: GradeCourse,
    topicId: string,
    difficulty: ChallengeDifficulty,
  ): QuestionRecord[];
}
