import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementStats } from "../components/domain/management/ManagementStats";

const meta = {
  title: "Domain/ManagementStats",
  component: ManagementStats,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ManagementStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserStats: Story = {
  args: {
    stats: {
      total: 150,
      active: {
        label: "활성",
        value: 120,
        color: "hsl(var(--chart-4))",
      },
      inactive: {
        label: "비활성",
        value: 20,
        color: "hsl(var(--chart-5))",
      },
      suspended: {
        label: "정지",
        value: 10,
        color: "hsl(var(--destructive))",
      },
      admin: {
        label: "관리자",
        value: 5,
        color: "hsl(var(--chart-3))",
      },
    },
  },
};

export const PostStats: Story = {
  args: {
    stats: {
      total: 250,
      published: {
        label: "게시됨",
        value: 180,
        color: "hsl(var(--chart-4))",
      },
      draft: {
        label: "임시저장",
        value: 50,
        color: "hsl(var(--chart-5))",
      },
      archived: {
        label: "보관됨",
        value: 20,
        color: "hsl(var(--muted-foreground))",
      },
      totalViews: {
        label: "총 조회수",
        value: 15420,
        color: "hsl(var(--chart-3))",
      },
    },
  },
};

export const EmptyUserStats: Story = {
  args: {
    stats: {
      total: 0,
      active: {
        label: "활성",
        value: 0,
        color: "hsl(var(--chart-4))",
      },
      inactive: {
        label: "비활성",
        value: 0,
        color: "hsl(var(--chart-5))",
      },
      suspended: {
        label: "정지",
        value: 0,
        color: "hsl(var(--destructive))",
      },
      admin: {
        label: "관리자",
        value: 0,
        color: "hsl(var(--chart-3))",
      },
    },
  },
};

export const LargeNumbers: Story = {
  args: {
    stats: {
      total: 1000000,
      published: {
        label: "게시됨",
        value: 850000,
        color: "hsl(var(--chart-4))",
      },
      draft: {
        label: "임시저장",
        value: 100000,
        color: "hsl(var(--chart-5))",
      },
      archived: {
        label: "보관됨",
        value: 50000,
        color: "hsl(var(--muted-foreground))",
      },
      totalViews: {
        label: "총 조회수",
        value: 99999999,
        color: "hsl(var(--chart-3))",
      },
    },
  },
};
