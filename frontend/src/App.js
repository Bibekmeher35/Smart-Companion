import React, { useState } from "react";
import Login from "./pages/Login";
import ProgressBar from "./components/ProgressBar";
import { saveUser } from "./utils/storage";
import Rewards from "./components/Rewards";
import ProfileSettings from "./pages/ProfileSettings";
import TaskView from "./pages/TaskView";
import DashboardLayout from "./pages/DashboardLayout";

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("task");
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔐 LOGIN GUARD — MUST BE HERE
  if (!session) {
    return <Login onLogin={setSession} />;
  }
  const sendTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task");
      return;
    }
    try {
      const res = await fetch("http://localhost:5050/decompose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          profile: session.userData.profile,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }
      const data = await res.json();

      const parsedSteps = Array.isArray(data.steps)
        ? data.steps
        : data.steps.split("\n").filter((s) => s.trim() !== "");

      setSteps(parsedSteps);
      setCurrentIndex(0);
      setTask("");
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  const markDone = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const updated = { ...session.userData };
      updated.progress.tasksCompleted += 1;
      updated.progress.currentStreak += 1;

      const today = new Date().toISOString().split("T")[0];

      if (!updated.progress.completedDates) {
        updated.progress.completedDates = [];
      }

      if (!updated.progress.completedDates.includes(today)) {
        updated.progress.completedDates.push(today);
      }

      // 🎖 Rewards logic
      if (
        updated.progress.tasksCompleted === 1 &&
        !updated.rewards.includes("First Step")
      ) {
        updated.rewards.push("First Step");
      }

      if (
        updated.progress.tasksCompleted === 5 &&
        !updated.rewards.includes("Consistency Badge")
      ) {
        updated.rewards.push("Consistency Badge");
      }

      if (
        updated.progress.currentStreak === 3 &&
        !updated.rewards.includes("3-Day Streak")
      ) {
        updated.rewards.push("3-Day Streak");
      }

      saveUser(session.username, updated);
      setSession({ ...session, userData: updated });
    }
  };
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f4f6f8",
      }}
    >
      {view === "task" && (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            padding: "24px",
            fontSize: session.userData?.profile?.dyslexiaMode ? "18px" : "14px",
            lineHeight: session.userData?.profile?.dyslexiaMode ? "1.8" : "1.4",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ textAlign: "center", marginTop: 0 }}>
            Smart Companion
          </h2>

          <p style={{ textAlign: "center", color: "#666" }}>
            Welcome, {session.username}
          </p>

          <button
            onClick={() => setSession(null)}
            style={{
              width: "100%",
              marginBottom: "16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout / Switch User
          </button>

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              onClick={() => setView("task")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Task
            </button>

            <button
              onClick={() => setView("dashboard")}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>
          </div>

          <ProgressBar
            completed={session.userData?.progress?.tasksCompleted || 0}
          />

          <div style={{ marginTop: "12px" }}>
            <Rewards rewards={session.userData?.rewards || []} />
          </div>

          <div style={{ marginTop: "12px" }}>
            <ProfileSettings
              profile={session.userData?.profile || {}}
              onSave={(newProfile) => {
                const updated = {
                  ...session.userData,
                  profile: newProfile,
                };
                saveUser(session.username, updated);
                setSession({ ...session, userData: updated });
              }}
            />
          </div>

          <TaskView
            task={task}
            setTask={setTask}
            steps={steps}
            currentIndex={currentIndex}
            sendTask={sendTask}
            markDone={markDone}
          />
        </div>
      )}
      {view === "dashboard" && (
        <DashboardLayout
          onSelect={setView}
          progress={session.userData.progress}
        />
      )}
    </div>
  );
}

export default App;
