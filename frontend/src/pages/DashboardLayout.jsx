import "./dashboard.css";
import Calendar from "../components/Calendar";
import TasksChart from "../components/TasksChart";
import TaskPage from "./TaskPage";
import ProfileSettings from "./ProfileSettings";
import AnalyticsPage from "./AnalyticsPage";
import ChartsPage from "./ChartsPage";
import { loadUser, saveUser } from "../utils/storage";
import bcrypt from "bcryptjs";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdHome,
  MdChecklist,
  MdMenu,
  MdInsights,
  MdShowChart,
  MdSettings,
  MdLogout,
  MdSmartToy,
} from "react-icons/md";

function ChangePasswordSection({ username }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!username) {
      setStatus({ type: "error", message: "No user is currently logged in." });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus({ type: "error", message: "Fill in all password fields." });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "New password should be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      });
      return;
    }

    const user = loadUser(username);
    if (!user || !user.passwordHash) {
      setStatus({
        type: "error",
        message: "Could not find this user in storage.",
      });
      return;
    }

    try {
      setLoading(true);
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        setStatus({ type: "error", message: "Current password is incorrect." });
        setLoading(false);
        return;
      }

      const nextHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = { ...user, passwordHash: nextHash };
      saveUser(username, updatedUser);

      setStatus({
        type: "success",
        message: "Password updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Something went wrong while updating password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h5 className="change-password-title">Change password</h5>
      <p className="change-password-subtitle">
        Update your password securely. You&apos;ll use the new password next
        time you sign in.
      </p>
      <form className="change-password-form" onSubmit={handleSubmit}>
        <label className="change-password-label">
          Current password
          <input
            type="password"
            className="change-password-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label className="change-password-label">
          New password
          <input
            type="password"
            className="change-password-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label className="change-password-label">
          Confirm new password
          <input
            type="password"
            className="change-password-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {status && (
          <div
            className={
              status.type === "success"
                ? "change-password-status success"
                : "change-password-status error"
            }
          >
            {status.message}
          </div>
        )}
        <button
          type="submit"
          className="change-password-button"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function DashboardLayout({
  username,
  progress,
  history = [],
  profile,
  updateProfile,
  onLogout,
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
  const [now, setNow] = useState(() => new Date());
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const profileDropdownRef = useRef(null);

  const tasksCompleted = progress?.tasksCompleted || 0;

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!showProfilePanel) return;

    const handleClickOutside = (event) => {
      if (!profileDropdownRef.current) return;
      if (profileDropdownRef.current.contains(event.target)) return;
      setShowProfilePanel(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showProfilePanel]);

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

  const nowLabel = useMemo(() => {
    return now.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [now]);

  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }, [now]);

  const displayName = (username || "").trim() || "there";

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
                setShowProfilePanel(false);
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
                setShowProfilePanel(false);
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
              onClick={() => {
                setShowProfilePanel(false);
                setActiveItem("analytics");
              }}
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
              onClick={() => {
                setShowProfilePanel(false);
                setActiveItem("charts");
              }}
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
              onClick={() => {
                setShowProfilePanel(false);
                setActiveItem("settings");
              }}
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
                if (onLogout) onLogout();
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

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        className="dashboard-main"
        style={{
          marginLeft: sidebarOpen ? "236px" : "72px",
          width: sidebarOpen ? "calc(100% - 236px)" : "calc(100% - 72px)",
          transition: "margin-left 0.3s ease, width 0.3s ease",
        }}
      >
        <header className="topbar">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <MdMenu />
          </button>

          <div className="topbar-title">
            <h1 className="topbar-greeting">
              {greeting},{" "}
              <span className="topbar-username">{displayName}</span>
            </h1>
            <p>{nowLabel}</p>
          </div>

          <div className="top-actions">
            <input placeholder="Search" />
            <button
              type="button"
              className="top-icon top-icon-notification"
              aria-label="Notifications"
              onClick={() => setShowProfilePanel(false)}
            >
              🔔
            </button>
            <button
              type="button"
              className="top-icon top-icon-profile"
              aria-label="Profile"
              aria-expanded={showProfilePanel}
              onClick={() => setShowProfilePanel((prev) => !prev)}
            >
              👤
            </button>
          </div>
        </header>

        {showProfilePanel && (
          <div className="profile-dropdown" ref={profileDropdownRef}>
            <div className="profile-dropdown-header">
              <div>
                <div className="profile-summary-name">{displayName}</div>
                <div className="profile-summary-meta">
                  Tasks completed:{" "}
                  <span>{progress?.tasksCompleted || 0}</span>
                </div>
              </div>
              <button
                type="button"
                className="profile-dropdown-close"
                aria-label="Close profile panel"
                onClick={() => setShowProfilePanel(false)}
              >
                ✕
              </button>
            </div>
            <ChangePasswordSection username={username} />
          </div>
        )}

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
        ) : activeItem === "analytics" ? (
          <AnalyticsPage
            username={username}
            progress={progress || {}}
            history={history || []}
          />
        ) : activeItem === "charts" ? (
          <ChartsPage progress={progress || {}} history={history || []} />
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

            <div className="card settings-card">
              <h4>Account & Security</h4>
              <p className="settings-subtitle">
                View your basic account info and update your password.
              </p>
              <div className="profile-summary settings-profile-summary">
                <div className="profile-summary-name">{displayName}</div>
                <div className="profile-summary-meta">
                  Username: <span>{username || "Unknown"}</span>
                </div>
                <div className="profile-summary-meta">
                  Tasks completed:{" "}
                  <span>{progress?.tasksCompleted || 0}</span>
                </div>
              </div>
              <ChangePasswordSection username={username} />
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
