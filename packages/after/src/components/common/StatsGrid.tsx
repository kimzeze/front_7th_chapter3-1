import React from "react";
import { Card, CardContent } from "../ui/card";

interface Stat {
  label: string;
  value: number;
  color: string;
}

interface Stats {
  total: number;
  stat1: Stat;
  stat2: Stat;
  stat3: Stat;
  stat4: Stat;
}

interface StatsGridProps {
  stats: Stats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  // stats를 배열로 변환하여 map으로 렌더링
  const statsArray: Stat[] = [
    { label: "전체", value: stats.total, color: "#1976d2" },
    stats.stat1,
    stats.stat2,
    stats.stat3,
    stats.stat4,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {statsArray.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
