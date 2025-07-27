import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  const { data: userInfo, error: userLookupError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (userLookupError || !userInfo) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: userInfo.email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ user: data.user }, { status: 200 });
}
