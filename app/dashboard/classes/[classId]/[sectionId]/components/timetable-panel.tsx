import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, X } from "lucide-react"
import { ClassSection } from "@/types/database"

interface TimetablePanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function TimetablePanel({ classData, sectionData, onClose }: TimetablePanelProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Placeholder data - this will be replaced with fetched data
  const timetableData = [
    { day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics' },
    { day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'English' },
    { day: 'Monday', startTime: '11:00', endTime: '12:00', subject: 'Science' },
    { day: 'Tuesday', startTime: '09:00', endTime: '10:30', subject: 'Social Studies' },
    { day: 'Tuesday', startTime: '10:30', endTime: '11:30', subject: 'Hindi' },
    { day: 'Wednesday', startTime: '09:00', endTime: '10:30', subject: 'Mathematics' },
    { day: 'Wednesday', startTime: '10:30', endTime: '11:15', subject: 'Art' },
    { day: 'Wednesday', startTime: '11:15', endTime: '12:00', subject: 'Music' },
    { day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'Physical Ed.' },
    { day: 'Friday', startTime: '09:00', endTime: '10:00', subject: 'English' },
    { day: 'Friday', startTime: '10:00', endTime: '11:00', subject: 'Music' },
    { day: 'Friday', startTime: '11:15', endTime: '12:45', subject: 'Break' },
    { day: 'Saturday', startTime: '10:00', endTime: '12:00', subject: 'Extra Curricular' },
  ];

  const START_HOUR = 8;
  const END_HOUR = 15;
  const PIXELS_PER_HOUR = 80;

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

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
              Schedule for {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr]" style={{ height: `${(END_HOUR - START_HOUR) * PIXELS_PER_HOUR}px` }}>
          {/* Time Axis */}
          <div className="w-16 text-right pr-2 text-xs text-muted-foreground relative">
            {hours.map(hour => (
              <div key={hour} className="relative" style={{ height: `${PIXELS_PER_HOUR}px` }}>
                <span className="absolute -top-2.5 right-2">{`${hour}:00`}</span>
              </div>
            ))}
          </div>

          {/* Timetable Grid */}
          <div className="grid grid-cols-6 gap-x-1 relative border-t border-border">
            {days.map(day => (
              <div key={day} className="border-l border-border relative">
                <div className="text-center font-semibold text-sm py-2 border-b border-border">{day}</div>
                {timetableData
                  .filter(slot => slot.day === day)
                  .map((slot, index) => {
                    const startMinutes = timeToMinutes(slot.startTime);
                    const endMinutes = timeToMinutes(slot.endTime);
                    const top = ((startMinutes - START_HOUR * 60) / 60) * PIXELS_PER_HOUR;
                    const height = ((endMinutes - startMinutes) / 60) * PIXELS_PER_HOUR;

                    return (
                      <div
                        key={index}
                        className="absolute p-2 rounded-lg text-xs border-l-4 bg-muted border-primary overflow-hidden w-[calc(100%-4px)] left-[2px]"
                        style={{ top, height }}
                        aria-label={`${slot.subject} from ${slot.startTime} to ${slot.endTime}`}
                        tabIndex={0}
                      >
                        <div className="font-bold">{slot.subject}</div>
                        <div className="text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Add Period
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            Edit Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
