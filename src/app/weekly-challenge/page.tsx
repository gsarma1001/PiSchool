import { permanentRedirect } from "next/navigation";

export default function WeeklyChallengeRedirect() {
  permanentRedirect("/daily-challenge");
}
