# 과제 회고

## Before 패키지에서 발견한 문제점

### 1. UI와 비즈니스 로직의 혼재
Before 패키지에서 가장 먼저 눈에 띈 문제는 UI 컴포넌트가 도메인 지식을 직접 알고 있다는 점이었습니다.

- `Button` 컴포넌트가 `entityType`, `action` 같은 비즈니스 개념을 props로 받음
- `FormInput`이 "예약어 체크", "회사 이메일만 허용" 같은 비즈니스 규칙을 직접 검증
- `Table`이 User/Post 도메인별 렌더링 로직을 내부에 포함

이런 구조는 컴포넌트 재사용성을 크게 떨어뜨립니다. 비즈니스 규칙이 변경되면 UI 컴포넌트까지 수정해야 하고, 다른 프로젝트에서는 전혀 사용할 수 없는 컴포넌트가 됩니다.

### 2. 일관성 없는 컴포넌트 API
같은 의미의 props가 컴포넌트마다 다른 이름을 사용하고 있었습니다.

- `FormInput`의 `helpText`, `FormSelect`의 `help`, `FormTextarea`의 `description`
- 크기 조절: 어떤 컴포넌트는 `width`, 어떤 컴포넌트는 `size`

개발자가 매번 각 컴포넌트의 API를 따로 외워야 하고, 팀원마다 다르게 사용할 가능성이 높습니다.

### 3. 혼재된 스타일링 방식과 디자인 토큰 부재
인라인 스타일, Tailwind 클래스, 하드코딩된 색상 값이 섞여 있었습니다.

```typescript
// 인라인 스타일
style={{ padding: '10px', backgroundColor: '#007bff' }}

// 하드코딩된 색상
const primaryColor = '#007bff';
const dangerColor = '#d32f2f';
```

디자인 토큰이 없어서 색상, 간격, 타이포그래피가 컴포넌트마다 제각각이고, 일관성 있는 디자인을 유지하기 어려웠습니다.

### 4. Atomic Design 폴더 구조의 실용성 문제
`atoms/`, `molecules/`, `organisms/`로 나뉜 구조가 실제로는 불편했습니다.

- 분류 기준이 모호함 (Card는 atom? molecule?)
- import 경로가 길어짐: `../../../components/atoms/Button`
- 컴포넌트를 찾기 위해 3단계를 거쳐야 함

## 과제를 진행하며 집중하고 고민한 부분

### 1. CVA를 어디까지 적용해야 할까?
과제에서 "CVA를 활용한 variants 패턴 적용"이 요구사항이었는데, shadcn/ui 컴포넌트들이 이미 내부적으로 CVA를 사용하고 있었습니다.

**고민했던 점:**
- shadcn/ui 컴포넌트를 그대로 사용하면 CVA를 "활용"한 게 아닌 건 아닐까?
- 모든 커스텀 컴포넌트에 CVA를 적용해야 할까?
- 아니면 대표적인 컴포넌트 하나만 시연하면 될까?

**결정:**
- `PageHeader` 컴포넌트를 새로 만들어 CVA variants 패턴을 직접 구현
- size (`sm`, `md`, `lg`), align (`left`, `center`, `right`) variants 추가
- shadcn/ui의 Button, Badge 등은 이미 CVA를 잘 활용하고 있으므로 참고 사례로 활용

### 2. shadcn/ui 컴포넌트를 직접 수정할까, 감싸서 사용할까?
shadcn/ui는 복사-붙여넣기 방식이라 직접 수정이 가능합니다. 하지만 프로젝트 요구사항에 맞게 커스터마이징할 때 고민이 있었습니다.

**고민했던 점:**
- Button에 cursor-pointer를 추가하고 싶은데, 직접 수정해야 할까?
- 아니면 wrapper 컴포넌트를 만들어야 할까?
- 나중에 shadcn/ui 업데이트를 받으려면 어떻게 해야 할까?

**결정:**
- 기본적인 스타일 수정(cursor-pointer 등)은 직접 수정
- shadcn/ui의 철학이 "복사해서 자기 것으로 만들기"이므로 직접 수정이 맞다고 판단
- 하지만 도메인별 로직이 필요한 경우는 별도 컴포넌트로 분리 (예: `UserFormFields`, `PostFormFields`)

### 3. Atomic Design을 폴더 구조에 반영해야 할까?
과제에서 "Atomic Design의 개념을 이해하되, 폴더 구조는 실용적으로"라는 방향을 제시했습니다.

**고민했던 점:**
- Before 패키지처럼 atoms/molecules/organisms로 나눌까?
- shadcn/ui처럼 components/ui로 단순하게 가져갈까?
- 컴포넌트 분류 기준을 어떻게 세울까?

**결정:**
```
components/
├── ui/           # shadcn/ui 기반 재사용 컴포넌트
├── common/       # 프로젝트 공통 컴포넌트 (PageHeader, TabSwitcher)
└── domain/       # 도메인별 컴포넌트 (UserFormFields, PostFormFields)
```
- Atomic Design의 "조합과 재사용" 개념은 이해하되, 폴더는 용도별로 구분
- import 경로를 단순하게 유지
- 컴포넌트를 찾기 쉽게

### 4. Design Token을 어디까지 확장할까?
TailwindCSS 4.0의 `@theme inline`으로 토큰을 정의할 수 있었는데, 범위를 어디까지 할지 고민했습니다.

**고민했던 점:**
- 모든 색상을 토큰화해야 할까?
- 타이포그래피 스케일을 더 세분화해야 할까?
- spacing, border-radius, shadow도 모두 토큰으로 만들까?

**결정:**
- 현재 프로젝트에서 실제로 사용하는 값들 위주로 정의
- Spacing, Typography, Colors, Shadows, Border Radius 기본 구조 구축
- 필요에 따라 나중에 확장 가능하도록 구조만 잡아둠

### 5. 컴포넌트 분리 기준: UI vs 도메인
UI/비즈니스 로직을 분리하려고 했는데, 경계가 애매한 경우가 많았습니다.

**고민했던 점:**
- `UserFormFields`는 UI 컴포넌트일까, 도메인 컴포넌트일까?
- Form 필드 배치는 UI인데, 필드 종류는 도메인 지식 아닌가?
- 이런 컴포넌트를 어떻게 분류하고 관리해야 할까?

**결정:**
- **순수 UI 컴포넌트** (`components/ui`): 도메인을 전혀 모르는 재사용 컴포넌트
  - Button, Input, Card, Badge 등
- **도메인 컴포넌트** (`components/domain`): 특정 도메인 지식을 포함하지만 UI 위주
  - UserFormFields, PostFormFields
- **비즈니스 로직**: 커스텀 훅으로 완전히 분리
  - useManagementData, useEntityStats

## 사용한 기술 스택 경험

### TailwindCSS 4.0
처음 사용해봤는데, CSS 변수 기반의 Design Token 시스템이 인상적이었습니다.

- `@theme inline`으로 토큰을 정의하면 자동으로 유틸리티 클래스가 생성됨
- oklch 색상 공간을 사용해서 일관된 색상 팔레트 구축
- Before 패키지의 하드코딩된 색상값들을 모두 토큰으로 전환할 수 있었습니다

### shadcn/ui의 설계 철학
"복사-붙여넣기" 방식이 처음에는 이상했는데, 사용해보니 장점이 많았습니다.

- npm 패키지가 아니라서 버전 관리 걱정 없음
- 내 프로젝트에 코드가 들어오니 완전히 커스터마이징 가능
- Radix UI 기반이라 접근성이 기본으로 잘 갖춰져 있음
- 내부적으로 CVA를 사용해서 variants 패턴을 배우기 좋았습니다

### CVA (Class Variance Authority)
타입 안전한 variants 패턴을 구현할 수 있다는 점이 가장 좋았습니다.

```typescript
const pageHeaderVariants = cva("mb-6", {
  variants: {
    size: {
      sm: "[&_h1]:text-xl",
      md: "[&_h1]:text-2xl",
      lg: "[&_h1]:text-3xl",
    },
  },
});

// TypeScript가 자동으로 타입 추론
type PageHeaderProps = VariantProps<typeof pageHeaderVariants>;
```

### Storybook
컴포넌트를 독립적으로 개발하고 문서화할 수 있어서 좋았습니다.

- Dark Mode 같은 다양한 상태를 빠르게 확인 가능
- 페이지를 렌더링하지 않고도 컴포넌트만 테스트 가능
- autodocs로 자동 문서 생성

## 배운 점

### 1. Atomic Design: 개념과 실무의 차이
Atomic Design은 "컴포넌트 조합과 재사용"이라는 개념 자체는 훌륭하지만, 폴더 구조로 강제하면 오히려 불편하다는 걸 배웠습니다.

- 중요한 건 컴포넌트의 "재사용성"과 "조합 가능성"
- 폴더 구조는 팀과 프로젝트에 맞게 실용적으로
- shadcn/ui도 단순한 `components/ui` 구조를 사용

### 2. 디자인 시스템은 일관성이 생명
Before 패키지에서는 같은 "주요 버튼"인데도 컴포넌트마다 색상이 미묘하게 달랐습니다. Design Token 시스템을 구축하니 자연스럽게 일관성이 생겼습니다.

### 3. 타입 안전성의 중요성
CVA를 사용하면 variants가 TypeScript 타입으로 관리되어, 잘못된 variant를 사용하면 컴파일 타임에 에러가 발생합니다. 런타임 에러를 사전에 방지할 수 있어서 안전합니다.

### 4. 컴포넌트 API 일관성
shadcn/ui 컴포넌트들을 보면서 일관된 API 설계의 중요성을 배웠습니다.
- 모든 컴포넌트가 `variant`, `size` 같은 일관된 prop 이름 사용
- 개발자가 한 번 배우면 다른 컴포넌트도 쉽게 사용 가능

## 아쉬운 점과 개선하고 싶은 부분

### 1. CVA 적용 범위
PageHeader 하나만 CVA로 구현했는데, TabSwitcher나 StatsGrid 같은 다른 커스텀 컴포넌트에도 적용해볼 수 있었을 것 같습니다.

### 2. Design Token 확장
현재는 기본적인 토큰만 정의했는데, 실무에서는 더 세밀한 토큰 시스템이 필요할 것 같습니다.
- 더 다양한 색상 팔레트 (50-900 scale)
- 타이포그래피 line-height, letter-spacing
- 애니메이션 duration, easing

### 3. Storybook Interaction Tests
현재는 Stories만 작성했는데, Interaction Tests를 추가하면 컴포넌트 동작을 자동으로 검증할 수 있을 것 같습니다.

## 결론

이번 과제를 통해 레거시 시스템의 문제점을 명확히 이해하고, 현대적인 디자인 시스템 구축 방법을 배울 수 있었습니다. 특히 "이론(Atomic Design)"과 "실무(실용적인 구조)"의 균형을 맞추는 게 중요하다는 걸 배웠습니다.

TailwindCSS, CVA, shadcn/ui 같은 도구들이 단순히 편리한 게 아니라, 일관성, 타입 안전성, 유지보수성을 높여준다는 점을 실제로 경험할 수 있었습니다.
