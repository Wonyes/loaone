import { NextRequest, NextResponse } from "next/server";
import { getPopularSearches } from "@/lib/supabase/rankings";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "5");

  try {
    const data = await getPopularSearches(limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Popular API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular" },
      { status: 500 }
    );
  }
}
