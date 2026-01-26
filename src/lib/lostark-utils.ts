export const LOSTARK_API_BASE = "https://developer-lostark.game.onstove.com";

/**
 * 로스트아크 API 특유의 HTML 태그와 엔티티를 제거.
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
 * 1. Tooltip 문자열을 JSON 객체로 파싱
 * 2. 모든 문자열의 HTML 태그를 제거합니다.
 */
export function deepParseLostarkData(obj: any): any {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => deepParseLostarkData(item));
  }

  if (typeof obj !== "object") {
    if (typeof obj === "string" && obj.includes("<")) {
      return cleanText(obj);
    }
    return obj;
  }

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
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
    } else if (typeof value === "string" && value.includes("<")) {
      result[key] = cleanText(value);
    } else {
      result[key] = deepParseLostarkData(value);
    }
  }

  return result;
}
