export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          principal_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          principal_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          principal_id?: string | null
          created_at?: string
        }
      }
      school_members: {
        Row: {
          id: string
          school_id: string
          user_id: string
          role: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
          active: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id: string
          role: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
          active?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string
          role?: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
          active?: boolean
          joined_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          school_id: string
          student_id: string
          admission_date: string
          class_id: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          address: string | null
          emergency_contact: string | null
          parent_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          school_id: string
          student_id: string
          admission_date: string
          class_id?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: string | null
          emergency_contact?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          school_id?: string
          student_id?: string
          admission_date?: string
          class_id?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: string | null
          emergency_contact?: string | null
          parent_id?: string | null
        }
      }
      teachers: {
        Row: {
          id: string
          user_id: string
          school_id: string
          employee_id: string
          department: string | null
          qualification: string | null
          hire_date: string
          salary: number | null
        }
        Insert: {
          id?: string
          user_id: string
          school_id: string
          employee_id: string
          department?: string | null
          qualification?: string | null
          hire_date: string
          salary?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          school_id?: string
          employee_id?: string
          department?: string | null
          qualification?: string | null
          hire_date?: string
          salary?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'teacher' | 'student' | 'staff' | 'parent'
      gender: 'male' | 'female' | 'other'
      attendance_status: 'present' | 'absent' | 'late' | 'excused'
    }
  }
}

// Helper types
export type UserRole = Database['public']['Enums']['user_role']
export type Gender = Database['public']['Enums']['gender']
export type AttendanceStatus = Database['public']['Enums']['attendance_status']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type School = Database['public']['Tables']['schools']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Teacher = Database['public']['Tables']['teachers']['Row']
export type SchoolMember = Database['public']['Tables']['school_members']['Row'] 