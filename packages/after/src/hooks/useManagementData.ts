import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { postService } from "../services/postService";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type Entity = User | Post;
type EntityType = "user" | "post";

/**
 * 데이터 CRUD 작업을 관리하는 커스텀 훅
 *
 * entityType에 따라 적절한 서비스(userService 또는 postService)를 호출하여
 * 데이터의 조회, 생성, 수정, 삭제 작업을 수행합니다.
 * entityType이 변경될 때마다 자동으로 데이터를 다시 불러옵니다.
 *
 * @param {EntityType} entityType - 관리할 엔티티 타입 ("user" 또는 "post")
 *
 * @returns {Object} 데이터 및 CRUD 함수
 * @returns {Entity[]} data - 현재 로드된 데이터 배열
 * @returns {Function} loadData - 데이터를 다시 불러오는 함수
 * @returns {Function} createItem - 새 항목을 생성하는 함수
 * @returns {Function} updateItem - 기존 항목을 수정하는 함수
 * @returns {Function} deleteItem - 항목을 삭제하는 함수
 * @returns {Function} changeStatus - 게시글 상태를 변경하는 함수 (게시글 전용)
 *
 * @example
 * const { data, createItem, updateItem, deleteItem } = useManagementData("user");
 *
 * // 사용자 생성
 * await createItem({ username: "john", email: "john@example.com" });
 *
 * // 사용자 수정
 * await updateItem(1, { username: "john_updated" });
 *
 * // 사용자 삭제
 * await deleteItem(1);
 */
export const useManagementData = (entityType: EntityType) => {
  // 현재 로드된 데이터 배열
  const [data, setData] = useState<Entity[]>([]);

  /**
   * 서버에서 데이터를 불러옵니다
   * entityType에 따라 userService 또는 postService를 호출합니다
   */
  const loadData = async () => {
    let result: Entity[];

    // entityType에 따라 적절한 서비스 호출
    if (entityType === "user") {
      result = await userService.getAll();
    } else {
      result = await postService.getAll();
    }

    // 불러온 데이터로 상태 업데이트
    setData(result);
  };

  /**
   * 새 항목을 생성합니다
   * 생성 후 자동으로 데이터를 다시 불러옵니다
   *
   * @param {Object} formData - 생성할 항목의 폼 데이터
   */
  const createItem = async (formData: any) => {
    // entityType에 따라 적절한 서비스 호출
    if (entityType === "user") {
      await userService.create({
        username: formData.username,
        email: formData.email,
        role: formData.role || "user", // 기본값: "user"
        status: formData.status || "active", // 기본값: "active"
      });
    } else {
      await postService.create({
        title: formData.title,
        content: formData.content || "",
        author: formData.author,
        category: formData.category,
        status: formData.status || "draft", // 기본값: "draft"
      });
    }
    // 생성 후 데이터 새로고침
    await loadData();
  };

  /**
   * 기존 항목을 수정합니다
   * 수정 후 자동으로 데이터를 다시 불러옵니다
   *
   * @param {number} id - 수정할 항목의 ID
   * @param {Object} formData - 수정할 내용의 폼 데이터
   */
  const updateItem = async (id: number, formData: any) => {
    // entityType에 따라 적절한 서비스 호출
    if (entityType === "user") {
      await userService.update(id, formData);
    } else {
      await postService.update(id, formData);
    }
    // 수정 후 데이터 새로고침
    await loadData();
  };

  /**
   * 항목을 삭제합니다
   * 삭제 후 자동으로 데이터를 다시 불러옵니다
   *
   * @param {number} id - 삭제할 항목의 ID
   */
  const deleteItem = async (id: number) => {
    // entityType에 따라 적절한 서비스 호출
    if (entityType === "user") {
      await userService.delete(id);
    } else {
      await postService.delete(id);
    }
    // 삭제 후 데이터 새로고침
    await loadData();
  };

  /**
   * 게시글의 상태를 변경합니다 (게시글 전용 기능)
   * 상태 변경 후 자동으로 데이터를 다시 불러옵니다
   *
   * @param {number} id - 상태를 변경할 게시글의 ID
   * @param {"publish" | "archive" | "restore"} action - 수행할 액션
   */
  const changeStatus = async (
    id: number,
    action: "publish" | "archive" | "restore"
  ) => {
    // action에 따라 적절한 postService 메서드 호출
    if (action === "publish") {
      await postService.publish(id);
    } else if (action === "archive") {
      await postService.archive(id);
    } else if (action === "restore") {
      await postService.restore(id);
    }
    // 상태 변경 후 데이터 새로고침
    await loadData();
  };

  // entityType이 변경될 때마다 데이터 다시 불러오기
  useEffect(() => {
    loadData();
  }, [entityType]);

  return {
    // 데이터
    data,
    // CRUD 함수
    loadData,
    createItem,
    updateItem,
    deleteItem,
    changeStatus,
  };
};
