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

export const useNotices = (initialData?: NoticeItem[]) =>
  useQuery<NoticeItem[]>({
    queryKey: ["lostark", "notices"],
    queryFn: () => fetchNewsData<NoticeItem[]>("notices"),
    initialData,
    ...DEFAULT_QUERY_OPTIONS,
  });

export const useEvents = (initialData?: EventItem[]) =>
  useQuery<EventItem[]>({
    queryKey: ["lostark", "events"],
    queryFn: () => fetchNewsData<EventItem[]>("events"),
    initialData,
    ...DEFAULT_QUERY_OPTIONS,
  });

export const useAlarms = () =>
  useQuery<any[]>({
    queryKey: ["lostark", "alarms"],
    queryFn: () => fetchNewsData<any[]>("alarms"),
    ...DEFAULT_QUERY_OPTIONS,
  });

export const useCalendar = (initialData?: CalendarItem[]) =>
  useQuery<CalendarItem[]>({
    queryKey: ["lostark", "calendar"],
    queryFn: () => fetchNewsData<CalendarItem[]>("calendar"),
    initialData,
    ...DEFAULT_QUERY_OPTIONS,
  });
