import { PopularSearch } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function usePopularSearches(limit = 10) {
  return useQuery<PopularSearch[]>({
    queryKey: ["popular", limit],
    queryFn: async () => {
      const res = await fetch(`/api/popular?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch popular");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
