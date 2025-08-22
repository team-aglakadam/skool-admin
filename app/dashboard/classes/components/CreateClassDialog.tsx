'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useClasses, CreateClassData, Class } from '@/contexts/ClassesContext'
import { useTeachers } from '@/contexts/TeachersContext'
import { useAuth } from '@/contexts/AuthContext'

// Form validation schema
const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').min(2, 'Class name must be at least 2 characters'),
  section: z.string().min(1, 'Section is required'),
  class_teacher_id: z.string().transform(val => val === 'none' ? null : val).nullable(),
  school_id: z.string()
})

type CreateClassFormData = {
  name: string
  section: string
  class_teacher_id: string | null
  school_id: string
}

interface CreateClassDialogProps {
  children: React.ReactNode
  mode?: 'create' | 'edit'
  classData?: Class
}

// Available sections A-Z
const AVAILABLE_SECTIONS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)) // A-Z

export function CreateClassDialog({ children, mode = 'create', classData }: CreateClassDialogProps) {
  const { schoolId } = useAuth()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createClass, updateClass } = useClasses()
  const { teachers } = useTeachers()

  const form = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: '',
      section: '',
      class_teacher_id: 'none',
      school_id: schoolId || ''
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && classData && open) {
      form.setValue('name', classData.name)
      form.setValue('section', classData.section)
      form.setValue('class_teacher_id', classData.class_teacher_id)
      form.setValue('school_id', classData.school_id)
    }
  }, [mode, classData, open, form])

  const onSubmit = async (data: CreateClassFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'edit' && classData) {
        const result = await updateClass(classData.id, data)
        if (result.success) {
          setOpen(false)
          form.reset()
        } else {
          console.error('Failed to update class:', result.error)
        }
      } else {
        const result = await createClass(data)
        if (result.success) {
          setOpen(false)
          form.reset()
        } else {
          console.error('Failed to create class:', result.error)
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter teachers by school ID and active status
  // const availableTeachers = teachers.filter(t => t.school_id === schoolId && t.is_active)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Class' : 'Create New Class'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? `Edit ${classData?.name} with custom naming and select sections from A-Z.`
              : 'Create a new class with custom naming and select sections from A-Z.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Class 1, Grade 1, Standard 1, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_SECTIONS.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="class_teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'edit' ? 'Update' : 'Create'} Class
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
