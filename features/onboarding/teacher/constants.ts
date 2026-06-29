export const TEACHER_STEPS = [
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Professional" },
  { id: "address", label: "Address" },
  { id: "bank", label: "Bank" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
] as const

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const

export const DEPARTMENT_OPTIONS = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "social-studies", label: "Social Studies" },
  { value: "computer-science", label: "Computer Science" },
  { value: "physical-education", label: "Physical Education" },
  { value: "arts", label: "Arts" },
  { value: "languages", label: "Languages" },
] as const

export const DESIGNATION_OPTIONS = [
  { value: "teacher", label: "Teacher" },
  { value: "senior-teacher", label: "Senior Teacher" },
  { value: "head-of-department", label: "Head of Department" },
  { value: "vice-principal", label: "Vice Principal" },
  { value: "principal", label: "Principal" },
] as const

export const QUALIFICATION_OPTIONS = [
  { value: "b-ed", label: "B.Ed" },
  { value: "m-ed", label: "M.Ed" },
  { value: "b-sc", label: "B.Sc" },
  { value: "m-sc", label: "M.Sc" },
  { value: "ba", label: "B.A" },
  { value: "ma", label: "M.A" },
  { value: "phd", label: "Ph.D" },
  { value: "other", label: "Other" },
] as const

export const TEACHER_DRAFT_STORAGE_KEY = "teacher-onboarding-draft"
