import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FormFieldLabelProps {
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
  optional?: boolean
  className?: string
}

export function FormFieldLabel({
  htmlFor,
  children,
  required,
  optional,
  className,
}: FormFieldLabelProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Label htmlFor={htmlFor} className="font-semibold text-slate-800">
        {children}
        {required && <span className="ml-0.5 text-blue-600">*</span>}
      </Label>
      {optional && (
        <span className="text-xs text-muted-foreground">Optional</span>
      )}
    </div>
  )
}
