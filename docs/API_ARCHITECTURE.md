# API Architecture & Data Flow

## Current Implementation (Dummy Data)

The application currently uses dummy data for development and testing purposes while keeping the authentication (login/signup) connected to Supabase.

### Structure

```
├── hooks/
│   ├── useAuth.ts      # Supabase auth + dummy profile data
│   └── useSchool.ts    # Dummy school data
├── app/api/           # REST API endpoints (placeholder)
│   ├── schools/
│   └── students/
└── lib/
    └── api.ts         # API client utilities
```

### Current Data Sources

1. **Authentication**: Supabase Auth (real)
   - User registration/login
   - Password reset
   - Session management

2. **Profile Data**: Dummy data in hooks
   - User profiles based on email patterns
   - Role assignment (admin/teacher/student)

3. **School Data**: Dummy data in hooks
   - School information
   - School memberships
   - User roles within schools

## Future Implementation (REST APIs)

### Migration Path

1. **Phase 1**: Current state - Dummy data with Supabase auth
2. **Phase 2**: Replace hooks with API calls to REST endpoints
3. **Phase 3**: Implement backend services
4. **Phase 4**: Connect REST APIs to your database

### API Endpoints Structure

```
GET    /api/schools              # List schools
POST   /api/schools              # Create school
GET    /api/schools/:id          # Get school details
PUT    /api/schools/:id          # Update school
DELETE /api/schools/:id          # Delete school

GET    /api/students             # List students (with filters)
POST   /api/students             # Create student
GET    /api/students/:id         # Get student details
PUT    /api/students/:id         # Update student
DELETE /api/students/:id         # Delete student

GET    /api/teachers             # List teachers (with filters)
POST   /api/teachers             # Create teacher
GET    /api/teachers/:id         # Get teacher details
PUT    /api/teachers/:id         # Update teacher
DELETE /api/teachers/:id         # Delete teacher

GET    /api/attendance           # Get attendance records
POST   /api/attendance           # Mark attendance
PUT    /api/attendance/:id       # Update attendance
```

### API Client Usage

When ready to switch to REST APIs, simply replace the dummy data in hooks:

```typescript
// Current (dummy data)
const fetchUserSchools = async () => {
  const userSchools = dummySchools.filter(...)
  setSchools(userSchools)
}

// Future (REST API)
const fetchUserSchools = async () => {
  const response = await schoolApi.getAll()
  if (response.success) {
    setSchools(response.data)
  }
}
```

### Environment Configuration

Add to `.env.local`:

```env
# For local development with Next.js API routes
NEXT_PUBLIC_API_URL=/api

# For external backend
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
```

### Authentication Flow

1. **Login/Signup**: Continues to use Supabase
2. **API Calls**: Include Supabase JWT token in headers
3. **Backend Validation**: Verify JWT token with Supabase

```typescript
// Example authenticated API call
const response = await fetch('/api/schools', {
  headers: {
    'Authorization': `Bearer ${supabaseToken}`,
    'Content-Type': 'application/json'
  }
})
```

## Benefits of This Approach

1. **Gradual Migration**: Switch from dummy data to APIs incrementally
2. **Consistent Interface**: Same hooks and components work with both approaches
3. **Flexible Backend**: Can connect to any backend technology
4. **Development Speed**: Continue development with dummy data while backend is being built
5. **Testing**: Easy to test with predictable dummy data

## Getting Started

1. **Current Development**: Use the existing dummy data implementation
2. **API Testing**: Use the placeholder `/api` routes with dummy responses
3. **Backend Integration**: Replace dummy responses with real database queries
4. **Hook Migration**: Switch hooks from dummy data to API calls using `lib/api.ts` 