"use client";

import Link from "next/link";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  checkDailyAnswer,
  getDailyQuestionSet,
  getQuestionHint,
  getQuestionSolution,
} from "./actions";
import type { CourseId, GradeCourse } from "./catalog";
import {
  emptyProgress,
  parseProgress,
  progressStorageKey,
  sessionKey,
  type ChallengeProgress,
  type ChallengeResult,
  type ChallengeSession,
  type QuestionProgress,
} from "./progress";
import { getStreaks, localDateKey } from "./streaks";
import type { AnswerCheck } from "./domain";
import type {
  DailyChallengeSnapshot,
  PublicQuestion,
  QuestionLocator,
} from "./question-service/types";

type ChallengeCatalog = {
  courses: {
    id: CourseId;
    name: GradeCourse;
    description: string;
    order: number;
  }[];
  topics: {
    courseId: CourseId;
    topics: {
      id: string;
      label: string;
      description: string;
      courseId: CourseId;
      order: number;
      ready: boolean;
    }[];
  }[];
  coverage: {
    id: CourseId;
    name: GradeCourse;
    description: string;
    order: number;
    totalTopics: number;
    readyTopics: number;
    remainingTopics: number;
  }[];
};

function blankQuestionProgress(): QuestionProgress {
  return {
    answer: "",
    attempts: 0,
    incorrectAttempts: 0,
    outcome: "pending",
    feedback: "",
    hintViewed: false,
    solutionViewed: false,
  };
}

function isGradeCourse(
  value: string,
  courses: ChallengeCatalog["courses"],
): value is GradeCourse {
  return courses.some((course) => course.name === value);
}

function getQuestionProgressLabel(progress: QuestionProgress): string {
  if (progress.outcome === "correct") return "Solved independently";
  if (progress.outcome === "helped") return "Completed with help";
  if (progress.outcome === "incorrect") return "Try another answer";
  return "Not completed yet";
}

function formatDays(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

function getQuestionLocator(
  snapshot: DailyChallengeSnapshot,
  question: PublicQuestion,
): QuestionLocator {
  return {
    date: snapshot.date,
    timeZone: snapshot.timeZone,
    courseId: snapshot.courseId,
    gradeCourse: snapshot.gradeCourse,
    topicId: snapshot.topicId,
    question,
  };
}

export function DailyChallengeExperience({
  catalog,
}: {
  catalog: ChallengeCatalog;
}) {
  const [progress, setProgress] = useState<ChallengeProgress>(emptyProgress);
  const [loaded, setLoaded] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<GradeCourse | "">("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [activeKey, setActiveKey] = useState("");
  const [snapshot, setSnapshot] = useState<DailyChallengeSnapshot | null>(null);
  const [hint, setHint] = useState<{ questionId: string; text: string } | null>(
    null,
  );
  const [solutionSteps, setSolutionSteps] = useState<{
    questionId: string;
    steps: string[];
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const challengeHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const restoreStartedRef = useRef(false);

  const questions = snapshot?.questions ?? [];
  const session = activeKey ? progress.sessions[activeKey] : undefined;
  const questionIndex = Math.min(session?.currentQuestion ?? 0, 4);
  const currentQuestion = questions[questionIndex];
  const currentProgress = session?.questions[questionIndex];
  const savedResult = activeKey ? progress.results[activeKey] : undefined;
  const selectedCourse = selectedGrade
    ? catalog.courses.find((item) => item.name === selectedGrade)
    : undefined;
  const topics = useMemo(
    () =>
      selectedCourse
        ? catalog.topics.find((item) => item.courseId === selectedCourse.id)
            ?.topics ?? []
        : [],
    [catalog.topics, selectedCourse],
  );
  const readyTopicIds = useMemo(
    () => topics.filter((topic) => topic.ready).map((topic) => topic.id),
    [topics],
  );
  const readyTopicIdSet = useMemo(() => new Set(readyTopicIds), [readyTopicIds]);
  const filteredTopics = useMemo(() => {
    const query = topicSearch.trim().toLocaleLowerCase();
    return topics.filter(
      (topic) =>
        !query ||
        topic.label.toLocaleLowerCase().includes(query) ||
        topic.description.toLocaleLowerCase().includes(query),
    );
  }, [topicSearch, topics]);
  const curriculumCoverage = catalog.coverage;
  const selectedTopicIsReady = readyTopicIdSet.has(selectedTopic);
  const streaks = useMemo(
    () => getStreaks(progress.completedDates, localDateKey(new Date())),
    [progress.completedDates],
  );
  const completedProblems =
    session?.questions.filter(
      (item) => item.outcome === "correct" || item.outcome === "helped",
    ).length ?? 0;

  const saveProgress = useCallback((next: ChallengeProgress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(progressStorageKey, JSON.stringify(next));
    } catch {
      setStorageMessage(
        "Progress is available for this visit, but this browser could not save it on this device.",
      );
    }
  }, []);

  const openChallenge = useCallback(
    async (
      gradeCourse: GradeCourse,
      topicId: string,
      startingProgress: ChallengeProgress = progress,
    ) => {
      setIsLoadingChallenge(true);
      setStorageMessage("");
      setHint(null);
      setSolutionSteps(null);

      const date = localDateKey(new Date());
      const timeZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const key = sessionKey(date, gradeCourse, topicId);
      const existing = startingProgress.sessions[key];
      let challengeSnapshot: DailyChallengeSnapshot | undefined =
        startingProgress.challengeSnapshots[key];
      try {
        if (!challengeSnapshot) {
          challengeSnapshot = await getDailyQuestionSet(
            existing?.date ?? date,
            timeZone,
            gradeCourse,
            topicId,
            existing?.questionIds,
          );
        }
      } catch (error) {
        console.error("The daily question set could not be loaded.", error);
        setStorageMessage(
          "We couldn’t load today’s questions. Your progress is unchanged. Please try loading them again.",
        );
        setIsLoadingChallenge(false);
        return;
      }

      if (!challengeSnapshot || challengeSnapshot.questions.length !== 5) {
        setStorageMessage(
          "We couldn’t load a complete five-question set for this selection. Please choose another course/level or topic.",
        );
        setIsLoadingChallenge(false);
        return;
      }

      const questionIds = challengeSnapshot.questions.map((question) => question.id);
      const nextSession: ChallengeSession = existing
        ? { ...existing, questionIds }
        : {
            date: challengeSnapshot.date,
            gradeCourse,
            topicId,
            questionIds,
            currentQuestion: 0,
            questions: questionIds.map(() => blankQuestionProgress()),
          };
      const nextProgress: ChallengeProgress = {
        ...startingProgress,
        selectedGradeCourse: gradeCourse,
        selectedTopicId: topicId,
        challengeSnapshots: {
          ...startingProgress.challengeSnapshots,
          [key]: challengeSnapshot,
        },
        sessions: {
          ...startingProgress.sessions,
          [key]: nextSession,
        },
      };

      setSelectedGrade(gradeCourse);
      setSelectedTopic(topicId);
      setSnapshot(challengeSnapshot);
      setActiveKey(key);
      saveProgress(nextProgress);
      setIsLoadingChallenge(false);
      setFocusRequest((request) => request + 1);
    },
    [progress, saveProgress],
  );

  useEffect(() => {
    if (restoreStartedRef.current) return;
    restoreStartedRef.current = true;
    let restored: ChallengeProgress;
    let message = "";
    try {
      const parsed = parseProgress(
        window.localStorage.getItem(progressStorageKey),
      );
      restored = parsed.progress;
      if (parsed.recovered) {
        message =
          "Saved challenge progress was incomplete or from a different version. We recovered what we could; some progress may have been reset on this device.";
      }
    } catch {
      restored = emptyProgress();
      message =
        "This browser does not allow access to local storage. Progress will only last for this visit.";
    }

    startTransition(() => {
      setProgress(restored);
      setLoaded(true);
      setStorageMessage(message);
    });
    if (
      restored.selectedGradeCourse &&
      isGradeCourse(restored.selectedGradeCourse, catalog.courses)
    ) {
      const restoredCourse = catalog.courses.find(
        (course) => course.name === restored.selectedGradeCourse,
      );
      const restoredTopics =
        catalog.topics.find(
          (item) => item.courseId === restoredCourse?.id,
        )?.topics ?? [];
      const savedChallengeKey = restored.selectedTopicId
        ? sessionKey(
            localDateKey(new Date()),
            restored.selectedGradeCourse,
            restored.selectedTopicId,
          )
        : undefined;
      startTransition(() => {
        setSelectedGrade(restored.selectedGradeCourse!);
      });
      if (
        restored.selectedTopicId &&
        restoredTopics.some((topic) => topic.id === restored.selectedTopicId)
      ) {
        startTransition(() => {
          setSelectedTopic(restored.selectedTopicId!);
        });
        if (
          (savedChallengeKey &&
            restored.challengeSnapshots[savedChallengeKey]) ||
          restoredTopics.some(
            (topic) =>
              topic.id === restored.selectedTopicId && topic.ready,
          )
        ) {
          void Promise.resolve().then(() =>
            openChallenge(
              restored.selectedGradeCourse!,
              restored.selectedTopicId!,
              restored,
            ),
          );
        }
      }
    }
  }, [catalog, openChallenge]);

  useEffect(() => {
    if (focusRequest > 0) {
      challengeHeadingRef.current?.focus();
    }
  }, [focusRequest, questionIndex, savedResult]);

  useEffect(() => {
    if (!session || !snapshot || !currentQuestion || !currentProgress) return;
    let cancelled = false;

    if (currentProgress.hintViewed) {
      const locator = getQuestionLocator(snapshot, currentQuestion);
      void getQuestionHint(locator)
        .then((value) => {
          if (!cancelled) {
            setHint({ questionId: currentQuestion.id, text: value });
          }
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          console.error("The saved daily challenge hint could not be loaded.", error);
          setStorageMessage(
            "The saved hint could not be loaded. You can try requesting help again.",
          );
        });
    }

    if (currentProgress.solutionViewed) {
      const locator = getQuestionLocator(snapshot, currentQuestion);
      void getQuestionSolution(locator)
        .then((steps) => {
          if (!cancelled) {
            setSolutionSteps({ questionId: currentQuestion.id, steps });
          }
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          console.error(
            "The saved daily challenge solution could not be loaded.",
            error,
          );
          setStorageMessage(
            "The saved worked solution could not be loaded. You can try again.",
          );
        });
    }

    return () => {
      cancelled = true;
    };
  }, [session, snapshot, currentQuestion, currentProgress]);

  const updateCurrentQuestion = useCallback(
    (update: (item: QuestionProgress) => QuestionProgress) => {
      const activeSession = activeKey ? progress.sessions[activeKey] : undefined;
      if (!activeSession) return;
      const current = activeSession.currentQuestion;
      const nextSession: ChallengeSession = {
        ...activeSession,
        questions: activeSession.questions.map((item, index) =>
          index === current ? update(item) : item,
        ),
      };
      saveProgress({
        ...progress,
        sessions: {
          ...progress.sessions,
          [activeKey]: nextSession,
        },
      });
    },
    [activeKey, progress, saveProgress],
  );

  function handleGradeChange(value: string) {
    const gradeCourse = isGradeCourse(value, catalog.courses) ? value : "";
    setSelectedGrade(gradeCourse);
    setSelectedTopic("");
    setTopicSearch("");
    setActiveKey("");
    setSnapshot(null);
    setStorageMessage("");
    saveProgress({
      ...progress,
      selectedGradeCourse: gradeCourse || undefined,
      selectedTopicId: undefined,
    });
  }

  function handleTopicChange(topicId: string) {
    const topicIsValid = topics.some((topic) => topic.id === topicId);
    setSelectedTopic(topicIsValid ? topicId : "");
    setActiveKey("");
    setSnapshot(null);
    setStorageMessage("");
    saveProgress({
      ...progress,
      selectedTopicId: topicIsValid ? topicId : undefined,
    });
  }

  function handleAnswerChange(answer: string) {
    updateCurrentQuestion((item) => ({ ...item, answer }));
  }

  async function handleCheckAnswer() {
    if (!currentQuestion || !currentProgress || !snapshot || isChecking) return;
    setIsChecking(true);
    let result: AnswerCheck;
    try {
      result = await checkDailyAnswer(
        getQuestionLocator(snapshot, currentQuestion),
        currentProgress.answer,
      );
    } catch (error) {
      console.error("The daily challenge answer could not be checked.", error);
      setStorageMessage(
        "Your answer was not recorded because checking failed. Please try again.",
      );
      setIsChecking(false);
      return;
    }
    setIsChecking(false);

    if (result.status === "invalid") {
      updateCurrentQuestion((item) => ({
        ...item,
        feedback: result.message,
      }));
      return;
    }

    if (result.status === "correct") {
      const firstAttempt = currentProgress.attempts === 0;
      updateCurrentQuestion((item) => ({
        ...item,
        attempts: item.attempts + 1,
        outcome: "correct",
        feedback: firstAttempt
          ? "Correct on your first attempt! Nice mathematical thinking."
          : "That’s correct. You worked it out—well done!",
      }));
      return;
    }

    updateCurrentQuestion((item) => ({
      ...item,
      attempts: item.attempts + 1,
      incorrectAttempts: item.incorrectAttempts + 1,
      outcome: "incorrect",
      feedback: "Not quite. A mistake is part of learning—review your steps and try again.",
    }));
  }

  async function handleNeedHelp() {
    if (!currentQuestion || !snapshot) return;
    let value: string;
    try {
      value = await getQuestionHint(
        getQuestionLocator(snapshot, currentQuestion),
      );
    } catch (error) {
      console.error("The daily challenge hint could not be loaded.", error);
      setStorageMessage("The hint could not be loaded. Please try again.");
      return;
    }
    setHint({ questionId: currentQuestion.id, text: value });
    updateCurrentQuestion((item) => ({
      ...item,
      hintViewed: true,
    }));
  }

  async function handleShowSolution() {
    if (!currentQuestion || !snapshot) return;
    let steps: string[];
    try {
      steps = await getQuestionSolution(
        getQuestionLocator(snapshot, currentQuestion),
      );
    } catch (error) {
      console.error("The daily challenge solution could not be loaded.", error);
      setStorageMessage(
        "The worked solution could not be loaded. Please try again.",
      );
      return;
    }
    setSolutionSteps({ questionId: currentQuestion.id, steps });
    updateCurrentQuestion((item) => ({
      ...item,
      solutionViewed: true,
      outcome: "helped",
      feedback:
        "You completed this problem with help. Learning from a worked solution counts toward today’s completion.",
    }));
  }

  function handleNextProblem() {
    if (!session || !currentProgress) return;
    if (
      currentProgress.outcome !== "correct" &&
      currentProgress.outcome !== "helped"
    ) {
      return;
    }
    const nextIndex = session.currentQuestion + 1;
    if (nextIndex > 4) return;
    const nextSession = { ...session, currentQuestion: nextIndex };
    saveProgress({
      ...progress,
      sessions: {
        ...progress.sessions,
        [activeKey]: nextSession,
      },
    });
    setHint(null);
    setSolutionSteps(null);
    setFocusRequest((request) => request + 1);
  }

  function handleSeeResults() {
    if (!session || !session.questions.every(
      (item) => item.outcome === "correct" || item.outcome === "helped",
    )) {
      return;
    }

    if (progress.results[activeKey]) {
      setFocusRequest((request) => request + 1);
      return;
    }

    const completionDate = localDateKey(new Date());
    const completedDates = [...new Set([...progress.completedDates, completionDate])];
    const currentStreak = getStreaks(completedDates, completionDate);
    const result: ChallengeResult = {
      date: completionDate,
      gradeCourse: session.gradeCourse,
      topicId: session.topicId,
      solvedIndependently: session.questions.filter(
        (item) => item.outcome === "correct",
      ).length,
      firstAttemptCorrect: session.questions.filter(
        (item) => item.outcome === "correct" && item.attempts === 1,
      ).length,
      completedWithHelp: session.questions.filter(
        (item) => item.outcome === "helped",
      ).length,
      incorrectAttempts: session.questions.reduce(
        (total, item) => total + item.incorrectAttempts,
        0,
      ),
      currentStreak: currentStreak.current,
      bestStreak: currentStreak.best,
    };
    const nextSession = { ...session, currentQuestion: 5 };
    saveProgress({
      ...progress,
      completedDates,
      sessions: {
        ...progress.sessions,
        [activeKey]: nextSession,
      },
      results: {
        ...progress.results,
        [activeKey]: result,
      },
    });
    setFocusRequest((request) => request + 1);
  }

  function handlePracticeAnotherTopic() {
    setSelectedTopic("");
    setActiveKey("");
    setSnapshot(null);
    setHint(null);
    setSolutionSteps(null);
    saveProgress({
      ...progress,
      selectedTopicId: undefined,
    });
  }

  if (!loaded) {
    return (
      <div aria-live="polite" className="challenge-loading">
        Loading your saved challenge progress…
      </div>
    );
  }

  if (savedResult) {
    return (
      <section aria-labelledby="daily-results-title" className="daily-results">
        <p className="eyebrow eyebrow-dark">Challenge complete</p>
        <h2 id="daily-results-title" ref={resultHeadingRef} tabIndex={-1}>
          You showed up and worked through all five problems.
        </h2>
        <p className="results-encouragement">
          Every completed problem counts, including ones you finished with a
          hint or worked solution. Keep your curiosity going!
        </p>
        <div aria-label="Challenge results" className="results-grid">
          <div className="result-stat">
            <strong>{savedResult.solvedIndependently} / 5</strong>
            <span>Solved independently</span>
          </div>
          <div className="result-stat">
            <strong>{savedResult.firstAttemptCorrect} / 5</strong>
            <span>Correct on the first attempt</span>
          </div>
          <div className="result-stat">
            <strong>{savedResult.completedWithHelp}</strong>
            <span>Completed with help</span>
          </div>
          <div className="result-stat">
            <strong>{savedResult.incorrectAttempts}</strong>
            <span>Incorrect attempts</span>
          </div>
        </div>
        <div aria-label="Daily streak" className="streak-summary">
          <span aria-hidden="true">✦</span>
          <p>
            Current streak: <strong>{formatDays(streaks.current)}</strong>
            <br />
            Best streak: <strong>{formatDays(streaks.best)}</strong>
          </p>
          <small>
            Streaks count completed local calendar days. Your performance
            results and streak are tracked separately.
          </small>
        </div>
        <div className="challenge-actions">
          <button
            className="button button-primary"
            onClick={handlePracticeAnotherTopic}
            type="button"
          >
            Practice Another Topic
          </button>
          <Link className="button button-text" href="/">
            Return Home
          </Link>
        </div>
        <p className="progress-device-note">
          Your progress is saved only on this device.
        </p>
      </section>
    );
  }

  return (
    <div className="daily-challenge-experience">
      {storageMessage && (
        <>
          <p
            aria-live="polite"
            className="challenge-storage-message"
            role="status"
          >
            {storageMessage}
          </p>
          {!activeKey &&
            !isLoadingChallenge &&
            selectedGrade &&
            selectedTopic && (
              <button
                className="button button-secondary"
                onClick={() => void openChallenge(selectedGrade, selectedTopic)}
                type="button"
              >
                Retry loading questions
              </button>
            )}
        </>
      )}
      <div className="challenge-selector">
        <div className="form-field">
          <label htmlFor="challenge-grade">Choose a course or level</label>
          <select
            id="challenge-grade"
            onChange={(event) => handleGradeChange(event.target.value)}
            value={selectedGrade}
          >
            <option value="">Select a course or level</option>
            {catalog.courses.map(({ name: gradeCourse }) => {
              const summary = curriculumCoverage.find(
                (item) => item.name === gradeCourse,
              );
              return (
                <option key={gradeCourse} value={gradeCourse}>
                  {gradeCourse}
                  {summary
                    ? ` (${summary.readyTopics}/${summary.totalTopics} ready)`
                    : ""}
                </option>
              );
            })}
          </select>
        </div>
        <div aria-live="polite" className="topic-picker">
          <div className="form-field">
            <label htmlFor="challenge-topic-search">Search topics</label>
            <input
              autoComplete="off"
              disabled={!selectedGrade || isLoadingChallenge}
              id="challenge-topic-search"
              onChange={(event) => setTopicSearch(event.target.value)}
              placeholder="Search this course’s topics"
              type="search"
              value={topicSearch}
            />
            {selectedGrade && selectedCourse && (
              <p aria-live="polite" className="field-hint">
                {topics.length} topics · {readyTopicIds.length} challenge
                {readyTopicIds.length === 1 ? "" : "s"} ready ·{" "}
                {topics.length - readyTopicIds.length} coming soon
              </p>
            )}
          </div>
          {selectedGrade && (
            <ul aria-label="Topics for selected course" className="topic-list">
              {filteredTopics.map((topic) => {
                const isReady = readyTopicIdSet.has(topic.id);
                const isSelected = selectedTopic === topic.id;
                return (
                  <li key={topic.id}>
                    <button
                      aria-pressed={isSelected}
                      className={`topic-option${isSelected ? " topic-option-selected" : ""}`}
                      onClick={() => handleTopicChange(topic.id)}
                      type="button"
                    >
                      <span className="topic-option-copy">
                        <strong>
                          {topic.label}
                        </strong>
                        <span>{topic.description}</span>
                      </span>
                      <span
                        className={`topic-availability${isReady ? " topic-availability-ready" : ""}`}
                      >
                        {isReady ? "Ready" : "Coming soon"}
                      </span>
                    </button>
                  </li>
                );
              })}
              {filteredTopics.length === 0 && (
                <li className="topic-empty">
                  No topics match “{topicSearch}”. Try another search.
                </li>
              )}
            </ul>
          )}
          {selectedGrade && (
            <button
              className="button button-primary topic-start-button"
              disabled={
                !selectedTopic ||
                !selectedTopicIsReady ||
                isLoadingChallenge
              }
              onClick={() => {
                if (selectedGrade && selectedTopicIsReady) {
                  void openChallenge(selectedGrade, selectedTopic);
                }
              }}
              type="button"
            >
              {isLoadingChallenge ? "Preparing challenge…" : "Start Challenge"}
            </button>
          )}
        </div>
      </div>
      <section
        aria-labelledby="curriculum-coverage-title"
        className="curriculum-coverage"
      >
        <div>
          <h2 id="curriculum-coverage-title">Curriculum coverage</h2>
          <p>
            Readiness is based on whether a topic has at least one verified
            question at every difficulty level, with a hint and worked solution.
          </p>
        </div>
        <div className="coverage-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Course / level</th>
                <th scope="col">Topics</th>
                <th scope="col">Ready</th>
                <th scope="col">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {curriculumCoverage.map((course) => (
                <tr key={course.id}>
                  <th scope="row">{course.name}</th>
                  <td>{course.totalTopics}</td>
                  <td>{course.readyTopics}</td>
                  <td>{course.remainingTopics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="progress-device-note">
        Progress is saved on this device only; it does not sync across devices.
      </p>
      <p className="streak-inline">
        Daily streak: <strong>{formatDays(streaks.current)}</strong>
        <span aria-hidden="true"> · </span>
        Best: <strong>{formatDays(streaks.best)}</strong>
      </p>

      {isLoadingChallenge && (
        <p aria-live="polite" className="challenge-loading" role="status">
          Preparing today’s five questions…
        </p>
      )}

      {session && currentQuestion && currentProgress && !savedResult && (
        <section
          aria-labelledby="question-title"
          className="daily-question-card"
        >
          <div className="question-topline">
            <div className="question-tags">
              <span>{currentQuestion.gradeCourse}</span>
              <span>{currentQuestion.topic}</span>
            </div>
            <span className="difficulty-label">
              {[
                "Foundational understanding",
                "Basic application",
                "Multistep application",
                "Reasoning or word problem",
                "Challenging extension",
              ][currentQuestion.difficulty - 1]}
            </span>
          </div>

          <div className="question-progress-copy">
            <strong>Question {questionIndex + 1} of 5</strong>
            <span>{completedProblems} of 5 completed</span>
          </div>
          <progress
            aria-label="Challenge progress"
            className="question-progress"
            max={5}
            value={completedProblems}
          />

          <h2 id="question-title" ref={challengeHeadingRef} tabIndex={-1}>
            {currentQuestion.subtopic}
          </h2>
          <p className="question-prompt">{currentQuestion.prompt}</p>
          {currentQuestion.instructions && (
            <p className="answer-instructions">
              {currentQuestion.instructions}
            </p>
          )}

          <div className="answer-entry">
            <label htmlFor="challenge-answer">Your answer</label>
            <input
              autoComplete="off"
              id="challenge-answer"
              inputMode="text"
              maxLength={200}
              onChange={(event) => handleAnswerChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleCheckAnswer();
                }
              }}
              value={currentProgress.answer}
            />
            <button
              className="button button-primary"
              disabled={
                isChecking ||
                isLoadingChallenge ||
                currentProgress.outcome === "correct" ||
                currentProgress.outcome === "helped"
              }
              onClick={() => void handleCheckAnswer()}
              type="button"
            >
              {isChecking ? "Checking…" : "Check Answer"}
            </button>
          </div>

          {currentProgress.feedback && (
            <p
              aria-live="polite"
              className={`answer-feedback answer-feedback-${currentProgress.outcome}`}
              role="status"
            >
              <span aria-hidden="true">
                {currentProgress.outcome === "correct"
                  ? "✓ "
                  : currentProgress.outcome === "helped"
                    ? "💡 "
                    : currentProgress.outcome === "incorrect"
                      ? "↻ "
                      : "ℹ "}
              </span>
              {currentProgress.feedback}
            </p>
          )}

          {currentProgress.outcome === "incorrect" && (
            <div className="help-panel">
              <p>{getQuestionProgressLabel(currentProgress)}</p>
              <div className="challenge-actions">
                <button
                  className="button button-secondary"
                  onClick={() => {
                    updateCurrentQuestion((item) => ({
                      ...item,
                      answer: "",
                      outcome: "pending",
                      feedback: "Try a different approach and check your steps.",
                    }));
                  }}
                  type="button"
                >
                  Try Again
                </button>
                <button
                  className="button button-text"
                  onClick={() => void handleNeedHelp()}
                  type="button"
                >
                  I Need Help
                </button>
              </div>
            </div>
          )}

          {hint?.questionId === currentQuestion.id &&
            currentProgress.hintViewed && (
            <div aria-live="polite" className="challenge-hint">
              <strong>Hint</strong>
              <p>{hint.text}</p>
            </div>
          )}

          {currentProgress.hintViewed &&
            !currentProgress.solutionViewed &&
            currentProgress.outcome === "incorrect" && (
              <button
                className="button button-secondary"
                onClick={() => void handleShowSolution()}
                type="button"
              >
                Show Worked Solution
              </button>
            )}

          {solutionSteps?.questionId === currentQuestion.id &&
            solutionSteps.steps.length > 0 &&
            currentProgress.solutionViewed && (
            <div aria-live="polite" className="worked-solution">
              <h3>Worked solution</h3>
              <ol>
                {solutionSteps.steps.map((step, index) => (
                  <li key={`${currentQuestion.id}-step-${index}`}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {(currentProgress.outcome === "correct" ||
            currentProgress.outcome === "helped") && (
            <div className="challenge-next">
              {questionIndex < 4 ? (
                <button
                  className="button button-primary"
                  onClick={handleNextProblem}
                  type="button"
                >
                  Next Problem
                </button>
              ) : (
                <button
                  className="button button-primary"
                  onClick={handleSeeResults}
                  type="button"
                >
                  See Results
                </button>
              )}
            </div>
          )}

          <p className="question-status">
            This problem: {getQuestionProgressLabel(currentProgress)}
          </p>
        </section>
      )}

    </div>
  );
}
