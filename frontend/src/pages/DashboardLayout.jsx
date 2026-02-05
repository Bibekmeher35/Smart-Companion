import "./dashboard.css";
import WeeklyChart from "../components/WeeklyChart";
import Calendar from "../components/Calendar";
import TasksChart from "../components/TasksChart";
import { useState } from "react";

export default function DashboardLayout({ onSelect, progress }) {
  const isMobile = window.innerWidth < 768;
  const isDesktop = window.innerWidth >= 992;

  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  const nowLabel = new Date().toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      {!isMobile && (
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <h2 className="brand">Smart Companion</h2>
          <div className="">
            <nav className="sideList">
              <button onClick={() => onSelect("dashboard")}>🏠 Home</button>
              <button onClick={() => onSelect("task")}>📝 Task</button>
              <button>📊 Analytics</button>
              <button>📈 Charts</button>
              <button>⚙️ Settings</button>
            </nav>
          <div className="sideFull">
            <button
              className="logout"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}>
              ↪ Log Out
            </button></div>
          </div>
        </aside>
      )}

      {/* Main */}
      <main
        className="dashboard-main"
        style={{
          marginLeft: !isMobile && sidebarOpen ? "260px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <header className="topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
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

        {/* Stats */}
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

        {/* Content grid */}
        <section className="grid">
          <div className="grid-left">
            <div className="card wide">
              <h4>To‑do lists</h4>
              <p>
                Label
                <br />
                Description
              </p>
              <p>
                Label
                <br />
                Description
              </p>
              <p>
                Label
                <br />
                Description
              </p>
            </div>

            <div className="card">
              <h4>Total Sales</h4>
            </div>

            <div className="card">
              <h4>Balance</h4>
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
      </main>
    </div>
  );
}
