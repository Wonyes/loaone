import { useQuery } from "@tanstack/react-query";

const fetchCharacterData = async (name: string, type: string) => {
  const response = await fetch(
    `/api/lostark/${encodeURIComponent(name)}?type=${type}`
  );
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export function useProfile(name: string) {
  return useQuery({
    queryKey: ["lostark", "profile", name],
    queryFn: () => fetchCharacterData(name, "profile"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEquipment(name: string) {
  return useQuery({
    queryKey: ["lostark", "equipment", name],
    queryFn: () => fetchCharacterData(name, "equipment"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvatars(name: string) {
  return useQuery({
    queryKey: ["lostark", "avatars", name],
    queryFn: () => fetchCharacterData(name, "avatars"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSkills(name: string) {
  return useQuery({
    queryKey: ["lostark", "skills", name],
    queryFn: () => fetchCharacterData(name, "skills"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEngravings(name: string) {
  return useQuery({
    queryKey: ["lostark", "engravings", name],
    queryFn: () => fetchCharacterData(name, "engravings"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGems(name: string) {
  return useQuery({
    queryKey: ["lostark", "gems", name],
    queryFn: () => fetchCharacterData(name, "gems"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCards(name: string) {
  return useQuery({
    queryKey: ["lostark", "cards", name],
    queryFn: () => fetchCharacterData(name, "cards"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollectibles(name: string) {
  return useQuery({
    queryKey: ["lostark", "collectibles", name],
    queryFn: () => fetchCharacterData(name, "collectibles"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSiblings(name: string) {
  return useQuery({
    queryKey: ["lostark", "siblings", name],
    queryFn: () => fetchCharacterData(name, "siblings"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArkgirds(name: string) {
  return useQuery({
    queryKey: ["lostark", "arkgrid", name],
    queryFn: () => fetchCharacterData(name, "arkgrid"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useArkpassive(name: string) {
  return useQuery({
    queryKey: ["lostark", "arkpassive", name],
    queryFn: () => fetchCharacterData(name, "arkpassive"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCharacters(name: string) {
  return useQuery({
    queryKey: ["lostark", "characters", name],
    queryFn: () => fetchCharacterData(name, "characters"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}
