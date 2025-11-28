import type { User } from "@/services";

/**
 * Badge variant 타입
 */
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/**
 * User role에 따른 Badge variant 반환
 *
 * @param role - 사용자 역할 (admin, moderator, user)
 * @returns Badge variant
 */
export const getRoleVariant = (role: User["role"]): BadgeVariant => {
  const roleVariantMap: Record<User["role"], BadgeVariant> = {
    admin: "destructive",
    moderator: "default",
    user: "secondary",
  };

  return roleVariantMap[role];
};

/**
 * User role의 한글 표시명 반환
 *
 * @param role - 사용자 역할 (admin, moderator, user)
 * @returns 한글 역할명
 */
export const getRoleText = (role: User["role"]): string => {
  const roleTextMap: Record<User["role"], string> = {
    admin: "관리자",
    moderator: "운영자",
    user: "사용자",
  };

  return roleTextMap[role];
};

/**
 * User status에 따른 Badge variant 반환
 *
 * @param status - 사용자 상태 (active, inactive, suspended)
 * @returns Badge variant
 */
export const getUserStatusVariant = (
  status: User["status"]
): BadgeVariant => {
  const statusVariantMap: Record<User["status"], BadgeVariant> = {
    active: "default",
    inactive: "secondary",
    suspended: "destructive",
  };

  return statusVariantMap[status];
};

/**
 * User status의 한글 표시명 반환
 *
 * @param status - 사용자 상태 (active, inactive, suspended)
 * @returns 한글 상태명
 */
export const getUserStatusText = (status: User["status"]): string => {
  const statusTextMap: Record<User["status"], string> = {
    active: "활성",
    inactive: "비활성",
    suspended: "정지",
  };

  return statusTextMap[status];
};
