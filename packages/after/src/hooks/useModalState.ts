import { useState } from "react";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type Entity = User | Post;
type EntityType = "user" | "post";

/**
 * 모달 상태와 폼 데이터를 관리하는 커스텀 훅
 *
 * 생성 모달과 수정 모달의 열림/닫힘 상태를 독립적으로 관리하며,
 * 각 모달의 폼 데이터와 선택된 항목을 제어합니다.
 *
 * @returns {Object} 모달 상태 및 제어 함수
 * @returns {boolean} isCreateModalOpen - 생성 모달 열림 여부
 * @returns {boolean} isEditModalOpen - 수정 모달 열림 여부
 * @returns {Object} formData - 폼 입력 데이터
 * @returns {Entity | null} selectedItem - 수정 중인 항목
 * @returns {Function} setFormData - 폼 데이터 직접 설정 함수
 * @returns {Function} setSelectedItem - 선택 항목 직접 설정 함수
 * @returns {Function} openCreateModal - 생성 모달 열기 함수
 * @returns {Function} closeCreateModal - 생성 모달 닫기 함수
 * @returns {Function} openEditModal - 수정 모달 열기 함수 (항목 데이터 자동 로드)
 * @returns {Function} closeEditModal - 수정 모달 닫기 함수
 *
 * @example
 * const {
 *   isCreateModalOpen,
 *   formData,
 *   openCreateModal,
 *   closeCreateModal,
 *   openEditModal
 * } = useModalState();
 *
 * // 생성 모달 열기
 * openCreateModal();
 *
 * // 수정 모달 열기 (기존 데이터 자동 로드)
 * openEditModal(user, "user");
 */
export const useModalState = () => {
  // 모달 열림/닫힘 상태
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 폼 데이터와 선택된 항목
  const [formData, setFormData] = useState<any>({});
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);

  /**
   * 생성 모달을 엽니다
   * 폼 데이터를 초기화하고 모달을 표시합니다
   */
  const openCreateModal = () => {
    setFormData({});
    setIsCreateModalOpen(true);
  };

  /**
   * 생성 모달을 닫습니다
   * 모달을 숨기고 폼 데이터를 초기화합니다
   */
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({});
  };

  /**
   * 수정 모달을 엽니다
   * 선택한 항목의 데이터를 폼에 로드하고 모달을 표시합니다
   *
   * @param {Entity} item - 수정할 항목 (User 또는 Post)
   * @param {EntityType} entityType - 항목 타입 ("user" 또는 "post")
   */
  const openEditModal = (item: Entity, entityType: EntityType) => {
    // 수정할 항목 저장
    setSelectedItem(item);

    // entityType에 따라 폼 데이터 구성
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

    // 모달 열기
    setIsEditModalOpen(true);
  };

  /**
   * 수정 모달을 닫습니다
   * 모달을 숨기고 폼 데이터 및 선택 항목을 초기화합니다
   */
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({});
    setSelectedItem(null);
  };

  return {
    // 모달 상태
    isCreateModalOpen,
    isEditModalOpen,
    // 폼 데이터 및 선택 항목
    formData,
    selectedItem,
    // 직접 설정 함수 (폼 입력 변경 시 사용)
    setFormData,
    setSelectedItem,
    // 모달 제어 함수
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  };
};
