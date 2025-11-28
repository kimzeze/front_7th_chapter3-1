# Chapter3-1. UI 컴포넌트 모듈화와 디자인 시스템

## 📋 과제 개요

레거시 디자인 시스템의 문제점을 파악하고, 현대적인 디자인 시스템(TailwindCSS + shadcn/ui + Storybook)으로 마이그레이션하는 과제입니다.

### 핵심 목표

1. **레거시 코드의 점진적 마이그레이션 경험**
   - 기존 시스템을 유지하면서 새로운 기술 도입
   - 실무에서 자주 마주치는 상황 체험

2. **Atomic Design의 이론과 실무 괴리 이해**
   - 잘못된 Atomic Design 적용 사례 파악
   - 실용적인 컴포넌트 구조 설계

3. **현대적 디자인 시스템 도구 학습**
   - TailwindCSS: 유틸리티 우선 CSS
   - CVA: 타입 안전한 variants 관리
   - shadcn/ui: 접근성 좋은 헤드리스 UI
   - Storybook: 컴포넌트 문서화

---

## 🎯 핵심 학습 포인트

### 1. 레거시 시스템의 문제점

#### (1) 일관성 없는 컴포넌트 API
```tsx
// 각 컴포넌트마다 다른 props 이름
<FormInput width="full" helpText="도움말" />
<FormSelect size="md" help="다른 이름" />
<FormTextarea variant="bordered" description="또 다른 이름" />
```

#### (2) 혼재된 스타일링 방식
- 인라인 스타일: `style={{ padding: '10px' }}`
- CSS Modules: `className={styles.card}`
- 하드코딩된 색상: `#007bff`, `#d32f2f`

#### (3) 타입 안전성 부족
- 느슨한 타입 정의
- 수동 validation
- 에러 처리 불일치

#### (4) 접근성 이슈
- 불완전한 ARIA 라벨
- 키보드 네비게이션 미비
- 스크린 리더 지원 부족

### 2. Atomic Design - 이론과 현실의 괴리

#### 현재 구조 (before)
```
components/
├── atoms/      # Button, Badge
├── molecules/  # FormInput, FormSelect
└── organisms/  # Header, Card, Modal, Table
```

#### ⚠️ 실무에서의 문제점

1. **분류 기준이 모호함**
   - Card는 atom? molecule? 내용에 따라 달라짐
   - FormInput은 molecule이지만 단독으로도 충분히 사용 가능

2. **폴더 구조가 오히려 불편함**
   - 컴포넌트를 찾기 위해 3단계를 거쳐야 함
   - import 경로가 길어짐: `../../../components/atoms/Button`
   - 컴포넌트를 옮길 때마다 모든 import 수정 필요

3. **개발 속도 저하**
   - "이게 atom인가 molecule인가?" 고민하는 시간 낭비
   - 팀원마다 분류 기준이 다를 수 있음

#### ✅ 과제의 목표

- Atomic Design의 개념 자체를 이해하기 (컴포넌트 조합과 재사용성)
- 하지만 **폴더 구조는 더 실용적으로** 설계
- shadcn/ui도 `components/ui/` 단순 구조를 사용함을 주목

---

## 📂 프로젝트 구조

```
packages/
├── before/          # 레거시 시스템 (분석 대상)
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/      # Button, Badge
│   │   │   ├── molecules/  # FormInput, FormSelect
│   │   │   └── organisms/  # Header, Card, Modal, Table
│   │   ├── pages/
│   │   │   └── PostManagement.tsx
│   │   └── App.tsx
│   └── package.json
│
└── after/           # 현대적 디자인 시스템 (구현 목표)
    ├── src/
    │   ├── components/
    │   │   └── ui/         # shadcn/ui 컴포넌트
    │   ├── tokens/         # 디자인 토큰
    │   ├── hooks/          # Custom Hooks
    │   └── stories/        # Storybook stories
    ├── .storybook/
    └── package.json
```

---

## ✅ 필수 구현 사항

### 1. shadcn/ui 컴포넌트 설치
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add form
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
```

### 2. TailwindCSS + CVA로 Variants 만들기

**Before (문제):**
```tsx
const getButtonStyle = (variant: string) => {
  if (variant === 'primary') return { backgroundColor: '#007bff' };
  // ...
};
```

**After (목표):**
```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

### 3. Storybook 설정

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

### 4. PostManagement 페이지 마이그레이션
- before의 PostManagement 페이지를 after로 마이그레이션
- 레거시 컴포넌트를 shadcn/ui 컴포넌트로 교체
- 비즈니스 로직과 UI 분리

### 5. README에 before/after 비교 및 개선사항 문서화
- 레거시 시스템의 문제점
- 해결 방법 및 개선 사항
- 기술 선택 이유

---

## 🎨 심화 구현 사항

### 1. Dark Mode 지원
- TailwindCSS dark mode 활성화
- Dark mode toggle 버튼 구현
- 디자인 토큰에 dark mode 색상 정의

### 2. 디자인 토큰 체계화
- 색상 토큰 (semantic colors)
- 타이포그래피 토큰
- 간격 토큰
- 그림자 토큰

---

## 🚀 작업 순서

### 1단계: 환경 설정 확인
```bash
cd after
npm install
npm run dev  # 개발 서버 실행 확인
```

### 2단계: Before 코드 분석
- 레거시 컴포넌트 구조 파악
- 문제점 리스트업
- 마이그레이션 우선순위 결정

### 3단계: shadcn/ui 컴포넌트로 마이그레이션
1. **Button 마이그레이션**
   - before/atoms/Button.tsx 분석
   - after/components/ui/button.tsx 확인
   - 레거시 Button을 shadcn Button으로 교체

2. **Form 관련 컴포넌트**
   - Input, Select, Textarea 마이그레이션
   - FormInput, FormSelect 등을 shadcn 컴포넌트로 교체

3. **복잡한 컴포넌트**
   - Card, Table, Modal, Alert 마이그레이션

4. **PostManagement 페이지**
   - 페이지 전체 마이그레이션
   - 비즈니스 로직 분리

### 4단계: 테스트 확인
```bash
npm run test
```
- 테스트가 실패하면 코드를 수정할지, 테스트를 수정할지 결정
- 기준: 기획이 변하지 않았다면 테스트 유지, 기술 변경으로 명세가 바뀌었다면 테스트 수정

### 5단계: Storybook 설정
```bash
npx storybook@latest init
```
- 주요 컴포넌트 stories 작성
- 다양한 variants와 상태 문서화

### 6단계: Dark Mode 구현 (선택)
- `tailwind.config.js`에 dark mode 설정
- 토글 버튼 구현
- 모든 컴포넌트에 dark mode 스타일 적용

### 7단계: 문서화
- README 작성 (before/after 비교)
- 마이그레이션 가이드 작성
- 기술 선택 근거 작성

---

## 💡 주요 Q&A

### Q1. 레거시 디자인을 그대로 유지해야 하나요?

**A**: 아니요. shadcn/ui 기본 디자인을 사용해도 됩니다.
- 토큰화가 먼저입니다. 토큰을 만들고 디자인을 하는 것이지, 디자인을 하고 토큰화 시키는 게 아닙니다.
- 실무에서는 구 디자인이 좋지 않아서 새로 만드는 경우가 많습니다.

### Q2. 테스트 코드가 실패하면 어떻게 해야 하나요?

**A**: 기준을 정해야 합니다.
- **리팩토링**: 기획이 변하지 않는데 코드를 수정 → 테스트 유지
- **고도화**: 기술 변경으로 명세가 바뀜 → 테스트 수정

예: `querySelector('select')`로 찾던 테스트가 shadcn Select(button 기반)로 변경되면 테스트 수정이 필요합니다.

### Q3. 디자인 토큰을 어느 범위까지 적용해야 하나요?

**A**: 일단 시작하고 AI의 도움을 받으세요.
- 모든 값을 토큰화하면 오버엔지니어링
- 하지만 일관성을 위해 충분한 토큰화 필요
- 네이밍 컨벤션을 정하고 AI에게 위임
- 참고: Figma Design System, Wanted Design System

**색상 토큰 예시:**
```
colors:
  semantic:
    - error
    - success
    - warning
    - info
  primitive:
    - gray-50, gray-100, ...
    - blue-50, blue-100, ...
```

### Q4. Atomic Design 폴더 구조를 유지해야 하나요?

**A**: 아니요. 더 실용적인 구조를 사용하세요.
- Atomic Design의 **개념**(컴포넌트 조합과 재사용성)은 이해하되
- **폴더 구조**는 개발 편의성을 우선
- shadcn/ui도 `components/ui/` 단순 구조를 사용

---

## 📚 참고 자료

### TailwindCSS
- [TailwindCSS 공식 문서](https://tailwindcss.com)
- [TailwindCSS v4.0 새로운 기능](https://tailwindcss.com/docs/v4-beta)

### CVA (Class Variance Authority)
- [CVA 공식 문서](https://cva.style)
- [CVA 예제 모음](https://cva.style/docs/examples)

### shadcn/ui
- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)

### Storybook
- [Storybook 공식 문서](https://storybook.js.org)
- [Storybook Args와 Controls](https://storybook.js.org/docs/react/writing-stories/args)
- [Accessibility addon](https://storybook.js.org/addons/@storybook/addon-a11y)

### React Hook Form + Zod
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [React Hook Form + Zod 통합](https://github.com/react-hook-form/resolvers#zod)

### Atomic Design
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com)
- [Atomic Design과 React](https://atomicdesign.bradfrost.com/chapter-5/)

### Design Systems
- [Figma Wanted Design System](https://www.figma.com/design/PMpnWAAK1cKI0gbsuBQ2tJ/Wanted-Design-System)
- [Figma 연습용 파일](https://www.figma.com/community/file/1055785285964148921)

---

## 🎓 과제의 진짜 의도

### 1. 점진적 마이그레이션 경험
- 실무에서 자주 마주치지만 경험하기 어려운 작업
- 레거시 코드 환경에서 최신 기술 도입하기
- 안정성을 유지하면서 개선하기

### 2. "설계" 챕터의 핵심
- UI와 비즈니스 로직 분리의 중요성
- 컴포넌트 API 설계
- 일관성 있는 시스템 구축

### 3. 기술 생태계 이해
- **배경과 역사**: 왜 이 기술들이 나왔는가?
- **범주**: 어떤 문제를 해결하는가?
- **대표주자와 대안**: 무엇이 있고 차별점은 무엇인가?

---

## 📝 그밖에 해보면 좋을 것들

과제에는 포함되지 않았지만, 실무에서 유용한 패턴들:

- [ ] Figma 디자인 토큰 추출 후 적용
- [ ] Figma Design to Code 플러그인 사용
- [ ] Figma Icon to SVG + CDN 시스템 구축
- [ ] 복잡한 컴포넌트 직접 구현 (AutoComplete, DatePicker)
- [ ] Monorepo 디자인 시스템 패키지 구축 및 배포
- [ ] Storybook Interaction Tests
- [ ] Storybook A11y addon으로 접근성 검증
- [ ] React Hook Form + Zod로 Form 구현

---

## 🏁 제출 체크리스트

### 필수
- [ ] after 패키지에 디자인 시스템 구현 완료
- [ ] PostManagement 페이지 마이그레이션 완료
- [ ] Storybook에 주요 컴포넌트 stories 작성
- [ ] README에 before/after 비교 및 개선사항 문서화

### 심화
- [ ] Dark mode 지원
- [ ] Dark mode toggle 버튼
- [ ] 디자인 토큰 체계화
- [ ] 접근성 개선

---

## 💬 마지막 조언

> "디자인 시스템은 완벽을 추구하는 것이 아니라, 일관성과 효율성을 추구하는 것입니다."

- 완벽한 토큰화보다는 실용적인 토큰화
- 복잡한 폴더 구조보다는 단순하고 명확한 구조
- 모든 것을 처음부터 만들기보다는 검증된 도구 활용
- 문서화는 미래의 나와 팀원을 위한 투자

**화이팅! 🚀**
