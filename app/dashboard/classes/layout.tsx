import { ClassesProvider } from '@/contexts/ClassesContext'
import { TeachersProvider } from '@/contexts/TeachersContext'
import { StudentsProvider } from '@/contexts/StudentsContext'
import { SubjectsProvider } from '@/contexts/SubjectsContext'
import { SubjectAssignmentsProvider } from '@/contexts/SubjectAssignmentsContext'

export default function ClassesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TeachersProvider>
      <SubjectsProvider>
        <StudentsProvider>
          <SubjectAssignmentsProvider>
            <ClassesProvider>
              {children}
            </ClassesProvider>
          </SubjectAssignmentsProvider>
        </StudentsProvider>
      </SubjectsProvider>
    </TeachersProvider>
  )
} 