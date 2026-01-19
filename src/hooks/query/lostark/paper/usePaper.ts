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
      const response = await fetch(`/api/raids/${id}`);
      if (!response.ok) throw new Error("서버 에러 발생");
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
