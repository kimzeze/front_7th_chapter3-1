import type { User, Post } from "@/services";
import {
  Badge,
  Button,
} from "@/components/ui";
import {
  getRoleVariant,
  getRoleText,
  getUserStatusVariant,
  getUserStatusText,
} from "@/components/domain/user";
import {
  getPostStatusVariant,
  getPostStatusText,
  getCategoryVariant,
} from "@/components/domain/post";

/**
 * 사용자 테이블 컬럼 정의
 * shadcn/ui Table 컴포넌트에 전달할 컬럼 구성
 */
export const getUserColumns = (
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
export const getPostColumns = (
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
