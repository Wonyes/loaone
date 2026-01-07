"use client";

import {
  useCCards,
  useCCollectibles,
  useCEngravings,
  useCEquipment,
  useCGems,
  useCProfile,
  useCSkills,
} from "@/hooks/query/useLostarkApi";
import clsx from "clsx";
import { Crown, Flame, Gem, Sword } from "lucide-react";
import { useState } from "react";
import { CharacterBracelet } from "./CharacterBracelet";
import { CharacterGems } from "./CharacterGems";
import { CharacterCards } from "./CharacterCards";
import { parseAccessoryOptions } from "@/utils/accessoryParser";

export default function CharacterInfo({ name }: { name: string }) {
  const [activeTab, setActiveTab] = useState("equipment");

  const { data: profileData } = useCProfile(name);
  const { data: equipmentData } = useCEquipment(name);
  const { data: gemsData } = useCGems(name);
  const { data: engravingsData } = useCEngravings(name);
  const { data: engravingsCard } = useCCards(name);
  const { data: skillsData } = useCSkills(name);
  const { data: collectiblesData } = useCCollectibles(name);

  const topValues = [...(profileData?.Stats || [])]
    .map(s => Number(s.Value))
    .sort((a, b) => b - a)
    .slice(0, 4);

  console.log({
    skillsData,
    engravingsCard,

    collectiblesData,
  });
  console.log({
    profileData,
    equipmentData,
    gemsData,
    engravingsData,
  });

  const getGradeStyles = (gradeName: string) => {
    if (gradeName === "고대")
      return {
        bg: "bg-gradient-to-br from-[#3d3325] to-[#dcc999]",
        text: "text-[#dcc999]",
        border: "border-[#dcc999]/40",
      };
    if (gradeName === "유물")
      return {
        bg: "bg-gradient-to-br from-[#341a09] to-[#a24006]",
        text: "text-[#a24006]",
        border: "border-[#a24006]/40",
      };
    return {
      // 전설
      bg: "bg-gradient-to-br from-[#362003] to-[#9e5f04]",
      text: "text-[#9e5f04]",
      border: "border-[#9e5f04]/40",
    };
  };
  return (
    <div className="mx-auto mt-6 flex flex-col gap-2">
      {/* 탭 네비게이션 */}
      <div className="design-card rounded-lg border border-white/10 p-2 lg:col-span-8">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: "equipment", label: "장비" },
            { id: "avatar", label: "아바타" },
            { id: "skill", label: "스킬" },
            { id: "history", label: "히스토리" },
            { id: "collectible", label: "수집형 포인트" },
            { id: "characters", label: "보유 캐릭터" },
            { id: "guild", label: "길드" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer rounded px-5 py-1 text-base font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 상단: 캐릭터 헤더 */}
      <div className="design-card relative overflow-hidden rounded-2xl bg-[#0b0f1a]">
        {/* 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />
        {/* 광원 */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

        {/* 캐릭터 이미지 */}
        {profileData?.CharacterImage && (
          <img
            src={profileData.CharacterImage}
            alt={profileData.CharacterName}
            className="pointer-events-none absolute top-[5px] left-1/2 h-[520px] w-[360px] -translate-x-1/2 scale-[1.3] [mask-image:linear-gradient(90deg,transparent,black_30%_80%,transparent)] [mask-image:linear-gradient(to_top,transparent_5%,black_55%)] object-cover object-[50%_15%] mix-blend-lighten drop-shadow-[0_0_80px_rgba(168,85,247,0.55)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_30%_80%,transparent)]"
          />
        )}

        {/* 정보 영역 */}
        <div className="relative z-10 flex max-h-[240px] min-h-[200px] items-end justify-between p-2">
          {/* 왼쪽 정보 */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Gem className="h-6 w-6 text-emerald-400" />
                <div className="leading-tight">
                  <p className="text-2xl font-extrabold text-emerald-400">
                    {profileData?.ItemAvgLevel}
                  </p>
                </div>
              </div>

              {/* 전투력 */}
              <div className="flex items-center gap-3">
                <Sword className="h-6 w-6 text-violet-400" />
                <div className="leading-tight">
                  <p className="text-2xl font-extrabold">
                    {profileData?.CombatPower}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <span className="rounded bg-black/60 px-2 py-0.5 text-gray-300">
                    {profileData?.ServerName}
                  </span>
                  <span className="rounded bg-black/60 px-2 py-0.5 text-gray-300">
                    {profileData?.CharacterClassName}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight">
                  {profileData?.CharacterName}
                </h1>
              </div>

              <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-sm">
                <span className="col-span-2 text-gray-400">전투</span>
                <span className="col-span-2 font-bold">
                  Lv.{profileData?.CharacterLevel}
                </span>

                <span className="col-span-2 text-gray-400">원정대</span>
                <span className="col-span-2 font-bold">
                  Lv.{profileData?.ExpeditionLevel}
                </span>
              </div>
            </div>
          </div>

          {/* 오른쪽 정보 */}
          <div className="flex flex-col gap-4 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="w-9 text-gray-400">길드</div>
              <div className="font-bold text-emerald-400">
                {profileData?.GuildName || "-"}
              </div>

              <div className="text-gray-400">영지</div>
              <div className="font-bold">{profileData?.TownName || "-"}</div>

              <div className="text-gray-400">명예</div>
              <div className="font-bold">{profileData?.HonorPoint || "-"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-12 gap-3">
        {/* 왼쪽: 상세 정보 */}
        <div className="col-span-12 space-y-3 lg:col-span-8">
          {/* 장비 탭 */}
          {activeTab === "equipment" && (
            <>
              {/* 장비 */}
              <div className="design-card rounded-lg border border-white/10 p-0">
                <div className="border-b border-white/10 p-3">
                  <h3 className="text-base font-bold">장비</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3">
                  {/* 왼쪽 컬럼: 무기 및 방어구 (6개) */}
                  <div className="space-y-2">
                    {equipmentData
                      ?.filter((item: any) =>
                        [
                          "무기",
                          "투구",
                          "상의",
                          "하의",
                          "장갑",
                          "어깨",
                        ].includes(item.Type)
                      )
                      .sort((a: any, b: any) => {
                        const order = [
                          "투구",
                          "어깨",
                          "상의",
                          "하의",
                          "장갑",
                          "무기",
                        ];
                        return order.indexOf(a.Type) - order.indexOf(b.Type);
                      })
                      .map((item: any, idx: number) => {
                        const enhanceLevel =
                          item.Name?.match(/\+(\d+)/)?.[1] || "";
                        const style = getGradeStyles(item.Grade);

                        return (
                          /* h-[66px] 추가하여 높이 고정 */
                          <div
                            key={idx}
                            className="design-card flex h-[66px] gap-2 rounded border border-white/5 p-2 transition-colors hover:border-amber-500/30"
                          >
                            <div
                              className={`relative ${style.bg} h-12 w-12 flex-shrink-0 overflow-hidden rounded border ${style.border}`}
                            >
                              {item.Icon && (
                                <img
                                  src={item.Icon}
                                  alt={item.Name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                              <div className="absolute top-0 right-0 h-4 w-4 rounded bg-amber-600/90 text-center text-xs font-bold text-white">
                                T4
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400">
                                  {item.Type === "투구" ? "머리" : item.Type}
                                </p>
                                {item.tooltip?.Element_001?.value
                                  ?.qualityValue > 0 && (
                                  <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-xs">
                                    {
                                      item.tooltip.Element_001.value
                                        .qualityValue
                                    }
                                  </span>
                                )}
                              </div>
                              <p className="truncate font-bold">
                                {enhanceLevel && (
                                  <span
                                    className={`${style.text} mr-2 text-sm`}
                                  >
                                    +{enhanceLevel}
                                  </span>
                                )}
                                <span className={`text-sm ${style.text}`}>
                                  {item.Name?.replace(/\+\d+\s*/, "")}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* 오른쪽 컬럼: 악세서리 & 어빌리티 스톤 (6개) */}
                  <div className="space-y-2">
                    {/* 악세서리 5종 */}
                    {equipmentData
                      ?.filter((item: any) =>
                        ["목걸이", "귀걸이", "반지"].includes(item.Type)
                      )
                      .map((item: any, idx: number) => {
                        const style = getGradeStyles(item.Grade);
                        const accessoryStats = parseAccessoryOptions(
                          item.tooltip
                        );

                        return (
                          /* h-[66px] 추가하여 높이 고정 */
                          <div
                            key={idx}
                            className="design-card flex h-[66px] justify-between gap-2 rounded border border-white/5 p-2 transition-colors hover:border-amber-500/30"
                          >
                            <div className="flex min-w-0 flex-1 gap-2">
                              <div
                                className={`relative ${style.bg} h-12 w-12 flex-shrink-0 overflow-hidden rounded border ${style.border}`}
                              >
                                {item.Icon && (
                                  <img
                                    src={item.Icon}
                                    alt={item.Name}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                                <div className="absolute top-0 right-0 h-4 w-4 rounded bg-amber-600/90 text-center text-xs font-bold text-white">
                                  T4
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-gray-400">
                                    {item.Type}
                                  </p>
                                  {item.tooltip?.Element_001?.value
                                    ?.qualityValue > 0 && (
                                    <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-xs">
                                      {
                                        item.tooltip.Element_001.value
                                          .qualityValue
                                      }
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`truncate text-sm font-bold ${style.text}`}
                                >
                                  {item.Name}
                                </p>
                              </div>
                            </div>

                            {/* 옵션 영역 */}
                            {accessoryStats.length > 0 && (
                              <div className="flex flex-shrink-0 flex-col items-end justify-center">
                                {accessoryStats.map((stat, statIdx) => (
                                  <span
                                    key={statIdx}
                                    className={`rounded px-1.5 py-0.5 text-xs font-semibold ${stat.tierColor} bg-gray-800/50`}
                                  >
                                    [{stat.tier}] {stat.name} {stat.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* 어빌리티 스톤 1종 (위치상 마지막 6번째 항목) */}
                    {equipmentData
                      ?.filter((item: any) => item.Type === "어빌리티 스톤")
                      .map((item: any, idx: number) => {
                        const style = getGradeStyles(item.Grade);
                        const effectsObj =
                          item.tooltip?.Element_007?.value?.Element_000
                            ?.contentStr || {};
                        const inscriptions = Object.values(effectsObj)
                          .map((effect: any) => {
                            const match = effect.contentStr.match(
                              /\[(.+?)\]\s*Lv\.(\d+)/
                            );
                            if (!match) return null;
                            return {
                              name: match[1],
                              level: parseInt(match[2]),
                              isDebuff: match[1].includes("감소"),
                            };
                          })
                          .filter(Boolean);

                        return (
                          /* h-[66px] 추가하여 높이 고정 */
                          <div
                            key={idx}
                            className="design-card flex h-[66px] justify-between gap-2 rounded border border-white/5 p-2 transition-colors hover:border-amber-500/30"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`relative h-11 w-11 flex-shrink-0 overflow-hidden rounded border ${style.bg} ${style.border} p-0.5 shadow-lg`}
                              >
                                <img
                                  src={item.Icon}
                                  className="h-full w-full rounded-sm object-cover"
                                  alt=""
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="mb-1 text-xs leading-none font-bold tracking-wider text-gray-500 uppercase">
                                  스톤
                                </p>
                                <p
                                  className={`truncate text-[13px] font-bold ${style.text} leading-tight`}
                                >
                                  {item.Name}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col justify-center gap-0.5">
                              {inscriptions.map((ins: any, iIdx: number) => (
                                <div
                                  key={iIdx}
                                  className="flex items-center justify-end gap-2 text-[11px]"
                                >
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${ins.isDebuff ? "bg-red-500" : "bg-blue-400"}`}
                                    />
                                    <span
                                      className={`text-xs ${ins.isDebuff ? "text-red-400" : "text-slate-300"}`}
                                    >
                                      {ins.name.substring(0, 2)}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs font-black ${ins.isDebuff ? "text-red-500" : "text-blue-400"}`}
                                  >
                                    Lv.{ins.level}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 팔찌 (하단 전체) */}
                {equipmentData
                  ?.filter((item: any) => item.Type === "팔찌")
                  .map((item: any, idx: number) => (
                    <div key={idx} className="border-t border-white/10 p-3">
                      <div className="flex gap-3">
                        <img src={item.Icon} className="h-12 w-12 rounded" />
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="text-xs text-gray-400">{item.Type}</p>
                            <p className="text-xs font-bold">{item.Name}</p>
                          </div>
                          <CharacterBracelet item={item} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/* 보석 */}
              <CharacterGems gemsData={gemsData} />

              {/* 각인 */}
              <div className="design-card rounded-lg border border-white/10 p-0">
                <div className="border-b border-white/10 p-3">
                  <h3 className="font-bold">각인</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 p-3">
                  {[
                    { name: "마나의 흐름", level: 4 },
                    { name: "구슬동자", level: 2 },
                    { name: "중갑 착용", level: 4 },
                    { name: "각성", level: 1 },
                  ].map((eng, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/5 p-2"
                    >
                      <span className="font-bold">{eng.name}</span>
                      <span className="font-bold text-emerald-400">
                        Lv.{eng.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 아바타 탭 */}
          {activeTab === "avatar" && (
            <div className="rounded-lg border border-white/10 p-12 text-center">
              <p className="text-gray-500">아바타 정보</p>
            </div>
          )}

          {/* 스킬 탭 */}
          {activeTab === "skill" && (
            <div className="rounded-lg border border-white/10 p-12 text-center">
              <p className="text-gray-500">스킬 정보</p>
            </div>
          )}

          {/* 히스토리 탭 */}
          {activeTab === "history" && (
            <div className="rounded-lg border border-white/10 p-12 text-center">
              <p className="text-gray-500">히스토리 정보</p>
            </div>
          )}

          {/* 수집형 포인트 탭 */}
          {activeTab === "collectible" && (
            <div className="rounded-lg border border-white/10">
              <div className="border-b border-white/10 p-3">
                <h3 className="font-bold">수집형 포인트</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3">
                {[
                  {
                    name: "모코코 씨앗",
                    value: "1234",
                    max: "1485",
                    icon: "🌿",
                  },
                  { name: "섬의 마음", value: "14", max: "30", icon: "💚" },
                  { name: "거인의 심장", value: "10", max: "15", icon: "❤️" },
                  {
                    name: "오르페우스의 별",
                    value: "10",
                    max: "10",
                    icon: "⭐",
                  },
                  { name: "위대한 미술품", value: "8", max: "9", icon: "🎨" },
                  { name: "세계수의 잎", value: "7", max: "7", icon: "🍃" },
                ].map((col, idx) => (
                  <div key={idx} className="rounded border border-white/10 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-2xl">{col.icon}</span>
                      <p className="text-sm font-bold">{col.name}</p>
                    </div>
                    <p className="text-right">
                      <span className="font-bold text-emerald-400">
                        {col.value}
                      </span>
                      <span className="text-gray-500"> / {col.max}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 보유 캐릭터 탭 */}
          {activeTab === "characters" && (
            <div className="rounded-lg border border-white/10 p-12 text-center">
              <p className="text-gray-500">보유 캐릭터 정보</p>
            </div>
          )}

          {/* 길드 탭 */}
          {activeTab === "guild" && (
            <div className="rounded-lg border border-white/10 p-12 text-center">
              <p className="text-gray-500">길드 정보</p>
            </div>
          )}
        </div>

        {/* 오른쪽: 특성 & 카드 */}
        <div className="col-span-12 space-y-3 p-0 lg:col-span-4">
          {/* 전투 특성 */}
          <div className="design-card rounded-lg border border-white/10 p-0">
            <div className="border-b border-white/10 p-3">
              <h3 className="text-sm font-bold">전투 특성</h3>
            </div>
            <div className="space-y-2 p-3">
              {profileData?.Stats.map((stat: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-emerald-400">{stat.Type}</span>
                  <div className="text-right">
                    <span className="mr-2 flex items-center gap-1 font-bold">
                      {topValues[2] === Number(stat.Value) && (
                        <Crown className="h-3.5 w-3.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                      )}

                      {topValues[3] === Number(stat.Value) && (
                        <Flame className="h-3.5 w-3.5 text-violet-400 drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]" />
                      )}

                      <span
                        className={
                          topValues[2] === Number(stat.Value)
                            ? "text-emerald-400"
                            : topValues[3] === Number(stat.Value)
                              ? "text-violet-400"
                              : ""
                        }
                      >
                        {stat.Value}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 카드 세트 */}

          <CharacterCards engravingsCard={engravingsCard} />

          {/* 수집형 포인트 */}
          <div className="design-card rounded-lg border border-white/10 p-0">
            <div className="border-b border-white/10 p-3">
              <h3 className="text-sm font-bold">수집형 포인트</h3>
            </div>
            <div className="space-y-2 p-3">
              {[
                { name: "모코코 씨앗", value: "1234", max: "1485" },
                { name: "섬의 마음", value: "14", max: "30" },
                { name: "거인의 심장", value: "10", max: "15" },
                { name: "오르페우스의 별", value: "10", max: "10" },
              ].map((col, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-500">{col.name}</span>
                  <span className="font-bold">
                    {col.value} / {col.max}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
