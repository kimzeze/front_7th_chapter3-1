/**
 * User role을 Badge variant로 매핑
 */
export const getRoleVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive"; // 빨간색
    case "moderator":
      return "default"; // 기본색
    case "user":
      return "secondary"; // 회색
    default:
      return "outline";
  }
};

/**
 * User role을 한글 텍스트로 매핑
 */
export const getRoleText = (role: string) => {
  switch (role) {
    case "admin":
      return "관리자";
    case "moderator":
      return "운영자";
    case "user":
      return "사용자";
    default:
      return role;
  }
};

/**
 * User status를 Badge variant로 매핑
 */
export const getUserStatusVariant = (status: string) => {
  switch (status) {
    case "active":
      return "default"; // 활성: 기본색
    case "inactive":
      return "secondary"; // 비활성: 회색
    case "suspended":
      return "destructive"; // 정지: 빨간색
    default:
      return "outline";
  }
};

/**
 * User status를 한글 텍스트로 매핑
 */
export const getUserStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "활성";
    case "inactive":
      return "비활성";
    case "suspended":
      return "정지";
    default:
      return status;
  }
};

/**
 * Post status를 Badge variant로 매핑
 */
export const getPostStatusVariant = (status: string) => {
  switch (status) {
    case "published":
      return "default"; // 게시됨: 기본색
    case "draft":
      return "secondary"; // 임시저장: 회색
    case "archived":
      return "outline"; // 보관됨: 테두리
    default:
      return "outline";
  }
};

/**
 * Post status를 한글 텍스트로 매핑
 */
export const getPostStatusText = (status: string) => {
  switch (status) {
    case "published":
      return "게시됨";
    case "draft":
      return "임시저장";
    case "archived":
      return "보관됨";
    default:
      return status;
  }
};

/**
 * Post category를 Badge variant로 매핑
 */
export const getCategoryVariant = (category: string) => {
  switch (category) {
    case "development":
      return "default";
    case "design":
      return "secondary";
    case "accessibility":
      return "destructive";
    default:
      return "outline";
  }
};
