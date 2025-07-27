"use client";

import { getTeachers } from "@/app/apiHelpers";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Teacher = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dateOfJoining?: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateOfBirth: string;
  homeAddress?: string;
  educationDetails: string;
  status: "active" | "inactive";
  subjects: string[];
  employmentType: "full-time" | "part-time" | "contract";
  createdAt: string;
  updatedAt: string;
};

export type CreateTeacherData = Omit<
  Teacher,
  "id" | "status" | "createdAt" | "updatedAt"
>;

interface TeachersContextType {
  teachers: Teacher[];
  loading: boolean;
  addTeacher: (
    teacherData: CreateTeacherData
  ) => Promise<{ success: boolean; error?: string }>;
  updateTeacher: (
    id: string,
    updates: Partial<Teacher>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteTeacher: (id: string) => Promise<{ success: boolean; error?: string }>;
  getTeacherById: (id: string) => Teacher | undefined;
  searchTeachers: (searchTerm: string) => Teacher[];
  activeTeachers: Teacher[];
  inactiveTeachers: Teacher[];
  totalTeachers: number;
}

const TeachersContext = createContext<TeachersContextType | undefined>(
  undefined
);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolId, setSchoolId] = useState(null);
  const supabase = createClient();

  const fetchUserSessionDetails = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    console.log("User:", user?.id, user?.user_metadata?.school_id); // Debug
    setSchoolId(user?.user_metadata?.school_id);
    console.log("User Error:", userError); // Debug

    if (userError || !user) {
      console.error("No user found:", userError?.message);
      return;
    }
  };

  useEffect(() => {
    fetchUserSessionDetails();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["teachers", schoolId],
    queryFn: ({ queryKey }) => {
      const [, schoolId] = queryKey;
      console.log("schoolId-------", schoolId);
      return getTeachers(schoolId);
    },
  });

  useEffect(() => {
    if (data?.teachers) {
      setTeachers(data.teachers);
    }
  }, [data]);

  const addTeacher = async (
    teacherData: CreateTeacherData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Adding teacher with data:", teacherData); // Debug log

      const newTeacher: Teacher = {
        ...teacherData,
        id: Date.now().toString(),
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("New teacher object:", newTeacher); // Debug log

      setTeachers((prev) => {
        const updatedTeachers = [newTeacher, ...prev];
        console.log("Updated teachers array:", updatedTeachers); // Debug log
        return updatedTeachers;
      });

      return { success: true };
    } catch (error) {
      console.error("Error adding teacher:", error); // Debug log
      return { success: false, error: "Failed to add teacher" };
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
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete teacher" };
    }
  };

  const getTeacherById = (id: string): Teacher | undefined => {
    return teachers.find((teacher) => teacher.id === id);
  };

  const searchTeachers = (searchTerm: string): Teacher[] => {
    if (!searchTerm) return teachers;

    const term = searchTerm.toLowerCase();
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(term) ||
        teacher.email.toLowerCase().includes(term) ||
        teacher.subjects.some((subject) => subject.toLowerCase().includes(term))
    );
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
    searchTeachers,
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
