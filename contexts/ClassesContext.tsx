'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Teacher } from './TeachersContext'

export type ClassSection = {
  id: string
  name: string // A, B, C, D, etc.
  classId: string
  classTeacherId: string | null
  classTeacher?: Teacher
  studentCount: number
  createdAt: string
  updatedAt: string
}

export type Class = {
  id: string
  name: string // Class 1, Grade 1, etc.
  sections: ClassSection[]
  totalStudents: number
  createdAt: string
  updatedAt: string
}

export type CreateClassData = {
  name: string
  sections: string[] // Array of section names like ['A', 'B', 'C']
}

// Dummy class data
const dummyClasses: Class[] = [
  {
    id: '1',
    name: 'Class 1',
    sections: [
      {
        id: '1a',
        name: 'A',
        classId: '1',
        classTeacherId: '1', // John Doe
        studentCount: 28,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z'
      },
      {
        id: '1b',
        name: 'B',
        classId: '1',
        classTeacherId: '2', // Sarah Johnson
        studentCount: 25,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z'
      }
    ],
    totalStudents: 53,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Class 2',
    sections: [
      {
        id: '2a',
        name: 'A',
        classId: '2',
        classTeacherId: '3', // Michael Chen
        studentCount: 26,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T09:00:00Z'
      }
    ],
    totalStudents: 26,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
]

interface ClassesContextType {
  classes: Class[]
  loading: boolean
  
  // Class operations
  createClass: (classData: CreateClassData) => Promise<{ success: boolean; error?: string }>
  updateClass: (id: string, updates: Partial<Class>) => Promise<{ success: boolean; error?: string }>
  deleteClass: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Section operations
  assignClassTeacher: (classId: string, sectionId: string, teacherId: string) => Promise<{ success: boolean; error?: string }>
  updateStudentCount: (classId: string, sectionId: string, count: number) => Promise<{ success: boolean; error?: string }>
  
  // Utility functions
  getClassById: (id: string) => Class | undefined
  getSectionById: (classId: string, sectionId: string) => ClassSection | undefined
  searchClasses: (searchTerm: string) => Class[]
  getTotalStudents: () => number
  getTotalSections: () => number
  totalClasses: number
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined)

export function ClassesProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadClasses = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setClasses(dummyClasses)
      setLoading(false)
    }

    loadClasses()
  }, [])

  const createClass = async (classData: CreateClassData): Promise<{ success: boolean; error?: string }> => {
    try {
      const newClass: Class = {
        id: Date.now().toString(),
        name: classData.name,
        sections: classData.sections.map((sectionName, index) => ({
          id: `${Date.now()}-${index}`,
          name: sectionName,
          classId: Date.now().toString(),
          classTeacherId: null,
          studentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        totalStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setClasses(prev => [newClass, ...prev])
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to create class' }
    }
  }

  const updateClass = async (id: string, updates: Partial<Class>): Promise<{ success: boolean; error?: string }> => {
    try {
      setClasses(prev => prev.map(cls => 
        cls.id === id 
          ? { ...cls, ...updates, updatedAt: new Date().toISOString() }
          : cls
      ))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update class' }
    }
  }

  const deleteClass = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setClasses(prev => prev.filter(cls => cls.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete class' }
    }
  }

  const assignClassTeacher = async (
    classId: string, 
    sectionId: string, 
    teacherId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setClasses(prev => prev.map(cls => {
        if (cls.id === classId) {
          return {
            ...cls,
            sections: cls.sections.map(section => 
              section.id === sectionId 
                ? { ...section, classTeacherId: teacherId, updatedAt: new Date().toISOString() }
                : section
            ),
            updatedAt: new Date().toISOString()
          }
        }
        return cls
      }))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to assign class teacher' }
    }
  }

  const updateStudentCount = async (
    classId: string, 
    sectionId: string, 
    count: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setClasses(prev => prev.map(cls => {
        if (cls.id === classId) {
          const updatedSections = cls.sections.map(section => 
            section.id === sectionId 
              ? { ...section, studentCount: count, updatedAt: new Date().toISOString() }
              : section
          )
          
          const newTotalStudents = updatedSections.reduce((total, section) => total + section.studentCount, 0)
          
          return {
            ...cls,
            sections: updatedSections,
            totalStudents: newTotalStudents,
            updatedAt: new Date().toISOString()
          }
        }
        return cls
      }))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update student count' }
    }
  }

  const getClassById = (id: string): Class | undefined => {
    return classes.find(cls => cls.id === id)
  }

  const getSectionById = (classId: string, sectionId: string): ClassSection | undefined => {
    const cls = classes.find(c => c.id === classId)
    return cls?.sections.find(s => s.id === sectionId)
  }

  const searchClasses = (searchTerm: string): Class[] => {
    if (!searchTerm) return classes
    
    const term = searchTerm.toLowerCase()
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(term) ||
      cls.sections.some(section => section.name.toLowerCase().includes(term))
    )
  }

  const getTotalStudents = (): number => {
    return classes.reduce((total, cls) => total + cls.totalStudents, 0)
  }

  const getTotalSections = (): number => {
    return classes.reduce((total, cls) => total + cls.sections.length, 0)
  }

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
    totalClasses: classes.length
  }

  return (
    <ClassesContext.Provider value={value}>
      {children}
    </ClassesContext.Provider>
  )
}

export function useClasses() {
  const context = useContext(ClassesContext)
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassesProvider')
  }
  return context
} 