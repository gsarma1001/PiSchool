import type { Metadata } from "next";
import { DailyChallengeExperience } from "./daily-challenge-experience";
import { getQuestionServiceCatalog } from "./question-service/service";

export const metadata: Metadata = {
  title: "Daily Math Challenge | The Pi School",
  description:
    "Practice math with five daily questions, supportive feedback, hints, and worked solutions.",
};

export default function DailyChallengePage() {
  const serviceCatalog = getQuestionServiceCatalog();

  return (
    <main className="public-page" id="main-content">
      <section
        aria-labelledby="challenge-page-title"
        className="public-hero page-width"
      >
        <p className="eyebrow eyebrow-dark">Think it through</p>
        <h1 id="challenge-page-title">
          Daily Math
          <br />
          <span>Challenge.</span>
        </h1>
        <p className="public-lede">
          Choose a level and topic, then work through five questions that build
          in challenge. Your answers are checked with deterministic math rules;
          progress stays on this device.
        </p>
      </section>

      <section
        aria-label="Daily math practice"
        className="public-section daily-challenge-section"
      >
        <DailyChallengeExperience
          catalog={serviceCatalog}
        />
      </section>
    </main>
  );
}
