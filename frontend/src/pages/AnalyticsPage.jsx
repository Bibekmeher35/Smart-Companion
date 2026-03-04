import { useMemo } from "react";

export default function AnalyticsPage({ username, progress = {}, history = [] }) {
  const tasksCompleted = progress?.tasksCompleted || 0;
  const currentStreak = progress?.currentStreak || 0;
  const completedDates = Array.isArray(progress?.completedDates)
    ? progress.completedDates
    : [];

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
      day,
      count,
      label: new Date(day).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "2-digit",
      }),
    }));
  }, [history]);

  const displayName = (username || "").trim() || "User";

  return (
    <section className="analytics-page">
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">Analytics</h2>
          <p className="analytics-subtitle">
            A quick snapshot of your progress, {displayName}.
          </p>
        </div>
      </div>

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

      <div className="analytics-grid">
        <div className="card analytics-card">
          <h4 className="analytics-card-title">Last 7 days</h4>
          <p className="analytics-card-subtitle">
            Daily completions from your task history.
          </p>

          <div className="analytics-week">
            {last7Days.map((d) => (
              <div className="analytics-day" key={d.day}>
                <div className="analytics-day-top">
                  <span className="analytics-day-label">{d.label}</span>
                  <span className="analytics-day-count">{d.count}</span>
                </div>
                <div className="analytics-day-bar">
                  <span
                    className="analytics-day-bar-fill"
                    style={{
                      width: `${Math.min(100, d.count * 25)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card analytics-card">
          <h4 className="analytics-card-title">Quick tips</h4>
          <p className="analytics-card-subtitle">
            Small changes that help you keep momentum.
          </p>
          <ul className="analytics-tips">
            <li>Keep tasks short and specific.</li>
            <li>Try finishing one task daily to build streak.</li>
            <li>Use Settings to tune step granularity.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

