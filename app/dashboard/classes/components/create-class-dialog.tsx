'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import CreateClassForm from './create-class-form'
import { Class, useClasses } from '@/contexts/ClassesContext'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTeachers } from '@/contexts/TeachersContext'

// Enhanced schema with teacher assignments
const createClassFormSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  sections: z.array(z.object({
    name: z.string().min(1, 'Section name is required'),
    teacherId: z.string().optional(),
  })).min(1, 'At least one section is required'),
})

type CreateClassFormValues = z.infer<typeof createClassFormSchema>

// Available section names (A-Z)
const SECTION_NAMES = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
)

interface CreateClassDialogProps {
    onSuccess?: () => void
    children?: React.ReactNode
}

export function CreateClassDialog({ onSuccess, children }: CreateClassDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createClass } = useClasses()
    const { teachers } = useTeachers()

    const form = useForm<CreateClassFormValues>({
        resolver: zodResolver(createClassFormSchema),
        defaultValues: {
            name: '',
            sections: [{ name: '', teacherId: undefined }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'sections',
    })

    const sections = form.watch('sections')
    const usedSectionNames = sections.map(s => s.name).filter(Boolean)

    const handleSubmit = async (data: CreateClassFormValues) => {
        try {
            setIsSubmitting(true)
            await createClass(data)
            setOpen(false)
            onSuccess?.()
            // Reset form after successful submission
            form.reset()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setOpen(false)
        form.reset()
    }

    const addSection = () => {
        // Find the next available section name
        const availableSections = SECTION_NAMES.filter(
            name => !usedSectionNames.includes(name)
        )
        
        if (availableSections.length > 0) {
            append({
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
                        <Plus className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Create Class
                        </span>
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>
                        Create a new class with sections and assign class teachers
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <CreateClassForm
                        form={form}
                        fields={fields}
                        sections={sections}
                        usedSectionNames={usedSectionNames}
                        teachers={teachers}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
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
