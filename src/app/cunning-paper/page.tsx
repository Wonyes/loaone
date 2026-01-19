import { getRaidsList } from "@/lib/api/server";
import RaidListClient from "@/components/cunning-paper/RaidListClient";

export default async function RaidListPage() {
  const raids = await getRaidsList();

  return <RaidListClient initialRaids={raids} />;
}
