"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeachers,
  addTeacher as addTeacherApi,
  deleteTeacher as deleteTeacherApi,
} from "@/app/apiHelpers";
import { Teacher } from "@/app/types/teacher";
import { useAuth } from "@/contexts/AuthContext";

export type CreateTeacherData = Omit<
  Teacher,
  "id" | "status" | "createdAt" | "updatedAt"
>;

interface TeachersContextType {
  teachers: Teacher[];
  loading: boolean;
  addTeacher: (
    teacherData: CreateTeacherData
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  updateTeacher: (
    id: string,
    updates: Partial<Teacher>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTeacher: (id: string) => Promise<{ success: boolean; error?: string }>;
  getTeacherById: (id: string) => Teacher | undefined;
  activeTeachers: Teacher[];
  inactiveTeachers: Teacher[];
  totalTeachers: number;
}

const TeachersContext = createContext<TeachersContextType | undefined>(
  undefined
);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const { schoolId } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["teachers", schoolId],
    queryFn: ({ queryKey }) => {
      const [, schoolId] = queryKey;
      return getTeachers(schoolId);
    },
    enabled: !!schoolId, // Only run the query when schoolId is available
  });

  useEffect(() => {
    if (data?.teachers) {
      setTeachers(data.teachers);
    }
  }, [data]);

  const queryClient = useQueryClient();

  const addTeacherMutation = useMutation({
    mutationFn: (teacherData: CreateTeacherData) => addTeacherApi(teacherData),
    onSuccess: () => {
      // Invalidate and refetch the teachers query
      queryClient.invalidateQueries({ queryKey: ["teachers", schoolId] });
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => deleteTeacherApi(id),
  });

  const addTeacher = async (
    teacherData: CreateTeacherData
  ): Promise<{ success: boolean; error?: string; data: object }> => {
    try {
      const response = await addTeacherMutation.mutateAsync(teacherData);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error adding teacher:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add teacher",
        data: {},
      };
    }
  };

  const updateTeacher = async (
    id: string,
    updates: Partial<Teacher>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === id
            ? { ...teacher, ...updates, updatedAt: new Date().toISOString() }
            : teacher
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to update teacher" };
    }
  };

  const deleteTeacher = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await deleteTeacherMutation.mutateAsync(id);
      if (response.message) {
        refetch();
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting teacher:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete teacher",
      };
    }
  };

  const getTeacherById = (id: string): Teacher | undefined => {
    return teachers.find((teacher) => teacher.id === id);
  };

  const activeTeachers = teachers.filter((t) => t.status === "active");
  const inactiveTeachers = teachers.filter((t) => t.status === "inactive");

  const value: TeachersContextType = {
    teachers,
    loading: isLoading,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    activeTeachers,
    inactiveTeachers,
    totalTeachers: teachers.length,
  };

  return (
    <TeachersContext.Provider value={value}>
      {children}
    </TeachersContext.Provider>
  );
}

export function useTeachers() {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    throw new Error("useTeachers must be used within a TeachersProvider");
  }
  return context;
}
