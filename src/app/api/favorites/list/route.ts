import { createClient } from '@/lib/supabase/discode/discode'
import { NextRequest, NextResponse } from 'next/server'

// GET: 즐겨찾기 상태 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')

  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ favorited: false, favorites: [] })
  }

  // name 있으면 → 개별 확인
  if (name) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('character_name', name)
      .single()

    return NextResponse.json({ favorited: !!data })
  }

  // name 없으면 → 전체 목록
  const { data, error } = await supabase
    .from('favorites')
    .select('character_name, server_name, item_level, class, img')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ favorites: [] })
  }

  return NextResponse.json({
    favorites: data.map((f) => ({
      name: f.character_name,
      serverName: f.server_name,
      itemLevel: f.item_level,
      className: f.class,
      img: f.img
    })),
  })
}

// POST: 즐겨찾기 토글
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { characterName, serverName, itemLevel, className } = body

    if (!characterName) {
      return NextResponse.json({ error: 'Character name required' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('character_name', characterName)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id)

      if (error) throw error
      return NextResponse.json({ favorited: false })
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          character_name: characterName,
          server_name: serverName,      
          item_level: itemLevel,
          class: className,
          created_at: new Date().toISOString(),
        })

      if (error) throw error
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Favorites POST error:', error)
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 })
  }
}