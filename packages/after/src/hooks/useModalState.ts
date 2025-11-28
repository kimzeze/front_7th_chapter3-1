import { useState } from "react";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type Entity = User | Post;

/**
 * 모달 상태를 관리하는 커스텀 훅
 *
 * 생성 모달과 수정 모달의 열림/닫힘 상태를 독립적으로 관리하며,
 * 수정 중인 항목 정보를 저장합니다.
 *
 * 폼 데이터는 react-hook-form으로 관리되므로 이 훅에서는 제외됩니다.
 *
 * @returns {Object} 모달 상태 및 제어 함수
 * @returns {boolean} isCreateModalOpen - 생성 모달 열림 여부
 * @returns {boolean} isEditModalOpen - 수정 모달 열림 여부
 * @returns {Entity | null} selectedItem - 수정 중인 항목
 * @returns {Function} openCreateModal - 생성 모달 열기 함수
 * @returns {Function} closeCreateModal - 생성 모달 닫기 함수
 * @returns {Function} openEditModal - 수정 모달 열기 함수
 * @returns {Function} closeEditModal - 수정 모달 닫기 함수
 *
 * @example
 * const {
 *   isCreateModalOpen,
 *   openCreateModal,
 *   closeCreateModal,
 *   openEditModal,
 *   selectedItem
 * } = useModalState();
 *
 * // 생성 모달 열기
 * openCreateModal();
 *
 * // 수정 모달 열기
 * openEditModal(user);
 */
export const useModalState = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);

  /**
   * 생성 모달을 엽니다
   */
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  /**
   * 생성 모달을 닫습니다
   */
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  /**
   * 수정 모달을 엽니다
   *
   * @param {Entity} item - 수정할 항목 (User 또는 Post)
   */
  const openEditModal = (item: Entity) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  /**
   * 수정 모달을 닫습니다
   */
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  return {
    isCreateModalOpen,
    isEditModalOpen,
    selectedItem,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
  };
};
