export interface ClassTeacher {
  id: string
  user_id: string
  users: {
    full_name: string
    email: string
  }
}

export interface Class {
  id: string
  name: string
  section: string
  class_teacher_id: string | null
  school_id: string
  created_at: string
  teachers?: ClassTeacher
}
