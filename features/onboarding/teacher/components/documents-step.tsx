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
import { TEACHER_STEPS } from "../constants"
import type { TeacherFormData } from "../types"

const DOCUMENT_SLOTS = [
  {
    name: "resume" as const,
    title: "Resume / CV",
    description: "Updated resume with work history",
    requirements: "PDF, DOC · Max 10MB",
    accept: ".pdf,.doc,.docx",
  },
  {
    name: "idProof" as const,
    title: "ID Proof",
    description: "Aadhar, PAN, or government-issued ID",
    requirements: "PDF, JPG, PNG · Max 10MB",
  },
  {
    name: "certificates" as const,
    title: "Certificates",
    description: "Educational and professional certificates",
    requirements: "PDF, JPG, PNG · Max 10MB",
  },
  {
    name: "photograph" as const,
    title: "Photograph",
    description: "Recent passport-size photograph",
    requirements: "JPG, PNG · Max 10MB",
    accept: "image/jpeg,image/png",
  },
]

export function DocumentsStep() {
  const form = useFormContext<TeacherFormData>()

  return (
    <div className="space-y-6">
      <StepHeader
        stepNumber={5}
        totalSteps={TEACHER_STEPS.length}
        title="Documents"
        description="Required documents for onboarding."
      />

      <p className="text-sm text-muted-foreground">
        Upload clear copies of all required documents. Files are encrypted and
        stored securely.
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
