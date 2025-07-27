'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Teacher } from './TeachersContext'
import { Subject } from './SubjectsContext'

export type SubjectAssignment = {
  id: string
  classId: string
  sectionId: string
  subjectId: string
  teacherId: string
  teacher?: Teacher
  subject?: Subject
  createdAt: string
  updatedAt: string
}

export type CreateSubjectAssignmentData = {
  classId: string
  sectionId: string
  subjectId: string
  teacherId: string
}

// Dummy subject assignment data
const dummySubjectAssignments: SubjectAssignment[] = [
  {
    id: '1',
    classId: '1',
    sectionId: '1a',
    subjectId: '1', // Mathematics
    teacherId: '1', // John Doe
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    classId: '1',
    sectionId: '1a',
    subjectId: '2', // English
    teacherId: '2', // Sarah Johnson
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    classId: '1',
    sectionId: '1a',
    subjectId: '3', // Science
    teacherId: '3', // Michael Chen
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '4',
    classId: '1',
    sectionId: '1b',
    subjectId: '1', // Mathematics
    teacherId: '1', // John Doe
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '5',
    classId: '1',
    sectionId: '1b',
    subjectId: '2', // English
    teacherId: '2', // Sarah Johnson
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '6',
    classId: '2',
    sectionId: '2a',
    subjectId: '1', // Mathematics
    teacherId: '3', // Michael Chen
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '7',
    classId: '2',
    sectionId: '2a',
    subjectId: '4', // History
    teacherId: '4', // Emily Rodriguez
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
]

interface SubjectAssignmentsContextType {
  subjectAssignments: SubjectAssignment[]
  loading: boolean
  addSubjectAssignment: (assignmentData: CreateSubjectAssignmentData) => Promise<{ success: boolean; error?: string }>
  updateSubjectAssignment: (id: string, updates: Partial<SubjectAssignment>) => Promise<{ success: boolean; error?: string }>
  deleteSubjectAssignment: (id: string) => Promise<{ success: boolean; error?: string }>
  getSubjectAssignmentById: (id: string) => SubjectAssignment | undefined
  getSubjectAssignmentsBySection: (classId: string, sectionId: string) => SubjectAssignment[]
  getSubjectAssignmentsByClass: (classId: string) => SubjectAssignment[]
  getSubjectAssignmentsByTeacher: (teacherId: string) => SubjectAssignment[]
  getSubjectAssignmentsBySubject: (subjectId: string) => SubjectAssignment[]
  searchSubjectAssignments: (searchTerm: string) => SubjectAssignment[]
  totalAssignments: number
}

const SubjectAssignmentsContext = createContext<SubjectAssignmentsContextType | undefined>(undefined)

export function SubjectAssignmentsProvider({ children }: { children: ReactNode }) {
  const [subjectAssignments, setSubjectAssignments] = useState<SubjectAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadSubjectAssignments = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setSubjectAssignments(dummySubjectAssignments)
      setLoading(false)
    }

    loadSubjectAssignments()
  }, [])

  const addSubjectAssignment = async (assignmentData: CreateSubjectAssignmentData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if assignment already exists
      const existingAssignment = subjectAssignments.find(
        assignment => 
          assignment.classId === assignmentData.classId &&
          assignment.sectionId === assignmentData.sectionId &&
          assignment.subjectId === assignmentData.subjectId
      )

      if (existingAssignment) {
        return { success: false, error: 'Subject is already assigned to this section' }
      }

      const newAssignment: SubjectAssignment = {
        ...assignmentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setSubjectAssignments(prev => [newAssignment, ...prev])
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to add subject assignment' }
    }
  }

  const updateSubjectAssignment = async (id: string, updates: Partial<SubjectAssignment>): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubjectAssignments(prev => prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, ...updates, updatedAt: new Date().toISOString() }
          : assignment
      ))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update subject assignment' }
    }
  }

  const deleteSubjectAssignment = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setSubjectAssignments(prev => prev.filter(assignment => assignment.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete subject assignment' }
    }
  }

  const getSubjectAssignmentById = (id: string): SubjectAssignment | undefined => {
    return subjectAssignments.find(assignment => assignment.id === id)
  }

  const getSubjectAssignmentsBySection = (classId: string, sectionId: string): SubjectAssignment[] => {
    return subjectAssignments.filter(assignment => 
      assignment.classId === classId && assignment.sectionId === sectionId
    )
  }

  const getSubjectAssignmentsByClass = (classId: string): SubjectAssignment[] => {
    return subjectAssignments.filter(assignment => assignment.classId === classId)
  }

  const getSubjectAssignmentsByTeacher = (teacherId: string): SubjectAssignment[] => {
    return subjectAssignments.filter(assignment => assignment.teacherId === teacherId)
  }

  const getSubjectAssignmentsBySubject = (subjectId: string): SubjectAssignment[] => {
    return subjectAssignments.filter(assignment => assignment.subjectId === subjectId)
  }

  const searchSubjectAssignments = (searchTerm: string): SubjectAssignment[] => {
    if (!searchTerm) return subjectAssignments
    
    const term = searchTerm.toLowerCase()
    return subjectAssignments.filter(assignment => 
      assignment.subject?.name.toLowerCase().includes(term) ||
      assignment.teacher?.name.toLowerCase().includes(term)
    )
  }

  const value: SubjectAssignmentsContextType = {
    subjectAssignments,
    loading,
    addSubjectAssignment,
    updateSubjectAssignment,
    deleteSubjectAssignment,
    getSubjectAssignmentById,
    getSubjectAssignmentsBySection,
    getSubjectAssignmentsByClass,
    getSubjectAssignmentsByTeacher,
    getSubjectAssignmentsBySubject,
    searchSubjectAssignments,
    totalAssignments: subjectAssignments.length
  }

  return (
    <SubjectAssignmentsContext.Provider value={value}>
      {children}
    </SubjectAssignmentsContext.Provider>
  )
}

export function useSubjectAssignments() {
  const context = useContext(SubjectAssignmentsContext)
  if (context === undefined) {
    throw new Error('useSubjectAssignments must be used within a SubjectAssignmentsProvider')
  }
  return context
} 