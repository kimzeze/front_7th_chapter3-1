import { useMemo } from "react";
import type { User, Post } from "@/services";

type Entity = User | Post;
type EntityType = "user" | "post";

interface Stat {
  label: string;
  value: number;
  color: string;
}

interface UserStats {
  total: number;
  active: Stat;
  inactive: Stat;
  suspended: Stat;
  admin: Stat;
}

interface PostStats {
  total: number;
  published: Stat;
  draft: Stat;
  archived: Stat;
  totalViews: Stat;
}

/**
 * 엔티티 타입에 따른 통계 데이터를 계산하는 커스텀 훅
 *
 * useMemo를 사용하여 data나 entityType이 변경될 때만 재계산됩니다.
 * 사용자 관리와 게시글 관리에서 서로 다른 통계를 제공합니다.
 *
 * Design Token을 사용하여 테마에 따라 자동으로 색상이 변경됩니다.
 *
 * @param {Entity[]} data - 통계를 계산할 데이터 배열 (User[] 또는 Post[])
 * @param {EntityType} entityType - 엔티티 타입 ("user" 또는 "post")
 *
 * @returns {UserStats | PostStats} 통계 데이터 객체
 * - UserStats: { total, active, inactive, suspended, admin }
 * - PostStats: { total, published, draft, archived, totalViews }
 *
 * @example
 * const stats = useEntityStats(users, "user");
 * // { total: 100, active: { label: "활성", value: 80, color: "..." }, ... }
 *
 * const stats = useEntityStats(posts, "post");
 * // { total: 50, published: { label: "게시됨", value: 30, color: "..." }, ... }
 */
export const useEntityStats = (
  data: Entity[],
  entityType: EntityType
): UserStats | PostStats => {
  return useMemo(() => {
    // 사용자 통계 계산
    if (entityType === "user") {
      const users = data as User[];
      return {
        total: users.length,
        // 상태별 통계
        active: {
          label: "활성",
          value: users.filter((u) => u.status === "active").length,
          color: "hsl(var(--chart-4))", // 녹색 계열
        },
        inactive: {
          label: "비활성",
          value: users.filter((u) => u.status === "inactive").length,
          color: "hsl(var(--chart-5))", // 주황색 계열
        },
        suspended: {
          label: "정지",
          value: users.filter((u) => u.status === "suspended").length,
          color: "hsl(var(--destructive))", // 빨간색
        },
        // 역할별 통계
        admin: {
          label: "관리자",
          value: users.filter((u) => u.role === "admin").length,
          color: "hsl(var(--chart-3))", // 파란색 계열
        },
      };
    }
    // 게시글 통계 계산
    else {
      const posts = data as Post[];
      return {
        total: posts.length,
        // 상태별 통계
        published: {
          label: "게시됨",
          value: posts.filter((p) => p.status === "published").length,
          color: "hsl(var(--chart-4))", // 녹색 계열
        },
        draft: {
          label: "임시저장",
          value: posts.filter((p) => p.status === "draft").length,
          color: "hsl(var(--chart-5))", // 주황색 계열
        },
        archived: {
          label: "보관됨",
          value: posts.filter((p) => p.status === "archived").length,
          color: "hsl(var(--muted-foreground))", // 회색
        },
        // 전체 조회수 합계
        totalViews: {
          label: "총 조회수",
          value: posts.reduce((sum, p) => sum + p.views, 0),
          color: "hsl(var(--chart-3))", // 파란색 계열
        },
      };
    }
  }, [data, entityType]); // data 또는 entityType 변경 시에만 재계산
};
