// src/lib/lostark/types.ts

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
