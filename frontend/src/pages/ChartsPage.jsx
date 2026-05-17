import { useMemo } from "react";
import TasksChart from "../components/TasksChart";
import TrendChart from "../components/TrendChart";
import ProgressAreaChart from "../components/ProgressAreaChart";
import TaskDistributionChart from "../components/TaskDistributionChart";

/**
 * ChartsPage Component.
 * Aggregates user data and prepares it for visualization across multiple chart types.
 */
export default function ChartsPage({ progress = {}, history = [] }) {
  const tasksCompleted = progress?.tasksCompleted || 0;

  /**
   * Memoized Value: Recent Tasks
   * Extracts the last 8 tasks from history for a detailed bar chart view.
   */
  const recentTasks = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) return [];
    const last = history.slice(-8);
    return last.map((item, idx) => {
      const title =
        item?.title && item.title !== "Untitled task"
          ? item.title
          : `Task #${history.length - (last.length - 1 - idx)}`;
      return {
        label: title,
        value: item?.tasksCompleted ?? 0,
      };
    });
  }, [history]);

  /**
   * Memoized Value: Last 30 Days Activity
   * Generates a daily breakdown of task completions for the trend line chart.
   * Initializes all days with 0 and then fills in from history.
   */
  const last30Days = useMemo(() => {
    const byDay = new Map();
    const today = new Date();
    // Pre-populate last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDay.set(key, 0);
    }

    // Accumulate counts from history
    for (const item of history || []) {
      if (!item?.completedAt) continue;
      const key = String(item.completedAt).slice(0, 10);
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1);
    }

    return Array.from(byDay.entries()).map(([day, count]) => ({
      label: new Date(day).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value: count,
    }));
  }, [history]);

  /**
   * Memoized Value: Cumulative Progress
   * Calculates a running total of tasks completed over the last 30 days for the area chart.
   */
  const cumulativeProgress = useMemo(() => {
    let cumulative = 0;
    return last30Days.map((item) => ({
      label: item.label,
      value: (cumulative += item.value),
    }));
  }, [last30Days]);

  /**
   * Memoized Value: Tasks by Category (Complexity)
   * Groups tasks into categories based on their step count for the pie chart.
   */
  const tasksByCategory = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) return [];
    
    const categories = {
      "Quick Tasks (1-3 steps)": 0,
      "Medium Tasks (4-7 steps)": 0,
      "Complex Tasks (8+ steps)": 0,
    };

    history.forEach((item) => {
      const steps = item?.stepsCount || 0;
      if (steps <= 3) categories["Quick Tasks (1-3 steps)"]++;
      else if (steps <= 7) categories["Medium Tasks (4-7 steps)"]++;
      else categories["Complex Tasks (8+ steps)"]++;
    });

    return Object.entries(categories)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [history]);

  return (
    <section className="charts-page">
      <div className="charts-header">
        <h2 className="charts-title">Charts</h2>
        <p className="charts-subtitle">
          Visualize your progress and recent activity.
        </p>
      </div>

      <div className="charts-grid">
        {/* Trend of daily completions */}
        <div className="card charts-card">
          <h4 className="charts-card-title">Daily Activity (Last 30 Days)</h4>
          <p className="charts-card-subtitle">
            Track your daily task completions over the past month.
          </p>
          <TrendChart data={last30Days} />
        </div>

        {/* Growth of total completions */}
        <div className="card charts-card">
          <h4 className="charts-card-title">Cumulative Progress</h4>
          <p className="charts-card-subtitle">
            Your total tasks completed over time.
          </p>
          <ProgressAreaChart data={cumulativeProgress} />
        </div>

        {/* Breakdown of task complexity */}
        {tasksByCategory.length > 0 && (
          <div className="card charts-card">
            <h4 className="charts-card-title">Task Complexity Distribution</h4>
            <p className="charts-card-subtitle">
              Breakdown of tasks by number of steps.
            </p>
            <TaskDistributionChart data={tasksByCategory} />
          </div>
        )}

        {/* Total stats summary bar chart */}
        <div className="card charts-card">
          <h4 className="charts-card-title">Overall Progress</h4>
          <p className="charts-card-subtitle">
            Total tasks completed: <strong>{tasksCompleted}</strong>
          </p>
          <TasksChart total={tasksCompleted} />
        </div>

        {/* Historical list and chart of latest tasks */}
        <div className="card charts-card wide">
          <h4 className="charts-card-title">Recent Tasks</h4>
          <p className="charts-card-subtitle">
            Latest items from your task history.
          </p>
          {recentTasks.length > 0 ? (
            <>
              <TasksChart history={recentTasks} />
              <ul className="history-list charts-history">
                {history
                  .slice(-8)
                  .reverse()
                  .map((item, idx) => (
                    <li key={idx}>
                      <span className="history-title">
                        {item?.title && item.title !== "Untitled task"
                          ? item.title
                          : "Untitled task"}
                      </span>
                      {item?.completedAt && (
                        <span className="history-date">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <p>No history yet. Complete a task to see charts here.</p>
          )}
        </div>
      </div>
    </section>
  );
}


