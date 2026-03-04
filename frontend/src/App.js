import React, { useState } from "react";
import Login from "./pages/Login";
import { saveUser } from "./utils/storage";
import DashboardLayout from "./pages/DashboardLayout";

function App() {
  const [session, setSession] = useState(null);
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTaskTitle, setCurrentTaskTitle] = useState("");
  const [taskFinished, setTaskFinished] = useState(false);

  // 🔐 LOGIN GUARD
  if (!session) {
    return <Login onLogin={setSession} />;
  }

  const sendTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      const res = await fetch(
        "https://smart-companion-backend.onrender.com/decompose",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task,
            profile: session?.userData?.profile || {},
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      const parsedSteps = Array.isArray(data.steps)
        ? data.steps
        : data.steps?.split("\n").filter((s) => s.trim() !== "") || [];

      setCurrentTaskTitle(task);
      setSteps(parsedSteps);
      setCurrentIndex(0);
      setTask("");
      setTaskFinished(false);
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }
  };

  const markDone = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const updated = {
      ...session.userData,
      progress: {
        tasksCompleted: (session.userData?.progress?.tasksCompleted || 0) + 1,
        currentStreak: (session.userData?.progress?.currentStreak || 0) + 1,
        completedDates: [...(session.userData?.progress?.completedDates || [])],
      },
      rewards: [...(session.userData?.rewards || [])],
      history: [...(session.userData?.history || [])],
    };

    const today = new Date().toISOString().split("T")[0];

    if (!updated.progress.completedDates.includes(today)) {
      updated.progress.completedDates.push(today);
    }

    // 🕒 Task History
    updated.history.push({
      title: currentTaskTitle || null,
      completedAt: new Date().toISOString(),
      stepsCount: steps.length,
      tasksCompleted: updated.progress.tasksCompleted,
    });

    // 🎖 Rewards
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

    setCurrentTaskTitle("");
    setTaskFinished(true);
  };

  const resetTaskSession = () => {
    setTask("");
    setSteps([]);
    setCurrentIndex(0);
    setCurrentTaskTitle("");
    setTaskFinished(false);
  };

  const logout = () => {
    resetTaskSession();
    setSession(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <DashboardLayout
        progress={session?.userData?.progress || {}}
        history={session?.userData?.history || []}
        profile={session?.userData?.profile || {}}
        updateProfile={(nextProfile) => {
          const updatedUserData = {
            ...session.userData,
            profile: nextProfile,
          };
          saveUser(session.username, updatedUserData);
          setSession({ ...session, userData: updatedUserData });
        }}
        onLogout={logout}
        task={task}
        setTask={setTask}
        steps={steps}
        currentIndex={currentIndex}
        sendTask={sendTask}
        markDone={markDone}
        taskFinished={taskFinished}
        resetTaskSession={resetTaskSession}
      />
    </div>
  );
}

export default App;
