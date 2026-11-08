"use client";

import { useActionState } from "react";
import { submitInquiry } from "./actions";
import type { InquiryField, InquiryState } from "./inquiry-types";

const initialState: InquiryState = {
  status: "idle",
  message: "",
};

function fieldError(state: InquiryState, name: InquiryField) {
  return state.fieldErrors?.[name];
}

export function InquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState,
  );

  return (
    <form action={formAction} className="inquiry-form">
      {state.message && (
        <p
          aria-live="polite"
          className={`form-message form-message-${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="inquiry-name">Parent or guardian name</label>
          <input
            autoComplete="name"
            aria-describedby={fieldError(state, "name") ? "inquiry-name-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "name"))}
            defaultValue={state.values?.name ?? ""}
            id="inquiry-name"
            maxLength={80}
            minLength={2}
            name="name"
            required
          />
          {fieldError(state, "name") && (
            <span className="field-error" id="inquiry-name-error">
              {fieldError(state, "name")}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="inquiry-email">Email address</label>
          <input
            autoComplete="email"
            aria-describedby={fieldError(state, "email") ? "inquiry-email-error" : undefined}
            aria-invalid={Boolean(fieldError(state, "email"))}
            defaultValue={state.values?.email ?? ""}
            id="inquiry-email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
          {fieldError(state, "email") && (
            <span className="field-error" id="inquiry-email-error">
              {fieldError(state, "email")}
            </span>
          )}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="inquiry-grade-course">Student grade or course</label>
          <input
            aria-describedby={
              fieldError(state, "gradeOrCourse")
                ? "inquiry-grade-course-error"
                : undefined
            }
            aria-invalid={Boolean(fieldError(state, "gradeOrCourse"))}
            defaultValue={state.values?.gradeOrCourse ?? ""}
            id="inquiry-grade-course"
            maxLength={120}
            name="gradeOrCourse"
            placeholder="For example, Grade 8 or AP Calculus AB"
            required
          />
          {fieldError(state, "gradeOrCourse") && (
            <span className="field-error" id="inquiry-grade-course-error">
              {fieldError(state, "gradeOrCourse")}
            </span>
          )}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="inquiry-help">What would you like help with?</label>
          <textarea
            aria-describedby={
              fieldError(state, "helpWith")
                ? "inquiry-help-error inquiry-privacy-note"
                : "inquiry-privacy-note"
            }
            aria-invalid={Boolean(fieldError(state, "helpWith"))}
            defaultValue={state.values?.helpWith ?? ""}
            id="inquiry-help"
            maxLength={1200}
            minLength={2}
            name="helpWith"
            required
            rows={5}
          />
          {fieldError(state, "helpWith") && (
            <span className="field-error" id="inquiry-help-error">
              {fieldError(state, "helpWith")}
            </span>
          )}
          <span className="field-hint" id="inquiry-privacy-note">
            Please don’t include a student’s full name, birth date, health
            information, or other sensitive details.
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="honeypot-field">
        <label htmlFor="inquiry-website">Leave this field empty</label>
        <input
          autoComplete="off"
          id="inquiry-website"
          name="website"
          tabIndex={-1}
        />
      </div>

      <button className="button button-primary inquiry-submit" disabled={pending} type="submit">
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
