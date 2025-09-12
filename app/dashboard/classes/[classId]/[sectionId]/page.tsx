'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, User, BookOpen, Calendar, GraduationCap, Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useClasses } from '@/contexts/ClassesContext';
import { useTeachers } from '@/contexts/TeachersContext';
import { SubjectsProvider } from '@/contexts/SubjectsContext';
import { Class, ClassSection } from '@/contexts/ClassesContext';
import { StudentsPanel, SubjectsPanel, TimetablePanel, TeacherAssignment } from './components';

export default function ClassSectionPage() {
  const params = useParams()
  const router = useRouter()
  const { getClassById, getSectionById, assignClassTeacher } = useClasses()
  const { teachers } = useTeachers()

  const [classData, setClassData] = useState<Class | null>(null)
  const [sectionData, setSectionData] = useState<ClassSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false)
  const [showTeacherSelect, setShowTeacherSelect] = useState(false)
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')

  // Section management state
  type ManagementPanel = 'students' | 'subjects' | 'timetable' | null
  const [activePanel, setActivePanel] = useState<ManagementPanel>('subjects')

  const classId = params.classId as string
  const sectionId = params.sectionId as string

  useEffect(() => {
    if (classId && sectionId) {
      console.log('Loading class section:', { classId, sectionId })
      const cls = getClassById(classId)
      const section = getSectionById(classId, sectionId)

      console.log('Found class:', cls)
      console.log('Found section:', section)

      if (cls && section) {
        setClassData(cls)
        setSectionData(section)
      } else {
        console.log('Class or section not found, redirecting...')
        // Handle not found
        // router.push('/dashboard/classes')
      }
      setLoading(false)
    }
  }, [classId, sectionId, getClassById, getSectionById, router])

  if (loading) {
    return <ClassSectionLoadingSkeleton />
  }

  if (!classData || !sectionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <GraduationCap className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Class or Section Not Found</h2>
        <p className="text-muted-foreground">The requested class or section could not be found.</p>
        <Button onClick={() => router.push('/dashboard/classes')}>
          Back to Classes
        </Button>
      </div>
    )
  }

  const teacher = teachers.find(t => t.id === sectionData.classTeacherId)

  const handleAssignTeacher = async () => {
    if (!selectedTeacherId || !classData || !sectionData) return

    setIsAssigningTeacher(true)
    try {
      const result = await assignClassTeacher(classData.id, sectionData.id, selectedTeacherId)
      if (result.success) {
        // Update local state
        setSectionData(prev => prev ? {
          ...prev,
          classTeacherId: selectedTeacherId
        } : null)
        setShowTeacherSelect(false)
        setSelectedTeacherId('')
      }
    } catch (error) {
      console.error('Failed to assign teacher:', error)
    } finally {
      setIsAssigningTeacher(false)
    }
  }

  const handleCancelAssign = () => {
    setShowTeacherSelect(false)
    setSelectedTeacherId('')
  }

  

  const handleManageStudents = () => {
    setActivePanel(activePanel === 'students' ? null : 'students')
  }

  const handleSubjectAssignments = () => {
    setActivePanel(activePanel === 'subjects' ? null : 'subjects')
  }

  const handleTimetable = () => {
    setActivePanel(activePanel === 'timetable' ? null : 'timetable')
  }

  const closeAllPanels = () => {
    setActivePanel(null)
  }

  const getTeacherSelection = () => {
    if (showTeacherSelect) {
      return (
        <TeacherAssignment
          teachers={teachers}
          selectedTeacherId={selectedTeacherId}
          onTeacherChange={setSelectedTeacherId}
          onAssign={handleAssignTeacher}
          onCancel={handleCancelAssign}
          isAssigning={isAssigningTeacher}
        />
      )
    }
    if (!teacher) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          onClick={() => setShowTeacherSelect(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          Assign Teacher
        </Button>
      )
    }
    return (
      <div className='flex flex-row gap-2 items-center'>
        {teacher.name}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowTeacherSelect(true)}
        >
          <Pencil className="h-3 w-3 mr-1" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/classes')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectionData.studentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Teacher</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getTeacherSelection()}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Section</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Section {sectionData.name}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.name}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Manage this section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={activePanel === 'students' ? "default" : "outline"}
              onClick={handleManageStudents}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Students
            </Button>
            <Button
              variant={activePanel === 'timetable' ? "default" : "outline"}
              onClick={handleTimetable}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Timetable
            </Button>
            <Button
              variant={activePanel === 'subjects' ? "default" : "outline"}
              onClick={handleSubjectAssignments}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Subject Assignments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Management Panels */}
      {activePanel === 'students' && (
        <StudentsPanel
          classData={classData}
          sectionData={sectionData}
          onClose={closeAllPanels}
        />
      )}

      {activePanel === 'subjects' && (
        <SubjectsProvider>
          <SubjectsPanel
            classData={classData}
            sectionData={sectionData}
            onClose={closeAllPanels}
          />
        </SubjectsProvider>
      )}

      {activePanel === 'timetable' && (
        <TimetablePanel
          classData={classData}
          sectionData={sectionData}
          onClose={closeAllPanels}
        />
      )}
    </div>
  )
}

function ClassSectionLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
        <div className="flex-1">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
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

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
