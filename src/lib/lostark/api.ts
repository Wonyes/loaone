import type { LostArkCharacterResponse } from "./types";

export async function fetchLostArkCharacter(
  characterName: string
): Promise<LostArkCharacterResponse> {
  const API_KEY = process.env.LOSTARK_API_KEY;

  if (!API_KEY) {
    throw new Error("로스트아크 API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(characterName)}/profiles`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("캐릭터를 찾을 수 없습니다.");
    }
    if (response.status === 429) {
      throw new Error(
        "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
      );
    }
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data = await response.json();

  if (!data) {
    throw new Error("캐릭터를 찾을 수 없습니다.");
  }

  return data;
}

/**
 * 아이템 레벨 파싱 ("1,720.00" → 1720.00)
 */
export function parseItemLevel(levelString: string): number {
  return parseFloat(levelString.replace(/,/g, ""));
}
