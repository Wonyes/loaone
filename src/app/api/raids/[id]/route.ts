import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("raids")
      .select(
        `
        *,
        raid_gates (
          *,
          raid_sections (
            *
          )
        )
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase Query Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "데이터를 찾을 수 없음" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Server Route Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
