import { useQuery } from "@tanstack/react-query";

const fetchCharacterData = async (name: string, type: string) => {
  const response = await fetch(
    `/api/lostark/${encodeURIComponent(name)}?type=${type}`
  );
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export function useCProfile(name: string) {
  return useQuery({
    queryKey: ["lostark", "profile", name],
    queryFn: () => fetchCharacterData(name, "profile"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCEquipment(name: string) {
  return useQuery({
    queryKey: ["lostark", "equipment", name],
    queryFn: () => fetchCharacterData(name, "equipment"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCAvatars(name: string) {
  return useQuery({
    queryKey: ["lostark", "avatars", name],
    queryFn: () => fetchCharacterData(name, "avatars"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCSkills(name: string) {
  return useQuery({
    queryKey: ["lostark", "skills", name],
    queryFn: () => fetchCharacterData(name, "skills"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCEngravings(name: string) {
  return useQuery({
    queryKey: ["lostark", "engravings", name],
    queryFn: () => fetchCharacterData(name, "engravings"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCGems(name: string) {
  return useQuery({
    queryKey: ["lostark", "gems", name],
    queryFn: () => fetchCharacterData(name, "gems"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCCards(name: string) {
  return useQuery({
    queryKey: ["lostark", "cards", name],
    queryFn: () => fetchCharacterData(name, "cards"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCCollectibles(name: string) {
  return useQuery({
    queryKey: ["lostark", "collectibles", name],
    queryFn: () => fetchCharacterData(name, "collectibles"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCSiblings(name: string) {
  return useQuery({
    queryKey: ["lostark", "siblings", name],
    queryFn: () => fetchCharacterData(name, "siblings"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCArkgirds(name: string) {
  return useQuery({
    queryKey: ["lostark", "arkgrid", name],
    queryFn: () => fetchCharacterData(name, "arkgrid"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCArkpassive(name: string) {
  return useQuery({
    queryKey: ["lostark", "arkpassive", name],
    queryFn: () => fetchCharacterData(name, "arkpassive"),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}
