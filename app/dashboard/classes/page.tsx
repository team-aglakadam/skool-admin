"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  GraduationCap,
  User,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClasses, Class, ClassSection } from "@/contexts/ClassesContext";
import { useTeachers } from "@/contexts/TeachersContext";
import { useSubjects } from "@/contexts/SubjectsContext";
import { useSubjectAssignments } from "@/contexts/SubjectAssignmentsContext";
import { CreateClassDialog, ClassCardsGrid, EmptyState } from "./components";

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    classes,
    loading,
    searchClasses,
    getTotalStudents,
    getTotalSections,
    deleteClass,
  } = useClasses();
  const { teachers } = useTeachers();
  const { subjects } = useSubjects();
  const { subjectAssignments, deleteSubjectAssignment } =
    useSubjectAssignments();

  const filteredClasses = searchClasses(searchTerm);

  const handleDeleteClass = async (classId: string, className: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${className}"? This action cannot be undone.`
      )
    ) {
      const result = await deleteClass(classId);
      if (result.success) {
        // State will be updated automatically by the context
        console.log(`Class "${className}" deleted successfully`);
      } else {
        console.error("Failed to delete class:", result.error);
      }
    }
  };

  if (loading) {
    return <ClassesLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">
            Manage classes, sections, and subject assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateClassDialog
            onSuccess={() => {
              // Refresh data if needed
            }}
          >
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </CreateClassDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sections
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalSections()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalStudents()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Subject Assignments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjectAssignments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Class Cards */}
      <ClassCardsGrid
        classes={filteredClasses}
        teachers={teachers}
        onDeleteClass={handleDeleteClass}
      />

      {/* Empty State */}
      {filteredClasses.length === 0 && <EmptyState searchTerm={searchTerm} />}
    </div>
  );
}

function ClassesLoadingSkeleton() {
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
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <Skeleton key={j} className="h-20 w-full" />
                  ))}
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
