// app/api/teachers/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { data, error } = await supabase
    .from("teachers")
    .insert([payload])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data[0], { status: 201 });
}
