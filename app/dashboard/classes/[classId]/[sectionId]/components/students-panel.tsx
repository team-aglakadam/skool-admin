import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { StudentForm } from "@/app/dashboard/students/components/student-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ClassSection } from "@/contexts/ClassesContext";
import { Student, useStudents } from "@/contexts/StudentsContext";
import { GenericTable } from "@/app/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
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
    accessorKey: "rollNumber",
  },
  {
    header: "Contact",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.original.mobile}</div>
        <div className="text-muted-foreground">{row.original.gender}, {row.original.bloodGroup}</div>
      </div>
    ),
  },
  {
    header: "Parent Info",
    cell: ({ row }) => (
      <div className="text-sm">
        <div>{row.original.parentName}</div>
        <div className="text-muted-foreground">{row.original.parentMobile}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      </Badge>
    ),
  },
];

function ClassStudentsList({ classId }: { classId: string }) {
  const { fetchStudentsByClass } = useStudents();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      if (!classId) return;
      setIsLoading(true);
      setError(null);
      try {
        const fetchedStudents = await fetchStudentsByClass(classId);
        setStudents(fetchedStudents);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        toast.error("Failed to load students for this class.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, [classId, fetchStudentsByClass]);

  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  if (students.length === 0) {
    return (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">No students have been assigned to this section yet.</p>
        </div>
    );
  }

  return <GenericTable columns={studentColumns} data={students} />;
}

interface StudentsPanelProps {
  classData: { name: string };
  sectionData: ClassSection;
  onClose: () => void;
}

export function StudentsPanel({ classData, sectionData, onClose }: StudentsPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    toast.success("Student added successfully");
    // You might want to refresh the student list here
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Students
            </CardTitle>
            <CardDescription>
              Add, remove, and manage students in {classData.name} - Section {sectionData.name}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new student to {classData.name} - Section {sectionData.name}. Class and section are pre-selected.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <StudentForm
                      disableClassSection={true}
                      initialData={{
                        id: "",
                        name: "",
                        email: "",
                        mobile: "",
                        dateOfBirth: "",
                        gender: "prefer-not-to-say",
                        bloodGroup: "O+",
                        address: "",
                        parentName: "",
                        parentMobile: "",
                        classId: sectionData.classId,
                        sectionId: sectionData.id,
                        status: "active",
                        createdAt: "",
                        updatedAt: ""
                      } as Student}
                      onSuccess={handleAddSuccess}
                      onCancel={() => setIsAddDialogOpen(false)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline">
                <User className="h-3 w-3 mr-1" />
                Import Students
              </Button>
            </div>
            <Badge variant="secondary">{sectionData.studentCount} students</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Manage student enrollment, attendance, and academic records for this section.
          </div>
          <ClassStudentsList classId={sectionData.id} />
        </div>
      </CardContent>
    </Card>
  );
}
