import { useQuery } from "@tanstack/react-query";
import type {
  LostArkCharacterResponse,
  EquipmentItem,
  AvatarItem,
  SkillItem,
  EngravingItem,
  GemItem,
  CardItem,
  CollectibleCategory,
  SiblingCharacter,
  ArkPassiveData,
} from "@/types/lostark";

const STALE_TIME = 5 * 60 * 1000;

type CharacterDataType =
  | "profile"
  | "equipment"
  | "avatars"
  | "skills"
  | "engravings"
  | "gems"
  | "cards"
  | "collectibles"
  | "siblings"
  | "arkgrid"
  | "arkpassive"
  | "characters";

const fetchCharacterData = async <T>(
  name: string,
  type: CharacterDataType
): Promise<T> => {
  const response = await fetch(
    `/api/lostark/${encodeURIComponent(name)}?type=${type}`
  );
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

function useLostarkData<T>(
  name: string,
  type: CharacterDataType,
  initialData?: T
) {
  return useQuery<T>({
    queryKey: ["lostark", type, name],
    queryFn: () => fetchCharacterData<T>(name, type),
    enabled: !!name,
    staleTime: STALE_TIME,
    initialData,
  });
}

export const useProfile = (
  name: string,
  initialData?: LostArkCharacterResponse
) => useLostarkData<LostArkCharacterResponse>(name, "profile", initialData);

export const useEquipment = (name: string) =>
  useLostarkData<EquipmentItem[]>(name, "equipment");

export const useAvatars = (name: string) =>
  useLostarkData<AvatarItem[]>(name, "avatars");

export const useSkills = (name: string) =>
  useLostarkData<SkillItem[]>(name, "skills");

export const useEngravings = (name: string) =>
  useLostarkData<EngravingItem[]>(name, "engravings");

export const useGems = (name: string) =>
  useLostarkData<GemItem[]>(name, "gems");

export const useCards = (name: string) =>
  useLostarkData<CardItem[]>(name, "cards");

export const useCollectibles = (name: string) =>
  useLostarkData<CollectibleCategory[]>(name, "collectibles");

export const useSiblings = (name: string) =>
  useLostarkData<SiblingCharacter[]>(name, "siblings");

export const useArkgirds = (name: string) =>
  useLostarkData<any[]>(name, "arkgrid");

export const useArkpassive = (name: string, initialData?: ArkPassiveData) =>
  useLostarkData<ArkPassiveData>(name, "arkpassive", initialData);

export const useCharacters = (name: string) =>
  useLostarkData<SiblingCharacter[]>(name, "characters");
