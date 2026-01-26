// ============ API 응답 타입 ============

export interface LostArkStat {
  Type: string;
  Value: string;
  Tooltip: string[];
}

export interface LostArkTendency {
  Type: string;
  Point: number;
  MaxPoint: number;
}

export interface LostArkCharacterResponse {
  CharacterClassName: string;
  CharacterImage: string;
  CharacterLevel: number;
  CharacterName: string;
  CombatPower: string;
  ExpeditionLevel: number;
  GuildMemberGrade: string | null;
  GuildName: string | null;
  HonorPoint: number;
  ItemAvgLevel: string;
  ServerName: string;
  Stats: LostArkStat[];
  Tendencies: LostArkTendency[];
  Title: string | null;
  TotalSkillPoint: number;
  TownLevel: number | null;
  TownName: string | null;
  UsingSkillPoint: number;
}

// ============ 장비 관련 타입 ============

export interface EquipmentItem {
  Type: string;
  Name: string;
  Icon: string;
  Grade: GradeType;
  Tooltip: any;
}

export interface GemItem {
  Slot: number;
  Name: string;
  Icon: string;
  Level: number;
  Grade: string;
  Tooltip: any;
}

export interface CardItem {
  Slot: number;
  Name: string;
  Icon: string;
  AwakeCount: number;
  AwakeTotal: number;
  Grade: string;
  Tooltip: any;
}

// ============ 스킬 관련 타입 ============

export interface SkillItem {
  Name: string;
  Icon: string;
  Level: number;
  Type: string;
  IsAwakening: boolean;
  Tripods: TripodItem[];
  Rune: RuneItem | null;
  Tooltip: any;
}

export interface TripodItem {
  Slot: number;
  Name: string;
  Icon: string;
  Level: number;
  IsSelected: boolean;
  Tooltip: any;
}

export interface RuneItem {
  Name: string;
  Icon: string;
  Grade: string;
  Tooltip: any;
}

// ============ 수집품 관련 타입 ============

export interface CollectibleCategory {
  Type: string;
  Icon: string;
  Point: number;
  MaxPoint: number;
  CollectiblePoints: CollectiblePoint[];
}

export interface CollectiblePoint {
  PointName: string;
  Point: number;
  MaxPoint: number;
}

// ============ 아바타 관련 타입 ============

export interface AvatarItem {
  Type: string;
  Name: string;
  Icon: string;
  Grade: string;
  IsSet: boolean;
  IsInner: boolean;
  Tooltip: any;
}

// ============ 각인 관련 타입 ============

export interface EngravingItem {
  Slot: number;
  Name: string;
  Icon: string;
  Tooltip: any;
}

export interface EngravingEffect {
  Icon: string;
  Name: string;
  Description: string;
}

// ============ 캐릭터 목록 관련 타입 ============

export interface SiblingCharacter {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
  ItemMaxLevel: string;
}

// ============ 아크 패시브 관련 타입 ============

export interface ArkPassiveData {
  IsArkPassive: boolean;
  Points: ArkPassivePoint[];
  Effects: ArkPassiveEffect[];
}

export interface ArkPassivePoint {
  Name: string;
  Value: number;
  Tooltip: any;
}

export interface ArkPassiveEffect {
  Name: string;
  Description: string;
  Icon: string;
  Tooltip: any;
}

// ============ 스타일 관련 타입 ============

export type GradeType =
  | "에스더"
  | "고대"
  | "유물"
  | "영웅"
  | "전설"
  | "희귀"
  | "고급"
  | "일반";

export interface GradeStyle {
  bg: string;
  text: string;
  border: string;
}

export interface ArkPassiveStyle {
  text: string;
  bg: string;
  border: string;
  iconType: "sparkles" | "zap" | "flame" | null;
}

// ============ 파싱 결과 타입 ============

export interface StoneInscription {
  name: string;
  level: string;
  isDebuff: boolean;
}

export interface CoreTooltip {
  coreType: string;
  corePoint: string;
  coreOptions: string;
  coreCondition: string;
}

export interface AccessoryOption {
  name: string;
  value: string;
  tier: "상" | "중" | "하" | null;
}

export interface BraceletEffect {
  name: string;
  value: string;
  isSpecial: boolean;
}

// ============ 뉴스/이벤트 관련 타입 ============

export interface NoticeItem {
  Title: string;
  Date: string;
  Link: string;
  Type: string;
}

export interface EventItem {
  Title: string;
  Thumbnail: string;
  Link: string;
  StartDate: string;
  EndDate: string;
  RewardDate: string | null;
}

export interface CalendarItem {
  CategoryName: string;
  ContentsName: string;
  ContentsIcon: string;
  MinItemLevel: number;
  StartTimes: string[];
  Location: string;
  RewardItems: RewardItem[];
}

export interface RewardItem {
  Name: string;
  Icon: string;
  Grade: string;
  StartTimes: string[] | null;
}

// ============ UI 컴포넌트 Props 타입 ============

export interface BadgeVariant {
  quality: number;
  level: string;
  emerald: string;
  violet: string;
  purple: string;
  amber: string;
}

export type HighlightColor = "emerald" | "violet" | "none";

// ============ 랭킹 / 검색기록 타입  ============

export interface CharacterRanking {
  character_name: string;
  server_name: string;
  class: string;
  item_level: string;
  combat_level: number | null;
  guild: string | null;
  updated_at: string;
}

export interface PopularSearch {
  character_name: string;
  server_name: string;
  class: string;
  item_level: string;
  count: number;
}

// ============ 서버 및 클래스 상수 타입  ============
export interface RankingCharacter {
  id: string;
  character_name: string;
  server_name: string;
  class: string;
  item_level: string;
  combat_level: number | null;
  guild: string | null;
  updated_at: string;
  combat_power?: string;
  weapon?: string;
  weapon_level?: string;
  engraving?: string;
}

export interface RankingsPageProps {
  initialRankings: RankingCharacter[];
}
