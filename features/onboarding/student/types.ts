import type { z } from "zod"
import type { studentFormSchema } from "./schema"

export type StudentFormData = z.infer<typeof studentFormSchema>

export type StudentStepId = (typeof import("./constants").STUDENT_STEPS)[number]["id"]

export interface StudentDraftData
  extends Omit<
    StudentFormData,
    | "dateOfBirth"
    | "admissionDate"
    | "photo"
    | "birthCertificate"
    | "transferCertificate"
    | "studentPhotograph"
    | "otherDocuments"
  > {
  dateOfBirth?: string
  admissionDate?: string
  currentStep?: number
}
