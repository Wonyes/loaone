"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sword, Shield, Sparkles, Star } from "lucide-react";

export function LostArkDesign() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const gradeColors = {
    legendary: "from-amber-500 to-orange-600",
    epic: "from-purple-500 to-violet-600",
    rare: "from-blue-500 to-cyan-600",
    uncommon: "from-green-500 to-emerald-600",
    common: "from-gray-400 to-slate-500",
  };

  return (
    <div className="">
      <div className="mx-auto mb-12 max-w-7xl pt-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-amber-400" />
              <h1 className="text-4xl font-bold tracking-tight text-white">
                로스트아크 디자인 시스템
              </h1>
            </div>
            <p className="text-lg font-medium text-slate-300">
              가독성을 강화한 High-Contrast 다크 테마
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10">
        <Card className="border border-white/10 bg-slate-900 shadow-xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <span className="inline-block h-8 w-2 rounded-sm bg-amber-500"></span>
              아이템 등급 색상
            </CardTitle>
            <CardDescription className="text-slate-400">
              게임 내 아이템 등급 식별을 위한 색상 팔레트
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
              {Object.entries(gradeColors).map(([grade, colors]) => (
                <div key={grade} className="group cursor-pointer">
                  <div
                    className={`h-24 rounded-xl bg-gradient-to-br ${colors} shadow-lg ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105`}
                  ></div>
                  <p className="mt-3 text-center text-sm font-semibold text-slate-200 capitalize transition-colors group-hover:text-amber-400">
                    {grade}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Character Cards */}
        <Card className="border border-white/10 bg-slate-900 shadow-xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <span className="inline-block h-8 w-2 rounded-sm bg-blue-500"></span>
              캐릭터 카드
            </CardTitle>
            <CardDescription className="text-slate-400">
              정보의 계층 구조를 명확하게 표현한 카드 디자인
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "버서커",
                  level: "1620",
                  class: "warrior",
                  grade: "legendary",
                },
                {
                  name: "소서리스",
                  level: "1600",
                  class: "mage",
                  grade: "epic",
                },
                {
                  name: "블레이드",
                  level: "1580",
                  class: "assassin",
                  grade: "rare",
                },
              ].map((char, idx) => (
                <div
                  key={idx}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${
                      gradeColors[char.grade as keyof typeof gradeColors]
                    } rounded-xl opacity-20 blur transition duration-500 group-hover:opacity-100`}
                  ></div>

                  {/* Card Body: 배경을 불투명하게(slate-950) 처리하여 글자 가독성 확보 */}
                  <div className="relative flex h-full flex-col justify-between rounded-xl border border-white/10 bg-slate-950 p-6 transition-all duration-300 group-hover:border-white/30">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-2xl font-bold tracking-tight text-white">
                          {char.name}
                        </h3>
                        <Badge
                          className={`bg-gradient-to-r ${
                            gradeColors[char.grade as keyof typeof gradeColors]
                          } border-0 px-3 py-1 font-bold text-white`}
                        >
                          Lv. {char.level}
                        </Badge>
                      </div>
                      <div className="mb-6 flex items-center gap-2 font-medium text-slate-400">
                        <Sword className="h-4 w-4" />
                        <span className="text-sm tracking-wide capitalize">
                          {char.class}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>HP</span>
                        <span>75%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            gradeColors[char.grade as keyof typeof gradeColors]
                          } rounded-full`}
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Card className="border border-white/10 bg-slate-900 shadow-xl">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <span className="inline-block h-8 w-2 rounded-sm bg-green-500"></span>
              주요 스탯
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  label: "원정대 레벨",
                  value: "180",
                  icon: Star,
                  color: "text-yellow-400",
                },
                {
                  label: "보유 골드",
                  value: "1,234,567",
                  icon: Sparkles,
                  color: "text-amber-400",
                },
                {
                  label: "최고 아이템",
                  value: "1,625",
                  icon: Sword,
                  color: "text-red-400",
                },
                {
                  label: "영지 레벨",
                  value: "75",
                  icon: Shield,
                  color: "text-blue-400",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  // [변경 4] 스탯 카드를 단순화하고 숫자를 크게 키움
                  className="group rounded-xl border border-white/5 bg-slate-950/50 p-5 transition-all hover:border-white/20"
                >
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    {stat.label}
                  </div>
                  <p className="origin-left text-3xl font-bold tracking-tight text-white transition-transform group-hover:scale-105">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
