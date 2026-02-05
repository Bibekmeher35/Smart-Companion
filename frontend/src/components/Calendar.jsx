import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isToday,
} from "date-fns";

export default function Calendar({ completedDates = [] }) {
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const key = format(day, "yyyy-MM-dd");
      const count = completedDates.filter(d => d === key).length;

      const background =
        count >= 3 ? "#14532d" :
        count === 2 ? "#16a34a" :
        count === 1 ? "#4ade80" :
        isToday(day) ? "#4f46e5" :
        "#f1f5f9";

      const textColor = count > 0 || isToday(day) ? "#fff" : "#000";
      days.push(
        <div
          key={day}
          style={{
            padding: "8px",
            borderRadius: "6px",
            textAlign: "center",
            background,
            color: textColor,
            opacity: isSameMonth(day, monthStart) ? 1 : 0.4,
          }}
        >
          {format(day, "d")}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div
        key={day}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
        }}
      >
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        background: "#f9fafb",
        borderRadius: "8px",
      }}
    >
      <h4 style={{ marginBottom: "8px" }}>Calendar</h4>
      {rows}
    </div>
  );
}