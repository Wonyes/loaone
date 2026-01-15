export interface Character {
  name: string;
  level: number;
  class: string;
  server?: string;
}

export interface CharacterResponse {
  success: boolean;
  character?: Character;
  error?: string;
}
