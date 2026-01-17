import { GRADE_STYLES } from "@/constants/lostark/styles";

export function getLevelNumber(leftStr2: string): number | null {
  if (!leftStr2) return null;
  const match = leftStr2.match(/레벨\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function getQualityStyles(qualityValue: number) {
  if (qualityValue === 100)
    return "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-sm";
  if (qualityValue >= 90)
    return "bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold shadow-sm";
  if (qualityValue >= 70)
    return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold shadow-sm";
  return "bg-gray-600/80 text-gray-200 font-medium";
}

export const getTierNumber = (str: string): number => {
  const match = str?.match(/티어\s*(\d+)/i);
  return match ? parseInt(match[1]) : 0;
};

// 재련 단계 파싱
export const getRefinementLevel = (tooltip: any): number => {
  const rawRefine = JSON.stringify(tooltip);
  const match = rawRefine.match(/\[상급 재련\]\s*(\d+)단계/);
  return match ? parseInt(match[1]) : 0;
};

// 스톤 각인 파싱
interface StoneInscription {
  name: string;
  level: string;
  isDebuff: boolean;
}

export const parseStoneInscriptions = (tooltip: any): StoneInscription[] => {
  const effectsObj = tooltip?.Element_007?.value?.Element_000?.contentStr || {};

  return Object.values(effectsObj).flatMap((e: any) => {
    const match = e.contentStr?.match(/\[(.+?)\]\s*Lv\.(\d+)/);
    if (!match) return [];

    return [
      {
        name: match[1],
        level: match[2],
        isDebuff: match[1].includes("감소"),
      },
    ];
  });
};

export const getGradeStyle = (grade: string) => {
  return GRADE_STYLES[grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
};

// 코어 툴팁 파싱
interface CoreTooltip {
  coreType: string;
  corePoint: string;
  coreOptions: string;
  coreCondition: string;
}

export const parseCoreTooltip = (slot: any): CoreTooltip => {
  const result: CoreTooltip = {
    coreType: "",
    corePoint: "",
    coreOptions: "",
    coreCondition: "",
  };

  Object.values(slot.tooltip || {}).forEach((element: any) => {
    if (!element?.value) return;

    const { Element_000, Element_001 } = element.value;
    if (!Element_000 || !Element_001) return;

    const mapping: Record<string, keyof CoreTooltip> = {
      "코어 타입": "coreType",
      "코어 공급 의지력": "corePoint",
      "코어 옵션": "coreOptions",
      "코어 옵션 발동 조건": "coreCondition",
    };

    const key = mapping[Element_000];
    if (key) result[key] = Element_001;
  });

  return result;
};

export interface ArkPassiveStyle {
  text: string;
  bg: string;
  border: string;
  iconType: "sparkles" | "zap" | "flame" | null;
}

const ARK_PASSIVE_STYLES: Record<string, ArkPassiveStyle> = {
  진화: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconType: "sparkles",
  },
  깨달음: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    iconType: "zap",
  },
  도약: {
    text: "text-lime-400",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    iconType: "flame",
  },
};

export const getArkPassiveStyle = (type: string): ArkPassiveStyle => {
  return (
    ARK_PASSIVE_STYLES[type] || {
      text: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/20",
      icon: null,
    }
  );
};

const CLASS_NAME_MAP: Record<string, string> = {
  // 전사
  버서커: "berserker",
  디스트로이어: "destroyer",
  워로드: "warlord",
  홀리나이트: "holyknight",
  슬레이어: "berserker_female",
  // 무도가
  배틀마스터: "battle_master",
  인파이터: "infighter",
  기공사: "force_master",
  창술사: "lance_master",
  스트라이커: "battle_master_male",
  브레이커: "infighter_male",
  // 헌터
  데빌헌터: "devil_hunter",
  블래스터: "blaster",
  호크아이: "hawk_eye",
  스카우터: "scouter",
  건슬링어: "devil_hunter_female",
  // 마법사
  바드: "bard",
  서머너: "summoner",
  아르카나: "arcana",
  소서리스: "elemental_master",
  // 암살자
  블레이드: "blade",
  데모닉: "demonic",
  리퍼: "reaper",
  소울이터: "soul_eater",
  // 스페셜리스트
  환수사: "alchemist",
  도화가: "yinyangshi",
  기상술사: "weather_artist",
  // 발키리
  발키리: "valkyrie",
  // 가나
  가디언나이트: "dragon_knight",
};

export const getClassIcon = (className: string) => {
  const englishName = CLASS_NAME_MAP[className];

  if (!englishName) {
    return "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/default.png";
  }
  const suffix = englishName === "infighter_male" ? "" : "_m";

  return `https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/${englishName}${suffix}.png`;
};
