import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock,
  MapPin,
  User,
  Plus,
  Filter
} from 'lucide-react'

export default function SchedulePage() {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ]

  const schedule = {
    Monday: [
      { time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Brown', room: 'Room 101', class: 'Grade 10A' },
      { time: '10:30 AM', subject: 'Science', teacher: 'Dr. Davis', room: 'Lab 201', class: 'Grade 9B' },
      { time: '2:00 PM', subject: 'English', teacher: 'Ms. Wilson', room: 'Room 205', class: 'Grade 11A' }
    ],
    Tuesday: [
      { time: '8:30 AM', subject: 'History', teacher: 'Mr. Taylor', room: 'Room 301', class: 'Grade 12C' },
      { time: '11:00 AM', subject: 'Mathematics', teacher: 'Mr. Brown', room: 'Room 101', class: 'Grade 10B' },
      { time: '1:30 PM', subject: 'Physical Education', teacher: 'Coach Smith', room: 'Gymnasium', class: 'Grade 9A' }
    ],
    Wednesday: [
      { time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Brown', room: 'Room 101', class: 'Grade 10A' },
      { time: '10:30 AM', subject: 'Chemistry', teacher: 'Dr. Johnson', room: 'Lab 202', class: 'Grade 11B' },
      { time: '2:30 PM', subject: 'Art', teacher: 'Ms. Garcia', room: 'Art Studio', class: 'Grade 8A' }
    ],
    Thursday: [
      { time: '8:00 AM', subject: 'Science', teacher: 'Dr. Davis', room: 'Lab 201', class: 'Grade 9B' },
      { time: '11:30 AM', subject: 'Geography', teacher: 'Mr. Lee', room: 'Room 203', class: 'Grade 10C' },
      { time: '3:00 PM', subject: 'Music', teacher: 'Ms. Rodriguez', room: 'Music Room', class: 'Grade 7B' }
    ],
    Friday: [
      { time: '9:30 AM', subject: 'English', teacher: 'Ms. Wilson', room: 'Room 205', class: 'Grade 11A' },
      { time: '1:00 PM', subject: 'Computer Science', teacher: 'Mr. Chen', room: 'Computer Lab', class: 'Grade 12A' },
      { time: '2:30 PM', subject: 'Biology', teacher: 'Dr. Martinez', room: 'Lab 203', class: 'Grade 11C' }
    ]
  }

  const upcomingClasses = [
    { time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Brown', room: 'Room 101', class: 'Grade 10A', status: 'upcoming' },
    { time: '10:30 AM', subject: 'Science', teacher: 'Dr. Davis', room: 'Lab 201', class: 'Grade 9B', status: 'upcoming' },
    { time: '2:00 PM', subject: 'English', teacher: 'Ms. Wilson', room: 'Room 205', class: 'Grade 11A', status: 'scheduled' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">
            View and manage class schedules and timetables
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      <Tabs defaultValue="week" className="space-y-4">
        <TabsList>
          <TabsTrigger value="week">Weekly View</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>
                Complete weekly timetable for all classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {/* Time column */}
                <div className="space-y-2">
                  <div className="h-12 flex items-center justify-center font-medium">
                    Time
                  </div>
                  {timeSlots.map((time) => (
                    <div key={time} className="h-20 flex items-center justify-center text-sm text-muted-foreground border-r">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Days columns */}
                {weekDays.map((day) => (
                  <div key={day} className="space-y-2">
                    <div className="h-12 flex items-center justify-center font-medium bg-muted rounded">
                      {day}
                    </div>
                    <div className="space-y-2">
                      {schedule[day as keyof typeof schedule]?.map((classItem, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {classItem.time}
                            </Badge>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{classItem.subject}</div>
                            <div className="text-xs text-muted-foreground">{classItem.class}</div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="mr-1 h-3 w-3" />
                            {classItem.teacher}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {classItem.room}
                          </div>
                        </div>
                      )) || (
                        <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
                          No classes scheduled
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today&apos;s Classes
              </CardTitle>
              <CardDescription>
                Your schedule for today - {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.Monday.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-sm text-muted-foreground">{classItem.class}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      {classItem.teacher}
                      <MapPin className="ml-3 mr-1 h-3 w-3" />
                      {classItem.room}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm font-medium">
                      <Clock className="mr-1 h-3 w-3" />
                      {classItem.time}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Scheduled
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>
                Next classes scheduled for today and tomorrow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-sm text-muted-foreground">{classItem.class}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      {classItem.teacher}
                      <MapPin className="ml-3 mr-1 h-3 w-3" />
                      {classItem.room}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm font-medium">
                      <Clock className="mr-1 h-3 w-3" />
                      {classItem.time}
                    </div>
                    <Badge 
                      variant={classItem.status === 'upcoming' ? 'default' : 'secondary'} 
                      className="mt-2"
                    >
                      {classItem.status === 'upcoming' ? 'Starting Soon' : 'Scheduled'}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No more classes scheduled for today. Check back tomorrow for your next schedule.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 