'use client'

import { useState } from 'react';
import { Plus, Search, Users, User, GraduationCap, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudents } from '@/contexts/StudentsContext';
import { useClasses } from '@/contexts/ClassesContext';
import { StudentDialog } from './components/student-dialog';

interface Filters {
  classId: string;
  sectionId: string;
  status: string;
}

interface StudentCardProps {
  student: any;
  className: string;
  sectionName: string;
  onDelete: (id: string) => void;
}

function StudentCard({ student, className, sectionName, onDelete }: StudentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                {className} - {sectionName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(student.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm space-y-1">
          <p>Roll: {student.rollNumber || 'N/A'}</p>
          <p className="text-muted-foreground">{student.email || 'No email'}</p>
          <p className="text-muted-foreground">{student.mobile || 'No phone'}</p>
        </div>
      </CardContent>
    </Card>
  );
}



export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    classId: '',
    sectionId: '',
    status: 'active',
  });
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const { students, loading, activeStudents, inactiveStudents, deleteStudent } = useStudents();
  const { classes } = useClasses();
  
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const sections = selectedClass?.sections || [];

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm ? 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesClass = !filters.classId || student.classId === filters.classId;
    const matchesSection = !filters.sectionId || student.sectionId === filters.sectionId;
    const matchesStatus = !filters.status || student.status === filters.status;
    return matchesSearch && matchesClass && matchesSection && matchesStatus;
  });

  const getClassName = (classId: string) => 
    classes.find(c => c.id === classId)?.name || 'Unknown Class';

  const getSectionName = (classId: string, sectionId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls?.sections?.find(s => s.id === sectionId)?.name || 'Unknown Section';
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'classId' ? { sectionId: '' } : {})
    }));
    if (key === 'classId') setSelectedClassId(value);
  };

  const resetFilters = () => {
    setFilters({ classId: '', sectionId: '', status: 'active' });
    setSelectedClassId('');
    setSearchTerm('');
  };

  const handleStudentAdded = () => {
    // Reset search and filters when a new student is added
    setSearchTerm('');
    setFilters({ classId: '', sectionId: '', status: 'active' });
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const result = await deleteStudent(id);
      if (!result.success) {
        alert(`Failed to delete student: ${result.error}`);
      }
    }
  };

  if (loading) return <StudentsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and enrollments
          </p>
        </div>
        <StudentDialog onSuccess={handleStudentAdded} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Students</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {students.length === 0 ? 'No students yet' : 'No matching students'}
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || Object.values(filters).some(Boolean) 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first student'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                className={getClassName(student.classId)}
                sectionName={getSectionName(student.classId, student.sectionId)}
                onDelete={handleDeleteStudent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



function StudentsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-10 w-72" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}