import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * TasksChart Component.
 * Displays a bar chart representing task completion history or current progress.
 * @param {number} total - Total tasks completed (used as fallback).
 * @param {Array} history - Array of historical data points for the chart.
 */
export default function TasksChart({ total = 0, history = [] }) {
  // --- Data Transformation ---
  // Map historical items to a format Recharts understands, or use the total as a single bar.
  const data =
    history && history.length
      ? history.map((item, idx) => ({
          name: item.label || `#${idx + 1}`,
          Tasks: item.value ?? 0,
        }))
      : [{ name: "Progress", Tasks: total }];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Subtle background grid */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        
        {/* Horizontal Axis: Labels for the bars */}
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45} // Tilt labels for better readability
          textAnchor="end"
          height={60}
        />
        
        {/* Vertical Axis: Task counts */}
        <YAxis tick={{ fontSize: 12 }} />
        
        {/* Hover interaction */}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        
        {/* The Bars: Indigo color with rounded top corners */}
        <Bar 
          dataKey="Tasks" 
          fill="#4f46e5" 
          radius={[8, 8, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}