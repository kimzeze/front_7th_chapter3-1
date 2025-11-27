import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
            L
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none">
              Hanghae Company
            </h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              Design System Migration Project
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">
              Demo User
            </div>
            <div className="text-xs text-muted-foreground">
              demo@example.com
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-base">
            DU
          </div>
        </div>
      </div>
    </header>
  );
};
