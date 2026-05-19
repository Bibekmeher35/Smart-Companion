import React, { useEffect, useState, useMemo, useRef } from "react";
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
import {
  DashboardRoot,
  Sidebar,
  SidebarHeader,
  Brand,
  BrandLogo,
  BrandText,
  SidebarToggle,
  SideList,
  NavItem,
  NavIcon,
  NavLabel,
  SideFull,
  LogoutButton,
  LogoutIcon,
  LogoutLabel,
  SidebarBackdrop,
  DashboardMain,
  Topbar,
  MobileMenuBtn,
  TopbarTitle,
  TopbarGreeting,
  TopbarUsername,
  TopbarSubtitle,
  TopActions,
  SearchBarWrapper,
  SearchBarInput,
  SearchBarKbd,
  TopIcon,
} from '../styles/DashboardStyles';
import {
  Card,
  Stats,
  StatCard,
  StatCardContent,
  StatCardLabel,
  StatCardValue,
  StatCardIcon,
  Grid,
  GridLeft,
  SettingsSection,
  SettingsCard,
  SettingsSubtitle,
  ProfileDropdown,
  ProfileDropdownHeader,
  ProfileDropdownClose,
  ProfileSummary,
  ProfileSummaryName,
  ProfileSummaryMeta,
  ChangePassword,
  ChangePasswordTitle,
  ChangePasswordSubtitle,
  ChangePasswordForm,
  ChangePasswordLabel,
  ChangePasswordInput,
  ChangePasswordStatus,
  ChangePasswordButton,
} from '../styles/ComponentStyles';

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
    <ChangePassword>
      <ChangePasswordTitle>
        {dyslexiaMode ? "🔑 Change Password" : "Change password"}
      </ChangePasswordTitle>
      {!dyslexiaMode && (
        <ChangePasswordSubtitle>
          Update your password securely. You&apos;ll use the new password next
          time you sign in.
        </ChangePasswordSubtitle>
      )}
      <ChangePasswordForm onSubmit={handleSubmit}>
        <ChangePasswordLabel>
          {dyslexiaMode ? "🔒 Current password" : "Current password"}
          <ChangePasswordInput
            type="password"
            placeholder={dyslexiaMode ? "Type your current password..." : ""}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </ChangePasswordLabel>
        <ChangePasswordLabel>
          {dyslexiaMode ? "✨ New password (at least 6 characters)" : "New password"}
          <ChangePasswordInput
            type="password"
            placeholder={dyslexiaMode ? "Type a strong new password..." : ""}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </ChangePasswordLabel>
        <ChangePasswordLabel>
          {dyslexiaMode ? "✅ Confirm new password" : "Confirm new password"}
          <ChangePasswordInput
            type="password"
            placeholder={dyslexiaMode ? "Retype your new password..." : ""}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </ChangePasswordLabel>
        {status && (
          <ChangePasswordStatus $type={status.type}>
            {status.message}
          </ChangePasswordStatus>
        )}
        <ChangePasswordButton type="submit" disabled={loading}>
          {loading ? "Updating..." : (dyslexiaMode ? "🔄 Update Password Securely" : "Update password")}
        </ChangePasswordButton>
      </ChangePasswordForm>
    </ChangePassword>
  );
}

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
  goToPreviousStep,
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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

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

  const navItems = [
    { id: "dashboard", icon: MdHome, label: "Home" },
    { id: "task", icon: MdChecklist, label: "Task" },
    { id: "analytics", icon: MdInsights, label: "Analytics" },
    { id: "charts", icon: MdShowChart, label: "Charts" },
    { id: "settings", icon: MdSettings, label: "Settings" },
  ];

  return (
    <DashboardRoot>
      <Sidebar $open={sidebarOpen}>
        <SidebarHeader $closed={!sidebarOpen}>
          <Brand $closed={!sidebarOpen}>
            <BrandLogo>
              <MdSmartToy />
            </BrandLogo>
            {sidebarOpen && <BrandText>Smart Companion</BrandText>}
          </Brand>
          <SidebarToggle
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <MdChevronLeft /> : <MdChevronRight />}
          </SidebarToggle>
        </SidebarHeader>

        <SideList $closed={!sidebarOpen}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <NavItem
                key={item.id}
                $active={isActive}
                $closed={!sidebarOpen}
                onClick={() => {
                  setShowProfilePanel(false);
                  setActiveItem(item.id);
                }}
              >
                <NavIcon $closed={!sidebarOpen} $active={isActive} $index={index}>
                  <Icon />
                </NavIcon>
                <NavLabel $closed={!sidebarOpen}>{item.label}</NavLabel>
              </NavItem>
            );
          })}
        </SideList>

        <SideFull $closed={!sidebarOpen}>
          <LogoutButton $closed={!sidebarOpen} onClick={() => { if (onLogout) onLogout(); }}>
            <LogoutIcon $closed={!sidebarOpen}>
              <MdLogout />
            </LogoutIcon>
            <LogoutLabel $closed={!sidebarOpen}>Log out</LogoutLabel>
          </LogoutButton>
        </SideFull>
      </Sidebar>

      <SidebarBackdrop $show={sidebarOpen} onClick={() => setSidebarOpen(false)} aria-label="Close menu" />

      <DashboardMain $sidebarOpen={sidebarOpen}>
        <Topbar>
          <MobileMenuBtn onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <MdMenu />
          </MobileMenuBtn>

          <TopbarTitle>
            <TopbarGreeting>
              {greeting}, <TopbarUsername>{displayName}</TopbarUsername>
            </TopbarGreeting>
            <TopbarSubtitle>{nowLabel}</TopbarSubtitle>
          </TopbarTitle>

          <TopActions>
            <SearchBarWrapper onClick={() => setShowSearchModal(true)}>
              <SearchBarInput placeholder="Search..." readOnly />
              <SearchBarKbd>⌘K</SearchBarKbd>
            </SearchBarWrapper>

            <TopIcon
              className="notification"
              aria-label="Notifications"
              onClick={() => {
                setShowProfilePanel(false);
                alert("In development");
              }}
            >
              <MdNotifications />
            </TopIcon>

            <TopIcon
              className="profile"
              aria-label="Profile"
              aria-expanded={showProfilePanel}
              onClick={() => setShowProfilePanel((prev) => !prev)}
            >
              <MdAccountCircle />
            </TopIcon>
          </TopActions>
        </Topbar>

        {showProfilePanel && (
          <ProfileDropdown ref={profileDropdownRef}>
            <ProfileDropdownHeader>
              <div>
                <ProfileSummaryName>{displayName}</ProfileSummaryName>
                <ProfileSummaryMeta>
                  Tasks completed: <span>{progress?.tasksCompleted || 0}</span>
                </ProfileSummaryMeta>
              </div>
              <ProfileDropdownClose
                aria-label="Close profile panel"
                onClick={() => setShowProfilePanel(false)}
              >
                ✕
              </ProfileDropdownClose>
            </ProfileDropdownHeader>
            <ChangePasswordSection username={username} profile={profile} />
          </ProfileDropdown>
        )}

        {activeItem === "task" ? (
          <TaskPage
            task={task}
            setTask={setTask}
            steps={steps}
            currentIndex={currentIndex}
            sendTask={sendTask}
            markDone={markDone}
            goToPreviousStep={goToPreviousStep}
            taskFinished={taskFinished}
            resetTaskSession={resetTaskSession}
            onBack={() => setActiveItem("dashboard")}
          />
        ) : activeItem === "analytics" ? (
          <AnalyticsPage
            username={username}
            progress={progress || {}}
            history={history || []}
            dyslexiaMode={!!profile?.dyslexiaMode}
          />
        ) : activeItem === "charts" ? (
          <ChartsPage
            progress={progress || {}}
            history={history || []}
            dyslexiaMode={!!profile?.dyslexiaMode}
          />
        ) : activeItem === "settings" ? (
          <SettingsSection>
            <SettingsCard>
              <h4>Profile & Preferences</h4>
              {!profile?.dyslexiaMode && (
                <SettingsSubtitle>
                  Tune how Smart Companion breaks down your tasks.
                </SettingsSubtitle>
              )}
              <ProfileSettings profile={profile || {}} onSave={updateProfile} />
            </SettingsCard>

            <SettingsCard>
              <h4>{profile?.dyslexiaMode ? "🔒 Account & Security" : "Account & Security"}</h4>
              {!profile?.dyslexiaMode && (
                <SettingsSubtitle>
                  View your basic account info and update your password.
                </SettingsSubtitle>
              )}
              
              {profile?.dyslexiaMode ? (
                <div style={{
                  background: "#ffffff",
                  border: "4px solid #c7d2fe",
                  borderRadius: "24px",
                  padding: "24px",
                  marginBottom: "24px",
                  boxShadow: "0 10px 25px rgba(99, 102, 241, 0.05)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "1.45rem", fontWeight: "900", color: "#1e1b4b" }}>
                    👤 {displayName}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "16px", borderTop: "2px dashed #c7d2fe", paddingTop: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "900", fontSize: "1.2rem", color: "#1e1b4b" }}>
                      🏆 Achievement: <span style={{ color: "#6366f1", fontWeight: "900" }}>{progress?.tasksCompleted || 0} Done</span>
                    </div>
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
                <ProfileSummary style={{ marginBottom: "16px" }}>
                  <ProfileSummaryName>{displayName}</ProfileSummaryName>
                  <ProfileSummaryMeta>
                    Username: <span>{username || "Unknown"}</span>
                  </ProfileSummaryMeta>
                  <ProfileSummaryMeta>
                    Tasks completed: <span>{progress?.tasksCompleted || 0}</span>
                  </ProfileSummaryMeta>
                </ProfileSummary>
              )}
              
              <ChangePasswordSection username={username} profile={profile} />
            </SettingsCard>
          </SettingsSection>
        ) : (
          <>
            <Stats>
              <StatCard $variant="points">
                <StatCardContent>
                  <StatCardLabel>Points Earned</StatCardLabel>
                  <StatCardValue>{progress?.tasksCompleted * 10 || 0}</StatCardValue>
                </StatCardContent>
                <StatCardIcon>
                  <MdEmojiEvents />
                </StatCardIcon>
              </StatCard>

              <StatCard $variant="target">
                <StatCardContent>
                  <StatCardLabel>Today's Target</StatCardLabel>
                  <StatCardValue>{progress?.dailyTarget || 100} XP</StatCardValue>
                </StatCardContent>
                <StatCardIcon>
                  <MdTrackChanges />
                </StatCardIcon>
              </StatCard>

              <StatCard $variant="streak">
                <StatCardContent>
                  <StatCardLabel>Current Streak</StatCardLabel>
                  <StatCardValue>{progress?.currentStreak || 0} Days</StatCardValue>
                </StatCardContent>
                <StatCardIcon>
                  <MdLocalFireDepartment />
                </StatCardIcon>
              </StatCard>

              <StatCard $variant="total">
                <StatCardContent>
                  <StatCardLabel>Total Tasks Completed</StatCardLabel>
                  <StatCardValue>{progress?.tasksCompleted || 0}</StatCardValue>
                </StatCardContent>
                <StatCardIcon>
                  <MdFactCheck />
                </StatCardIcon>
              </StatCard>
            </Stats>

            <Grid>
              <GridLeft>
                <Card className="wide">
                  <TodoList
                    todos={todos}
                    onAddTodo={onAddTodo}
                    onToggleTodo={onToggleTodo}
                    onDeleteTodo={onDeleteTodo}
                  />
                </Card>

                <Card className="wide">
                  <h4>Tasks Completed</h4>
                  <TasksChart total={progress?.tasksCompleted || 0} />
                </Card>
              </GridLeft>

              <Card style={{ textAlign: "center" }}>
                <h4>Calendar</h4>
                <Calendar completedDates={progress?.completedDates || []} />
              </Card>
            </Grid>
          </>
        )}
      </DashboardMain>

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        history={history}
        todos={todos}
        onNavigate={(item) => {
          setShowSearchModal(false);
        }}
      />
    </DashboardRoot>
  );
}
