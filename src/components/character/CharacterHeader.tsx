import { Award, Gem, MapPin, Shield, Sword } from "lucide-react";
import FavoriteButton from "./favorite/FavoriteButton";
import { Card } from "../common/Card";

export function CharacterHeader({
  name,
  profileData,
  mainPassiveName,
}: {
  name: string;
  profileData: any;
  mainPassiveName: string;
}) {
  return (
    <Card className="relative overflow-hidden rounded-xl bg-slate-900/50">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />

      {profileData === null
        ? undefined
        : profileData?.CharacterImage && (
            <img
              src={profileData.CharacterImage}
              alt={profileData.CharacterName}
              className="pointer-events-none absolute top-[5px] left-1/2 h-[400px] w-[280px] -translate-x-1/2 scale-[1.2] object-cover object-[50%_15%] mix-blend-lighten drop-shadow-[0_0_80px_rgba(168,85,247,0.55)] sm:h-[480px] sm:w-[320px] xl:h-[520px] xl:w-[360px] xl:scale-[1.3]"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent, black 30% 80%, transparent), linear-gradient(to top, transparent 5%, black 55%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, black 30% 80%, transparent), linear-gradient(to top, transparent 5%, black 55%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
            />
          )}

      <FavoriteButton characterName={name} profileData={profileData} />

      <div className="relative z-10 flex min-h-[260px] items-end justify-between gap-4 p-6 sm:p-8 xl:min-h-[280px] xl:flex-row xl:items-end xl:p-10">
        <div className="flex flex-col gap-4 xl:gap-4">
          <div className="flex flex-col gap-3 sm:gap-3">
            <Card className="group relative flex w-fit items-center gap-3 border border-emerald-500/20 bg-emerald-500/10 p-2 pr-4 shadow-lg transition-all hover:border-emerald-500/40 hover:bg-emerald-500/20">
              <div className="rounded-xl bg-emerald-500/20 p-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Gem className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[0.1em] text-emerald-500/70 uppercase">
                  Item Level
                </p>
                <p className="text-lg leading-none font-black tracking-tighter text-emerald-400">
                  {profileData?.ItemAvgLevel}
                </p>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </Card>

            <Card className="group relative flex w-fit items-center gap-3 border border-violet-500/20 bg-violet-500/10 p-2 pr-4 shadow-lg transition-all hover:border-violet-500/40 hover:bg-violet-500/20">
              <div className="rounded-xl bg-violet-500/20 p-2 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Sword className="h-4 w-4 text-violet-400 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[0.1em] text-violet-500/70 uppercase">
                  Combat Power
                </p>
                <p className="text-lg leading-none font-black tracking-tighter text-violet-400">
                  {profileData?.CombatPower?.toLocaleString()}
                </p>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </Card>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-gray-300">
                {profileData?.ServerName}
              </span>
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-300 italic">
                {profileData?.CharacterClassName}
              </span>
              {mainPassiveName && (
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                  {mainPassiveName}
                </span>
              )}
            </div>

            <h1 className="mb-3 text-4xl font-black tracking-tighter text-white italic drop-shadow-2xl sm:text-4xl xl:text-6xl">
              {profileData?.CharacterName}
            </h1>

            <div className="flex items-center gap-6 text-xs font-bold sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="tracking-tighter text-gray-500 uppercase">
                  Combat
                </span>
                <span className="text-white">
                  Lv.{profileData?.CharacterLevel}
                </span>
              </div>
              <div className="h-3 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="tracking-tighter text-gray-500 uppercase">
                  Expedition
                </span>
                <span className="text-white">
                  Lv.{profileData?.ExpeditionLevel}
                </span>
              </div>
            </div>
          </div>

          <Card className="flex min-w-[180px] flex-col gap-3 rounded-2xl border border-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Shield size={14} className="text-emerald-500/50" />
                <span className="text-[11px] font-bold tracking-tighter uppercase">
                  Guild
                </span>
              </div>
              <span className="text-sm font-black text-emerald-400">
                {profileData?.GuildName || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={14} className="text-gray-500/50" />
                <span className="text-[11px] font-bold tracking-tighter uppercase">
                  Town
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {profileData?.TownName || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Award size={14} className="text-gray-500/50" />
                <span className="text-[11px] font-bold tracking-tighter uppercase">
                  Honor
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {profileData?.HonorPoint || "-"}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
}
