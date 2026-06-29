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

// Modified to make some fields optional for form compatibility
export type CreateStudentData = {
  name: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  address?: string;
  parentName: string;
  parentMobile: string;
  classId: string;
  sectionId: string;
  rollNumber?: string;
};

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
  fetchStudentsByClass: (classId: string) => Promise<Student[]>;
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
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create student');
      }

      const result = await response.json();
      
      if (result.success) {
        const newStudent: Student = {
          ...studentData,
          id: result.data.id,
          // Ensure required fields are present with default values if missing
          gender: studentData.gender || 'prefer-not-to-say',
          bloodGroup: studentData.bloodGroup || 'O+',
          address: studentData.address || '',
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setStudents((prev) => [newStudent, ...prev]);
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to create student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to add student" 
      };
    }
  };

  const updateStudent = async (
    id: string,
    updates: UpdateStudentData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update student');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state with the returned data
        setStudents((prev) =>
          prev.map((student) =>
            student.id === id
              ? { 
                  ...student, 
                  ...updates, 
                  ...(result.data || {}), // Use the returned data if available
                  updatedAt: new Date().toISOString() 
                }
              : student
          )
        );
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update student"
      };
    }
  };

  const deleteStudent = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete student');
      }

      // Only update local state after successful API call
      setStudents((prev) => prev.filter((student) => student.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting student:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete student"
      };
    }
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find((student) => student.id === id);
  };

  const fetchStudentsByClass = async (classId: string): Promise<Student[]> => {
    try {
      const response = await fetch(`/api/students?class_id=${classId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch students for the class');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students by class:', error);
      // Re-throw the error to be handled by the calling component
      throw error;
    }
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
    fetchStudentsByClass,
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
