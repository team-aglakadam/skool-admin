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
import { StudentForm } from './student-form'
import { Student } from '@/contexts/StudentsContext'

interface StudentDialogProps {
  student?: Student
  onSuccess?: () => void
  children?: React.ReactNode
}

export function StudentDialog({ student, onSuccess, children }: StudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addStudent, updateStudent } = useStudents()

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (student) {
        await updateStudent(student.id, data)
      } else {
        await addStudent(data)
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
              Add Student
            </span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {student ? 'Update the student details' : 'Fill in the details to add a new student'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StudentForm
            initialData={student}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
