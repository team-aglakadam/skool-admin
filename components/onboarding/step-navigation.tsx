"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface StepNavigationProps {
  onPrevious?: () => void
  onSaveDraft?: () => void
  onContinue?: () => void
  continueLabel?: string
  isFirstStep?: boolean
  isLastStep?: boolean
  isSubmitting?: boolean
}

export function StepNavigation({
  onPrevious,
  onSaveDraft,
  onContinue,
  continueLabel = "Continue",
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
}: StepNavigationProps) {
  return (
    <div className="space-y-6">
      <Separator />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="text-slate-600"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row">
          {onSaveDraft && !isLastStep && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              className="border-slate-200"
            >
              Save Draft
            </Button>
          )}
          <Button
            type="button"
            onClick={onContinue}
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {continueLabel}
            {!isLastStep && <ChevronRight className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
