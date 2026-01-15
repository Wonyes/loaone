'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 현재 사용자 가져오기
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      console.log('🔍 useUser - user:', user)  // 추가!
      console.log('🔍 useUser - error:', error)  // 추가!
      setUser(user)
      setLoading(false)
    })

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔍 Auth state changed:', session?.user)  // 추가!
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}