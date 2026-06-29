import { z } from "zod"

const phoneRegex = /^[6-9]\d{9}$/

export const addressFieldsSchema = z.object({
  currentStreet: z.string().min(1, "Street address is required"),
  currentCity: z.string().min(1, "City is required"),
  currentState: z.string().min(1, "State is required"),
  currentPostalCode: z
    .string()
    .min(6, "Postal code must be at least 6 characters")
    .max(6, "Postal code must be 6 characters"),
  sameAsCurrent: z.boolean(),
  permanentStreet: z.string(),
  permanentCity: z.string(),
  permanentState: z.string(),
  permanentPostalCode: z.string(),
})

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  gender: z.string().min(1, "Gender is required"),
  mobile: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  email: z
    .string()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional(),
  photo: z.instanceof(File).nullable().optional(),
})

export const parentInfoSchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  parentMobile: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  alternateContact: z.string().optional(),
  parentEmail: z
    .string()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional(),
})

export const academicInfoSchema = z.object({
  admissionNumber: z.string().min(1, "Admission number is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  admissionDate: z.date().optional().nullable(),
  previousSchool: z.string().optional(),
})

export const addressSchema = addressFieldsSchema.superRefine((data, ctx) => {
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
})

export const documentsSchema = z.object({
  birthCertificate: z.instanceof(File).nullable().optional(),
  transferCertificate: z.instanceof(File).nullable().optional(),
  studentPhotograph: z.instanceof(File).nullable().optional(),
  otherDocuments: z.instanceof(File).nullable().optional(),
})

export const studentFormSchema = personalInfoSchema
  .merge(parentInfoSchema)
  .merge(academicInfoSchema)
  .merge(addressFieldsSchema)
  .merge(documentsSchema)

export const studentStepSchemas = [
  personalInfoSchema,
  parentInfoSchema,
  academicInfoSchema,
  addressSchema,
  documentsSchema,
] as const

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>
export type ParentInfoValues = z.infer<typeof parentInfoSchema>
export type AcademicInfoValues = z.infer<typeof academicInfoSchema>
export type AddressValues = z.infer<typeof addressSchema>
export type DocumentsValues = z.infer<typeof documentsSchema>
