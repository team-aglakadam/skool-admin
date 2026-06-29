import { Check, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ReviewField {
  label: string
  value?: string | null
}

interface ReviewSectionProps {
  icon: LucideIcon
  title: string
  fields: ReviewField[]
  documents?: string[]
  onEdit?: () => void
  className?: string
}

export function ReviewSection({
  icon: Icon,
  title,
  fields,
  documents,
  onEdit,
  className,
}: ReviewSectionProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-100">
            <Icon className="size-4 text-slate-600" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <Check className="size-4 text-green-500" strokeWidth={3} />
          </div>
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="link"
            onClick={onEdit}
            className="h-auto p-0 text-blue-600"
          >
            Edit
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="space-y-1">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {field.label}
            </p>
            <p className="text-sm font-medium text-slate-900">
              {field.value?.trim() ? field.value : "—"}
            </p>
          </div>
        ))}
      </div>

      {documents && documents.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {documents.map((doc) => (
            <Badge
              key={doc}
              variant="secondary"
              className="gap-1 rounded-md bg-slate-100 px-2 py-1 font-normal text-slate-700"
            >
              {doc}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
