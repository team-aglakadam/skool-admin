'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';


export type Subject = {
  id: string;
  name: string;
  class_id: string;
  school_id: string;
  teacher_id?: string;
  is_break?: boolean;
  created_at: string;
}

export type CreateSubjectData = Pick<Subject, 'name' | 'class_id'> & Partial<Pick<Subject, 'teacher_id' | 'is_break' | 'school_id'>>;

interface SubjectsContextType {
  subjects: Subject[];
  loading: boolean;
  fetchSubjectsByClass: (classId: string) => Promise<void>;
  addSubject: (subjectData: CreateSubjectData) => Promise<{ success: boolean; data?: Subject; error?: string | null }>;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined)

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjectsByClass = useCallback(async (classId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subjects?classId=${classId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubject = useCallback(async (subjectData: CreateSubjectData) => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subject');
      }

      const result = await response.json();
      
      if (result.success) {
        setSubjects((prev) => [...prev, result.data]);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || 'Failed to create subject');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, error: errorMessage };
    }
  }, []);

  const value: SubjectsContextType = {
    subjects,
    loading,
    fetchSubjectsByClass,
    addSubject,
  }

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  )
}

export function useSubjects() {
  const context = useContext(SubjectsContext)
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectsProvider')
  }
  return context
} 
