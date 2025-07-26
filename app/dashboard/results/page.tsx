import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp,
  Award,
  FileText,
  Download,
  Upload,
  GraduationCap,
  Target
} from 'lucide-react'

export default function ResultsPage() {
  const classResults = [
    { id: 1, class: 'Grade 10A - Math', average: 87.5, highest: 98, lowest: 65, students: 28, improvement: 5.2 },
    { id: 2, class: 'Grade 9B - Science', average: 91.3, highest: 99, lowest: 78, students: 24, improvement: 3.8 },
    { id: 3, class: 'Grade 11A - English', average: 89.7, highest: 96, lowest: 72, students: 22, improvement: -1.2 },
    { id: 4, class: 'Grade 12C - History', average: 85.4, highest: 94, lowest: 68, students: 26, improvement: 2.1 }
  ]

  const topPerformers = [
    { id: 1, name: 'Emily Chen', class: 'Grade 12A', subject: 'Mathematics', score: 98.5, grade: 'A+' },
    { id: 2, name: 'Michael Johnson', class: 'Grade 11B', subject: 'Science', score: 97.2, grade: 'A+' },
    { id: 3, name: 'Sarah Williams', class: 'Grade 10A', subject: 'English', score: 96.8, grade: 'A+' },
    { id: 4, name: 'David Brown', class: 'Grade 9C', subject: 'History', score: 95.1, grade: 'A' },
    { id: 5, name: 'Lisa Davis', class: 'Grade 12B', subject: 'Chemistry', score: 94.7, grade: 'A' }
  ]

  const recentExams = [
    { id: 1, name: 'Mid-Term Mathematics', date: '2024-01-10', class: 'Grade 10A', submissions: 28, graded: 28, avgScore: 87.5 },
    { id: 2, name: 'Science Quiz #3', date: '2024-01-12', class: 'Grade 9B', submissions: 24, graded: 22, avgScore: 91.3 },
    { id: 3, name: 'English Essay', date: '2024-01-08', class: 'Grade 11A', submissions: 22, graded: 20, avgScore: 89.7 },
    { id: 4, name: 'History Test', date: '2024-01-05', class: 'Grade 12C', submissions: 26, graded: 26, avgScore: 85.4 }
  ]

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeBadge = (grade: string) => {
    const gradeConfig = {
      'A+': 'default',
      'A': 'default',
      'B+': 'secondary',
      'B': 'secondary',
      'C+': 'outline',
      'C': 'outline',
      'D': 'destructive',
      'F': 'destructive'
    }
    return gradeConfig[grade as keyof typeof gradeConfig] || 'outline'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-muted-foreground">
            Academic performance tracking and grade analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Grades
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3%</span> from last semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Students with A grades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <p className="text-xs text-muted-foreground">
              Students passing exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">
              Students showing improvement
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Class Overview</TabsTrigger>
          <TabsTrigger value="performers">Top Performers</TabsTrigger>
          <TabsTrigger value="exams">Recent Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance Overview</CardTitle>
              <CardDescription>Academic performance summary by class</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Improvement</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.class}</TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${getGradeColor(result.average)}`}>
                          {result.average}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {result.lowest}% - {result.highest}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <GraduationCap className="mr-1 h-3 w-3 text-muted-foreground" />
                          {result.students}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {result.improvement > 0 ? (
                            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                          ) : (
                            <BarChart3 className="mr-1 h-3 w-3 text-red-600" />
                          )}
                          <span className={result.improvement > 0 ? 'text-green-600' : 'text-red-600'}>
                            {result.improvement > 0 ? '+' : ''}{result.improvement}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={result.average} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {result.average >= 90 ? 'Excellent' : result.average >= 80 ? 'Good' : result.average >= 70 ? 'Average' : 'Needs Improvement'}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>Students with highest academic achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {index === 0 && <Award className="mr-2 h-4 w-4 text-yellow-500" />}
                          {index === 1 && <Award className="mr-2 h-4 w-4 text-gray-400" />}
                          {index === 2 && <Award className="mr-2 h-4 w-4 text-amber-600" />}
                          <span className="font-medium">#{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.subject}</TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${getGradeColor(student.score)}`}>
                          {student.score}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getGradeBadge(student.grade) as "default" | "secondary" | "outline" | "destructive"}>
                          {student.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Examinations</CardTitle>
              <CardDescription>Latest exam results and grading status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Grading Status</TableHead>
                    <TableHead>Average Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{exam.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                      <TableCell>{exam.class}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {exam.submissions} submitted
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={exam.graded === exam.submissions ? 'default' : 'secondary'}>
                          {exam.graded} / {exam.submissions} graded
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-lg font-bold ${getGradeColor(exam.avgScore)}`}>
                          {exam.avgScore}%
                        </span>
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