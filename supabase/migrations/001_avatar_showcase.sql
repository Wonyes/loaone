-- Avatar Showcase 테이블 생성
-- 유저당 1개의 대표 캐릭터 등록 (스냅샷 저장)

CREATE TABLE IF NOT EXISTS avatar_showcase (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name VARCHAR(50) NOT NULL,
  server_name VARCHAR(30),
  class_name VARCHAR(30),
  item_level VARCHAR(20),
  character_image TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 유저당 1개만 허용
  CONSTRAINT unique_user_showcase UNIQUE (user_id)
);

-- Avatar Likes 테이블 생성
-- 좋아요 중복 방지

CREATE TABLE IF NOT EXISTS avatar_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  showcase_id UUID NOT NULL REFERENCES avatar_showcase(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 유저당 showcase별 1개만 허용
  CONSTRAINT unique_showcase_like UNIQUE (showcase_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_avatar_showcase_user_id ON avatar_showcase(user_id);
CREATE INDEX IF NOT EXISTS idx_avatar_showcase_created_at ON avatar_showcase(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avatar_showcase_is_public ON avatar_showcase(is_public);
CREATE INDEX IF NOT EXISTS idx_avatar_likes_showcase_id ON avatar_likes(showcase_id);
CREATE INDEX IF NOT EXISTS idx_avatar_likes_user_id ON avatar_likes(user_id);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_avatar_showcase_updated_at
  BEFORE UPDATE ON avatar_showcase
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE avatar_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_likes ENABLE ROW LEVEL SECURITY;

-- avatar_showcase 정책
-- 공개된 showcase는 모두 조회 가능
CREATE POLICY "Public showcases are viewable by everyone" ON avatar_showcase
  FOR SELECT USING (is_public = true);

-- 자신의 showcase는 항상 조회 가능
CREATE POLICY "Users can view own showcase" ON avatar_showcase
  FOR SELECT USING (auth.uid() = user_id);

-- 자신의 showcase만 생성/수정/삭제 가능
CREATE POLICY "Users can insert own showcase" ON avatar_showcase
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own showcase" ON avatar_showcase
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own showcase" ON avatar_showcase
  FOR DELETE USING (auth.uid() = user_id);

-- avatar_likes 정책
-- 공개된 showcase의 좋아요는 모두 조회 가능
CREATE POLICY "Likes are viewable by everyone" ON avatar_likes
  FOR SELECT USING (true);

-- 로그인한 유저만 좋아요 추가/삭제 가능
CREATE POLICY "Authenticated users can like" ON avatar_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike own likes" ON avatar_likes
  FOR DELETE USING (auth.uid() = user_id);
