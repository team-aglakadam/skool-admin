import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface StudentRecord {
  id: string;
  user_id: string;
  roll_number: string | null;
  class_id: string;
  is_active: boolean;
  created_at: string;
  parent_name?: string;
  parent_number?: string;
  users?: {
    full_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    blood_group?: string;
    gender?: string;
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

    // Log raw student data to see exactly what we're getting from the database
    console.log("Raw student data from database:", students);
    
    const transformedData = (students || []).map((student: any) => {
      // Log specific fields we're having trouble with
      console.log('Raw user data:', {
        gender: student.users?.gender,
        bloodGroup: student.users?.blood_group,
        address: student.users?.address
      });
      
      // Create the transformed student object
      const transformed = {
        id: student.id,
        name: student.users?.full_name || 'N/A',
        email: student.users?.email || 'N/A',
        mobile: student.users?.phone || 'N/A',
        dateOfBirth: student.users?.date_of_birth,
        gender: student.users?.gender || 'prefer-not-to-say',
        bloodGroup: student.users?.blood_group || 'O+',
        address: student.users?.address || '',
        parentName: student.parent_name || 'N/A',
        parentMobile: student.parent_number || 'N/A',
        rollNumber: student.roll_number || 'N/A',
        status: student.is_active ? 'active' : 'inactive',
        createdAt: student.created_at,
        classId: student.class_id,
      };
      
      // Log the transformed student data
      console.log("Transformed student data:", transformed);
      
      return transformed;
    });

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

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Verify authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, get the student record to find the associated user_id
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select('user_id, school_id')
      .eq('id', id)
      .eq('school_id', user.user_metadata?.school_id)
      .single();

    if (fetchError) {
      console.error('Error fetching student:', fetchError);
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (!student || !student.user_id) {
      return NextResponse.json({ error: 'Invalid student record' }, { status: 400 });
    }

    // Extract fields for each table
    const userFields = {
      full_name: updates.name,
      email: updates.email,
      phone: updates.mobile,
      date_of_birth: updates.dateOfBirth,
      blood_group: updates.bloodGroup,
      gender: updates.gender,
      address: updates.address
    };
    
    const studentFields = {
      roll_number: updates.rollNumber || null,
      class_id: updates.classId,
      is_active: updates.status === 'active',
      parent_name: updates.parentName,
      parent_number: updates.parentMobile
    };

    // Update user record
    const { error: userUpdateError } = await supabase
      .from('users')
      .update(userFields)
      .eq('id', student.user_id)
      .eq('school_id', student.school_id);

    if (userUpdateError) {
      console.error('Error updating user:', userUpdateError);
      return NextResponse.json({ error: 'Failed to update user information' }, { status: 500 });
    }

    // Update student record
    const { error: studentUpdateError } = await supabase
      .from('students')
      .update(studentFields)
      .eq('id', id)
      .eq('school_id', student.school_id);

    if (studentUpdateError) {
      console.error('Error updating student:', studentUpdateError);
      return NextResponse.json({ error: 'Failed to update student information' }, { status: 500 });
    }

    // Get updated student data to return
    const { data: updatedStudent, error: fetchUpdatedError } = await supabase
      .from('students')
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
      .eq('id', id)
      .single();

    if (fetchUpdatedError) {
      return NextResponse.json({ 
        success: true, 
        warning: "Student updated but couldn't fetch updated data"
      });
    }

    // Transform the updated data to match expected format
    const transformedData = {
      id: updatedStudent.id,
      name: updatedStudent.users && typeof updatedStudent.users === 'object' ? updatedStudent.users.full_name || 'N/A' : 'N/A',
      email: updatedStudent.users && typeof updatedStudent.users === 'object' ? updatedStudent.users.email || 'N/A' : 'N/A',
      mobile: updatedStudent.users && typeof updatedStudent.users === 'object' ? updatedStudent.users.phone || 'N/A' : 'N/A',
      dateOfBirth: updatedStudent.users && typeof updatedStudent.users === 'object' ? updatedStudent.users.date_of_birth : null,
      gender: updatedStudent.users && typeof updatedStudent.users === 'object' ? updatedStudent.users.gender || 'N/A' : 'N/A',
      bloodGroup: updatedStudent.users && typeof updatedStudent.users === 'object' ? updatedStudent.users.blood_group || 'N/A' : 'N/A',
      parentName: updatedStudent.parent_name || 'N/A',
      parentMobile: updatedStudent.parent_number || 'N/A',
      rollNumber: updatedStudent.roll_number || 'N/A',
      status: updatedStudent.is_active ? 'active' : 'inactive',
      createdAt: updatedStudent.created_at,
      classId: updatedStudent.class_id
    };

    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Unexpected error updating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("id");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Verify authorization
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, get the student record to find the associated user_id
    const { data: student, error: fetchError } = await supabase
      .from('students')
      .select('user_id')
      .eq('id', studentId)
      .eq('school_id', user.user_metadata?.school_id)
      .single();
    console.log("student data", student , "school id", user.user_metadata?.school_id);
    if (fetchError) {
      console.error('Error fetching student:', fetchError);
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (!student || !student.user_id) {
      return NextResponse.json({ error: 'Invalid student record' }, { status: 400 });
    }

    // Delete the student record first
    const { error: deleteStudentError } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId)
      .eq('school_id', user.user_metadata?.school_id);

    if (deleteStudentError) {
      console.error('Error deleting student:', deleteStudentError);
      return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
    }

    // Then delete the user record
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', student.user_id)
      .eq('school_id', user.user_metadata?.school_id);
console.log("delete user error", deleteUserError);
    if (deleteUserError) {
      console.error('Error deleting user:', deleteUserError);
      return NextResponse.json(
        { 
          warning: 'Student record deleted but user record could not be deleted',
          error: deleteUserError.message 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
