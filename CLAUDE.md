# Tripy 프로젝트 개발 규칙

## 프로젝트 개요
여행용 가계부 반응형 웹 서비스
- 프레임워크: Next.js 14 (App Router)
- 스타일: Tailwind CSS
- 언어: TypeScript
- 데이터 저장: Supabase
- 배포: Vercel

---

## 브랜치 규칙

```
main          → 배포 브랜치 (직접 push 금지)
feature/화면명 → 기능 개발 브랜치
fix/버그내용   → 버그 수정 브랜치
```

**브랜치 예시**
```
feature/splash
feature/travel-setup
feature/budget-setting
feature/home
feature/expense-register
feature/travel-management
feature/mypage
feature/chart
```

**작업 순서**
1. `git pull origin main` (작업 전 항상 최신 동기화)
2. `git checkout -b feature/작업내용`
3. 작업 후 PR 올리기
4. 리뷰 후 main 머지 (머지 권한: 비비)

---

## 커밋 규칙

```
feat: 새 기능 추가
fix: 버그 수정
style: UI/스타일 수정 (기능 변경 없음)
refactor: 코드 리팩토링
chore: 설정 파일 수정
```

**커밋 예시**
```
feat: 홈 화면 지출 내역 리스트 구현
fix: 여행 설정 날짜 선택 버그 수정
style: 지출 등록 버튼 컬러 수정
```

---

## 폴더 구조

```
app/
├── page.tsx                  # 스플래시 (루트)
├── layout.tsx                # 루트 레이아웃
├── nickname/page.tsx         # 닉네임 설정
├── setup/
│   ├── page.tsx              # 여행 설정
│   ├── country/page.tsx      # 국가 선택
│   └── region/page.tsx       # 지역 선택
├── auth/
│   └── callback/route.ts     # Supabase 인증 콜백
├── budget/page.tsx           # 예산 설정 (예정)
├── home/page.tsx             # 홈 (예정)
├── expense/page.tsx          # 지출/예산 등록 (예정)
├── travels/page.tsx          # 여행 관리 (예정)
└── mypage/page.tsx           # 마이페이지 (예정)
components/
├── layout/
│   ├── BottomNav.tsx         # 하단 네비게이션
│   └── Header.tsx            # 헤더 (햄버거 메뉴 포함)
└── ui/                       # 공통 UI 컴포넌트
lib/
├── supabase.ts               # Supabase 클라이언트
└── types.ts                  # 타입 정의
```

---

## 디자인 토큰 (Figma Variables 기반)

코드에서 컬러 하드코딩 금지. 반드시 아래 Tailwind 클래스 또는 CSS 변수 사용.

### Primary Green
| 토큰 | HEX | Tailwind 커스텀 클래스 |
|------|-----|----------------------|
| Green/0 | `#F0F9E7` | `bg-green-0` |
| Green/10 | `#DFF2CC` | `bg-green-10` |
| Green/20 | `#C6E8A6` | `bg-green-20` |
| Green/30 | `#A6DB75` | `bg-green-30` |
| Green/40 | `#82CC41` | `bg-green-40` |
| **Green/50** | `#6BC20F` | `bg-green-50` ← **메인 버튼 컬러** |
| Green/60 | `#4B8A09` | `bg-green-60` |
| Green/70 | `#396907` | `bg-green-70` |
| Green/80 | `#305706` | `bg-green-80` |
| Green/90 | `#254405` | `bg-green-90` |
| Gradient | `#1EB400` | `bg-gradient` |

### Grayscale
| 토큰 | HEX |
|------|-----|
| White | `#FFFFFF` |
| 5 | `#F8F8F8` |
| 10 | `#F0F0F0` |
| 20 | `#E4E4E4` |
| 30 | `#D8D8D8` |
| 40 | `#C6C6C6` |
| 50 | `#8E8E8E` |
| 60 | `#717171` |
| 70 | `#555555` |
| 80 | `#2D2D2D` |
| 90 | `#1D1D1D` |
| Black | `#000000` |

### Semantic Colors
| 용도 | HEX |
|------|-----|
| Danger (에러/삭제) | `#EB003B` |
| Information | `#2768FF` |
| Warning | `#FFB724` |

---

## tailwind.config.ts 컬러 설정

```typescript
colors: {
  green: {
    0: '#F0F9E7',
    10: '#DFF2CC',
    20: '#C6E8A6',
    30: '#A6DB75',
    40: '#82CC41',
    50: '#6BC20F',  // 메인 버튼
    60: '#4B8A09',
    70: '#396907',
    80: '#305706',
    90: '#254405',
  },
  gradient: '#1EB400',
  danger: {
    50: '#EB003B',
  },
  info: {
    50: '#2768FF',
  },
  warning: {
    50: '#FFB724',
  },
  gray: {
    5: '#F8F8F8',
    10: '#F0F0F0',
    20: '#E4E4E4',
    30: '#D8D8D8',
    40: '#C6C6C6',
    50: '#8E8E8E',
    60: '#717171',
    70: '#555555',
    80: '#2D2D2D',
    90: '#1D1D1D',
  }
}
```

---

## 반응형 기준

```
모바일 우선 설계
max-width: 390px (모바일 기준)
중앙 정렬로 데스크탑에서도 보기 좋게
```

---

## 작업 전 필수 체크

- [ ] `git pull origin main` 했는가?
- [ ] 새 브랜치 생성했는가?
- [ ] `npm run dev` 로컬 실행 확인했는가?
- [ ] 컬러 하드코딩 없이 토큰 사용했는가?
- [ ] `npm run build` 에러 없는지 확인했는가?
- [ ] PR 올리기 전 셀프 리뷰 했는가?

---

## PR 규칙

- 제목: `[feat] 홈 화면 구현` 형식
- 스크린샷 또는 화면 녹화 첨부
- 머지 전 빌드 에러 없어야 함

---

## 작업 규칙 (필수)

1. 작업 전 `git pull origin main`
2. `feature/화면명` 브랜치 생성 후 작업
3. 작업 전 파일 구조 파악
4. CLAUDE.md 읽고 진행
5. 한 파트씩 수정 후 PR
6. 한 파트 끝나면 `/clear` 또는 `/compact`
7. 모델은 주로 Sonnet, 복잡한 설계만 Opus
8. 항상 Plan 모드로 계획 먼저 세우고 확인 후 진행
9. PR 올릴 때 팀원 노티
10. 마지막 작업 후 `git commit + push`

---

## Supabase 테이블

- **users**: 유저 정보 (display_name)
- **trips**: 여행 정보 (국가, 날짜, 예산)
- **expenses**: 지출 내역 (금액, 카테고리, 결제수단)
