# Tripy

여행 예산과 지출을 기록하는 모바일 우선 웹 가계부. Next.js 16 · Tailwind v4 · Supabase · Vercel.

## 시작하기

```bash
npm install
npm run dev        # http://localhost:3000
npm run storybook  # http://localhost:6006
```

`.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 필요하다.

## 팀 작업 방식 (Claude Code)

프로젝트 규칙은 `CLAUDE.md`에 있고 Claude가 자동으로 읽는다. 아래는 사람이 지키는 습관이다.

- 작업 전 `git pull origin main`, 브랜치를 만든 뒤 작업한다.
- 한 번에 한 파트만 작업하고 PR을 올린다. 파트가 끝나면 `/clear` 또는 `/compact`.
- 큰 작업은 Plan 모드로 계획을 먼저 확인한다.
- PR을 올리면 팀원에게 알린다.
- PR 전에 `npm run verify`와 `npm run build`를 통과시킨다.

### 하네스 구성

| 위치 | 역할 |
|---|---|
| `CLAUDE.md` | 스택·구조·절대 규칙. 코드와 어긋나면 같은 PR에서 고친다 |
| `.claude/settings.json` | 공유 권한(main push 금지, .env 읽기 금지)과 hook |
| `.claude/hooks/check-hardcode.mjs` | 하드코딩(hex·임의 px·inline style)을 늘리는 쓰기를 차단. `--scan` `--check` `--baseline` |
| `.claude/hooks/hardcode-baseline.json` | 현재 허용 총계. 줄어들 때만 `--baseline`으로 갱신 |
| `.claude/agents/` | component-builder(토큰으로 컴포넌트), token-guardian(토큰 관리), qa-reporter(검사 리포트) |
