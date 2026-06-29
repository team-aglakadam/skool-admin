'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  TrendingUp,
  AlertCircle,
  BookOpen,
  Calendar,
  Bell
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your school management system.
        </p>
      </div>

      {/* Alert */}
      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          You have 3 pending approvals and 2 new messages waiting for your attention.
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> new this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> average score
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Attendance Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Daily attendance rates for the current week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Monday</p>
                  <p className="text-xs text-muted-foreground">1,180 / 1,284 students</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">91.9%</Badge>
                </div>
              </div>
              <Progress value={91.9} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Tuesday</p>
                  <p className="text-xs text-muted-foreground">1,220 / 1,284 students</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">95.0%</Badge>
                </div>
              </div>
              <Progress value={95.0} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Wednesday</p>
                  <p className="text-xs text-muted-foreground">1,255 / 1,284 students</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">97.7%</Badge>
                </div>
              </div>
              <Progress value={97.7} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Thursday</p>
                  <p className="text-xs text-muted-foreground">1,198 / 1,284 students</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">93.3%</Badge>
                </div>
              </div>
              <Progress value={93.3} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Friday</p>
                  <p className="text-xs text-muted-foreground">1,165 / 1,284 students</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">90.7%</Badge>
                </div>
              </div>
              <Progress value={90.7} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">New student enrollment</p>
                <p className="text-xs text-muted-foreground">John Doe joined Grade 10A</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <ClipboardCheck className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Attendance submitted</p>
                <p className="text-xs text-muted-foreground">Grade 9B attendance recorded</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-orange-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">New class created</p>
                <p className="text-xs text-muted-foreground">Advanced Mathematics opened</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Schedule updated</p>
                <p className="text-xs text-muted-foreground">Science lab timings changed</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Classes</CardTitle>
          <CardDescription>Academic performance by class this semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Grade 12A</span>
                <Badge>95.2%</Badge>
              </div>
              <Progress value={95.2} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Grade 11B</span>
                <Badge>92.8%</Badge>
              </div>
              <Progress value={92.8} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Grade 10C</span>
                <Badge>90.5%</Badge>
              </div>
              <Progress value={90.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 