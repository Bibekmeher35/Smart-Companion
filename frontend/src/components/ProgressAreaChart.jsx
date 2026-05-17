import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * ProgressAreaChart Component.
 * Uses Recharts to display a cumulative progress trend over time.
 * @param {Array} data - Array of objects with 'label' (date) and 'value' (task count).
 */
export default function ProgressAreaChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {/* Define a linear gradient for the area fill */}
          <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        
        {/* Background grid lines */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        
        {/* Horizontal Axis: Typically dates or time periods */}
        <XAxis 
          dataKey="label" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        
        {/* Vertical Axis: Task count or percentage */}
        <YAxis tick={{ fontSize: 12 }} />
        
        {/* Hover details */}
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        
        {/* The main data area with a monotone curve and custom gradient fill */}
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4f46e5"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTasks)"
          animationDuration={800}
          name="Cumulative Tasks"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

