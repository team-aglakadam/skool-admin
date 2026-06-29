"use client"

import { Form } from "@/components/ui/form"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"
import { OnboardingHeader } from "@/components/onboarding/onboarding-header"
import { ProgressStepper } from "@/components/onboarding/progress-stepper"
import { StepNavigation } from "@/components/onboarding/step-navigation"
import { TEACHER_STEPS } from "../constants"
import { useTeacherOnboarding } from "../hooks/use-teacher-onboarding"
import { PersonalInfoStep } from "./personal-info-step"
import { ProfessionalInfoStep } from "./professional-info-step"
import { AddressStep } from "./address-step"
import { BankDetailsStep } from "./bank-details-step"
import { DocumentsStep } from "./documents-step"
import { ReviewStep } from "./review-step"

export function TeacherOnboardingForm() {
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
  } = useTeacherOnboarding()

  const isReviewStep = currentStep === TEACHER_STEPS.length - 1

  return (
    <div className="space-y-6">
      <OnboardingHeader
        title="Teacher Onboarding"
        description="Complete the form below to onboard a new teacher."
      />

      <OnboardingLayout
        stepper={
          <ProgressStepper steps={[...TEACHER_STEPS]} currentStep={currentStep} />
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
              <ProfessionalInfoStep />
            ) : currentStep === 2 ? (
              <AddressStep />
            ) : currentStep === 3 ? (
              <BankDetailsStep />
            ) : (
              <DocumentsStep />
            )}

            <StepNavigation
              onPrevious={goPrevious}
              onSaveDraft={handleSaveDraft}
              onContinue={() => void handleContinue()}
              continueLabel={isLastStep ? "Submit Teacher" : "Continue"}
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
