import React, { useState } from "react";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

// Hooks
import { useAlertState } from "../hooks/useAlertState";
import { useModalState } from "../hooks/useModalState";
import { useEntityStats } from "../hooks/useEntityStats";
import { useManagementData } from "../hooks/useManagementData";

// Utils
import {
  getRoleVariant,
  getRoleText,
  getUserStatusVariant,
  getUserStatusText,
} from "../components/domain/user/userBadgeHelpers";
import {
  getPostStatusVariant,
  getPostStatusText,
  getCategoryVariant,
} from "../components/domain/post/postBadgeHelpers";

// ShadCN Components
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

// Shared Components
import { PageHeader } from "../components/shared/PageHeader";
import { AlertContainer } from "../components/shared/AlertContainer";

// Domain Components
import { UserFormFields } from "../components/domain/user/UserFormFields";
import { PostFormFields } from "../components/domain/post/PostFormFields";
import { ManagementTabs } from "../components/domain/management/ManagementTabs";
import { ManagementStats } from "../components/domain/management/ManagementStats";

type EntityType = "user" | "post";
type Entity = User | Post;

/**
 * 사용자 테이블 컬럼 정의
 * shadcn/ui Table 컴포넌트에 전달할 컬럼 구성
 */
const getUserColumns = (
  onEdit: (item: User) => void,
  onDelete: (id: number) => void
) => [
  { key: "id", header: "ID", width: "60px" },
  { key: "username", header: "사용자명", width: "150px" },
  { key: "email", header: "이메일" },
  {
    key: "role",
    header: "역할",
    width: "120px",
    cell: (row: User) => (
      <Badge variant={getRoleVariant(row.role)}>{getRoleText(row.role)}</Badge>
    ),
  },
  {
    key: "status",
    header: "상태",
    width: "120px",
    cell: (row: User) => (
      <Badge variant={getUserStatusVariant(row.status)}>
        {getUserStatusText(row.status)}
      </Badge>
    ),
  },
  { key: "createdAt", header: "생성일", width: "120px" },
  {
    key: "lastLogin",
    header: "마지막 로그인",
    width: "140px",
    cell: (row: User) => row.lastLogin || "-",
  },
  {
    key: "actions",
    header: "관리",
    width: "200px",
    cell: (row: User) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onEdit(row)}>
          수정
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row.id)}
        >
          삭제
        </Button>
      </div>
    ),
  },
];

/**
 * 게시글 테이블 컬럼 정의
 * shadcn/ui Table 컴포넌트에 전달할 컬럼 구성
 */
const getPostColumns = (
  onEdit: (item: Post) => void,
  onDelete: (id: number) => void,
  onPublish: (id: number) => void,
  onArchive: (id: number) => void,
  onRestore: (id: number) => void
) => [
  { key: "id", header: "ID", width: "60px" },
  { key: "title", header: "제목" },
  { key: "author", header: "작성자", width: "120px" },
  {
    key: "category",
    header: "카테고리",
    width: "140px",
    cell: (row: Post) => (
      <Badge variant={getCategoryVariant(row.category)}>{row.category}</Badge>
    ),
  },
  {
    key: "status",
    header: "상태",
    width: "120px",
    cell: (row: Post) => (
      <Badge variant={getPostStatusVariant(row.status)}>
        {getPostStatusText(row.status)}
      </Badge>
    ),
  },
  {
    key: "views",
    header: "조회수",
    width: "100px",
    cell: (row: Post) => (row.views ?? 0).toLocaleString(),
  },
  { key: "createdAt", header: "작성일", width: "120px" },
  {
    key: "actions",
    header: "관리",
    width: "250px",
    cell: (row: Post) => (
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onEdit(row)}>
          수정
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row.id)}
        >
          삭제
        </Button>
        {row.status === "draft" && (
          <Button size="sm" onClick={() => onPublish(row.id)}>
            게시
          </Button>
        )}
        {row.status === "published" && (
          <Button size="sm" onClick={() => onArchive(row.id)}>
            보관
          </Button>
        )}
        {row.status === "archived" && (
          <Button size="sm" onClick={() => onRestore(row.id)}>
            복원
          </Button>
        )}
      </div>
    ),
  },
];

/**
 * 사용자 및 게시글 관리 페이지 컴포넌트
 *
 * 사용자 관리와 게시글 관리를 하나의 페이지에서 처리합니다.
 * 탭 전환을 통해 entityType을 변경하며, 각 타입에 맞는 CRUD 작업을 수행합니다.
 *
 * 데이터 흐름:
 * 1. entityType 변경 → useManagementData에서 자동으로 데이터 로드
 * 2. 사용자 액션 (생성/수정/삭제) → 핸들러 호출
 * 3. 핸들러 → 커스텀 훅 함수 호출 → 서비스 레이어 호출
 * 4. 성공/실패 → 알림 표시 (useAlertState)
 * 5. 모달 관리 → useModalState
 * 6. 통계 계산 → useEntityStats (자동)
 */
export const ManagementPage: React.FC = () => {
  // 현재 관리 중인 엔티티 타입 (사용자 또는 게시글)
  const [entityType, setEntityType] = useState<EntityType>("post");

  /**
   * 커스텀 훅: 데이터 관리
   * entityType에 따라 자동으로 적절한 서비스를 호출하여
   * 데이터 조회, 생성, 수정, 삭제를 처리합니다.
   */
  const { data, createItem, updateItem, deleteItem, changeStatus } =
    useManagementData(entityType);

  /**
   * 커스텀 훅: 알림 상태 관리
   * 성공 알림과 에러 알림을 독립적으로 관리합니다.
   */
  const {
    showSuccessAlert,
    showErrorAlert,
    alertMessage,
    errorMessage,
    showSuccess,
    showError,
    closeSuccess,
    closeError,
  } = useAlertState();

  /**
   * 커스텀 훅: 모달 및 폼 상태 관리
   * 생성/수정 모달의 열림/닫힘과 폼 데이터를 관리합니다.
   */
  const {
    isCreateModalOpen,
    isEditModalOpen,
    formData,
    selectedItem,
    setFormData,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  } = useModalState();

  /**
   * 커스텀 훅: 통계 계산
   * data와 entityType이 변경될 때마다 자동으로 통계를 재계산합니다.
   */
  const stats = useEntityStats(data, entityType);

  /**
   * 이벤트 핸들러: 새 항목 생성
   * 1. createItem 호출하여 항목 생성
   * 2. 성공 시 모달 닫고 성공 알림 표시
   * 3. 실패 시 에러 알림 표시
   */
  const handleCreate = async () => {
    try {
      await createItem(formData);
      closeCreateModal();
      showSuccess(
        `${entityType === "user" ? "사용자" : "게시글"}가 생성되었습니다`
      );
    } catch (error: any) {
      showError(error.message || "생성에 실패했습니다");
    }
  };

  /**
   * 이벤트 핸들러: 수정 모달 열기
   * openEditModal이 선택한 항목의 데이터를 폼에 자동으로 로드합니다.
   */
  const handleEdit = (item: Entity) => {
    openEditModal(item, entityType);
  };

  /**
   * 이벤트 핸들러: 항목 수정
   * 1. updateItem 호출하여 항목 수정
   * 2. 성공 시 모달 닫고 성공 알림 표시
   * 3. 실패 시 에러 알림 표시
   */
  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      await updateItem(selectedItem.id, formData);
      closeEditModal();
      showSuccess(
        `${entityType === "user" ? "사용자" : "게시글"}가 수정되었습니다`
      );
    } catch (error: any) {
      showError(error.message || "수정에 실패했습니다");
    }
  };

  /**
   * 이벤트 핸들러: 항목 삭제
   * 1. 사용자 확인 (confirm)
   * 2. deleteItem 호출하여 항목 삭제
   * 3. 성공 시 성공 알림 표시
   * 4. 실패 시 에러 알림 표시
   */
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteItem(id);
      showSuccess("삭제되었습니다");
    } catch (error: any) {
      showError(error.message || "삭제에 실패했습니다");
    }
  };

  /**
   * 이벤트 핸들러: 게시글 상태 변경
   * 게시(publish), 보관(archive), 복원(restore) 작업을 수행합니다.
   * 게시글 타입일 때만 동작합니다.
   */
  const handleStatusAction = async (
    id: number,
    action: "publish" | "archive" | "restore"
  ) => {
    if (entityType !== "post") return;

    try {
      await changeStatus(id, action);
      const message =
        action === "publish" ? "게시" : action === "archive" ? "보관" : "복원";
      showSuccess(`${message}되었습니다`);
    } catch (error: any) {
      showError(error.message || "작업에 실패했습니다");
    }
  };

  /**
   * 테이블 컬럼 정의
   * entityType에 따라 적절한 컬럼 배열을 반환합니다.
   */
  const columns =
    entityType === "user"
      ? getUserColumns(handleEdit, handleDelete)
      : getPostColumns(
          handleEdit,
          handleDelete,
          (id) => handleStatusAction(id, "publish"),
          (id) => handleStatusAction(id, "archive"),
          (id) => handleStatusAction(id, "restore")
        );

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-[1200px] mx-auto p-6">
        {/* 페이지 헤더 */}
        <PageHeader
          title="관리 시스템"
          description="사용자와 게시글을 관리하세요"
        />

        {/* 페이지 본문 */}
        <div className="bg-card border border-border p-4">
          {/* 탭 전환 */}
          <ManagementTabs
            activeTab={entityType}
            onTabChange={(tab) => setEntityType(tab as EntityType)}
          />

          <div>
            <div className="mb-4 text-right">
              <Button onClick={openCreateModal}>새로 만들기</Button>
            </div>

            {/* 알림 */}
            <AlertContainer
              showSuccess={showSuccessAlert}
              showError={showErrorAlert}
              successMessage={alertMessage}
              errorMessage={errorMessage}
              onCloseSuccess={closeSuccess}
              onCloseError={closeError}
            />

            {/* 통계 */}
            <ManagementStats stats={stats} />

            <div className="border border-border bg-card overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        style={{ width: column.width }}
                      >
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row: Entity) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.cell
                            ? column.cell(row as any)
                            : (row as any)[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCreateModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              새 {entityType === "user" ? "사용자" : "게시글"} 만들기
            </DialogTitle>
          </DialogHeader>
          <div>
            {entityType === "user" ? (
              <UserFormFields formData={formData} onChange={setFormData} />
            ) : (
              <PostFormFields formData={formData} onChange={setFormData} />
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeCreateModal}>
              취소
            </Button>
            <Button onClick={handleCreate}>생성</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditModal();
          }
        }}
      >
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              {entityType === "user" ? "사용자" : "게시글"} 수정
            </DialogTitle>
          </DialogHeader>
          <div>
            {selectedItem && (
              <Alert variant="info">
                <AlertDescription>
                  ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
                  {entityType === "post" &&
                    ` | 조회수: ${(selectedItem as Post).views}`}
                </AlertDescription>
              </Alert>
            )}

            {entityType === "user" ? (
              <UserFormFields formData={formData} onChange={setFormData} />
            ) : (
              <PostFormFields formData={formData} onChange={setFormData} />
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeEditModal}>
              취소
            </Button>
            <Button onClick={handleUpdate}>수정 완료</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
