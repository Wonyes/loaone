import { getCharacterHistory } from "@/lib/lostark/characters";
import { useQuery } from "@tanstack/react-query";

export function useCharacterHistory(
  characterName: string,
  options?: {
    serverName?: string;
    period?: "7d" | "30d" | "90d" | "all";
    includeStats?: boolean;
  }
) {
  return useQuery({
    queryKey: [
      "character-history",
      characterName,
      options?.serverName,
      options?.period,
    ],
    queryFn: () =>
      getCharacterHistory({
        characterName,
        period: options?.period || "all",
        includeStats: options?.includeStats ?? true,
      }),
    enabled: !!characterName,
  });
}
