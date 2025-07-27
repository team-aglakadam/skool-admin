'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTeachers, CreateTeacherData, Teacher } from '@/contexts/TeachersContext'
import { cn } from '@/lib/utils'

// Form validation schema
const addTeacherSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  mobile: z.string().min(1, 'Mobile number is required').min(10, 'Mobile number must be at least 10 digits'),
  dateOfJoining: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  dateOfBirth: z.date(),
  homeAddress: z.string().optional(),
  educationDetails: z.string().min(1, 'Education details are required'),
  employmentType: z.enum(['full-time', 'part-time', 'contract']),
})

type AddTeacherFormData = z.infer<typeof addTeacherSchema>

interface AddTeacherDialogProps {
  children: React.ReactNode
  mode?: 'create' | 'edit'
  teacherData?: Teacher
}

export function AddTeacherDialog({ children, mode = 'create', teacherData }: AddTeacherDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addTeacher, updateTeacher } = useTeachers()

  const form = useForm<AddTeacherFormData>({
    resolver: zodResolver(addTeacherSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      educationDetails: '',
      employmentType: 'full-time',
      gender: 'prefer-not-to-say',
      bloodGroup: 'O+',
      homeAddress: '',
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && teacherData && open) {
      form.setValue('name', teacherData.name)
      form.setValue('email', teacherData.email)
      form.setValue('mobile', teacherData.mobile)
      form.setValue('gender', teacherData.gender)
      form.setValue('bloodGroup', teacherData.bloodGroup)
      form.setValue('educationDetails', teacherData.educationDetails)
      form.setValue('employmentType', teacherData.employmentType)
      form.setValue('homeAddress', teacherData.homeAddress || '')
      
      if (teacherData.dateOfBirth) {
        form.setValue('dateOfBirth', new Date(teacherData.dateOfBirth))
      }
      if (teacherData.dateOfJoining) {
        form.setValue('dateOfJoining', new Date(teacherData.dateOfJoining))
      }
    }
  }, [mode, teacherData, open, form])

  const onSubmit = async (data: AddTeacherFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'edit' && teacherData) {
        // Update existing teacher
        const updateData = {
          ...data,
          dateOfJoining: data.dateOfJoining?.toISOString().split('T')[0],
          dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
          subjects: teacherData.subjects || [], // Keep existing subjects
        }

        console.log('Updating teacher with data:', updateData) // Debug log

        const result = await updateTeacher(teacherData.id, updateData)
        
        if (result.success) {
          // Success notification
          alert('Teacher updated successfully')
          setOpen(false)
          form.reset()
        } else {
          // Error notification
          alert(`Failed to update teacher: ${result.error || 'Unknown error'}`)
          console.error('Failed to update teacher:', result.error)
        }
      } else {
        // Create new teacher
        const newTeacherData: CreateTeacherData = {
          ...data,
          dateOfJoining: data.dateOfJoining?.toISOString().split('T')[0],
          dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
          subjects: [], // Initialize with empty array
        }

        console.log('Creating teacher with data:', newTeacherData) // Debug log

        const result = await addTeacher(newTeacherData)
        
        if (result.success) {
          // Success notification with default password info
          alert('Teacher created successfully. Default password: admin123')
          console.log('Teacher created successfully:', result.data)
          setOpen(false)
          form.reset()
        } else {
          // Error notification
          alert(`Failed to add teacher: ${result.error || 'Unknown error'}`)
          console.error('Failed to add teacher:', result.error)
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' 
              ? `Update ${teacherData?.name}'s information. Fields marked with * are required.`
              : 'Fill in the teacher\'s information. Fields marked with * are required.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="teacher@school.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="NA">NA-</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfJoining"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Joining</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date('2020-01-01') || date > new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Information</h3>
              
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educationDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Details *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="M.Sc Mathematics, B.Ed from State University"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="123 Teacher Lane, Education City, EC 12345"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'edit' ? 'Update Teacher' : 'Add Teacher'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
