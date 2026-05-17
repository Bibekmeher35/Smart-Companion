import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Predefined color palette for the pie chart slices
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/**
 * TaskDistributionChart Component.
 * Visualizes the distribution of tasks (e.g., by category or type) using a Pie Chart.
 * @param {Array} data - Array of objects with 'name' (category) and 'value' (count).
 */
export default function TaskDistributionChart({ data = [] }) {
  const RADIAN = Math.PI / 180;
  
  /**
   * Helper: Renders percentage labels inside each pie slice.
   * Calculates the center coordinates for the text based on the slice angle and radius.
   */
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" // Center X coordinate (percentage of container)
          cy="50%" // Center Y coordinate
          labelLine={false} // Disable lines connecting slices to labels
          label={renderCustomizedLabel} // Use the custom label function defined above
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          animationDuration={800}
        >
          {/* Map each data entry to a Cell with a specific color from the palette */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

