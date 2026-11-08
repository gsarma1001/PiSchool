export type InquiryField =
  | "name"
  | "email"
  | "gradeOrCourse"
  | "helpWith";

export type InquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<InquiryField, string>>;
  values?: {
    name: string;
    email: string;
    gradeOrCourse: string;
    helpWith: string;
  };
};
