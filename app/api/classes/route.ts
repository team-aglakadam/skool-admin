import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!schoolId) {
      return NextResponse.json(
        { error: "School ID is required" },
        { status: 400 }
      );
    }

    // Fetch classes with teacher information
    const { data: classes, error } = await supabase
      .from("classes")
      .select(
        `
        id,
        name,
        section,
        class_teacher_id,
        created_at,
        school_id
      `
      )
      .eq('school_id', schoolId)
      .order("name");

    if (error) {
      console.error("Error fetching classes:", error);
      return NextResponse.json(
        { error: "Failed to fetch classes" },
        { status: 500 }
      );
    }

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Check which type of delete we're performing
    const id = searchParams.get('id'); // For single class section deletion
    const className = searchParams.get('className'); // For deleting all sections of a class
    const schoolId = searchParams.get('schoolId');

    // Get current user for authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Case 1: Delete a specific class section by ID
    if (id) {
      // Get class details before deletion for the success message
      const { data: classData, error: fetchError } = await supabase
        .from('classes')
        .select('id, name, section, class_teacher_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching class details:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch class details' },
          { status: 500 }
        );
      }
      
      // Delete from class_teacher_map
      const { error: mapDeleteError } = await supabase
        .from('class_teacher_map')
        .delete()
        .eq('class_id', id);
      
      if (mapDeleteError) {
        console.error('Error deleting class-teacher mapping:', mapDeleteError);
        // Continue deletion even if this fails
      }

      // Delete the class
      const { error: deleteError } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting class:', deleteError);
        return NextResponse.json(
          { error: 'Failed to delete class' },
          { status: 500 }
        );
      }

      // Update teacher status if necessary
      if (classData.class_teacher_id) {
        // Check if teacher is still assigned to any other class
        const { data: remainingClasses, error: checkError } = await supabase
          .from('classes')
          .select('id')
          .eq('class_teacher_id', classData.class_teacher_id)
          .limit(1);

        // If no other classes are found, update the teacher's flag
        if (!checkError && (!remainingClasses || remainingClasses.length === 0)) {
          const { error: teacherUpdateError } = await supabase
            .from('teachers')
            .update({ is_class_teacher: false })
            .eq('id', classData.class_teacher_id);

          if (teacherUpdateError) {
            console.error(`Error updating teacher ${classData.class_teacher_id}:`, teacherUpdateError);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Class ${classData.name}-${classData.section} deleted successfully`
      });
    }
    
    // Case 2: Delete all sections of a class by class name and school ID
    else if (className && schoolId) {
      // 1. Get all class sections with this name and school ID
      const { data: classesToDelete, error: fetchError } = await supabase
        .from('classes')
        .select('id, class_teacher_id')
        .eq('name', className)
        .eq('school_id', schoolId);

      if (fetchError) {
        console.error("Error fetching classes to delete:", fetchError);
        return NextResponse.json(
          { error: "Failed to fetch classes" },
          { status: 500 }
        );
      }

      if (!classesToDelete || classesToDelete.length === 0) {
        return NextResponse.json(
          { error: "No classes found with the specified name" },
          { status: 404 }
        );
      }

      // Extract IDs and teacher IDs
      const classIds = classesToDelete.map(cls => cls.id);
      const teacherIds = classesToDelete
        .map(cls => cls.class_teacher_id)
        .filter(id => id !== null && id !== undefined);

      // 2. Delete entries from class_teacher_map
      if (classIds.length > 0) {
        const { error: mapDeleteError } = await supabase
          .from('class_teacher_map')
          .delete()
          .in('class_id', classIds);

        if (mapDeleteError) {
          console.error("Error deleting class-teacher mappings:", mapDeleteError);
          // Continue with deletion even if this fails
        }
      }

      // 3. Delete all class sections
      const { error: deleteError } = await supabase
        .from('classes')
        .delete()
        .in('id', classIds);

      if (deleteError) {
        console.error("Error deleting classes:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete classes" },
          { status: 500 }
        );
      }

      // 4. Update teachers' is_class_teacher flag if they don't have any other classes
      if (teacherIds.length > 0) {
        for (const teacherId of teacherIds) {
          const { data: remainingClasses, error: checkError } = await supabase
            .from('classes')
            .select('id')
            .eq('class_teacher_id', teacherId)
            .limit(1);

          if (!checkError && (!remainingClasses || remainingClasses.length === 0)) {
            const { error: teacherUpdateError } = await supabase
              .from('teachers')
              .update({ is_class_teacher: false })
              .eq('id', teacherId);

            if (teacherUpdateError) {
              console.error(`Error updating teacher ${teacherId}:`, teacherUpdateError);
            }
          }
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `Successfully deleted ${classesToDelete.length} class sections with name ${className}`
      });
    } else {
      return NextResponse.json(
        { error: "Either 'id' or both 'className' and 'schoolId' are required" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Unexpected error during class deletion:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during deletion" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate request body
    if (!body.school_id) {
      return NextResponse.json(
        { error: 'School ID is required', message: 'Failed to create class: School ID is missing' },
        { status: 400 }
      )
    }

    if (!body.name) {
      return NextResponse.json(
        { error: 'Class name is required', message: 'Failed to create class: Class name is missing' },
        { status: 400 }
      )
    }

    if (!body.sections || !Array.isArray(body.sections) || body.sections.length === 0) {
      return NextResponse.json(
        { error: 'At least one section is required', message: 'Failed to create class: No sections provided' },
        { status: 400 }
      )
    }

    // Define section type
    type Section = {
      name: string;
      teacherId?: string;
    };
    
    // Create entries for each section
    const classInserts = body.sections.map((section: Section) => ({
      name: body.name,
      section: section.name,
      class_teacher_id: section.teacherId || null,
      school_id: body.school_id
    }))

    // Insert all sections
    const { data, error: insertError } = await supabase
      .from('classes')
      .insert(classInserts)
      .select()

    if (insertError) throw insertError
    
    // For each section with a teacher assigned, create an entry in class_teacher_map
    const classTeacherMappings = [];
    for (let i = 0; i < data.length; i++) {
      const classRecord = data[i];
      const sectionData = body.sections[i];
      
      if (sectionData.teacherId) {
        classTeacherMappings.push({
          class_id: classRecord.id,
          teacher_id: sectionData.teacherId,
          assigned_at: new Date().toISOString()
        });
      }
    }
    
    // Insert class-teacher mappings if any
    if (classTeacherMappings.length > 0) {
      const { error: mappingError } = await supabase
        .from('class_teacher_map')
        .insert(classTeacherMappings)
      
      if (mappingError) {
        console.error('Error creating class-teacher mappings:', mappingError)
        // Don't throw error here as classes are already created
      }
    }

    // Update teachers' is_class_teacher flag for all assigned teachers
    const teacherIds = body.sections
      .map((section: {teacherId?: string}) => section.teacherId)
      .filter((id: string | undefined): id is string => !!id) // Filter out null/undefined values

    if (teacherIds.length > 0) {
      const { error: updateError } = await supabase
        .from('teachers')
        .update({ is_class_teacher: true })
        .in('id', teacherIds)

      if (updateError) {
        console.error('Error updating teachers:', updateError)
        // Don't throw error here as classes are already created
      }
    }

    return NextResponse.json({
      data,
      message: `Class ${body.name} with ${body.sections.length} section(s) created successfully`
    })
  } catch (err) {
    console.error('Error creating class:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create class: An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    console.log('PUT /api/classes body:', body);
    debugger;
    // Get the class to update
    const classId = body.class_id || body.id;
    if (!classId) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }
    
    // Get current class data
    const { data: classData, error: fetchError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()

    if (fetchError) {
      console.error('Error fetching class:', fetchError);
      return NextResponse.json(
        { error: "Class not found" },
        { status: 404 }
      );
    }
    
    // Track what was updated for the response
    const updates = [];
    const updatedSections = [];
    
    // We'll handle class name updates within each section's update
    // since each section is a separate record in the classes table
    
    // Process sections if provided
    if (body.sections && Array.isArray(body.sections) && body.sections.length > 0) {
      console.log('Processing sections:', body.sections);
      
      for (const section of body.sections) {
        // Map frontend property names to backend expected names
        const sectionId = section.section_id || section.id;
        const sectionName = section.section || section.name;
        const classTeacherId = section.class_teacher_id || section.teacherId;
        
        console.log('Processing section:', {
          sectionId,
          sectionName,
          classTeacherId,
          deleted: section.deleted
        });
        
        if (section.deleted && sectionId) {
          // Delete section
          const { error: deleteError } = await supabase
            .from('classes')
            .delete()
            .eq('id', sectionId);
            
          if (deleteError) {
            console.error('Error deleting section:', deleteError);
            throw deleteError;
          }
          
          updatedSections.push({ id: sectionId, action: 'deleted' });
        } else if (sectionId) {
          // Update existing section
          const updatePayload: any = {};
          
          // Only include fields that were provided
          if (body.name) {
            updatePayload.name = body.name;
          }
          
          if (sectionName) {
            updatePayload.section = sectionName;
          }
          
          if (classTeacherId !== undefined) {
            updatePayload.class_teacher_id = classTeacherId;
          }
          
          console.log(`Updating section ${sectionId} with:`, updatePayload);
          
          const { error: sectionUpdateError } = await supabase
            .from('classes')
            .update(updatePayload)
            .eq('id', sectionId);
            
          if (sectionUpdateError) {
            console.error('Error updating section:', sectionUpdateError);
            throw sectionUpdateError;
          }
          
          updatedSections.push({ 
            id: sectionId, 
            section: sectionName, 
            class_teacher_id: classTeacherId,
            action: 'updated' 
          });
        } else {
          // Create new section
          const { data: newSection, error: createError } = await supabase
            .from('classes')
            .insert({
              name: body.name || classData.name,
              section: sectionName,
              class_teacher_id: classTeacherId,
              school_id: body.school_id || classData.school_id
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating new section:', createError);
            throw createError;
          }
          
          updatedSections.push({
            ...newSection,
            action: 'created'
          });
        }
      }
      
      updates.push('sections');
    }
    
    // If we get here, all updates were successful
    return NextResponse.json({
      success: true,
      message: updates.length > 0 
        ? `Class updated successfully (${updates.join(', ')})` 
        : 'No changes made',
      updates: updates,
      sections: updatedSections
    });
  } catch (err) {
    console.error('Error updating class:', err);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to update class: An unexpected error occurred' },
      { status: 500 }
    );
  }
}
