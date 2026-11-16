import Link from "next/link";
import { tutors, trialLesson } from "@/lib/tutors";

export function TutorOffer({
  compact = false,
  showCta = true,
}: {
  compact?: boolean;
  showCta?: boolean;
}) {
  return (
    <div className={`tutor-offer${compact ? " tutor-offer-compact" : ""}`}>
      {!compact && (
        <div className="trial-summary">
          <p className="eyebrow eyebrow-dark">First lesson</p>
          <h2>Request a trial lesson</h2>
          <p>
            The first lesson is a {trialLesson.length},{" "}
            {trialLesson.format.toLowerCase()} trial. The trial price and
            delivery format are still to be confirmed.
          </p>
        </div>
      )}
      <div className="tutor-offer-heading">
        <h2>Regular one-on-one lessons</h2>
        <p>Regular lesson rates are separate from the trial lesson.</p>
      </div>
      <div className="tutor-profile-grid">
        {tutors.map((tutor) => (
          <article className="tutor-profile-card" key={tutor.id}>
            <h3>{tutor.name}</h3>
            {tutor.reviewStatus === "approved" ? (
              <p>{tutor.bio}</p>
            ) : (
              <p className="tutor-review-note">Tutor biography awaiting review.</p>
            )}
            <p>{tutor.subjects}</p>
            <p className="tutor-rate">
              {tutor.rate} / {tutor.lessonLength}
            </p>
          </article>
        ))}
      </div>
      {!compact && showCta && (
        <Link className="button button-primary tutor-offer-cta" href="/contact">
          Request a trial lesson
        </Link>
      )}
    </div>
  );
}
