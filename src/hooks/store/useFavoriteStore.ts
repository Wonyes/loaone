import { create } from "zustand";

interface FavoriteCharacter {
  name: string;
  serverName?: string;
  itemLevel?: string;
  className?: string;
  img?: string;
}

interface FavoriteStore {
  favorites: FavoriteCharacter[];
  setFavorites: (characters: FavoriteCharacter[]) => void;
  addFavorite: (character: FavoriteCharacter) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
  getFavorite: (name: string) => FavoriteCharacter | undefined;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],

  setFavorites: (characters: FavoriteCharacter[]) =>
    set({ favorites: characters }),

  addFavorite: (character: FavoriteCharacter) =>
    set(state => {
      const filtered = state.favorites.filter(f => f.name !== character.name);
      return { favorites: [...filtered, character] };
    }),

  removeFavorite: (name: string) =>
    set(state => ({
      favorites: state.favorites.filter(f => f.name !== name),
    })),

  isFavorite: (name: string) => get().favorites.some(f => f.name === name),

  getFavorite: (name: string) => get().favorites.find(f => f.name === name),
}));
