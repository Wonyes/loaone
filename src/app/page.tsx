import { getEvents, getNotices } from "@/lib/api/server";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const [events, notices] = await Promise.all([getEvents(), getNotices()]);

  return <HomeClient initialEvents={events} initialNotices={notices} />;
}
