import { Separator } from "@/components/ui/separator"

interface StepHeaderProps {
  stepNumber: number
  totalSteps: number
  title: string
  description: string
}

export function StepHeader({
  stepNumber,
  totalSteps,
  title,
  description,
}: StepHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">
          Step {stepNumber} / {totalSteps}
        </p>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Separator />
    </div>
  )
}
