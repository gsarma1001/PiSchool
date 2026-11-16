export type TutorProfile = {
  id: string;
  name: string;
  bio: string;
  subjects: string;
  rate: string;
  lessonLength: string;
  reviewStatus: "pending" | "approved";
};

export const trialLesson = {
  length: "45-minute",
  format: "One-on-one",
} as const;

export const tutors: TutorProfile[] = [
  {
    id: "abhay",
    name: "Abhay",
    bio: "Founded The Pi School and is a first-year student in UC Berkeley’s Management, Entrepreneurship, & Technology (M.E.T.) program.",
    subjects: "Advanced math from Precalculus onward",
    rate: "$25",
    lessonLength: "50 minutes",
    reviewStatus: "pending",
  },
  {
    id: "sneha",
    name: "Sneha",
    bio: "A high school student who loves math.",
    subjects: "Elementary and middle school math, with support through Algebra 2",
    rate: "$20",
    lessonLength: "45 minutes",
    reviewStatus: "pending",
  },
  {
    id: "meera",
    name: "Meera",
    bio: "A middle school student who teaches elementary math.",
    subjects: "Elementary math",
    rate: "$20",
    lessonLength: "45 minutes",
    reviewStatus: "pending",
  },
];
