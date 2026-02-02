import { useUser } from "@/hooks/useUesr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AvatarShowcase, ShowcaseUpsertRequest } from "@/types/showcase";

// 내 showcase 조회
export function useShowcase() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["showcase", user?.id],
    queryFn: async (): Promise<AvatarShowcase | null> => {
      const res = await fetch("/api/showcase");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.showcase;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}

// showcase 등록/수정
export function useUpsertShowcase() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (data: ShowcaseUpsertRequest): Promise<AvatarShowcase> => {
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save showcase");
      }

      const result = await res.json();
      return result.showcase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcase", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["showcaseGallery"] });
    },
  });
}

// showcase 삭제
export function useDeleteShowcase() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/showcase", {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete showcase");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcase", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["showcaseGallery"] });
    },
  });
}
