// Avatar Showcase 기본 타입
export interface AvatarShowcase {
  id: string;
  user_id: string;
  character_name: string;
  server_name: string | null;
  class_name: string | null;
  item_level: string | null;
  character_image: string | null;
  description: string | null;
  discord_name: string | null;
  discord_avatar: string | null;
  avatar_items: any[] | null;
  created_at: string;
  updated_at: string;
}

// 갤러리 표시용 (통계 포함)
export interface ShowcaseWithStats extends AvatarShowcase {
  like_count: number;
  is_liked?: boolean;
}

// 등록/수정 요청
export interface ShowcaseUpsertRequest {
  character_name: string;
  server_name?: string;
  class_name?: string;
  item_level?: string;
  character_image?: string;
  description?: string;
  avatar_items?: any[];
}

// 좋아요 정보
export interface ShowcaseLike {
  id: string;
  showcase_id: string;
  user_id: string;
  created_at: string;
}

// 갤러리 조회 응답
export interface GalleryResponse {
  showcases: ShowcaseWithStats[];
  total: number;
  page: number;
  hasMore: boolean;
}

// 정렬 옵션
export type ShowcaseSortOption = "latest" | "popular";
