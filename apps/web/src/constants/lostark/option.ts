export const TABS = [
  { id: "equipment", label: "장비" },
  { id: "avatar", label: "아바타" },
  { id: "skill", label: "스킬" },
  { id: "history", label: "히스토리" },
  { id: "collectible", label: "수집형 포인트" },
  { id: "characters", label: "보유 캐릭터" },
  { id: "guild", label: "길드" },
] as const;

export const GRADE_POSITIONS: Record<string, string> = {
  전설: "80.4%",
  영웅: "60.3%",
  희귀: "40.2%",
  고급: "20.1%",
  일반: "0%",
};

export const EQUIPMENT_ORDER = ["투구", "어깨", "상의", "하의", "장갑", "무기"];
export const EQUIPMENT_AEC = ["목걸이", "귀걸이", "반지"];
export const ARK_PAS = ["진화", "깨달음", "도약"];

export const SPRITEPOSITIONS: Record<string, string> = {
  "누크만의 환영석": "-24px -214px",
  "크림스네일의 해도": "0px -214px",
  "기억의 오르골": "2px -234px",
  "오르페우스의 별": "-235px -69px",
  "이그네아의 징표": "-235px 0px",
  "거인의 심장": "-199px -173px",
  "항해 모험물": "-234px -115px",
  "위대한 미술품": "-174px -172px",
  "세계수의 잎": "-234px -47px",
  "섬의 마음": "-235px -23px",
  "모코코 씨앗": "-234px -92px",
};
