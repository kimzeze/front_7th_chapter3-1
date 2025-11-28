import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card>
      <CardContent className="p-6">
        <p>Simple card with only content</p>
      </CardContent>
    </Card>
  ),
};

export const WithStats: Story = {
  render: () => (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">전체</div>
        <div className="text-2xl font-bold text-primary">150</div>
      </CardContent>
    </Card>
  ),
};

export const UserInfo: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>사용자 정보</CardTitle>
        <CardDescription>사용자 관리 시스템</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div><strong>이름:</strong> 홍길동</div>
          <div><strong>이메일:</strong> hong@example.com</div>
          <div><strong>역할:</strong> 관리자</div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm">수정</Button>
        <Button size="sm" variant="destructive">삭제</Button>
      </CardFooter>
    </Card>
  ),
};
