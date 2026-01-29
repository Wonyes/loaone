<div align="center">

# 🎮 로아원 (LoaOne)

### 로스트아크 유저를 위한 종합 정보 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://loaone.vercel.app)

<br />

[**🌐 라이브 데모**](https://loaone.vercel.app) · [**🐛 이슈 리포트**](https://github.com/dnjsalsgh/loaone/issues)

</div>

---

## 📌 프로젝트 소개

**로아원**은 로스트아크 공식 API와 Supabase를 활용한 **풀스택 웹 애플리케이션**입니다.

단순한 정보 조회를 넘어, **실시간 데이터 동기화**, **사용자 인증**, **개인화된 즐겨찾기 시스템**까지 구현하여 실제 서비스 수준의 사용자 경험을 제공합니다.

### 🎯 프로젝트 목표

- 로스트아크 공식 API의 복잡한 데이터 구조를 **직관적인 UI로 시각화**
- Supabase를 활용한 **서버리스 백엔드 아키텍처** 구축
- React 19 + Next.js 16의 **최신 기능 적극 활용** (React Compiler, Turbopack)
- **성능 최적화**를 통한 빠른 로딩 속도와 부드러운 사용자 경험
- Next.js, Tailwind.css 적응

---

## ✨ 주요 기능

### 1️⃣ 캐릭터 통합 검색 시스템

<table>
<tr>
<td width="60%">

**실시간 캐릭터 정보 조회**

- 장비, 악세서리, 보석, 카드 등 **9가지 카테고리** 정보 통합 제공
- **Ark Passive(직업각인)** 정보 시각화
- 복잡한 툴팁 데이터를 **파싱하여 시각화**
- 동일 계정 내 **모든 캐릭터 자동 연동**

**기술적 구현**

- 로스트아크 API 응답의 HTML 태그 & 중첩 JSON을 **재귀적으로 정제**
- React Query의 `staleTime` 설정으로 **불필요한 API 호출 최소화**
- 탭 기반 UI로 대량의 정보를 **점진적 로딩**

</td>
<td width="40%">

```typescript
// 데이터 정제 로직 예시
const cleanLostArkData = (data: unknown) => {
  if (typeof data === "string") {
    // HTML 태그 제거
    let cleaned = data.replace(/<[^>]*>/g, "");
    // 중첩 JSON 파싱
    if (cleaned.startsWith("{")) {
      return JSON.parse(cleaned);
    }
    return cleaned;
  }
  // 재귀적 처리...
};
```

</td>
</tr>
</table>

### 2️⃣ 캐릭터 랭킹 시스템 (신규)

<table>
<tr>
<td width="60%">

**서버 전체 캐릭터 랭킹**

- **포디움 디스플레이**로 상위 3명 시각적 강조
- 서버별 필터링 (루페온, 실리안, 아만 등 **9개 서버**)
- 직업별 필터링 (**25개 직업** 지원)
- 페이지네이션으로 점진적 로드

**기술적 구현**

- Supabase `character_rankings` 테이블에 데이터 저장
- 아이템 레벨 기준 **내림차순 정렬**
- 클라이언트 사이드 필터링으로 빠른 반응

</td>
<td width="40%">

```typescript
// 랭킹 데이터 조회
export async function getRankings(limit = 100) {
  const { data } = await supabase
    .from("character_rankings")
    .select("*")
    .order("item_level", { ascending: false })
    .limit(limit);
  return data;
}
```

</td>
</tr>
</table>

### 3️⃣ 아이템 레벨 히스토리 추적

<table>
<tr>
<td width="60%">

**캐릭터 성장 기록 시각화**

- 7일 / 30일 / 90일 / 전체 기간별 **레벨 변화 그래프**
- **아이템 레벨 & 전투력** 추이 동시 표시
- Recharts를 활용한 **인터랙티브 차트**
- 성장 추이를 한눈에 파악

**기술적 구현**

- Supabase에 레벨 이력 **자동 저장**
- 기간별 데이터 **집계 쿼리 최적화**
- 반응형 차트로 모바일 환경 지원

</td>
<td width="40%">

```typescript
// React Query 캐싱 전략
const useCharacterHistory = (name: string) => {
  return useQuery({
    queryKey: ["history", name],
    queryFn: () => fetchHistory(name),
    staleTime: 5 * 60 * 1000, // 5분 캐싱
    gcTime: 30 * 60 * 1000, // 30분 유지
  });
};
```

</td>
</tr>
</table>

### 4️⃣ 인기 검색 & 즐겨찾기

<table>
<tr>
<td width="60%">

**인기 검색 캐릭터 (신규)**

- 실시간 **가장 많이 검색된 캐릭터** 표시
- 검색 로그 자동 수집 및 집계
- 트렌드 파악 가능

**즐겨찾기 시스템**

- Discord OAuth 2.0 소셜 로그인
- 사용자별 **즐겨찾기 캐릭터 관리**
- 어떤 기기에서든 **데이터 동기화**

**기술적 구현**

- Supabase Auth + RLS(Row Level Security)로 **데이터 보안**
- SSR 환경에서의 **세션 관리** (`@supabase/ssr`)
- Zustand로 클라이언트 **인증 상태 관리**

</td>
<td width="40%">

```typescript
// Supabase RLS 정책
-- 사용자는 자신의 즐겨찾기만 조회/수정 가능
CREATE POLICY "Users can manage own favorites"
ON favorites
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

</td>
</tr>
</table>

### 5️⃣ 컨닝페이퍼 (레이드 공략)

<table>
<tr>
<td width="60%">

**레이드 정보 허브**

- **카테고리별 분류**: 카제로스, 군단장, 어비스, 가디언
- 레이드별 **게이트 정보** 제공
- 검색 기능으로 빠른 공략 탐색
- 카테고리별 **색상 테마** 적용

</td>
<td width="40%">

```typescript
// 레이드 카테고리 필터
const categories = [
  { id: "kazeroth", label: "카제로스" },
  { id: "legion", label: "군단장" },
  { id: "abyss", label: "어비스" },
  { id: "guardian", label: "가디언" },
];
```

</td>
</tr>
</table>

### 6️⃣ 실시간 게임 스케줄 & 뉴스

<table>
<tr>
<td width="60%">

**자동 업데이트되는 게임 정보**

- 카오스게이트, 모험섬 등 **일일 스케줄**
- 공식 공지사항 & 이벤트 정보
- **로스트아크 공식 API** 활용
- 이벤트 슬라이더로 진행 중인 이벤트 표시

**기술적 구현**

- 로스트아크 Open API로 **실시간 데이터 조회**
- Next.js `revalidate` 설정으로 **5분마다 자동 갱신**
- 로딩 상태의 **Skeleton UI** 제공

</td>
<td width="40%">

```typescript
// 서버에서 공식 API 호출
async function fetchLostarkAPI(endpoint: string) {
  const response = await fetch(
    `${LOSTARK_API_BASE}${endpoint}`,
    {
      headers: {
        authorization: `bearer ${API_KEY}`,
      },
      next: { revalidate: 300 }, // 5분 캐시
    }
  );
  return response.json();
}
```

</td>
</tr>
</table>

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  Client                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Next.js   │  │   React     │  │  Zustand    │  │    React Query      │ │
│  │  App Router │  │ Components  │  │   Store     │  │  (Server State)     │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────┼─────────────────────┼───────────┘
          │                │                │                     │
          ▼                ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API Layer (Next.js)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ /api/lostark/*  │  │ /api/favorites  │  │     /api/lostark/news      │  │
│  │ 캐릭터 정보 조회  │  │  즐겨찾기 CRUD   │  │     뉴스/스케줄 API        │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────────────────┤  │
│  │ /api/rankings   │  │ /api/popular    │  │     /api/raids             │  │
│  │  캐릭터 랭킹     │  │  인기 검색어     │  │     레이드 정보 API        │  │
│  └────────┬────────┘  └────────┬────────┘  └─────────────┬───────────────┘  │
└───────────┼─────────────────────┼─────────────────────────┼─────────────────┘
            │                     │                         │
            ▼                     ▼                         ▼
┌───────────────────┐  ┌─────────────────────────────────────────────────────┐
│   Lost Ark API    │  │                    Supabase                         │
│  (공식 Open API)   │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│                   │  │  │ PostgreSQL  │  │    Auth     │  │  Storage    │ │
│ • 캐릭터 프로필    │  │  │   Database  │  │  (OAuth)    │  │  (Files)    │ │
│ • 장비/스킬 정보   │  │  ├─────────────┴──┴─────────────┴──┴─────────────┤ │
│ • 수집품 현황      │  │  │ Tables:                                       │ │
│ • Ark Passive     │  │  │ • character_rankings (랭킹)                   │ │
│                   │  │  │ • level_history (히스토리)                     │ │
│                   │  │  │ • favorite_characters (즐겨찾기)              │ │
│                   │  │  │ • search_logs (검색 로그)                     │ │
│                   │  │  │ • raids (레이드 정보)                         │ │
└───────────────────┘  │  └───────────────────────────────────────────────┘ │
                       └─────────────────────────────────────────────────────┘
```

---

## 🛠️ 기술 스택 & 선택 이유

### Frontend

| 기술             | 버전 | 선택 이유                                                                                  |
| :--------------- | :--: | :----------------------------------------------------------------------------------------- |
| **Next.js**      | 16.1 | App Router의 서버 컴포넌트로 **초기 로딩 속도 개선**, ISR로 정적/동적 렌더링 유연하게 활용 |
| **React**        | 19.2 | React Compiler로 **자동 메모이제이션**, 수동 최적화 코드 감소                              |
| **TypeScript**   |  5   | API 응답 타입 정의로 **런타임 에러 사전 방지**, 복잡한 데이터 구조 안전하게 처리           |
| **Tailwind CSS** |  4   | 유틸리티 기반으로 **일관된 디자인 시스템** 구축, 번들 사이즈 최소화                        |

### 상태 관리

| 기술            | 선택 이유                                                                                   |
| :-------------- | :------------------------------------------------------------------------------------------ |
| **React Query** | 서버 상태와 클라이언트 상태 분리, **자동 캐싱 & 백그라운드 리페치**로 항상 최신 데이터 유지 |
| **Zustand**     | Redux 대비 **보일러플레이트 90% 감소**, 번들 사이즈 2KB로 경량화                            |

### Backend & Database

| 기술              | 선택 이유                                                                  |
| :---------------- | :------------------------------------------------------------------------- |
| **Supabase**      | PostgreSQL 기반으로 **복잡한 쿼리 지원**, RLS로 별도 백엔드 없이 보안 처리 |
| **Supabase Auth** | OAuth 2.0 소셜 로그인 **10분 만에 구현**, 세션 관리 자동화                 |

### UI & UX

| 기술              | 선택 이유                                                              |
| :---------------- | :--------------------------------------------------------------------- |
| **Radix UI**      | **접근성(A11y) 기본 지원**, 헤드리스 컴포넌트로 커스텀 자유도 확보     |
| **Framer Motion** | 선언적 API로 **복잡한 애니메이션 간단 구현**, 레이아웃 애니메이션 지원 |
| **Recharts**      | React 친화적 API, **반응형 차트** 쉽게 구현                            |

---

## 🔧 기술적 도전과 해결

### 1. 로스트아크 API 데이터 정제

**문제**: API 응답에 HTML 태그가 포함되고, 툴팁 데이터가 문자열로 감싸진 JSON 형태

```json
// 실제 API 응답 예시
{
  "Tooltip": "{\"Element_000\":{\"type\":\"NameTagBox\",\"value\":\"<FONT COLOR='#FF0000'>무기</FONT>\"}}"
}
```

**해결**: 재귀적 데이터 정제 유틸리티 구현

```typescript
// src/lib/lostark-utils.ts
export const cleanLostArkData = <T>(data: T): T => {
  if (typeof data === "string") {
    // 1. HTML 태그 제거
    let cleaned = data.replace(/<[^>]*>/g, "");

    // 2. JSON 문자열이면 파싱
    if (cleaned.startsWith("{") || cleaned.startsWith("[")) {
      try {
        return cleanLostArkData(JSON.parse(cleaned));
      } catch {
        return cleaned as T;
      }
    }
    return cleaned as T;
  }

  if (Array.isArray(data)) {
    return data.map(cleanLostArkData) as T;
  }

  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, cleanLostArkData(v)])
    ) as T;
  }

  return data;
};
```

### 2. SSR + CSR 하이브리드 렌더링 (SEO 최적화)

**문제**: 완전 CSR은 검색엔진이 빈 HTML만 보고, 초기 로딩 시 흰 화면 발생

**목표**: SSR로 첫 진입 시 완성된 HTML 제공 → 이후 CSR로 부드러운 인터랙션

**해결**: 서버 컴포넌트에서 초기 데이터 fetch + React Query `initialData`로 hydration

```typescript
// app/page.tsx (서버 컴포넌트 - SSR)
import { getEvents, getNotices } from "@/lib/api/server";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  // 서버에서 데이터 fetch → HTML에 포함
  const [events, notices] = await Promise.all([getEvents(), getNotices()]);

  return <HomeClient initialEvents={events} initialNotices={notices} />;
}

// components/home/HomeClient.tsx (클라이언트 컴포넌트 - CSR)
"use client";

export default function HomeClient({ initialEvents, initialNotices }) {
  // initialData로 즉시 렌더링, 이후 백그라운드에서 갱신
  const { data: events } = useEvents(initialEvents);
  const { data: notices } = useNotices(initialNotices);
  // ...
}

// hooks/query/useNews.ts
export const useEvents = (initialData?: EventItem[]) =>
  useQuery({
    queryKey: ["lostark", "events"],
    queryFn: fetchEvents,
    initialData,  // SSR 데이터로 즉시 hydration
    staleTime: 5 * 60 * 1000,
  });
```

**결과**:

- 검색엔진이 완성된 HTML 크롤링 (SEO ✓)
- 첫 진입 시 즉시 콘텐츠 표시 (FCP 개선 ✓)
- 이후 인터랙션은 CSR로 빠른 반응 (UX ✓)

### 3. SSR 환경에서의 Supabase 인증

**문제**: 서버 컴포넌트에서 사용자 세션 접근 시 쿠키 처리 이슈

**해결**: `@supabase/ssr` 패키지로 서버/클라이언트 통합 세션 관리

```typescript
// src/lib/supabase/server/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServer = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: name => cookieStore.get(name)?.value,
        set: (name, value, options) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name, options) =>
          cookieStore.set({ name, value: "", ...options }),
      },
    }
  );
};
```

### 4. 대량 데이터의 효율적 렌더링

**문제**: 캐릭터 정보 페이지에서 장비, 스킬, 보석 등 대량 데이터 동시 로딩 시 성능 저하

**해결**: 탭 기반 지연 로딩 + React Query 프리페칭

```typescript
// 활성 탭 데이터만 로딩, 다음 탭 프리페칭
const CharacterPage = ({ name }: Props) => {
  const [activeTab, setActiveTab] = useState('equipment');
  const queryClient = useQueryClient();

  // 현재 탭 데이터
  const { data } = useCharacterData(name, activeTab);

  // 다음 탭 프리페칭
  useEffect(() => {
    const nextTab = getNextTab(activeTab);
    queryClient.prefetchQuery({
      queryKey: ['character', name, nextTab],
      queryFn: () => fetchCharacterData(name, nextTab),
    });
  }, [activeTab]);

  return <TabContent data={data} />;
};
```

### 5. 랭킹 시스템 구현

**문제**: 대량의 캐릭터 데이터를 효율적으로 정렬하고 필터링해야 함

**해결**: Supabase 인덱싱 + 클라이언트 사이드 필터링 조합

```typescript
// 서버: 인덱싱된 쿼리로 빠른 조회
export async function getRankings(limit = 100) {
  const { data } = await supabase
    .from("character_rankings")
    .select("*")
    .order("item_level", { ascending: false })
    .limit(limit);
  return data;
}

// 클라이언트: 서버/직업 필터링
const filteredRankings = rankings.filter((char) => {
  const serverMatch = !serverFilter || char.server === serverFilter;
  const classMatch = !classFilter || char.class === classFilter;
  return serverMatch && classMatch;
});
```

**결과**:
- 초기 로드 시 상위 100개 데이터만 가져와 성능 최적화
- 클라이언트 필터링으로 즉각적인 반응성 제공

---

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 홈 (이벤트, 스케줄, 즐겨찾기, 인기검색)
│   ├── characters/[name]/        # 캐릭터 상세 (동적 라우트)
│   ├── rankings/                 # 캐릭터 랭킹 페이지 (신규)
│   ├── cunning-paper/            # 레이드 정보 페이지
│   │   └── [id]/                 # 레이드 상세 페이지
│   ├── auth/callback/            # OAuth 콜백 처리
│   └── api/
│       ├── lostark/
│       │   ├── [name]/           # 캐릭터 API (프록시)
│       │   ├── news/             # 뉴스/이벤트 API
│       │   └── history/          # 레벨 히스토리 API
│       ├── favorites/            # 즐겨찾기 CRUD API
│       ├── rankings/             # 랭킹 API (신규)
│       ├── popular/              # 인기 검색어 API (신규)
│       └── raids/                # 레이드 정보 API
│
├── components/
│   ├── character/                # 캐릭터 관련 컴포넌트
│   │   ├── CharacterPage.tsx     # 탭 기반 캐릭터 상세
│   │   ├── CharacterHistory.tsx  # 레벨 추적 차트
│   │   ├── PopularSearchPage.tsx # 인기 검색 (신규)
│   │   ├── equipment/            # 장비 표시 컴포넌트
│   │   │   └── ArkPassiveIcon.tsx # Ark Passive 표시 (신규)
│   │   ├── skill/                # 스킬 표시 컴포넌트
│   │   ├── avatar/               # 아바타 표시 컴포넌트
│   │   └── favorite/             # 즐겨찾기 컴포넌트
│   ├── rankings/                 # 랭킹 페이지 컴포넌트 (신규)
│   │   └── RankingsPage.tsx      # 포디움 + 랭킹 리스트
│   ├── cunning-paper/            # 컨닝페이퍼 컴포넌트
│   │   └── RaidListClient.tsx    # 레이드 카테고리 필터
│   ├── home/                     # 홈페이지 섹션 컴포넌트
│   ├── news/                     # 뉴스/스케줄 컴포넌트
│   ├── common/                   # 공용 컴포넌트
│   │   ├── Header.tsx            # 네비게이션 헤더
│   │   └── LoginButton.tsx       # Auth 버튼
│   └── ui/                       # Shadcn UI 컴포넌트 (Radix 래퍼)
│
├── hooks/
│   ├── query/                    # React Query 커스텀 훅
│   │   └── lostark/
│   │       ├── character/        # 캐릭터 데이터 훅
│   │       ├── news/             # 뉴스 데이터 훅
│   │       └── usePopularSearches.ts # 인기 검색어 훅 (신규)
│   └── store/                    # Zustand 스토어
│       ├── useFavoriteStore.ts   # 즐겨찾기 상태
│       ├── useCharacterStore.ts  # 캐릭터 검색 상태
│       ├── useUserStore.ts       # 사용자 상태
│       └── useNoticeStore.ts     # 공지 상태
│
├── lib/
│   ├── api/
│   │   └── server.ts             # SSR용 서버 데이터 fetch 함수
│   ├── query/
│   │   └── getQueryClient.ts     # React Query 클라이언트 (SSR/CSR 공유)
│   ├── lostark/
│   │   ├── api.ts                # 로스트아크 API 호출
│   │   └── types.ts              # API 응답 타입 정의
│   ├── supabase/
│   │   ├── client/               # 클라이언트 Supabase
│   │   ├── server/               # 서버 Supabase
│   │   ├── rankings.ts           # 랭킹 DB 함수 (신규)
│   │   └── level-history.ts      # 레벨 히스토리 DB 함수
│   └── lostark-utils.ts          # 데이터 정제 유틸리티
│
├── utils/                        # 클라이언트 유틸리티
│   ├── lostarkUtils.ts           # 등급 스타일, 강화도 파싱
│   ├── accessoryParser.ts        # 악세서리 파싱
│   └── braceletParser.ts         # 팔찌 파싱
│
├── constants/                    # 상수 정의
│   └── lostark/
│       ├── styles.ts             # 등급별 스타일
│       └── option.ts             # 탭 옵션
│
└── types/                        # 전역 타입 정의
    ├── character.ts              # 캐릭터 관련 타입
    ├── lostark.ts                # API 응답 타입
    └── database.ts               # Supabase 테이블 타입
```

---

## 🚀 로컬 실행 방법

### 1. 저장소 클론 & 의존성 설치

```bash
git clone https://github.com/dnjsalsgh/loaone.git
cd loaone
npm install
```

### 2. 환경 변수 설정

```bash
# .env.local 파일 생성
cp .env.example .env.local
```

```env
# 로스트아크 API (https://developer-lostark.game.onstove.com/)
LOSTARK_API_KEY=your_api_key

# Supabase (https://supabase.com/)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Supabase 테이블 설정

```sql
-- 즐겨찾기 테이블
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, character_name)
);

-- RLS 정책
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
ON favorites FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

---

## 📜 스크립트

| 명령어          | 설명                              |
| :-------------- | :-------------------------------- |
| `npm run dev`   | 개발 서버 (Turbopack으로 빠른 HMR) |
| `npm run build` | 프로덕션 빌드 (타입 체크 포함)     |
| `npm run start` | 프로덕션 서버 실행                 |
| `npm run lint`  | ESLint 코드 검사                  |
| `npm run test`  | Jest 테스트 실행                  |


---

## 📄 라이선스

MIT License

---

<div align="center">

**Made with ❤️ for Lost Ark Users**

로스트아크 유저들의 편의를 위해 만들었습니다.

</div>
