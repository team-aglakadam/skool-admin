import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  BookOpen, 
  Plus, 
  MoreHorizontal, 
  Users, 
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

export default function SchoolsPage() {
  const schools = [
    {
      id: 1,
      name: 'Springfield Elementary School',
      address: '123 Education St, Springfield, IL 62701',
      phone: '+1 (555) 123-4567',
      email: 'admin@springfield-elem.edu',
      students: 542,
      teachers: 28,
      status: 'Active',
      principal: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      name: 'Riverside High School',
      address: '456 Learning Ave, Riverside, CA 92501',
      phone: '+1 (555) 987-6543',
      email: 'contact@riverside-high.edu',
      students: 1284,
      teachers: 65,
      status: 'Active',
      principal: 'Mr. Michael Brown'
    },
    {
      id: 3,
      name: 'Oakwood Middle School',
      address: '789 Knowledge Blvd, Oakwood, TX 75001',
      phone: '+1 (555) 456-7890',
      email: 'info@oakwood-middle.edu',
      students: 856,
      teachers: 42,
      status: 'Active',
      principal: 'Ms. Emily Davis'
    },
    {
      id: 4,
      name: 'Pine Valley Academy',
      address: '321 Scholar Way, Pine Valley, NY 10001',
      phone: '+1 (555) 321-0987',
      email: 'admin@pinevalley-academy.edu',
      students: 298,
      teachers: 18,
      status: 'Inactive',
      principal: 'Dr. Robert Wilson'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
          <p className="text-muted-foreground">
            Manage and monitor all schools in your network
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add School
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,980</div>
            <p className="text-xs text-muted-foreground">
              Across all schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">153</div>
            <p className="text-xs text-muted-foreground">
              Teaching staff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Schools Directory</CardTitle>
          <CardDescription>
            A comprehensive list of all schools in your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Name</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{school.name}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {school.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{school.principal}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                      {school.students.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                      {school.teachers}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={school.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {school.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs">
                        <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                        {school.phone}
                      </div>
                      <div className="flex items-center text-xs">
                        <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                        {school.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit School
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete School
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 