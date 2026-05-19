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
import {
  AnalyticsPage as StyledAnalyticsPage,
  AnalyticsHeader,
  AnalyticsTitle,
  AnalyticsSubtitle,
  AnalyticsMetrics,
  AnalyticsMetric,
  AnalyticsMetricLabel,
  AnalyticsMetricValue,
  AnalyticsGrid,
  AnalyticsCard,
  AnalyticsCardTitle,
  AnalyticsCardSubtitle,
  AnalyticsTips,
} from "../styles/AnalyticsStyles";

/**
 * AnalyticsPage Component.
 * Displays deep insights into user productivity using multiple chart types.
 */
export default function AnalyticsPage({ username, progress = {}, history = [], dyslexiaMode = false }) {
  // Extract core progress metrics
  const tasksCompleted = progress?.tasksCompleted || 0;
  const currentStreak = progress?.currentStreak || 0;
  const completedDates = useMemo(() => {
    return Array.isArray(progress?.completedDates) ? progress.completedDates : [];
  }, [progress?.completedDates]);

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
    <StyledAnalyticsPage>
      {/* Header Section */}
      <AnalyticsHeader>
        <div>
          <AnalyticsTitle>Analytics</AnalyticsTitle>
          {!dyslexiaMode && (
            <AnalyticsSubtitle>
              A quick snapshot of your progress, {displayName}.
            </AnalyticsSubtitle>
          )}
        </div>
      </AnalyticsHeader>

      {/* Summary Stat Cards */}
      <AnalyticsMetrics>
        <AnalyticsMetric className="analytics-metric-primary">
          <AnalyticsMetricLabel>Total tasks</AnalyticsMetricLabel>
          <AnalyticsMetricValue>{tasksCompleted}</AnalyticsMetricValue>
        </AnalyticsMetric>
        <AnalyticsMetric>
          <AnalyticsMetricLabel>Current streak</AnalyticsMetricLabel>
          <AnalyticsMetricValue>{currentStreak}</AnalyticsMetricValue>
        </AnalyticsMetric>
        <AnalyticsMetric>
          <AnalyticsMetricLabel>Active days</AnalyticsMetricLabel>
          <AnalyticsMetricValue>{completedDates.length}</AnalyticsMetricValue>
        </AnalyticsMetric>
        <AnalyticsMetric>
          <AnalyticsMetricLabel>Last completed</AnalyticsMetricLabel>
          <AnalyticsMetricValue className="small">{lastCompletedLabel}</AnalyticsMetricValue>
        </AnalyticsMetric>
      </AnalyticsMetrics>

      {/* Visualization Grid */}
      <AnalyticsGrid>
        {/* Weekly Productivity Bar Chart */}
        <AnalyticsCard>
          <AnalyticsCardTitle>Activity by Day of Week</AnalyticsCardTitle>
          {!dyslexiaMode && (
            <AnalyticsCardSubtitle>
              Which days are you most productive?
            </AnalyticsCardSubtitle>
          )}
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
        </AnalyticsCard>

        {/* Performance Overview Radar Chart */}
        <AnalyticsCard>
          <AnalyticsCardTitle>Performance Radar</AnalyticsCardTitle>
          {!dyslexiaMode && (
            <AnalyticsCardSubtitle>
              Your overall performance metrics.
            </AnalyticsCardSubtitle>
          )}
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
        </AnalyticsCard>

        {/* Actionable Tips & Insights */}
        <AnalyticsCard>
          <AnalyticsCardTitle>Quick tips</AnalyticsCardTitle>
          {!dyslexiaMode && (
            <AnalyticsCardSubtitle>
              Small changes that help you keep momentum.
            </AnalyticsCardSubtitle>
          )}
          {dyslexiaMode ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              <div style={{ background: "#e0e7ff", padding: "16px", borderRadius: "18px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", color: "#1e1b4b", border: "2px solid #c7d2fe" }}>
                🚀 Keep tasks short & fun!
              </div>
              <div style={{ background: "#e0f2fe", padding: "16px", borderRadius: "18px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", color: "#1e1b4b", border: "2px solid #bae6fd" }}>
                🔥 Tackle 1 task daily to streak!
              </div>
              <div style={{ background: "#dcfce7", padding: "16px", borderRadius: "18px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", color: "#1e1b4b", border: "2px solid #bbf7d0" }}>
                ✨ Adjust steps in Settings!
              </div>
            </div>
          ) : (
            <AnalyticsTips>
              <li>Keep tasks short and specific.</li>
              <li>Try finishing one task daily to build streak.</li>
              <li>Use Settings to tune step granularity.</li>
              <li>Most productive day: <strong>{weekdayStats.reduce((max, day) => day.Tasks > max.Tasks ? day : max, weekdayStats[0])?.day || 'N/A'}</strong></li>
            </AnalyticsTips>
          )}
        </AnalyticsCard>
      </AnalyticsGrid>
    </StyledAnalyticsPage>
  );
}


