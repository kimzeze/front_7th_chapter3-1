# 리팩토링 결정 사항

## 1. 폴더 구조 개선

### 변경 사항
```
components/
├── ui/              # shadcn/ui (변경 없음)
├── shared/          # common → shared로 rename
├── layout/          # 신규 추가
└── domain/
    ├── user/
    ├── post/
    └── management/  # 신규 추가
```

### 결정 이유

**common → shared**
- `common`보다 `shared`가 "진짜 재사용 가능한 컴포넌트"라는 의미를 더 명확하게 전달함
- 실제로 여러 도메인에서 공유되는 컴포넌트(AlertContainer, PageHeader, ThemeToggle)만 포함

**layout/ 폴더 분리**
- Header가 앱 전체 레이아웃에 관련된 컴포넌트라서 shared/와는 성격이 다름
- 나중에 Footer, Sidebar 같은 레이아웃 컴포넌트가 추가될 가능성을 고려

**domain/management/ 생성**
- TabSwitcher, StatsGrid는 "관리 페이지 전용" 컴포넌트
- 진짜 재사용 가능한 컴포넌트가 아니므로 shared/에 두는 게 부적절
- domain/management/로 이동해서 관심사를 명확히 분리

## 2. badgeHelpers 분리

### 변경 사항
```
utils/badgeHelpers.ts (삭제)
→ domain/user/userBadgeHelpers.ts
→ domain/post/postBadgeHelpers.ts
```

### 결정 이유

**도메인 로직 분리**
- User의 role/status 매핑 로직은 User 도메인에만 관련됨
- Post의 status/category 매핑 로직은 Post 도메인에만 관련됨
- utils/에 두면 "범용 유틸"처럼 보이지만 실제로는 특정 도메인에 강하게 결합됨

**타입 안전성 개선**
- `string` → `User["role"]`, `Post["status"]` 같은 구체적 타입 사용
- 런타임 에러 가능성 감소

**유지보수성**
- User 관련 코드를 수정할 때 user/ 폴더만 보면 됨
- 도메인별로 코드가 응집되어 있어 찾기 쉬움

## 3. react-hook-form + Zod 통합

### 결정 이유

**기존 문제점**
- 수동 상태 관리: `formData`, `setFormData`, `onChange` 수동으로 처리
- 검증 로직 없음: 클라이언트 측 검증이 없어 서버 에러에만 의존
- 타입 안전성 부족: `any` 타입 남발

**react-hook-form을 선택한 이유**
- 성능: 비제어 컴포넌트 방식으로 리렌더링 최소화
- DX: `register`, `handleSubmit` 같은 간결한 API
- 검증 통합: Zod와 완벽하게 통합 가능

**Zod를 선택한 이유**
- TypeScript 우선: 스키마에서 타입 자동 추론
- 런타임 검증: 컴파일 타임 + 런타임 모두 안전
- 명확한 에러 메시지: 사용자에게 정확한 피드백 제공

**아키텍처 결정**
- 폼 로직을 부모(ManagementPage)에서 관리
- UserFormFields/PostFormFields는 순수하게 UI만 담당
- 이유: 폼 제출 로직(CRUD)이 부모에 있어서 부모가 폼 상태를 관리하는 게 자연스러움

## 4. Design Token 적용

### 변경 사항
```typescript
// Before
color: "#2e7d32"

// After
color: "hsl(var(--chart-4))"
```

### 결정 이유

**하드코딩 문제**
- 색상이 코드에 박혀있으면 테마 변경 시 모든 코드를 수정해야 함
- Dark Mode에서 색상이 어색할 수 있음

**Design Token의 장점**
- 테마 전환 자동 대응: CSS 변수만 바꾸면 전체 색상 변경
- 일관성: 디자인 시스템의 정의된 색상만 사용
- 유지보수: 색상 변경이 필요하면 CSS 변수만 수정

**chart-* 토큰 선택 이유**
- 기존 --primary, --destructive는 주로 버튼/텍스트용
- 차트/통계 색상은 chart-1~5가 더 적합
- 의미적으로 "데이터 시각화"에 맞음

## 5. 타입 안전성 개선

### 변경 사항
- useManagementData의 `any` 제거
- UserFormData, PostFormData 타입 활용
- 타입 캐스팅으로 런타임 안전성 확보

### 결정 이유

**any의 문제점**
- 타입 체크 무력화: 컴파일러가 에러를 잡아주지 못함
- 리팩토링 어려움: 타입 변경 시 영향 범위를 알 수 없음
- 실수하기 쉬움: 존재하지 않는 프로퍼티 접근 가능

**해결 방법**
- FormData 유니온 타입 정의
- entityType에 따라 타입 캐스팅
- Zod 스키마와 연결된 타입 사용

**트레이드오프**
- 타입 캐스팅(`as`)은 완벽하지 않지만, entityType이 보장되는 상황에서는 안전
- 더 복잡한 타입 가드를 쓸 수도 있지만, 이 정도면 충분히 안전하고 코드도 깔끔함

## 6. Import 패턴 개선

### 변경 사항
```typescript
// Before
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createUser } from "../../services/userService"

// After
import { Button, Badge, Dialog, Alert } from "@/components/ui"
import { createUser } from "@/services"
```

### Barrel Exports 도입
- `validators/index.ts`: Zod 스키마와 타입 통합 export
- `services/index.ts`: API 서비스 함수들 통합 export
- `components/ui/index.ts`: shadcn/ui 컴포넌트들 통합 export
- `components/domain/*/index.ts`: 도메인별 컴포넌트 및 헬퍼 통합 export

### 절대 경로 활용
- 모든 상대 경로(`../../`)를 절대 경로(`@/`)로 변경
- vite.config.ts에 이미 설정된 `@` 별칭 활용

### 결정 이유

**일관성**
- shadcn/ui는 개별 import를 권장하지만, 우리 코드베이스 전체의 일관성을 위해 barrel export 적용
- 모든 폴더에서 동일한 import 패턴 사용

**가독성**
- import 구문이 간결해지고 파일 구조가 명확해짐
- 긴 상대 경로(`../../services/userService`)보다 절대 경로(`@/services`)가 직관적

**유지보수성**
- 파일 위치 변경 시 상대 경로는 모두 수정해야 하지만 절대 경로는 변경 불필요
- export 위치만 barrel file에서 관리하면 됨

## 7. Colocation 원칙 적용

### 변경 사항
```
hooks/
├── useManagementData.ts (삭제)
├── useEntityStats.ts (삭제)
└── useModalState.ts (삭제)

pages/ManagementPage/
├── ManagementPage.tsx
├── useManagementData.ts (이동)
├── useEntityStats.ts (이동)
├── useModalState.ts (이동)
└── columns.tsx (신규)
```

### 결정 이유

**Kent C. Dodds의 Colocation 원칙**
- "코드는 사용되는 곳과 가까이 위치해야 한다"
- 세 개의 훅은 ManagementPage에서만 사용됨
- 전역 hooks/ 폴더에 두면 "어디서든 쓸 수 있는 훅"처럼 보이지만 실제로는 그렇지 않음

**파일 크기 감소**
- ManagementPage.tsx가 573줄 → 430줄로 감소 (25% 감소)
- columns 정의를 별도 파일로 분리하여 가독성 향상

**명확한 의존성**
- ManagementPage와 관련된 모든 코드가 한 폴더에 모임
- 다른 개발자가 코드를 이해할 때 ManagementPage/ 폴더만 보면 됨

**index.tsx를 사용하지 않은 이유**
- 일부 아키텍처에서는 `pages/ManagementPage/index.tsx`를 선호하지만
- `ManagementPage.tsx`가 파일 탐색기에서 더 명확하게 보임
- 여러 index.tsx가 탭에 열리면 구분이 어려움

## 8. UI 컴포넌트 개선

### 변경 사항

**Dialog 닫기 버튼**
```typescript
// cursor-pointer 추가
className="... cursor-pointer ..."
```

**Alert 닫기 버튼**
```typescript
// cursor-pointer 추가
className="... cursor-pointer ..."
```

**NativeSelect 너비**
```typescript
// Before
className="... w-fit ..."

// After
className="... w-full ..."
```

### 결정 이유

**사용자 경험 개선**
- 닫기 버튼에 cursor-pointer 추가하여 클릭 가능함을 명확히 표시
- 버튼 위에 마우스를 올렸을 때 포인터 커서가 표시되어 직관적

**폼 레이아웃 개선**
- Select 컴포넌트가 grid-cols-2에서 각각 50%씩 차지하도록 w-full 적용
- 기존 w-fit은 텍스트 너비만큼만 차지하여 시각적으로 어색했음
- 일관된 너비로 폼이 더 정돈되어 보임

## 결론

모든 변경은 **명확성**, **유지보수성**, **타입 안전성**을 높이는 방향으로 진행했다.
단기적으로는 코드가 조금 늘어났지만, 장기적으로는 버그가 줄고 협업이 쉬워질 것이다.
