<div align="center">

# 🎮 로아원 (LoaOne)

### 로스트아크 종합 정보 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://loaone.vercel.app)

<br />

[**🌐 사이트 바로가기**](https://loaone.vercel.app)

<br />

<img src="https://img.shields.io/badge/로스트아크-FF6A00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDEwLTV2LTVsLTEwIDUtMTAtNXoiLz48L3N2Zz4=&logoColor=white" alt="Lost Ark" />

</div>

---

## 📋 목차

- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [환경 변수](#-환경-변수)
- [스크립트](#-스크립트)

---

## 🎯 소개

**로아원(LoaOne)**은 로스트아크 유저들을 위한 종합 정보 플랫폼입니다.

캐릭터 정보 조회, 실시간 스케줄, 이벤트 정보, 공지사항 등 게임에 필요한 모든 정보를 한 곳에서 확인할 수 있습니다.

---

## ✨ 주요 기능

### 🔍 캐릭터 검색 & 조회

| 기능 | 설명 |
|:---:|:---|
| **장비 정보** | 착용 장비, 악세서리, 팔찌, 보석, 카드, 아크패시브 |
| **아바타** | 캐릭터 아바타 및 염색 정보 |
| **스킬** | 스킬 트라이포드, 룬 정보 |
| **레벨 이력** | 아이템 레벨 변화 그래프 |
| **수집품** | 모코코 씨앗, 섬의 마음 등 수집 진행도 |
| **캐릭터 목록** | 동일 계정 내 다른 캐릭터 조회 |

### 📅 실시간 스케줄

- 카오스게이트, 모험섬 등 일일 스케줄
- 이벤트 정보 슬라이더
- 공식 공지사항 & 패치노트

### ⭐ 즐겨찾기

- 캐릭터 즐겨찾기 등록/해제
- 계정 연동으로 어디서든 확인
- 홈에서 즐겨찾는 캐릭터 빠른 조회

### 📖 컨닝페이퍼

- 카제로스, 군단장, 어비스, 가디언 레이드 정보
- 검색 및 카테고리 필터링

---

## 🛠️ 기술 스택

<table>
<tr>
<td align="center" width="140">

**Frontend**

</td>
<td>

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)

</td>
</tr>
<tr>
<td align="center">

**상태 관리**

</td>
<td>

![Zustand](https://img.shields.io/badge/Zustand-433D3E?logo=react&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?logo=reactquery&logoColor=white)

</td>
</tr>
<tr>
<td align="center">

**Backend**

</td>
<td>

![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Lost Ark API](https://img.shields.io/badge/Lost%20Ark%20API-FF6A00?logoColor=white)

</td>
</tr>
<tr>
<td align="center">

**UI 라이브러리**

</td>
<td>

![Radix UI](https://img.shields.io/badge/Radix%20UI-161618?logo=radixui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?logo=framer&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?logoColor=white)

</td>
</tr>
<tr>
<td align="center">

**개발 도구**

</td>
<td>

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)

</td>
</tr>
</table>

---

## 📁 프로젝트 구조

```
loaone/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── page.tsx               # 홈 페이지
│   │   ├── layout.tsx             # 루트 레이아웃
│   │   ├── 📂 characters/[name]/  # 캐릭터 상세 페이지
│   │   ├── 📂 cunning-paper/      # 컨닝페이퍼 페이지
│   │   ├── 📂 auth/callback/      # 인증 콜백
│   │   └── 📂 api/                # API 라우트
│   │
│   ├── 📂 components/             # React 컴포넌트
│   │   ├── 📂 character/          # 캐릭터 관련
│   │   ├── 📂 home/               # 홈페이지
│   │   ├── 📂 news/               # 뉴스/스케줄
│   │   ├── 📂 common/             # 공용 컴포넌트
│   │   └── 📂 ui/                 # UI 컴포넌트
│   │
│   ├── 📂 hooks/                  # 커스텀 훅
│   │   ├── 📂 query/              # React Query 훅
│   │   └── 📂 store/              # Zustand 스토어
│   │
│   ├── 📂 lib/                    # 유틸리티 & API
│   ├── 📂 types/                  # TypeScript 타입
│   ├── 📂 constants/              # 상수
│   └── 📂 styles/                 # 스타일
│
├── 📂 public/                     # 정적 파일
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

---

## 🚀 시작하기

### 요구 사항

- Node.js 18.17 이상
- npm, yarn, pnpm, 또는 bun

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/loaone.git

# 디렉토리 이동
cd loaone

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

---

## 🔐 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# 로스트아크 API
LOSTARK_API_KEY=your_lostark_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 💡 로스트아크 API 키는 [로스트아크 개발자 포털](https://developer-lostark.game.onstove.com/)에서 발급받을 수 있습니다.

---

## 📜 스크립트

| 명령어 | 설명 |
|:---|:---|
| `npm run dev` | 개발 서버 실행 (Turbo 모드) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | Jest 테스트 실행 |

---

<div align="center">

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

<br />

**Made with ❤️ for 로스트아크 유저들**

<br />

![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fyour-username%2Floaone&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=방문자&edge_flat=false)

</div>
