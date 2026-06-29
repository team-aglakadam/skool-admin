import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type TeacherAttendanceData = {
  teacher_id: string;
  date: string;
  status: "present" | "absent" | "leave";
  remarks?: string;
  marked_by_admin_id: string;
  school_id: string;
  event_id?: string;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = user.user_metadata?.school_id;
    if (!schoolId) {
      return NextResponse.json(
        { error: "No school associated with this user" },
        { status: 400 }
      );
    }

    // Role check — only admins can mark attendance
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Only school admins can mark teacher attendance" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { attendanceData, date } = body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return NextResponse.json(
        { error: "Invalid request data", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format the attendance data for insertion
    // Handle both single-date (daily) and multi-date (weekly) scenarios
    const formattedAttendance: TeacherAttendanceData[] = attendanceData.map(
      (item: { teacherId: string; date?: string; status: string; notes?: string }) => ({
        teacher_id: item.teacherId,
        date: item.date || date,
        status:
          item.status === "sick" || item.status === "personal"
            ? "leave"
            : item.status,
        remarks: item.notes,
        marked_by_admin_id: user.id, // Server-derived, not from client
        school_id: schoolId,
      })
    );

    // Validate that all records have dates
    const invalidRecords = formattedAttendance.filter((item) => !item.date);
    if (invalidRecords.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          message: "Missing date for some attendance records",
        },
        { status: 400 }
      );
    }

    // Handle each attendance record individually to preserve existing records
    for (const attendance of formattedAttendance) {
      // Check if record exists
      const { data: existingRecord } = await supabase
        .from("teacher_attendance")
        .select("id")
        .eq("teacher_id", attendance.teacher_id)
        .eq("date", attendance.date)
        .eq("school_id", schoolId)
        .single();

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("teacher_attendance")
          .update({
            status: attendance.status,
            remarks: attendance.remarks,
            marked_by_admin_id: user.id,
            last_updated_at: new Date().toISOString(),
          })
          .eq("teacher_id", attendance.teacher_id)
          .eq("date", attendance.date)
          .eq("school_id", schoolId);

        if (updateError) {
          console.error("Error updating attendance:", updateError);
          throw new Error("Failed to update attendance record");
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("teacher_attendance")
          .insert({
            ...attendance,
            last_updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Error inserting attendance:", insertError);
          throw new Error("Failed to insert attendance record");
        }
      }
    }

    return NextResponse.json({
      message: "Attendance records saved successfully",
      data: { date, count: formattedAttendance.length },
    });
  } catch (err) {
    console.error("Error saving attendance:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to save attendance records",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = user.user_metadata?.school_id;
    if (!schoolId) {
      return NextResponse.json(
        { error: "No school associated with this user" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!date && (!startDate || !endDate)) {
      return NextResponse.json(
        {
          error: "Date parameters missing",
          message: "Please provide either a date or a date range",
        },
        { status: 400 }
      );
    }

    let query = supabase
      .from("teacher_attendance")
      .select(
        `
        id,
        teacher_id,
        date,
        status,
        remarks,
        marked_by_admin_id,
        last_updated_at,
        event_id,
        school_id,
        teachers (
          id,
          user_id,
          users (
            full_name,
            email,
            updated_at
          )
        ),
        admin_user:users!marked_by_admin_id (
          full_name,
          email
        )
      `
      )
      .eq("school_id", schoolId);

    if (date) {
      query = query.eq("date", date);
    } else {
      query = query
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      data,
      message: "Attendance records fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch attendance records",
      },
      { status: 500 }
    );
  }
}
