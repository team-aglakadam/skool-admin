'use client'

import { useState } from 'react'
import { Search, GraduationCap, Users, User, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClasses } from '@/contexts/ClassesContext'
import { ClassDialog } from '../components/class-dialog'

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { classes, loading, deleteClass } = useClasses()

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.sections.some(section => 
      section.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  if (loading) {
    return <ClassesLoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Class & Section Management</h2>
          <p className="text-muted-foreground">
            Manage classes, sections, and student assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ClassDialog>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Class
              </span>
            </Button>
          </ClassDialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search classes or sections..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <div className="text-2xl font-bold">
              {classes.reduce((acc, cls) => acc + (cls.sections?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((acc, cls) => {
                const sectionStudents = cls.sections?.reduce((sum, section) => 
                  sum + (section.studentCount || 0), 0) || 0
                return acc + sectionStudents
              }, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {filteredClasses.length > 0 ? (
          <div className="space-y-4">
            {filteredClasses.map((cls) => (
              <Card key={cls.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cls.sections?.length || 0} section{cls.sections?.length !== 1 ? 's' : ''} • {cls.sections?.reduce((sum, s) => sum + (s.studentCount || 0), 0)} students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClassDialog classData={cls}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </ClassDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this class?')) {
                              deleteClass(cls.id)
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Class</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {cls.sections?.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {cls.sections.map((section) => (
                        <div 
                          key={section.id}
                          className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {cls.name} - Section {section.name}
                            </h4>
                            <Badge variant="outline">
                              {section.studentCount || 0} students
                            </Badge>
                          </div>
                          {section.classTeacher && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Class Teacher: {section.classTeacher.name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No sections added yet. Add sections to this class.
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No classes found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm ? 'Try a different search term' : 'Get started by adding a new class'}
            </p>
            <ClassDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </ClassDialog>
          </div>
        )}
      </div>
    </div>
  )
}

function ClassesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-10 w-full max-w-md" />

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
