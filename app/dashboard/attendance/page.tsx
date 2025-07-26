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
  Clock
} from 'lucide-react'

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

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today&apos;s Attendance</TabsTrigger>
          <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
          <TabsTrigger value="absences">Recent Absences</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Attendance Today</CardTitle>
              <CardDescription>Attendance overview for all classes today</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell className="font-medium">{attendance.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3 text-green-600" />
                          {attendance.present}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <XCircle className="mr-1 h-3 w-3 text-red-600" />
                          {attendance.absent}
                        </div>
                      </TableCell>
                      <TableCell>{attendance.total}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{attendance.percentage}%</span>
                          </div>
                          <Progress value={attendance.percentage} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={attendance.percentage >= 95 ? 'default' : attendance.percentage >= 90 ? 'secondary' : 'destructive'}>
                          {attendance.percentage >= 95 ? 'Excellent' : attendance.percentage >= 90 ? 'Good' : 'Needs Attention'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Trends</CardTitle>
              <CardDescription>Daily attendance patterns for this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklyTrends.map((day, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{day.day}</p>
                      <p className="text-xs text-muted-foreground">{day.present} / {day.total} students</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={day.attendance >= 95 ? 'default' : day.attendance >= 90 ? 'secondary' : 'destructive'}>
                        {day.attendance}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={day.attendance} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Absences</CardTitle>
              <CardDescription>Students who were absent in the last few days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAbsences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell className="font-medium">{absence.student}</TableCell>
                      <TableCell>{absence.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {new Date(absence.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{absence.reason}</TableCell>
                      <TableCell>
                        <Badge variant={absence.status === 'Excused' ? 'secondary' : 'destructive'}>
                          {absence.status === 'Excused' ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          )}
                          {absence.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 