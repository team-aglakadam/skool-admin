// API utility functions for future REST API integration
// Currently these are placeholder functions for when you're ready to switch from dummy data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('API request failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // School API methods
  async getSchools() {
    return this.request('/schools')
  }

  async createSchool(schoolData: {
    name: string
    address?: string
    phone?: string
    email?: string
  }) {
    return this.request('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    })
  }

  // Student API methods
  async getStudents(params?: { school_id?: string; class_id?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.school_id) searchParams.set('school_id', params.school_id)
    if (params?.class_id) searchParams.set('class_id', params.class_id)
    
    const endpoint = `/students${searchParams.toString() ? `?${searchParams}` : ''}`
    return this.request(endpoint)
  }

  async createStudent(studentData: {
    user_id: string
    school_id: string
    class_id?: string
    date_of_birth?: string
    gender?: 'male' | 'female' | 'other'
    address?: string
    emergency_contact?: string
    parent_id?: string
  }) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    })
  }

  // Teacher API methods (placeholder for future implementation)
  async getTeachers(params?: { school_id?: string; department?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.school_id) searchParams.set('school_id', params.school_id)
    if (params?.department) searchParams.set('department', params.department)
    
    const endpoint = `/teachers${searchParams.toString() ? `?${searchParams}` : ''}`
    return this.request(endpoint)
  }

  // Attendance API methods (placeholder for future implementation)
  async getAttendance(params: { 
    school_id: string
    class_id?: string
    date?: string 
  }) {
    const searchParams = new URLSearchParams()
    searchParams.set('school_id', params.school_id)
    if (params.class_id) searchParams.set('class_id', params.class_id)
    if (params.date) searchParams.set('date', params.date)
    
    const endpoint = `/attendance?${searchParams}`
    return this.request(endpoint)
  }

  async markAttendance(attendanceData: {
    school_id: string
    class_id: string
    student_id: string
    date: string
    status: 'present' | 'absent' | 'late' | 'excused'
  }) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    })
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()

// Individual utility functions for easier imports
export const schoolApi = {
  getAll: () => apiClient.getSchools(),
  create: (data: Parameters<typeof apiClient.createSchool>[0]) => 
    apiClient.createSchool(data),
}

export const studentApi = {
  getAll: (params?: Parameters<typeof apiClient.getStudents>[0]) => 
    apiClient.getStudents(params),
  create: (data: Parameters<typeof apiClient.createStudent>[0]) => 
    apiClient.createStudent(data),
}

export const teacherApi = {
  getAll: (params?: Parameters<typeof apiClient.getTeachers>[0]) => 
    apiClient.getTeachers(params),
}

export const attendanceApi = {
  get: (params: Parameters<typeof apiClient.getAttendance>[0]) => 
    apiClient.getAttendance(params),
  mark: (data: Parameters<typeof apiClient.markAttendance>[0]) => 
    apiClient.markAttendance(data),
} 