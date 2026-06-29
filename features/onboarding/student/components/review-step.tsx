"use client"

import { AlertCircle, CheckCircle2, GraduationCap, Home, Paperclip, User, Users } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ReviewSection } from "@/components/onboarding/review-section"
import { StepHeader } from "@/components/onboarding/step-header"
import { STUDENT_STEPS } from "../constants"
import type { StudentFormData } from "../types"
import {
  formatAddress,
  formatDateValue,
  getClassLabel,
  getGenderLabel,
  getRelationshipLabel,
  getSectionLabel,
  getUploadedDocumentNames,
} from "../utils"

interface ReviewStepProps {
  onEditStep: (step: number) => void
}

export function ReviewStep({ onEditStep }: ReviewStepProps) {
  const form = useFormContext<StudentFormData>()
  const data = form.getValues()

  const currentAddress = formatAddress(
    data.currentStreet,
    data.currentCity,
    data.currentState,
    data.currentPostalCode
  )

  const permanentAddress = data.sameAsCurrent
    ? currentAddress
    : formatAddress(
        data.permanentStreet,
        data.permanentCity,
        data.permanentState,
        data.permanentPostalCode
      )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StepHeader
          stepNumber={6}
          totalSteps={STUDENT_STEPS.length}
          title="Review"
          description="Final review before submission."
        />
        <Badge className="w-fit border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
          <CheckCircle2 className="size-3.5" />
          Ready to submit
        </Badge>
      </div>

      <Alert className="border-amber-200 bg-amber-50 text-amber-900">
        <AlertCircle className="size-4 text-amber-600" />
        <AlertDescription>
          Review all details carefully before submitting. Click &quot;Edit&quot; on
          any section to make changes.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <ReviewSection
          icon={User}
          title="Personal Information"
          onEdit={() => onEditStep(0)}
          fields={[
            { label: "Full Name", value: data.fullName },
            { label: "Gender", value: getGenderLabel(data.gender) },
            { label: "Email", value: data.email },
            { label: "Date of Birth", value: formatDateValue(data.dateOfBirth) },
            { label: "Mobile", value: data.mobile },
          ]}
        />

        <ReviewSection
          icon={Users}
          title="Parent / Guardian"
          onEdit={() => onEditStep(1)}
          fields={[
            { label: "Name", value: data.parentName },
            {
              label: "Relationship",
              value: getRelationshipLabel(data.relationship),
            },
            { label: "Mobile", value: data.parentMobile },
            { label: "Email", value: data.parentEmail },
          ]}
        />

        <ReviewSection
          icon={GraduationCap}
          title="Academic Details"
          onEdit={() => onEditStep(2)}
          fields={[
            { label: "Admission No.", value: data.admissionNumber },
            {
              label: "Class & Section",
              value: `${getClassLabel(data.class)} · ${getSectionLabel(data.section)}`,
            },
            { label: "Roll Number", value: data.rollNumber },
            { label: "Previous School", value: data.previousSchool },
          ]}
        />

        <ReviewSection
          icon={Home}
          title="Address"
          onEdit={() => onEditStep(3)}
          fields={[
            { label: "Current Address", value: currentAddress },
            { label: "City", value: data.currentCity },
            { label: "State", value: data.currentState },
            { label: "Postal Code", value: data.currentPostalCode },
            { label: "Permanent Address", value: permanentAddress },
          ]}
        />

        <ReviewSection
          icon={Paperclip}
          title="Documents"
          onEdit={() => onEditStep(4)}
          fields={[]}
          documents={getUploadedDocumentNames(data)}
        />
      </div>
    </div>
  )
}
