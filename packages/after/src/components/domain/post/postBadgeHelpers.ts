import type { Post } from "../../../services/postService";

/**
 * Badge variant 타입
 */
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * Post category 타입 (실제 사용되는 카테고리)
 */
type PostCategory = "development" | "design" | "accessibility";

/**
 * Post status에 따른 Badge variant 반환
 *
 * @param status - 게시글 상태 (published, draft, archived)
 * @returns Badge variant
 */
export const getPostStatusVariant = (status: Post["status"]): BadgeVariant => {
  const statusVariantMap: Record<Post["status"], BadgeVariant> = {
    published: "default",
    draft: "secondary",
    archived: "outline",
  };

  return statusVariantMap[status];
};

/**
 * Post status의 한글 표시명 반환
 *
 * @param status - 게시글 상태 (published, draft, archived)
 * @returns 한글 상태명
 */
export const getPostStatusText = (status: Post["status"]): string => {
  const statusTextMap: Record<Post["status"], string> = {
    published: "게시됨",
    draft: "임시저장",
    archived: "보관됨",
  };

  return statusTextMap[status];
};

/**
 * Post category에 따른 Badge variant 반환
 *
 * @param category - 게시글 카테고리
 * @returns Badge variant
 */
export const getCategoryVariant = (category: string): BadgeVariant => {
  const categoryVariantMap: Record<PostCategory, BadgeVariant> = {
    development: "default",
    design: "secondary",
    accessibility: "destructive",
  };

  return (
    categoryVariantMap[category as PostCategory] ?? "outline"
  );
};
