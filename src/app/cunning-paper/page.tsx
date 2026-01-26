import { getRaidsList } from "@/lib/api/server";
import RaidListClient from "@/components/cunning-paper/RaidListClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "컨닝페이퍼",
  description: "로스트아크 레이드 공략 컨닝페이퍼",
};

export default async function RaidListPage() {
  const raids = await getRaidsList();

  return <RaidListClient initialRaids={raids} />;
}
