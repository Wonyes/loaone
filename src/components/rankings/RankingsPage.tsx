"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/Card";
import { getClassIcon } from "@/utils/lostarkUtils";

interface RankingCharacter {
  id: string;
  character_name: string;
  server_name: string;
  class: string;
  item_level: string;
  combat_level: number | null;
  guild: string | null;
  updated_at: string;
  // 나중에 채울 필드들
  combat_power?: string;
  weapon?: string;
  weapon_level?: string;
  engraving?: string;
}

interface RankingsPageProps {
  initialRankings: RankingCharacter[];
}

const SERVERS = [
  "전체",
  "루페온",
  "실리안",
  "아만",
  "카마인",
  "카제로스",
  "카단",
  "아브렐슈드",
  "니나브",
];

const CLASS_GROUPS = [
  {
    name: "전사",
    classes: ["버서커", "디스트로이어", "워로드", "홀리나이트", "슬레이어"],
  },
  {
    name: "무도가",
    classes: [
      "스트라이커",
      "배틀마스터",
      "인파이터",
      "기공사",
      "창술사",
      "브레이커",
    ],
  },
  {
    name: "헌터",
    classes: ["데빌헌터", "블래스터", "호크아이", "스카우터", "건슬링어"],
  },
  {
    name: "마법사",
    classes: ["바드", "서머너", "아르카나", "소서리스"],
  },
  {
    name: "암살자",
    classes: ["블레이드", "데모닉", "리퍼", "소울이터"],
  },
  {
    name: "스페셜리스트",
    classes: ["도화가", "기상술사", "환수사"],
  },
  {
    name: "가디언나이트",
    classes: ["가디언나이트"],
  },
];

const CLASSES = ["전체", ...CLASS_GROUPS.flatMap(g => g.classes)];

export default function RankingsPage({ initialRankings }: RankingsPageProps) {
  const [selectedServer, setSelectedServer] = useState("전체");
  const [selectedClass, setSelectedClass] = useState("전체");
  const [showCount, setShowCount] = useState(20);

  const filteredRankings = initialRankings
    .filter(
      char => selectedServer === "전체" || char.server_name === selectedServer
    )
    .filter(char => selectedClass === "전체" || char.class === selectedClass);

  const displayedRankings = filteredRankings.slice(0, showCount);
  const hasMore = filteredRankings.length > showCount;

  const rawTop3 = filteredRankings.slice(0, 3);
  const podiumTop3 =
    rawTop3.length === 3 ? [rawTop3[1], rawTop3[0], rawTop3[2]] : rawTop3;

  return (
    <div className="mx-auto space-y-4">
      {podiumTop3.length > 0 && (
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          {podiumTop3.map((char, index) => {
            const actualRank =
              podiumTop3.length === 3
                ? index === 1
                  ? 1
                  : index === 0
                    ? 2
                    : 3
                : index + 1;
            return <TopRankCard key={char.id} char={char} rank={actualRank} />;
          })}
        </div>
      )}

      {/* 전체 랭킹 */}
      <Card
        title="All Rankings "
        className="overflow-visible"
        icon={<Trophy className="h-4 w-4 text-yellow-500" />}
        headerAction={
          <div className="flex gap-2">
            <FilterDropdown
              label="서버"
              options={SERVERS}
              value={selectedServer}
              onChange={setSelectedServer}
            />
            <FilterDropdown
              label="클래스"
              options={CLASSES}
              value={selectedClass}
              onChange={setSelectedClass}
            />
          </div>
        }
      >
        {/* 테이블 헤더 */}
        <div className="hidden border-b border-white/[0.05] px-6 py-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase lg:grid lg:grid-cols-[60px_1fr_100px_100px_100px_80px_140px_120px] lg:gap-3">
          <div className="text-center text-xs font-black text-white/60">
            순위
          </div>
          <div className="text-xs font-black text-white/60">캐릭터</div>
          <div className="text-center text-xs font-black text-white/60">
            아이템 레벨
          </div>
          <div className="text-center text-xs font-black text-white/60">
            전투력
          </div>
          <div className="text-center text-xs font-black text-white/60">
            클래스
          </div>
          <div className="text-center text-xs font-black text-white/60">
            서버
          </div>
          <div className="text-xs font-black text-white/60">장비</div>
          <div className="text-xs font-black text-white/60">각인</div>
        </div>

        {/* 랭킹 리스트 */}
        <div className="divide-y divide-white/[0.03]">
          {displayedRankings.map((char, index) => (
            <RankingRow key={char.id} char={char} rank={index + 1} />
          ))}
        </div>

        {/* 결과 없음 */}
        {displayedRankings.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">
            조건에 맞는 캐릭터가 없습니다
          </div>
        )}

        {/* 더보기 */}
        {hasMore && (
          <div className="border-t border-white/[0.05] p-4">
            <button
              onClick={() => setShowCount(prev => prev + 20)}
              className="w-full rounded-xl bg-white/[0.03] py-3 text-sm font-medium text-slate-400 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              더보기 ({filteredRankings.length - showCount}명 남음)
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

function TopRankCard({ char, rank }: { char: RankingCharacter; rank: number }) {
  const styles = {
    1: { accent: "bg-amber-400", text: "text-amber-400" },
    2: { accent: "bg-slate-300", text: "text-slate-300" },
    3: { accent: "bg-orange-600", text: "text-orange-600" },
  }[rank as 1 | 2 | 3];

  const isSupport = (engraving: string | undefined) => {
    if (!engraving) return false;
    const supportEngravings = ["절실한 구원", "만개", "축복의 오라", "해방자"];
    return supportEngravings.includes(engraving);
  };

  return (
    <Link
      href={`/characters/${char.character_name}`}
      className="group relative block"
    >
      <div
        className={cn(
          "overflow-hidden rounded-[2rem] rounded-xl border border-white/[0.1] border-white/[0.04] bg-white/[0.02] p-5 shadow-2xl transition-all duration-700",
          "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent hover:border-white/10 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
        )}
      >
        {/* 1. 레이저 라인 디테일 (상단 가느다란 엑센트) */}
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div
          className={cn("absolute top-0 left-5 h-[1.5px] w-8", styles.accent)}
        />

        {/* 2. 랭킹 넘버링 (정교한 폰트 위계) */}
        <div className="mb-8 flex items-baseline justify-between">
          <span className="font-mono text-[10px] font-medium tracking-[0.3em] text-slate-300">
            NO.0{rank}
          </span>
          <div className="mx-4 h-[1px] flex-1 bg-white/[0.3]" />
          <span
            className={cn(
              "text-[9px] font-black tracking-[0.2em] uppercase",
              styles.text
            )}
          >
            Elite
          </span>
        </div>

        {/* 3. 메인 정보 (압도적 가독성) */}
        <div className="mb-10 space-y-1.5">
          <h3 className="text-[18px] font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-400">
            {char.character_name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
              {char.class}
            </span>
            <span className="h-[2px] w-[2px] rounded-full bg-slate-800" />
            <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
              {char.server_name}
            </span>
          </div>
        </div>

        {/* 4. 아이템 레벨 (수치 중심의 정돈된 하단) */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Current Power
            </p>
            <p
              className={cn(
                "font-mono text-2xl font-light tracking-tighter text-red-400 tabular-nums",
                isSupport(char.engraving) ? "text-green-400" : "text-red-400"
              )}
            >
              {char.combat_level}
            </p>
          </div>

          {/* 하이엔드 디테일: 미세한 데이터 노이즈 아이콘 */}
          <div className="flex flex-col items-end gap-1 opacity-20">
            <div className="h-[1px] w-4 bg-white" />
            <div className="h-[1px] w-2 bg-white" />
          </div>
        </div>

        {/* 5. 호버 시 흐르는 광택 (선으로 표현) */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 -left-full h-full w-1/2 skew-x-[45deg] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent transition-all duration-1000 group-hover:left-[150%]" />
        </div>
      </div>
    </Link>
  );
}
function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.08] px-3 py-1.5 text-[11px] font-bold whitespace-nowrap text-white transition-all hover:bg-white/[0.15]"
      >
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-slate-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/70 lg:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <Card
            className={cn(
              "fixed top-1/2 left-1/2 z-[110] flex max-h-[80vh] w-[92vw] -translate-x-1/2 -translate-y-1/2 flex-col bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900",
              "lg:absolute lg:top-full lg:right-0 lg:left-auto lg:mt-2 lg:translate-x-0 lg:translate-y-0",
              label === "클래스" ? "max-w-lg lg:max-w-sm" : "max-w-xs"
            )}
            title={label}
            headerAction={
              label === "서버" ? null : (
                <button
                  type="button"
                  onClick={() => {
                    onChange("전체");
                    setIsOpen(false);
                  }}
                  className="rounded bg-indigo-600 px-3 py-1 text-[12px] font-black text-white"
                >
                  전체
                </button>
              )
            }
          >
            <div className="overflow- flex flex-col rounded-b-[2rem]">
              <div className="flex max-h-[400px] flex-col overflow-y-auto overscroll-contain p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
                {label === "클래스" ? (
                  <div className="flex flex-col gap-4">
                    {CLASS_GROUPS.map(group => (
                      <div key={group.name} className="space-y-1">
                        <p className="px-1 text-[14px] font-black text-slate-200">
                          {group.name}
                        </p>
                        <div className="grid grid-cols-4 gap-1 sm:grid-cols-5 md:grid-cols-6">
                          {group.classes.map(cls => (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => {
                                onChange(cls);
                                setIsOpen(false);
                              }}
                              className={cn(
                                "flex flex-col items-center gap-1.5 rounded-lg py-2 transition-all hover:bg-white/5",
                                value === cls && "bg-white/10"
                              )}
                            >
                              <img
                                src={getClassIcon(cls)}
                                alt={cls}
                                className={cn(
                                  "h-8 w-8 rounded-full border-2 border-transparent object-cover transition-all",
                                  value === cls
                                    ? "scale-110 border-indigo-500"
                                    : "opacity-70"
                                )}
                              />
                              <span
                                className={cn(
                                  "w-full truncate px-0.5 text-center text-[12px] font-bold",
                                  value === cls
                                    ? "text-indigo-400"
                                    : "text-slate-200"
                                )}
                              >
                                {cls}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {options.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onChange(opt);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "relative w-full overflow-hidden rounded-4xl px-4 py-3.5 text-center text-[14px] font-black transition-all active:scale-95",
                          value === opt
                            ? "text-white"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                        )}
                      >
                        {value === opt && (
                          <div className="pointer-events-none absolute inset-0 z-0 bg-white/5" />
                        )}
                        <span className="pointer-events-none relative z-10">
                          {opt}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function RankingRow({ char, rank }: { char: RankingCharacter; rank: number }) {
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank.toString().padStart(2, "0");
  };

  const getRankStyle = (rank: number) => {
    if (rank <= 3) return "text-lg";
    return "text-sm font-mono text-slate-400";
  };

  const isSupport = (engraving: string | undefined) => {
    if (!engraving) return false;
    const supportEngravings = ["절실한 구원", "만개", "축복의 오라", "해방자"];
    return supportEngravings.includes(engraving);
  };

  return (
    <Link
      href={`/characters/${char.character_name}`}
      className="group grid grid-cols-[32px_40px_1fr] items-center gap-2 px-4 py-3 transition-all hover:bg-white/[0.02] lg:grid-cols-[60px_1fr_100px_100px_100px_80px_140px_120px] lg:gap-3 lg:px-6 lg:py-4"
    >
      {/* 순위 */}
      <div className={cn("text-center", getRankStyle(rank))}>
        {getRankDisplay(rank)}
      </div>

      {/* 클래스 아이콘 (모바일) */}
      <div className="lg:hidden">
        <img
          src={getClassIcon(char.class)}
          alt={char.class}
          className="h-8 w-8 rounded-full border border-white/10 object-cover"
        />
      </div>

      {/* 캐릭터 정보 (모바일: 확장) */}
      <div className="flex flex-col gap-0.5 lg:hidden">
        <div className="flex items-center gap-1">
          <span className="truncate text-xs font-bold text-slate-200 transition-colors group-hover:text-indigo-400">
            {char.character_name}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-[11px] text-slate-300">{char.server_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-400">
            {char.item_level}
          </span>
          <span
            className={cn(
              "text-xs font-bold",
              isSupport(char.engraving) ? "text-green-400" : "text-red-400"
            )}
          >
            {char.combat_level || "-"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-200">{char.class}</span>
          {char.engraving && (
            <>
              <span className="text-slate-400">·</span>
              <span
                className={cn(
                  "text-[11px]",
                  isSupport(char.engraving)
                    ? "text-green-400"
                    : "text-slate-400"
                )}
              >
                {char.engraving}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 데스크탑: 캐릭터명 */}
      <div className="hidden lg:block">
        <span className="truncate text-sm font-bold text-slate-200 transition-colors group-hover:text-indigo-400">
          {char.character_name}
        </span>
      </div>

      {/* 데스크탑: 아이템 레벨 */}
      <div className="hidden text-center lg:block">
        <span className="font-mono text-sm font-black tracking-tight text-slate-200">
          {char.item_level}
        </span>
      </div>

      {/* 데스크탑: 전투력 */}
      <div
        className={cn(
          "hidden text-center font-mono text-sm font-bold lg:block",
          isSupport(char.engraving) ? "text-green-400" : "text-red-400"
        )}
      >
        {char.combat_level || "-"}
      </div>

      {/* 데스크탑: 직업 */}
      <div className="hidden text-center text-sm text-slate-200 lg:block">
        {char.class}
      </div>

      {/* 데스크탑: 서버 */}
      <div className="hidden text-center text-sm text-slate-200 lg:block">
        {char.server_name}
      </div>

      {/* 데스크탑: 장비 */}
      <div className="hidden flex-col gap-0.5 lg:flex">
        <span className="text-sm font-bold text-cyan-400">-</span>
        <span className="text-xs text-slate-200">-</span>
      </div>

      {/* 데스크탑: 각인 */}
      <div className="hidden items-center gap-2 lg:flex">
        <span
          className={cn(
            "truncate text-sm font-medium",
            isSupport(char.engraving) ? "text-green-400" : "text-slate-200"
          )}
        >
          {char.engraving}
        </span>
      </div>
    </Link>
  );
}
