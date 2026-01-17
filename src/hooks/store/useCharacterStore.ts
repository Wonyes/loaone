import { create } from "zustand";

interface CharacterState {
  selectedCharacter: string | null;
  selectedPeriod: "7d" | "30d" | "90d" | "all";
  setSelectedCharacter: (name: string | null) => void;
  setSelectedPeriod: (period: "7d" | "30d" | "90d" | "all") => void;
}

export const useCharacterStore = create<CharacterState>(set => ({
  selectedCharacter: null,
  selectedPeriod: "30d",
  setSelectedCharacter: name => set({ selectedCharacter: name }),
  setSelectedPeriod: period => set({ selectedPeriod: period }),
}));
