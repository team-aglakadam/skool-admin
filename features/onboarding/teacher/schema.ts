import { z } from "zod"

const phoneRegex = /^[6-9]\d{9}$/
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/

export const teacherPersonalSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  gender: z.string().min(1, "Gender is required"),
  mobile: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
  photo: z.instanceof(File).nullable().optional(),
})

export const professionalInfoSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  joiningDate: z.date({ message: "Joining date is required" }),
  specialization: z.string().optional(),
})

export const teacherAddressFieldsSchema = z.object({
  currentStreet: z.string().min(1, "Street address is required"),
  currentCity: z.string().min(1, "City is required"),
  currentState: z.string().min(1, "State is required"),
  currentPostalCode: z
    .string()
    .min(6, "Postal code must be 6 characters")
    .max(6, "Postal code must be 6 characters"),
  sameAsCurrent: z.boolean(),
  permanentStreet: z.string(),
  permanentCity: z.string(),
  permanentState: z.string(),
  permanentPostalCode: z.string(),
})

export const teacherAddressSchema = teacherAddressFieldsSchema.superRefine(
  (data, ctx) => {
    if (data.sameAsCurrent) return

    if (!data.permanentStreet) {
      ctx.addIssue({
        code: "custom",
        message: "Street address is required",
        path: ["permanentStreet"],
      })
    }
    if (!data.permanentCity) {
      ctx.addIssue({
        code: "custom",
        message: "City is required",
        path: ["permanentCity"],
      })
    }
    if (!data.permanentState) {
      ctx.addIssue({
        code: "custom",
        message: "State is required",
        path: ["permanentState"],
      })
    }
    if (!data.permanentPostalCode || data.permanentPostalCode.length !== 6) {
      ctx.addIssue({
        code: "custom",
        message: "Valid postal code is required",
        path: ["permanentPostalCode"],
      })
    }
  }
)

export const bankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  accountNumber: z
    .string()
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number is too long"),
  bankName: z.string().min(2, "Bank name is required"),
  ifscCode: z
    .string()
    .regex(ifscRegex, "Enter a valid IFSC code (e.g. SBIN0001234)"),
  branchName: z.string().min(2, "Branch name is required"),
})

export const teacherDocumentsSchema = z.object({
  resume: z.instanceof(File).nullable().optional(),
  idProof: z.instanceof(File).nullable().optional(),
  certificates: z.instanceof(File).nullable().optional(),
  photograph: z.instanceof(File).nullable().optional(),
})

export const teacherFormSchema = teacherPersonalSchema
  .merge(professionalInfoSchema)
  .merge(teacherAddressFieldsSchema)
  .merge(bankDetailsSchema)
  .merge(teacherDocumentsSchema)

export const teacherStepSchemas = [
  teacherPersonalSchema,
  professionalInfoSchema,
  teacherAddressSchema,
  bankDetailsSchema,
  teacherDocumentsSchema,
] as const
