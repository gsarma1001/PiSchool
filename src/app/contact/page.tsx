import type { Metadata } from "next";
import { connection } from "next/server";
import { TutorOffer } from "@/components/tutor-offer";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Request a trial lesson | The Pi School",
  description:
    "Send The Pi School a tutoring inquiry about a student’s US grade, course, and math learning needs, from early foundations through advanced math.",
};

export default async function ContactPage() {
  await connection();

  const deliveryConfigured = Boolean(
    process.env.RESEND_API_KEY &&
      process.env.INQUIRY_FROM_EMAIL &&
      process.env.INQUIRY_TO_EMAIL,
  );

  return (
    <main className="public-page" id="main-content">
      <section aria-labelledby="contact-page-title" className="public-hero page-width">
        <p className="eyebrow eyebrow-dark">Start a conversation</p>
        <h1 id="contact-page-title">Request a trial lesson</h1>
        <p className="public-lede">
          Tell us the student’s grade or course and what kind of math support
          you’re looking for. Sending an inquiry does not book a lesson.
        </p>
      </section>

      <section aria-labelledby="inquiry-form-title" className="public-section">
        <div className="contact-layout page-width">
          <div className="contact-aside">
            <p className="eyebrow eyebrow-dark">Tutoring inquiry</p>
            <h2 id="inquiry-form-title">Tell us what you’re looking for.</h2>
            <p>
              The form requests a parent or guardian name, reply email, student
              grade or course, and a short description of the help needed.
              Please don’t include sensitive student information.
            </p>
            <p>
              We’ll use your contact details to respond to this inquiry. The
              first lesson is a 45-minute, one-on-one trial. The trial price
              and delivery format are still to be confirmed. Regular lesson
              rates are listed separately below.
            </p>
            {!deliveryConfigured && (
              <p className="delivery-notice" role="status">
                The inquiry form is currently unavailable. Please try again later.
              </p>
            )}
          </div>
          <div className="inquiry-panel">
            <InquiryForm />
          </div>
        </div>
      </section>
      <section aria-label="Regular tutor rates" className="public-section">
        <div className="page-width">
          <TutorOffer compact />
        </div>
      </section>
    </main>
  );
}
