export async function getCharacterHistory(params: {
  characterName: string;
  period?: "7d" | "30d" | "90d" | "all";
  includeStats?: boolean;
}) {
  const searchParams = new URLSearchParams({
    name: params.characterName,
  });

  if (params.period) {
    searchParams.append("period", params.period);
  }

  if (params.includeStats) {
    searchParams.append("stats", "true");
  }

  const response = await fetch(`/api/lostark/history?${searchParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "조회 실패");
  }

  return response.json();
}
