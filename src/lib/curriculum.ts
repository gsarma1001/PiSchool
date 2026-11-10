export const elementaryChallengeLevels = [
  {
    id: "kindergarten",
    label: "Kindergarten",
    courseId: "arithmetic-number-sense",
    order: 0,
  },
  { id: "grade-1", label: "Grade 1", courseId: "arithmetic-number-sense", order: 1 },
  { id: "grade-2", label: "Grade 2", courseId: "arithmetic-number-sense", order: 2 },
  { id: "grade-3", label: "Grade 3", courseId: "arithmetic-number-sense", order: 3 },
  { id: "grade-4", label: "Grade 4", courseId: "arithmetic-number-sense", order: 4 },
  { id: "grade-5", label: "Grade 5", courseId: "arithmetic-number-sense", order: 5 },
] as const;

export type ElementaryLevelId =
  (typeof elementaryChallengeLevels)[number]["id"];
export type ElementaryLevelLabel =
  (typeof elementaryChallengeLevels)[number]["label"];

export const usGradeFilterOptions = [
  { id: "kindergarten", label: "Kindergarten (US)" },
  ...Array.from({ length: 12 }, (_, index) => ({
    id: `grade-${index + 1}`,
    label: `Grade ${index + 1} (US)`,
  })),
] as const;

export type UsGradeId = (typeof usGradeFilterOptions)[number]["id"];

export const curriculumLevelLabels = [
  "Kindergarten",
  ...Array.from({ length: 12 }, (_, index) => `Grade ${index + 1}`),
  "Middle school (Grades 6–8)",
  "High school (Grades 9–12)",
  "College and advanced math",
] as const;

export const curriculumRangeLabel = "Kindergarten through advanced math";
