import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, User, X } from "lucide-react"
import { ClassSection } from "@/types/database"

interface StudentsPanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function StudentsPanel({ classData, sectionData, onClose }: StudentsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Students
            </CardTitle>
            <CardDescription>
              Add, remove, and manage students in {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Students</span>
            <Badge variant="secondary">{sectionData.studentCount} students</Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Student
            </Button>
            <Button size="sm" variant="outline">
              <Users className="h-3 w-3 mr-1" />
              View All Students
            </Button>
            <Button size="sm" variant="outline">
              <User className="h-3 w-3 mr-1" />
              Import Students
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Manage student enrollment, attendance, and academic records for this section.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
