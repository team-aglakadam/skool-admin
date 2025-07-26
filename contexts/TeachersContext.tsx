'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Teacher = {
  id: string
  name: string
  email: string
  mobile: string
  dateOfJoining?: string
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  dateOfBirth: string
  homeAddress?: string
  educationDetails: string
  status: 'active' | 'inactive'
  subjects: string[]
  employmentType: 'full-time' | 'part-time' | 'contract'
  createdAt: string
  updatedAt: string
}

export type CreateTeacherData = Omit<Teacher, 'id' | 'status' | 'createdAt' | 'updatedAt'>

// Dummy teacher data
const dummyTeachers: Teacher[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@school.com',
    mobile: '+1234567890',
    dateOfJoining: '2023-08-15',
    gender: 'male',
    bloodGroup: 'A+',
    dateOfBirth: '1985-03-20',
    homeAddress: '123 Teacher Lane, Education City, EC 12345',
    educationDetails: 'M.Sc Mathematics, B.Ed from State University',
    status: 'active',
    subjects: ['Mathematics', 'Statistics'],
    employmentType: 'full-time',
    createdAt: '2023-08-15T09:00:00Z',
    updatedAt: '2023-08-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    mobile: '+1234567891',
    dateOfJoining: '2023-09-01',
    gender: 'female',
    bloodGroup: 'B+',
    dateOfBirth: '1990-07-12',
    homeAddress: '456 Scholar Street, Learning District, LD 67890',
    educationDetails: 'M.A English Literature, B.Ed from Regional College',
    status: 'active',
    subjects: ['English', 'Literature'],
    employmentType: 'full-time',
    createdAt: '2023-09-01T08:30:00Z',
    updatedAt: '2023-09-01T08:30:00Z'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@school.com',
    mobile: '+1234567892',
    dateOfJoining: '2023-07-10',
    gender: 'male',
    bloodGroup: 'O-',
    dateOfBirth: '1988-11-05',
    educationDetails: 'M.Sc Physics, B.Ed from Technology Institute',
    status: 'active',
    subjects: ['Physics', 'Computer Science'],
    employmentType: 'full-time',
    createdAt: '2023-07-10T10:15:00Z',
    updatedAt: '2023-07-10T10:15:00Z'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@school.com',
    mobile: '+1234567893',
    gender: 'female',
    bloodGroup: 'AB+',
    dateOfBirth: '1992-02-28',
    homeAddress: '789 Education Ave, Knowledge Park, KP 13579',
    educationDetails: 'M.A History, B.Ed from Heritage University',
    status: 'active',
    subjects: ['History', 'Social Studies'],
    employmentType: 'part-time',
    createdAt: '2023-06-20T14:00:00Z',
    updatedAt: '2023-06-20T14:00:00Z'
  },
  {
    id: '5',
    name: 'David Thompson',
    email: 'david.thompson@school.com',
    mobile: '+1234567894',
    dateOfJoining: '2023-10-05',
    gender: 'male',
    bloodGroup: 'B-',
    dateOfBirth: '1986-09-15',
    educationDetails: 'M.Sc Chemistry, Ph.D in Organic Chemistry',
    status: 'inactive',
    subjects: ['Chemistry', 'Biology'],
    employmentType: 'contract',
    createdAt: '2023-10-05T11:45:00Z',
    updatedAt: '2023-10-05T11:45:00Z'
  }
]

interface TeachersContextType {
  teachers: Teacher[]
  loading: boolean
  addTeacher: (teacherData: CreateTeacherData) => Promise<{ success: boolean; error?: string }>
  updateTeacher: (id: string, updates: Partial<Teacher>) => Promise<{ success: boolean; error?: string }>
  deleteTeacher: (id: string) => Promise<{ success: boolean; error?: string }>
  getTeacherById: (id: string) => Teacher | undefined
  searchTeachers: (searchTerm: string) => Teacher[]
  activeTeachers: Teacher[]
  inactiveTeachers: Teacher[]
  totalTeachers: number
}

const TeachersContext = createContext<TeachersContextType | undefined>(undefined)

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadTeachers = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setTeachers(dummyTeachers)
      setLoading(false)
    }

    loadTeachers()
  }, [])

  const addTeacher = async (teacherData: CreateTeacherData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Adding teacher with data:', teacherData) // Debug log
      
      const newTeacher: Teacher = {
        ...teacherData,
        id: Date.now().toString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log('New teacher object:', newTeacher) // Debug log

      setTeachers(prev => {
        const updatedTeachers = [newTeacher, ...prev]
        console.log('Updated teachers array:', updatedTeachers) // Debug log
        return updatedTeachers
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error adding teacher:', error) // Debug log
      return { success: false, error: 'Failed to add teacher' }
    }
  }

  const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<{ success: boolean; error?: string }> => {
    try {
      setTeachers(prev => prev.map(teacher => 
        teacher.id === id 
          ? { ...teacher, ...updates, updatedAt: new Date().toISOString() }
          : teacher
      ))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to update teacher' }
    }
  }

  const deleteTeacher = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setTeachers(prev => prev.filter(teacher => teacher.id !== id))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete teacher' }
    }
  }

  const getTeacherById = (id: string): Teacher | undefined => {
    return teachers.find(teacher => teacher.id === id)
  }

  const searchTeachers = (searchTerm: string): Teacher[] => {
    if (!searchTerm) return teachers
    
    const term = searchTerm.toLowerCase()
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(term) ||
      teacher.email.toLowerCase().includes(term) ||
      teacher.subjects.some(subject => subject.toLowerCase().includes(term))
    )
  }

  const activeTeachers = teachers.filter(t => t.status === 'active')
  const inactiveTeachers = teachers.filter(t => t.status === 'inactive')

  const value: TeachersContextType = {
    teachers,
    loading,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    searchTeachers,
    activeTeachers,
    inactiveTeachers,
    totalTeachers: teachers.length
  }

  return (
    <TeachersContext.Provider value={value}>
      {children}
    </TeachersContext.Provider>
  )
}

export function useTeachers() {
  const context = useContext(TeachersContext)
  if (context === undefined) {
    throw new Error('useTeachers must be used within a TeachersProvider')
  }
  return context
} 