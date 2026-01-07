import CharacterInfo from "@/components/character/CharacterInfo";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const { name } = resolvedParams;

  const decodedValue = decodeURIComponent(name);
  return <CharacterInfo name={decodedValue} />;
}
