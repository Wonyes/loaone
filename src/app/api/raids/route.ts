import { createSupabaseServer } from "@/lib/supabase/server/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("raids")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("데이터 조회 에러:", error);
    return NextResponse.json(
      { error: "Failed to fetch raids" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
