import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  MoreHorizontal, 
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Shield,
  ShieldCheck
} from 'lucide-react'

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'Active',
      joinDate: '2022-08-15',
      lastLogin: '2024-01-15 09:30'
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael.brown@school.edu',
      phone: '+1 (555) 234-5678',
      role: 'teacher',
      status: 'Active',
      joinDate: '2023-01-10',
      lastLogin: '2024-01-15 08:45'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@school.edu',
      phone: '+1 (555) 345-6789',
      role: 'teacher',
      status: 'Active',
      joinDate: '2023-03-22',
      lastLogin: '2024-01-14 16:20'
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john.smith@student.edu',
      phone: '+1 (555) 456-7890',
      role: 'student',
      status: 'Active',
      joinDate: '2023-09-01',
      lastLogin: '2024-01-15 07:15'
    },
    {
      id: 5,
      name: 'Lisa Wilson',
      email: 'lisa.wilson@school.edu',
      phone: '+1 (555) 567-8901',
      role: 'staff',
      status: 'Inactive',
      joinDate: '2022-11-05',
      lastLogin: '2023-12-20 14:30'
    }
  ]

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: 'destructive' as const, icon: ShieldCheck },
      teacher: { variant: 'default' as const, icon: Users },
      student: { variant: 'secondary' as const, icon: Users },
      staff: { variant: 'outline' as const, icon: Shield },
      parent: { variant: 'secondary' as const, icon: Users }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.student
    const IconComponent = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {role}
      </Badge>
    )
  }

  const usersByRole = {
    all: users,
    admin: users.filter(u => u.role === 'admin'),
    teacher: users.filter(u => u.role === 'teacher'),
    student: users.filter(u => u.role === 'student'),
    staff: users.filter(u => u.role === 'staff')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their roles across the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              All platform users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole.admin.length}</div>
            <p className="text-xs text-muted-foreground">
              System admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole.teacher.length}</div>
            <p className="text-xs text-muted-foreground">
              Teaching staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole.student.length}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole.staff.length}</div>
            <p className="text-xs text-muted-foreground">
              Support staff
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8" />
        </div>
      </div>

      {/* Users Table with Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({usersByRole.admin.length})</TabsTrigger>
          <TabsTrigger value="teacher">Teachers ({usersByRole.teacher.length})</TabsTrigger>
          <TabsTrigger value="student">Students ({usersByRole.student.length})</TabsTrigger>
          <TabsTrigger value="staff">Staff ({usersByRole.staff.length})</TabsTrigger>
        </TabsList>

        {Object.entries(usersByRole).map(([role, roleUsers]) => (
          <TabsContent key={role} value={role}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {role === 'all' ? 'All Users' : `${role.charAt(0).toUpperCase() + role.slice(1)} Users`}
                </CardTitle>
                <CardDescription>
                  {role === 'all' 
                    ? 'Complete list of all platform users'
                    : `Users with ${role} role privileges`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                              {user.email}
                            </div>
                            <div className="flex items-center text-xs">
                              <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                              {user.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{user.lastLogin}</div>
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
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 