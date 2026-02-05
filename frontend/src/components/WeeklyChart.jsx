import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { startOfWeek, addDays, format } from "date-fns";

export default function WeeklyChart({ completedDates = [] }) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });

  const data = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(start, i);
    const key = format(day, "yyyy-MM-dd");

    return {
      day: format(day, "EEE"),
      tasks: completedDates.filter(d => d === key).length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="tasks" fill="#4f46e5" radius={[6,6,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}