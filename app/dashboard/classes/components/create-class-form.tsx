'use client'

import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, X, User, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Teacher } from '@/app/types/teacher'

type CreateClassFormValues = {
  name: string
  sections: Array<{
    name: string
    teacherId?: string
  }>
}

interface CreateClassFormProps {
  form: UseFormReturn<CreateClassFormValues>
  fields: UseFieldArrayReturn<CreateClassFormValues, 'sections', 'id'>['fields']
  sections: CreateClassFormValues['sections']
  usedSectionNames: string[]
  teachers: Teacher[]
  onSubmit: (data: CreateClassFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  addSection: () => void
  removeSection: (index: number) => void
  getAvailableSectionNames: (currentIndex: number) => string[]
  getAssignedTeacherName: (teacherId: string) => string
}

export default function CreateClassForm({
  form,
  fields,
  sections,
  usedSectionNames,
  teachers,
  onSubmit,
  onCancel,
  isSubmitting,
  addSection,
  removeSection,
  getAvailableSectionNames,
  getAssignedTeacherName,
}: CreateClassFormProps) {
  const handleSubmit = async (data: CreateClassFormValues) => {
    try {
      await onSubmit(data)
      toast.success('Class created successfully!')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <Form {...form}>
      {/* Summary */}


      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Class Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Class 1, Grade 1, Year 1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />


        {/* Sections and Teachers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <FormLabel className="text-base font-semibold">
                Sections & Teachers
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Add sections and assign class teachers
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSection}
              disabled={usedSectionNames.length >= 26}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="space-y-3 flex flex-col w-full">
            {fields.map((field, index) => (
              <div key={field.id} className='flex items-center gap-4 w-full flex-1'>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                </div>
                <Card className="border-2 border-black rounded-md flex-1">
                  <CardContent className="p-2 w-full">
                    <div className="flex items-center gap-4 w-full">
                      {/* Section and Teacher Selection */}
                      <div className="flex flex-1 w-full">
                        {/* Section Name */}
                        <div className='flex flex-1'>
                          <FormField
                            control={form.control}
                            name={`sections.${index}.name`}
                            render={({ field }) => (
                              <FormItem >
                                <FormLabel className="text-sm font-medium">Section Selection</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="min-h-[250px]">
                                    {getAvailableSectionNames(index).map((name) => (
                                      <SelectItem key={name} value={name}>
                                        Section {name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='flex flex-1'>
                          <FormField
                            control={form.control}
                            name={`sections.${index}.teacherId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Teacher Selection</FormLabel>
                                <Select
                                  value={field.value || 'unassigned'}
                                  onValueChange={(value) => {
                                    field.onChange(value === 'unassigned' ? undefined : value)
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select teacher" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="min-h-[250px]">
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {teachers.map((teacher) => (
                                      <SelectItem key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {sections.length > 1 && (
                        <div className="flex-shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

            ))}
          </div>

          {form.formState.errors.sections && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.sections.message}
            </p>
          )}
        </div>



        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Class'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
