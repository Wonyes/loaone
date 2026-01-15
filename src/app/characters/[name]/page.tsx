import CharacterPage from "@/components/character/CharacterPage";

export default async function CharacterPageRoute({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const { name } = resolvedParams;

  const decodedValue = decodeURIComponent(name);
  return <CharacterPage name={decodedValue} />;
}
