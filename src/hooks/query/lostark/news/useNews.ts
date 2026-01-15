import { useQuery } from "@tanstack/react-query";

const fetchNewsData = async (type: string) => {
  const response = await fetch(`/api/lostark/news?type=${type}`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export function useNotices() {
  return useQuery({
    queryKey: ["lostark", "notices"],
    queryFn: () => fetchNewsData("notices"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["lostark", "events"],
    queryFn: () => fetchNewsData("events"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAlarms() {
  return useQuery({
    queryKey: ["lostark", "alarms"],
    queryFn: () => fetchNewsData("alarms"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalendar() {
  return useQuery({
    queryKey: ["lostark", "calendar"],
    queryFn: () => fetchNewsData("calendar"),
    staleTime: 5 * 60 * 1000,
  });
}
