import type { z } from "zod"
import type { teacherFormSchema } from "./schema"

export type TeacherFormData = z.infer<typeof teacherFormSchema>

export interface TeacherDraftData
  extends Omit<
    TeacherFormData,
    | "dateOfBirth"
    | "joiningDate"
    | "photo"
    | "resume"
    | "idProof"
    | "certificates"
    | "photograph"
  > {
  dateOfBirth?: string
  joiningDate?: string
  currentStep?: number
}
