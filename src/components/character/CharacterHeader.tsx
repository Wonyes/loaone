import { Award, Cross, Crown, Flame, MapPin, Shield } from "lucide-react";
import FavoriteButton from "./favorite/FavoriteButton";
import { Card } from "../common/Card";
import { cn } from "@/lib/utils";

export function CharacterHeader({
  name,
  profileData,
  mainPassiveName,
}: {
  name: string;
  profileData: any;
  mainPassiveName: string;
}) {
  const isSupport = (engraving: string | undefined) => {
    if (!engraving) return false;
    const supportEngravings = ["절실한 구원", "만개", "축복의 오라", "해방자"];
    return supportEngravings.includes(engraving);
  };
  return (
    <Card className="relative overflow-hidden rounded-[2rem] border-none bg-[#0c0d12] shadow-2xl">
      {profileData?.CharacterImage && (
        <div className="absolute inset-y-0 right-0 z-0 w-full overflow-hidden sm:w-[60%]">
          <img
            src={profileData.CharacterImage}
            alt={profileData.CharacterName}
            className="h-full w-full object-cover object-[50%_15%] opacity-80 mix-blend-lighten"
            style={{
              maskImage:
                "linear-gradient(to left, black 40%, transparent 95%), linear-gradient(to top, transparent 5%, black 40%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 40%, transparent 95%), linear-gradient(to top, transparent 5%, black 40%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.15),transparent_60%)]" />
        </div>
      )}

      <div className="absolute top-4 right-4 z-30">
        <FavoriteButton characterName={name} profileData={profileData} />
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-8 sm:p-12 xl:min-h-[350px]">
        <div className="max-w-2xl space-y-8">
          <div className="flex flex-wrap gap-2.5">
            <Badge className="bg-white/5 text-gray-400">
              {profileData?.ServerName}
            </Badge>
            <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-300 italic">
              {profileData?.CharacterClassName}
            </Badge>
            {mainPassiveName && (
              <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
                {mainPassiveName}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter text-white italic sm:text-5xl xl:text-6xl">
              {profileData?.CharacterName}
            </h1>
            <div className="flex flex-col gap-1 font-mono text-[13px] font-bold tracking-widest text-slate-300 uppercase">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                <span className="text-indigo-500">Level</span>
                <span className="ml-1 text-white">
                  Lv.{profileData?.CharacterLevel}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                <span className="text-amber-600">Expedition</span>
                <span className="ml-1 text-white">
                  Lv.{profileData?.ExpeditionLevel}
                </span>
              </div>
            </div>
          </div>

          {/*  핵심 스펙 카드 (아이템 레벨 / 전투력) */}
          <div className="flex flex-wrap gap-4">
            <StatChip
              icon={<Crown className="text-violet-400" />}
              label="Item Level"
              value={profileData?.ItemAvgLevel}
              color="violet"
              valueColor="text-violet-400"
            />
            <StatChip
              icon={
                isSupport(mainPassiveName) ? (
                  <Cross className="text-green-400" />
                ) : (
                  <Flame className="text-red-400" />
                )
              }
              label="Combat Power"
              value={profileData?.CombatPower?.toLocaleString()}
              color={isSupport(mainPassiveName) ? "green" : "red"}
              valueColor={
                isSupport(mainPassiveName) ? "text-green-400" : "text-red-400"
              }
            />
          </div>

          {/*  하단 상세 정보 위젯 */}
          <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
            <DetailBlock
              icon={<Shield size={13} />}
              title="GUILD"
              value={profileData?.GuildName}
              accent="text-emerald-500"
            />
            <DetailBlock
              icon={<MapPin size={13} />}
              title="TOWN"
              value={
                profileData?.TownName ? `Lv.${profileData.TownLevel}` : null
              }
            />
            <DetailBlock
              icon={<Award size={13} />}
              title="HONOR"
              value={profileData?.HonorPoint}
              accent="text-amber-500"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`rounded-lg border border-white/10 px-3 py-1 text-[11px] font-black tracking-tight uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function StatChip({ icon, label, value, color, valueColor }: any) {
  const colorMap: any = {
    emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20",
    violet: "text-violet-400 bg-violet-500/5 border-violet-500/20",
    red: "text-red-400 bg-red-500/5 border-red-500/20",
    green: "text-green-400 bg-green-500/5 border-green-500/20",
  };

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2 ${colorMap[color]}`}
    >
      <div className="opacity-70">{icon}</div>
      <div className="flex flex-col">
        <span className="mb-0.5 text-[12px] leading-none font-black tracking-widest opacity-40">
          {label}
        </span>
        <span
          className={cn(
            "font-mono text-[22px] leading-none font-black tracking-tighter",
            valueColor
          )}
        >
          {value || "0.00"}
        </span>
      </div>
    </div>
  );
}

function DetailBlock({ icon, title, value, accent }: any) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/[0.03] bg-white/[0.07] px-3 py-2 transition-all hover:bg-white/[0.04]">
      <div
        className={`shrink-0 opacity-30 transition-opacity group-hover:opacity-100 ${accent || "text-slate-400"}`}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="mb-1 text-[9px] leading-none font-black tracking-[0.2em] text-slate-300 uppercase">
          {title}
        </span>
        <span className="truncate text-[14px] leading-none font-bold text-slate-300">
          {value || "—"}
        </span>
      </div>
    </div>
  );
}
