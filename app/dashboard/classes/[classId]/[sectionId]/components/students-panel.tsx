import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, User, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { StudentForm } from "@/app/dashboard/students/components/student-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ClassSection } from "@/contexts/ClassesContext";
import { Student, useStudents } from "@/contexts/StudentsContext";
import { GenericTable } from "@/app/components/table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";


function DeleteConfirmationDialog({ student, isOpen, onClose, onConfirm, isLoading }: { student: Student | null, isOpen: boolean, onClose: () => void, onConfirm: () => void, isLoading?: boolean }) {
  if (!student) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Student Deletion</DialogTitle>
          <DialogDescription className="py-4">
            Are you sure you want to delete student <span className="font-semibold">{student.name}</span>? This action cannot be undone, 
            and will remove their user account and all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Student
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const { fetchStudentsByClass, deleteStudent } = useStudents();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteStudent(studentToDelete.id);
      if (result.success) {
        toast.success(`${studentToDelete.name} has been deleted successfully`);
        // Refresh the student list
        const updatedStudents = await fetchStudentsByClass(classId);
        setStudents(updatedStudents);
      } else {
        toast.error(result.error || 'Failed to delete student');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

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

  const handleEdit = (student: Student) => {
    // In the future, this would open an edit dialog
    // For now, just show a message
    toast.info(`Edit functionality for ${student.name} will be implemented soon`);
  };
  
  return (
    <>
      <GenericTable 
        columns={studentColumns} 
        data={students} 
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />
      <DeleteConfirmationDialog
        student={studentToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
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
