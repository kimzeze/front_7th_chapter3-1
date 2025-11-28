import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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

const statCardVariants = cva(
  "rounded-lg border p-4 transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
        success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
        warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900",
        danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
        info: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const statTextVariants = cva(
  "text-2xl font-bold",
  {
    variants: {
      variant: {
        primary: "text-blue-700 dark:text-blue-400",
        success: "text-green-700 dark:text-green-400",
        warning: "text-yellow-700 dark:text-yellow-400",
        danger: "text-red-700 dark:text-red-400",
        info: "text-purple-700 dark:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

type StatVariant = VariantProps<typeof statCardVariants>["variant"];

export const ManagementStats: React.FC<ManagementStatsProps> = ({ stats }) => {
  const statsArray: (Stat & { variant: StatVariant })[] = [
    { label: "전체", value: stats.total, color: "", variant: "primary" },
    { ...stats.stat1, variant: "success" },
    { ...stats.stat2, variant: "warning" },
    { ...stats.stat3, variant: "danger" },
    { ...stats.stat4, variant: "info" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
      {statsArray.map((stat, index) => (
        <div key={index} className={cn(statCardVariants({ variant: stat.variant }))}>
          <div className="text-xs text-muted-foreground mb-1">
            {stat.label}
          </div>
          <div className={cn(statTextVariants({ variant: stat.variant }))}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
