"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepConfig {
  id: string
  label: string
}

interface ProgressStepperProps {
  steps: StepConfig[]
  currentStep: number
  className?: string
}

export function ProgressStepper({
  steps,
  currentStep,
  className,
}: ProgressStepperProps) {
  const progressPercent = Math.round((currentStep / (steps.length - 1)) * 100)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <div
              key={step.id}
              className={cn("flex flex-1 items-center", isLast && "flex-none")}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted &&
                      "border-blue-600 bg-blue-600 text-white",
                    isActive &&
                      "border-blue-600 bg-white text-blue-600",
                    !isCompleted &&
                      !isActive &&
                      "border-slate-200 bg-white text-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isActive && "text-blue-600",
                    isCompleted && "text-slate-700",
                    !isActive && !isCompleted && "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors",
                    isCompleted ? "bg-blue-600" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="font-medium text-blue-600">{progressPercent}% complete</span>
      </div>
    </div>
  )
}
