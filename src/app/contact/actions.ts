"use server";

import "server-only";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import type { InquiryState } from "./inquiry-types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const attemptsByClient = new Map<string, { count: number; resetAt: number }>();
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxAttempts = 4;

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateInquiry(formData: FormData) {
  const inquiry = {
    name: readText(formData, "name"),
    email: readText(formData, "email"),
    gradeOrCourse: readText(formData, "gradeOrCourse"),
    helpWith: readText(formData, "helpWith"),
  };
  const fieldErrors: NonNullable<InquiryState["fieldErrors"]> = {};

  if (inquiry.name.length < 2 || inquiry.name.length > 80) {
    fieldErrors.name = "Enter a name between 2 and 80 characters.";
  }
  if (
    inquiry.email.length > 254 ||
    !emailPattern.test(inquiry.email)
  ) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (
    inquiry.gradeOrCourse.length < 1 ||
    inquiry.gradeOrCourse.length > 120
  ) {
    fieldErrors.gradeOrCourse =
      "Enter a student grade or course (up to 120 characters).";
  }
  if (inquiry.helpWith.length < 2 || inquiry.helpWith.length > 1200) {
    fieldErrors.helpWith =
      "Tell us what help is needed (2–1,200 characters).";
  }

  return { inquiry, fieldErrors };
}

async function isRateLimited(): Promise<boolean> {
  let clientAddress = "unknown";

  try {
    const requestHeaders = await headers();
    const forwardedAddress = requestHeaders
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    clientAddress = forwardedAddress || requestHeaders.get("x-real-ip") || "unknown";
  } catch (error) {
    console.error(
      "Inquiry rate-limit headers could not be read. Falling back to a single shared client bucket.",
      error instanceof Error ? error.message : "Unknown header read error",
    );
  }

  const clientKey = createHash("sha256").update(clientAddress).digest("hex");
  const now = Date.now();

  for (const [key, record] of attemptsByClient) {
    if (record.resetAt <= now) attemptsByClient.delete(key);
  }

  const previous = attemptsByClient.get(clientKey);
  if (previous && previous.resetAt > now && previous.count >= rateLimitMaxAttempts) {
    return true;
  }

  attemptsByClient.set(
    clientKey,
    previous && previous.resetAt > now
      ? { count: previous.count + 1, resetAt: previous.resetAt }
      : { count: 1, resetAt: now + rateLimitWindowMs },
  );
  return false;
}

export async function submitInquiry(
  _previousState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  if (readText(formData, "website")) {
    return {
      status: "error",
      message: "We couldn’t submit the inquiry. Please check the form and try again.",
    };
  }

  const { inquiry, fieldErrors } = validateInquiry(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
      values: inquiry,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.INQUIRY_FROM_EMAIL;
  const recipient = process.env.INQUIRY_TO_EMAIL;

  if (!apiKey || !fromAddress || !recipient) {
    return {
      status: "error",
      message:
        "The inquiry form is not configured yet. No message was sent. Please try again after the site owner finishes the email setup.",
      values: inquiry,
    };
  }

  if (!emailPattern.test(fromAddress) || !emailPattern.test(recipient)) {
    console.error("Inquiry delivery configuration contains an invalid email address.");
    return {
      status: "error",
      message:
        "The inquiry form is temporarily unavailable because its email setup is invalid. No message was sent.",
      values: inquiry,
    };
  }

  if (await isRateLimited()) {
    return {
      status: "error",
      message:
        "Too many inquiries were submitted from this connection. Please wait a few minutes before trying again.",
      values: inquiry,
    };
  }

  const message = [
    "New tutoring inquiry",
    "",
    `Name: ${inquiry.name}`,
    `Reply email: ${inquiry.email}`,
    `Student grade or course: ${inquiry.gradeOrCourse}`,
    "",
    "What they would like help with:",
    inquiry.helpWith,
  ].join("\n");

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Pi School <${fromAddress}>`,
        to: [recipient],
        reply_to: inquiry.email,
        subject: "New tutoring inquiry",
        text: message,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error(
      "Inquiry delivery request failed.",
      error instanceof Error ? error.message : "Unknown network error",
    );
    return {
      status: "error",
      message:
        "We couldn’t confirm whether your inquiry was sent. Please contact The Pi School before trying again to avoid sending it twice.",
      values: inquiry,
    };
  }

  if (!response.ok) {
    console.error(
      `Inquiry delivery provider rejected the request (HTTP ${response.status}).`,
    );
    return {
      status: "error",
      message: response.status >= 500
        ? "We couldn’t confirm whether your inquiry was sent. Please contact The Pi School before trying again to avoid sending it twice."
        : "We couldn’t deliver your inquiry right now. Please try again later.",
      values: inquiry,
    };
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch (error) {
    console.error(
      "Resend accepted the inquiry, but its response could not be parsed.",
      error instanceof Error ? error.message : "Unknown response parsing error",
    );
  }

  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "id" in responseBody &&
    typeof responseBody.id === "string"
  ) {
    console.info(`Resend accepted the inquiry. Message ID: ${responseBody.id}`);
  } else {
    console.info(
      `Resend accepted the inquiry (HTTP ${response.status}) without returning a message ID.`,
    );
  }

  return {
    status: "success",
    message: "Thanks! Your inquiry was sent to The Pi School.",
  };
}
