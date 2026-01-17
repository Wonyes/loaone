// src/types/database.ts

export interface Character {
  id: string;
  user_id_uuid: string;
  character_name: string;
  server_name: string;
  class_name: string | null;
  current_item_level: number | null;
  current_expedition_level: number | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LevelHistory {
  id: string;
  character_name: string;
  item_level: number;
  combat_power: number | null;
  level_change: number;
  previous_level: number | null;
  recorded_at: string;
}

export interface CharacterInsert {
  character_name: string;
  server_name: string;
  class_name?: string | null;
  current_item_level?: number | null;
  current_expedition_level?: number | null;
}

export interface LevelHistoryInsert {
  character_id: string;
  item_level: number;
  expedition_level?: number | null;
  level_change: number;
  previous_level?: number | null;
}

export interface CharacterUpdate {
  character_name?: string;
  server_name?: string;
  class_name?: string | null;
  current_item_level?: number | null;
  current_expedition_level?: number | null;
  last_synced_at?: string | null;
  updated_at?: string;
}

export interface LevelHistoryUpdate {
  item_level?: number;
  expedition_level?: number | null;
  level_change?: number;
  previous_level?: number | null;
}
