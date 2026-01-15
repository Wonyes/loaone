import { useFavoriteStore } from '@/hooks/store/favoriteStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface ToggleFavoriteParams {
  characterName: string
  serverName?: string
  itemLevel?: string
  className?: string
}

const fetchFavorites = async () => {
  const res = await fetch('/api/favorites/list')
  if (!res.ok) throw new Error('Failed')
  return res.json() as Promise<{ favorites: Array<{
    name: string
    serverName?: string
    itemLevel?: string
    className?: string
  }> }>
}

export function useFavorites() {
  const setFavorites = useFavoriteStore((state) => state.setFavorites)

  const query = useQuery({
    queryKey: ['favorites', 'list'],
    queryFn: fetchFavorites,
  })

  useEffect(() => {
    if (query.data) {
      setFavorites(query.data.favorites)
    }
  }, [query.data, setFavorites])

  return query
}

export function useFavoriteStatus(name: string) {
  const isFavorite = useFavoriteStore((state) => state.isFavorite(name))
  
  return {
    data: { favorited: isFavorite },
    isLoading: false,
  }
}

// 즐겨찾기 토글
const toggleFavorite = async (params: ToggleFavoriteParams) => {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) throw new Error('Failed')
  return res.json() as Promise<{ favorited: boolean }>
}

export function useToggleFavorite(name: string) {
  const queryClient = useQueryClient()
  const addFavorite = useFavoriteStore((state) => state.addFavorite)
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite)
  const isFavorite = useFavoriteStore((state) => state.isFavorite(name))

  return useMutation({
    mutationFn: (params: ToggleFavoriteParams) => toggleFavorite(params),
    
    onMutate: async (variables) => {
      // Optimistic update
      if (isFavorite) {
        removeFavorite(variables.characterName)
      } else {
        addFavorite({
          name: variables.characterName,
          serverName: variables.serverName,
          itemLevel: variables.itemLevel,
          className: variables.className,
        })
      }
      
      // context로 이전 상태 반환 (롤백용)
      return { variables }
    },
    
    onError: (error, variables, context) => {
      // 롤백
      if (context?.variables) {
        if (isFavorite) {
          addFavorite({
            name: context.variables.characterName,
            serverName: context.variables.serverName,
            itemLevel: context.variables.itemLevel,
            className: context.variables.className,
          })
        } else {
          removeFavorite(context.variables.characterName)
        }
      }
    },
    
    onSuccess: (data, variables) => {
      if (data.favorited) {
        addFavorite({
          name: variables.characterName,
          serverName: variables.serverName,
          itemLevel: variables.itemLevel,
          className: variables.className,
        })
      } else {
        removeFavorite(variables.characterName)
      }
      queryClient.invalidateQueries({ queryKey: ['favorites', 'list'] })
    },
  })
}