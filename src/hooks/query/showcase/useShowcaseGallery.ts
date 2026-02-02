import { useInfiniteQuery } from "@tanstack/react-query";
import { GalleryResponse, ShowcaseSortOption } from "@/types/showcase";

// 갤러리 목록 (무한스크롤)
export function useShowcaseGallery(sort: ShowcaseSortOption = "latest") {
  return useInfiniteQuery({
    queryKey: ["showcaseGallery", sort],
    queryFn: async ({ pageParam = 1 }): Promise<GalleryResponse> => {
      const res = await fetch(`/api/showcase/gallery?page=${pageParam}&sort=${sort}`);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });
}
