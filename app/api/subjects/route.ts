import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const subjectData = await request.json();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const schoolId = user.user_metadata?.school_id;
  if (!schoolId) {
    return NextResponse.json({ error: 'School ID not found for user' }, { status: 400 });
  }

  const dataToInsert = {
    ...subjectData,
    school_id: schoolId,
  };

  const { data, error } = await supabase
    .from('class_subjects')
    .insert(dataToInsert)
    .select('*, teacher:teachers(user:users(full_name))')
    .single();

  if (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const responseData = {
    ...data,
    teacher_name: data.teacher?.user?.full_name
  };

  return NextResponse.json({ success: true, data: responseData });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const schoolId = user.user_metadata?.school_id;
  if (!schoolId) {
    return NextResponse.json({ error: 'School ID not found for user' }, { status: 400 });
  }

  if (!classId) {
    return NextResponse.json({ error: 'classId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('class_subjects')
    .select('*, teacher:teachers(user:users(full_name))')
    .eq('school_id', schoolId)
    .eq('class_id', classId);

  if (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const subjects = data.map(s => ({
    ...s,
    teacher_name: s.teacher?.user?.full_name
  }));

  return NextResponse.json(subjects);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { id, ...updateData } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('class_subjects')
    .update(updateData)
    .eq('id', id)
    .select('*, teacher:teachers(user:users(full_name))')
    .single();

  if (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const responseData = {
    ...data,
    teacher_name: data.teacher?.user?.full_name
  };

  return NextResponse.json({ success: true, data: responseData });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('class_subjects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Subject deleted successfully' });
}
