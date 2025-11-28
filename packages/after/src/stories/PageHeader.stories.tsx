import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "../components/shared/PageHeader";

const meta = {
  title: "Shared/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "헤더 크기를 조절합니다",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "텍스트 정렬을 조절합니다",
    },
    title: {
      control: "text",
      description: "헤더 제목",
    },
    description: {
      control: "text",
      description: "헤더 설명 (선택사항)",
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "관리 시스템",
    description: "사용자와 게시글을 관리하세요",
  },
};

export const Small: Story = {
  args: {
    title: "작은 헤더",
    description: "size='sm' 옵션을 사용한 작은 크기 헤더입니다",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    title: "큰 헤더",
    description: "size='lg' 옵션을 사용한 큰 크기 헤더입니다",
    size: "lg",
  },
};

export const CenterAligned: Story = {
  args: {
    title: "가운데 정렬 헤더",
    description: "align='center' 옵션으로 텍스트를 가운데 정렬했습니다",
    align: "center",
  },
};

export const RightAligned: Story = {
  args: {
    title: "오른쪽 정렬 헤더",
    description: "align='right' 옵션으로 텍스트를 오른쪽 정렬했습니다",
    align: "right",
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "설명 없는 헤더",
  },
};

export const LargeCentered: Story = {
  args: {
    title: "대형 가운데 정렬 헤더",
    description: "size와 align을 동시에 사용할 수 있습니다",
    size: "lg",
    align: "center",
  },
};

export const AllVariants: Story = {
  args: {
    title: "All Variants Showcase",
  },
  render: () => (
    <div className="space-y-8">
      <div className="border-b pb-8">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
          Small Sizes
        </h3>
        <PageHeader
          title="Small Left"
          description="작은 크기, 왼쪽 정렬"
          size="sm"
          align="left"
        />
        <PageHeader
          title="Small Center"
          description="작은 크기, 가운데 정렬"
          size="sm"
          align="center"
        />
        <PageHeader
          title="Small Right"
          description="작은 크기, 오른쪽 정렬"
          size="sm"
          align="right"
        />
      </div>

      <div className="border-b pb-8">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
          Medium Sizes (Default)
        </h3>
        <PageHeader
          title="Medium Left"
          description="중간 크기, 왼쪽 정렬"
          size="md"
          align="left"
        />
        <PageHeader
          title="Medium Center"
          description="중간 크기, 가운데 정렬"
          size="md"
          align="center"
        />
        <PageHeader
          title="Medium Right"
          description="중간 크기, 오른쪽 정렬"
          size="md"
          align="right"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
          Large Sizes
        </h3>
        <PageHeader
          title="Large Left"
          description="큰 크기, 왼쪽 정렬"
          size="lg"
          align="left"
        />
        <PageHeader
          title="Large Center"
          description="큰 크기, 가운데 정렬"
          size="lg"
          align="center"
        />
        <PageHeader
          title="Large Right"
          description="큰 크기, 오른쪽 정렬"
          size="lg"
          align="right"
        />
      </div>
    </div>
  ),
};
