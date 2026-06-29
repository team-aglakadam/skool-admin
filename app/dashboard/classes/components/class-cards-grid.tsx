'use client'

import { Class } from '@/contexts/ClassesContext'
import { Teacher } from '@/app/types/teacher'
import { ClassCard } from './class-card'

interface ClassCardsGridProps {
  classes: Class[]
  teachers: Teacher[]
  onDeleteClass: (classId: string, className: string) => Promise<void>
}

export function ClassCardsGrid({ classes, teachers, onDeleteClass }: ClassCardsGridProps) {
  if (classes.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {classes.map((cls) => (
        <ClassCard
          key={cls.id}
          classData={cls}
          teachers={teachers}
          onDelete={onDeleteClass}
        />
      ))}
    </div>
  )
}
