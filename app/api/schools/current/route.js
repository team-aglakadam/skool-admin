import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
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

    const { data: school, error } = await supabase
      .from("schools")
      .select(
        "id, name, address, phone, email, logo_url, principal_name, enabled_features, created_at, updated_at"
      )
      .eq("id", schoolId)
      .single();

    if (error || !school) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: school });
  } catch (err) {
    console.error("Error fetching school:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
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

    // Role check — only admins can update school settings
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "Only school admins can update school settings" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = [
      "name",
      "address",
      "phone",
      "email",
      "logo_url",
      "principal_name",
      "enabled_features",
    ];

    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updates.updated_at = new Date().toISOString();

    const { data: school, error } = await supabase
      .from("schools")
      .update(updates)
      .eq("id", schoolId)
      .select(
        "id, name, address, phone, email, logo_url, principal_name, enabled_features, created_at, updated_at"
      )
      .single();

    if (error) {
      console.error("Error updating school:", error);
      return NextResponse.json(
        { error: "Failed to update school" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: school });
  } catch (err) {
    console.error("Error updating school:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
