"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Student = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address: string;
  parentName: string;
  parentMobile: string;
  classId: string;
  sectionId: string;
  status: "active" | "inactive";
  rollNumber?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateStudentData = Omit<
  Student,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type UpdateStudentData = Partial<
  Omit<Student, "id" | "createdAt" | "updatedAt">
>;

// Dummy student data
const dummyStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@student.com",
    mobile: "+1234567890",
    dateOfBirth: "2010-05-15",
    gender: "female",
    bloodGroup: "A+",
    address: "123 Student Street, Education City",
    parentName: "Robert Johnson",
    parentMobile: "+1234567891",
    classId: "1",
    sectionId: "1a",
    status: "active",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@student.com",
    mobile: "+1234567892",
    dateOfBirth: "2010-08-20",
    gender: "male",
    bloodGroup: "B+",
    address: "456 Learning Lane, Knowledge District",
    parentName: "Mary Smith",
    parentMobile: "+1234567893",
    classId: "1",
    sectionId: "1b",
    status: "active",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.brown@student.com",
    mobile: "+1234567894",
    dateOfBirth: "2011-03-10",
    gender: "male",
    bloodGroup: "O+",
    address: "789 Education Ave, Learning Park",
    parentName: "Lucy Brown",
    parentMobile: "+1234567895",
    classId: "2",
    sectionId: "2a",
    status: "active",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
];

interface StudentsContextType {
  students: Student[];
  loading: boolean;
  addStudent: (
    studentData: CreateStudentData
  ) => Promise<{ success: boolean; error?: string }>;
  updateStudent: (
    id: string,
    updates: UpdateStudentData
  ) => Promise<{ success: boolean; error?: string }>;
  deleteStudent: (id: string) => Promise<{ success: boolean; error?: string }>;
  getStudentById: (id: string) => Student | undefined;
  getStudentsByClass: (classId: string) => Student[];
  getStudentsBySection: (classId: string, sectionId: string) => Student[];
  searchStudents: (searchTerm: string) => Student[];
  activeStudents: Student[];
  inactiveStudents: Student[];
  totalStudents: number;
}

const StudentsContext = createContext<StudentsContextType | undefined>(
  undefined
);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadStudents = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStudents(dummyStudents);
      setLoading(false);
    };

    loadStudents();
  }, []);

  const addStudent = async (
    studentData: CreateStudentData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString(),
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStudents((prev) => [newStudent, ...prev]);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to add student" };
    }
  };

  const updateStudent = async (
    id: string,
    updates: UpdateStudentData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === id
            ? { ...student, ...updates, updatedAt: new Date().toISOString() }
            : student
        )
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to update student" };
    }
  };

  const deleteStudent = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setStudents((prev) => prev.filter((student) => student.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete student" };
    }
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find((student) => student.id === id);
  };

  const getStudentsByClass = (classId: string): Student[] => {
    return students.filter((student) => student.classId === classId);
  };

  const getStudentsBySection = (
    classId: string,
    sectionId: string
  ): Student[] => {
    return students.filter(
      (student) =>
        student.classId === classId && student.sectionId === sectionId
    );
  };

  const searchStudents = (searchTerm: string): Student[] => {
    if (!searchTerm) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.parentName.toLowerCase().includes(term)
    );
  };

  const activeStudents = students.filter((s) => s.status === "active");
  const inactiveStudents = students.filter((s) => s.status === "inactive");

  const value: StudentsContextType = {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByClass,
    getStudentsBySection,
    searchStudents,
    activeStudents,
    inactiveStudents,
    totalStudents: students.length,
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
}
