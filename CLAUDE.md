# Tripy

여행 예산과 지출을 기록하는 모바일 우선 웹 가계부. 기능 범위는 `docs/prd.md`, 알려진 기술 부채는 `docs/architecture-review.md`.

## 스택 (package.json 기준)

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · Supabase · Vercel · Storybook 10

- Tailwind v4는 CSS-first다. `tailwind.config.ts`는 없고 만들지 않는다. 테마는 `src/tokens/*.css`의 `@theme`에 있다.
- import 별칭 `@/*` → `src/*`

## 명령어

```
npm run dev            # 로컬 실행 (localhost:3000)
npm run verify         # lint + typecheck + 토큰 하드코딩 검사 — 작업 완료 전 반드시 통과
npm run build          # 프로덕션 빌드 (PR 전)
npm run storybook      # 컴포넌트·토큰 문서 (localhost:6006)
npm run test           # Storybook 스토리 테스트 (vitest + playwright)
npm run check:tokens   # 하드코딩 총계가 baseline 이하인지 확인
```

## 구조

```
src/app/            라우트: page(스플래시) landing nickname setup/{country,region,date,confirm}
                    home expense budget travels/[id]/edit mypage/{profile,settings,delete-account}
                    auth/{callback,session-sync} api/exchange-rates error preview(개발용)
src/components/ui/  모든 UI 컴포넌트. 같은 폴더에 <Name>.stories.tsx
src/tokens/         디자인 토큰 단일 출처 (색·간격·타이포·radius·shadow) + 토큰 Storybook 문서
src/contexts/       AuthContext(로그인 유저), TripContext(활성 여행)
src/hooks/          useExchangeRates, useKeyboardInset
src/lib/            supabase.ts(클라이언트) supabase-server.ts constants/{categories,countries,currency}
supabase/migrations/ RLS 정책, payment_method 추가 (테이블 생성 스키마는 아직 없음)
.claude/agents/     component-builder, token-guardian, qa-reporter
```

## 절대 규칙

1. **하드코딩 금지.** hex 컬러, `w-[327px]` 같은 임의 px, `style={{}}` 리터럴을 새로 쓰지 않는다.
   - 색·간격·radius·폰트는 `src/tokens/*.css`의 토큰 클래스(`bg-green-50`, `text-body-m`, `rounded-16`, `gap-gap-5`)를 쓴다.
   - 토큰이 없으면 Tailwind 기본 스케일(4px 단위, 예: `p-4`)을 쓴다. 그것도 안 맞으면 멈추고 token-guardian에게 토큰 추가를 맡긴다.
   - PreToolUse hook(`.claude/hooks/check-hardcode.mjs`)이 파일의 위반 수가 늘어나는 쓰기를 막는다. 막히면 메시지의 「→」 토큰으로 바꾼다. 우회하지 않는다.
   - 예외: 동적 값(`style={{ width: \`${pct}%\` }}`), 외부 브랜드 로고 색(Google 로그인 버튼 등).
2. **토큰 파일(`src/tokens/`)은 token-guardian만 수정한다.** 토큰 이름은 바꾸지 않고 값만 바꾼다.
3. **컴포넌트를 만들거나 variant를 추가하면 스토리도 함께** 작성·갱신한다.
4. **요청 범위 밖은 고치지 않고 보고한다.** 지금 팀원들이 `src/components/ui/`를 정리 중이라 충돌이 나기 쉽다.
5. 작업을 끝냈다고 말하기 전에 `npm run verify`를 통과시킨다.

## 레이아웃

- 모바일 우선. 루트 레이아웃이 `max-w-[390px] mx-auto`로 감싼다. 페이지에서 다시 감싸지 않는다.
- 화면 높이는 `h-screen` 대신 `.h-screen-safe` / `.min-h-screen-safe`(dvh)를 쓴다.
- 하단 고정 버튼과 입력창은 `useKeyboardInset`으로 iOS 키보드에 대응한다(`BottomCTA` 참고).

## 데이터

- Supabase 테이블: `users`(display_name) · `trips`(국가, 날짜, 예산) · `expenses`(금액, 카테고리, 결제수단 `payment_method`: card|cash)
- 활성 여행은 `TripContext`에서 가져온다. 페이지마다 다시 조회하지 않는다.
- 비로그인 사용자는 홈에서 더미 데이터와 localStorage 지출을 본다.
- 스키마를 바꾸면 `supabase/migrations/YYYYMMDD_설명.sql`을 추가한다.

## 알려진 함정

- `mailto:` 링크에 `target="_blank"`를 쓰면 데스크탑에서 about:blank가 뜨고 멈춘다.
- `useSearchParams`를 쓰는 페이지는 `<Suspense>`로 감싸야 빌드된다.
- `react-hooks/set-state-in-effect`는 기존 5곳 때문에 경고로 낮춰 두었다. 새 코드에서는 이 패턴을 쓰지 않는다.

## Git

- `main`에 직접 push 금지. `feature/<화면>`, `fix/<버그>`, `chore/<내용>` 브랜치에서 작업하고 PR로 머지한다(머지 권한: 비비).
- 작업 시작 전 `git pull origin main`.
- 커밋: `feat:` `fix:` `style:`(UI만) `refactor:` `chore:` `docs:` + 한국어 요약. 예: `fix: 여행 설정 날짜 선택 버그 수정`
- PR 제목은 `[feat] 홈 화면 구현` 형식. UI 변경이면 스크린샷을 첨부한다.
