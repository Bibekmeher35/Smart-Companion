import { useMemo } from "react";
import TasksChart from "../components/TasksChart";

export default function ChartsPage({ progress = {}, history = [] }) {
  const tasksCompleted = progress?.tasksCompleted || 0;

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

  const last7Days = useMemo(() => {
    const byDay = new Map();
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      byDay.set(key, 0);
    }

    for (const item of history || []) {
      if (!item?.completedAt) continue;
      const key = String(item.completedAt).slice(0, 10);
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1);
    }

    return Array.from(byDay.entries()).map(([day, count]) => ({
      label: new Date(day).toLocaleDateString(undefined, {
        weekday: "short",
      }),
      value: count,
    }));
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
        <div className="card charts-card">
          <h4 className="charts-card-title">Overall progress</h4>
          <p className="charts-card-subtitle">
            Total tasks completed so far.
          </p>
          <TasksChart total={tasksCompleted} />
        </div>

        <div className="card charts-card">
          <h4 className="charts-card-title">Last 7 days</h4>
          <p className="charts-card-subtitle">Daily completions.</p>
          <TasksChart history={last7Days} />
        </div>

        <div className="card charts-card wide">
          <h4 className="charts-card-title">Recent tasks</h4>
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

