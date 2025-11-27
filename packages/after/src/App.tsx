import { Header } from "./components/common/Header";
import React from "react";
import { ManagementPage } from "./pages/ManagementPage";

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <ManagementPage />
      </main>
    </div>
  );
};
