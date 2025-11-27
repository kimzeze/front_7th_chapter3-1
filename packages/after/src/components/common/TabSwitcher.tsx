import React from 'react';

interface TabSwitcherProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  return (
    <div
      style={{
        marginBottom: "15px",
        borderBottom: "2px solid #ccc",
        paddingBottom: "5px",
      }}
    >
      <button
        onClick={() => onTabChange("post")}
        style={{
          padding: "8px 16px",
          marginRight: "5px",
          fontSize: "14px",
          fontWeight: activeTab === "post" ? "bold" : "normal",
          border: "1px solid #999",
          background: activeTab === "post" ? "#1976d2" : "#f5f5f5",
          color: activeTab === "post" ? "white" : "#333",
          cursor: "pointer",
          borderRadius: "3px",
        }}
      >
        게시글
      </button>
      <button
        onClick={() => onTabChange("user")}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: activeTab === "user" ? "bold" : "normal",
          border: "1px solid #999",
          background: activeTab === "user" ? "#1976d2" : "#f5f5f5",
          color: activeTab === "user" ? "white" : "#333",
          cursor: "pointer",
          borderRadius: "3px",
        }}
      >
        사용자
      </button>
    </div>
  );
};
