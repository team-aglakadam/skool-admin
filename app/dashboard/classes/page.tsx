'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Users,
  GraduationCap,
  User,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  BarChart3,
  BookOpen,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClasses, Class, ClassSection } from '@/contexts/ClassesContext'
import { useTeachers } from '@/contexts/TeachersContext'
import { useSubjects } from '@/contexts/SubjectsContext'
import { useSubjectAssignments } from '@/contexts/SubjectAssignmentsContext'
import { CreateClassDialog } from './components/CreateClassDialog'
import { AssignTeacherDialog } from './components/AssignTeacherDialog'
import { AssignSubjectDialog } from './components/AssignSubjectDialog'

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { classes, loading, searchClasses, getTotalStudents, getTotalSections } = useClasses()
  const { teachers } = useTeachers()
  const { subjects } = useSubjects()
  const { subjectAssignments, deleteSubjectAssignment } = useSubjectAssignments()

  const filteredClasses = searchClasses(searchTerm)

  if (loading) {
    return <ClassesLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Manage classes, sections, and subject assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateClassDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </CreateClassDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalSections()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalStudents()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subject Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectAssignments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? 'Try adjusting your search term' : 'Get started by creating your first class'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((cls) => (
              <ClassCard key={cls.id} classData={cls} teachers={teachers} subjects={subjects} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClassCard({ classData, teachers, subjects }: { classData: Class; teachers: any[]; subjects: any[] }) {
  const { deleteClass } = useClasses()
  const { getSubjectAssignmentsBySection, deleteSubjectAssignment } = useSubjectAssignments()

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

  const getSubjectById = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)
  }

  const getTotalStudentsInClass = () => {
    return classData.sections.reduce((total, section) => total + section.studentCount, 0)
  }

  const handleDeleteClass = async () => {
    if (confirm(`Are you sure you want to delete ${classData.name}? This action cannot be undone.`)) {
      const result = await deleteClass(classData.id)
      if (result.success) {
        console.log('Class deleted successfully')
        // You can add a toast notification here
      } else {
        console.error('Failed to delete class:', result.error)
      }
    }
  }

  const handleDeleteSubjectAssignment = async (assignmentId: string, subjectName: string) => {
    if (confirm(`Are you sure you want to remove ${subjectName} from this section?`)) {
      const result = await deleteSubjectAssignment(assignmentId)
      if (result.success) {
        console.log('Subject assignment deleted successfully')
      } else {
        console.error('Failed to delete subject assignment:', result.error)
      }
    }
  }

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{classData.name}</CardTitle>
            <CardDescription>
              {classData.sections.length} sections • {getTotalStudentsInClass()} students
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <CreateClassDialog mode="edit" classData={classData}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Class
                </DropdownMenuItem>
              </CreateClassDialog>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteClass}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        {/* Sections */}
        <div className="flex-1 space-y-3">
          <h4 className="text-sm font-medium">Sections</h4>
          <div className="grid grid-cols-1 gap-3">
            {classData.sections.map((section) => {
              const teacher = section.classTeacherId ? getTeacherById(section.classTeacherId) : null
              const subjectAssignments = getSubjectAssignmentsBySection(classData.id, section.id)

              return (
                <div key={section.id} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{section.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {section.studentCount} students
                      </span>
                    </div>
                  </div>

                  {/* Class Teacher */}
                  {teacher ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(teacher.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Class Teacher
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm">No teacher assigned</span>
                    </div>
                  )}

                  {/* Subject Assignments */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-medium text-muted-foreground">Subjects</h5>
                      <AssignSubjectDialog classData={classData} sectionData={section}>
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Subject
                        </Button>
                      </AssignSubjectDialog>
                    </div>
                    
                    {subjectAssignments.length > 0 ? (
                      <div className="space-y-1">
                        {subjectAssignments.map((assignment) => {
                          const subject = getSubjectById(assignment.subjectId)
                          const subjectTeacher = getTeacherById(assignment.teacherId)
                          
                          return (
                            <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                              <div className="flex-1">
                                <p className="font-medium">{subject?.name}</p>
                                <p className="text-muted-foreground">{subjectTeacher?.name}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteSubjectAssignment(assignment.id, subject?.name || '')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center py-2">
                        No subjects assigned
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions - Fixed at bottom */}
        <div className="mt-auto pt-4">
          <div className="flex gap-2">
            <AssignTeacherDialog classData={classData}>
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="mr-2 h-3 w-3" />
                Assign Teacher
              </Button>
            </AssignTeacherDialog>
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                // TODO: Implement student management
                console.log('Manage students for class:', classData.id)
              }}
            >
              <Users className="mr-2 h-3 w-3" />
              Manage Students
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ClassesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-72" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className="h-20 w-full" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 