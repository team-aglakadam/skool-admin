"use client"

import { Form } from "@/components/ui/form"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"
import { OnboardingHeader } from "@/components/onboarding/onboarding-header"
import { ProgressStepper } from "@/components/onboarding/progress-stepper"
import { StepNavigation } from "@/components/onboarding/step-navigation"
import { STUDENT_STEPS } from "../constants"
import { useStudentOnboarding } from "../hooks/use-student-onboarding"
import { PersonalInfoStep } from "./personal-info-step"
import { ParentInfoStep } from "./parent-info-step"
import { AcademicInfoStep } from "./academic-info-step"
import { AddressStep } from "./address-step"
import { DocumentsStep } from "./documents-step"
import { ReviewStep } from "./review-step"

export function StudentOnboardingForm() {
  const {
    form,
    currentStep,
    isSubmitting,
    isFirstStep,
    isLastStep,
    goToStep,
    goPrevious,
    handleSaveDraft,
    handleContinue,
  } = useStudentOnboarding()

  const isReviewStep = currentStep === STUDENT_STEPS.length - 1

  return (
    <div className="space-y-6">
      <OnboardingHeader
        title="Student Onboarding"
        description="Complete the form below to enroll a new student."
      />

      <OnboardingLayout
        stepper={
          <ProgressStepper steps={[...STUDENT_STEPS]} currentStep={currentStep} />
        }
      >
        <Form {...form}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void handleContinue()
            }}
            className="space-y-8"
          >
            {isReviewStep ? (
              <ReviewStep onEditStep={goToStep} />
            ) : currentStep === 0 ? (
              <PersonalInfoStep />
            ) : currentStep === 1 ? (
              <ParentInfoStep />
            ) : currentStep === 2 ? (
              <AcademicInfoStep />
            ) : currentStep === 3 ? (
              <AddressStep />
            ) : (
              <DocumentsStep />
            )}

            <StepNavigation
              onPrevious={goPrevious}
              onSaveDraft={handleSaveDraft}
              onContinue={() => void handleContinue()}
              continueLabel={isLastStep ? "Submit Student" : "Continue"}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </OnboardingLayout>
    </div>
  )
}
