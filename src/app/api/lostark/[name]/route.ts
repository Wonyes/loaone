import { deepParseLostarkData, LOSTARK_API_BASE } from "@/lib/lostark-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  const endpoints: { [key: string]: string } = {
    characters: `/armories/characters/${name}`,
    siblings: `/characters/${name}/siblings`,
    profile: `/armories/characters/${name}/profiles`,
    equipment: `/armories/characters/${name}/equipment`,
    avatars: `/armories/characters/${name}/avatars`,
    skills: `/armories/characters/${name}/combat-skills`,
    engravings: `/armories/characters/${name}/engravings`,
    gems: `/armories/characters/${name}/gems`,
    cards: `/armories/characters/${name}/cards`,
    collectibles: `/armories/characters/${name}/collectibles`,
    arkgrid: `/armories/characters/${name}/arkgrid`,
    arkpassive: `/armories/characters/${name}/arkpassive`,
  };

  if (!type || !endpoints[type]) {
    return NextResponse.json(
      { error: "type parameter required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${LOSTARK_API_BASE}${endpoints[type]}`, {
      headers: {
        accept: "application/json",
        authorization: `bearer ${process.env.LOSTARK_API_KEY}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const rawData = await response.json();

    // 모든 데이터를 한번에 재귀적으로 파싱
    const cleanData = deepParseLostarkData(rawData);

    return NextResponse.json(cleanData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}
