import { useMemo } from "react";
import TasksChart from "../components/TasksChart";
import TrendChart from "../components/TrendChart";
import ProgressAreaChart from "../components/ProgressAreaChart";
import TaskDistributionChart from "../components/TaskDistributionChart";
import {
  ChartsPage as StyledChartsPage,
  ChartsHeader,
  ChartsTitle,
  ChartsSubtitle,
  ChartsGrid,
  ChartsCard,
  ChartsCardTitle,
  ChartsCardSubtitle,
  HistoryList,
  HistoryTitle,
  HistoryDate,
} from "../styles/AnalyticsStyles";

/**
 * ChartsPage Component.
 * Aggregates user data and prepares it for visualization across multiple chart types.
 */
export default function ChartsPage({ progress = {}, history = [], dyslexiaMode = false }) {
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
    <StyledChartsPage>
      <ChartsHeader>
        <div>
          <ChartsTitle>Charts</ChartsTitle>
          {!dyslexiaMode && (
            <ChartsSubtitle>
              Visualize your progress and recent activity.
            </ChartsSubtitle>
          )}
        </div>
      </ChartsHeader>

      <ChartsGrid>
        {/* Trend of daily completions */}
        <ChartsCard>
          <ChartsCardTitle>Daily Activity (Last 30 Days)</ChartsCardTitle>
          {!dyslexiaMode && (
            <ChartsCardSubtitle>
              Track your daily task completions over the past month.
            </ChartsCardSubtitle>
          )}
          <TrendChart data={last30Days} />
        </ChartsCard>

        {/* Growth of total completions */}
        <ChartsCard>
          <ChartsCardTitle>Cumulative Progress</ChartsCardTitle>
          {!dyslexiaMode && (
            <ChartsCardSubtitle>
              Your total tasks completed over time.
            </ChartsCardSubtitle>
          )}
          <ProgressAreaChart data={cumulativeProgress} />
        </ChartsCard>

        {/* Breakdown of task complexity */}
        {tasksByCategory.length > 0 && (
          <ChartsCard>
            <ChartsCardTitle>Task Complexity Distribution</ChartsCardTitle>
            {!dyslexiaMode && (
              <ChartsCardSubtitle>
                Breakdown of tasks by number of steps.
              </ChartsCardSubtitle>
            )}
            <TaskDistributionChart data={tasksByCategory} />
          </ChartsCard>
        )}

        {/* Total stats summary bar chart */}
        <ChartsCard>
          <ChartsCardTitle>Overall Progress</ChartsCardTitle>
          {!dyslexiaMode && (
            <ChartsCardSubtitle>
              Total tasks completed: <strong>{tasksCompleted}</strong>
            </ChartsCardSubtitle>
          )}
          <TasksChart total={tasksCompleted} />
        </ChartsCard>

        {/* Historical list and chart of latest tasks */}
        <ChartsCard className="wide">
          <ChartsCardTitle>Recent Tasks</ChartsCardTitle>
          {!dyslexiaMode && (
            <ChartsCardSubtitle>
              Latest items from your task history.
            </ChartsCardSubtitle>
          )}
          {recentTasks.length > 0 ? (
            <>
              <TasksChart history={recentTasks} />
              <HistoryList>
                {history
                  .slice(-8)
                  .reverse()
                  .map((item, idx) => (
                    <li key={idx}>
                      <HistoryTitle>
                        {item?.title && item.title !== "Untitled task"
                          ? item.title
                          : "Untitled task"}
                      </HistoryTitle>
                      {item?.completedAt && (
                        <HistoryDate>
                          {new Date(item.completedAt).toLocaleDateString()}
                        </HistoryDate>
                      )}
                    </li>
                  ))}
              </HistoryList>
            </>
          ) : (
            <p>No history yet. Complete a task to see charts here.</p>
          )}
        </ChartsCard>
      </ChartsGrid>
    </StyledChartsPage>
  );
}


