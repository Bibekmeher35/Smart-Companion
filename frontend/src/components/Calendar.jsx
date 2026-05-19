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
import {
  CalendarContainer,
  CalendarWeekdays,
  CalendarWeeks,
  CalendarWeek,
  CalendarDay,
} from "../styles/AnalyticsStyles";

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
        count >= 3 ? "#166534" : // Deep green for high activity
        count === 2 ? "#22c55e" : // Bright green
        count === 1 ? "#86efac" : // Soft light green
        isToday(day) ? "#6366f1" : // Premium indigo for today
        "#f8fafc"; // Soft gray-blue background for empty days

      const textColor = count > 0 || isToday(day) ? "#ffffff" : "#334155";

      // Build each day cell
      days.push(
        <CalendarDay
          key={day.toString()}
          $background={background}
          $textColor={textColor}
          $isToday={isToday(day)}
          $count={count}
          $isSameMonth={isSameMonth(day, monthStart)}
        >
          {format(day, "d")}
        </CalendarDay>
      );
      day = addDays(day, 1);
    }

    // Build the week row
    rows.push(
      <CalendarWeek key={day.toString()}>
        {days}
      </CalendarWeek>
    );
    days = [];
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <CalendarContainer>
      {/* Weekday Header Labels */}
      <CalendarWeekdays>
        {weekdays.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </CalendarWeekdays>

      {/* Date Grid Weeks */}
      <CalendarWeeks>
        {rows}
      </CalendarWeeks>
    </CalendarContainer>
  );
}