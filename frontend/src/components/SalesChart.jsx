import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({ progress }) {
  const data = [
    { name: "Completed", value: progress.tasksCompleted || 0 },
    { name: "Streak", value: progress.currentStreak || 0 },
  ];

  return (
    <div
      style={{
        padding: "12px",
        background: "#f9fafb",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <h4 style={{ marginBottom: "8px" }}>Progress Overview</h4>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}