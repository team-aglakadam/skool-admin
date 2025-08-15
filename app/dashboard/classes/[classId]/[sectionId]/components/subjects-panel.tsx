import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, X } from "lucide-react"
import { ClassSection } from "@/types/database"

interface SubjectsPanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function SubjectsPanel({ classData, sectionData, onClose }: SubjectsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Assignments
            </CardTitle>
            <CardDescription>
              Assign subjects and teachers to {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Core Subjects</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Mathematics</span>
                  <Badge variant="outline">Assigned</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">English</span>
                  <Badge variant="outline">Assigned</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Science</span>
                  <Badge variant="secondary">Unassigned</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Elective Subjects</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Computer Science</span>
                  <Badge variant="outline">Assigned</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">History</span>
                  <Badge variant="secondary">Unassigned</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Subject
            </Button>
            <Button size="sm" variant="outline">
              <BookOpen className="h-3 w-3 mr-1" />
              Manage Assignments
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
