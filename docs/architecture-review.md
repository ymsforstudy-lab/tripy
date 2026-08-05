# Tripy 아키텍처 리뷰 (2026-07-08)

## 1. 현황 요약

- 규모: TS/TSX 약 5,100줄, 페이지 22개, UI 컴포넌트 30개
- 실제 스택: **Next.js 16.1.6 / React 19 / Tailwind v4(CSS-first) / Supabase / Vercel**
- CLAUDE.md 문서와 실제 코드가 어긋남 (Next 14 표기, tailwind.config.ts 없음 — 실제로는 globals.css 변수, lib/types.ts 없음)

### 현재 파일트리

```
app/
├── page.tsx                      # 스플래시
├── nickname/                     # 닉네임 설정
├── setup/                        # 여행 설정 (country/region/date/confirm)
├── auth/                         # callback, session-sync
├── home/                         # 홈
├── expense/                      # 지출 등록 (374줄, 최대 파일)
├── budget/                       # 예산 설정
├── travels/                      # 여행 관리 + [id]/edit
├── mypage/                       # 마이페이지 (profile/settings/delete-account)
├── preview/                      # ⚠️ 컴포넌트 미리보기 페이지 (배포에 포함됨)
└── error/
components/ui/                    # 30개 컴포넌트 전부 한 폴더
contexts/                         # AuthContext, TripContext
lib/
├── supabase.ts / supabase-server.ts / site-url.ts
└── constants/                    # categories, countries, currency
supabase/migrations/              # RLS 정책 1개뿐 (테이블 스키마 없음)
```

## 2. 핵심 문제 4가지

### ① 데이터 레이어 부재 — 가장 큰 확장성 리스크
`supabase.from()` 호출이 **14개 파일에 25회** 흩어져 있음. 테이블 컬럼이 바뀌면 페이지를 전부 수정해야 하고, 같은 쿼리(활성 여행 조회 등)가 여러 곳에 중복됨.

### ② 타입 중복
`Trip` 타입이 home/page.tsx, travels/page.tsx, TripContext.tsx에 **각각 따로 정의**. 서로 미묘하게 달라질 위험. `Expense`, `CheckStatus`도 중복.

### ③ 페이지 전부 클라이언트 컴포넌트
22개 페이지 전체가 `'use client'` + useEffect fetch 패턴. 초기 로딩 느리고, 로딩/에러 처리 코드가 페이지마다 반복됨. expense/page.tsx는 374줄로 UI+로직+fetch가 한 파일에.

### ④ 운영 기반 미비
- 마이그레이션에 RLS만 있고 테이블 스키마가 없음 → 새 팀원이 DB를 재현할 수 없음
- 컬러 하드코딩 19곳 (토큰 규칙 위반)
- `tsconfig.tsbuildinfo`가 git에 커밋됨
- preview/ 페이지가 프로덕션 배포에 포함
- 테스트·CI 없음

## 3. 개선안 (우선순위 순)

### P1. 데이터 레이어 도입 + 타입 단일화 (1~2일)

```
lib/
├── types.ts               # supabase gen types로 자동 생성 + 도메인 타입
└── api/
    ├── trips.ts           # getActiveTrip, createTrip, updateTrip …
    ├── expenses.ts        # getExpenses, addExpense …
    └── users.ts           # getProfile, checkNickname, deleteAccount …
hooks/
    ├── useTrip.ts
    └── useExpenses.ts
```

- 페이지는 hooks만 호출, supabase는 lib/api 안에서만 사용 → 스키마 변경 시 수정 지점 1곳
- 타입은 `supabase gen types typescript`로 자동 생성 (Supabase MCP/CLI 지원)
- 이 구조가 잡히면 이후 TanStack Query 도입(캐시·refetch 자동화)도 쉬움. 지금 TripContext의 수동 `refresh()` 패턴을 대체 가능

### P2. 스키마 마이그레이션 정비 (반나절)
현재 DB 스키마를 덤프해서 `supabase/migrations/`에 초기 마이그레이션으로 추가. 이후 모든 스키마 변경은 마이그레이션 파일로만.

### P3. 컴포넌트 폴더 — 현행 유지
ui/ 단일 폴더 통합은 의도된 결정(#73)이고, `Home*` / `Budget*` / `Tripy*` 접두사 네이밍이 그룹핑 역할을 하고 있어 현 규모(30개)에선 유지. 50개를 넘어 접두사만으로 탐색이 어려워지면 그때 feature별 분리 검토.

### P4. 정리 작업 (2~3시간)
- CLAUDE.md 현행화: Next 16, Tailwind v4 CSS 변수 방식, 실제 폴더 구조 반영
- 컬러 하드코딩 19곳 → 토큰 클래스로 교체
- `tsconfig.tsbuildinfo` gitignore 추가 후 git rm
- `app/preview/` 삭제 또는 `process.env.NODE_ENV !== 'production'`에서 notFound() 처리

### P5. 점진적 서버 컴포넌트 전환 (여유 있을 때)
새 페이지부터 서버 컴포넌트 + `lib/supabase-server.ts` 조회 → 초기 로딩 개선. 기존 페이지는 무리해서 바꾸지 않아도 됨.

## 4. 서비스 선택 평가

| 영역 | 현재 | 판단 |
|------|------|------|
| 호스팅 | Vercel | ✅ 유지. Next.js 최적, 무료 티어 충분 |
| DB/인증 | Supabase | ✅ 유지. RLS+Auth 조합이 이 규모에 최적. 이전 비용 > 이득 |
| 스타일 | Tailwind v4 | ✅ 유지. 문서만 현행화 |
| 상태관리 | Context 수동 | ⚠️ 확장 시 TanStack Query 권장 (서버 상태 캐시/무효화 자동) |
| 환율 | 하드코딩 추정 | ⚠️ 실시간 필요 시 exchangerate-api 등 무료 API + Supabase Edge Function 캐시 |
| 에러 추적 | 없음 | 권장: Sentry 무료 티어 |
| 분석 | 없음 | 권장: Vercel Analytics (원클릭) |

**결론: 서비스 교체는 불필요. 문제는 도구가 아니라 코드 구조(데이터 레이어·타입·폴더)에 있고, P1~P2만 해도 유지보수성이 크게 달라짐.**

## 5. 목표 파일트리

```
app/                    # 라우팅 + 페이지 조립만 (얇게)
components/ui/          # 전체 컴포넌트 (접두사 네이밍으로 그룹핑, 현행 유지)
hooks/                  # useTrip, useExpenses …
contexts/               # Auth만 유지 (Trip은 hooks로 흡수)
lib/
├── api/                # Supabase 호출 전담
├── constants/
├── types.ts            # 자동 생성 DB 타입 + 도메인 타입
└── supabase(-server).ts
supabase/migrations/    # 스키마 + RLS 전체
```
