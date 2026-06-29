'use client'

import { useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useSubjects } from '@/contexts/SubjectsContext'
import { useTeachers } from '@/contexts/TeachersContext'
import { useSubjectAssignments } from '@/contexts/SubjectAssignmentsContext'
import { Class, ClassSection } from '@/contexts/ClassesContext'

interface AssignSubjectDialogProps {
  children: React.ReactNode
  classData: Class
  sectionData: ClassSection
}

export function AssignSubjectDialog({ children, classData, sectionData }: AssignSubjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [loading, setLoading] = useState(false)

  const { subjects } = useSubjects()
  const { teachers } = useTeachers()
  const { addSubjectAssignment, getSubjectAssignmentsBySection } = useSubjectAssignments()

  // Get existing assignments for this section
  const existingAssignments = getSubjectAssignmentsBySection(classData.id, sectionData.id)
  const assignedSubjectIds = existingAssignments.map(assignment => assignment.subjectId)

  // Filter out already assigned subjects
  const availableSubjects = subjects.filter(subject => !assignedSubjectIds.includes(subject.id))

  // Filter teachers who can teach the selected subject
  const availableTeachers = selectedSubject 
    ? teachers.filter(teacher => 
        teacher.subjects.includes(subjects.find(s => s.id === selectedSubject)?.name || '')
      )
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSubject || !selectedTeacher) {
      alert('Please select both a subject and a teacher')
      return
    }

    setLoading(true)
    
    try {
      const result = await addSubjectAssignment({
        classId: classData.id,
        sectionId: sectionData.id,
        subjectId: selectedSubject,
        teacherId: selectedTeacher
      })

      if (result.success) {
        setOpen(false)
        setSelectedSubject('')
        setSelectedTeacher('')
        // You can add a toast notification here
        console.log('Subject assigned successfully')
      } else {
        alert(result.error || 'Failed to assign subject')
      }
    } catch (error) {
      console.error('Error assigning subject:', error)
      alert('Failed to assign subject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Subject to Section</DialogTitle>
          <DialogDescription>
            Assign a subject and teacher to {classData.name} - Section {sectionData.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select 
              value={selectedTeacher} 
              onValueChange={setSelectedTeacher}
              disabled={!selectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedSubject ? "Select a teacher" : "Select a subject first"} />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subjects.join(', ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {existingAssignments.length > 0 && (
            <div className="space-y-2">
              <Label>Current Assignments</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                {existingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex justify-between">
                    <span>{subjects.find(s => s.id === assignment.subjectId)?.name}</span>
                    <span>{teachers.find(t => t.id === assignment.teacherId)?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedSubject || !selectedTeacher}>
              {loading ? 'Assigning...' : 'Assign Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 