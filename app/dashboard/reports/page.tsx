import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Download,
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function ReportsPage() {
  const reportCategories = [
    {
      title: 'Attendance Reports',
      description: 'Student attendance analytics and trends',
      icon: CheckCircle,
      reports: [
        { name: 'Daily Attendance Summary', lastGenerated: '2024-01-15', status: 'Ready' },
        { name: 'Monthly Attendance Trends', lastGenerated: '2024-01-10', status: 'Ready' },
        { name: 'Class-wise Attendance', lastGenerated: '2024-01-12', status: 'Ready' }
      ]
    },
    {
      title: 'Academic Performance',
      description: 'Student grades and performance analytics',
      icon: BarChart3,
      reports: [
        { name: 'Grade Distribution Report', lastGenerated: '2024-01-14', status: 'Ready' },
        { name: 'Subject Performance Analysis', lastGenerated: '2024-01-08', status: 'Ready' },
        { name: 'Student Progress Report', lastGenerated: '2024-01-11', status: 'Processing' }
      ]
    },
    {
      title: 'Enrollment Reports',
      description: 'Student enrollment and demographic data',
      icon: Users,
      reports: [
        { name: 'Current Enrollment Summary', lastGenerated: '2024-01-15', status: 'Ready' },
        { name: 'New Admissions Report', lastGenerated: '2024-01-13', status: 'Ready' },
        { name: 'Class Distribution Report', lastGenerated: '2024-01-09', status: 'Ready' }
      ]
    },
    {
      title: 'Teacher Reports',
      description: 'Staff performance and workload analysis',
      icon: GraduationCap,
      reports: [
        { name: 'Teacher Workload Analysis', lastGenerated: '2024-01-12', status: 'Ready' },
        { name: 'Class Assignment Report', lastGenerated: '2024-01-10', status: 'Ready' },
        { name: 'Staff Performance Review', lastGenerated: '2024-01-07', status: 'Pending' }
      ]
    }
  ]

  const quickStats = [
    { label: 'Reports Generated This Month', value: 47, trend: '+12%' },
    { label: 'Active Report Schedules', value: 8, trend: '+2' },
    { label: 'Data Sources Connected', value: 5, trend: 'Stable' },
    { label: 'Average Generation Time', value: '2.3min', trend: '-15%' }
  ]

  const recentReports = [
    { name: 'Monthly Attendance Summary', type: 'Attendance', generated: '2024-01-15 09:30', size: '2.4 MB', downloads: 23 },
    { name: 'Grade 10 Performance Report', type: 'Academic', generated: '2024-01-14 16:20', size: '1.8 MB', downloads: 15 },
    { name: 'Teacher Workload Analysis', type: 'Staff', generated: '2024-01-13 11:45', size: '3.2 MB', downloads: 8 },
    { name: 'New Student Enrollment', type: 'Enrollment', generated: '2024-01-12 08:15', size: '1.1 MB', downloads: 31 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and access comprehensive reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Report Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {reportCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.reports.map((report, reportIndex) => (
                    <div key={reportIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{report.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          report.status === 'Ready' ? 'default' : 
                          report.status === 'Processing' ? 'secondary' : 
                          'outline'
                        }>
                          {report.status}
                        </Badge>
                        {report.status === 'Ready' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Reports</CardTitle>
              <CardDescription>
                Latest reports available for download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{report.name}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="outline">{report.type}</Badge>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {report.generated}
                      </div>
                      <div>{report.size}</div>
                      <div>{report.downloads} downloads</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated reports that run on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Weekly Attendance Summary</div>
                  <div className="text-sm text-muted-foreground">
                    Runs every Monday at 8:00 AM
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Active</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Monthly Performance Report</div>
                  <div className="text-sm text-muted-foreground">
                    Runs on the 1st of every month at 9:00 AM
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Active</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Quarterly Enrollment Report</div>
                  <div className="text-sm text-muted-foreground">
                    Runs quarterly at the end of each term
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Paused</Badge>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>

              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Need More Reports?</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automated reports to get insights delivered on your schedule.
                </p>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 