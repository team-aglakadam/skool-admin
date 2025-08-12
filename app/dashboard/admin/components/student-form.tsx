'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClasses } from '@/contexts/ClassesContext'
import { Student } from '@/contexts/StudentsContext'
import { useToast } from '@/components/ui/use-toast'

const studentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  mobile: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), 'Please enter a valid date'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentMobile: z.string().min(10, 'Please enter a valid parent phone number'),
  classId: z.string().min(1, 'Please select a class'),
  sectionId: z.string().min(1, 'Please select a section'),
  status: z.enum(['active', 'inactive']),
})

type StudentFormValues = z.infer<typeof studentFormSchema>

interface StudentFormProps {
  initialData?: Student | null
  onSubmit: (data: StudentFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function StudentForm({ initialData, onSubmit, onCancel, isSubmitting }: StudentFormProps) {
  const { classes } = useClasses()
  const { toast } = useToast()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      mobile: '',
      dateOfBirth: '',
      gender: 'prefer-not-to-say',
      address: '',
      parentName: '',
      parentMobile: '',
      classId: '',
      sectionId: '',
      status: 'active',
    },
  })

  const selectedClassId = form.watch('classId')
  const selectedClass = classes.find(c => c.id === selectedClassId)

  const handleSubmit = async (data: StudentFormValues) => {
    try {
      await onSubmit(data)
      toast({
        title: 'Success',
        description: initialData ? 'Student updated' : 'Student created',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
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
            name="sectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!selectedClass}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedClass ? 'Select section' : 'Select class first'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedClass?.sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Student'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
