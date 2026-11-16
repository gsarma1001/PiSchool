import type { GradeCourse } from "./catalog";
import {
  challengeTopics,
  getCourseByName,
  getTopicsForGrade,
  gradeCourses,
} from "./catalog";
import type { DailyChallengeSnapshot } from "./question-service/types";

export const progressStorageKey = "pi-school.daily-challenge";
export const progressVersion = 4;

export type QuestionOutcome = "pending" | "incorrect" | "correct" | "helped";

export type QuestionProgress = {
  answer: string;
  attempts: number;
  incorrectAttempts: number;
  outcome: QuestionOutcome;
  feedback: string;
  hintViewed?: boolean;
  solutionViewed?: boolean;
  helpHistoryKnown?: boolean;
};

export type ChallengeSession = {
  date: string;
  gradeCourse: GradeCourse;
  topicId: string;
  questionIds: string[];
  currentQuestion: number;
  questions: QuestionProgress[];
};

export type ChallengeResult = {
  date: string;
  gradeCourse: GradeCourse;
  topicId: string;
  solvedIndependently: number;
  firstAttemptCorrect: number;
  completedWithHelp: number;
  unclassifiedCompleted: number;
  incorrectAttempts: number;
  currentStreak: number;
  bestStreak: number;
};

type StoredChallengeResult = Omit<ChallengeResult, "unclassifiedCompleted"> & {
  unclassifiedCompleted?: number;
};

export type ChallengeProgress = {
  version: number;
  selectedGradeCourse?: GradeCourse;
  selectedTopicId?: string;
  sessions: Record<string, ChallengeSession>;
  challengeSnapshots: Record<string, DailyChallengeSnapshot>;
  completedDates: string[];
  results: Record<string, ChallengeResult>;
};

export function getSessionKeys(
  progress: ChallengeProgress,
  date: string,
  gradeCourse: GradeCourse,
  topicId: string,
): string[] {
  const baseKey = sessionKey(date, gradeCourse, topicId);
  return Object.keys(progress.sessions)
    .filter((key) => key === baseKey || key.startsWith(`${baseKey}|practice-`))
    .sort((left, right) => practiceNumber(left, baseKey) - practiceNumber(right, baseKey));
}

function practiceNumber(key: string, baseKey: string): number {
  if (key === baseKey) return 0;
  const match = key.match(/\|practice-(\d+)$/);
  return match && key.startsWith(`${baseKey}|`) ? Number(match[1]) : 0;
}

export function nextSessionKey(
  progress: ChallengeProgress,
  date: string,
  gradeCourse: GradeCourse,
  topicId: string,
): string {
  const keys = getSessionKeys(progress, date, gradeCourse, topicId);
  const baseKey = sessionKey(date, gradeCourse, topicId);
  if (!keys.length) return baseKey;
  return `${baseKey}|practice-${practiceNumber(keys.at(-1)!, baseKey) + 1}`;
}

export function emptyProgress(): ChallengeProgress {
  return {
    version: progressVersion,
    sessions: {},
    challengeSnapshots: {},
    completedDates: [],
    results: {},
  };
}

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

function isQuestionProgress(value: unknown): value is QuestionProgress {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<QuestionProgress>;
  return (
    typeof item.answer === "string" &&
    item.answer.length <= 200 &&
    typeof item.attempts === "number" &&
    Number.isInteger(item.attempts) &&
    item.attempts >= 0 &&
    typeof item.incorrectAttempts === "number" &&
    Number.isInteger(item.incorrectAttempts) &&
    item.incorrectAttempts >= 0 &&
    item.incorrectAttempts <= item.attempts &&
    ["pending", "incorrect", "correct", "helped"].includes(
      item.outcome ?? "",
    ) &&
    typeof item.feedback === "string" &&
    item.feedback.length <= 1000 &&
    (item.hintViewed === undefined || typeof item.hintViewed === "boolean") &&
    (item.solutionViewed === undefined || typeof item.solutionViewed === "boolean") &&
    (item.helpHistoryKnown === undefined ||
      typeof item.helpHistoryKnown === "boolean") &&
    (item.outcome !== "helped" ||
      item.hintViewed === true ||
      item.solutionViewed === true ||
      (item.solutionViewed === undefined &&
        item.helpHistoryKnown === undefined)) &&
    (item.outcome !== "correct" || item.attempts > 0) &&
    (item.outcome !== "incorrect" || item.incorrectAttempts > 0)
  );
}

function isSnapshot(value: unknown): value is DailyChallengeSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<DailyChallengeSnapshot>;
  const course =
    typeof snapshot.gradeCourse === "string"
      ? getCourseByName(snapshot.gradeCourse)
      : undefined;
  let validTimeZone = false;
  if (typeof snapshot.timeZone === "string" && snapshot.timeZone.length <= 100) {
    try {
      new Intl.DateTimeFormat("en-US", {
        timeZone: snapshot.timeZone,
      }).format(new Date(0));
      validTimeZone = true;
    } catch {
      validTimeZone = false;
    }
  }
  return (
    snapshot.version === 1 &&
    snapshot.generationVersion === 1 &&
    typeof snapshot.date === "string" &&
    isLocalDateKey(snapshot.date) &&
    validTimeZone &&
    typeof snapshot.courseId === "string" &&
    course?.id === snapshot.courseId &&
    typeof snapshot.gradeCourse === "string" &&
    typeof snapshot.topicId === "string" &&
    getTopicsForGrade(snapshot.gradeCourse).some(
      (topic) => topic.id === snapshot.topicId,
    ) &&
    Array.isArray(snapshot.questions) &&
    snapshot.questions.length === 5 &&
    new Set(snapshot.questions.map((question) => question?.id)).size === 5 &&
    snapshot.questions.every(
      (question, index) =>
        Boolean(question) &&
        typeof question === "object" &&
        typeof question.id === "string" &&
        question.id.length > 0 &&
        Number.isInteger(question.version) &&
        question.version > 0 &&
        question.topicId === snapshot.topicId &&
        question.courseId === snapshot.courseId &&
        question.difficulty === index + 1 &&
        typeof question.prompt === "string" &&
        question.prompt.length > 0 &&
        (question.instructions === undefined ||
          typeof question.instructions === "string") &&
        (question.source === "bank" ||
          (question.source === "template" &&
            typeof question.templateId === "string" &&
            Number.isInteger(question.templateVersion) &&
            (question.templateVersion ?? 0) > 0 &&
            Boolean(question.parameters) &&
            Object.values(question.parameters ?? {}).every(
              (parameter) =>
                (typeof parameter === "number" &&
                  Number.isFinite(parameter)) ||
                (typeof parameter === "string" && parameter.length <= 100),
            ))),
    )
  );
}

function isSession(value: unknown): value is ChallengeSession {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ChallengeSession>;
  return (
    typeof item.date === "string" &&
    isLocalDateKey(item.date) &&
    gradeCourses.includes(item.gradeCourse as GradeCourse) &&
    typeof item.topicId === "string" &&
    getTopicsForGrade(item.gradeCourse as GradeCourse).some(
      (topic) => topic.id === item.topicId,
    ) &&
    Array.isArray(item.questionIds) &&
    item.questionIds.length === 5 &&
    item.questionIds.every((id) => typeof id === "string") &&
    Number.isInteger(item.currentQuestion) &&
    (item.currentQuestion ?? -1) >= 0 &&
    (item.currentQuestion ?? 5) <= 5 &&
    Array.isArray(item.questions) &&
    item.questions.length === 5 &&
    item.questions.every(isQuestionProgress)
  );
}

export function parseProgress(raw: string | null): {
  progress: ChallengeProgress;
  recovered: boolean;
} {
  if (raw === null) return { progress: emptyProgress(), recovered: false };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { progress: emptyProgress(), recovered: true };
    }

    const value = parsed as Partial<ChallengeProgress>;
    if (
      ![2, 3, progressVersion].includes(value.version ?? 0) ||
      !value.sessions ||
      typeof value.sessions !== "object" ||
      Array.isArray(value.sessions) ||
      !Array.isArray(value.completedDates) ||
      !value.results ||
      typeof value.results !== "object" ||
      (value.version === 3 || value.version === progressVersion) &&
        (!value.challengeSnapshots ||
          typeof value.challengeSnapshots !== "object" ||
          Array.isArray(value.challengeSnapshots))
    ) {
      return { progress: emptyProgress(), recovered: true };
    }

    const storedSessions = Object.entries(value.sessions);
    const validSessions = storedSessions.filter(([, session]) =>
      isSession(session),
    );
    const sessions = Object.fromEntries(
      validSessions.map(([key, session]) => [
        key,
        migrateSession(session as ChallengeSession, value.version ?? 0),
      ]),
    );
    const completedDates = value.completedDates.filter(
      (date): date is string =>
        typeof date === "string" && isLocalDateKey(date),
    );
    const storedResults = Object.entries(value.results);
    const validResults = storedResults.filter(([, result]) =>
      isChallengeResult(result),
    );
    const migratedResults = validResults.map(([key, result]) => [
      key,
      migrateResult(result as StoredChallengeResult, sessions[key]),
    ] as const);
    const storedSnapshots =
      value.challengeSnapshots &&
      typeof value.challengeSnapshots === "object" &&
      !Array.isArray(value.challengeSnapshots)
        ? Object.entries(value.challengeSnapshots)
        : [];
    const validSnapshots = storedSnapshots.filter(([key, snapshot]) => {
      if (!isSnapshot(snapshot)) return false;
      const baseKey = `${snapshot.date}|${snapshot.gradeCourse}|${snapshot.topicId}`;
      const suffix = key.slice(baseKey.length);
      return key === baseKey || /^\|practice-\d+$/.test(suffix);
    });
    const challengeSnapshots = Object.fromEntries(validSnapshots);
    const results = Object.fromEntries(
      migratedResults.filter(([key]) => sessions[key]?.questions.every(
        (question) =>
          question.outcome === "correct" || question.outcome === "helped",
      ) ?? true),
    );
    const resultDates = new Set(
      Object.values(results).map((result) => result.date),
    );
    const retainedCompletedDates = completedDates.filter((date) =>
      resultDates.has(date),
    );
    const selectedGradeCourseIsValid = gradeCourses.includes(
      value.selectedGradeCourse as GradeCourse,
    );
    const selectedGradeCourse = selectedGradeCourseIsValid
      ? value.selectedGradeCourse
      : undefined;
    const selectedTopicIdIsValid =
      typeof value.selectedTopicId === "string" &&
      challengeTopics.some((topic) => topic.id === value.selectedTopicId)
    const selectedTopicId = selectedTopicIdIsValid
      ? value.selectedTopicId
      : undefined;
    const recovered =
      validSessions.length !== storedSessions.length ||
      completedDates.length !== value.completedDates.length ||
      retainedCompletedDates.length !== completedDates.length ||
      validResults.length !== storedResults.length ||
      validSnapshots.length !== storedSnapshots.length ||
      (value.selectedGradeCourse !== undefined &&
        !selectedGradeCourseIsValid) ||
      (value.selectedTopicId !== undefined && !selectedTopicIdIsValid);

    return {
      progress: {
        version: progressVersion,
        ...(selectedGradeCourse ? { selectedGradeCourse } : {}),
        ...(selectedTopicId ? { selectedTopicId } : {}),
        sessions,
        challengeSnapshots,
        completedDates: retainedCompletedDates,
        results,
      },
      recovered,
    };
  } catch {
    return { progress: emptyProgress(), recovered: true };
  }
}

function isChallengeResult(value: unknown): value is ChallengeResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<ChallengeResult>;
  const solvedIndependently = result.solvedIndependently;
  const firstAttemptCorrect = result.firstAttemptCorrect;
  const completedWithHelp = result.completedWithHelp;
  const incorrectAttempts = result.incorrectAttempts;
  const currentStreak = result.currentStreak;
  const bestStreak = result.bestStreak;
  return (
    typeof result.date === "string" &&
    isLocalDateKey(result.date) &&
    gradeCourses.includes(result.gradeCourse as GradeCourse) &&
    typeof result.topicId === "string" &&
    getTopicsForGrade(result.gradeCourse as GradeCourse).some(
      (topic) => topic.id === result.topicId,
    ) &&
    typeof solvedIndependently === "number" &&
    Number.isInteger(solvedIndependently) &&
    solvedIndependently >= 0 &&
    solvedIndependently <= 5 &&
    typeof firstAttemptCorrect === "number" &&
    Number.isInteger(firstAttemptCorrect) &&
    firstAttemptCorrect >= 0 &&
    firstAttemptCorrect <= solvedIndependently &&
    typeof completedWithHelp === "number" &&
    Number.isInteger(completedWithHelp) &&
    completedWithHelp >= 0 &&
    completedWithHelp <= 5 &&
    typeof (result.unclassifiedCompleted ?? 0) === "number" &&
    Number.isInteger(result.unclassifiedCompleted ?? 0) &&
    (result.unclassifiedCompleted ?? 0) >= 0 &&
    (result.unclassifiedCompleted ?? 0) <= 5 &&
    solvedIndependently + completedWithHelp + (result.unclassifiedCompleted ?? 0) === 5 &&
    typeof incorrectAttempts === "number" &&
    Number.isInteger(incorrectAttempts) &&
    incorrectAttempts >= 0 &&
    typeof currentStreak === "number" &&
    Number.isInteger(currentStreak) &&
    currentStreak >= 1 &&
    typeof bestStreak === "number" &&
    Number.isInteger(bestStreak) &&
    bestStreak >= currentStreak
  );
}

function migrateSession(
  session: ChallengeSession,
  sourceVersion: number,
): ChallengeSession {
  const questions = session.questions.map((question) => {
    const helpHistoryKnown = question.helpHistoryKnown ?? false;
    if (
      sourceVersion < progressVersion &&
      question.solutionViewed &&
      question.outcome === "helped"
    ) {
      return {
        ...question,
        answer: "",
        outcome: "pending" as const,
        helpHistoryKnown,
        feedback:
          "A worked solution was viewed. Submit a correct answer to complete this problem.",
      };
    }
    const usedHelp = question.hintViewed === true || question.solutionViewed === true;
    return {
      ...question,
      hintViewed: question.hintViewed ?? false,
      solutionViewed: question.solutionViewed ?? false,
      helpHistoryKnown,
      ...(question.outcome === "correct" && usedHelp
        ? {
            outcome: "helped" as const,
            feedback: "Completed with help.",
          }
        : {}),
    };
  });
  const firstIncomplete = questions.findIndex(
    (question) => question.outcome !== "correct" && question.outcome !== "helped",
  );
  return {
    ...session,
    currentQuestion:
      firstIncomplete < 0
        ? session.currentQuestion
        : Math.min(session.currentQuestion, firstIncomplete),
    questions,
  };
}

function migrateResult(
  result: StoredChallengeResult,
  session: ChallengeSession | undefined,
): ChallengeResult {
  if (typeof result.unclassifiedCompleted === "number") {
    return result as ChallengeResult;
  }
  if (!session) {
    return {
      ...result,
      solvedIndependently: 0,
      firstAttemptCorrect: 0,
      completedWithHelp: 0,
      unclassifiedCompleted: 5,
    };
  }
  const completed = session.questions.filter(
    (question) => question.outcome === "correct" || question.outcome === "helped",
  );
  const solvedIndependently = completed.filter(
    (question) =>
      question.outcome === "correct" &&
      question.helpHistoryKnown !== false &&
      !question.hintViewed &&
      !question.solutionViewed,
  ).length;
  const completedWithHelp = completed.filter(
    (question) =>
      question.outcome === "helped" &&
      question.helpHistoryKnown !== false,
  ).length;
  return {
    ...result,
    solvedIndependently,
    firstAttemptCorrect: Math.min(
      solvedIndependently,
      completed.filter(
        (question) =>
          question.outcome === "correct" &&
          question.helpHistoryKnown !== false &&
          !question.hintViewed &&
          !question.solutionViewed &&
          question.attempts === 1,
      ).length,
    ),
    completedWithHelp,
    unclassifiedCompleted: completed.length - solvedIndependently - completedWithHelp,
  };
}

export function sessionKey(
  date: string,
  gradeCourse: GradeCourse,
  topicId: string,
): string {
  return `${date}|${gradeCourse}|${topicId}`;
}
