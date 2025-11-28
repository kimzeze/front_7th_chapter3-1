# 레거시 코드 문제점 분석

## 🚨 핵심 문제점 요약

### 1. 관심사의 분리(Separation of Concerns) 실패

**가장 큰 문제**: UI 컴포넌트가 비즈니스 로직을 알고 있음

#### 문제 사례

**Button.tsx (before/components/atoms/Button.tsx:4-75)**
```typescript
// 🚨 UI 컴포넌트가 도메인 타입을 알고 있음
interface ButtonProps {
  entityType?: 'user' | 'post';  // ❌ 비즈니스 도메인 의존
  action?: 'create' | 'edit' | 'delete' | 'publish' | 'archive';
  entity?: any; // ❌ 엔티티 객체를 직접 받음
}

// 🚨 UI 컴포넌트가 비즈니스 규칙을 판단함
if (entityType === 'user' && action === 'delete' && entity.role === 'admin') {
  actualDisabled = true;  // ❌ "관리자는 삭제 불가" 비즈니스 규칙
}
```

**왜 문제인가?**
- Button은 재사용 가능한 UI 컴포넌트여야 함
- User, Post 같은 도메인 개념을 몰라야 함
- 비즈니스 규칙이 변경되면 UI 컴포넌트를 수정해야 함
- 다른 프로젝트에서 재사용 불가능

**FormInput.tsx (before/components/molecules/FormInput.tsx:36-90)**
```typescript
// 🚨 UI 컴포넌트가 비즈니스 규칙을 검증함
const validateField = (val: string) => {
  if (fieldType === 'username') {
    // ❌ 예약어 체크 - 비즈니스 규칙
    const reservedWords = ['admin', 'root', 'system'];
    if (reservedWords.includes(val.toLowerCase())) {
      setInternalError('예약된 사용자명입니다');
    }
  }

  // ❌ User 엔티티의 이메일은 회사 도메인만
  if (entityType === 'user') {
    if (!val.endsWith('@company.com')) {
      setInternalError('회사 이메일만 사용 가능합니다');
    }
  }
}
```

**Table.tsx (before/components/organisms/Table.tsx:107-202)**
```typescript
// 🚨 Table 컴포넌트가 도메인별 렌더링 로직을 알고 있음
const renderCell = (row: any, columnKey: string) => {
  // ❌ User 도메인 지식
  if (entityType === 'user') {
    if (columnKey === 'role') {
      return <Badge userRole={value} showIcon />;
    }
  }

  // ❌ Post 도메인 지식
  if (entityType === 'post') {
    if (columnKey === 'status') {
      return <Badge status={value} showIcon />;
    }
  }
}
```

---

### 2. 일관성 없는 컴포넌트 API

같은 목적의 props가 컴포넌트마다 다른 이름을 사용:

```typescript
// FormInput
<FormInput width="full" helpText="도움말" />

// FormSelect
<FormSelect size="md" help="다른 이름" />

// FormTextarea
<FormTextarea variant="bordered" description="또 다른 이름" />
```

**문제점**:
- 개발자가 매번 문서를 찾아봐야 함
- 실수 가능성 증가
- 학습 곡선 증가

---

### 3. 혼재된 스타일링 방식

**ManagementPage.tsx (before/pages/ManagementPage.tsx:225-370)**

세 가지 스타일링 방식이 혼재:

#### (1) 인라인 스타일
```typescript
<div style={{
  minHeight: '100vh',
  background: '#f0f0f0'  // ❌ 하드코딩
}}>
```

#### (2) CSS 클래스
```typescript
<Button className="btn btn-primary">
```

#### (3) 하드코딩된 색상 값
```typescript
const stats = {
  stat1: { color: '#2e7d32' },  // ❌ 녹색?
  stat2: { color: '#ed6c02' },  // ❌ 주황색?
  stat3: { color: '#d32f2f' },  // ❌ 빨강?
};
```

**before/styles/components.css (1-604줄)**
```css
.btn-primary {
  background-color: #1976d2;  /* ❌ 하드코딩 */
  border-color: #1565c0;
}

.btn-danger {
  background-color: #d32f2f;  /* ❌ 하드코딩 */
}
```

**문제점**:
- 디자인 토큰 없음
- 색상 일관성 보장 불가
- 다크모드 지원 불가능
- 디자인 변경 시 전체 코드 수정 필요

---

### 4. 거대한 God Component

**ManagementPage.tsx (before/pages/ManagementPage.tsx:1-647)**

**문제점**:
- **647줄**의 단일 컴포넌트
- 23개의 상태 변수
- UI + 비즈니스 로직 + 데이터 fetching 모두 포함
- 재사용 불가능
- 테스트 어려움

#### 상태 관리
```typescript
// 23개의 상태!
const [entityType, setEntityType] = useState<EntityType>('post');
const [data, setData] = useState<Entity[]>([]);
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
const [showSuccessAlert, setShowSuccessAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState('');
const [showErrorAlert, setShowErrorAlert] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [formData, setFormData] = useState<any>({});
// ...
```

#### 비즈니스 로직
```typescript
// 데이터 로딩
const loadData = async () => { /* ... */ };

// CRUD 작업
const handleCreate = async () => { /* ... */ };
const handleEdit = (item: Entity) => { /* ... */ };
const handleUpdate = async () => { /* ... */ };
const handleDelete = async (id: number) => { /* ... */ };
const handleStatusAction = async (id: number, action: string) => { /* ... */ };

// 통계 계산
const getStats = () => { /* ... */ };
```

#### 중복된 폼 코드 (415-643줄)
```typescript
{entityType === 'user' ? (
  <>
    <FormInput name="username" ... />
    <FormInput name="email" ... />
    <FormSelect name="role" ... />
    <FormSelect name="status" ... />
  </>
) : (
  <>
    <FormInput name="title" ... />
    <FormInput name="author" ... />
    <FormSelect name="category" ... />
    <FormTextarea name="content" ... />
  </>
)}
```

동일한 폼 코드가 **Create Modal**과 **Edit Modal**에 중복됨

---

### 5. 타입 안전성 부족

```typescript
const [formData, setFormData] = useState<any>({});  // ❌ any 타입

interface TableProps {
  data?: any[];  // ❌ any 타입
}

const renderCell = (row: any, columnKey: string) => {  // ❌ any 타입
  // ...
}
```

**문제점**:
- 타입 체크 불가능
- 런타임 에러 가능성
- IDE 자동완성 지원 안됨
- 리팩토링 어려움

---

### 6. 접근성(Accessibility) 이슈

#### (1) 버튼의 시맨틱 부족
```typescript
<button
  onClick={() => setEntityType('post')}
  style={{ /* 인라인 스타일만 */ }}
>
  게시글
</button>
```

**문제점**:
- ARIA 라벨 없음
- 키보드 네비게이션 고려 안됨
- 스크린 리더 지원 부족

#### (2) Modal의 Focus 관리 부족
Modal 컴포넌트에 focus trap 없음

#### (3) 폼 에러 처리
```typescript
<span className="form-helper-text error">
  {displayError}
</span>
```
- `role="alert"` 없음
- ARIA로 input과 연결 안됨

---

### 7. Atomic Design 폴더 구조의 문제

```
components/
├── atoms/      # Button, Badge
├── molecules/  # FormInput, FormSelect
└── organisms/  # Header, Card, Modal, Table
```

**문제점**:

#### (1) 분류 기준 모호
- Card는 atom? molecule? organism?
- FormInput은 molecule이지만 단독 사용 가능

#### (2) 개발 불편
```typescript
// 긴 import 경로
import { Button } from '../../../components/atoms/Button';
import { FormInput } from '../../components/molecules/FormInput';
```

#### (3) 컴포넌트 이동 시
- atom → molecule로 이동하면 모든 import 수정 필요

#### (4) 현실과의 괴리
- "이게 atom인가 molecule인가?" 고민하는 시간 낭비
- 팀원마다 분류 기준 다름

**shadcn/ui의 접근법**:
```
components/
└── ui/         # 모든 컴포넌트를 ui 폴더에
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    └── ...
```

---

## 📊 문제점 심각도 분류

| 문제점 | 심각도 | 영향 범위 | 우선순위 |
|--------|--------|-----------|----------|
| **관심사 분리 실패** | 🔴 높음 | 전체 | 1순위 |
| **거대한 God Component** | 🔴 높음 | ManagementPage | 1순위 |
| **혼재된 스타일링** | 🟡 중간 | 전체 | 2순위 |
| **일관성 없는 API** | 🟡 중간 | Form 컴포넌트 | 2순위 |
| **타입 안전성 부족** | 🟡 중간 | 전체 | 3순위 |
| **Atomic Design 구조** | 🟢 낮음 | 폴더 구조 | 3순위 |
| **접근성 이슈** | 🟡 중간 | UI 컴포넌트 | 4순위 |

---

## 🎯 개선 방향

### 1. 관심사 분리
- **UI 컴포넌트**: 순수하게 UI만 담당
- **비즈니스 로직**: Custom Hooks로 분리
- **도메인 특화 컴포넌트**: 필요시 별도 작성

### 2. ManagementPage 분해
- **Custom Hooks**: `useUserManagement`, `usePostManagement`
- **작은 컴포넌트**: `UserForm`, `PostForm`, `StatsCards`, etc.
- **명확한 책임**: 각 컴포넌트는 하나의 역할만

### 3. 일관된 디자인 시스템
- **TailwindCSS**: 유틸리티 우선 CSS
- **디자인 토큰**: CSS Variables로 일관성 확보
- **shadcn/ui**: 접근성 좋은 기본 컴포넌트

### 4. 타입 안전성
- **명확한 타입 정의**: `any` 제거
- **제네릭 활용**: 재사용 가능한 컴포넌트

---

## 📋 다음 단계: 마이그레이션 전략

### Phase 1: 주석으로 섹션 분리
ManagementPage.tsx를 논리적 섹션으로 구분

### Phase 2: 컴포넌트 추출
각 섹션을 독립적인 컴포넌트로 분리

### Phase 3: shadcn/ui 적용
레거시 UI 컴포넌트를 shadcn/ui로 교체

### Phase 4: 비즈니스 로직 분리
Custom Hooks로 로직 추출

### Phase 5: 테스트 및 검증
기능 동작 확인 및 테스트 수정

---

**다음**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)를 참고하여 단계별로 마이그레이션을 진행하세요.
