'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { School, SchoolMember } from '@/types/database'
import { useAuth } from './useAuth'

// Dummy school data
const dummySchools: School[] = [
  {
    id: 'school-1',
    name: 'Springfield Elementary School',
    address: '742 Evergreen Terrace, Springfield',
    phone: '+1-555-0123',
    email: 'info@springfield-elementary.edu',
    principal_id: 'admin-user',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'school-2',
    name: 'Riverside High School',
    address: '123 River Road, Springfield',
    phone: '+1-555-0456',
    email: 'contact@riverside-high.edu',
    principal_id: 'admin-user',
    created_at: '2024-01-01T00:00:00Z'
  }
]

// Dummy school members data
const dummySchoolMembers: SchoolMember[] = [
  {
    id: 'member-1',
    school_id: 'school-1',
    user_id: 'admin-user',
    role: 'admin',
    active: true,
    joined_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'member-2',
    school_id: 'school-1',
    user_id: 'teacher-user',
    role: 'teacher',
    active: true,
    joined_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'member-3',
    school_id: 'school-1',
    user_id: 'student-user',
    role: 'student',
    active: true,
    joined_at: '2024-01-01T00:00:00Z'
  }
]

export function useSchool() {
  const [schools, setSchools] = useState<School[]>([])
  const [currentSchool, setCurrentSchool] = useState<School | null>(null)
  const [schoolMembers, setSchoolMembers] = useState<SchoolMember[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user && profile) {
      fetchUserSchools()
    } else {
      setLoading(false)
    }
  }, [user, profile])

  const fetchUserSchools = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Use dummy data instead of Supabase queries
      // Filter schools based on user membership
      const userMemberships = dummySchoolMembers.filter(
        member => member.user_id === user.id && member.active
      )
      
      const userSchools = dummySchools.filter(school =>
        userMemberships.some(member => member.school_id === school.id)
      )

      // If no specific memberships, show all schools for demo
      const schoolsToShow = userSchools.length > 0 ? userSchools : dummySchools

      setSchools(schoolsToShow)

      // Set the first school as current if none is selected
      if (schoolsToShow.length > 0 && !currentSchool) {
        setCurrentSchool(schoolsToShow[0])
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchoolMembers = async (schoolId: string) => {
    try {
      // Use dummy data instead of Supabase query
      const members = dummySchoolMembers.filter(
        member => member.school_id === schoolId && member.active
      )
      setSchoolMembers(members)
    } catch (error) {
      console.error('Error fetching school members:', error)
    }
  }

  const createSchool = async (schoolData: {
    name: string
    address?: string
    phone?: string
    email?: string
  }) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      // Simulate creating a school with dummy data
      const newSchool: School = {
        id: `school-${Date.now()}`,
        name: schoolData.name,
        address: schoolData.address || null,
        phone: schoolData.phone || null,
        email: schoolData.email || null,
        principal_id: user.id,
        created_at: new Date().toISOString()
      }

      // Add to dummy data (in real app, this would be a REST API call)
      setSchools(prev => [...prev, newSchool])

      // Add the creator as an admin member
      const newMember: SchoolMember = {
        id: `member-${Date.now()}`,
        school_id: newSchool.id,
        user_id: user.id,
        role: 'admin',
        active: true,
        joined_at: new Date().toISOString()
      }

      setSchoolMembers(prev => [...prev, newMember])

      return { data: newSchool, error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const joinSchool = async (schoolId: string, role: 'admin' | 'teacher' | 'student' | 'staff' | 'parent') => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      // Simulate joining a school with dummy data
      const newMember: SchoolMember = {
        id: `member-${Date.now()}`,
        school_id: schoolId,
        user_id: user.id,
        role: role,
        active: true,
        joined_at: new Date().toISOString()
      }

      setSchoolMembers(prev => [...prev, newMember])

      // Refresh the schools list
      await fetchUserSchools()

      return { data: newMember, error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const switchSchool = (school: School) => {
    setCurrentSchool(school)
    // Fetch members for the new current school
    fetchSchoolMembers(school.id)
  }

  const getUserRole = (schoolId: string) => {
    if (!user) return null
    
    const membership = schoolMembers.find(
      member => member.school_id === schoolId && member.user_id === user.id
    )
    return membership?.role || null
  }

  const isSchoolAdmin = (schoolId?: string) => {
    const targetSchoolId = schoolId || currentSchool?.id
    if (!targetSchoolId) return false
    return getUserRole(targetSchoolId) === 'admin'
  }

  const isSchoolMember = (schoolId?: string) => {
    const targetSchoolId = schoolId || currentSchool?.id
    if (!targetSchoolId) return false
    return getUserRole(targetSchoolId) !== null
  }

  // Fetch members when current school changes
  useEffect(() => {
    if (currentSchool) {
      fetchSchoolMembers(currentSchool.id)
    }
  }, [currentSchool])

  return {
    schools,
    currentSchool,
    schoolMembers,
    loading,
    createSchool,
    joinSchool,
    switchSchool,
    fetchUserSchools,
    fetchSchoolMembers,
    getUserRole,
    isSchoolAdmin,
    isSchoolMember,
    hasSchools: schools.length > 0,
  }
} 