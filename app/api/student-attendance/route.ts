import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const classId = searchParams.get("class_id");
    const sectionId = searchParams.get("section_id");
    const date = searchParams.get("date");

    let query = supabase
      .from("student_attendance")
      .select(`
        *,
        students!inner(
          id, 
          user_id,
          roll_number, 
          class_id,
          users (
            full_name
          )
        ),
        users (
          full_name
        )
      `)
      .eq("school_id", user.user_metadata?.school_id);

    // Filter by class
    if (classId) {
      query = query.eq("students.class_id", classId);
    }

    // Note: Section filtering would need to be handled at class level since students don't have section_id directly

    // Filter by date range or specific date
    if (startDate && endDate) {
      query = query.gte("date", startDate).lte("date", endDate);
    } else if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { class_id, section_id, attendance } = body;

    if (!class_id || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const schoolId = user.user_metadata?.school_id;
    if (!schoolId) {
      return NextResponse.json({ error: "School ID not found" }, { status: 400 });
    }

    // Prepare attendance records with additional fields
    const attendanceRecords = attendance.map((record: any) => ({
      student_id: record.student_id,
      school_id: schoolId,
      date: record.date,
      status: record.status,
      remarks: record.remarks || null,
      marked_by_admin_id: user.id,
      last_updated_at: new Date().toISOString(),
    }));

    // Use upsert to handle both inserts and updates
    const { data, error } = await supabase
      .from("student_attendance")
      .upsert(attendanceRecords, {
        onConflict: "student_id,date",
        ignoreDuplicates: false,
      })
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Attendance saved successfully", 
      data: data || [] 
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");
    const date = searchParams.get("date");

    if (!studentId || !date) {
      return NextResponse.json({ error: "Student ID and date are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("student_attendance")
      .delete()
      .eq("student_id", studentId)
      .eq("date", date)
      .eq("school_id", user.user_metadata?.school_id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to delete attendance" }, { status: 500 });
    }

    return NextResponse.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
