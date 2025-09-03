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


    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("students")
      .select(`
        id,
        roll_number,
        is_active,
        created_at,
        parent_name,
        parent_number,
        class_id,
        users (
          full_name,
          email,
          phone,
          date_of_birth,
          blood_group,
          gender
        )
      `)
      .eq("school_id", user.user_metadata?.school_id);

    if (classId) {
      query = query.eq("class_id", classId);
    }
    


    query = query.order("created_at", { ascending: false });

    const { data: students, error } = await query;

    if (error) {
      console.error("Error fetching students:", error);
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }

    const transformedData = (students || []).map((student: any) => ({
      id: student.id,
      name: student.users?.full_name || 'N/A',
      email: student.users?.email || 'N/A',
      mobile: student.users?.phone || 'N/A',
      dateOfBirth: student.users?.date_of_birth,
      gender: student.users?.gender || 'N/A',
      bloodGroup: student.users?.blood_group || 'N/A',
      parentName: student.parent_name || 'N/A',
      parentMobile: student.parent_number || 'N/A',
      rollNumber: student.roll_number || 'N/A',
      status: student.is_active ? 'active' : 'inactive',
      createdAt: student.created_at,
      classId: student.class_id,

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
