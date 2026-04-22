import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * TrendChart Component.
 * Visualizes task completion trends using a Line Chart.
 * @param {Array} data - Array of objects with 'label' (date) and 'value' (task count).
 */
export default function TrendChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {/* Background grid lines for better readability */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        
        {/* Horizontal Axis: Dates or categories */}
        <XAxis 
          dataKey="label" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        
        {/* Vertical Axis: Count or percentage */}
        <YAxis tick={{ fontSize: 12 }} />
        
        {/* Information displayed on hover */}
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        
        {/* The data line: Indigo color with monotone smoothing and visible dots */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#4f46e5"
          strokeWidth={3}
          dot={{ fill: '#4f46e5', r: 5 }}
          activeDot={{ r: 7 }}
          animationDuration={800}
          name="Tasks Completed"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

