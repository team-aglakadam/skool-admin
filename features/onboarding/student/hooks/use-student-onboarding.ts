"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { STUDENT_DRAFT_STORAGE_KEY, STUDENT_STEPS } from "../constants"
import { studentStepSchemas } from "../schema"
import type { StudentFormData } from "../types"
import {
  deserializeStudentDraft,
  getStudentDefaultValues,
  serializeStudentDraft,
} from "../utils"
import { saveStudentDraft, submitStudentOnboarding } from "../actions"
import type { StudentDraftData } from "../types"

export function useStudentOnboarding() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<StudentFormData>({
    defaultValues: getStudentDefaultValues(),
    mode: "onTouched",
  })

  React.useEffect(() => {
    const stored = localStorage.getItem(STUDENT_DRAFT_STORAGE_KEY)
    if (!stored) return

    try {
      const draft = JSON.parse(stored) as StudentDraftData
      const { values, currentStep: savedStep } = deserializeStudentDraft(draft)
      form.reset({ ...getStudentDefaultValues(), ...values })
      setCurrentStep(savedStep)
    } catch {
      localStorage.removeItem(STUDENT_DRAFT_STORAGE_KEY)
    }
  }, [form])

  const validateCurrentStep = async () => {
    const schema = studentStepSchemas[currentStep]
    if (!schema) return true

    const values = form.getValues()
    const result = schema.safeParse(values)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]
        if (typeof fieldName === "string") {
          form.setError(fieldName as keyof StudentFormData, {
            message: issue.message,
          })
        }
      })
      return false
    }

    return true
  }

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, STUDENT_STEPS.length - 1)))
  }

  const goNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return false

    if (currentStep < STUDENT_STEPS.length - 1) {
      setCurrentStep((step) => step + 1)
    }
    return true
  }

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(0, step - 1))
  }

  const handleSaveDraft = async () => {
    const values = form.getValues()
    const draft = serializeStudentDraft(values, currentStep)
    localStorage.setItem(STUDENT_DRAFT_STORAGE_KEY, JSON.stringify(draft))

    try {
      await saveStudentDraft(values)
      toast.success("Draft saved successfully")
    } catch {
      toast.error("Failed to save draft")
    }
  }

  const handleSubmit = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    setIsSubmitting(true)
    try {
      const values = form.getValues()
      const result = await submitStudentOnboarding(values)
      localStorage.removeItem(STUDENT_DRAFT_STORAGE_KEY)
      toast.success(result.message)
      form.reset(getStudentDefaultValues())
      setCurrentStep(0)
    } catch {
      toast.error("Failed to submit student onboarding")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = async () => {
    if (currentStep === STUDENT_STEPS.length - 1) {
      await handleSubmit()
      return
    }
    await goNext()
  }

  return {
    form,
    currentStep,
    isSubmitting,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === STUDENT_STEPS.length - 1,
    goToStep,
    goNext,
    goPrevious,
    handleSaveDraft,
    handleContinue,
    handleSubmit,
  }
}
