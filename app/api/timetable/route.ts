import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    classId,
    day,
    startTime,
    endTime,
    subjectId,
    customName,
  } = await request.json();

  if (!classId || !day || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!subjectId && !customName) {
    return NextResponse.json({ error: 'Either subjectId or customName is required' }, { status: 400 });
  }

  const dayMapping: { [key: string]: number } = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 7,
  };

  const dayOfWeek = dayMapping[day];

  if (!dayOfWeek) {
    return NextResponse.json({ error: 'Invalid day provided' }, { status: 400 });
  }

  try {
    // Step 1: Find or create the class_timetable entry
    const { data, error: findError } = await supabase
      .from('class_timetable')
      .select('id')
      .eq('class_id', classId)
      .eq('day_of_week', dayOfWeek)
      .single();
    let timetable = data;

    if (findError && findError.code !== 'PGRST116') { // PGRST116: no rows found
      console.error('Error finding timetable:', findError);
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!timetable) {
      const { data: newTimetable, error: createError } = await supabase
        .from('class_timetable')
        .insert({ class_id: classId, day_of_week: dayOfWeek })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating timetable:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      timetable = newTimetable;
    }

    // Step 2: Create the timetable_slots entry
    const slotToInsert = {
      class_timetable_id: timetable.id,
      start_time: startTime,
      end_time: endTime,
      subject_id: subjectId || null,
      slot_name: customName || null,
    };

    const { data: newSlot, error: slotError } = await supabase
      .from('timetable_slots')
      .insert(slotToInsert)
      .select('*')
      .single();

    if (slotError) {
      console.error('Error creating timetable slot:', slotError);
      return NextResponse.json({ error: slotError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: newSlot });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}


// Define a type for the data returned by the Supabase query
interface FetchedSlot {
  start_time: string;
  end_time: string;
  slot_name: string | null;
  subject_id: { name: string } | null;
  class_timetable: { day_of_week: number } | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('classId');

  if (!classId) {
    return NextResponse.json({ error: 'classId is required' }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('timetable_slots')
      .select(`
        start_time,
        end_time,
        slot_name,
        subject_id ( name ),
        class_timetable ( day_of_week )
      `)
      .eq('class_timetable.class_id', classId);

    if (error) {
      console.error('Error fetching timetable:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const dayMapping: { [key: number]: string } = {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      7: 'Sunday',
    };

    const formattedData = (data as FetchedSlot[]).map((slot) => {
      const dayName = slot.class_timetable ? dayMapping[slot.class_timetable.day_of_week] : 'Unknown';

      let subjectName = 'Break';
      if (slot.slot_name) {
        subjectName = slot.slot_name;
      } else if (slot.subject_id?.name) {
        subjectName = slot.subject_id.name;
      }

      return {
        day: dayName,
        startTime: slot.start_time ? slot.start_time.substring(0, 5) : '00:00',
        endTime: slot.end_time ? slot.end_time.substring(0, 5) : '00:00',
        subject: subjectName,
      };
    });
    return NextResponse.json(formattedData);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

