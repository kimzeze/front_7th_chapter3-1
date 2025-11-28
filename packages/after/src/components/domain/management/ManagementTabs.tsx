import React from "react";
import { Button } from "../../ui/button";

interface ManagementTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ManagementTabs: React.FC<ManagementTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mb-4 border-b-2 border-border pb-1">
      <Button
        variant={activeTab === "post" ? "default" : "outline"}
        onClick={() => onTabChange("post")}
        className="mr-2"
      >
        게시글
      </Button>
      <Button
        variant={activeTab === "user" ? "default" : "outline"}
        onClick={() => onTabChange("user")}
      >
        사용자
      </Button>
    </div>
  );
};
