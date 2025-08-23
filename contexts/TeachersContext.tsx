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
  updateTeacher as updateTeacherApi,
  UpdateTeacherData,
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
  ) => Promise<{
    success: boolean;
    error?: string;
    data?: { message?: string };
  }>;
  updateTeacher: (
    id: string,
    updates: UpdateTeacherData
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  deleteTeacher: (id: string) => Promise<{ success: boolean; error?: string }>;
  getTeacherById: (id: string) => Teacher | undefined;
  activeTeachers: Teacher[];
  inactiveTeachers: Teacher[];
  totalTeachers: number;
}

const TeachersContext = createContext<TeachersContextType | undefined>(
  undefined
);

// Mock teachers data for testing
const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@school.com",
    mobile: "+1234567890",
    dateOfJoining: "2023-01-15",
    gender: "male",
    bloodGroup: "A+",
    dateOfBirth: "1985-05-20",
    homeAddress: "123 Main St, City, State",
    educationDetails: "Masters in Education",
    status: "active",
    subjects: ["Mathematics", "Physics"],
    employmentType: "full-time",
    createdAt: "2023-01-15T09:00:00Z",
    updatedAt: "2023-01-15T09:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.com",
    mobile: "+1234567891",
    dateOfJoining: "2023-02-01",
    gender: "female",
    bloodGroup: "B+",
    dateOfBirth: "1990-08-15",
    homeAddress: "456 Oak Ave, City, State",
    educationDetails: "Bachelors in English Literature",
    status: "active",
    subjects: ["English", "Literature"],
    employmentType: "full-time",
    createdAt: "2023-02-01T09:00:00Z",
    updatedAt: "2023-02-01T09:00:00Z",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@school.com",
    mobile: "+1234567892",
    dateOfJoining: "2023-03-10",
    gender: "male",
    bloodGroup: "O+",
    dateOfBirth: "1988-12-03",
    homeAddress: "789 Pine Rd, City, State",
    educationDetails: "Masters in Science",
    status: "active",
    subjects: ["Chemistry", "Biology"],
    employmentType: "full-time",
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-03-10T09:00:00Z",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@school.com",
    mobile: "+1234567893",
    dateOfJoining: "2023-04-05",
    gender: "female",
    bloodGroup: "AB+",
    dateOfBirth: "1992-03-22",
    homeAddress: "321 Elm St, City, State",
    educationDetails: "Bachelors in History",
    status: "active",
    subjects: ["History", "Social Studies"],
    employmentType: "full-time",
    createdAt: "2023-04-05T09:00:00Z",
    updatedAt: "2023-04-05T09:00:00Z",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@school.com",
    mobile: "+1234567894",
    dateOfJoining: "2023-05-20",
    gender: "male",
    bloodGroup: "A-",
    dateOfBirth: "1987-07-10",
    homeAddress: "654 Maple Dr, City, State",
    educationDetails: "Masters in Computer Science",
    status: "active",
    subjects: ["Computer Science", "Mathematics"],
    employmentType: "full-time",
    createdAt: "2023-05-20T09:00:00Z",
    updatedAt: "2023-05-20T09:00:00Z",
  },
];

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
    retry: false, // Don't retry on failure
  });

  useEffect(() => {
    if (data?.teachers) {
      setTeachers(data.teachers);
    } else if (!schoolId) {
      // Use mock data if no schoolId (for testing)
      setTeachers(mockTeachers);
    }
  }, [data, schoolId]);

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

  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTeacherData }) =>
      updateTeacherApi(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers", schoolId] });
    },
  });

  const updateTeacher = async (
    id: string,
    updates: UpdateTeacherData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await updateTeacherMutation.mutateAsync({ id, updates });
      return { success: true };
    } catch (error) {
      console.error("Error updating teacher:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update teacher",
      };
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
