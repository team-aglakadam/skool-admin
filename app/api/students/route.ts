import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("class_id");
    const sectionId = searchParams.get("section_id");

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
    const body = await request.json()
    
    // In the future, this would create a student record in your backend/database
    const newStudent = {
      id: `student-${Date.now()}`,
      student_id: `STU${String(Date.now()).slice(-3)}`,
      ...body,
      admission_date: new Date().toISOString().split('T')[0]
    }
    
    return NextResponse.json({ 
      success: true, 
      data: newStudent 
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    )
  }
} 