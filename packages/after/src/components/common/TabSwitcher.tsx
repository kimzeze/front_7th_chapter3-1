import React from "react";
import { Button } from "../ui/button";

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      style={{
        marginBottom: "15px",
        borderBottom: "2px solid #ccc",
        paddingBottom: "5px",
      }}
    >
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
