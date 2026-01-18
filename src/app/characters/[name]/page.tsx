import CharacterPage from "@/components/character/CharacterPage";
import { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  const characterName = decodeURIComponent(resolvedParams.name);

  const tabName = "전투정보실";

  return {
    title: `${characterName} ${tabName}`,
    description: `${characterName}의 ${tabName} 정보를 확인하세요`,
  };
}

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
