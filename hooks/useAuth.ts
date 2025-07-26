'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

// Dummy profile data
const dummyProfiles: Record<string, Profile> = {
  'admin-user': {
    id: 'admin-user',
    email: 'admin@school.com',
    full_name: 'John Administrator',
    avatar_url: null,
    phone: '+1234567890',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  'teacher-user': {
    id: 'teacher-user',
    email: 'teacher@school.com',
    full_name: 'Sarah Teacher',
    avatar_url: null,
    phone: '+1234567891',
    role: 'teacher',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  'student-user': {
    id: 'student-user',
    email: 'student@school.com',
    full_name: 'Mike Student',
    avatar_url: null,
    phone: '+1234567892',
    role: 'student',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const fetchProfile = async (userId: string) => {
    try {
      // Use dummy data instead of Supabase query
      // For demo purposes, we'll simulate different users based on email
      const email = user?.email || ''
      let dummyProfile: Profile

      if (email.includes('admin')) {
        dummyProfile = dummyProfiles['admin-user']
      } else if (email.includes('teacher')) {
        dummyProfile = dummyProfiles['teacher-user']
      } else if (email.includes('student')) {
        dummyProfile = dummyProfiles['student-user']
      } else {
        // Default to admin for any other users
        dummyProfile = { ...dummyProfiles['admin-user'], id: userId, email }
      }

      // Update the profile with actual user data
      setProfile({
        ...dummyProfile,
        id: userId,
        email: user?.email || dummyProfile.email
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    // Simulate profile update with dummy data
    if (profile) {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      return { data: updatedProfile, error: null }
    }

    return { data: null, error: new Error('No profile to update') }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher',
    isStudent: profile?.role === 'student',
    isStaff: profile?.role === 'staff',
    isParent: profile?.role === 'parent',
  }
} 