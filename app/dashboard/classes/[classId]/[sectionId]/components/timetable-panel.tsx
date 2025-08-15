import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, BookOpen, X } from "lucide-react"
import { ClassSection } from "@/types/database"

interface TimetablePanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function TimetablePanel({ classData, sectionData, onClose }: TimetablePanelProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const timeSlots = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00']

  const getSubjectForSlot = (index: number) => {
    switch (index) {
      case 0: return 'Mathematics'
      case 1: return 'English'
      case 2: return 'Science'
      default: return 'Break'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timetable
            </CardTitle>
            <CardDescription>
              Schedule and manage class timings for {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-5">
            {days.map((day) => (
              <div key={day} className="space-y-2">
                <h4 className="font-medium text-sm">{day}</h4>
                <div className="space-y-1">
                  {timeSlots.map((time, index) => (
                    <div key={time} className="p-2 bg-muted rounded text-xs">
                      <div className="font-medium">{time}</div>
                      <div className="text-muted-foreground">
                        {getSubjectForSlot(index)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="h-3 w-3 mr-1" />
              Add Period
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Edit Schedule
            </Button>
            <Button size="sm" variant="outline">
              <BookOpen className="h-3 w-3 mr-1" />
              Export Timetable
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
