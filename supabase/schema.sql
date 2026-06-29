-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'staff', 'parent');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE session_type AS ENUM ('morning', 'afternoon', 'subject');
CREATE TYPE term AS ENUM ('first', 'second', 'third', 'annual');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    principal_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- School members (many-to-many relationship)
CREATE TABLE school_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, user_id)
);

-- Academic years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_level INTEGER NOT NULL,
    section TEXT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_teacher_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class subjects (many-to-many)
CREATE TABLE class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, subject_id)
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    admission_date DATE NOT NULL,
    class_id UUID REFERENCES classes(id),
    date_of_birth DATE,
    gender gender,
    address TEXT,
    emergency_contact TEXT,
    parent_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, student_id)
);

-- Teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL,
    department TEXT,
    qualification TEXT,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, employee_id)
);

-- Attendance sessions
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    session_type session_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student attendance
CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    marked_by UUID NOT NULL REFERENCES profiles(id),
    notes TEXT,
    UNIQUE(session_id, student_id)
);

-- Staff attendance
CREATE TABLE staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    status attendance_status NOT NULL,
    marked_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Exam types
CREATE TABLE exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    weightage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_type_id UUID NOT NULL REFERENCES exam_types(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    total_marks INTEGER NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student results
CREATE TABLE student_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2) NOT NULL,
    grade TEXT,
    remarks TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- Report cards
CREATE TABLE report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    term term NOT NULL,
    total_marks DECIMAL(7,2),
    percentage DECIMAL(5,2),
    overall_grade TEXT,
    rank INTEGER,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, academic_year_id, term)
);

-- Bus routes
CREATE TABLE bus_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    route_name TEXT NOT NULL,
    route_code TEXT,
    start_point TEXT NOT NULL,
    end_point TEXT NOT NULL,
    distance_km DECIMAL(6,2),
    estimated_duration_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bus stops
CREATE TABLE bus_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
    stop_name TEXT NOT NULL,
    stop_order INTEGER NOT NULL,
    pickup_time TIME,
    drop_time TIME,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buses
CREATE TABLE buses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    bus_number TEXT NOT NULL,
    license_plate TEXT,
    capacity INTEGER NOT NULL,
    driver_id UUID REFERENCES profiles(id),
    conductor_id UUID REFERENCES profiles(id),
    route_id UUID REFERENCES bus_routes(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, bus_number)
);

-- Student bus assignments
CREATE TABLE student_bus_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    pickup_stop_id UUID NOT NULL REFERENCES bus_stops(id),
    drop_stop_id UUID NOT NULL REFERENCES bus_stops(id),
    active BOOLEAN DEFAULT TRUE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, bus_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_school_members_school_id ON school_members(school_id);
CREATE INDEX idx_school_members_user_id ON school_members(user_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_attendance_sessions_date ON attendance_sessions(date);
CREATE INDEX idx_student_attendance_session_id ON student_attendance(session_id);
CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);
CREATE INDEX idx_exams_date ON exams(date);
CREATE INDEX idx_student_results_exam_id ON student_results(exam_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_bus_assignments ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these can be refined based on specific requirements)

-- Profiles: Users can read their own profile and school members can see each other
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- School members: Users can see other members of their schools
CREATE POLICY "School members can view school data" ON schools
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM school_members 
            WHERE school_id = schools.id 
            AND user_id = auth.uid() 
            AND active = true
        )
    );

-- Similar policies would be added for other tables based on school membership and roles 