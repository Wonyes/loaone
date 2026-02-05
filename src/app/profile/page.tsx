import { Metadata } from "next";
import ProfileLayoutPage from "@/components/character/ProfilePage";

export const metadata: Metadata = {
  title: "프로필",
  description: "내 프로필",
};

export default async function RankingsRoute() {
  return <ProfileLayoutPage />;
}
