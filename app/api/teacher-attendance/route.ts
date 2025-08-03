import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type TeacherAttendanceData = {
  teacher_id: string
  date: string
  status: 'present' | 'absent' | 'leave'
  remarks?: string
  marked_by_admin_id: string
  event_id?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { attendanceData, date, marked_by_admin_id } = body

    if (!attendanceData || !Array.isArray(attendanceData) || !date || !marked_by_admin_id) {
      return NextResponse.json(
        { error: 'Invalid request data', message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the attendance data for insertion
    const formattedAttendance: TeacherAttendanceData[] = attendanceData.map(item => ({
      teacher_id: item.teacherId,
      date,
      status: item.status === 'sick' || item.status === 'personal' ? 'leave' : item.status,
      remarks: item.notes,
      marked_by_admin_id
    }))

    // First, delete any existing attendance records for the given date
    const { error: deleteError } = await supabase
      .from('teacher_attendance')
      .delete()
      .eq('date', date)

    if (deleteError) {
      console.error('Error deleting existing attendance:', deleteError)
      throw new Error('Failed to update attendance records')
    }

    // Insert new attendance records
    const { error: insertError } = await supabase
      .from('teacher_attendance')
      .insert(formattedAttendance)

    if (insertError) {
      console.error('Error inserting attendance:', insertError)
      throw new Error('Failed to save attendance records')
    }

    return NextResponse.json({
      message: 'Attendance records saved successfully',
      data: { date, count: formattedAttendance.length }
    })
  } catch (err) {
    console.error('Error saving attendance:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to save attendance records' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!date && (!startDate || !endDate)) {
      return NextResponse.json(
        { error: 'Date parameters missing', message: 'Please provide either a date or a date range' },
        { status: 400 }
      )
    }
    //need to update logic again, apply filters with teacherIds
    let query = supabase
      .from('teacher_attendance')
      .select(`
        id,
        teacher_id,
        date,
        status,
        remarks,
        marked_by_admin_id,
        event_id,
        teachers (
          id,
          user_id,
          users (
            full_name,
            email
          )
        )
      `)

    if (date) {
      query = query.eq('date', date)
    } else {
      query = query
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      message: 'Attendance records fetched successfully'
    })
  } catch (err) {
    console.error('Error fetching attendance:', err)
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch attendance records' },
      { status: 500 }
    )
  }
}
