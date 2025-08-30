"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Users, User, GraduationCap, BookOpen, UserPlus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { useStudents } from "@/contexts/StudentsContext";
import { useClasses } from "@/contexts/ClassesContext";
import { StudentDialog } from "./components/student-dialog";
import { GenericTable } from "@/app/components/table";
import { Student } from "@/contexts/StudentsContext";
import { toast } from "sonner";

interface Filters {
  classId: string;
  sectionId: string;
  status: string;
}

// We need to create this as a function that takes classes as parameter
const createStudentColumns = (classes: any[]): ColumnDef<Student>[] => [
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Roll Number",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="text-sm">
          <div>{student.rollNumber || "N/A"}</div>
        </div>
      );
    },
  },
  {
    header: "Class & Section",
    cell: ({ row }) => {
      const student = row.original;
      const className = classes.find((c) => c.id === student.classId)?.name || "Unknown Class";
      const cls = classes.find((c) => c.id === student.classId);
      const sectionName = cls?.sections?.find((s: any) => s.id === student.sectionId)?.name || "Unknown Section";
      
      return (
        <div className="text-sm">
          <div>{className}</div>
          <div className="text-muted-foreground">{sectionName}</div>
        </div>
      );
    },
  },
  {
    header: "Contact",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="text-sm">
          <div>{student.mobile}</div>
          <div className="text-muted-foreground">
            {student.gender}, {student.bloodGroup}
          </div>
        </div>
      );
    },
  },
  {
    header: "Parent Info",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="text-sm">
          <div>{student.parentName}</div>
          <div className="text-muted-foreground">{student.parentMobile}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Enrolled",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "-",
  },
];

interface EmptyStudentsStateProps {
  hasStudents: boolean;
  isFiltered: boolean;
  onAddStudent: () => void;
  onClearFilters: () => void;
}

function EmptyStudentsState({ hasStudents, isFiltered, onAddStudent, onClearFilters }: EmptyStudentsStateProps) {
  if (!hasStudents) {
    // No students at all - first time setup
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Students Yet
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Get started by adding your first student to the system. You can manage their information, track attendance, and more.
          </p>
          <Button 
            onClick={onAddStudent}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Student
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isFiltered) {
    // Has students but none match current filters
    return (
      <Card className="border-2 border-dashed border-orange-300 bg-orange-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Filter className="h-10 w-10 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Students Match Your Filters
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Try adjusting your class or section filters to see more students, or add a new student to this class/section.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={onClearFilters}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Clear Filters
            </Button>
            <Button 
              onClick={onAddStudent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback empty state
  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
        <p className="text-gray-600 mb-4">There are no students to display.</p>
        <Button onClick={onAddStudent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </CardContent>
    </Card>
  );
}

const StudentsPageContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    classId: "all",
    sectionId: "all",
    status: "active",
  });
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { students, loading, activeStudents, inactiveStudents, deleteStudent } =
    useStudents();
  const { classes } = useClasses();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const selectedClass = selectedClassId === "all" ? null : classes.find((c) => c.id === selectedClassId);
  const sections = selectedClass?.sections || [];

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesClass = filters.classId === "all" || student.classId === filters.classId;
      const matchesSection = filters.sectionId === "all" || student.sectionId === filters.sectionId;
      const matchesStatus = !filters.status || student.status === filters.status;
      return matchesClass && matchesSection && matchesStatus;
    });
  }, [students, filters]);

  const filteredStats = useMemo(() => {
    const activeFiltered = filteredStudents.filter(s => s.status === "active");
    const inactiveFiltered = filteredStudents.filter(s => s.status === "inactive");
    const uniqueClasses = new Set(filteredStudents.map(s => s.classId)).size;
    
    return {
      total: filteredStudents.length,
      active: activeFiltered.length,
      inactive: inactiveFiltered.length,
      classes: uniqueClasses
    };
  }, [filteredStudents]);

  const getClassName = (classId: string) =>
    classes.find((c) => c.id === classId)?.name || "Unknown Class";

  const getSectionName = (classId: string, sectionId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return (
      cls?.sections?.find((s) => s.id === sectionId)?.name || "Unknown Section"
    );
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "classId" ? { sectionId: "all" } : {}),
    }));
    if (key === "classId") setSelectedClassId(value);
  };

  const handleStudentAdded = () => {
    // Refresh the list when a new student is added
    setFilters({ classId: "all", sectionId: "all", status: "active" });
  };

  const handleDeleteStudent = async (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      const result = await deleteStudent(student.id);
      if (result.success) {
        toast.success("Student deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete student");
      }
    }
  };

  if (loading) return <StudentsLoadingSkeleton />;

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student information and enrollments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StudentDialog 
              onSuccess={handleStudentAdded}
              initialData={studentToEdit}
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              }
            />
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm font-medium text-blue-900">Filter Students</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Class</label>
                  <Select
                    value={filters.classId}
                    onValueChange={(value) => handleFilterChange("classId", value)}
                  >
                    <SelectTrigger className="w-48 bg-white">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Section</label>
                  <Select
                    value={filters.sectionId}
                    onValueChange={(value) => handleFilterChange("sectionId", value)}
                    disabled={selectedClassId === "all"}
                  >
                    <SelectTrigger className="w-48 bg-white">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                <span className="font-medium">{filteredStats.total}</span> students found
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              {filters.classId === "all" && filters.sectionId === "all" ? "Total Students" : "Filtered Students"}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filters.classId === "all" ? "All classes" : `Class ${selectedClass?.name || filters.classId}`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Active Students
            </CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{filteredStats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently enrolled
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Inactive Students
            </CardTitle>
            <User className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{filteredStats.inactive}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Not currently active
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Classes Covered</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{filteredStats.classes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filters.classId === "all" ? "Total classes" : "Selected class"}
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Students Table or Empty State */}
      {filteredStudents.length === 0 ? (
        <EmptyStudentsState 
          hasStudents={students.length > 0}
          isFiltered={filters.classId !== "all" || filters.sectionId !== "all"}
          onAddStudent={() => {
            setStudentToEdit(null);
            setIsDialogOpen(true);
          }}
          onClearFilters={() => {
            setFilters({ classId: "all", sectionId: "all", status: "active" });
            setSelectedClassId("all");
          }}
        />
      ) : (
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Students List
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredStats.total} students • {filteredStats.active} active • {filteredStats.inactive} inactive
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {filters.classId === "all" ? "All Classes" : selectedClass?.name}
                {filters.sectionId !== "all" && ` - ${sections.find(s => s.id === filters.sectionId)?.name}`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <GenericTable<Student>
              data={filteredStudents}
              columns={createStudentColumns(classes)}
              pageSize={10}
              onEdit={(row) => {
                setStudentToEdit(row);
                setIsDialogOpen(true);
              }}
              onDelete={handleDeleteStudent}
            />
          </CardContent>
        </Card>
      )}

      {/* Student Dialog */}
      <StudentDialog 
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setStudentToEdit(null);
        }}
        onSuccess={handleStudentAdded}
        initialData={studentToEdit}
      />
    </div>
  );
}

function StudentsLoadingSkeleton() {
  // How many headers and rows? Match your real table
  const columns = [
    "Student",
    "Roll Number", 
    "Class & Section",
    "Contact",
    "Parent Info",
    "Status",
    "Enrolled",
    "",
  ];
  const rows = 8; // Or pageSize if you want to match how many will load

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Skeleton */}
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

      {/* Filters Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-2 font-medium text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-t">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-2">
                    <Skeleton
                      className={colIdx === 0 ? "h-6 w-48" : "h-4 w-24"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  return <StudentsPageContent />;
}
