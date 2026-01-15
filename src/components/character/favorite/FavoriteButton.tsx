'use client'

import { useFavoriteStatus, useToggleFavorite } from '@/hooks/query/lostark/character/useFavorite'
import { useUser } from '@/hooks/useUesr'
import { Star } from 'lucide-react'

export default function FavoriteButton({
  characterName,
  profileData
}: {
  profileData: any
  characterName: string
}) {
  const { user} = useUser();
  const { data } = useFavoriteStatus(characterName);
  const toggle = useToggleFavorite(characterName);

  if(!user) {
    return null
  }

  const favorite = () => {
    toggle.mutate({
      characterName,
      serverName : profileData.ServerName,
      itemLevel: profileData?.ItemAvgLevel,
      className: profileData?.CharacterClassName,
    })
  }

  return (
    <button
      onClick={favorite}
      disabled={toggle.isPending}
      className="absolute right-4 top-4 z-20 text-3xl transition-all hover:scale-110 disabled:opacity-50"
      title={data?.favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <Star 
        className={`h-8 w-8 ${
        data?.favorited 
        ? 'fill-yellow-400 text-yellow-400'  
        : 'text-gray-400'                     
        }`}
  />
    </button>
  )
}