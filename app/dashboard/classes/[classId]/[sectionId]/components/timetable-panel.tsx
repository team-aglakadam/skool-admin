import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, X } from "lucide-react"
import { ClassSection } from "@/types/database"
import { Skeleton } from "@/components/ui/skeleton"
import { useTimetable } from "@/contexts/TimeTableContext";
import { useSubjects } from '@/contexts/SubjectsContext';
import { AddPeriodModal } from './add-period-modal';

interface TimetablePanelProps {
  classData: { name: string }
  sectionData: ClassSection
  onClose: () => void
}

export function TimetablePanel({ classData, sectionData, onClose }: TimetablePanelProps) {
  const { timetable: timetableData, loading, fetchTimetable } = useTimetable();
  const { subjects, fetchSubjectsByClass } = useSubjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      useEffect(() => {
    if (sectionData.id) {
      fetchTimetable(sectionData.id);
      fetchSubjectsByClass(sectionData.id);
    }
  }, [sectionData.id, fetchTimetable, fetchSubjectsByClass]);

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
        <div className="min-h-[300px]">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-3 w-3 mr-1" />
            Add Period
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            Edit Schedule
          </Button>
        </div>
      </CardContent>
      <AddPeriodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        subjects={subjects}
        classId={sectionData.id}
        onPeriodAdded={() => fetchTimetable(sectionData.id)}
      />
    </Card>
  );
}
