# Storybook–Figma 네이밍 통일 규칙

Oct 7, 2026 · @Lily

## 1. 네이밍 통일 원칙

같은 컴포넌트는 Storybook과 Figma에서 같은 단어를 씁니다. 대소문자만 아래 표의 고정된 방식으로 바꿉니다.

조사 범위는 Figma "Tripy 1.0.0" 섹션에 놓인 인스턴스와 `src/components/ui`의 스토리 16개입니다. Figma 메인 컴포넌트 페이지는 열지 못해, Property 이름은 Button, Header, HomeFilter, Image 네 개만 확인했습니다.

| 요소 | Figma 표기 | Storybook·코드 표기 | 예 |
| --- | --- | --- | --- |
| 컴포넌트명 | PascalCase | PascalCase, 스토리 title은 `UI/<이름>` | `Button`, `BottomNav` |
| Property / Prop 이름 | camelCase | camelCase | `variant`, `size`, `state` |
| Variant 값 | PascalCase | camelCase | `Primary` ↔ `primary` |
| Size 값 | 대문자 약어 `S` `M` `L` `XL` | 동일 | `L` ↔ `"L"` |
| State 값 | PascalCase | camelCase | `Disabled` ↔ `disabled` |
| Boolean 옵션 | `show`, `has`, `is` 접두사 + camelCase | 동일 | `showIcon`, `hasData` |
| 스토리 이름 | 해당 없음 | PascalCase, Figma 값과 같은 단어 | `Primary`, `Disabled` |

### 표기 규칙

- **단어 구분**: 대문자로만 구분합니다. 공백, 하이픈, 언더스코어, 슬래시는 쓰지 않습니다.
- **언어**: 이름은 영어로 씁니다. 한글은 설명과 화면 프레임 이름에만 씁니다.
- **단수형**: 컴포넌트명과 값은 단수형입니다. 여러 개를 담는 컨테이너만 `List`, `Group`을 붙입니다.
- **약어**: 허용 목록에 있는 것만 씁니다. 현재 허용 목록은 `CTA`, `FAB`, `Nav`, `UI`입니다. 추가하려면 2장 용어 사전에 먼저 등록합니다.
- **역할 기준**: 이름은 역할을 말합니다. 위치, 모양, 동작(`open`, `select`)이나 Figma 기본 이름(`Property 1`, `Frame 123`)은 쓰지 않습니다.
- **도메인 접두사**: 한 화면에서만 쓰는 컴포넌트는 `Home`, `Budget`, `Tripy` 접두사를 붙입니다. 여러 화면에서 쓰면 붙이지 않습니다.
- **Property 순서**: `variant` → `size` → `state` → Boolean 옵션 순서로 둡니다. Figma 패널과 스토리 `argTypes` 모두 같습니다.
- **상태와 HTML 속성**: Figma의 `state=Disabled`는 코드에서 `disabled` Boolean prop으로 받습니다. HTML 기본 속성이 있는 상태는 이 방식을 따릅니다.

## 2. 용어 사전

같은 뜻의 용어가 여러 개면 왼쪽 열의 용어 하나만 씁니다. 새 용어가 필요하면 이 표에 먼저 추가한 뒤 양쪽에 반영합니다.

### Property 이름

| 통일 용어 | 쓰지 않는 용어 | 뜻 |
| --- | --- | --- |
| `variant` | `mode`, `type`, `style`, `kind` | 시각적 종류 |
| `size` | `scale` | 크기 단계 |
| `state` | `status` | 상호작용 상태. `status`는 예산 Good/Danger 같은 데이터 상태에만 씁니다 |
| `label` | `text`, `title` | 버튼·칩 안의 글자 |
| `showIcon` | `icon` (Figma Boolean으로 쓸 때), `withIcon` | 아이콘 표시 여부. 코드는 `icon` 슬롯 prop으로 받습니다 |

### 값

| 통일 용어 | 쓰지 않는 용어 | 적용 대상 |
| --- | --- | --- |
| `Default` | `Active`, `Normal`, `Enabled` | 기본 상태 |
| `Disabled` | `Inactive` | 비활성 상태 |
| `Focused` | `Focus`, `Active` | 입력 중 상태 |
| `Error` | `Invalid`, `Danger` | 입력 오류 상태 |
| `Danger` | `Error`, `Warning` | 삭제·초과를 뜻하는 의미색 variant |
| `Primary` / `Secondary` / `Ghost` | `Main`, `Sub`, `Text` | 버튼 variant |
| `S` / `M` / `L` / `XL` | `sm`, `md`, `Small`, `Medium` | Size 값. 타이포그래피 토큰과 같은 표기입니다 |
| `Accommodation` / `Transport` | `Hotel` / `Traffic` | 카테고리 값. 코드의 카테고리 ID와 맞춥니다 |

### 컴포넌트 종류

| 통일 용어 | 쓰지 않는 용어 | 뜻 |
| --- | --- | --- |
| `Modal` | `Popup`, `Dialog`, `openModal` | 화면 위에 뜨는 확인창 |
| `BottomSheet` | `Drawer` | 아래에서 올라오는 패널 |
| `BottomNav` | `homeIndicator`, `TabBar` | 하단 탭 내비게이션 |
| `BottomCTA` | `selectContainer` | 하단에 고정된 주요 버튼 영역 |
| `FAB` | `buttonFloating`, `FloatingButton` | 떠 있는 원형 추가 버튼 |
| `Tooltip` | `HintBubble`, `Hint` | 요소 옆에 붙는 안내 말풍선 |
| `ProgressBar` | `slide`, `Slider` | 진행률 표시 막대 |
| `Avatar` | `profile` | 프로필 이미지 |
| `Input` | `formField`, `TextField` | 라벨·입력창·도움말을 포함한 입력 필드 |
| `Icon<이름>` | `icon/<이름>`, `<이름>Icon` | 아이콘 컴포넌트. 예: `IconSetting` |

## 3. 현재 프로젝트 네이밍 매핑

컴포넌트 17개 중 단어가 같은 것은 8개이고, 나머지 9개는 단어 자체가 다릅니다. Figma 이름은 모두 소문자로 시작해 대소문자도 전부 바꿔야 합니다.

### 컴포넌트명

| Storybook·코드 | Figma | 통일 기준 | 스토리 |
| --- | --- | --- | --- |
| `Button` | `button` | `Button` | 있음 |
| `Header` | `header` | `Header` | 있음 |
| `StatusBadge` | `statusBadge` | `StatusBadge` | 있음 |
| `BottomNav` | `homeIndicator` | `BottomNav` | 있음 |
| `BottomCTA` | `selectContainer` | `BottomCTA` | 있음 |
| `FAB` | `buttonFloating` | `FAB` | 있음 |
| `Input` | `formField` | `Input` | 있음 |
| `Tooltip` | `tooltip` | `Tooltip` | 있음 |
| `BudgetProgressBar` | `slide` | `BudgetProgressBar` | 있음 |
| `ProfileAvatar` | `profile` | `ProfileAvatar` | 있음 |
| `CategoryIcon` | `categoryHotel`, `categoryFood`, `categoryTraffic`, `categoryActivity` | `CategoryIcon` | 있음 |
| `DeleteConfirmModal` | `openModal` | `DeleteConfirmModal` | 없음 |
| `HomeFilter` | `homeFilter` | `HomeFilter` | 없음 |
| `FilterCategory` | `filter_category` | `FilterCategory` | 없음 |
| `ExchangeDropdown` | `exchangeDropdown` | `ExchangeDropdown` | 없음 |
| `ProfileEdit` | `profileEdit` | `ProfileEdit` | 없음 |
| `IconSetting` | `iconSetting` | `IconSetting` | 없음 |

`Toast`, `SelectChip`, `CircleAlertInfo`, `Modal` 스토리는 조사한 Figma 섹션에서 대응하는 컴포넌트를 찾지 못했습니다.

### Property와 값

| 컴포넌트 | 구분 | Storybook·코드 | Figma | 통일 기준 (Figma ↔ 코드) |
| --- | --- | --- | --- | --- |
| Button | Property 이름 | `variant` | `mode` | `variant` |
| Button | Variant 값 | `primary`, `secondary`, `ghost` | `Primary`, `Secondary` | `Primary` ↔ `primary`, `Secondary` ↔ `secondary`, `Ghost` ↔ `ghost` |
| Button | Size 값 | `L`, `M` | `L`, M | `L`, `M` |
| Button | State | `disabled` (Boolean) | `state: Default, Disabled` | `state`: `Default`, `Disabled` ↔ `disabled` |
| Button | 글자 | `label` | `label` (Primary), `text` (Secondary) | `label` |
| Button | 아이콘 | `icon` (슬롯) | `showIcon` | `showIcon` ↔ `icon` |
| Input | State | `state`: `default`, `focused`, `success`, `error` | 확인 못 함 | `state`: `Default`, `Focused`, `Success`, `Error` |
| StatusBadge | Variant 값 | `good`, `danger` | 확인 못 함 (인스턴스 글자는 Good, Danger) | `variant`: `Good` ↔ `good`, `Danger` ↔ `danger` |
| CategoryIcon | 값 | `accommodation`, `food`, `transport`, `activity`, `shopping`, `etc` | 컴포넌트 4개로 분리 (`Hotel`, `Food`, `Traffic`, `Activity`) | `category`: `Accommodation`, `Food`, `Transport`, `Activity`, `Shopping`, `Etc` |
| Header | Variant | 별도 컴포넌트 `HomeHeader` | `type=Logo` | `variant=Logo` |
| HomeFilter | Boolean | 확인 못 함 | `property1=yesdata` | `hasData` |
| Image | 값 | 해당 없음 | `type="7"` | 역할을 말하는 값으로 교체 |

## 4. 현재 불일치 항목

처음 19건 중 19건을 모두 2026-10-07에 적용했습니다. Storybook·코드 2건은 PR #101로, Figma는 16건 전부를 파일에 직접 반영했습니다. 아래 표는 적용 전 기준의 기록이며, 적용 현황은 7장에 있습니다. 결정이 필요했던 Button ghost variant는 Figma에 Ghost를 추가하는 쪽으로 끝냈습니다. Figma의 tooltip도 Tooltip으로 함께 바꿨습니다.

### Critical — 다른 것으로 오해되는 이름

| 현재 Storybook | 현재 Figma | 표준 이름 | 변경 필요 위치 | 변경 이유 |
| --- | --- | --- | --- | --- |
| `BottomNav` | `homeIndicator` | `BottomNav` | Figma 컴포넌트명 | 홈 인디케이터는 iOS 화면 하단 막대를 뜻합니다. 실제 역할은 하단 탭 내비게이션입니다 |
| `BottomCTA` | `selectContainer` | `BottomCTA` | Figma 컴포넌트명 | 선택 UI가 아니라 하단 고정 버튼 영역입니다 |
| `BudgetProgressBar` | `slide` | `BudgetProgressBar` | Figma 컴포넌트명 | 사용자가 움직이는 슬라이더가 아니라 진행률 표시입니다 |
| `DeleteConfirmModal` (스토리 없음) | `openModal` | `DeleteConfirmModal` | Figma 컴포넌트명, Storybook에 스토리 추가 | 동작(`open`)을 이름에 썼고, 스토리의 `Modal`과 다른 컴포넌트라 대조가 안 됩니다 |
| `variant` | `mode` | `variant` | Figma Button Property 이름 | 같은 개념에 이름이 두 개입니다. 다른 컴포넌트도 코드는 모두 `variant`입니다 |

### High — 단어가 달라 검색·대조가 어려운 이름

| 현재 Storybook | 현재 Figma | 표준 이름 | 변경 필요 위치 | 변경 이유 |
| --- | --- | --- | --- | --- |
| `FAB` | `buttonFloating` | `FAB` | Figma 컴포넌트명 | 허용 약어이고, 코드 이름이 이미 규칙에 맞습니다 |
| `Input` | `formField` | `Input` | Figma 컴포넌트명 | 두 쪽 모두 라벨·입력창·도움말 묶음입니다. 코드 이름을 유지합니다 |
| `Tooltip` | `tooltip` | `Tooltip` | 적용 완료 (PR #101, 이전 이름 HintBubble) | 널리 쓰는 표준 용어이고, `FAB`의 prop이 이미 `tooltipText`입니다 |
| `ProfileAvatar` | `profile` | `ProfileAvatar` | Figma 컴포넌트명 | `profile`은 화면·데이터와 구분되지 않습니다 |
| `CategoryIcon` + `category` | `categoryHotel` 외 3개 | `CategoryIcon` + `category` | Figma 컴포넌트 통합, 값 이름 | 컴포넌트 4개를 하나로 합치고 `Hotel`→`Accommodation`, `Traffic`→`Transport`로 코드 ID와 맞춥니다. `Shopping`, `Etc`도 추가합니다 |
| `label` | `label` / `text` | `label` | Figma Button Property (Secondary의 `text`) | 같은 컴포넌트 안에서 variant마다 이름이 다릅니다 |
| `disabled` | `state=Active` | `state`: `Default`, `Disabled` | Figma Button Property 값 | 기본 상태는 `Default`로 통일하고, Figma에 `Disabled` 상태가 없습니다 |
| `ghost`, 사이즈 `M` | 없음 | `Ghost`, `M` | 결정 필요: Figma에 추가하거나 코드에서 제거 | 한쪽에만 있는 variant는 대조할 기준이 없습니다 |
| Input의 `state` | 확인 못 함 | `state` | 적용 완료 (PR #101, 이전 이름 variant) | `default`, `focused`, `success`, `error`는 종류가 아니라 상태입니다 |
| 확인 못 함 | `property1=yesdata` | `hasData` | Figma HomeFilter Property | Figma 기본 이름이고 값도 문장형입니다 |

### Low — 표기만 다른 이름

| 현재 Storybook | 현재 Figma | 표준 이름 | 변경 필요 위치 | 변경 이유 |
| --- | --- | --- | --- | --- |
| `Button`, `Header`, `StatusBadge`, `HomeFilter`, `ExchangeDropdown`, `ProfileEdit`, `IconSetting` | `button`, `header`, `statusBadge`, `homeFilter`, `exchangeDropdown`, `profileEdit`, `iconSetting` | 코드 이름과 동일 | Figma 컴포넌트명 7개 | 컴포넌트명은 PascalCase입니다 |
| `FilterCategory` | `filter_category` | `FilterCategory` | Figma 컴포넌트명 | 언더스코어를 쓰지 않습니다 |
| `HomeHeader` (별도 컴포넌트) | Header `type=Logo` | Header `variant=Logo` | Figma Header Property 이름 | `type`은 쓰지 않는 용어입니다 |
| 해당 없음 | Image `type="7"` | 역할을 말하는 값 | Figma Image Property | 숫자만으로는 무엇인지 알 수 없습니다 |

## 5. 수정 원칙

양쪽 이름이 모두 규칙에 맞으면 코드 이름을 유지하고 Figma를 바꿉니다. 코드 이름은 import와 사용처가 함께 바뀌어 비용이 크고, Figma는 메인 컴포넌트 이름만 바꾸면 인스턴스에 반영되기 때문입니다. 코드 이름이 규칙에 어긋날 때만 코드를 바꿉니다.

| 변경 유형 | 바꾸는 곳 | 함께 바꿀 것 | 확인 방법 |
| --- | --- | --- | --- |
| 단순 이름 변경 (Figma 컴포넌트명) | Figma 메인 컴포넌트 | 없음. 인스턴스는 자동 반영됩니다 | 화면 프레임의 인스턴스 이름이 바뀌었는지 확인 |
| 단순 이름 변경 (코드 컴포넌트명) | 파일명, export 이름 | 모든 import, 스토리 파일명과 title | `npm run build` 통과 |
| Variant 이름 변경 | Figma variant 값, 코드 union 타입 | 코드 사용처, 스토리 `args`·`argTypes`·스토리 이름 | 타입 오류 없음, 스토리 목록이 Figma 값과 같은 단어 |
| Figma Property 이름 변경 | Figma 컴포넌트 Property | 없음. 코드 영향은 없습니다 | 인스턴스의 기존 설정값이 유지되는지 확인 |
| Storybook Props 이름 변경 | 코드 prop 이름 | 모든 사용처를 같은 PR에서 변경, 스토리 `args` | `npm run build` 통과 |
| 컴포넌트 통합·분리 | Figma 컴포넌트 세트 또는 코드 컴포넌트 | 기존 인스턴스 교체, 스토리 재구성 | 교체 전후 화면이 같은지 확인 |

### 공통 기준

- 이름 변경과 스타일 변경은 같은 PR에 섞지 않습니다.
- 코드 이름 변경은 PR 하나에 컴포넌트 하나만 다룹니다.
- Figma와 코드를 둘 다 바꾸는 항목은 같은 날 반영합니다. 한쪽만 바뀐 상태로 두지 않습니다.
- 우선순위는 Critical, High, Low 순서로 처리합니다. Low는 해당 컴포넌트를 다른 이유로 고칠 때 함께 바꿔도 됩니다.
- 바꾼 이름은 3장 매핑 표에 바로 반영합니다.

## 6. 새 컴포넌트 체크리스트

새 컴포넌트를 만들거나 기존 컴포넌트에 variant를 추가할 때 디자이너와 개발자가 각자 확인합니다.

- [ ] 2장 용어 사전에 있는 용어를 사용했는가?
- [ ] Figma와 Storybook의 컴포넌트 이름이 동일한가?
- [ ] 컴포넌트명은 PascalCase, Property 이름은 camelCase인가?
- [ ] Variant, Size, State 값이 양쪽에서 같은 단어인가?
- [ ] `variant` → `size` → `state` → Boolean 순서가 규칙에 맞는가?
- [ ] 허용 목록에 없는 약어를 쓰지 않았는가?
- [ ] `Property 1`, `Frame 123` 같은 Figma 기본 이름이 남아 있지 않은가?
- [ ] 이름이 위치나 모양이 아니라 역할을 말하는가?
- [ ] Figma의 모든 variant에 대응하는 스토리가 있는가?
- [ ] 3장 매핑 표에 새 이름을 추가했는가?

## 7. 정리

### 최종 네이밍 규칙 요약

1. 같은 컴포넌트는 Figma와 Storybook에서 같은 단어를 씁니다.
2. 컴포넌트명은 양쪽 모두 PascalCase입니다.
3. Property 이름은 양쪽 모두 camelCase이고, `variant`, `size`, `state`만 씁니다.
4. 값은 Figma에서 PascalCase, 코드에서 camelCase로 적습니다. Size는 양쪽 모두 `S`, `M`, `L`, `XL`입니다.
5. 공백, 하이픈, 언더스코어, 슬래시, 한글, Figma 기본 이름은 쓰지 않습니다.
6. 약어는 `CTA`, `FAB`, `Nav`, `UI`만 씁니다.
7. 이름은 역할을 말하고, 단수형으로 씁니다.
8. Property 순서는 `variant` → `size` → `state` → Boolean입니다.

### 현재 변경해야 할 네이밍 목록

**적용 현황 (2026-10-07)**

| 구분 | 상태 | 내용 |
| --- | --- | --- |
| Storybook·코드 2건 | 적용 완료 | PR #101 |
| Figma 컴포넌트명 17개 | 적용 완료 | 목록의 이름 변경 전부와 `tooltip` → `Tooltip`. 화면에 놓인 인스턴스 레이어 이름 84개도 함께 바꿨습니다 |
| Button Property | 적용 완료 | `mode` → `variant`, `State` → `state`, `Size` → `size`, 값 `Active` → `Default`, `Deactive` → `Disabled` |
| HomeFilter Property | 적용 완료 | `Property 1` → `hasData`, 값 `yesdata` → `True`, `nodata` → `False` |
| Header Property | 적용 완료 | `Type` → `variant` |
| CategoryIcon | 적용 완료 | 컴포넌트 6개를 하나로 합치고 `category` Property를 만들었습니다. `categoryPlus`는 `Etc`로 옮겼습니다 |
| Button `text` → `label` | 적용 완료 | 두 텍스트 Property를 label 하나로 합쳤습니다. Secondary 인스턴스 15개의 글자는 그대로인 것을 확인했습니다. Show icon도 showIcon으로 바꿨습니다 |
| Image `type` 값 1\~7 | 적용 완료 | 세트 이름을 TripyCharacter로, type을 variant로 바꾸고 값은 쓰이는 화면 기준으로 붙였습니다: 1 Farewell, 2 Sad, 3 Empty, 4 Error, 5 Analysis, 6 Welcome, 7 Home. 코드의 TripyCharacter도 PR #102에서 같은 단어(farewell, sad, empty, error, analysis, welcome, home)로 바꿨습니다 |

작업 중 Figma 메인 컴포넌트를 직접 확인하며 바로잡은 사실과 새로 찾은 항목입니다.

- Button에는 사이즈 `M`과 비활성 상태가 이미 있었습니다. 코드에만 있어 Figma에 새로 추가한 것은 `ghost` variant 하나입니다.
- `BottomNav`로 바꾼 컴포넌트가 두 개이고 둘 다 화면에서 쓰입니다. 하나로 합쳐야 합니다.
- 입력 필드는 `Input`(이전 `formField`) 외에 `inputField`가 따로 있고 인스턴스 21개가 쓰고 있습니다.
- 쓰이지 않는 중복 컴포넌트가 남아 있습니다: `selectContainer`, `formField`, `fab`, `FilterCategory` 각 1개.
- 화면의 `FilterCategory` 인스턴스 5개는 삭제된 메인 컴포넌트를 바라보고 있습니다.
- 규칙에 어긋나는 Property가 더 있습니다: Tooltip `Property 1`, StatusBadge `Property 1`, DeleteConfirmModal `Property`, BudgetProgressBar `type`, BottomCTA `Type`, BottomNav `Menu`(값 `Mange` 오타), Input `state`의 값 `disable`·`selected`, Header 값 `left icon`·`right icon`·`Only title`.
- StatusBadge 컴포넌트 세트는 Figma가 오류 상태로 표시하고 있어 Property를 읽지 못했습니다.

**Figma 변경 목록 (16건 전부 적용 완료)**

| 우선순위 | 변경 전 | 변경 후 |
| --- | --- | --- |
| Critical | `homeIndicator` | `BottomNav` |
| Critical | `selectContainer` | `BottomCTA` |
| Critical | `slide` | `BudgetProgressBar` |
| Critical | `openModal` | `DeleteConfirmModal` |
| Critical | Button `mode` | Button `variant` |
| High | `buttonFloating` | `FAB` |
| High | `formField` | `Input` |
| High | `profile` | `ProfileAvatar` |
| High | `categoryHotel`, `categoryFood`, `categoryTraffic`, `categoryActivity` | `CategoryIcon` + `category` Property |
| High | Button `text` (Secondary) | Button `label` |
| High | Button `state=Active` | Button `state=Default`, `Disabled` 추가 |
| High | HomeFilter `property1=yesdata` | HomeFilter `hasData` |
| Low | `button`, `header`, `statusBadge`, `homeFilter`, `exchangeDropdown`, `profileEdit`, `iconSetting` | `Button`, `Header`, `StatusBadge`, `HomeFilter`, `ExchangeDropdown`, `ProfileEdit`, `IconSetting` |
| Low | `filter_category` | `FilterCategory` |
| Low | Header `type=Logo` | Header `variant=Logo` |
| Low | Image `type="7"` | 역할을 말하는 값 |

**Storybook·코드에서 바꾼 것 (2건, PR #101로 적용 완료)**

| 우선순위 | 변경 전 | 변경 후 |
| --- | --- | --- |
| High | `HintBubble` (파일, 스토리 title `UI/HintBubble`, import) | `Tooltip` |
| High | Input prop `variant` | Input prop `state` |

**결정이 필요했던 것 (1건, Figma에 Ghost를 추가해 적용 완료)**

- Button의 `ghost` variant와 사이즈 `M`은 코드에만 있습니다. Figma에 `Ghost`, `M`을 추가할지, 코드에서 제거할지가 쟁점이었고, Figma에 Ghost를 추가했습니다(사이즈 M은 원래 있었습니다).

이와 별개로 Critical 항목인 `DeleteConfirmModal`은 Storybook에 스토리를 추가해야 대조할 수 있습니다.

### 앞으로 네이밍을 결정하는 의사결정 기준

이름을 정할 때 아래 순서로 확인하고, 먼저 걸리는 기준을 따릅니다.

1. **용어 사전에 있는가?** 있으면 그 용어를 씁니다.
2. **이미 같은 역할의 컴포넌트가 있는가?** 있으면 새 이름을 만들지 않고 그 컴포넌트에 variant를 추가합니다.
3. **역할을 말하는가?** 위치, 모양, 동작을 말하는 이름은 버립니다.
4. **널리 쓰는 UI 용어인가?** `Tooltip`, `Modal`, `Avatar`처럼 통용되는 단어를 고릅니다.
5. **양쪽 후보가 모두 규칙에 맞는가?** 맞으면 코드 이름을 따릅니다.
6. **새 용어가 필요한가?** 디자이너와 개발자가 함께 정해 용어 사전에 추가한 뒤, 양쪽에 같은 날 반영합니다.
