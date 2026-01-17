export const RAID_LIST = [
  { name: "세르카 나메", gold: 54000, minLevel: 1740 },
  { name: "세르카 하드", gold: 44000, minLevel: 1730 },
  { name: "세르카 노말", gold: 35000, minLevel: 1710 },
  { name: "종막 하드", gold: 52000, minLevel: 1730 },
  { name: "종막 노말", gold: 40000, minLevel: 1710 },
  { name: "4막 하드", gold: 42000, minLevel: 1720 },
  { name: "4막 노말", gold: 33000, minLevel: 1700 },
  { name: "3막 하드", gold: 27000, minLevel: 1700 },
  { name: "3막 노말", gold: 21000, minLevel: 1680 },
  { name: "2막 하드", gold: 23000, minLevel: 1690 },
  { name: "2막 노말", gold: 16500, minLevel: 1670 },
  { name: "1막 하드", gold: 18000, minLevel: 1680 },
  { name: "1막 노말", gold: 11500, minLevel: 1660 },
  { name: "베히모스 노말", gold: 7200, minLevel: 1640 },
  { name: "서막 하드", gold: 7200, minLevel: 1620 },
];

/**
 * 캐릭터 레벨 기준 가장 비싼 레이드 3개 추출
 */
export const calculateWeeklyGold = (levelStr: string) => {
  const level = parseFloat(levelStr.replace(/,/g, ""));

  const myRaids = RAID_LIST.filter(raid => level >= raid.minLevel)
    .sort((a, b) => b.gold - a.gold)
    .slice(0, 3);

  const total = myRaids.reduce((sum, raid) => sum + raid.gold, 0);

  return { myRaids, total };
};
