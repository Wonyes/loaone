import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteCharacter {
  name: string
  serverName?: string
  itemLevel?: string
  className?: string
}

interface FavoriteStore {
  favorites: FavoriteCharacter[]
  addFavorite: (character: FavoriteCharacter) => void
  removeFavorite: (name: string) => void
  setFavorites: (characters: FavoriteCharacter[]) => void
  isFavorite: (name: string) => boolean
  getFavorite: (name: string) => FavoriteCharacter | undefined
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (character: FavoriteCharacter) =>
        set((state) => {
          const filtered = state.favorites.filter((f) => f.name !== character.name)
          return { favorites: [...filtered, character] }
        }),
      
      removeFavorite: (name: string) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.name !== name),
        })),
      
      setFavorites: (characters: FavoriteCharacter[]) =>
        set({ favorites: characters }),
      
      isFavorite: (name: string) => 
        get().favorites.some((f) => f.name === name),
      
      getFavorite: (name: string) =>
        get().favorites.find((f) => f.name === name),
    }),
    {
      name: 'favorite-storage',
    }
  )
)