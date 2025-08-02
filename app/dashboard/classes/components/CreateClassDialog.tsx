'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Plus, X } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { useClasses, CreateClassData, Class } from '@/contexts/ClassesContext'

// Form validation schema
const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').min(2, 'Class name must be at least 2 characters'),
  sections: z.array(z.string()).min(1, 'At least one section is required'),
})

type CreateClassFormData = z.infer<typeof createClassSchema>

interface CreateClassDialogProps {
  children: React.ReactNode
  mode?: 'create' | 'edit'
  classData?: Class
}

// Available sections A-Z
const AVAILABLE_SECTIONS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)) // A-Z

export function CreateClassDialog({ children, mode = 'create', classData }: CreateClassDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const { createClass, updateClass } = useClasses()

  const form = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: '',
      sections: [],
    },
  })

  // Sync selectedSections with form data
  useEffect(() => {
    form.setValue('sections', selectedSections)
  }, [selectedSections, form])

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && classData && open) {
      form.setValue('name', classData.name)
      const existingSections = classData.sections.map(s => s.name)
      setSelectedSections(existingSections)
    }
  }, [mode, classData, open, form])

  const onSubmit = async (data: CreateClassFormData) => {
    setIsSubmitting(true)
    try {
      // Validate that sections are selected
      if (selectedSections.length === 0) {
        console.error('No sections selected')
        return
      }

      if (mode === 'edit' && classData) {
        // Update existing class while preserving teacher assignments
        const updatedSections = selectedSections.map((sectionName) => {
          // Find existing section with same name to preserve teacher assignment
          const existingSection = classData.sections.find(s => s.name === sectionName)
          
          if (existingSection) {
            // Preserve existing section data
            return {
              ...existingSection,
              name: sectionName,
              updatedAt: new Date().toISOString()
            }
          } else {
            // Create new section if it doesn't exist
            return {
              id: `${classData.id}-${sectionName}-${Date.now()}`,
              name: sectionName,
              classTeacherId: null,
              studentCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        })

        const updateData = {
          name: data.name,
          sections: updatedSections,
        }

        console.log('Updating class with data:', updateData) // Debug log
        console.log('Preserved teacher assignments for sections:', 
          updatedSections.filter(s => s.classTeacherId).map(s => `${s.name}: ${s.classTeacherId}`)
        ) // Debug log

        const result = await updateClass(classData.id, updateData)
        
        if (result.success) {
          console.log('Class updated successfully') // Debug log
          setOpen(false)
          form.reset()
          setSelectedSections([])
          // You can add a toast notification here
        } else {
          console.error('Failed to update class:', result.error)
        }
      } else {
        // Create new class
        const newClassData: CreateClassData = {
          name: data.name,
          sections: selectedSections,
        }

        console.log('Creating class with data:', newClassData) // Debug log

        const result = await createClass(newClassData)
        
        if (result.success) {
          console.log('Class created successfully') // Debug log
          setOpen(false)
          form.reset()
          setSelectedSections([])
          // You can add a toast notification here
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

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const removeSection = (section: string) => {
    setSelectedSections(prev => prev.filter(s => s !== section))
  }

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

            <div className="space-y-3">
              <FormLabel>Select Sections *</FormLabel>
              
              {/* Selected Sections Display */}
              {selectedSections.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSections.map((section) => (
                    <Badge key={section} variant="secondary" className="gap-1">
                      {section}
                      <button
                        type="button"
                        onClick={() => removeSection(section)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Section Selection Grid */}
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {AVAILABLE_SECTIONS.map((section) => (
                  <Button
                    key={section}
                    type="button"
                    variant={selectedSections.includes(section) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSectionToggle(section)}
                    className="h-8 w-8 p-0"
                  >
                    {section}
                  </Button>
                ))}
              </div>
              
              {selectedSections.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select at least one section from the grid above
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                  setSelectedSections([])
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || selectedSections.length === 0}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'edit' ? 'Update Class' : 'Create Class'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 