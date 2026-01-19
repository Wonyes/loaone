export const LOSTARK_API_BASE = "https://developer-lostark.game.onstove.com";

/**
 * 로스트아크 API 특유의 HTML 태그와 엔티티를 제거합니다.
 */
export function cleanText(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/<[^>]+>/g, "") // 모든 HTML 태그 제거
    .replace(/&nbsp;/g, " ") // 공백 처리
    .replace(/&lt;/g, "<") // 부등호 처리
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"') // 따옴표 처리
    .replace(/\r\n/g, "\n") // 줄바꿈 처리
    .trim();
}

/**
 * 로스트아크 API 응답 데이터를 재귀적으로 돌며
 * 1. Tooltip 문자열을 JSON 객체로 파싱
 * 2. 모든 문자열의 HTML 태그를 제거합니다.
 */
export function deepParseLostarkData(obj: any): any {
  if (obj == null) return obj;

  // 배열 처리
  if (Array.isArray(obj)) {
    return obj.map(item => deepParseLostarkData(item));
  }

  // 객체가 아닌 경우 (문자열인 경우 여기서 HTML 제거 적용 가능)
  if (typeof obj !== "object") {
    if (typeof obj === "string" && obj.includes("<")) {
      return cleanText(obj);
    }
    return obj;
  }

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    // 1. Tooltip 파싱 로직
    if (
      key === "Tooltip" &&
      typeof value === "string" &&
      value.startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(value);
        result.tooltip = deepParseLostarkData(parsed);
        result.tooltipRaw = value;
      } catch (e) {
        result.tooltip = value;
      }
    }
    // 2. 일반 문자열 내 HTML 정리
    else if (typeof value === "string" && value.includes("<")) {
      // 키 이름을 소문자로 통일하고 싶다면 여기서 조절 (예: Name -> name)
      result[key] = cleanText(value);
    }
    // 3. 나머지 재귀 처리
    else {
      result[key] = deepParseLostarkData(value);
    }
  }

  return result;
}
