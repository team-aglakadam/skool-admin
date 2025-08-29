'use client'

import { useState } from 'react'
import { MoreVertical, Edit, Trash2, Users, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Class } from '@/contexts/ClassesContext'
import { Teacher } from '@/app/types/teacher'
import { SectionCard } from './section-card'
import { EditClassDialog } from './edit-class-dialog'

interface ClassCardProps {
  classData: Class
  teachers: Teacher[]
  onDelete: (classId: string, className: string) => Promise<void>
}

export function ClassCard({ classData, teachers, onDelete }: ClassCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(classData.id, classData.name)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{classData.name}</CardTitle>
            <CardDescription>
              {classData.sections.length} section{classData.sections.length !== 1 ? 's' : ''} • {classData.totalStudents} students
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                    <EditClassDialog 
                      classData={classData}
                      onSuccess={() => {
                        // Force data refresh
                        window.location.reload()
                      }}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Class
                      </DropdownMenuItem>
                    </EditClassDialog>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete Class'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Sections & Teachers</span>
          </div>
          <div className="grid gap-2">
            {classData.sections.map((section) => {
              const teacher = teachers.find(t => t.id === section.classTeacherId)
              return (
                <SectionCard
                  key={section.id}
                  section={section}
                  teacher={teacher}
                  classId={classData.id}
                />
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
