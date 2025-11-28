import React from "react";
import { Card, CardContent } from "../../ui/card";

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

interface ManagementStatsProps {
  stats: Stats;
}

export const ManagementStats: React.FC<ManagementStatsProps> = ({ stats }) => {
  const statsArray: Stat[] = [
    { label: "전체", value: stats.total, color: "hsl(var(--primary))" },
    stats.stat1,
    stats.stat2,
    stats.stat3,
    stats.stat4,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
