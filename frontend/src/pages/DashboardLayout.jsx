import "./dashboard.css";
import Calendar from "../components/Calendar";
import TasksChart from "../components/TasksChart";
import TaskPage from "./TaskPage";
import ProfileSettings from "./ProfileSettings";
import { useState, useMemo } from "react";
import {
  MdHome,
  MdChecklist,
  MdInsights,
  MdShowChart,
  MdSettings,
  MdLogout,
  MdSmartToy,
} from "react-icons/md";

export default function DashboardLayout({
  progress,
  history = [],
  profile,
  updateProfile,
  task,
  setTask,
  steps,
  currentIndex,
  sendTask,
  markDone,
  taskFinished,
  resetTaskSession,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 992;
  });

  const [activeItem, setActiveItem] = useState("dashboard");

  const tasksCompleted = progress?.tasksCompleted || 0;

  const recentHistory = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) return [];
    const lastThree = history.slice(-3);
    return lastThree.map((item, idx) => {
      const indexNumber = history.length - (lastThree.length - 1 - idx);
      const title =
        item.title && item.title !== "Untitled task"
          ? item.title
          : `Task ${indexNumber}`;

      return {
        label: title,
        value: item.tasksCompleted || tasksCompleted,
        completedAt: item.completedAt,
      };
    });
  }, [history, tasksCompleted]);

  const nowLabel = new Date().toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dashboard-root">
      {
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            <div className="brand">
              <span className="brand-logo">
                <MdSmartToy />
              </span>
              {sidebarOpen && (
                <span className="brand-text">Smart Companion</span>
              )}
            </div>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {sidebarOpen ? "«" : "»"}
            </button>
          </div>

          <nav className="sideList">
            <button
              className={`nav-item nav-item-home ${
                activeItem === "dashboard" ? "active" : ""
              }`}
              onClick={() => {
                setActiveItem("dashboard");
              }}
            >
              <span className="nav-icon">
                <MdHome />
              </span>
              <span className="nav-label">Home</span>
            </button>

            <button
              className={`nav-item nav-item-task ${
                activeItem === "task" ? "active" : ""
              }`}
              onClick={() => {
                setActiveItem("task");
              }}
            >
              <span className="nav-icon">
                <MdChecklist />
              </span>
              <span className="nav-label">Task</span>
            </button>

            <button
              className={`nav-item nav-item-analytics ${
                activeItem === "analytics" ? "active" : ""
              }`}
              onClick={() => setActiveItem("analytics")}
            >
              <span className="nav-icon">
                <MdInsights />
              </span>
              <span className="nav-label">Analytics</span>
            </button>
            <button
              className={`nav-item nav-item-charts ${
                activeItem === "charts" ? "active" : ""
              }`}
              onClick={() => setActiveItem("charts")}
            >
              <span className="nav-icon">
                <MdShowChart />
              </span>
              <span className="nav-label">Charts</span>
            </button>
            <button
              className={`nav-item nav-item-settings ${
                activeItem === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveItem("settings")}
            >
              <span className="nav-icon">
                <MdSettings />
              </span>
              <span className="nav-label">Settings</span>
            </button>
          </nav>

          <div className="sideFull">
            <button
              className="logout"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              <span className="logout-icon">
                <MdLogout />
              </span>
              <span className="logout-label">Log out</span>
            </button>
          </div>
        </aside>
      }

      <main
        className="dashboard-main"
        style={{
          marginLeft: sidebarOpen ? "236px" : "72px",
          width: sidebarOpen ? "calc(100% - 236px)" : "calc(100% - 72px)",
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>{nowLabel}</p>
          </div>

          <div className="top-actions">
            <input placeholder="Search" />
            <span>🔔</span>
            <span>👤</span>
          </div>
        </header>

        {activeItem === "task" ? (
          <TaskPage
            task={task}
            setTask={setTask}
            steps={steps}
            currentIndex={currentIndex}
            sendTask={sendTask}
            markDone={markDone}
            taskFinished={taskFinished}
            resetTaskSession={resetTaskSession}
            onBack={() => setActiveItem("dashboard")}
          />
        ) : activeItem === "settings" ? (
          <section className="settings-section">
            <div className="card settings-card">
              <h4>Profile & Preferences</h4>
              <p className="settings-subtitle">
                Tune how Smart Companion breaks down your tasks.
              </p>
              <ProfileSettings
                profile={profile || {}}
                onSave={updateProfile}
              />
            </div>
          </section>
        ) : (
          <>
            <section className="stats">
              <div className="stat green">
                Points <b>{progress?.tasksCompleted * 10 || 0}</b>
              </div>

              <div className="stat green">
                Today’s Target <b>{progress?.dailyTarget || 100}</b>
              </div>

              <div className="stat green">
                Current Streak <b>{progress?.currentStreak || 0}</b>
              </div>

              <div className="stat purple">
                Total Tasks <b>{progress?.tasksCompleted || 0}</b>
              </div>
            </section>

            <section className="grid">
              <div className="grid-left">
                <div className="card wide">
                  <h4>To‑do Lists</h4>
                  {recentHistory.length > 0 ? (
                    <>
                      <TasksChart history={recentHistory} />
                      <ul className="history-list">
                        {recentHistory
                          .slice()
                          .reverse()
                          .map((item, idx) => (
                            <li key={idx}>
                              <span className="history-title">
                                {item.label}
                              </span>
                              {item.completedAt && (
                                <span className="history-date">
                                  {new Date(
                                    item.completedAt,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </li>
                          ))}
                      </ul>
                    </>
                  ) : (
                    <p>Manage your structured micro‑tasks efficiently.</p>
                  )}
                </div>

                <div className="card wide">
                  <h4>Tasks Completed</h4>
                  <TasksChart total={progress?.tasksCompleted || 0} />
                </div>
              </div>

              <div className="card calendar">
                <h4 style={{ textAlign: "center" }}>Calendar</h4>
                <Calendar completedDates={progress?.completedDates || []} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
