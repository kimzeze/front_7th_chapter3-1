import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManagementTabs } from "../components/domain/management/ManagementTabs";
import { useState } from "react";

const meta = {
  title: "Domain/ManagementTabs",
  component: ManagementTabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ManagementTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PostTabActive: Story = {
  args: {
    activeTab: "post",
    onTabChange: (tab: string) => console.log("Tab changed to:", tab),
  },
};

export const UserTabActive: Story = {
  args: {
    activeTab: "user",
    onTabChange: (tab: string) => console.log("Tab changed to:", tab),
  },
};

export const Interactive: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("post");
    return (
      <div>
        <ManagementTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-4 p-4 border border-border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">
            현재 활성 탭: <strong>{activeTab}</strong>
          </p>
        </div>
      </div>
    );
  },
};
