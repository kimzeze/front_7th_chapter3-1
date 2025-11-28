# 마이그레이션 가이드: 단계별 리팩토링 전략

## 🎯 제안하신 접근 방식 (아주 좋습니다!)

> "ManagementPage.tsx를 주석으로 먼저 섹션 분리 → 컴포넌트 분리 → 각 컴포넌트를 shadcn/ui로 교체"

이 방식이 좋은 이유:
1. **점진적**: 한 번에 다 바꾸지 않고 단계별로
2. **안전함**: 각 단계마다 테스트 가능
3. **명확함**: 주석으로 구조를 먼저 파악
4. **실무적**: 실제 레거시 리팩토링에서 사용하는 방법

---

## 📋 Step 1: ManagementPage를 주석으로 섹션 분리

### 목표
ManagementPage.tsx의 647줄을 논리적 섹션으로 구분하여 이해하기

### 작업 파일
`after/src/pages/ManagementPage.tsx`

### 주석 구조 (제안)

```typescript
import React, { useState, useEffect } from 'react';
// imports...

export const ManagementPage: React.FC = () => {
  // ============================================================
  // 1. STATE MANAGEMENT
  // ============================================================
  const [entityType, setEntityType] = useState<EntityType>('post');
  const [data, setData] = useState<Entity[]>([]);
  // ... 모든 상태들

  // ============================================================
  // 2. DATA FETCHING & CRUD OPERATIONS
  // ============================================================
  const loadData = async () => { /* ... */ };
  const handleCreate = async () => { /* ... */ };
  const handleEdit = (item: Entity) => { /* ... */ };
  const handleUpdate = async () => { /* ... */ };
  const handleDelete = async (id: number) => { /* ... */ };
  const handleStatusAction = async (id: number, action: string) => { /* ... */ };

  // ============================================================
  // 3. COMPUTED DATA & HELPERS
  // ============================================================
  const getStats = () => { /* ... */ };
  const renderTableColumns = () => { /* ... */ };
  const stats = getStats();

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

        {/* ============================================================ */}
        {/* 4. PAGE TITLE */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '20px' }}>
          <h1>관리 시스템</h1>
          <p>사용자와 게시글을 관리하세요</p>
        </div>

        <div style={{ background: 'white', border: '1px solid #ddd', padding: '10px' }}>

          {/* ============================================================ */}
          {/* 5. TAB SWITCHER (User/Post) */}
          {/* ============================================================ */}
          <div style={{ marginBottom: '15px', borderBottom: '2px solid #ccc' }}>
            <button onClick={() => setEntityType('post')}>게시글</button>
            <button onClick={() => setEntityType('user')}>사용자</button>
          </div>

          <div>
            {/* ============================================================ */}
            {/* 6. CREATE BUTTON */}
            {/* ============================================================ */}
            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
              <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
                새로 만들기
              </Button>
            </div>

            {/* ============================================================ */}
            {/* 7. ALERTS (Success/Error) */}
            {/* ============================================================ */}
            {showSuccessAlert && (
              <div style={{ marginBottom: '10px' }}>
                <Alert variant="success" title="성공" onClose={() => setShowSuccessAlert(false)}>
                  {alertMessage}
                </Alert>
              </div>
            )}
            {showErrorAlert && (
              <div style={{ marginBottom: '10px' }}>
                <Alert variant="error" title="오류" onClose={() => setShowErrorAlert(false)}>
                  {errorMessage}
                </Alert>
              </div>
            )}

            {/* ============================================================ */}
            {/* 8. STATISTICS CARDS */}
            {/* ============================================================ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '15px' }}>
              {/* 전체 통계 */}
              <div style={{ padding: '12px 15px', background: '#e3f2fd' }}>
                <div>전체</div>
                <div>{stats.total}</div>
              </div>
              {/* stat1, stat2, stat3, stat4... */}
            </div>

            {/* ============================================================ */}
            {/* 9. DATA TABLE */}
            {/* ============================================================ */}
            <div style={{ border: '1px solid #ddd', background: 'white', overflow: 'auto' }}>
              <Table
                columns={renderTableColumns()}
                data={data}
                striped
                hover
                entityType={entityType}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={(id) => handleStatusAction(id, 'publish')}
                onArchive={(id) => handleStatusAction(id, 'archive')}
                onRestore={(id) => handleStatusAction(id, 'restore')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 10. CREATE MODAL */}
      {/* ============================================================ */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setFormData({}); }}
        title={`새 ${entityType === 'user' ? '사용자' : '게시글'} 만들기`}
        size="large"
        showFooter
        footerContent={<>...</>}
      >
        {/* 폼 내용 */}
      </Modal>

      {/* ============================================================ */}
      {/* 11. EDIT MODAL */}
      {/* ============================================================ */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setFormData({}); }}
        title={`${entityType === 'user' ? '사용자' : '게시글'} 수정`}
        size="large"
        showFooter
        footerContent={<>...</>}
      >
        {/* 폼 내용 */}
      </Modal>
    </div>
  );
};
```

### ✅ Step 1 체크리스트
- [ ] ManagementPage.tsx 복사 (before → after)
- [ ] 주석으로 11개 섹션 구분
- [ ] 각 섹션의 역할 이해
- [ ] 코드 실행 확인 (여전히 동작해야 함)

---

## 📦 Step 2: 섹션별 컴포넌트 추출

### 목표
주석으로 구분한 섹션을 독립적인 컴포넌트로 분리

### 작업 순서 (쉬운 것부터!)

#### 2-1. PageTitle 컴포넌트 추출

**파일 생성**: `after/src/components/PageTitle.tsx`

```typescript
interface PageTitleProps {
  title: string;
  description: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
        {title}
      </h1>
      <p style={{ color: '#666', fontSize: '14px' }}>
        {description}
      </p>
    </div>
  );
};
```

**ManagementPage.tsx 수정**:
```typescript
import { PageTitle } from '../components/PageTitle';

// 사용
<PageTitle
  title="관리 시스템"
  description="사용자와 게시글을 관리하세요"
/>
```

#### 2-2. TabSwitcher 컴포넌트 추출

**파일 생성**: `after/src/components/TabSwitcher.tsx`

```typescript
interface Tab {
  value: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div style={{ marginBottom: '15px', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          style={{
            padding: '8px 16px',
            marginRight: '5px',
            fontSize: '14px',
            fontWeight: activeTab === tab.value ? 'bold' : 'normal',
            border: '1px solid #999',
            background: activeTab === tab.value ? '#1976d2' : '#f5f5f5',
            color: activeTab === tab.value ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '3px'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
```

**ManagementPage.tsx 수정**:
```typescript
<TabSwitcher
  tabs={[
    { value: 'post', label: '게시글' },
    { value: 'user', label: '사용자' }
  ]}
  activeTab={entityType}
  onTabChange={(value) => setEntityType(value as EntityType)}
/>
```

#### 2-3. StatsCards 컴포넌트 추출

**파일 생성**: `after/src/components/StatsCards.tsx`

```typescript
interface StatCard {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '10px',
      marginBottom: '15px'
    }}>
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            padding: '12px 15px',
            background: stat.bgColor,
            border: `1px solid ${stat.borderColor}`,
            borderRadius: '3px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            {stat.label}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
```

#### 2-4. AlertContainer 컴포넌트 추출

**파일 생성**: `after/src/components/AlertContainer.tsx`

```typescript
import { Alert } from './organisms/Alert';

interface AlertContainerProps {
  successMessage?: string;
  errorMessage?: string;
  onCloseSuccess: () => void;
  onCloseError: () => void;
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
  successMessage,
  errorMessage,
  onCloseSuccess,
  onCloseError
}) => {
  return (
    <>
      {successMessage && (
        <div style={{ marginBottom: '10px' }}>
          <Alert variant="success" title="성공" onClose={onCloseSuccess}>
            {successMessage}
          </Alert>
        </div>
      )}
      {errorMessage && (
        <div style={{ marginBottom: '10px' }}>
          <Alert variant="error" title="오류" onClose={onCloseError}>
            {errorMessage}
          </Alert>
        </div>
      )}
    </>
  );
};
```

#### 2-5. UserForm / PostForm 컴포넌트 추출

**파일 생성**: `after/src/components/UserForm.tsx`

```typescript
interface UserFormProps {
  formData: {
    username?: string;
    email?: string;
    role?: string;
    status?: string;
  };
  onChange: (formData: any) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ formData, onChange }) => {
  return (
    <>
      <FormInput
        name="username"
        value={formData.username || ''}
        onChange={(value) => onChange({ ...formData, username: value })}
        label="사용자명"
        placeholder="사용자명을 입력하세요"
        required
        width="full"
        fieldType="username"
      />
      <FormInput
        name="email"
        value={formData.email || ''}
        onChange={(value) => onChange({ ...formData, email: value })}
        label="이메일"
        placeholder="이메일을 입력하세요"
        type="email"
        required
        width="full"
        fieldType="email"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormSelect
          name="role"
          value={formData.role || 'user'}
          onChange={(value) => onChange({ ...formData, role: value })}
          options={[
            { value: 'user', label: '사용자' },
            { value: 'moderator', label: '운영자' },
            { value: 'admin', label: '관리자' },
          ]}
          label="역할"
          size="md"
        />
        <FormSelect
          name="status"
          value={formData.status || 'active'}
          onChange={(value) => onChange({ ...formData, status: value })}
          options={[
            { value: 'active', label: '활성' },
            { value: 'inactive', label: '비활성' },
            { value: 'suspended', label: '정지' },
          ]}
          label="상태"
          size="md"
        />
      </div>
    </>
  );
};
```

**파일 생성**: `after/src/components/PostForm.tsx`

```typescript
// 비슷한 구조로 PostForm 작성
```

### ✅ Step 2 체크리스트
- [ ] PageTitle 컴포넌트 추출
- [ ] TabSwitcher 컴포넌트 추출
- [ ] StatsCards 컴포넌트 추출
- [ ] AlertContainer 컴포넌트 추출
- [ ] UserForm 컴포넌트 추출
- [ ] PostForm 컴포넌트 추출
- [ ] 각 컴포넌트 추출 후 테스트
- [ ] ManagementPage가 훨씬 간결해짐 확인

---

## 🎨 Step 3: 각 컴포넌트를 shadcn/ui로 교체

### 목표
추출한 컴포넌트들의 UI를 shadcn/ui로 교체

### 작업 순서

#### 3-1. PageTitle → shadcn/ui로 교체

**전**: 인라인 스타일
```typescript
<h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
  {title}
</h1>
```

**후**: TailwindCSS
```typescript
import { cn } from "@/lib/utils";

export const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold text-foreground mb-1">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
```

#### 3-2. TabSwitcher → shadcn/ui Tabs

```bash
npx shadcn-ui@latest add tabs
```

```typescript
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-4">
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
```

#### 3-3. StatsCards → shadcn/ui Card

```typescript
import { Card, CardContent } from "@/components/ui/card";

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

#### 3-4. AlertContainer → shadcn/ui Alert

```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

export const AlertContainer: React.FC<AlertContainerProps> = ({
  successMessage,
  errorMessage,
  onCloseSuccess,
  onCloseError
}) => {
  return (
    <>
      {successMessage && (
        <Alert variant="default" className="mb-3">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="destructive" className="mb-3">
          <XCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
```

#### 3-5. UserForm → shadcn/ui Form Components

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const UserForm: React.FC<UserFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username">사용자명 *</Label>
        <Input
          id="username"
          name="username"
          value={formData.username || ''}
          onChange={(e) => onChange({ ...formData, username: e.target.value })}
          placeholder="사용자명을 입력하세요"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">이메일 *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          placeholder="이메일을 입력하세요"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">역할</Label>
          <Select
            value={formData.role || 'user'}
            onValueChange={(value) => onChange({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="역할 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">사용자</SelectItem>
              <SelectItem value="moderator">운영자</SelectItem>
              <SelectItem value="admin">관리자</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">상태</Label>
          <Select
            value={formData.status || 'active'}
            onValueChange={(value) => onChange({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="inactive">비활성</SelectItem>
              <SelectItem value="suspended">정지</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
```

#### 3-6. Button 교체

**전**: 레거시 Button
```typescript
<Button variant="primary" size="md" onClick={handleCreate}>
  생성
</Button>
```

**후**: shadcn Button
```typescript
import { Button } from "@/components/ui/button";

<Button onClick={handleCreate}>
  생성
</Button>
```

#### 3-7. Modal → Dialog

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>새 {entityType === 'user' ? '사용자' : '게시글'} 만들기</DialogTitle>
    </DialogHeader>

    {entityType === 'user' ? (
      <UserForm formData={formData} onChange={setFormData} />
    ) : (
      <PostForm formData={formData} onChange={setFormData} />
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
        취소
      </Button>
      <Button onClick={handleCreate}>
        생성
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### 3-8. Table → shadcn/ui Table

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      {columns.map(col => (
        <TableHead key={col.key}>{col.header}</TableHead>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row, idx) => (
      <TableRow key={idx}>
        {columns.map(col => (
          <TableCell key={col.key}>
            {row[col.key]}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### ✅ Step 3 체크리스트
- [ ] PageTitle Tailwind 적용
- [ ] TabSwitcher → Tabs 교체
- [ ] StatsCards → Card 교체
- [ ] AlertContainer → Alert 교체
- [ ] UserForm/PostForm → Input, Label, Select 교체
- [ ] Button → shadcn Button 교체
- [ ] Modal → Dialog 교체
- [ ] Table → shadcn Table 교체
- [ ] 모든 인라인 스타일 제거 확인
- [ ] 기능 동작 확인

---

## 🔄 Step 4: 비즈니스 로직 분리 (Custom Hooks)

### 목표
ManagementPage에서 비즈니스 로직을 Custom Hooks로 추출

#### 4-1. useUserManagement Hook

**파일 생성**: `after/src/hooks/useUserManagement.ts`

```typescript
import { useState, useEffect } from 'react';
import { userService, type User } from '../services/userService';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.getAll();
      setUsers(result);
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      await userService.create(userData);
      await loadUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      await userService.update(id, userData);
      await loadUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.delete(id);
      await loadUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    reload: loadUsers
  };
};
```

#### 4-2. usePostManagement Hook

**파일 생성**: `after/src/hooks/usePostManagement.ts`

```typescript
// 비슷한 구조로 작성
```

#### 4-3. ManagementPage에서 사용

```typescript
export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>('user');

  // 🎯 비즈니스 로직을 Hooks로 분리!
  const userManagement = useUserManagement();
  const postManagement = usePostManagement();

  const currentData = entityType === 'user' ? userManagement.users : postManagement.posts;
  const isLoading = entityType === 'user' ? userManagement.isLoading : postManagement.isLoading;

  // ... 나머지 UI 로직
};
```

### ✅ Step 4 체크리스트
- [ ] useUserManagement Hook 작성
- [ ] usePostManagement Hook 작성
- [ ] ManagementPage에서 Custom Hooks 사용
- [ ] 상태 관리 로직이 Hook으로 이동했는지 확인
- [ ] ManagementPage가 더욱 간결해짐 확인

---

## ✅ 최종 체크리스트

### 코드 품질
- [ ] 모든 인라인 스타일 제거
- [ ] Tailwind 클래스로 스타일링
- [ ] 타입 안전성 (`any` 제거)
- [ ] 일관된 컴포넌트 API

### 기능
- [ ] 사용자 CRUD 동작
- [ ] 게시글 CRUD 동작
- [ ] 통계 표시
- [ ] 알림 표시
- [ ] 테스트 통과

### 구조
- [ ] ManagementPage 300줄 이하
- [ ] 재사용 가능한 컴포넌트들
- [ ] Custom Hooks로 로직 분리
- [ ] 명확한 책임 분리

---

## 📊 Before / After 비교

| 항목 | Before | After |
|------|--------|-------|
| ManagementPage 줄 수 | 647줄 | ~200줄 |
| 컴포넌트 수 | 1개 거대 컴포넌트 | 10+ 작은 컴포넌트 |
| 스타일링 | 인라인 + CSS | TailwindCSS |
| 상태 관리 | 23개 상태 변수 | Custom Hooks |
| 타입 안전성 | `any` 많음 | 명확한 타입 |
| 재사용성 | 불가능 | 높음 |
| 테스트 용이성 | 어려움 | 쉬움 |

---

## 🎉 완료!

이제 여러분의 프로젝트는:
- ✅ 현대적인 디자인 시스템
- ✅ 명확한 관심사 분리
- ✅ 재사용 가능한 컴포넌트
- ✅ 유지보수하기 쉬운 구조

다음 단계: [Storybook 설정](./STORYBOOK_GUIDE.md)으로 컴포넌트 문서화하기
