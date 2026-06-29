"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Teacher } from "@/app/types/teacher";
import { useUserStore } from "@/store/userStore";
import { useAuth } from "./AuthContext";

export type ClassSection = {
  id: string;      // ID for frontend use
  dbId: string;    // Actual database ID for API operations
  name: string;    // A, B, C, D, etc.
  classId: string;
  classTeacherId: string | null;
  classTeacher?: Teacher;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Class = {
  id: string;      // ID for frontend use
  dbId: string;    // Actual database ID for API operations
  name: string;    // Class 1, Grade 1, etc.
  sections: ClassSection[];
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateClassData = {
  name: string;
  sections: Array<{
    id?: string;      // Section ID - required for edits, optional for new classes
    name: string;     // Section name like 'A', 'B', 'C'
    teacherId?: string; // Optional teacher ID for the section
  }>;
};

interface ClassesContextType {
  classes: Class[];
  loading: boolean;

  // Class operations
  createClass: (
    classData: CreateClassData
  ) => Promise<{ success: boolean; error?: string }>;
  updateClass: (
    id: string,
    updates: CreateClassData
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  deleteClass: (id: string, className: string) => Promise<{ success: boolean; error?: string }>;

  // Section operations
  assignClassTeacher: (
    classId: string,
    sectionId: string,
    teacherId: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateStudentCount: (
    classId: string,
    sectionId: string,
    count: number
  ) => Promise<{ success: boolean; error?: string }>;

  // Utility functions
  getClassById: (id: string) => Class | undefined;
  getSectionById: (
    classId: string,
    sectionId: string
  ) => ClassSection | undefined;
  searchClasses: (searchTerm: string) => Class[];
  getTotalStudents: () => number;
  getTotalSections: () => number;
  totalClasses: number;
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export function ClassesProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const { schoolId } = useAuth();

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      
      try {
        if (!schoolId) {
          console.log('No schoolId available, using dummy data');
          return;
        }
        
        // Fetch classes from API
        const response = await fetch(`/api/classes?schoolId=${schoolId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch classes: ${response.statusText}`);
        }
        
        // Get raw class data from DB
        const classesData = await response.json();
        console.log('Classes data from DB:', classesData);
        
        // Process and group classes by name
        const groupedClasses: Record<string, any[]> = {};
        
        // Group by class name
        classesData.forEach((classItem: any) => {
          const className = classItem.name;
          if (!groupedClasses[className]) {
            groupedClasses[className] = [];
          }
          groupedClasses[className].push(classItem);
        });
        
        // Convert to frontend model
        const processedClasses: Class[] = Object.entries(groupedClasses)
          .map(([className, sections]) => {
            // Use the first section's ID as the master class ID for grouping
            // (all sections of the same class name will share this reference)
            const firstSection = sections[0];
            const classId = firstSection.id;
            
            return {
              id: classId,                // Use the actual database ID of the first section
              dbId: classId,              // Store the actual DB ID separately for API operations
              name: className,
              sections: sections.map(section => ({
                id: section.id,           // Actual database ID of the section
                dbId: section.id,          // Store the DB ID explicitly
                name: section.section,
                classId: classId,          // Reference to parent class
                classTeacherId: section.class_teacher_id,
                studentCount: 0,           // This would need to be calculated from a separate API call
                createdAt: section.created_at,
                updatedAt: section.created_at
              })),
              totalStudents: 0,           // This would be calculated from actual data
              createdAt: sections[0].created_at,
              updatedAt: sections[0].created_at
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort by class name
        setClasses(processedClasses);
      } catch (error) {
        console.error('Error loading classes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [schoolId]);

  const createClass = async (
    classData: CreateClassData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get schoolId from auth context
      const currentSchoolId = schoolId;

      if (!currentSchoolId) {
        throw new Error("School ID is required to create a class");
      }

      // Prepare data for API request
      const apiPayload = {
        name: classData.name,
        sections: classData.sections,
        school_id: currentSchoolId
      };

      // Call the API to create class sections in the database
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create class');
      }

      const { data } = await response.json();
      
      // Map the returned data to our frontend model
      // Use data from the API response, if available
      const responseData = data || [];
      
      // Generate a class ID if needed
      const classId = responseData[0]?.id || `class-${Date.now()}`;
      
      const newClass: Class = {
        id: classId,
        dbId: classId, // Store the actual database ID for API operations
        name: classData.name,
        sections: responseData.map((classSection: any) => ({
          id: classSection.id,
          dbId: classSection.id, // Store the actual database ID for API operations
          name: classSection.section,
          classId: classId,
          classTeacherId: classSection.class_teacher_id || null,
          studentCount: 0,
          createdAt: classSection.created_at || new Date().toISOString(),
          updatedAt: classSection.created_at || new Date().toISOString(),
        })),
        totalStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update local state with the new class
      setClasses((prev) => [newClass, ...prev]);
      return { success: true };
    } catch (error: any) {
      console.error("Error creating class:", error);
      return { success: false, error: error?.message || "Failed to create class" };
    }
  };

  const updateClass = async (
    id: string,
    updates: CreateClassData
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      if (!schoolId) {
        throw new Error('School ID is required to update a class');
      }
      
      // Find the class to update
      const classToUpdate = classes.find(cls => cls.id === id);
      if (!classToUpdate) {
        throw new Error('Class not found');
      }

      // Compare current class name with updated name
      const hasNameChanged = classToUpdate.name !== updates.name;
      
      // Create updates payload with only changed fields
      // No need for a class_id at top level - each section has its own ID
      const payload: any = {
        school_id: schoolId,
        class_id: id,
        sections: []
      };
      
      console.log('Sections to update:', classToUpdate.sections);
      
      // Compare and update sections
      for (const updatedSection of updates.sections) {
        // Find matching section in original class data
        const originalSection = classToUpdate.sections.find(
          section => section.id === updatedSection.id
        );
        
        if (originalSection) {
          // Section exists - check if name or teacher has changed
          const hasTeacherChanged = originalSection.classTeacherId !== updatedSection.teacherId;
          const hasNameChanged = classToUpdate.name !== updates.name;
          const hasSectionNameChanged = originalSection.name !== updatedSection.name;
          
          if (hasTeacherChanged || hasNameChanged || hasSectionNameChanged) {
            // Only include changed sections in the payload
            payload.sections.push({
              section_id: originalSection.dbId, // Use the correct database ID for this section
              name: updates.name, // Update class name for all sections if changed
              section: updatedSection.name,
              class_teacher_id: updatedSection.teacherId || null
            });
          }
        } else {
          // New section - add it
          payload.sections.push({
            name: updates.name, // Use the current class name
            section: updatedSection.name,
            class_teacher_id: updatedSection.teacherId || null
          });
        }
      }
      
      // Check for removed sections
      const updatedSectionNames = updates.sections.map(s => s.id);
      const removedSections = classToUpdate.sections.filter(
        section => !updatedSectionNames.includes(section.id)
      );
      
      // Add removed sections to payload
      for (const removedSection of removedSections) {
        payload.sections.push({
          section_id: removedSection.dbId, // Use the correct database ID for this section
          deleted: true
        });
      }
      
      console.log('Update payload:', payload);
      
      console.log('Preparing to update with payload:', payload);
      
      // Only make API call if there are changes
      if (hasNameChanged || payload.sections.length > 0) {
        // Call API to update class in database
        const response = await fetch('/api/classes', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        console.log('Update API response status:', response.status);
        
        // Clone the response for both error checking and data extraction
        const responseClone = response.clone();
        
        if (!response.ok) {
          const errorData = await responseClone.json();
          throw new Error(errorData.error || 'Failed to update class');
        }
        
        // Get the updated class data from response
        const updatedData = await response.json();
        console.log('API response data:', updatedData);
        
        // Update local state with new data
        setClasses((prevClasses) =>
          prevClasses.map((cls) => {
            if (cls.id === id) {
              // Update sections based on our changes
              const updatedSections = cls.sections.map((section) => {
                // Find if this section was updated
                const updatedSectionData = updates.sections.find(s => s.name === section.name);
                
                if (updatedSectionData) {
                  // Apply updates if teacher changed
                  if (section.classTeacherId !== updatedSectionData.teacherId) {
                    return {
                      ...section,
                      classTeacherId: updatedSectionData.teacherId || null,
                      updatedAt: new Date().toISOString()
                    };
                  }
                }
                return section;
              });
              
              // Add any new sections
              for (const newSection of updates.sections) {
                const sectionExists = updatedSections.some(s => s.name === newSection.name);
                if (!sectionExists) {
                  // This is a new section added during edit
                  const newSectionData = updatedData?.sections?.find(
                    (s: any) => s.name === newSection.name
                  );
                  
                  if (newSectionData) {
                    updatedSections.push({
                      id: newSectionData.id,
                      dbId: newSectionData.id, // Add the database ID for API operations
                      name: newSection.name,
                      classId: id,
                      classTeacherId: newSection.teacherId || null,
                      studentCount: 0,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    });
                  }
                }
              }
              
              // Remove deleted sections
              const remainingSections = updatedSections.filter(section =>
                updates.sections.some(s => s.name === section.name)
              );

              // Calculate new total students
              const newTotalStudents = remainingSections.reduce(
                (total, section) => total + section.studentCount,
                0
              );

              return {
                ...cls,
                name: updates.name,
                sections: remainingSections,
                totalStudents: newTotalStudents,
                updatedAt: new Date().toISOString(),
              };
            }
            return cls;
          })
        );
      }
      
      return { 
        success: true, 
        message: hasNameChanged || payload.sections.length > 0 
          ? 'Class updated successfully' 
          : 'No changes detected'
      };
    } catch (error: any) {
      console.error("Error updating class:", error);
      return { success: false, error: error?.message || "Failed to update class" };
    }
  };

  const deleteClass = async (
    id: string,
    className: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!schoolId) {
        throw new Error('School ID is required to delete a class');
      }
      
      // Call API to delete class from database
      const response = await fetch(
        `/api/classes?className=${encodeURIComponent(className)}&schoolId=${schoolId}`,
        {
          method: 'DELETE',
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete class');
      }
      
      // Update local state by removing the class with this ID
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting class:', error);
      return { success: false, error: error?.message || "Failed to delete class" };
    }
  };

  const assignClassTeacher = async (
    classId: string,
    sectionId: string,
    teacherId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setClasses((prev) =>
        prev.map((cls) => {
          if (cls.id === classId) {
            return {
              ...cls,
              sections: cls.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      classTeacherId: teacherId,
                      updatedAt: new Date().toISOString(),
                    }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return cls;
        })
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to assign class teacher" };
    }
  };

  const updateStudentCount = async (
    classId: string,
    sectionId: string,
    count: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setClasses((prev) =>
        prev.map((cls) => {
          if (cls.id === classId) {
            const updatedSections = cls.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    studentCount: count,
                    updatedAt: new Date().toISOString(),
                  }
                : section
            );

            const newTotalStudents = updatedSections.reduce(
              (total, section) => total + section.studentCount,
              0
            );

            return {
              ...cls,
              sections: updatedSections,
              totalStudents: newTotalStudents,
              updatedAt: new Date().toISOString(),
            };
          }
          return cls;
        })
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to update student count" };
    }
  };

  const getClassById = (id: string): Class | undefined => {
    // For testing, return mock data if classes array is empty
    if (classes.length === 0) {
      return undefined;
    }
    return classes.find((cls) => cls.id === id);
  };

  const getSectionById = (
    classId: string,
    sectionId: string
  ): ClassSection | undefined => {
    // For testing, use mock data if classes array is empty
    const cls =
      classes.length === 0
        ? undefined
        : classes.find((c) => c.id === classId);
    return cls?.sections.find((s) => s.id === sectionId);
  };

  const searchClasses = (searchTerm: string): Class[] => {
    if (!searchTerm) return classes;

    const term = searchTerm.toLowerCase();
    return classes.filter(
      (cls) =>
        cls.name.toLowerCase().includes(term) ||
        cls.sections.some((section) =>
          section.name.toLowerCase().includes(term)
        )
    );
  };

  const getTotalStudents = (): number => {
    return classes.reduce((total, cls) => total + cls.totalStudents, 0);
  };

  const getTotalSections = (): number => {
    return classes.reduce((total, cls) => total + cls.sections.length, 0);
  };

  const value: ClassesContextType = {
    classes,
    loading,
    createClass,
    updateClass,
    deleteClass,
    assignClassTeacher,
    updateStudentCount,
    getClassById,
    getSectionById,
    searchClasses,
    getTotalStudents,
    getTotalSections,
    totalClasses: classes.length,
  };

  return (
    <ClassesContext.Provider value={value}>{children}</ClassesContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassesContext);
  if (context === undefined) {
    throw new Error("useClasses must be used within a ClassesProvider");
  }
  return context;
}
