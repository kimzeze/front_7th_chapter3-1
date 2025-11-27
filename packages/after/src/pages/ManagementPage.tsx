import React, { useState, useEffect } from "react";
// import { Button, Badge } from "../components/atoms";
import { Table, Modal } from "../components/organisms";
import { FormInput, FormSelect, FormTextarea } from "../components/molecules";
import { userService } from "../services/userService";
import { postService } from "../services/postService";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";
import "../styles/components.css";

// ShadCN Components
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";

// Common Components
import { PageHeader } from "../components/common/PageHeader";
import { TabSwitcher } from "../components/common/TabSwitcher";
import { AlertContainer } from "../components/common/AlertContainer";
import { StatsGrid } from "../components/common/StatsGrid";

// Domain Components
import { UserFormFields } from "../components/domain/user/UserFormFields";
import { PostFormFields } from "../components/domain/post/PostFormFields";

type EntityType = "user" | "post";
type Entity = User | Post;

export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>("post");
  const [data, setData] = useState<Entity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
    setFormData({});
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  }, [entityType]);

  const loadData = async () => {
    try {
      let result: Entity[];

      if (entityType === "user") {
        result = await userService.getAll();
      } else {
        result = await postService.getAll();
      }

      setData(result);
    } catch (error: any) {
      setErrorMessage("데이터를 불러오는데 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const handleCreate = async () => {
    try {
      if (entityType === "user") {
        await userService.create({
          username: formData.username,
          email: formData.email,
          role: formData.role || "user",
          status: formData.status || "active",
        });
      } else {
        await postService.create({
          title: formData.title,
          content: formData.content || "",
          author: formData.author,
          category: formData.category,
          status: formData.status || "draft",
        });
      }

      await loadData();
      setIsCreateModalOpen(false);
      setFormData({});
      setAlertMessage(
        `${entityType === "user" ? "사용자" : "게시글"}가 생성되었습니다`
      );
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "생성에 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const handleEdit = (item: Entity) => {
    setSelectedItem(item);

    if (entityType === "user") {
      const user = item as User;
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      const post = item as Post;
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        status: post.status,
      });
    }

    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      if (entityType === "user") {
        await userService.update(selectedItem.id, formData);
      } else {
        await postService.update(selectedItem.id, formData);
      }

      await loadData();
      setIsEditModalOpen(false);
      setFormData({});
      setSelectedItem(null);
      setAlertMessage(
        `${entityType === "user" ? "사용자" : "게시글"}가 수정되었습니다`
      );
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "수정에 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      if (entityType === "user") {
        await userService.delete(id);
      } else {
        await postService.delete(id);
      }

      await loadData();
      setAlertMessage("삭제되었습니다");
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "삭제에 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const handleStatusAction = async (
    id: number,
    action: "publish" | "archive" | "restore"
  ) => {
    if (entityType !== "post") return;

    try {
      if (action === "publish") {
        await postService.publish(id);
      } else if (action === "archive") {
        await postService.archive(id);
      } else if (action === "restore") {
        await postService.restore(id);
      }

      await loadData();
      const message =
        action === "publish" ? "게시" : action === "archive" ? "보관" : "복원";
      setAlertMessage(`${message}되었습니다`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || "작업에 실패했습니다");
      setShowErrorAlert(true);
    }
  };

  const getStats = () => {
    if (entityType === "user") {
      const users = data as User[];
      return {
        total: users.length,
        stat1: {
          label: "활성",
          value: users.filter((u) => u.status === "active").length,
          color: "#2e7d32",
        },
        stat2: {
          label: "비활성",
          value: users.filter((u) => u.status === "inactive").length,
          color: "#ed6c02",
        },
        stat3: {
          label: "정지",
          value: users.filter((u) => u.status === "suspended").length,
          color: "#d32f2f",
        },
        stat4: {
          label: "관리자",
          value: users.filter((u) => u.role === "admin").length,
          color: "#1976d2",
        },
      };
    } else {
      const posts = data as Post[];
      return {
        total: posts.length,
        stat1: {
          label: "게시됨",
          value: posts.filter((p) => p.status === "published").length,
          color: "#2e7d32",
        },
        stat2: {
          label: "임시저장",
          value: posts.filter((p) => p.status === "draft").length,
          color: "#ed6c02",
        },
        stat3: {
          label: "보관됨",
          value: posts.filter((p) => p.status === "archived").length,
          color: "rgba(0, 0, 0, 0.6)",
        },
        stat4: {
          label: "총 조회수",
          value: posts.reduce((sum, p) => sum + p.views, 0),
          color: "#1976d2",
        },
      };
    }
  };

  // 🚨 Table 컴포넌트에 로직을 위임하여 간소화
  const renderTableColumns = () => {
    if (entityType === "user") {
      return [
        { key: "id", header: "ID", width: "60px" },
        { key: "username", header: "사용자명", width: "150px" },
        { key: "email", header: "이메일" },
        { key: "role", header: "역할", width: "120px" },
        { key: "status", header: "상태", width: "120px" },
        { key: "createdAt", header: "생성일", width: "120px" },
        { key: "lastLogin", header: "마지막 로그인", width: "140px" },
        { key: "actions", header: "관리", width: "200px" },
      ];
    } else {
      return [
        { key: "id", header: "ID", width: "60px" },
        { key: "title", header: "제목" },
        { key: "author", header: "작성자", width: "120px" },
        { key: "category", header: "카테고리", width: "140px" },
        { key: "status", header: "상태", width: "120px" },
        { key: "views", header: "조회수", width: "100px" },
        { key: "createdAt", header: "작성일", width: "120px" },
        { key: "actions", header: "관리", width: "250px" },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <div className="max-w-[1200px] mx-auto p-5">
        {/* 페이지 헤더 */}
        <PageHeader />

        {/* 페이지 본문 */}
        <div className="bg-white border border-[#ddd] p-2.5">
          {/* 탭 전환 */}
          <TabSwitcher
            activeTab={entityType}
            onTabChange={(tab) => setEntityType(tab as EntityType)}
          />

          <div>
            <div className="mb-4 text-right">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                새로 만들기
              </Button>
            </div>

            {/* 알림 */}
            <AlertContainer
              showSuccess={showSuccessAlert}
              showError={showErrorAlert}
              successMessage={alertMessage}
              errorMessage={errorMessage}
              onCloseSuccess={() => setShowSuccessAlert(false)}
              onCloseError={() => setShowErrorAlert(false)}
            />

            {/* 통계 */}
            <StatsGrid stats={stats} />

            <div
              style={{
                border: "1px solid #ddd",
                background: "white",
                overflow: "auto",
              }}
            >
              <Table
                columns={renderTableColumns()}
                data={data}
                striped
                hover
                entityType={entityType}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={(id) => handleStatusAction(id, "publish")}
                onArchive={(id) => handleStatusAction(id, "archive")}
                onRestore={(id) => handleStatusAction(id, "restore")}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({});
        }}
        title={`새 ${entityType === "user" ? "사용자" : "게시글"} 만들기`}
        size="large"
        showFooter
        footerContent={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({});
              }}
            >
              취소
            </Button>
            <Button onClick={handleCreate}>생성</Button>
          </>
        }
      >
        <div>
          {entityType === "user" ? (
            <UserFormFields formData={formData} onChange={setFormData} />
          ) : (
            <PostFormFields formData={formData} onChange={setFormData} />
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormData({});
          setSelectedItem(null);
        }}
        title={`${entityType === "user" ? "사용자" : "게시글"} 수정`}
        size="large"
        showFooter
        footerContent={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setFormData({});
                setSelectedItem(null);
              }}
            >
              취소
            </Button>
            <Button onClick={handleUpdate}>수정 완료</Button>
          </>
        }
      >
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
      </Modal>
    </div>
  );
};
