export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say'
export type EmploymentType = 'full-time' | 'part-time' | 'contract'
export type TeacherStatus = 'active' | 'inactive'
export type BloodGroup = 'O+' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O-'

export interface Teacher {
  id: string
  name: string
  email: string
  mobile: string
  gender: Gender
  bloodGroup: BloodGroup
  dateOfBirth: string
  homeAddress: string
  educationDetails: string
  status: TeacherStatus
  subjects: string[]
  employmentType: EmploymentType
  dateOfJoining: string
  createdAt: string
  updatedAt: string
  school_id: string
  is_active: boolean
  users?: {
    id: string
    email: string
    full_name: string
    phone: string
    address: string
    date_of_birth: string
    blood_group: string
    gender: Gender
    role: string
  }
}

export interface TeacherFormData {
  name: string
  email: string
  mobile: string
  gender: Gender
  bloodGroup: BloodGroup
  dateOfBirth: string
  homeAddress: string
  educationDetails: string
  subjects: string[]
  employmentType: EmploymentType
  dateOfJoining: string
  school_id: string
  is_active: boolean
}
