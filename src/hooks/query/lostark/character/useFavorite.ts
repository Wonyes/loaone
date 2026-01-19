import { useUser } from "@/hooks/useUesr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFavoriteStore } from "@/hooks/store/useFavoriteStore";

// 전체 즐겨찾기 목록 조회
export function useFavorites() {
  const { user } = useUser();
  const setFavorites = useFavoriteStore(state => state.setFavorites);

  return useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/favorites/list");

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      const favorites = data.favorites || [];

      setFavorites(favorites);

      return favorites;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}

// 개별 즐겨찾기 상태 조회
export function useFavoriteStatus(characterName: string) {
  const { user } = useUser();
  const isFavorite = useFavoriteStore(state => state.isFavorite);

  return useQuery({
    queryKey: ["favorite", characterName, user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/favorites?name=${characterName}`); // 그대로
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user && !!characterName,
    staleTime: 1000 * 60,
    select: data => ({
      ...data,
      cachedFavorite: isFavorite(characterName),
    }),
  });
}

// 즐겨찾기 토글
export function useToggleFavorite(characterName: string) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const addFavorite = useFavoriteStore(state => state.addFavorite);
  const removeFavorite = useFavoriteStore(state => state.removeFavorite);

  return useMutation({
    mutationFn: async (data: {
      characterName: string;
      serverName: string;
      itemLevel: string;
      className: string;
    }) => {
      const res = await fetch("/api/favorites", {
        // 그대로
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to toggle");
      return res.json();
    },
    onMutate: async data => {
      const isFavorite = useFavoriteStore.getState().isFavorite(characterName);

      if (isFavorite) {
        removeFavorite(characterName);
      } else {
        addFavorite({
          name: data.characterName,
          serverName: data.serverName,
          itemLevel: data.itemLevel,
          className: data.className,
        });
      }

      await queryClient.cancelQueries({
        queryKey: ["favorite", characterName, user?.id],
      });
      await queryClient.cancelQueries({
        queryKey: ["favorites", user?.id],
      });

      const previousStatus = queryClient.getQueryData([
        "favorite",
        characterName,
        user?.id,
      ]);
      const previousList = queryClient.getQueryData(["favorites", user?.id]);

      queryClient.setQueryData(
        ["favorite", characterName, user?.id],
        (old: any) => ({
          ...old,
          favorited: !old?.favorited,
        })
      );

      return { previousStatus, previousList, wasFavorite: isFavorite };
    },
    onError: (_err, _variables, context) => {
      if (context?.wasFavorite) {
        addFavorite({
          name: characterName,
          serverName: _variables.serverName,
          itemLevel: _variables.itemLevel,
          className: _variables.className,
        });
      } else {
        removeFavorite(characterName);
      }

      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["favorite", characterName, user?.id],
          context.previousStatus
        );
      }
      if (context?.previousList) {
        queryClient.setQueryData(["favorites", user?.id], context.previousList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite", characterName, user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["favorites", user?.id],
      });
    },
  });
}
