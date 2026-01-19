import { deepParseLostarkData, LOSTARK_API_BASE } from "@/lib/lostark-utils";
import { createSupabaseServer } from "@/lib/supabase/server/server";
import type {
  NoticeItem,
  EventItem,
  CalendarItem,
  LostArkCharacterResponse,
  ArkPassiveData,
} from "@/types/lostark";

const REVALIDATE_TIME = 300;

async function fetchLostarkAPI<T>(endpoint: string): Promise<T | null> {
  const response = await fetch(`${LOSTARK_API_BASE}${endpoint}`, {
    headers: {
      accept: "application/json",
      authorization: `bearer ${process.env.LOSTARK_API_KEY}`,
    },
    next: { revalidate: REVALIDATE_TIME },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  const rawData = await response.json();
  return deepParseLostarkData(rawData) as T;
}

export async function getNotices(): Promise<NoticeItem[]> {
  const data = await fetchLostarkAPI<NoticeItem[]>("/news/notices");
  return data ?? [];
}

export async function getEvents(): Promise<EventItem[]> {
  const data = await fetchLostarkAPI<EventItem[]>("/news/events");
  return data ?? [];
}

export async function getCalendar(): Promise<CalendarItem[]> {
  const data = await fetchLostarkAPI<CalendarItem[]>("/gamecontents/calendar");
  return data ?? [];
}

export async function getHomePageData() {
  const [notices, events, calendar] = await Promise.all([
    getNotices(),
    getEvents(),
    getCalendar(),
  ]);

  return { notices, events, calendar };
}

export async function getRaidsList() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("raids")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch raids: ${error.message}`);
  }

  return data;
}

export async function getRaidDetail(id: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("raids")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch raid detail: ${error.message}`);
  }

  return data;
}

export async function getCharacterProfile(
  name: string
): Promise<LostArkCharacterResponse | null> {
  return fetchLostarkAPI<LostArkCharacterResponse>(
    `/armories/characters/${encodeURIComponent(name)}/profiles`
  );
}

export async function getCharacterArkpassive(
  name: string
): Promise<ArkPassiveData | null> {
  return fetchLostarkAPI<ArkPassiveData>(
    `/armories/characters/${encodeURIComponent(name)}/arkpassive`
  );
}

export async function getCharacterPageData(name: string) {
  const [profile, arkpassive] = await Promise.all([
    getCharacterProfile(name),
    getCharacterArkpassive(name),
  ]);

  return { profile, arkpassive };
}
