# 컴포넌트 분리 전략 및 아키텍처

## 🎯 컴포넌트 분리 원칙

### 1. 단일 책임 원칙 (Single Responsibility Principle)
- 하나의 컴포넌트는 하나의 역할만
- 예: `UserForm`은 사용자 입력만, 저장 로직은 부모에서

### 2. 재사용성 (Reusability)
- 도메인에 독립적일수록 재사용 가능
- 예: `DataTable`은 User, Post 모두 사용 가능

### 3. 적절한 크기 (Right Size)
- 너무 크면: 이해하기 어렵고 수정 어려움
- 너무 작으면: 파일이 많아지고 관리 복잡
- **기준**: 100-150줄 정도가 적당

### 4. Props Drilling 최소화
- 3단계 이상 props 전달 → Context나 Hooks 고려

---

## 📂 제안하는 폴더 구조

```
after/src/
├── components/
│   ├── ui/                          # shadcn/ui 컴포넌트 (수정 X)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   ├── common/                      # 재사용 가능한 공통 컴포넌트
│   │   ├── PageHeader.tsx          # 페이지 헤더 (제목 + 설명)
│   │   ├── TabNavigation.tsx       # 탭 네비게이션
│   │   ├── AlertContainer.tsx      # 성공/에러 알림
│   │   └── StatsCard.tsx           # 통계 카드 (단일)
│   │
│   ├── features/                    # 기능별 컴포넌트 (도메인 독립적)
│   │   ├── data-table/
│   │   │   ├── DataTable.tsx       # 범용 데이터 테이블
│   │   │   ├── DataTablePagination.tsx
│   │   │   └── DataTableToolbar.tsx
│   │   │
│   │   └── entity-manager/
│   │       ├── EntityStats.tsx     # 통계 그리드
│   │       ├── EntityForm.tsx      # 범용 폼 (추상화)
│   │       └── EntityModal.tsx     # CRUD 모달
│   │
│   └── domain/                      # 도메인 특화 컴포넌트
│       ├── user/
│       │   ├── UserForm.tsx        # 사용자 폼
│       │   ├── UserTable.tsx       # 사용자 테이블
│       │   ├── UserStats.tsx       # 사용자 통계
│       │   └── UserFormFields.tsx  # 사용자 필드들
│       │
│       └── post/
│           ├── PostForm.tsx        # 게시글 폼
│           ├── PostTable.tsx       # 게시글 테이블
│           ├── PostStats.tsx       # 게시글 통계
│           ├── PostFormFields.tsx  # 게시글 필드들
│           └── PostActions.tsx     # 게시글 액션 버튼
│
├── hooks/
│   ├── useUserManagement.ts        # 사용자 CRUD
│   ├── usePostManagement.ts        # 게시글 CRUD
│   ├── useEntityStats.ts           # 통계 계산
│   └── useAlert.ts                 # 알림 관리
│
└── pages/
    └── ManagementPage.tsx          # 최상위 조합 (200줄 이하)
```

---

## 🏗️ 컴포넌트 계층 구조

### Level 1: shadcn/ui (최하위 - 순수 UI)
```
Button, Input, Select, Card, Table, Dialog, Alert, Tabs
```
- **책임**: 순수 UI, 스타일링
- **도메인 지식**: 없음
- **재사용성**: 최고

### Level 2: Common Components (공통)
```
PageHeader, TabNavigation, AlertContainer, StatsCard
```
- **책임**: 자주 쓰이는 패턴을 컴포넌트화
- **도메인 지식**: 없음
- **재사용성**: 높음

### Level 3: Feature Components (기능)
```
DataTable, EntityStats, EntityForm, EntityModal
```
- **책임**: 특정 기능 (CRUD, 통계 등)
- **도메인 지식**: 최소 (제네릭으로 처리)
- **재사용성**: 중간

### Level 4: Domain Components (도메인)
```
UserForm, UserTable, PostForm, PostTable
```
- **책임**: User, Post 도메인 특화
- **도메인 지식**: 높음
- **재사용성**: 낮음 (도메인 내에서만)

### Level 5: Page (최상위)
```
ManagementPage
```
- **책임**: 컴포넌트 조합, 라우팅
- **도메인 지식**: 높음
- **재사용성**: 없음

---

## 📦 구체적인 컴포넌트 분리 계획

### 1. Common Components (공통 컴포넌트)

#### `PageHeader.tsx`
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions
}) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};
```

**책임**: 페이지 헤더 표시
**재사용**: 모든 페이지에서 사용 가능
**크기**: ~30줄

---

#### `TabNavigation.tsx`
```typescript
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-6">
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
```

**책임**: 탭 네비게이션
**재사용**: 탭이 필요한 모든 곳
**크기**: ~40줄

---

#### `AlertContainer.tsx`
```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  if (!successMessage && !errorMessage) return null;

  return (
    <div className="space-y-2 mb-4">
      {successMessage && (
        <Alert variant="default" className="relative">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>성공</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onCloseSuccess}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="relative">
          <XCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onCloseError}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
    </div>
  );
};
```

**책임**: 성공/에러 알림 표시
**재사용**: 알림이 필요한 모든 곳
**크기**: ~60줄

---

#### `StatsCard.tsx`
```typescript
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  variant = 'default'
}) => {
  const variantStyles = {
    primary: 'bg-blue-50 border-blue-200 dark:bg-blue-950',
    success: 'bg-green-50 border-green-200 dark:bg-green-950',
    warning: 'bg-orange-50 border-orange-200 dark:bg-orange-950',
    danger: 'bg-red-50 border-red-200 dark:bg-red-950',
    default: 'bg-muted'
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
```

**책임**: 단일 통계 카드
**재사용**: 통계 표시가 필요한 모든 곳
**크기**: ~45줄

---

### 2. Feature Components (기능 컴포넌트)

#### `EntityStats.tsx`
```typescript
import { StatsCard } from "@/components/common/StatsCard";

interface Stat {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

interface EntityStatsProps {
  stats: Stat[];
}

export const EntityStats: React.FC<EntityStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};
```

**책임**: 통계 그리드 레이아웃
**재사용**: User, Post 통계 모두 사용
**크기**: ~30줄

---

#### `EntityModal.tsx`
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel = "저장",
  isSubmitting = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {children}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

**책임**: 범용 CRUD 모달
**재사용**: Create/Edit 모달 모두 사용
**크기**: ~50줄

---

#### `DataTable.tsx` (복잡하므로 간략히)
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx} style={{ width: col.width }}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? "cursor-pointer" : ""}
            >
              {columns.map((col, idx) => (
                <TableCell key={idx}>
                  {col.render ? col.render(item) : String(item[col.key as keyof T])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

**책임**: 범용 데이터 테이블 (제네릭)
**재사용**: User, Post, 기타 엔티티 모두 사용
**크기**: ~100줄 (페이지네이션 포함 시)

---

### 3. Domain Components (도메인 컴포넌트)

#### `UserFormFields.tsx`
```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/services/userService";

interface UserFormFieldsProps {
  formData: Partial<User>;
  onChange: (data: Partial<User>) => void;
  errors?: Partial<Record<keyof User, string>>;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  onChange,
  errors
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username">사용자명 *</Label>
        <Input
          id="username"
          value={formData.username || ''}
          onChange={(e) => onChange({ ...formData, username: e.target.value })}
          placeholder="사용자명을 입력하세요"
          className={errors?.username ? "border-destructive" : ""}
        />
        {errors?.username && (
          <p className="text-sm text-destructive mt-1">{errors.username}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">이메일 *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          placeholder="이메일을 입력하세요"
          className={errors?.email ? "border-destructive" : ""}
        />
        {errors?.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">역할</Label>
          <Select
            value={formData.role || 'user'}
            onValueChange={(value) => onChange({ ...formData, role: value as User['role'] })}
          >
            <SelectTrigger>
              <SelectValue />
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
            onValueChange={(value) => onChange({ ...formData, status: value as User['status'] })}
          >
            <SelectTrigger>
              <SelectValue />
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

**책임**: 사용자 폼 필드
**재사용**: Create/Edit User 모달에서 사용
**크기**: ~90줄

---

#### `UserTable.tsx`
```typescript
import { DataTable } from "@/components/features/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/services/userService";
import type { Column } from "@/components/features/data-table/DataTable";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete
}) => {
  const columns: Column<User>[] = [
    { key: 'id', header: 'ID', width: '60px' },
    { key: 'username', header: '사용자명', width: '150px' },
    { key: 'email', header: '이메일' },
    {
      key: 'role',
      header: '역할',
      width: '120px',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role}
        </Badge>
      )
    },
    {
      key: 'status',
      header: '상태',
      width: '120px',
      render: (user) => {
        const variant =
          user.status === 'active' ? 'default' :
          user.status === 'inactive' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{user.status}</Badge>;
      }
    },
    { key: 'createdAt', header: '생성일', width: '120px' },
    { key: 'lastLogin', header: '마지막 로그인', width: '140px' },
    {
      key: 'actions',
      header: '관리',
      width: '200px',
      render: (user) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
            수정
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(user.id)}
            disabled={user.role === 'admin'}
          >
            삭제
          </Button>
        </div>
      )
    }
  ];

  return <DataTable data={users} columns={columns} />;
};
```

**책임**: 사용자 테이블 (렌더링 로직)
**재사용**: User 도메인에서만
**크기**: ~70줄

---

#### `UserStats.tsx`
```typescript
import { EntityStats } from "@/components/features/entity-manager/EntityStats";
import { Users, UserCheck, UserX, Shield } from "lucide-react";
import type { User } from "@/services/userService";

interface UserStatsProps {
  users: User[];
}

export const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const stats = [
    {
      label: "전체",
      value: users.length,
      icon: Users,
      variant: 'primary' as const
    },
    {
      label: "활성",
      value: users.filter(u => u.status === 'active').length,
      icon: UserCheck,
      variant: 'success' as const
    },
    {
      label: "비활성",
      value: users.filter(u => u.status === 'inactive').length,
      icon: UserX,
      variant: 'warning' as const
    },
    {
      label: "정지",
      value: users.filter(u => u.status === 'suspended').length,
      variant: 'danger' as const
    },
    {
      label: "관리자",
      value: users.filter(u => u.role === 'admin').length,
      icon: Shield,
      variant: 'default' as const
    }
  ];

  return <EntityStats stats={stats} />;
};
```

**책임**: 사용자 통계 계산 및 표시
**재사용**: User 도메인에서만
**크기**: ~50줄

---

#### `PostFormFields.tsx`, `PostTable.tsx`, `PostStats.tsx`
User와 비슷한 구조로 Post 도메인 컴포넌트 작성

---

### 4. Page (최상위 조합)

#### `ManagementPage.tsx` (최종 형태)
```typescript
import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { TabNavigation } from '@/components/common/TabNavigation';
import { AlertContainer } from '@/components/common/AlertContainer';
import { EntityModal } from '@/components/features/entity-manager/EntityModal';
import { UserStats } from '@/components/domain/user/UserStats';
import { UserTable } from '@/components/domain/user/UserTable';
import { UserFormFields } from '@/components/domain/user/UserFormFields';
import { PostStats } from '@/components/domain/post/PostStats';
import { PostTable } from '@/components/domain/post/PostTable';
import { PostFormFields } from '@/components/domain/post/PostFormFields';
import { Button } from '@/components/ui/button';
import { useUserManagement } from '@/hooks/useUserManagement';
import { usePostManagement } from '@/hooks/usePostManagement';
import { useAlert } from '@/hooks/useAlert';
import { Users, FileText } from 'lucide-react';

type EntityType = 'user' | 'post';

export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>('post');

  // Custom Hooks
  const userManagement = useUserManagement();
  const postManagement = usePostManagement();
  const alert = useAlert();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Current data based on entity type
  const isUserMode = entityType === 'user';
  const currentData = isUserMode ? userManagement.users : postManagement.posts;
  const isLoading = isUserMode ? userManagement.isLoading : postManagement.isLoading;

  // Handlers
  const handleCreate = async () => {
    const result = isUserMode
      ? await userManagement.createUser(formData)
      : await postManagement.createPost(formData);

    if (result.success) {
      setIsCreateModalOpen(false);
      setFormData({});
      alert.showSuccess(`${isUserMode ? '사용자' : '게시글'}가 생성되었습니다`);
    } else {
      alert.showError(result.error || '생성에 실패했습니다');
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    const result = isUserMode
      ? await userManagement.updateUser(selectedItem.id, formData)
      : await postManagement.updatePost(selectedItem.id, formData);

    if (result.success) {
      setIsEditModalOpen(false);
      setFormData({});
      setSelectedItem(null);
      alert.showSuccess(`${isUserMode ? '사용자' : '게시글'}가 수정되었습니다`);
    } else {
      alert.showError(result.error || '수정에 실패했습니다');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const result = isUserMode
      ? await userManagement.deleteUser(id)
      : await postManagement.deletePost(id);

    if (result.success) {
      alert.showSuccess('삭제되었습니다');
    } else {
      alert.showError(result.error || '삭제에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-6">
        {/* Header */}
        <PageHeader
          title="관리 시스템"
          description="사용자와 게시글을 관리하세요"
          actions={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              새로 만들기
            </Button>
          }
        />

        {/* Tab Navigation */}
        <TabNavigation
          tabs={[
            { value: 'post', label: '게시글', icon: <FileText className="h-4 w-4" /> },
            { value: 'user', label: '사용자', icon: <Users className="h-4 w-4" /> }
          ]}
          activeTab={entityType}
          onTabChange={(value) => setEntityType(value as EntityType)}
        />

        {/* Alerts */}
        <AlertContainer
          successMessage={alert.successMessage}
          errorMessage={alert.errorMessage}
          onCloseSuccess={alert.clearSuccess}
          onCloseError={alert.clearError}
        />

        {/* Stats */}
        {isUserMode ? (
          <UserStats users={userManagement.users} />
        ) : (
          <PostStats posts={postManagement.posts} />
        )}

        {/* Table */}
        {isUserMode ? (
          <UserTable
            users={userManagement.users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <PostTable
            posts={postManagement.posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={postManagement.publishPost}
            onArchive={postManagement.archivePost}
          />
        )}

        {/* Create Modal */}
        <EntityModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setFormData({});
          }}
          onSubmit={handleCreate}
          title={`새 ${isUserMode ? '사용자' : '게시글'} 만들기`}
        >
          {isUserMode ? (
            <UserFormFields formData={formData} onChange={setFormData} />
          ) : (
            <PostFormFields formData={formData} onChange={setFormData} />
          )}
        </EntityModal>

        {/* Edit Modal */}
        <EntityModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setFormData({});
            setSelectedItem(null);
          }}
          onSubmit={handleUpdate}
          title={`${isUserMode ? '사용자' : '게시글'} 수정`}
          submitLabel="수정 완료"
        >
          {isUserMode ? (
            <UserFormFields formData={formData} onChange={setFormData} />
          ) : (
            <PostFormFields formData={formData} onChange={setFormData} />
          )}
        </EntityModal>
      </div>
    </div>
  );
};
```

**책임**: 컴포넌트 조합, 전체 흐름 관리
**크기**: ~200줄 (647줄 → 200줄)

---

## 📊 컴포넌트 분리 전/후 비교

| 항목 | Before | After |
|------|--------|-------|
| **총 파일 수** | 1개 | 15+ 개 |
| **ManagementPage 크기** | 647줄 | ~200줄 |
| **재사용 가능 컴포넌트** | 0개 | 8개 |
| **도메인 독립 컴포넌트** | 0개 | 5개 |
| **테스트 가능성** | 어려움 | 쉬움 |
| **변경 영향 범위** | 전체 | 해당 컴포넌트만 |

---

## 🎯 작업 우선순위

### Phase 1: Common Components (1-2시간)
1. ✅ PageHeader
2. ✅ TabNavigation
3. ✅ AlertContainer
4. ✅ StatsCard

**왜 먼저?** 간단하고, 재사용성 높고, 다른 컴포넌트에 영향 없음

### Phase 2: Feature Components (2-3시간)
1. ✅ EntityStats
2. ✅ EntityModal
3. ✅ DataTable (조금 복잡)

**왜 다음?** 도메인 독립적이라 User/Post 모두 사용 가능

### Phase 3: Domain Components (3-4시간)
1. ✅ UserFormFields
2. ✅ UserTable
3. ✅ UserStats
4. ✅ PostFormFields
5. ✅ PostTable
6. ✅ PostStats

**왜 다음?** Feature 컴포넌트에 의존하므로 나중에

### Phase 4: Custom Hooks (1-2시간)
1. ✅ useUserManagement
2. ✅ usePostManagement
3. ✅ useAlert

**왜 마지막?** 비즈니스 로직 분리는 UI가 안정된 후

### Phase 5: ManagementPage 리팩토링 (1시간)
1. ✅ 모든 컴포넌트 조합

---

## 💡 팁과 주의사항

### 1. 한 번에 하나씩
- 한 번에 모든 컴포넌트를 만들지 마세요
- PageHeader 하나 만들고 → 테스트 → 다음 컴포넌트

### 2. 기존 코드 유지하면서 작업
```typescript
// before/src/pages/ManagementPage.tsx는 그대로 두고
// after/src/pages/ManagementPage.tsx에서 작업
```

### 3. Git 커밋 자주
```bash
git add .
git commit -m "feat: PageHeader 컴포넌트 추가"
git add .
git commit -m "feat: TabNavigation 컴포넌트 추가"
```

### 4. Props 인터페이스 먼저 설계
- 컴포넌트 구현 전에 Props 타입부터 정의
- 필요한 데이터가 무엇인지 명확히

### 5. 재사용성 고려
- "이 컴포넌트가 다른 곳에서도 쓰일 수 있나?" 자문
- 도메인 지식을 최소화

---

## 🚀 시작하기

다음 중 어떤 방식으로 시작하시겠어요?

### Option A: 함께 하나씩 만들기
제가 각 컴포넌트를 하나씩 만들어드릴게요. PageHeader부터 시작할까요?

### Option B: 템플릿 제공
모든 컴포넌트 템플릿을 한번에 만들어드릴까요?

### Option C: 가이드만 참고
이 가이드를 보고 직접 작업하시겠어요?

어떤 방식이 좋으신가요?
