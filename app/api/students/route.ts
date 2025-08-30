import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface StudentRecord {
  id: string;
  user_id: string;
  roll_number: string | null;
  class_id: string;
  section_id: string;
  is_active: boolean;
  users?: {
    full_name?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("class_id");

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!classId) {
      return NextResponse.json({ error: "class_id is required" }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from("students")
      .select(`
        id,
        user_id,
        roll_number,
        class_id,
        is_active,
        users (
          full_name
        )
      `)
      .eq("school_id", user.user_metadata?.school_id)
      .eq("is_active", true);

    // Filter by class
    if (classId) {
      query = query.eq("class_id", classId);
    }

    // Order by roll number
    query = query.order("roll_number", { ascending: true, nullsFirst: false });

    const { data: students, error } = await query;

    if (error) {
      console.error("Error fetching students:", error);
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }

    // Transform the data to match expected format
    const transformedData = (students || []).map((student: any) => ({
      id: student.id,
      name: student.users?.full_name || 'Unknown Student',
      roll_number: student.roll_number,
      class_id: student.class_id,
      is_active: student.is_active
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Get current user/admin who is creating the student
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const schoolId = user.user_metadata?.school_id;
    if (!schoolId) {
      return NextResponse.json({ error: "School ID not found" }, { status: 400 });
    }
    
    // First, create a user record
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        school_id: schoolId,
        email: body.email,
        role: 'student',
        full_name: body.name,
        phone: body.mobile,
        address: body.address,
        date_of_birth: body.dateOfBirth,
        blood_group: body.bloodGroup
      })
      .select()
      .single();
      
    if (userError) {
      console.error('Error creating user record:', userError);
      return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
    }
    
    // Then create a student record linked to the user
    // Since class and section are in the same record, classId is used for both
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        user_id: userData.id,
        school_id: schoolId,
        class_id: body.classId, // Using classId for class reference
        roll_number: body.rollNumber || null, // Make roll number optional
        is_active: true,
        parent_name: body.parentName,
        parent_number: body.parentMobile
      })
      .select()
      .single();
    
    if (studentError) {
      console.error('Error creating student record:', studentError);
      return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        id: studentData.id,
        name: userData.full_name,
        email: userData.email,
        classId: studentData.class_id, // Using class_id for both class and section references
        sectionId: studentData.class_id, // Using the same ID since class and section are in the same record
        rollNumber: studentData.roll_number,
        parentName: studentData.parent_name,
        parentMobile: studentData.parent_number
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
} 
