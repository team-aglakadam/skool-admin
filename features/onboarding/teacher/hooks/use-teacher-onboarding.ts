"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { TEACHER_DRAFT_STORAGE_KEY, TEACHER_STEPS } from "../constants"
import { teacherStepSchemas } from "../schema"
import type { TeacherDraftData, TeacherFormData } from "../types"
import {
  deserializeTeacherDraft,
  getTeacherDefaultValues,
  serializeTeacherDraft,
} from "../utils"
import { saveTeacherDraft, submitTeacherOnboarding } from "../actions"

export function useTeacherOnboarding() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<TeacherFormData>({
    defaultValues: getTeacherDefaultValues(),
    mode: "onTouched",
  })

  React.useEffect(() => {
    const stored = localStorage.getItem(TEACHER_DRAFT_STORAGE_KEY)
    if (!stored) return

    try {
      const draft = JSON.parse(stored) as TeacherDraftData
      const { values, currentStep: savedStep } = deserializeTeacherDraft(draft)
      form.reset({ ...getTeacherDefaultValues(), ...values })
      setCurrentStep(savedStep)
    } catch {
      localStorage.removeItem(TEACHER_DRAFT_STORAGE_KEY)
    }
  }, [form])

  const validateCurrentStep = async () => {
    const schema = teacherStepSchemas[currentStep]
    if (!schema) return true

    const values = form.getValues()
    const result = schema.safeParse(values)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]
        if (typeof fieldName === "string") {
          form.setError(fieldName as keyof TeacherFormData, {
            message: issue.message,
          })
        }
      })
      return false
    }

    return true
  }

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, TEACHER_STEPS.length - 1)))
  }

  const goNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return false

    if (currentStep < TEACHER_STEPS.length - 1) {
      setCurrentStep((step) => step + 1)
    }
    return true
  }

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(0, step - 1))
  }

  const handleSaveDraft = async () => {
    const values = form.getValues()
    const draft = serializeTeacherDraft(values, currentStep)
    localStorage.setItem(TEACHER_DRAFT_STORAGE_KEY, JSON.stringify(draft))

    try {
      await saveTeacherDraft(values)
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
      const result = await submitTeacherOnboarding(values)
      localStorage.removeItem(TEACHER_DRAFT_STORAGE_KEY)
      toast.success(result.message)
      form.reset(getTeacherDefaultValues())
      setCurrentStep(0)
    } catch {
      toast.error("Failed to submit teacher onboarding")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = async () => {
    if (currentStep === TEACHER_STEPS.length - 1) {
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
    isLastStep: currentStep === TEACHER_STEPS.length - 1,
    goToStep,
    goNext,
    goPrevious,
    handleSaveDraft,
    handleContinue,
    handleSubmit,
  }
}
