import React from 'react';

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
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "10px",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          padding: "12px 15px",
          background: "#e3f2fd",
          border: "1px solid #90caf9",
          borderRadius: "3px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          전체
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1976d2",
          }}
        >
          {stats.total}
        </div>
      </div>

      <div
        style={{
          padding: "12px 15px",
          background: "#e8f5e9",
          border: "1px solid #81c784",
          borderRadius: "3px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          {stats.stat1.label}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#388e3c",
          }}
        >
          {stats.stat1.value}
        </div>
      </div>

      <div
        style={{
          padding: "12px 15px",
          background: "#fff3e0",
          border: "1px solid #ffb74d",
          borderRadius: "3px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          {stats.stat2.label}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#f57c00",
          }}
        >
          {stats.stat2.value}
        </div>
      </div>

      <div
        style={{
          padding: "12px 15px",
          background: "#ffebee",
          border: "1px solid #e57373",
          borderRadius: "3px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          {stats.stat3.label}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#d32f2f",
          }}
        >
          {stats.stat3.value}
        </div>
      </div>

      <div
        style={{
          padding: "12px 15px",
          background: "#f5f5f5",
          border: "1px solid #bdbdbd",
          borderRadius: "3px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "4px",
          }}
        >
          {stats.stat4.label}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#424242",
          }}
        >
          {stats.stat4.value}
        </div>
      </div>
    </div>
  );
};
