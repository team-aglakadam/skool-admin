"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { DocumentUploadSlot } from "@/components/onboarding/document-upload-slot"
import { StepHeader } from "@/components/onboarding/step-header"
import { STUDENT_STEPS } from "../constants"
import type { StudentFormData } from "../types"

const DOCUMENT_SLOTS = [
  {
    name: "birthCertificate" as const,
    title: "Birth Certificate",
    description: "Official certificate from municipal authority",
    requirements: "PDF, JPG, PNG · Max 10MB",
  },
  {
    name: "transferCertificate" as const,
    title: "Transfer Certificate",
    description: "TC from previous school, if applicable",
    requirements: "PDF, JPG, PNG · Max 10MB",
  },
  {
    name: "studentPhotograph" as const,
    title: "Student Photograph",
    description: "Recent passport-size photograph",
    requirements: "JPG, PNG · Max 10MB",
    accept: "image/jpeg,image/png",
  },
  {
    name: "otherDocuments" as const,
    title: "Other Documents",
    description: "Aadhar, caste certificate, or any supporting docs",
    requirements: "PDF, JPG, PNG · Max 10MB",
  },
]

export function DocumentsStep() {
  const form = useFormContext<StudentFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={5}
        totalSteps={STUDENT_STEPS.length}
        title="Documents"
        description="Required documents for enrollment."
      />

      <p className="text-sm text-muted-foreground">
        Upload clear, legible copies of all required documents. Files are
        encrypted and stored securely.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {DOCUMENT_SLOTS.map((slot) => (
          <FormField
            key={slot.name}
            control={form.control}
            name={slot.name}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DocumentUploadSlot
                    title={slot.title}
                    description={slot.description}
                    requirements={slot.requirements}
                    value={field.value}
                    onChange={field.onChange}
                    accept={slot.accept}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  )
}
