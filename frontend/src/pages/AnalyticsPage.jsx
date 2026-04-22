import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

/**
 * AnalyticsPage Component.
 * Displays deep insights into user productivity using multiple chart types.
 */
export default function AnalyticsPage({ username, progress = {}, history = [] }) {
  // Extract core progress metrics
  const tasksCompleted = progress?.tasksCompleted || 0;
  const currentStreak = progress?.currentStreak || 0;
  const completedDates = Array.isArray(progress?.completedDates)
    ? progress.completedDates
    : [];

  /**
   * Memoized Value: Last Completed Task Timestamp
   * Finds and formats the timestamp of the most recent activity.
   */
  const lastCompletedLabel = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) return "No activity yet";
    const last = history[history.length - 1];
    if (!last?.completedAt) return "No activity yet";
    try {
      return new Date(last.completedAt).toLocaleString();
    } catch {
      return "No activity yet";
    }
  }, [history]);

  /**
   * Memoized Value: Weekday Statistics
   * Aggregates task history by the day of the week to identify productivity patterns.
   */
  const weekdayStats = useMemo(() => {
    const days = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    history.forEach((item) => {
      if (!item?.completedAt) return;
      const date = new Date(item.completedAt);
      const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
      if (days[dayName] !== undefined) days[dayName]++;
    });

    return Object.entries(days).map(([day, count]) => ({
      day: day.slice(0, 3), // Shorten day name to 3 letters
      Tasks: count,
    }));
  }, [history]);

  /**
   * Memoized Value: Performance Metrics
   * Calculates specific KPIs like consistency and average tasks for the radar chart.
   */
  const performanceMetrics = useMemo(() => {
    const avgTasksPerDay = completedDates.length > 0 
      ? (tasksCompleted / completedDates.length).toFixed(1)
      : 0;
    
    // Consistency calculation based on active days in the last 30 days
    const consistency = completedDates.length > 0
      ? ((completedDates.length / 30) * 100).toFixed(0)
      : 0;

    return [
      { metric: "Avg Tasks/Day", value: parseFloat(avgTasksPerDay) * 10 },
      { metric: "Current Streak", value: currentStreak * 10 },
      { metric: "Consistency %", value: parseFloat(consistency) },
      { metric: "Total Tasks", value: Math.min(tasksCompleted * 2, 100) },
    ];
  }, [tasksCompleted, currentStreak, completedDates]);

  const displayName = (username || "").trim() || "User";

  return (
    <section className="analytics-page">
      {/* Header Section */}
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">Analytics</h2>
          <p className="analytics-subtitle">
            A quick snapshot of your progress, {displayName}.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="analytics-metrics">
        <div className="analytics-metric analytics-metric-primary">
          <div className="analytics-metric-label">Total tasks</div>
          <div className="analytics-metric-value">{tasksCompleted}</div>
        </div>
        <div className="analytics-metric">
          <div className="analytics-metric-label">Current streak</div>
          <div className="analytics-metric-value">{currentStreak}</div>
        </div>
        <div className="analytics-metric">
          <div className="analytics-metric-label">Active days</div>
          <div className="analytics-metric-value">{completedDates.length}</div>
        </div>
        <div className="analytics-metric">
          <div className="analytics-metric-label">Last completed</div>
          <div className="analytics-metric-value small">{lastCompletedLabel}</div>
        </div>
      </div>

      {/* Visualization Grid */}
      <div className="analytics-grid">
        {/* Weekly Productivity Bar Chart */}
        <div className="card analytics-card">
          <h4 className="analytics-card-title">Activity by Day of Week</h4>
          <p className="analytics-card-subtitle">
            Which days are you most productive?
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekdayStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                dataKey="Tasks" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Overview Radar Chart */}
        <div className="card analytics-card">
          <h4 className="analytics-card-title">Performance Radar</h4>
          <p className="analytics-card-subtitle">
            Your overall performance metrics.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.6}
                animationDuration={800}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Actionable Tips & Insights */}
        <div className="card analytics-card">
          <h4 className="analytics-card-title">Quick tips</h4>
          <p className="analytics-card-subtitle">
            Small changes that help you keep momentum.
          </p>
          <ul className="analytics-tips">
            <li>Keep tasks short and specific.</li>
            <li>Try finishing one task daily to build streak.</li>
            <li>Use Settings to tune step granularity.</li>
            <li>Most productive day: <strong>{weekdayStats.reduce((max, day) => day.Tasks > max.Tasks ? day : max, weekdayStats[0])?.day || 'N/A'}</strong></li>
          </ul>
        </div>
      </div>
    </section>
  );
}


