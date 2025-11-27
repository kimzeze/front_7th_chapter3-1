import { useMemo } from "react";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type Entity = User | Post;
type EntityType = "user" | "post";

/**
 * 엔티티 타입에 따른 통계 데이터를 계산하는 커스텀 훅
 *
 * useMemo를 사용하여 data나 entityType이 변경될 때만 재계산됩니다.
 * 사용자 관리와 게시글 관리에서 서로 다른 통계를 제공합니다.
 *
 * @param {Entity[]} data - 통계를 계산할 데이터 배열 (User[] 또는 Post[])
 * @param {EntityType} entityType - 엔티티 타입 ("user" 또는 "post")
 *
 * @returns {Object} 통계 데이터 객체
 * @returns {number} total - 전체 항목 수
 * @returns {Object} stat1 - 첫 번째 통계 (활성/게시됨)
 * @returns {Object} stat2 - 두 번째 통계 (비활성/임시저장)
 * @returns {Object} stat3 - 세 번째 통계 (정지/보관됨)
 * @returns {Object} stat4 - 네 번째 통계 (관리자/총 조회수)
 *
 * @example
 * const stats = useEntityStats(users, "user");
 * // { total: 100, stat1: { label: "활성", value: 80, color: "#2e7d32" }, ... }
 *
 * const stats = useEntityStats(posts, "post");
 * // { total: 50, stat1: { label: "게시됨", value: 30, color: "#2e7d32" }, ... }
 */
export const useEntityStats = (data: Entity[], entityType: EntityType) => {
  return useMemo(() => {
    // 사용자 통계 계산
    if (entityType === "user") {
      const users = data as User[];
      return {
        total: users.length,
        // 상태별 통계
        stat1: {
          label: "활성",
          value: users.filter((u) => u.status === "active").length,
          color: "#2e7d32", // 녹색
        },
        stat2: {
          label: "비활성",
          value: users.filter((u) => u.status === "inactive").length,
          color: "#ed6c02", // 주황색
        },
        stat3: {
          label: "정지",
          value: users.filter((u) => u.status === "suspended").length,
          color: "#d32f2f", // 빨간색
        },
        // 역할별 통계
        stat4: {
          label: "관리자",
          value: users.filter((u) => u.role === "admin").length,
          color: "#1976d2", // 파란색
        },
      };
    }
    // 게시글 통계 계산
    else {
      const posts = data as Post[];
      return {
        total: posts.length,
        // 상태별 통계
        stat1: {
          label: "게시됨",
          value: posts.filter((p) => p.status === "published").length,
          color: "#2e7d32", // 녹색
        },
        stat2: {
          label: "임시저장",
          value: posts.filter((p) => p.status === "draft").length,
          color: "#ed6c02", // 주황색
        },
        stat3: {
          label: "보관됨",
          value: posts.filter((p) => p.status === "archived").length,
          color: "rgba(0, 0, 0, 0.6)", // 회색
        },
        // 전체 조회수 합계
        stat4: {
          label: "총 조회수",
          value: posts.reduce((sum, p) => sum + p.views, 0),
          color: "#1976d2", // 파란색
        },
      };
    }
  }, [data, entityType]); // data 또는 entityType 변경 시에만 재계산
};
