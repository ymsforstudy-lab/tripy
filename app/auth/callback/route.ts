import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 닉네임 설정 여부 확인 후 분기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("display_name")
      .eq("id", user.id)
      .single();

    if (!profile?.display_name) {
      return NextResponse.redirect(`${origin}/nickname`);
    }
    return NextResponse.redirect(`${origin}/home`);
  }

  return NextResponse.redirect(`${origin}/`);
}
