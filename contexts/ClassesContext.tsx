'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getClasses,
  addClass as addClassApi,
  updateClass as updateClassApi,
  deleteClass as deleteClassApi,
} from '@/app/apiHelpers'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export type Class = {
  id: string
  name: string
  section: string
  class_teacher_id: string | null
  school_id: string
  teachers?: {
    id: string
    user_id: string
    users: {
      full_name: string
      email: string
    }
  }
  created_at: string
}

export type CreateClassData = {
  name: string
  section: string
  class_teacher_id: string | null
  school_id: string
}

export type UpdateClassData = Partial<Omit<CreateClassData, 'school_id'>>

interface ClassesContextType {
  classes: Class[]
  loading: boolean
  
  // Class operations
  createClass: (classData: CreateClassData) => Promise<{ success: boolean; error?: string; data?: { message?: string } }>
  updateClass: (id: string, updates: UpdateClassData) => Promise<{ success: boolean; error?: string; message?: string }>
  deleteClass: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Utility functions
  getClassById: (id: string) => Class | undefined
  searchClasses: (searchTerm: string) => Class[]
  getTotalStudents: () => number
  getTotalSections: () => number
  totalClasses: number
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined)

export function ClassesProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([])
  const { schoolId } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: ({ queryKey }) => {
      const [, schoolId] = queryKey
      return getClasses(schoolId)
    },
    enabled: !!schoolId,
  })

  useEffect(() => {
    if (data?.data) {
      setClasses(data.data)
    }
  }, [data])

  const queryClient = useQueryClient()

  const addClassMutation = useMutation({
    mutationFn: (classData: CreateClassData) => addClassApi(classData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateClassMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateClassData }) =>
      updateClassApi(id, updates),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteClassMutation = useMutation({
    mutationFn: deleteClassApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] })
      toast.success(response.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const createClass = async (classData: CreateClassData) => {
    try {
      const response = await addClassMutation.mutateAsync(classData)
      return { success: true, data: response }
    } catch (error) {
      console.error('Error creating class:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create class',
        data: {},
      }
    }
  }

  const updateClass = async (id: string, updates: UpdateClassData) => {
    try {
      const response = await updateClassMutation.mutateAsync({ id, updates })
      return { success: true, message: response.message }
    } catch (error) {
      console.error('Error updating class:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update class',
      }
    }
  }

  const deleteClass = async (id: string) => {
    try {
      const response = await deleteClassMutation.mutateAsync(id)
      return { success: true, message: response.message }
    } catch (error) {
      console.error('Error deleting class:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete class',
      }
    }
  }

  const getClassById = (id: string) => {
    return classes.find(c => c.id === id)
  }

  const searchClasses = (searchTerm: string) => {
    const term = searchTerm.toLowerCase()
    return classes.filter(
      c =>
        c.name.toLowerCase().includes(term) ||
        c.section.toLowerCase().includes(term)
    )
  }

  const getTotalStudents = () => {
    // This will be implemented when student data is available
    return 0
  }

  const getTotalSections = () => {
    return new Set(classes.map(c => c.section)).size
  }

  const value: ClassesContextType = {
    classes,
    loading: isLoading,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
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
