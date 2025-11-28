import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../components/ui/badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const UserRole: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="destructive">관리자</Badge>
      <Badge variant="default">운영자</Badge>
      <Badge variant="secondary">사용자</Badge>
    </div>
  ),
};

export const UserStatus: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">활성</Badge>
      <Badge variant="secondary">비활성</Badge>
      <Badge variant="destructive">정지</Badge>
    </div>
  ),
};
