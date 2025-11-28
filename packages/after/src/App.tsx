import { Header } from "./components/common/Header";
import React from "react";
import { ManagementPage } from "./pages/ManagementPage";
import { ThemeProvider } from "./contexts/ThemeContext";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <ManagementPage />
        </main>
      </div>
    </ThemeProvider>
  );
};
