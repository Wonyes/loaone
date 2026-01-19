import { useQuery } from "@tanstack/react-query";

export const useCunningList = <T = any>(initialData?: T[]) => {
  return useQuery<T[]>({
    queryKey: ["raids", "list"],
    queryFn: async () => {
      const response = await fetch("/api/raids");
      if (!response.ok) throw new Error("서버 에러 발생");
      return response.json();
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCunningEnd = <T = any>(id: string, initialData?: T) => {
  return useQuery<T>({
    queryKey: ["raids", "end", id],
    queryFn: async () => {
      const response = await fetch(`/api/raids/${id}`);
      if (!response.ok) throw new Error("서버 에러 발생");
      return response.json();
    },
    initialData,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
