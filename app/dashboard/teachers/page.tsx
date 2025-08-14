"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { useTeachers } from "@/hooks/useTeachers";
import { AddTeacherDialog } from "./AddTeacherDialog";
import { GenericTable } from "@/app/components/table";
import { Teacher } from "@/types/teacher";
import { DeleteUserModal } from "@/app/components/DeleteUserModal";
import { toast } from "sonner";
import { useTeachersStore } from "@/store/teachersStore";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
  userName: string;
  userType?: string;
}

const TeachersPageContent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isLoading, deleteTeacher, deleteSuccess } = useTeachers();
  const { teachers } = useTeachersStore();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Teacher deleted successfully");
    }
  }, [deleteSuccess]);

  const handleOpenDeleteModal = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;

    try {
      deleteTeacher(teacherToDelete.id);
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    } catch (error) {
      toast.error("Failed to delete teacher. Please try again later.");
    }
  };

  if (isLoading) {
    return <TeachersLoadingSkeleton />;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">
            Manage your teaching staff and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddTeacherDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setTeacherToEdit(null);
            }}
            teacherData={teacherToEdit}
            mode={teacherToEdit ? "edit" : "create"}
          >
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </AddTeacherDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers?.filter((t) => t.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subjects Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(teachers.flatMap((t) => t.subjects)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <GenericTable<Teacher>
        data={teachers}
        columns={teacherColumns}
        pageSize={10}
        onEdit={(row) => {
          setTeacherToEdit(row);
          setIsDialogOpen(true);
        }}
        onDelete={(row) => {
          handleOpenDeleteModal(row);
        }}
      />
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        userName={teacherToDelete?.name || "this teacher"}
        userType="teacher"
      />
    </div>
  );
};

const teacherColumns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "name",
    header: "Teacher",
    cell: ({ row }) => {
      const teacher = row.original;
      console.log("teacher", teacher);
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{teacher.name}</div>
            <div className="text-sm text-muted-foreground">{teacher.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Contact",
    cell: ({ row }) => {
      const teacher = row.original;
      return (
        <div className="text-sm">
          <div>{teacher.mobile}</div>
          <div className="text-muted-foreground">
            {teacher.gender}, {teacher.bloodGroup}
          </div>
        </div>
      );
    },
  },
  {
    header: "Subjects",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.subjects?.length === 0 && "-"}
        {row.original.subjects?.map((subject: string) => (
          <Badge key={subject} variant="outline" className="text-xs">
            {subject}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "employmentType",
    header: "Employment",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.employmentType.charAt(0).toUpperCase() +
          row.original.employmentType.slice(1)}
      </Badge>
    ),
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
    accessorKey: "dateOfJoining",
    header: "Joined",
    cell: ({ row }) =>
      row.original.dateOfJoining
        ? new Date(row.original.dateOfJoining).toLocaleDateString()
        : "-",
  },
];

function TeachersLoadingSkeleton() {
  // How many headers and rows? Match your real table
  const columns = [
    "Teacher",
    "Contact",
    "Subjects",
    "Employment",
    "Status",
    "Joined",
    "",
  ];
  const rows = 8; // Or pageSize if you want to match how many will load

  return (
    <div className="space-y-6">
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

export default function TeachersPage() {
  return <TeachersPageContent />;
}
