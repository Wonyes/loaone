import { useQuery } from "@tanstack/react-query";
import type { NoticeItem, EventItem, CalendarItem } from "@/types/lostark";

const STALE_TIME = 5 * 60 * 1000;

const DEFAULT_QUERY_OPTIONS = {
  staleTime: STALE_TIME,
  refetchInterval: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;

type NewsType = "notices" | "events" | "alarms" | "calendar";

const fetchNewsData = async <T>(type: NewsType): Promise<T> => {
  const response = await fetch(`/api/lostark/news?type=${type}`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

function useNewsData<T>(type: NewsType) {
  return useQuery<T>({
    queryKey: ["lostark", type],
    queryFn: () => fetchNewsData<T>(type),
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export const useNotices = () => useNewsData<NoticeItem[]>("notices");
export const useEvents = () => useNewsData<EventItem[]>("events");
export const useAlarms = () => useNewsData<any[]>("alarms");
export const useCalendar = () => useNewsData<CalendarItem[]>("calendar");
