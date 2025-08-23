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
    const classId = searchParams.get("class_id");

    if (!classId) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }

    // Since there's no separate sections table, we'll get unique section_ids from classes
    // For now, return empty array as sections are handled via section_id in classes table
    // This endpoint can be enhanced later if you create a separate sections table
    const { data, error } = await supabase
      .from("classes")
      .select("section_id")
      .eq("id", classId)
      .eq("school_id", user.user_metadata?.school_id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to fetch class section" }, { status: 500 });
    }

    // Return section info if it exists
    const sections = [];
    if (data?.section_id) {
      sections.push({
        id: data.section_id,
        name: `Section ${data.section_id}`,
        class_id: classId
      });
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
