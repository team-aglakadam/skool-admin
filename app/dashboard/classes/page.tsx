import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  GraduationCap, 
  Plus, 
  Users, 
  Clock,
  BookOpen,
  Calendar,
  User,
  Award
} from 'lucide-react'

export default function ClassesPage() {
  const classes = [
    {
      id: 1,
      name: 'Mathematics - Grade 10A',
      teacher: 'Mr. Michael Brown',
      students: 28,
      subject: 'Mathematics',
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 101',
      performance: 87.5,
      attendance: 94.2
    },
    {
      id: 2,
      name: 'Science - Grade 9B',
      teacher: 'Dr. Emily Davis',
      students: 24,
      subject: 'Science',
      schedule: 'Tue, Thu - 10:30 AM',
      room: 'Lab 201',
      performance: 91.3,
      attendance: 96.8
    },
    {
      id: 3,
      name: 'English Literature - Grade 11A',
      teacher: 'Ms. Sarah Wilson',
      students: 22,
      subject: 'English',
      schedule: 'Mon, Wed, Fri - 2:00 PM',
      room: 'Room 205',
      performance: 89.7,
      attendance: 92.1
    },
    {
      id: 4,
      name: 'History - Grade 12C',
      teacher: 'Mr. James Taylor',
      students: 26,
      subject: 'History',
      schedule: 'Tue, Thu - 11:00 AM',
      room: 'Room 301',
      performance: 85.4,
      attendance: 88.9
    }
  ]

  const subjects = [
    { name: 'Mathematics', classes: 8, students: 210, avgPerformance: 86.2 },
    { name: 'Science', classes: 6, students: 156, avgPerformance: 89.1 },
    { name: 'English', classes: 7, students: 182, avgPerformance: 87.8 },
    { name: 'History', classes: 5, students: 130, avgPerformance: 84.3 },
    { name: 'Physical Education', classes: 4, students: 320, avgPerformance: 92.5 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Manage classes, schedules, and academic performance
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">998</div>
            <p className="text-xs text-muted-foreground">
              Enrolled across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Currently in session
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Classes List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Classes</CardTitle>
              <CardDescription>Overview of current classes and their performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.map((classItem) => (
                <div key={classItem.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{classItem.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <User className="mr-1 h-3 w-3" />
                        {classItem.teacher}
                      </div>
                    </div>
                    <Badge variant="secondary">{classItem.subject}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="mr-2 h-3 w-3 text-muted-foreground" />
                      {classItem.students} students
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                      {classItem.room}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance</span>
                      <span className="font-medium">{classItem.performance}%</span>
                    </div>
                    <Progress value={classItem.performance} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Attendance</span>
                      <span className="font-medium">{classItem.attendance}%</span>
                    </div>
                    <Progress value={classItem.attendance} className="h-2" />
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {classItem.schedule}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Subjects Overview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subjects Overview</CardTitle>
              <CardDescription>Performance and enrollment by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <Badge variant="outline">{subject.classes} classes</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>{subject.students} students</div>
                    <div>{subject.avgPerformance}% avg performance</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Average Performance</span>
                      <span className="font-medium">{subject.avgPerformance}%</span>
                    </div>
                    <Progress value={subject.avgPerformance} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common class management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Class
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Classes
              </Button>
              <Button variant="outline" className="justify-start">
                <Users className="mr-2 h-4 w-4" />
                Assign Students
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Curriculum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 