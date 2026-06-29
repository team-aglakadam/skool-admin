"use client"

import * as React from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentUploadSlotProps {
  title: string
  description: string
  requirements: string
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: string
  className?: string
}

export function DocumentUploadSlot({
  title,
  description,
  requirements,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  className,
}: DocumentUploadSlotProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const handleFileChange = (file: File | null) => {
    onChange?.(file)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files?.[0] ?? null)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    handleFileChange(event.dataTransfer.files?.[0] ?? null)
  }

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation()
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl border-2 border-dashed p-4 text-left transition-colors hover:bg-slate-50/80",
        isDragOver ? "border-blue-500 bg-blue-50/50" : "border-slate-200",
        value && "border-blue-300 bg-blue-50/30",
        className
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
        <Upload className="size-4 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{requirements}</p>
        {value && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm">
            <button
              type="button"
              onClick={handleRemove}
              className="text-slate-400 hover:text-slate-600"
              aria-label={`Remove ${value.name}`}
            >
              <X className="size-3" />
            </button>
            <span className="truncate">{value.name}</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </button>
  )
}
