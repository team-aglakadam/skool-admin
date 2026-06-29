"use client"

import * as React from "react"
import { Upload, UserRound, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PhotoUploadProps {
  value?: File | null
  onChange?: (file: File | null) => void
  title?: string
  description?: string
  accept?: string
  maxSizeLabel?: string
  className?: string
}

export function PhotoUpload({
  value,
  onChange,
  title = "Student Photo",
  description = "Upload a clear, professional photo. This will appear on the student ID card and profile.",
  accept = "image/jpeg,image/png",
  maxSizeLabel = "JPG, PNG · Max 5MB",
  className,
}: PhotoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [preview, setPreview] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onChange?.(file)
  }

  const handleRemove = () => {
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-blue-200 bg-white">
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Upload preview"
              className="size-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 rounded-full bg-slate-900/70 p-0.5 text-white"
              aria-label="Remove photo"
            >
              <X className="size-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <UserRound className="size-8" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              Upload
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="border-slate-200"
          >
            <Upload className="size-4" />
            Browse files
          </Button>
          <span className="text-xs text-muted-foreground">{maxSizeLabel}</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
