import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const school_id = searchParams.get('school_id')

    if (!school_id) {
      return NextResponse.json(
        { error: 'School ID is required', message: 'Failed to fetch classes: School ID is missing' },
        { status: 400 }
      )
    }

    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        id,
        name,
        section,
        class_teacher_id,
        school_id,
        teachers!class_teacher_id (
          id,
          user_id,
          users (
            full_name,
            email
          )
        )
      `)
      .eq('school_id', school_id)
      .order('name')

    if (error) throw error

    return NextResponse.json({ data: classes, message: 'Classes fetched successfully' })
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching classes:', err)
      return NextResponse.json(
        { error: err.message, message: 'Failed to fetch classes: An unexpected error occurred' },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch classes: An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.school_id) {
      return NextResponse.json(
        { error: 'School ID is required', message: 'Failed to create class: School ID is missing' },
        { status: 400 }
      )
    }

    // Start a transaction
    const { data, error: insertError } = await supabase
      .from('classes')
      .insert({
        name: body.name,
        section: body.section,
        class_teacher_id: body.class_teacher_id,
        school_id: body.school_id
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Update teacher's is_class_teacher field if a teacher is assigned
    if (body.class_teacher_id) {
      const { error: updateError } = await supabase
        .from('teachers')
        .update({ is_class_teacher: true })
        .eq('id', body.class_teacher_id)

      if (updateError) {
        console.error('Error updating teacher:', updateError)
        // Don't throw error here as class is already created
      }
    }

    return NextResponse.json(
      { data, message: `Class ${body.name}-${body.section} created successfully` }
    )
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

    // Get the current class data to check for teacher changes
    const { data: currentClass, error: fetchError } = await supabase
      .from('classes')
      .select('class_teacher_id, name, section')
      .eq('id', body.id)
      .single()

    if (fetchError) throw fetchError

    // Update class details
    const { data, error: updateError } = await supabase
      .from('classes')
      .update({
        name: body.name,
        section: body.section,
        class_teacher_id: body.class_teacher_id
      })
      .eq('id', body.id)
      .select()
      .single()

    if (updateError) throw updateError

    // Handle teacher updates if teacher has changed
    if (currentClass.class_teacher_id !== body.class_teacher_id) {
      if (currentClass.class_teacher_id) {
        // Set is_class_teacher to false for previous teacher
        const { error: prevTeacherError } = await supabase
          .from('teachers')
          .update({ is_class_teacher: false })
          .eq('id', currentClass.class_teacher_id)

        if (prevTeacherError) {
          console.error('Error updating previous teacher:', prevTeacherError)
        }
      }

      if (body.class_teacher_id) {
        // Set is_class_teacher to true for new teacher
        const { error: newTeacherError } = await supabase
          .from('teachers')
          .update({ is_class_teacher: true })
          .eq('id', body.class_teacher_id)

        if (newTeacherError) {
          console.error('Error updating new teacher:', newTeacherError)
        }
      }
    }

    return NextResponse.json(
      { data, message: `Class ${body.name}-${body.section} updated successfully` }
    )
  } catch (err) {
    console.error('Error updating class:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to update class: An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Class ID is required', message: 'Failed to delete class: Class ID is missing' },
        { status: 400 }
      )
    }

    // Get class details before deletion for the success message
    const { data: classData, error: fetchError } = await supabase
      .from('classes')
      .select('name, section')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Class ${classData.name}-${classData.section} deleted successfully`
    })
  } catch (err) {
    console.error('Error deleting class:', err)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to delete class: An unexpected error occurred'
    }, { status: 500 })
  }
}
