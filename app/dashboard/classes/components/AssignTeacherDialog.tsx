'use client'

import { useState } from 'react'
import { Loader2, UserPlus, Users, Edit, Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClasses, Class } from '@/contexts/ClassesContext'
import { useTeachers } from '@/contexts/TeachersContext'

interface AssignTeacherDialogProps {
  children: React.ReactNode
  classData: Class
}

export function AssignTeacherDialog({ children, classData }: AssignTeacherDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [tempAssignments, setTempAssignments] = useState<Record<string, string>>({})
  const { assignClassTeacher } = useClasses()
  const { teachers } = useTeachers()

  const handleSaveAssignments = async () => {
    setIsSubmitting(true)
    try {
      const assignments = Object.entries(tempAssignments)
      
      for (const [sectionId, teacherId] of assignments) {
        console.log('Assigning teacher:', { sectionId, teacherId }) // Debug log
        
        const result = await assignClassTeacher(
          classData.id,
          sectionId,
          teacherId
        )
        
        if (!result.success) {
          console.error('Failed to assign teacher:', result.error)
          return
        }
      }
      
      console.log('All teachers assigned successfully') // Debug log
      setOpen(false)
      setTempAssignments({})
      setEditingSection(null)
      // You can add a toast notification here
    } catch (error) {
      console.error('Error submitting assignments:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setTempAssignments({})
    setEditingSection(null)
  }

  const handleSectionEdit = (sectionId: string) => {
    setEditingSection(sectionId)
  }

  const handleTeacherSelect = (sectionId: string, teacherId: string) => {
    setTempAssignments(prev => ({
      ...prev,
      [sectionId]: teacherId
    }))
  }

  const handleRemoveAssignment = (sectionId: string) => {
    setTempAssignments(prev => {
      const newAssignments = { ...prev }
      delete newAssignments[sectionId]
      return newAssignments
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getTeacherById = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId)
  }

  const getUnassignedSections = () => {
    return classData.sections.filter(section => !section.classTeacherId)
  }

  const getAvailableTeachers = () => {
    return teachers.filter(t => t.status === 'active')
  }

  const getTeachersForSection = (sectionId: string) => {
    const currentTeacherId = classData.sections.find(s => s.id === sectionId)?.classTeacherId
    return teachers.filter(t => t.status === 'active' || t.id === currentTeacherId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Class Teacher</DialogTitle>
          <DialogDescription>
            Assign a class teacher to a section in {classData.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Assignments Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teacher Assignments</CardTitle>
              <CardDescription>
                Manage class teacher assignments for {classData.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classData.sections.map((section) => {
                const currentTeacher = section.classTeacherId ? getTeacherById(section.classTeacherId) : null
                const isEditing = editingSection === section.id
                const tempTeacherId = tempAssignments[section.id]
                const tempTeacher = tempTeacherId ? getTeacherById(tempTeacherId) : null
                const displayTeacher = tempTeacher || currentTeacher
                
                return (
                  <div key={section.id} className="border rounded-lg p-4 space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="text-sm">
                          Section {section.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {section.studentCount} students
                        </span>
                      </div>
                      
                                             {(currentTeacher || tempTeacher) && !isEditing && (
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleSectionEdit(section.id)}
                           className="h-8 w-8 p-0"
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                       )}
                    </div>

                                         {/* Teacher Assignment */}
                     <div className="space-y-3">
                       {isEditing ? (
                         // Edit Mode
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <span className="text-sm font-medium">Select Teacher:</span>
                             <div className="flex gap-2">
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => {
                                   setEditingSection(null)
                                   handleRemoveAssignment(section.id)
                                 }}
                                 className="h-8 w-8 p-0"
                               >
                                 <X className="h-4 w-4" />
                               </Button>
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => setEditingSection(null)}
                                 className="h-8 w-8 p-0"
                               >
                                 <Check className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                           
                           <Select
                             value={tempTeacherId || ''}
                             onValueChange={(value) => handleTeacherSelect(section.id, value)}
                           >
                             <SelectTrigger>
                               <SelectValue placeholder="Choose a teacher" />
                             </SelectTrigger>
                                                          <SelectContent>
                               {getTeachersForSection(section.id).map((teacher) => {
                                 const isCurrentTeacher = currentTeacher?.id === teacher.id
                                 const isSelected = tempTeacherId === teacher.id
                                 
                                 return (
                                   <SelectItem 
                                     key={teacher.id} 
                                     value={teacher.id}
                                     className={isCurrentTeacher ? "bg-muted/50" : ""}
                                   >
                                     <div className="flex items-center space-x-2">
                                       <Avatar className="h-6 w-6">
                                         <AvatarFallback className="text-xs">
                                           {getInitials(teacher.name)}
                                         </AvatarFallback>
                                       </Avatar>
                                       <div className="flex-1">
                                         <div className="flex items-center space-x-2">
                                           <span className="font-medium">{teacher.name}</span>
                                           {isCurrentTeacher && (
                                             <Badge variant="secondary" className="text-xs">
                                               Current
                                             </Badge>
                                           )}
                                         </div>
                                         <span className="text-xs text-muted-foreground">
                                           {teacher.subjects.join(', ')}
                                         </span>
                                       </div>
                                     </div>
                                   </SelectItem>
                                 )
                               })}
                             </SelectContent>
                           </Select>
                         </div>
                       ) : displayTeacher ? (
                         // Display Current Teacher or Pending Assignment
                         <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                           <Avatar className="h-8 w-8">
                             <AvatarFallback className="text-xs">
                               {getInitials(displayTeacher.name)}
                             </AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                             <p className="text-sm font-medium">{displayTeacher.name}</p>
                             <p className="text-xs text-muted-foreground">
                               {displayTeacher.subjects.join(', ')}
                             </p>
                           </div>
                           {tempTeacher && (
                             <Badge variant="secondary" className="text-xs">
                               Pending
                             </Badge>
                           )}
                         </div>
                       ) : (
                         // No Teacher Assigned
                         <div className="flex items-center justify-between p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                           <div className="flex items-center space-x-2 text-muted-foreground">
                             <UserPlus className="h-4 w-4" />
                             <span className="text-sm">No teacher assigned</span>
                           </div>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleSectionEdit(section.id)}
                           >
                             Assign Teacher
                           </Button>
                         </div>
                       )}
                     </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              onClick={handleSaveAssignments}
              disabled={isSubmitting || Object.keys(tempAssignments).length === 0}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 