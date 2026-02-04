import { GRADE_STYLES } from "@/constants/lostark/styles";
import type {
  StoneInscription,
  CoreTooltip,
  ArkPassiveStyle,
  GradeStyle,
} from "@/types/lostark";

export type { StoneInscription, CoreTooltip, ArkPassiveStyle };

export function getLevelNumber(leftStr2: string): number | null {
  if (!leftStr2) return null;
  const match = leftStr2.match(/레벨\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
}

export function getQualityStyles(qualityValue: number): string {
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

export const getRefinementLevel = (tooltip: any): number => {
  const rawRefine = JSON.stringify(tooltip);
  const match = rawRefine.match(/\[상급 재련\]\s*(\d+)단계/);
  return match ? parseInt(match[1]) : 0;
};

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

export const getGradeStyle = (grade: string): GradeStyle => {
  return GRADE_STYLES[grade as keyof typeof GRADE_STYLES] || GRADE_STYLES.전설;
};

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
      iconType: null,
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

// 클래스별 직업각인 목록
const CLASS_ENGRAVINGS: Record<string, string[]> = {
  // 전사
  버서커: ["광기", "광전사의 비기"],
  디스트로이어: ["분노의 망치", "중력 수련"],
  워로드: ["전투 태세", "고독한 기사"],
  홀리나이트: ["축복의 오라", "심판자"],
  슬레이어: ["처단자", "포식자"],
  // 무도가
  배틀마스터: ["오의 강화", "초심"],
  인파이터: ["충격 단련", "극의: 체술"],
  기공사: ["역천지체", "세맥타통"],
  창술사: ["절정", "절제"],
  스트라이커: ["오의난무", "일격필살"],
  브레이커: ["수라의 길", "권왕파천무"],
  // 헌터
  데빌헌터: ["전술 탄환", "핸드거너"],
  블래스터: ["포격 강화", "화력 강화"],
  호크아이: ["죽음의 습격", "두 번째 동료"],
  스카우터: ["아르데타인의 기술", "진화의 유산"],
  건슬링어: ["피스메이커", "사냥의 시간"],
  // 마법사
  바드: ["절실한 구원", "진실된 용맹"],
  서머너: ["상급 소환사", "넘치는 교감"],
  아르카나: ["황후의 은총", "황제의 칙령"],
  소서리스: ["점화", "환류"],
  // 암살자
  블레이드: ["버스트", "잔재된 기운"],
  데모닉: ["멈출 수 없는 충동", "완벽한 억제"],
  리퍼: ["갈증", "달의 소리"],
  소울이터: ["만월의 집행자", "그믐의 경계"],
  // 스페셜리스트
  도화가: ["만개", "회귀"],
  기상술사: ["이슬비", "질풍노도"],
  환수사: ["야성", "환수 각성"],
  // 가나
  가디언나이트: ["업화의 계승자", "드레드 로어"],
  // 발키리
  발키리: ["빛의 기사", "해방자"],
};

export function getMainPassiveName(
  profileData: any,
  arkpassiveData: any
): string {
  if (!profileData || !arkpassiveData) return "정보 없음";

  const className = profileData.CharacterClassName;
  const validEngravings = CLASS_ENGRAVINGS[className] || [];

  // Effects에서 직업각인과 일치하는 스킬명 찾기
  for (const effect of arkpassiveData.Effects || []) {
    if (effect.Name !== "깨달음") continue;

    const match = effect.Description?.match(/\d티어\s+(.*?)\s+Lv\./);
    if (!match) continue;

    const extractedName = match[1].trim();

    const matchedEngraving = validEngravings.find(eng =>
      extractedName.includes(eng)
    );

    if (matchedEngraving) {
      return matchedEngraving;
    }
  }

  return "정보 없음";
}
