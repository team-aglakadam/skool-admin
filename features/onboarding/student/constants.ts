export const STUDENT_STEPS = [
  { id: "personal", label: "Personal" },
  { id: "parent", label: "Parent" },
  { id: "academic", label: "Academic" },
  { id: "address", label: "Address" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
] as const

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const

export const RELATIONSHIP_OPTIONS = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other" },
] as const

export const CLASS_OPTIONS = [
  { value: "grade-1", label: "Grade 1" },
  { value: "grade-2", label: "Grade 2" },
  { value: "grade-3", label: "Grade 3" },
  { value: "grade-4", label: "Grade 4" },
  { value: "grade-5", label: "Grade 5" },
  { value: "grade-6", label: "Grade 6" },
  { value: "grade-7", label: "Grade 7" },
  { value: "grade-8", label: "Grade 8" },
  { value: "grade-9", label: "Grade 9" },
  { value: "grade-10", label: "Grade 10" },
  { value: "grade-11", label: "Grade 11" },
  { value: "grade-12", label: "Grade 12" },
] as const

export const SECTION_OPTIONS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
] as const

export const STUDENT_STEP_FIELDS = {
  personal: [
    "fullName",
    "dateOfBirth",
    "gender",
    "mobile",
    "email",
    "photo",
  ],
  parent: [
    "parentName",
    "relationship",
    "parentMobile",
    "alternateContact",
    "parentEmail",
  ],
  academic: [
    "admissionNumber",
    "class",
    "section",
    "rollNumber",
    "admissionDate",
    "previousSchool",
  ],
  address: [
    "currentStreet",
    "currentCity",
    "currentState",
    "currentPostalCode",
    "sameAsCurrent",
    "permanentStreet",
    "permanentCity",
    "permanentState",
    "permanentPostalCode",
  ],
  documents: [
    "birthCertificate",
    "transferCertificate",
    "studentPhotograph",
    "otherDocuments",
  ],
} as const

export const STUDENT_DRAFT_STORAGE_KEY = "student-onboarding-draft"
