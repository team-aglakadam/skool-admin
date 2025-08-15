import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Teacher } from "@/app/types/teacher"

interface TeacherAssignmentProps {
  teachers: Teacher[]
  selectedTeacherId: string
  onTeacherChange: (teacherId: string) => void
  onAssign: () => void
  onCancel: () => void
  isAssigning: boolean
}

export function TeacherAssignment({
  teachers,
  selectedTeacherId,
  onTeacherChange,
  onAssign,
  onCancel,
  isAssigning
}: TeacherAssignmentProps) {
  return (
    <div className='flex flex-row gap-2'>
      <Select
        value={selectedTeacherId}
        onValueChange={onTeacherChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a teacher" />
        </SelectTrigger>
        <SelectContent>
          {teachers.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name} - {t.subjects.join(', ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={onAssign}
        disabled={!selectedTeacherId || isAssigning}
        size="sm"
      >
        {isAssigning ? 'Assigning...' : 'Assign'}
      </Button>
      <Button
        onClick={onCancel}
        variant="outline"
        size="sm"
        disabled={isAssigning}
      >
        Cancel
      </Button>
    </div>
  )
}
