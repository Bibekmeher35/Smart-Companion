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

/**
 * Calendar Component.
 * Visualizes task completion history in a monthly calendar format.
 * Days are color-coded based on the number of tasks completed.
 */
export default function Calendar({ completedDates = [] }) {
  // --- Date Range Calculations ---
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  // Iterate through each week within the calculated start and end dates
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const key = format(day, "yyyy-MM-dd");
      // Count how many tasks were completed on this specific day
      const count = completedDates.filter(d => d === key).length;

      /**
       * Dynamic Styling: Color intensity increases with the number of completed tasks.
       * Indigo (#4f46e5) is used to highlight today.
       */
      const background =
        count >= 3 ? "#14532d" : // Dark Green for high activity
        count === 2 ? "#16a34a" : // Medium Green
        count === 1 ? "#4ade80" : // Light Green
        isToday(day) ? "#4f46e5" : // Indigo for today
        "#f1f5f9"; // Neutral for no activity

      const textColor = count > 0 || isToday(day) ? "#fff" : "#000";

      // Build each day cell
      days.push(
        <div
          key={day}
          style={{
            padding: "8px",
            borderRadius: "6px",
            textAlign: "center",
            background,
            color: textColor,
            // Fade out days that belong to the previous or next month
            opacity: isSameMonth(day, monthStart) ? 1 : 0.4,
          }}
        >
          {format(day, "d")}
        </div>
      );
      day = addDays(day, 1);
    }

    // Build the week row
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