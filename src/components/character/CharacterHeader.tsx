import { Gem, Sword } from "lucide-react";
import FavoriteButton from "./favorite/FavoriteButton";

export function CharacterHeader({ name ,profileData }: {name:string; profileData: any }) {
  console.log(profileData)
  return (
    <div className="design-card relative overflow-hidden rounded-xl bg-slate-900/50 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1230] via-[#0b0f1a] to-black" />

      {profileData?.CharacterImage && (
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

      <FavoriteButton
      characterName={name}
      profileData={profileData}
      />

      <div className="relative z-10 flex min-h-[200px] flex-col items-start justify-between gap-4 p-4 sm:min-h-[220px] xl:min-h-[240px] xl:flex-row xl:items-end xl:gap-6 xl:p-6">
        <div className="flex flex-col gap-3 xl:gap-6">
          {/* 레벨 & 전투력 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 xl:gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/20 p-2">
                <Gem className="h-4 w-4 text-emerald-400 xl:h-5 xl:w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 sm:text-sm">아이템 레벨</p>
                <p className="text-lg font-black text-emerald-400 sm:text-xl">
                  {profileData?.ItemAvgLevel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-500/20 p-2">
                <Sword className="h-4 w-4 text-violet-400 xl:h-5 xl:w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 sm:text-sm">전투력</p>
                <p className="text-lg font-black text-violet-400 sm:text-xl">
                  {profileData?.CombatPower?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 캐릭터 정보 */}
          <div>
            <div className="mb-2 flex flex-wrap gap-2 xl:mb-3">
              <span className="rounded-lg bg-slate-800/80 px-2 py-1 text-xs font-semibold text-gray-300 sm:px-3 sm:py-1.5 sm:text-sm">
                {profileData?.ServerName}
              </span>
              <span className="rounded-lg bg-slate-800/80 px-2 py-1 text-xs font-semibold text-gray-300 sm:px-3 sm:py-1.5 sm:text-sm">
                {profileData?.CharacterClassName}
              </span>
            </div>

            <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl xl:mb-3 xl:text-4xl">
              {profileData?.CharacterName}
            </h1>

            <div className="flex flex-wrap gap-3 text-xs sm:gap-4 sm:text-sm xl:gap-6">
              <div>
                <span className="text-gray-400">전투 </span>
                <span className="font-bold text-white">
                  Lv.{profileData?.CharacterLevel}
                </span>
              </div>
              <div>
                <span className="text-gray-400">원정대 </span>
                <span className="font-bold text-white">
                  Lv.{profileData?.ExpeditionLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 길드/영지 정보 */}
        <div className="flex flex-col gap-1.5 text-xs sm:gap-2 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">길드</span>
            <span className="font-bold text-emerald-400">
              {profileData?.GuildName || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">영지</span>
            <span className="font-semibold text-white">
              {profileData?.TownName || "-"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">명예</span>
            <span className="font-semibold text-white">
              {profileData?.HonorPoint || "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
