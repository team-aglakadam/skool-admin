import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ClipboardCheck, 
  Calendar,
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  UserCheck
} from 'lucide-react'
import TeacherAttendance from './TeacherAttendance/page'
import StudentAttendance from './StudentAttendance/StudentAttendance'

export default function AttendancePage() {
  const todayAttendance = [
    { id: 1, class: 'Grade 10A', present: 26, absent: 2, total: 28, percentage: 92.9 },
    { id: 2, class: 'Grade 9B', present: 22, absent: 1, total: 23, percentage: 95.7 },
    { id: 3, class: 'Grade 11A', present: 20, absent: 3, total: 23, percentage: 87.0 },
    { id: 4, class: 'Grade 12C', present: 24, absent: 1, total: 25, percentage: 96.0 }
  ]

  const weeklyTrends = [
    { day: 'Monday', attendance: 91.2, present: 1180, total: 1294 },
    { day: 'Tuesday', attendance: 94.8, present: 1227, total: 1294 },
    { day: 'Wednesday', attendance: 96.3, present: 1246, total: 1294 },
    { day: 'Thursday', attendance: 89.7, present: 1161, total: 1294 },
    { day: 'Friday', attendance: 87.4, present: 1131, total: 1294 }
  ]

  const recentAbsences = [
    { id: 1, student: 'John Smith', class: 'Grade 10A', date: '2024-01-15', reason: 'Sick', status: 'Excused' },
    { id: 2, student: 'Emily Johnson', class: 'Grade 9B', date: '2024-01-15', reason: 'Family Emergency', status: 'Excused' },
    { id: 3, student: 'Michael Brown', class: 'Grade 11A', date: '2024-01-14', reason: 'Unexcused', status: 'Unexcused' },
    { id: 4, student: 'Sarah Wilson', class: 'Grade 12C', date: '2024-01-14', reason: 'Medical Appointment', status: 'Excused' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage student attendance across all classes
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Take Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Attendance</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              1,218 / 1,294 students present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.9%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76</div>
            <p className="text-xs text-muted-foreground">
              Today across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.5%</div>
            <p className="text-xs text-muted-foreground">
              Students arriving on time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <div className="border-b border-gray-200">
          <TabsList className="inline-flex h-auto items-center justify-start bg-transparent p-0 text-muted-foreground w-full">
            <TabsTrigger 
              value="students" 
              className="relative inline-flex items-center justify-center whitespace-nowrap px-6 py-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 bg-transparent border-0 rounded-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-200 data-[state=active]:after:bg-blue-600"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Student Attendance</span>
              <span className="sm:hidden">Students</span>
            </TabsTrigger>
            <TabsTrigger 
              value="teachers" 
              className="relative inline-flex items-center justify-center whitespace-nowrap px-6 py-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900 data-[state=active]:text-blue-600 bg-transparent border-0 rounded-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent after:transition-all after:duration-200 data-[state=active]:after:bg-blue-600"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Teacher Attendance</span>
              <span className="sm:hidden">Teachers</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="students" className="space-y-4">
          <StudentAttendance />
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <TeacherAttendance />
        </TabsContent>
      </Tabs>
    </div>
  )
} 