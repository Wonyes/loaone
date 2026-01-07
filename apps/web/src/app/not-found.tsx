import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
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

        <div className="flex justify-center gap-4">
          <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <span className="relative flex items-center gap-2">
              <Home className="h-5 w-5" />
              홈으로 돌아가기
            </span>
          </button>

          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
            <RefreshCw className="h-5 w-5" />
            새로고침
          </button>
        </div>

        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute right-20 bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>
    </div>
  );
}
