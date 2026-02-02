import { useUser } from "@/hooks/useUesr";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface LikeStatus {
  liked: boolean;
  count: number;
}

// 좋아요 상태 조회
export function useShowcaseLikeStatus(showcaseId: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: ["showcaseLike", showcaseId, user?.id],
    queryFn: async (): Promise<LikeStatus> => {
      const res = await fetch(`/api/showcase/${showcaseId}/like`);
      if (!res.ok) throw new Error("Failed to fetch like status");
      return res.json();
    },
    enabled: !!showcaseId,
    staleTime: 1000 * 60,
  });
}

// 좋아요 토글
export function useToggleShowcaseLike(showcaseId: string) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (): Promise<LikeStatus> => {
      const res = await fetch(`/api/showcase/${showcaseId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to toggle like");
      }

      return res.json();
    },
    onMutate: async () => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({
        queryKey: ["showcaseLike", showcaseId, user?.id],
      });

      const previousStatus = queryClient.getQueryData<LikeStatus>([
        "showcaseLike",
        showcaseId,
        user?.id,
      ]);

      if (previousStatus) {
        queryClient.setQueryData<LikeStatus>(
          ["showcaseLike", showcaseId, user?.id],
          {
            liked: !previousStatus.liked,
            count: previousStatus.liked
              ? previousStatus.count - 1
              : previousStatus.count + 1,
          }
        );
      }

      return { previousStatus };
    },
    onError: (_err, _variables, context) => {
      // 롤백
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["showcaseLike", showcaseId, user?.id],
          context.previousStatus
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["showcaseLike", showcaseId, user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["showcaseGallery"] });
    },
  });
}
