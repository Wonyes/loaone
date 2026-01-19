import { useQuery } from "@tanstack/react-query";

export const useCunningList = () => {
  return useQuery({
    queryKey: ["raids", "list"],
    queryFn: async () => {
      const response = await fetch("/api/raids");
      if (!response.ok) throw new Error("서버 에러 발생");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCunningEnd = (id: string) => {
  return useQuery({
    queryKey: ["raids", "end", id],
    queryFn: async () => {
      // id가 넘어왔는지 확인 로그 (F12 콘솔에서 확인용)
      console.log("Fetching ID:", id);

      const response = await fetch(`/api/raids/${id}`);
      if (!response.ok) throw new Error("서버 에러 발생");
      return response.json();
    },
    // id가 있을 때만 API를 쏘도록 방어막 설치 (중요!)
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
