"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Shield, Sparkles, TrendingUp, Star } from "lucide-react";
import { LoginButton } from "@/components/common/LoginButton";

const LostArkDesignSystem = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 로스트아크 등급별 색상
  const gradeColors = {
    legendary: "from-amber-500 to-orange-600",
    epic: "from-purple-500 to-violet-600",
    rare: "from-blue-500 to-cyan-600",
    uncommon: "from-green-500 to-emerald-600",
    common: "from-gray-500 to-slate-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-gray-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-amber-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            로스트아크 디자인 시스템
          </h1>
        </div>
        <p className="text-gray-400 text-lg">shadcn/ui 기반 커스텀 컴포넌트 라이브러리</p>
      </div>

      <LoginButton />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Color System */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-400">아이템 등급 색상 시스템</CardTitle>
            <CardDescription className="text-gray-400">
              게임 내 아이템 등급에 맞춘 그라데이션
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(gradeColors).map(([grade, colors]) => (
                <div
                  key={grade}
                  className="space-y-2"
                >
                  <div className={`h-24 rounded-lg bg-gradient-to-br ${colors} shadow-lg`}></div>
                  <p className="text-sm font-medium capitalize text-center">{grade}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-400">버튼 컴포넌트</CardTitle>
            <CardDescription className="text-gray-400">
              다양한 상황에 맞는 버튼 스타일
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/50">
                Primary Action
              </Button>
              <Button
                variant="outline"
                className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
              >
                Secondary
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-amber-400 hover:bg-slate-800"
              >
                Ghost
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-purple-500/50">
                Epic Action
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Character Cards */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-400">캐릭터 카드</CardTitle>
            <CardDescription className="text-gray-400">
              글래스모피즘 효과를 적용한 캐릭터 정보 카드
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "버서커", level: "1620", class: "warrior", grade: "legendary" },
                { name: "소서리스", level: "1600", class: "mage", grade: "epic" },
                { name: "블레이드", level: "1580", class: "assassin", grade: "rare" },
              ].map((char, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r  rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300`}
                  ></div>
                  <div className="relative bg-slate-900/80 backdrop-blur-md rounded-lg p-6 border border-slate-700/50 group-hover:border-slate-600/80 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{char.name}</h3>
                      <Badge className={`bg-gradient-to-r  border-0 text-white`}>
                        Lv. {char.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Sword className="w-4 h-4" />
                      <span className="text-sm capitalize">{char.class}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r  rounded-full`}
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

        {/* Badges & Stats */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-400">뱃지 & 스탯 표시</CardTitle>
            <CardDescription className="text-gray-400">
              다양한 정보를 표현하는 뱃지 컴포넌트
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-0">
                  <Star className="w-3 h-3 mr-1" />
                  전설 등급
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  영웅 등급
                </Badge>
                <Badge
                  variant="outline"
                  className="border-blue-500 text-blue-400"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  희귀 등급
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-400"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  고급 등급
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "원정대 레벨", value: "180", icon: Star },
                  { label: "보유 골드", value: "1,234,567", icon: Sparkles },
                  { label: "최고 아이템", value: "1625", icon: Sword },
                  { label: "영지 레벨", value: "75", icon: Shield },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Example */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-400">탭 내비게이션</CardTitle>
            <CardDescription className="text-gray-400">
              정보를 구조화하는 탭 컴포넌트
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="character"
              className="w-full"
            >
              <TabsList className="bg-slate-800/50 border border-slate-700">
                <TabsTrigger
                  value="character"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  캐릭터
                </TabsTrigger>
                <TabsTrigger
                  value="equipment"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  장비
                </TabsTrigger>
                <TabsTrigger
                  value="engrave"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                >
                  각인
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="character"
                className="mt-4 p-4 bg-slate-800/30 rounded-lg"
              >
                <p className="text-gray-300">캐릭터 정보가 여기에 표시됩니다.</p>
              </TabsContent>
              <TabsContent
                value="equipment"
                className="mt-4 p-4 bg-slate-800/30 rounded-lg"
              >
                <p className="text-gray-300">장비 정보가 여기에 표시됩니다.</p>
              </TabsContent>
              <TabsContent
                value="engrave"
                className="mt-4 p-4 bg-slate-800/30 rounded-lg"
              >
                <p className="text-gray-300">각인 정보가 여기에 표시됩니다.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-slate-900/30 border border-slate-800 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-amber-400 mb-2">커스터마이징 가이드</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          이 디자인 시스템은 shadcn/ui의 Tailwind 클래스를 활용합니다. 각 컴포넌트는 재사용
          가능하며, tailwind.config.js에서 색상과 테마를 전역으로 설정할 수 있습니다. 그라데이션,
          글래스모피즘, 그림자 효과를 조합하여 로스트아크의 판타지 분위기를 표현했습니다.
        </p>
      </div>
    </div>
  );
};

export default LostArkDesignSystem;
