// app/api/lostark/[name]/route.ts
import { NextRequest, NextResponse } from "next/server";

const LOSTARK_API_BASE = "https://developer-lostark.game.onstove.com";

// HTML 태그 및 특수문자 제거
function cleanText(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\r\n/g, "\n")
    .trim();
}

// 재귀적으로 모든 데이터 파싱
function deepParse(obj: any): any {
  // null이나 undefined
  if (obj == null) return obj;

  // 배열
  if (Array.isArray(obj)) {
    return obj.map(item => deepParse(item));
  }

  // 객체가 아닌 경우
  if (typeof obj !== "object") {
    return obj;
  }

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    // Tooltip 문자열을 JSON으로 파싱
    if (
      key === "Tooltip" &&
      typeof value === "string" &&
      value.startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(value);
        result.tooltip = deepParse(parsed);
        result.tooltipRaw = value;
      } catch (e) {
        result.tooltip = value;
      }
    }
    // HTML이 포함된 문자열 정리
    else if (typeof value === "string" && value.includes("<")) {
      result[key] = cleanText(value);
    }
    // 나머지는 재귀 처리
    else {
      result[key] = deepParse(value);
    }
  }

  return result;
}

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
    const cleanData = deepParse(rawData);

    return NextResponse.json(cleanData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}
