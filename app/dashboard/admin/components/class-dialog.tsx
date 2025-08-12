'use client'

import { useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ClassForm } from './class-form'
import { Class } from '@/contexts/ClassesContext'

interface ClassDialogProps {
  classData?: Class
  onSuccess?: () => void
  children?: React.ReactNode
}

export function ClassDialog({ classData, onSuccess, children }: ClassDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createClass, updateClass } = useClasses()

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (classData) {
        await updateClass(classData.id, data)
      } else {
        await createClass(data)
      }
      setOpen(false)
      onSuccess?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Class
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{classData ? 'Edit Class' : 'Create New Class'}</DialogTitle>
          <DialogDescription>
            {classData ? 'Update the class details' : 'Create a new class with sections'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ClassForm
            initialData={classData}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
