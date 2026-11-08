import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "./inquiry-form";

export const metadata: Metadata = {
  title: "Request tutoring | The Pi School",
  description:
    "Send The Pi School a tutoring inquiry about a student’s grade, course, and learning needs.",
};

export default function ContactPage() {
  const deliveryConfigured = Boolean(
    process.env.RESEND_API_KEY &&
      process.env.INQUIRY_FROM_EMAIL &&
      process.env.INQUIRY_TO_EMAIL,
  );

  return (
    <main className="public-page" id="main-content">
      <section aria-labelledby="contact-page-title" className="public-hero page-width">
        <p className="eyebrow eyebrow-dark">Start a conversation</p>
        <h1 id="contact-page-title">
          Request tutoring
          <br />
          <span>for a math course.</span>
        </h1>
        <p className="public-lede">
          Share the student’s grade or course and the help you’re looking for.
          We’ll only ask for the information needed to respond.
        </p>
        <Link className="inline-link" href="/tutoring">
          Review tutoring information <span aria-hidden="true">→</span>
        </Link>
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
            {!deliveryConfigured && (
              <p className="delivery-notice" role="status">
                Email delivery has not been configured for this local preview.
                Submissions will show an error and will not be reported as sent.
              </p>
            )}
          </div>
          <div className="inquiry-panel">
            <InquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
