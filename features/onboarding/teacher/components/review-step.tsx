"use client"

import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  CreditCard,
  Home,
  Paperclip,
  User,
} from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ReviewSection } from "@/components/onboarding/review-section"
import { StepHeader } from "@/components/onboarding/step-header"
import { TEACHER_STEPS } from "../constants"
import type { TeacherFormData } from "../types"
import {
  formatAddress,
  formatDateValue,
  getDepartmentLabel,
  getDesignationLabel,
  getGenderLabel,
  getQualificationLabel,
  getUploadedDocumentNames,
} from "../utils"

interface ReviewStepProps {
  onEditStep: (step: number) => void
}

export function ReviewStep({ onEditStep }: ReviewStepProps) {
  const form = useFormContext<TeacherFormData>()
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
          totalSteps={TEACHER_STEPS.length}
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
          icon={Briefcase}
          title="Professional Details"
          onEdit={() => onEditStep(1)}
          fields={[
            { label: "Employee ID", value: data.employeeId },
            {
              label: "Designation",
              value: getDesignationLabel(data.designation),
            },
            {
              label: "Department",
              value: getDepartmentLabel(data.department),
            },
            {
              label: "Qualification",
              value: getQualificationLabel(data.qualification),
            },
            { label: "Experience", value: `${data.experience} years` },
            {
              label: "Joining Date",
              value: formatDateValue(data.joiningDate),
            },
          ]}
        />

        <ReviewSection
          icon={Home}
          title="Address"
          onEdit={() => onEditStep(2)}
          fields={[
            { label: "Current Address", value: currentAddress },
            { label: "Permanent Address", value: permanentAddress },
          ]}
        />

        <ReviewSection
          icon={CreditCard}
          title="Bank Details"
          onEdit={() => onEditStep(3)}
          fields={[
            { label: "Account Holder", value: data.accountHolderName },
            { label: "Account Number", value: data.accountNumber },
            { label: "Bank Name", value: data.bankName },
            { label: "IFSC Code", value: data.ifscCode },
            { label: "Branch", value: data.branchName },
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
