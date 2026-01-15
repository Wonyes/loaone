'use client'

import { useFavoriteStore } from '@/hooks/store/favoriteStore'
import { useFavorites } from '@/hooks/query/lostark/character/useFavorite'
import Link from 'next/link'
import { Star, Server, Swords } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/hooks/useUesr'
import { Card } from '@/components/common/Card'

export default function FavoritesPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const favorites = useFavoriteStore((state) => state.favorites)
  
  // 서버에서 즐겨찾기 불러오기
  const { isLoading } = useFavorites()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading || isLoading) {
    return (
      <div className="flex  items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (favorites.length === 0) {
    return (
      <Card className="flex p-6 h-full items-center justify-center">
        <div className="text-center">
          <Star className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h2 className="mb-2 text-2xl font-bold text-white">
            즐겨찾기가 비어있어요
          </h2>
          <p className="mb-6 text-slate-400">
            캐릭터 페이지에서 별을 눌러 즐겨찾기를 추가해보세요!
          </p>
         
        </div>
      </Card>
    )
  }

  return (
   <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {favorites.length === 0 ? (
          <div className="flex  items-center justify-center px-6">
            <div className="text-center">
              <Star className="mx-auto mb-4 h-16 w-16 text-slate-600" />
              <h2 className="mb-2 text-2xl font-bold text-white">
                즐겨찾기가 비어있어요
              </h2>
              <p className="mb-6 text-slate-400">
                캐릭터 페이지에서 별을 눌러 즐겨찾기를 추가해보세요!
              </p>
              <Link
                href="/"
                className="inline-block rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition-all hover:bg-violet-700"
              >
                홈으로 가기
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 py-20">
            {/* 즐겨찾기 목록 */}
          </div>
        )}
      </div>
  )
}