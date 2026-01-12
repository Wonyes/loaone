import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <h1 className="bg-gradient-to-b from-amber-400 to-amber-600 bg-clip-text text-[180px] leading-none font-black text-transparent">
            404
          </h1>
          <div className="absolute inset-0 opacity-30 blur-3xl">
            <h1 className="text-[180px] leading-none font-black text-amber-500">
              404
            </h1>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative">
            <AlertTriangle
              className="h-20 w-20 text-amber-500"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 opacity-50 blur-xl">
              <AlertTriangle className="h-20 w-20 text-amber-500" />
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-white">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mx-auto mb-8 max-w-md text-lg text-gray-400">
          요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => (window.location.href = "/")}
            className="group relative overflow-hidden rounded-lg border-t-2 border-emerald-400/50 bg-gradient-to-b from-emerald-500 to-emerald-700 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <span className="relative flex items-center gap-2 drop-shadow-lg">
              <Home className="h-5 w-5" />
              마을로 귀환
            </span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 rounded-lg border-t-2 border-slate-500/50 bg-gradient-to-b from-slate-700 to-slate-800 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-slate-600 hover:to-slate-700"
          >
            <RefreshCw className="h-5 w-5" />
            다시 시도
          </button>
        </div>

        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute right-20 bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>
    </div>
  );
}
