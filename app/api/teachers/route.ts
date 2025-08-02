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
        gender,
        role
      )
    `)
    .eq("school_id", schoolId);
      console.log("data", data);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Transform the data to match the required format
  type UserRecord = {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    address: string;
    date_of_birth: string;
    blood_group: string;
    gender: string;
    role: string;
  };

  const formattedTeachers = data.map(teacher => {
    // Each teacher has a single user record
    const user = (teacher.users as unknown) as UserRecord;
    
    return {
      id: teacher.id,
      name: user?.full_name || '',
      email: user?.email || '',
      mobile: user?.phone || '',
      dateOfJoining: teacher.date_of_joining || null,
      // Default values for fields not directly in the schema
      gender: user?.gender || 'prefer-not-to-say',
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
    // 1. Create Supabase auth user first - this is mandatory
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
      return NextResponse.json({ 
        error: `Failed to create authentication account: ${authCreateError.message}` 
      }, { status: 500 });
    }

    // 2. Create user record with auth_id
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
        blood_group: payload.bloodGroup,
        gender: payload.gender,
        auth_id: authData.user.id // Store the auth user ID
      })
      .select()
      .single();
      
    if (userError) {
      console.error("Error creating user:", userError);
      // Attempt to rollback by deleting the auth user we just created
      await serviceClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    
    // 3. Create teacher record linked to the user
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
      // Attempt to rollback by deleting the auth user we just created
      await serviceClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: teacherError.message }, { status: 500 });
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

export async function PATCH(req: Request) {
  const payload = await req.json();
  const { id, ...updates } = payload;
  
  if (!id) {
    return NextResponse.json(
      { error: "Teacher id is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  
  // Check authentication
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First update the user record
    const { error: userError } = await supabase
      .from("users")
      .update({
        full_name: updates.name,
        phone: updates.mobile,
        address: updates.homeAddress,
        date_of_birth: updates.dateOfBirth,
        blood_group: updates.bloodGroup,
        gender: updates.gender
      })
      .eq("id", (await supabase
        .from("teachers")
        .select("user_id")
        .eq("id", id)
        .single()).data?.user_id);

    if (userError) {
      console.error("Error updating user:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Then update the teacher record
    const { data: teacherData, error: teacherError } = await supabase
      .from("teachers")
      .update({
        designation: updates.employmentType,
        date_of_joining: updates.dateOfJoining,
        education_details: updates.educationDetails
      })
      .eq("id", id)
      .select()
      .single();

    if (teacherError) {
      console.error("Error updating teacher:", teacherError);
      return NextResponse.json({ error: teacherError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Teacher updated successfully",
      teacher: teacherData
    }, { status: 200 });

  } catch (error) {
    console.error("Error in teacher update process:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // expect { id: string } in body
    if (!id) {
      return NextResponse.json(
        { error: "Teacher id is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the teacher record with the linked user's auth_id
    const { data: teacherWithUser, error: fetchError } = await supabase
      .from("teachers")
      .select(`
        user_id,
        users (
          id,
          auth_id
        )
      `)
      .eq("id", id)
      .single();

    if (fetchError || !teacherWithUser) {
      return NextResponse.json(
        { error: fetchError?.message || "Teacher not found" },
        { status: 404 }
      );
    }

    // Extract auth_id for later use
    const authId = teacherWithUser.users?.auth_id;

    // 2. Delete the teacher
    const { error: deleteTeacherError } = await supabase
      .from("teachers")
      .delete()
      .eq("id", id);

    if (deleteTeacherError) {
      return NextResponse.json(
        { error: deleteTeacherError.message },
        { status: 500 }
      );
    }

    // 3. Delete the linked user record
    const { error: deleteUserError } = await supabase
      .from("users")
      .delete()
      .eq("id", teacherWithUser.user_id);

    if (deleteUserError) {
      // You may want to consider rollback or warn here but continue
      console.error("Failed to delete linked user:", deleteUserError);
    }

    // 4. Delete auth user using service client (Supabase Admin)
    try {
      const serviceClient = await createServiceClient();
      
      // Delete the auth user using auth_id if available
      if (authId) {
        const { error: authDeleteError } =
          await serviceClient.auth.admin.deleteUser(authId);

        if (authDeleteError) {
          console.error("Failed to delete auth user:", authDeleteError);
        } else {
          return NextResponse.json(
            { message: "Teacher deleted successfully" },
            { status: 200 }
          );
        }
      } else {
        console.error("No auth_id found for user");
      }
    } catch (err) {
      console.error("Error deleting user from auth:", err);
      // Continue with the process, don't fail the request
    }

    
  } catch (err) {
    console.error("Error in DELETE /teachers:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
