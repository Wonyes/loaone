import { useQuery } from "@tanstack/react-query";

const fetchCharacterData = async (name: string, type: string) => {
  const response = await fetch(
    `/api/lostark/${encodeURIComponent(name)}?type=${type}`
  );
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

const STALE_TIME = 5 * 60 * 1000;

function useLostarkData<T = any>(name: string, type: string) {
  return useQuery<T>({
    queryKey: ["lostark", type, name],
    queryFn: () => fetchCharacterData(name, type),
    enabled: !!name,
    staleTime: STALE_TIME,
  });
}

export const useProfile = (name: string) => useLostarkData(name, "profile");
export const useEquipment = (name: string) => useLostarkData(name, "equipment");
export const useAvatars = (name: string) => useLostarkData(name, "avatars");
export const useSkills = (name: string) => useLostarkData(name, "skills");
export const useEngravings = (name: string) =>
  useLostarkData(name, "engravings");
export const useGems = (name: string) => useLostarkData(name, "gems");
export const useCards = (name: string) => useLostarkData(name, "cards");
export const useCollectibles = (name: string) =>
  useLostarkData(name, "collectibles");
export const useSiblings = (name: string) => useLostarkData(name, "siblings");
export const useArkgirds = (name: string) => useLostarkData(name, "arkgrid");
export const useArkpassive = (name: string) =>
  useLostarkData(name, "arkpassive");
export const useCharacters = (name: string) =>
  useLostarkData(name, "characters");
