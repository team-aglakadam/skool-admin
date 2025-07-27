'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Subject = {
  id: string
  name: string
  code: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type CreateSubjectData = Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>

// Dummy subject data
const dummySubjects: Subject[] = [
  { 
    id: '1', 
    name: 'Mathematics', 
    code: 'MATH', 
    description: 'Core mathematics including algebra, geometry, and calculus',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '2', 
    name: 'English', 
    code: 'ENG', 
    description: 'English language and literature',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '3', 
    name: 'Science', 
    code: 'SCI', 
    description: 'General science including physics, chemistry, and biology',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '4', 
    name: 'History', 
    code: 'HIST', 
    description: 'World history and social studies',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '5', 
    name: 'Physics', 
    code: 'PHY', 
    description: 'Advanced physics concepts',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '6', 
    name: 'Chemistry', 
    code: 'CHEM', 
    description: 'Chemical sciences and laboratory work',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '7', 
    name: 'Biology', 
    code: 'BIO', 
    description: 'Life sciences and biological concepts',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  },
  { 
    id: '8', 
    name: 'Computer Science', 
    code: 'CS', 
    description: 'Programming and computer fundamentals',
    createdAt: '2024-01-15T09:00:00Z', 
    updatedAt: '2024-01-15T09:00:00Z' 
  }
]

interface SubjectsContextType {
  subjects: Subject[]
  loading: boolean
  addSubject: (subjectData: CreateSubjectData) => Promise<{ success: boolean; error?: string }>
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<{ success: boolean; error?: string }>
  deleteSubject: (id: string) => Promise<{ success: boolean; error?: string }>
  getSubjectById: (id: string) => Subject | undefined
  searchSubjects: (searchTerm: string) => Subject[]
  totalSubjects: number
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined)

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadSubjects = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubjects(dummySubjects)
      setLoading(false)
    }

    loadSubjects()
  }, [])

  const addSubject = async (subjectData: CreateSubjectData): Promise<{ success: boolean; error?: string }> => {
    try {
      const newSubject: Subject = {
        ...subjectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setSubjects(prev => [newSubject, ...prev])
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to add subject' }
    }
  }

  const updateSubject = async (id: string, updates: Partial<Subject>): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubjects(prev => prev.map(subject => 
        subject.id === id 
          ? { ...subject, ...updates, updatedAt: new Date().toISOString() }
          : subject
      ))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update subject' }
    }
  }

  const deleteSubject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubjects(prev => prev.filter(subject => subject.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete subject' }
    }
  }

  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(subject => subject.id === id)
  }

  const searchSubjects = (searchTerm: string): Subject[] => {
    if (!searchTerm) return subjects
    
    const term = searchTerm.toLowerCase()
    return subjects.filter(subject => 
      subject.name.toLowerCase().includes(term) ||
      subject.code.toLowerCase().includes(term) ||
      (subject.description && subject.description.toLowerCase().includes(term))
    )
  }

  const value: SubjectsContextType = {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    searchSubjects,
    totalSubjects: subjects.length
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