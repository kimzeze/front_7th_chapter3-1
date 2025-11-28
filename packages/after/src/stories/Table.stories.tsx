import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="border border-border bg-card rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>
              <Badge>User</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>
              <Badge variant="destructive">Admin</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const UserManagement: Story = {
  render: () => (
    <div className="border border-border bg-card rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "60px" }}>ID</TableHead>
            <TableHead style={{ width: "150px" }}>사용자명</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead style={{ width: "120px" }}>역할</TableHead>
            <TableHead style={{ width: "120px" }}>상태</TableHead>
            <TableHead style={{ width: "200px" }}>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>홍길동</TableCell>
            <TableCell>hong@example.com</TableCell>
            <TableCell>
              <Badge variant="destructive">관리자</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="default">활성</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">수정</Button>
                <Button size="sm" variant="destructive">삭제</Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>김철수</TableCell>
            <TableCell>kim@example.com</TableCell>
            <TableCell>
              <Badge variant="default">운영자</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="default">활성</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">수정</Button>
                <Button size="sm" variant="destructive">삭제</Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>이영희</TableCell>
            <TableCell>lee@example.com</TableCell>
            <TableCell>
              <Badge variant="secondary">사용자</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">비활성</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">수정</Button>
                <Button size="sm" variant="destructive">삭제</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
