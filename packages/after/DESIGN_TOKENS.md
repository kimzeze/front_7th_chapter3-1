# 디자인 토큰 가이드

## 🎯 디자인 토큰이란?

디자인 토큰은 **제한된 선택지**를 제공하여 **일관성**을 확보하는 체계입니다.

### ❌ 잘못된 접근
```tsx
// 모든 개발자가 마음대로...
padding: "10px"
padding: "12px"
padding: "15px"
padding: "13px"  // 또 다른 값...
```

### ✅ 올바른 접근
```tsx
// 정해진 스케일만 사용!
p-3  // 12px
p-4  // 16px
p-5  // 20px
// 13px, 15px 같은 값은 가장 가까운 표준값으로 타협
```

---

## 📏 Spacing (여백) - 4px 기준

### 표준 스케일

| 토큰 | 값 | px | Tailwind | 사용처 |
|------|----|----|----------|--------|
| `spacing-0` | 0 | 0px | `p-0` | 여백 없음 |
| `spacing-1` | 0.25rem | **4px** | `p-1` | 최소 여백 |
| `spacing-2` | 0.5rem | **8px** | `p-2` | 작은 여백 |
| `spacing-3` | 0.75rem | **12px** | `p-3` | 중간 여백 |
| `spacing-4` | 1rem | **16px** | `p-4` | 기본 여백 |
| `spacing-5` | 1.25rem | **20px** | `p-5` | 큰 여백 |
| `spacing-6` | 1.5rem | **24px** | `p-6` | 섹션 여백 |
| `spacing-8` | 2rem | 32px | `p-8` |  |
| `spacing-10` | 2.5rem | 40px | `p-10` |  |
| `spacing-12` | 3rem | 48px | `p-12` |  |
| `spacing-16` | 4rem | 64px | `p-16` |  |
| `spacing-20` | 5rem | 80px | `p-20` |  |

### 레거시 값 마이그레이션 (타협)

| 레거시 | 표준값 | Tailwind | 설명 |
|--------|--------|----------|------|
| `5px` | **4px** | `p-1` | 가장 가까운 값으로 |
| `10px` | **12px** | `p-3` | 4px 단위로 올림 |
| `15px` | **16px** | `p-4` | 4px 단위로 올림 |
| `18px` | **16px** or **20px** | `p-4` or `p-5` | 상황에 따라 선택 |

> 💡 **원칙**: "완벽한 복원"보다 "일관성 있는 시스템"이 중요합니다!

---

## 🔤 Typography (타이포그래피)

### Font Size

| 토큰 | 값 | px | Tailwind | 사용처 |
|------|----|----|----------|--------|
| `font-size-xs` | 0.75rem | 12px | `text-xs` | 작은 라벨, 캡션 |
| `font-size-sm` | 0.875rem | 14px | `text-sm` | 일반 텍스트 |
| `font-size-base` | 1rem | 16px | `text-base` | 본문 |
| `font-size-lg` | 1.125rem | 18px | `text-lg` | 큰 본문 |
| `font-size-xl` | 1.25rem | 20px | `text-xl` | 소제목 |
| `font-size-2xl` | 1.5rem | 24px | `text-2xl` | 제목 |
| `font-size-3xl` | 1.875rem | 30px | `text-3xl` | 큰 제목 |
| `font-size-4xl` | 2.25rem | 36px | `text-4xl` | 메인 제목 |

### Font Weight

| 토큰 | 값 | Tailwind | 사용처 |
|------|-----|----------|--------|
| `font-weight-normal` | 400 | `font-normal` | 일반 |
| `font-weight-medium` | 500 | `font-medium` | 강조 |
| `font-weight-semibold` | 600 | `font-semibold` | 제목 |
| `font-weight-bold` | 700 | `font-bold` | 진한 제목 |

### Line Height

| 토큰 | 값 | Tailwind | 사용처 |
|------|-----|----------|--------|
| `line-height-tight` | 1.25 | `leading-tight` | 제목 |
| `line-height-normal` | 1.5 | `leading-normal` | 본문 |
| `line-height-relaxed` | 1.75 | `leading-relaxed` | 긴 본문 |

---

## 🎨 Border Radius (모서리 둥글기)

### 표준 스케일

| 토큰 | 값 | px | Tailwind | 사용처 |
|------|----|----|----------|--------|
| `radius-sm` | 0.25rem | 4px | `rounded` | 작은 요소 |
| `radius-md` | 0.375rem | 6px | `rounded-md` | 중간 요소 |
| `radius-lg` | 0.5rem | 8px | `rounded-lg` | 일반 카드 |
| `radius-xl` | 0.75rem | 12px | `rounded-xl` | 큰 카드 |
| `radius-2xl` | 1rem | 16px | `rounded-2xl` | 매우 큰 카드 |

> 💡 **레거시의 3px는 4px (rounded)로 타협**

---

## 📦 Container (컨테이너)

| 토큰 | 값 | Tailwind | 사용처 |
|------|-----|----------|--------|
| `container-sm` | 640px | `max-w-sm` | 모바일 |
| `container-md` | 768px | `max-w-md` | 태블릿 |
| `container-lg` | 1024px | `max-w-lg` | 작은 데스크톱 |
| `container-xl` | 1280px | `max-w-xl` | 일반 데스크톱 |
| `container-2xl` | 1536px | `max-w-2xl` | 큰 데스크톱 |

> 💡 **레거시의 1200px는 1280px (max-w-xl)로 타협**

---

## 🌑 Shadows (그림자)

| 토큰 | Tailwind | 사용처 |
|------|----------|--------|
| `shadow-sm` | `shadow-sm` | 작은 카드 |
| `shadow-md` | `shadow-md` | 일반 카드 |
| `shadow-lg` | `shadow-lg` | 드롭다운 |
| `shadow-xl` | `shadow-xl` | 모달 |

---

## 🎨 Colors (색상)

Semantic colors를 사용합니다:

| 용도 | Tailwind 클래스 | 예시 |
|------|----------------|------|
| 배경 | `bg-background` | 페이지 배경 |
| 텍스트 | `text-foreground` | 일반 텍스트 |
| 주요 액션 | `bg-primary text-primary-foreground` | 버튼 |
| 보조 액션 | `bg-secondary text-secondary-foreground` | 취소 버튼 |
| 위험 | `bg-destructive text-destructive-foreground` | 삭제 버튼 |
| 비활성 | `bg-muted text-muted-foreground` | 비활성 요소 |
| 테두리 | `border-border` | 구분선 |

---

## 📝 실전 마이그레이션 예시

### 예시 1: 통계 카드

#### Before (레거시)
```tsx
<div style={{
  padding: "12px 15px",    // 비표준 값
  marginBottom: "15px",    // 비표준 값
  background: "#e3f2fd",   // 하드코딩
  border: "1px solid #90caf9",
  borderRadius: "3px"      // 비표준 값
}}>
  <div style={{ fontSize: "12px", color: "#666" }}>라벨</div>
  <div style={{ fontSize: "24px", fontWeight: "bold" }}>값</div>
</div>
```

#### After (타협하여 표준값 사용)
```tsx
<div className="p-3 px-4 mb-4 bg-blue-50 border border-blue-200 rounded">
  {/*
    타협한 값:
    - padding: 12px 15px → p-3 px-4 (12px 16px)
    - marginBottom: 15px → mb-4 (16px)
    - borderRadius: 3px → rounded (4px)
  */}
  <div className="text-xs text-muted-foreground">라벨</div>
  <div className="text-2xl font-bold">값</div>
</div>
```

> **시각적 차이**: 거의 없음! (1~2px 차이는 눈에 안 띔)
> **이득**: 일관성 확보, 유지보수 쉬움, 다크모드 자동 지원

---

### 예시 2: 페이지 레이아웃

#### Before
```tsx
<div style={{ minHeight: "100vh", background: "#f0f0f0" }}>
  <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
    {/* content */}
  </div>
</div>
```

#### After
```tsx
<div className="min-h-screen bg-muted/30">
  <div className="max-w-7xl mx-auto p-5">
    {/*
      타협한 값:
      - maxWidth: 1200px → max-w-7xl (1280px)
      - padding: 20px → p-5 (20px) ✅ 정확히 맞음!
    */}
  </div>
</div>
```

---

### 예시 3: 탭 버튼

#### Before
```tsx
<button style={{
  padding: "8px 16px",
  fontSize: "14px",
  borderRadius: "3px"
}}>
```

#### After
```tsx
<button className="px-4 py-2 text-sm rounded">
  {/*
    - padding: 8px 16px → px-4 py-2 ✅ 정확히 맞음!
    - fontSize: 14px → text-sm ✅ 정확히 맞음!
    - borderRadius: 3px → rounded (4px)
  */}
</button>
```

---

## 💡 타협의 원칙

### 1. 1~2px 차이는 무시
```
10px → 12px (2px 차이) ✅ OK
10px → 16px (6px 차이) ❌ 너무 큼, 12px 선택
```

### 2. 가까운 값으로 올림/내림
```
13px → 12px (p-3) 또는 16px (p-4)
15px → 16px (p-4)
18px → 16px (p-4) 또는 20px (p-5)
```

### 3. 컨텍스트 고려
```tsx
// 버튼 안쪽 여백: 타이트하게
padding: "10px" → p-2 (8px) ✅

// 카드 여백: 여유있게
padding: "10px" → p-3 (12px) ✅
```

### 4. 시각적 테스트
타협한 값으로 적용 후 **실제로 보고** 판단:
- 괜찮으면 ✅ 그대로 사용
- 너무 좁으면 → 한 단계 위로
- 너무 넓으면 → 한 단계 아래로

---

## 🎯 핵심 철학

### "픽셀 퍼펙트"보다 "시스템"이 중요

```
❌ 나쁜 예:
  - 모든 레거시 값을 그대로 토큰으로 만듦
  - 10px, 13px, 15px, 17px... 무한 증가

✅ 좋은 예:
  - 제한된 선택지: 4, 8, 12, 16, 20, 24...
  - 레거시 값은 가장 가까운 표준값으로
  - 일관성 > 완벽한 복원
```

### 디자인 시스템의 가치

1. **일관성**: 모든 카드가 같은 여백 사용
2. **예측 가능**: 개발자가 어떤 값을 쓸지 고민 안 함
3. **확장 가능**: 새 컴포넌트도 같은 규칙
4. **유지보수**: 한 곳만 수정하면 전체 적용

---

## 🚀 다음 단계

1. **인라인 스타일 제거**
   - 레거시 컴포넌트의 `style={}`을 Tailwind 클래스로

2. **타협 적용**
   - 10px → `p-3` (12px)
   - 15px → `p-4` (16px)
   - 시각적으로 확인하고 조정

3. **일관성 체크**
   - 같은 용도는 같은 여백 사용
   - 카드 padding은 모두 `p-4`로 통일

4. **다크모드**
   - 토큰 기반이라 자동 지원!

---

## 📚 참고 자료

- [Tailwind CSS Spacing](https://tailwindcss.com/docs/customizing-spacing)
- [Material Design 4dp Grid](https://material.io/design/layout/spacing-methods.html)
- [8-Point Grid System](https://spec.fm/specifics/8-pt-grid)

---

**기억하세요**:
> "완벽한 픽셀 복원"보다 "일관성 있는 시스템"이 더 중요합니다! 🎯
