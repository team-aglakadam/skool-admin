import { format } from "date-fns"
import {
  CLASS_OPTIONS,
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SECTION_OPTIONS,
} from "./constants"
import type { StudentDraftData, StudentFormData } from "./types"

export function getStudentDefaultValues(): StudentFormData {
  return {
    fullName: "",
    dateOfBirth: undefined as unknown as Date,
    gender: "",
    mobile: "",
    email: "",
    photo: null,
    parentName: "",
    relationship: "",
    parentMobile: "",
    alternateContact: "",
    parentEmail: "",
    admissionNumber: "",
    class: "",
    section: "",
    rollNumber: "",
    admissionDate: null,
    previousSchool: "",
    currentStreet: "",
    currentCity: "",
    currentState: "",
    currentPostalCode: "",
    sameAsCurrent: true,
    permanentStreet: "",
    permanentCity: "",
    permanentState: "",
    permanentPostalCode: "",
    birthCertificate: null,
    transferCertificate: null,
    studentPhotograph: null,
    otherDocuments: null,
  }
}

export function formatDateValue(date?: Date | null) {
  if (!date) return "—"
  return format(date, "yyyy-MM-dd")
}

export function getGenderLabel(value?: string) {
  return GENDER_OPTIONS.find((option) => option.value === value)?.label ?? value
}

export function getRelationshipLabel(value?: string) {
  return (
    RELATIONSHIP_OPTIONS.find((option) => option.value === value)?.label ??
    value
  )
}

export function getClassLabel(value?: string) {
  return CLASS_OPTIONS.find((option) => option.value === value)?.label ?? value
}

export function getSectionLabel(value?: string) {
  return SECTION_OPTIONS.find((option) => option.value === value)?.label ?? value
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

export function getUploadedDocumentNames(data: StudentFormData) {
  const documents: string[] = []
  if (data.birthCertificate) documents.push("Birth Certificate")
  if (data.transferCertificate) documents.push("Transfer Certificate")
  if (data.studentPhotograph) documents.push("Student Photo")
  if (data.otherDocuments) documents.push("Other Documents")
  return documents
}

export function serializeStudentDraft(
  data: StudentFormData,
  currentStep: number
): StudentDraftData {
  const { dateOfBirth, admissionDate, ...rest } = data
  return {
    ...rest,
    dateOfBirth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : undefined,
    admissionDate: admissionDate
      ? format(admissionDate, "yyyy-MM-dd")
      : undefined,
    currentStep,
  }
}

export function deserializeStudentDraft(draft: StudentDraftData): {
  values: Partial<StudentFormData>
  currentStep: number
} {
  const { dateOfBirth, admissionDate, currentStep = 0, ...rest } = draft
  return {
    values: {
      ...rest,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      admissionDate: admissionDate ? new Date(admissionDate) : null,
    },
    currentStep,
  }
}
