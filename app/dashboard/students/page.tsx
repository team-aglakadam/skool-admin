'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Users,
  User,
  MoreVertical,
  Edit,
  Trash2,
  GraduationCap,
  Mail,
  Phone
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
import { useStudents } from '@/contexts/StudentsContext'
import { useClasses } from '@/contexts/ClassesContext'

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { students, loading, searchStudents, activeStudents, inactiveStudents } = useStudents()
  const { classes } = useClasses()

  const filteredStudents = searchStudents(searchTerm)

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId)
    return cls?.name || 'Unknown Class'
  }

  const getSectionName = (classId: string, sectionId: string) => {
    const cls = classes.find(c => c.id === classId)
    const section = cls?.sections.find(s => s.id === sectionId)
    return section?.name || 'Unknown Section'
  }

  if (loading) {
    return <StudentsLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and enrollments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? 'Try adjusting your search term' : 'Get started by adding your first student'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                className={getClassName(student.classId)}
                sectionName={getSectionName(student.classId, student.sectionId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StudentCard({ 
  student, 
  className, 
  sectionName 
}: { 
  student: any
  className: string
  sectionName: string
}) {
  const { deleteStudent } = useStudents()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleDeleteStudent = async () => {
    if (confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`)) {
      const result = await deleteStudent(student.id)
      if (result.success) {
        console.log('Student deleted successfully')
        // You can add a toast notification here
      } else {
        console.error('Failed to delete student:', result.error)
      }
    }
  }

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <CardDescription className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span className="text-xs">{student.email}</span>
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteStudent}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Class Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{className}</p>
            <p className="text-xs text-muted-foreground">Section {sectionName}</p>
          </div>
          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
            {student.status}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{student.mobile}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>Parent: {student.parentName}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Edit className="mr-2 h-3 w-3" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <GraduationCap className="mr-2 h-3 w-3" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StudentsLoadingSkeleton() {
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
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
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