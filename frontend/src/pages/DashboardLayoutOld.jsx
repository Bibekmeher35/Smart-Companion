import React, { useEffect, useState, useMemo, useRef } from "react";
import "./dashboard.css";
import "./dashboard-responsive.css";
import Calendar from "../components/Calendar";
import TasksChart from "../components/TasksChart";
import TaskPage from "./TaskPage";
import ProfileSettings from "./ProfileSettings";
import AnalyticsPage from "./AnalyticsPage";
import ChartsPage from "./ChartsPage";
import { authAPI } from "../utils/api";
import TodoList from "../components/TodoList";
import SearchModal from "../components/SearchModal";
import {
  MdHome,
  MdChecklist,
  MdMenu,
  MdInsights,
  MdShowChart,
  MdSettings,
  MdLogout,
  MdSmartToy,
  MdNotifications,
  MdAccountCircle,
  MdChevronLeft,
  MdChevronRight,
  MdEmojiEvents,
  MdTrackChanges,
  MdLocalFireDepartment,
  MdFactCheck,
} from "react-icons/md";

/**
 * ChangePasswordSection Component.
 * Handles the logic and UI for updating the user's password.
 */
function ChangePasswordSection({ username, profile }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const dyslexiaMode = !!profile?.dyslexiaMode;

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

    try {
      setLoading(true);
      await authAPI.updatePassword(currentPassword, newPassword);

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
        message: err.message || "Something went wrong while updating password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h5 className="change-password-title">
        {dyslexiaMode ? "🔑 Change Password" : "Change password"}
      </h5>
      {!dyslexiaMode && (
        <p className="change-password-subtitle">
          Update your password securely. You&apos;ll use the new password next
          time you sign in.
        </p>
      )}
      <form className="change-password-form" onSubmit={handleSubmit}>
        <label className="change-password-label">
          {dyslexiaMode ? "🔒 Current password" : "Current password"}
          <input
            type="password"
            className="change-password-input"
            placeholder={dyslexiaMode ? "Type your current password..." : ""}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label className="change-password-label">
          {dyslexiaMode ? "✨ New password (at least 6 characters)" : "New password"}
          <input
            type="password"
            className="change-password-input"
            placeholder={dyslexiaMode ? "Type a strong new password..." : ""}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label className="change-password-label">
          {dyslexiaMode ? "✅ Confirm new password" : "Confirm new password"}
          <input
            type="password"
            className="change-password-input"
            placeholder={dyslexiaMode ? "Retype your new password..." : ""}
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
          {loading ? "Updating..." : (dyslexiaMode ? "🔄 Update Password Securely" : "Update password")}
        </button>
      </form>
    </div>
  );
}

/**
 * DashboardLayout Component.
 * The primary layout wrapper that provides navigation (sidebar), header (topbar),
 * and dynamically renders content based on the selected menu item.
 */
export default function DashboardLayout({
  username,
  progress,
  history = [],
  profile,
  todos = [],
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
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
  // --- Sidebar & Navigation State ---
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 992; // Default open on large screens
  });

  const [activeItem, setActiveItem] = useState("dashboard"); // Controls which page is displayed
  const [now, setNow] = useState(() => new Date()); // Drives the real-time clock in the header
  const [showProfilePanel, setShowProfilePanel] = useState(false); // Profile dropdown visibility
  const [showSearchModal, setShowSearchModal] = useState(false); // Global search modal visibility
  const profileDropdownRef = useRef(null); // Ref for handling clicks outside the profile panel

  /**
   * Effect: Real-time clock tick every minute.
   */
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  /**
   * Effect: Global Shortcut for Search (CMD+K or CTRL+K).
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /**
   * Effect: Close profile panel when clicking outside.
   */
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

  // recentHistory was unused and removed to satisfy ESLint.

  /**
   * Memoized Value: Formatted Time Label for Topbar.
   */
  const nowLabel = useMemo(() => {
    return now.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [now]);

  /**
   * Memoized Value: Contextual Greeting based on time of day.
   */
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
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-logo">
              <MdSmartToy />
            </span>
            {sidebarOpen && <span className="brand-text">Smart Companion</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <MdChevronLeft /> : <MdChevronRight />}
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
          marginLeft: sidebarOpen ? "236px" : "80px",
          width: sidebarOpen ? "calc(100% - 236px)" : "calc(100% - 80px)",
          transition:
            "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Topbar: Branding, Search, and Profile Actions */}
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
              {greeting}, <span className="topbar-username">{displayName}</span>
            </h1>
            <p>{nowLabel}</p>
          </div>

          <div className="top-actions">
            {/* Search Input (Triggers Modal) */}
            <div
              className="search-bar-wrapper"
              onClick={() => setShowSearchModal(true)}
            >
              <input
                placeholder="Search..."
                readOnly
                className="search-bar-input"
              />
              <kbd className="search-bar-kbd">⌘K</kbd>
            </div>

            <button
              type="button"
              className="top-icon top-icon-notification"
              aria-label="Notifications"
              onClick={() => {
                setShowProfilePanel(false);
                alert("In development");
              }}
            >
              <MdNotifications />
            </button>

            <button
              type="button"
              className="top-icon top-icon-profile"
              aria-label="Profile"
              aria-expanded={showProfilePanel}
              onClick={() => setShowProfilePanel((prev) => !prev)}
            >
              <MdAccountCircle />
            </button>
          </div>
        </header>

        {showProfilePanel && (
          <div className="profile-dropdown" ref={profileDropdownRef}>
            <div className="profile-dropdown-header">
              <div>
                <div className="profile-summary-name">{displayName}</div>
                <div className="profile-summary-meta">
                  Tasks completed: <span>{progress?.tasksCompleted || 0}</span>
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

        {/* --- Main Content Routing --- */}

        {activeItem === "task" ? (
          // Task Decomposition & Execution View
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
          // Detailed Productivity Analytics
          <AnalyticsPage
            username={username}
            progress={progress || {}}
            history={history || []}
            dyslexiaMode={!!profile?.dyslexiaMode}
          />
        ) : activeItem === "charts" ? (
          // Visual Charts & Historical Trends
          <ChartsPage
            progress={progress || {}}
            history={history || []}
            dyslexiaMode={!!profile?.dyslexiaMode}
          />
        ) : activeItem === "settings" ? (
          // User Profile & App Preferences
          <section className="settings-section">
            <div className="card settings-card">
              <h4>Profile & Preferences</h4>
              {!profile?.dyslexiaMode && (
                <p className="settings-subtitle">
                  Tune how Smart Companion breaks down your tasks.
                </p>
              )}
              <ProfileSettings profile={profile || {}} onSave={updateProfile} />
            </div>

            <div className="card settings-card">
              <h4>{profile?.dyslexiaMode ? "🔒 Account & Security" : "Account & Security"}</h4>
              {!profile?.dyslexiaMode && (
                <p className="settings-subtitle">
                  View your basic account info and update your password.
                </p>
              )}
              
              {profile?.dyslexiaMode ? (
                /* Premium, game-ified visual card for ADHD/Dyslexia user rewards */
                <div className="profile-summary settings-profile-summary" style={{
                  background: "#ffffff",
                  border: "4px solid #c7d2fe",
                  borderRadius: "24px",
                  padding: "24px",
                  marginBottom: "24px",
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.05)"
                }}>
                  <div className="profile-summary-name" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.45rem", fontWeight: "900", color: "#1e1b4b" }}>
                    👤 {displayName}
                  </div>
                  <div className="profile-summary-meta" style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px", borderTop: "2px dashed #c7d2fe", paddingTop: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "900", fontSize: "1.2rem", color: "#1e1b4b" }}>
                      🏆 Achievement: <span style={{ color: "#6366f1", fontWeight: "900" }}>{progress?.tasksCompleted || 0} Done</span>
                    </div>
                    {/* Visual Progress Bar Ribbon for rewarding engagement */}
                    <div style={{ marginTop: "6px", background: "#e0e7ff", borderRadius: "10px", height: "18px", width: "100%", overflow: "hidden", border: "1px solid #c7d2fe" }}>
                      <div style={{
                        background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
                        height: "100%",
                        width: `${Math.min(100, Math.max(10, ((progress?.tasksCompleted || 0) % 10) * 10))}%`,
                        borderRadius: "10px",
                        transition: "width 0.4s ease"
                      }} />
                    </div>
                    <div style={{ fontSize: "1rem", color: "#6366f1", fontWeight: "800", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                      <span>Level {Math.floor((progress?.tasksCompleted || 0) / 10) + 1} Planner</span>
                      <span>Next Rank: {10 - ((progress?.tasksCompleted || 0) % 10)} Tasks remaining! 🌟</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="profile-summary settings-profile-summary">
                  <div className="profile-summary-name">{displayName}</div>
                  <div className="profile-summary-meta">
                    Username: <span>{username || "Unknown"}</span>
                  </div>
                  <div className="profile-summary-meta">
                    Tasks completed: <span>{progress?.tasksCompleted || 0}</span>
                  </div>
                </div>
              )}
              
              <ChangePasswordSection username={username} profile={profile} />
            </div>
          </section>
        ) : (
          // Default Dashboard (Home) View
          <>
            {/* Rapid Stat Overview */}
            <section className="stats">
              <div className="stat-card stat-card-points">
                <div className="stat-card-content">
                  <span className="stat-card-label">Points Earned</span>
                  <span className="stat-card-value">{progress?.tasksCompleted * 10 || 0}</span>
                </div>
                <div className="stat-card-icon">
                  <MdEmojiEvents />
                </div>
              </div>

              <div className="stat-card stat-card-target">
                <div className="stat-card-content">
                  <span className="stat-card-label">Today’s Target</span>
                  <span className="stat-card-value">{progress?.dailyTarget || 100} XP</span>
                </div>
                <div className="stat-card-icon">
                  <MdTrackChanges />
                </div>
              </div>

              <div className="stat-card stat-card-streak">
                <div className="stat-card-content">
                  <span className="stat-card-label">Current Streak</span>
                  <span className="stat-card-value">{progress?.currentStreak || 0} Days</span>
                </div>
                <div className="stat-card-icon">
                  <MdLocalFireDepartment />
                </div>
              </div>

              <div className="stat-card stat-card-total">
                <div className="stat-card-content">
                  <span className="stat-card-label">Total Tasks Completed</span>
                  <span className="stat-card-value">{progress?.tasksCompleted || 0}</span>
                </div>
                <div className="stat-card-icon">
                  <MdFactCheck />
                </div>
              </div>
            </section>

            <section className="grid">
              <div className="grid-left">
                {/* To-do List Card */}
                <div className="card wide">
                  <TodoList
                    todos={todos}
                    onAddTodo={onAddTodo}
                    onToggleTodo={onToggleTodo}
                    onDeleteTodo={onDeleteTodo}
                  />
                </div>

                {/* Progress Chart Card */}
                <div className="card wide">
                  <h4>Tasks Completed</h4>
                  <TasksChart total={progress?.tasksCompleted || 0} />
                </div>
              </div>

              {/* Monthly Activity Calendar */}
              <div className="card calendar">
                <h4 style={{ textAlign: "center" }}>Calendar</h4>
                <Calendar completedDates={progress?.completedDates || []} />
              </div>
            </section>
          </>
        )}
      </main>

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        history={history}
        todos={todos}
        onNavigate={(item) => {
          setShowSearchModal(false);
          // Handle navigation based on item type
        }}
      />
    </div>
  );
}
