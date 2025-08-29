'use client'

import { useState, useEffect } from 'react'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Class, useClasses } from '@/contexts/ClassesContext'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTeachers } from '@/contexts/TeachersContext'
import CreateClassForm from './create-class-form'

// Enhanced schema with teacher assignments
const editClassFormSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  sections: z.array(z.object({
    id: z.string().optional(), // Add section ID field
    name: z.string().min(1, 'Section name is required'),
    teacherId: z.string().optional(),
  })).min(1, 'At least one section is required'),
})

type EditClassFormValues = z.infer<typeof editClassFormSchema>

// Available section names (A-Z)
const SECTION_NAMES = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)

interface EditClassDialogProps {
    classData: Class
    onSuccess?: () => void
    children?: React.ReactNode
}

export function EditClassDialog({ classData, onSuccess, children }: EditClassDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const { updateClass } = useClasses()
    const { teachers } = useTeachers()
    const form = useForm<EditClassFormValues>({
        resolver: zodResolver(editClassFormSchema),

        defaultValues: {
            name: classData.name,
            sections: classData.sections.map(section => ({
                id: section.id, // Include the section ID
                name: section.name,
                teacherId: section.classTeacherId || undefined
            }))
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'sections',
    })

    const sections = form.watch('sections')
    const usedSectionNames = sections.map(s => s.name).filter(Boolean)

    // Update form when classData changes
    useEffect(() => {
        if (classData) {
            form.reset({
                name: classData.name,
                sections: classData.sections.map(section => ({
                    id: section.id,
                    name: section.name,
                    teacherId: section.classTeacherId || undefined
                }))
            })
        }
    }, [classData, form])

    const handleSubmit = async (data: EditClassFormValues) => {
        try {
            setError(null)
            setSuccess(null)
            setIsSubmitting(true)
            
            console.log('Submitting update with data:', data);
            const result = await updateClass(classData.id, data)
            console.log('Update result:', result);
            
            if (result.success) {
                toast.success(result.message || `Class ${data.name} updated successfully`);
                setSuccess(result.message || `Class ${data.name} updated successfully`);
                setTimeout(() => {
                    setOpen(false)
                    if (onSuccess) {
                        onSuccess()
                    } else {
                        // Force page refresh if no success callback
                        window.location.reload()
                    }
                }, 1500)
            } else {
                toast.error(result.error || 'Failed to update class');
                setError(result.error || 'Failed to update class')
            }
        } catch (err) {
            console.error('Error updating class:', err)
            toast.error('An unexpected error occurred');
            setError('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setOpen(false)
        setError(null)
        setSuccess(null)
        // Reset to original data
        form.reset({
            name: classData.name,
            sections: classData.sections.map(section => ({
                id: section.id, // Include section ID when resetting form
                name: section.name,
                teacherId: section.classTeacherId || undefined
            }))
        })
    }

    const addSection = () => {
        // Find the next available section name
        const availableSections = SECTION_NAMES.filter(
            name => !usedSectionNames.includes(name)
        )
        
        if (availableSections.length > 0) {
            append({
                id: undefined, // Initialize as undefined for new sections
                name: availableSections[0],
                teacherId: undefined
            })
        }
    }

    const removeSection = (index: number) => {
        if (sections.length > 1) {
            remove(index)
        }
    }

    const getAvailableSectionNames = (currentIndex: number) => {
        const currentSectionName = sections[currentIndex]?.name
        return SECTION_NAMES.filter(name =>
            name === currentSectionName || !usedSectionNames.includes(name)
        )
    }

    const getAssignedTeacherName = (teacherId: string) => {
        const teacher = teachers.find(t => t.id === teacherId)
        return teacher ? `${teacher.name}` : 'Unassigned'
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children ? (
                <DialogTrigger asChild>{children}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <Edit className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Edit Class
                        </span>
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Edit Class</DialogTitle>
                    <DialogDescription>
                        Update class details, sections, and teacher assignments
                    </DialogDescription>
                    {error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                            {success}
                        </div>
                    )}
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4">
                    <CreateClassForm
                        form={form}
                        fields={fields}
                        sections={sections}
                        usedSectionNames={usedSectionNames}
                        teachers={teachers}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                        isEditing={true}
                        addSection={addSection}
                        removeSection={removeSection}
                        getAvailableSectionNames={getAvailableSectionNames}
                        getAssignedTeacherName={getAssignedTeacherName}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
