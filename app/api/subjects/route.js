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
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
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
    .select('*')
    .eq('school_id', schoolId)
    .eq('class_id', classId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
