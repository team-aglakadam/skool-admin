// app/api/teachers/route.ts
import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");

  console.log("schoolId in last", schoolId);

  const supabase = await createClient();
  
  // Check if the user is authenticated
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Use the authenticated client to fetch data with a join between teachers and users
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      id,
      user_id,
      school_id,
      created_at,
      is_class_teacher,
      class_assigned,
      designation,
      salary,
      date_of_joining,
      is_active,
      education_details,
      users (
        id,
        email,
        full_name,
        phone,
        address,
        date_of_birth,
        blood_group,
        role
      )
    `)
    .eq("school_id", schoolId);
      console.log("data", data);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Transform the data to match the required format
  const formattedTeachers = data.map(teacher => {
    const user = teacher.users;
    
    return {
      id: teacher.id,
      name: user?.full_name || '',
      email: user?.email || '',
      mobile: user?.phone || '',
      dateOfJoining: teacher.date_of_joining || null,
      // Default values for fields not directly in the schema
      gender: 'prefer-not-to-say', // This field isn't in your schema
      bloodGroup: user?.blood_group || 'O+',
      dateOfBirth: user?.date_of_birth || '',
      homeAddress: user?.address || null,
      educationDetails: teacher.education_details || '',
      status: teacher.is_active ? 'active' : 'inactive',
      subjects: [], // You'll need to implement a separate query for subjects if needed
      employmentType: teacher.designation === 'full-time' ? 'full-time' : 
                      teacher.designation === 'part-time' ? 'part-time' : 'contract',
      createdAt: teacher.created_at || '',
      updatedAt: teacher.created_at || '', // No updated_at in schema, using created_at
    };
  });

  return NextResponse.json({ teachers: formattedTeachers }, { status: 200 });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const supabase = await createClient();
  
  // Check authentication
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get school_id from authenticated user
  const schoolId = session.user.user_metadata?.school_id;
  if (!schoolId) {
    return NextResponse.json({ error: "School ID not found in user metadata" }, { status: 400 });
  }

  try {
    // 1. Create user record first
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        school_id: schoolId,
        email: payload.email,
        role: "teacher",
        full_name: payload.name,
        phone: payload.mobile,
        address: payload.homeAddress,
        date_of_birth: payload.dateOfBirth,
        blood_group: payload.bloodGroup
      })
      .select()
      .single();
      
    if (userError) {
      console.error("Error creating user:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    
    // 2. Create teacher record linked to the user
    const { data: teacherData, error: teacherError } = await supabase
      .from("teachers")
      .insert({
        user_id: userData.id,
        school_id: schoolId,
        is_class_teacher: false,
        designation: payload.employmentType,
        date_of_joining: payload.dateOfJoining,
        education_details: payload.educationDetails,
        is_active: true
      })
      .select()
      .single();
      
    if (teacherError) {
      console.error("Error creating teacher:", teacherError);
      // Attempt to rollback by deleting the user we just created
      await supabase.from("users").delete().eq("id", userData.id);
      return NextResponse.json({ error: teacherError.message }, { status: 500 });
    }
    
    // 3. Create Supabase auth user with fixed password - this is mandatory
    // Using service role client for admin operations
    const serviceClient = await createServiceClient();
    const { data: authData, error: authCreateError } = await serviceClient.auth.admin.createUser({
      email: payload.email,
      password: "admin123", // Fixed password for development
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        full_name: payload.name,
        school_id: schoolId,
        role: ["teacher"]
      },
      app_metadata: {
        full_name: payload.name,
        roles: ["teacher"],
        school_id: schoolId,
      }
    });
    
    if (authCreateError) {
      console.error("Error creating auth user:", authCreateError);
      
      // Rollback: Delete the teacher record
      await supabase.from("teachers").delete().eq("id", teacherData.id);
      
      // Rollback: Delete the user record
      await supabase.from("users").delete().eq("id", userData.id);
      
      // Return error to client
      return NextResponse.json({ 
        error: `Failed to create authentication account: ${authCreateError.message}` 
      }, { status: 500 });
    }
    
    // 4. Return the combined data
    return NextResponse.json({
      user: userData,
      teacher: teacherData,
      authCreated: !authCreateError
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error in teacher creation process:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
