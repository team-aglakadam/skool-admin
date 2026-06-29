# SchoolHub - School Management System

A comprehensive school management system built with Next.js 15 and Supabase, designed to streamline educational institution operations.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React

### Core Features
1. **User Management** - Students, Teachers, Staff, Admins, Parents
2. **Attendance Tracking** - Real-time attendance for all user types
3. **Results Management** - Grades, reports, analytics
4. **Bus Route Management** - Transportation tracking and optimization
5. **Role-based Access Control** - Secure authentication system

## 🗄️ Database Schema

### Core Tables

#### 1. Users & Authentication
```sql
-- profiles (extends Supabase auth.users)
- id (uuid, pk, references auth.users)
- email (text)
- full_name (text)
- avatar_url (text)
- phone (text)
- role (enum: admin, teacher, student, staff, parent)
- created_at (timestamp)
- updated_at (timestamp)

-- schools
- id (uuid, pk)
- name (text)
- address (text)
- phone (text)
- email (text)
- principal_id (uuid, fk -> profiles.id)
- created_at (timestamp)

-- school_members (many-to-many)
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- user_id (uuid, fk -> profiles.id)
- role (enum: admin, teacher, student, staff, parent)
- active (boolean)
- joined_at (timestamp)
```

#### 2. Academic Structure
```sql
-- academic_years
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- name (text) -- "2024-2025"
- start_date (date)
- end_date (date)
- is_current (boolean)

-- classes
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- name (text) -- "Grade 10-A"
- grade_level (integer)
- section (text)
- academic_year_id (uuid, fk -> academic_years.id)
- class_teacher_id (uuid, fk -> profiles.id)

-- subjects
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- name (text)
- code (text)
- description (text)

-- class_subjects (many-to-many)
- id (uuid, pk)
- class_id (uuid, fk -> classes.id)
- subject_id (uuid, fk -> subjects.id)
- teacher_id (uuid, fk -> profiles.id)
```

#### 3. Student Management
```sql
-- students
- id (uuid, pk)
- user_id (uuid, fk -> profiles.id)
- school_id (uuid, fk -> schools.id)
- student_id (text, unique) -- Roll number
- admission_date (date)
- class_id (uuid, fk -> classes.id)
- date_of_birth (date)
- gender (enum: male, female, other)
- address (text)
- emergency_contact (text)
- parent_id (uuid, fk -> profiles.id)

-- teachers
- id (uuid, pk)
- user_id (uuid, fk -> profiles.id)
- school_id (uuid, fk -> schools.id)
- employee_id (text, unique)
- department (text)
- qualification (text)
- hire_date (date)
- salary (decimal)
```

#### 4. Attendance System
```sql
-- attendance_sessions
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- class_id (uuid, fk -> classes.id)
- subject_id (uuid, fk -> subjects.id)
- teacher_id (uuid, fk -> profiles.id)
- date (date)
- start_time (time)
- end_time (time)
- session_type (enum: morning, afternoon, subject)

-- student_attendance
- id (uuid, pk)
- session_id (uuid, fk -> attendance_sessions.id)
- student_id (uuid, fk -> students.id)
- status (enum: present, absent, late, excused)
- marked_at (timestamp)
- marked_by (uuid, fk -> profiles.id)
- notes (text)

-- staff_attendance
- id (uuid, pk)
- user_id (uuid, fk -> profiles.id)
- school_id (uuid, fk -> schools.id)
- date (date)
- check_in_time (timestamp)
- check_out_time (timestamp)
- status (enum: present, absent, half_day, late)
- marked_by (uuid, fk -> profiles.id)
```

#### 5. Results & Grading
```sql
-- exam_types
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- name (text) -- "Mid-term", "Final", "Quiz"
- weightage (decimal) -- percentage contribution

-- exams
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- exam_type_id (uuid, fk -> exam_types.id)
- class_id (uuid, fk -> classes.id)
- subject_id (uuid, fk -> subjects.id)
- name (text)
- date (date)
- total_marks (integer)
- duration_minutes (integer)

-- student_results
- id (uuid, pk)
- exam_id (uuid, fk -> exams.id)
- student_id (uuid, fk -> students.id)
- marks_obtained (decimal)
- grade (text)
- remarks (text)
- created_by (uuid, fk -> profiles.id)

-- report_cards
- id (uuid, pk)
- student_id (uuid, fk -> students.id)
- academic_year_id (uuid, fk -> academic_years.id)
- term (enum: first, second, third, annual)
- total_marks (decimal)
- percentage (decimal)
- overall_grade (text)
- rank (integer)
- generated_at (timestamp)
```

#### 6. Bus Management
```sql
-- bus_routes
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- route_name (text)
- route_code (text)
- start_point (text)
- end_point (text)
- distance_km (decimal)
- estimated_duration_minutes (integer)

-- bus_stops
- id (uuid, pk)
- route_id (uuid, fk -> bus_routes.id)
- stop_name (text)
- stop_order (integer)
- pickup_time (time)
- drop_time (time)
- coordinates (point) -- PostGIS

-- buses
- id (uuid, pk)
- school_id (uuid, fk -> schools.id)
- bus_number (text, unique)
- license_plate (text)
- capacity (integer)
- driver_id (uuid, fk -> profiles.id)
- conductor_id (uuid, fk -> profiles.id)
- route_id (uuid, fk -> bus_routes.id)

-- student_bus_assignments
- id (uuid, pk)
- student_id (uuid, fk -> students.id)
- bus_id (uuid, fk -> buses.id)
- pickup_stop_id (uuid, fk -> bus_stops.id)
- drop_stop_id (uuid, fk -> bus_stops.id)
- active (boolean)
```

## 🚀 Implementation Plan

### Phase 1: Foundation & Authentication
1. ✅ Next.js setup with shadcn/ui
2. 🔄 Supabase integration
3. 🔄 Authentication system
4. 🔄 User management
5. 🔄 Role-based access control

### Phase 2: Core Academic Features
1. School & class management
2. Student enrollment system
3. Teacher assignment
4. Basic dashboard

### Phase 3: Attendance System
1. Digital attendance marking
2. Real-time updates
3. Attendance analytics
4. Parent notifications

### Phase 4: Results Management
1. Exam creation & management
2. Grade entry system
3. Report card generation
4. Performance analytics

### Phase 5: Bus Management
1. Route planning
2. Student assignments
3. Driver tracking
4. Parent notifications

### Phase 6: Advanced Features
1. Mobile app
2. Push notifications
3. Analytics dashboard
4. API integrations

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development
```bash
npm run dev
```

## 📁 Project Structure
```
skool/
├── app/                    # Next.js app router
├── components/             # React components
├── lib/                    # Utilities & configurations
├── types/                  # TypeScript definitions
├── hooks/                  # Custom React hooks
├── stores/                 # State management
└── supabase/              # Database schema & migrations
```

## 🤝 Contributing
This is a personal project for educational purposes.

## 📄 License
MIT License
