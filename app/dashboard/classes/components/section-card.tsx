'use client'

import { User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ClassSection } from '@/contexts/ClassesContext'
import { Teacher } from '@/contexts/TeachersContext'

interface SectionCardProps {
  section: ClassSection
  teacher?: Teacher
  classId: string
}

export function SectionCard({ section, teacher, classId }: SectionCardProps) {
  const handleClick = () => {
    // Navigate to class/classId+sectionId
    window.location.href = `/dashboard/classes/${classId}/${section.id}`
  }

  return (
    <div
      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
          {section.name}
        </div>
        <div>
          <div className="font-medium">Section {section.name}</div>
          <div className="text-sm text-muted-foreground">
            {teacher ? teacher.name : 'No teacher assigned'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          {section.studentCount} students
        </Badge>
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}
