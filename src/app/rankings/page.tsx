import { getRankings } from "@/lib/supabase/rankings";
import RankingsPage from "@/components/rankings/RankingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "랭킹",
  description: "캐릭터 아이템 레벨 랭킹",
};

export default async function RankingsRoute() {
  const rankings = await getRankings(100);

  return <RankingsPage initialRankings={rankings} />;
}
