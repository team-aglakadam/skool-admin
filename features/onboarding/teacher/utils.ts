import { format } from "date-fns"
import {
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  GENDER_OPTIONS,
  QUALIFICATION_OPTIONS,
} from "./constants"
import type { TeacherDraftData, TeacherFormData } from "./types"

export function getTeacherDefaultValues(): TeacherFormData {
  return {
    fullName: "",
    dateOfBirth: undefined as unknown as Date,
    gender: "",
    mobile: "",
    email: "",
    photo: null,
    employeeId: "",
    designation: "",
    department: "",
    qualification: "",
    experience: "",
    joiningDate: undefined as unknown as Date,
    specialization: "",
    currentStreet: "",
    currentCity: "",
    currentState: "",
    currentPostalCode: "",
    sameAsCurrent: true,
    permanentStreet: "",
    permanentCity: "",
    permanentState: "",
    permanentPostalCode: "",
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
    resume: null,
    idProof: null,
    certificates: null,
    photograph: null,
  }
}

export function formatDateValue(date?: Date | null) {
  if (!date) return "—"
  return format(date, "yyyy-MM-dd")
}

export function getGenderLabel(value?: string) {
  return GENDER_OPTIONS.find((option) => option.value === value)?.label ?? value
}

export function getDesignationLabel(value?: string) {
  return (
    DESIGNATION_OPTIONS.find((option) => option.value === value)?.label ?? value
  )
}

export function getDepartmentLabel(value?: string) {
  return (
    DEPARTMENT_OPTIONS.find((option) => option.value === value)?.label ?? value
  )
}

export function getQualificationLabel(value?: string) {
  return (
    QUALIFICATION_OPTIONS.find((option) => option.value === value)?.label ??
    value
  )
}

export function formatAddress(
  street?: string,
  city?: string,
  state?: string,
  postalCode?: string
) {
  const parts = [street, city, state, postalCode].filter(Boolean)
  return parts.length > 0 ? parts.join(", ") : "—"
}

export function getUploadedDocumentNames(data: TeacherFormData) {
  const documents: string[] = []
  if (data.resume) documents.push("Resume")
  if (data.idProof) documents.push("ID Proof")
  if (data.certificates) documents.push("Certificates")
  if (data.photograph) documents.push("Photograph")
  return documents
}

export function serializeTeacherDraft(
  data: TeacherFormData,
  currentStep: number
): TeacherDraftData {
  const { dateOfBirth, joiningDate, ...rest } = data
  return {
    ...rest,
    dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : undefined,
    joiningDate: joiningDate ? format(joiningDate, "yyyy-MM-dd") : undefined,
    currentStep,
  }
}

export function deserializeTeacherDraft(draft: TeacherDraftData): {
  values: Partial<TeacherFormData>
  currentStep: number
} {
  const { dateOfBirth, joiningDate, currentStep = 0, ...rest } = draft
  return {
    values: {
      ...rest,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
    },
    currentStep,
  }
}
