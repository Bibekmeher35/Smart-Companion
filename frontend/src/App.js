import React, { useEffect, useState } from "react";
import { ThemeProvider } from 'styled-components';
import Login from "./pages/Login";
import { saveUser, getToken, removeToken, removeUser } from "./utils/storage";
import { authAPI, taskAPI } from "./utils/api";
import DashboardLayout from "./pages/DashboardLayout";
import { GlobalStyles } from './styles/GlobalStyles';
import { normalTheme, dyslexiaTheme } from './styles/theme';

/**
 * Main Application Component.
 * Manages global state including user session, current tasks, and application-wide settings.
 */
function App() {
  // --- State Hooks ---
  const [session, setSession] = useState(null); // Stores username, token, and full user data
  const [loading, setLoading] = useState(true); // Manages initial session verification state
  const [task, setTask] = useState(""); // Current input for task decomposition
  const [steps, setSteps] = useState([]); // List of steps for the current active task
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the step currently being viewed
  const [currentTaskTitle, setCurrentTaskTitle] = useState(""); // Title of the task being decomposed
  const [taskFinished, setTaskFinished] = useState(false); // Flag for when all steps are completed

  // Derive dyslexia mode preference from user profile
  const dyslexiaMode = !!session?.userData?.profile?.dyslexiaMode;
  const theme = dyslexiaMode ? { ...dyslexiaTheme, isDyslexia: true } : { ...normalTheme, isDyslexia: false };

  /**
   * Effect: Initial Session Verification
   * Checks for a stored token on load and verifies it with the backend to restore the session.
   */
  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.verify();
        setSession({
          username: response.user.username,
          authToken: token,
          userData: response.user,
        });
        saveUser(response.user.username, response.user);
      } catch (error) {
        console.error("Token verification failed:", error);
        removeToken();
        removeUser();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // --- Render Logic: Loading and Authentication ---
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If no active session, show the Login page
  if (!session) {
    return <Login onLogin={setSession} />;
  }

  // --- core Business Logic Functions ---

  /**
   * Sends the user's task to the backend for decomposition into steps.
   */
  const sendTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task");
      return;
    }

    try {
      // Pass task and user profile preferences (step detail level)
      const data = await taskAPI.decompose(task, session?.userData?.profile || {});

      // Parse the response into an array of steps
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
      
      // Provide user-friendly error messages
      let errorMessage = "Unable to break down the task right now.";
      
      if (err.message.includes("Rate limit") || err.message.includes("429")) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (err.message.includes("temporarily unavailable") || err.message.includes("503")) {
        errorMessage = "The AI service is temporarily unavailable. This usually happens when the server is waking up. Please wait 30 seconds and try again.";
      } else if (err.message.includes("Network") || err.message.includes("fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      alert(errorMessage);
    }
  };

  /**
   * Advances through steps or completes the task.
   * Updates user progress, history, and rewards on the backend upon completion.
   */
  const markDone = async () => {
    // If not on the last step, just advance to the next one
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const completedDates = [...(session.userData?.progress?.completedDates || [])];
    
    // Calculate streak based on consecutive days
    let newStreak = 1;
    
    if (!completedDates.includes(today)) {
      completedDates.push(today);
      
      // Sort dates to calculate streak
      const sortedDates = completedDates.sort();
      
      // Calculate consecutive days from today backwards
      const todayDate = new Date(today);
      let currentStreak = 1;
      
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const checkDate = new Date(sortedDates[i]);
        const expectedDate = new Date(todayDate);
        expectedDate.setDate(expectedDate.getDate() - currentStreak);
        
        // Check if this date is exactly one day before
        if (checkDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      newStreak = currentStreak;
    } else {
      // If already completed today, keep existing streak
      newStreak = session.userData?.progress?.currentStreak || 1;
    }

    // Task completion logic
    const updated = {
      ...session.userData,
      progress: {
        tasksCompleted: (session.userData?.progress?.tasksCompleted || 0) + 1,
        currentStreak: newStreak,
        completedDates: completedDates,
      },
      rewards: [...(session.userData?.rewards || [])],
      history: [...(session.userData?.history || [])],
    };

    // Add task to history
    updated.history.push({
      title: currentTaskTitle || null,
      completedAt: new Date().toISOString(),
      stepsCount: steps.length,
      tasksCompleted: updated.progress.tasksCompleted,
    });

    // Check for reward milestones
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
      updated.progress.currentStreak >= 3 &&
      !updated.rewards.includes("3-Day Streak")
    ) {
      updated.rewards.push("3-Day Streak");
    }

    try {
      // Persist progress to backend
      await authAPI.updateProgress(updated.progress, updated.history, updated.rewards);
      saveUser(session.username, updated);
      setSession({ ...session, userData: updated });
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("Failed to save progress. Please try again.");
      return;
    }

    setCurrentTaskTitle("");
    setTaskFinished(true);
  };

  /**
   * Goes back to the previous step.
   */
  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  /**
   * Resets the active task session to allow starting a new task.
   */
  const resetTaskSession = () => {
    setTask("");
    setSteps([]);
    setCurrentIndex(0);
    setCurrentTaskTitle("");
    setTaskFinished(false);
  };

  /**
   * Handles user logout, clearing local storage and session state.
   */
  const logout = () => {
    removeToken();
    removeUser();
    resetTaskSession();
    setSession(null);
  };

  // --- Todo Management ---

  /**
   * Adds a new todo item to the user's private list.
   */
  const handleAddTodo = async (text) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [...(session.userData?.todos || []), newTodo];
    const updatedUserData = {
      ...session.userData,
      todos: updatedTodos,
    };

    try {
      await authAPI.updateTodos(updatedTodos);
      saveUser(session.username, updatedUserData);
      setSession({ ...session, userData: updatedUserData });
    } catch (error) {
      console.error("Failed to add todo:", error);
      alert("Failed to add to-do. Please try again.");
    }
  };

  /**
   * Toggles the completion status of a todo item.
   */
  const handleToggleTodo = async (id) => {
    const updatedTodos = (session.userData?.todos || []).map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    const updatedUserData = {
      ...session.userData,
      todos: updatedTodos,
    };

    try {
      await authAPI.updateTodos(updatedTodos);
      saveUser(session.username, updatedUserData);
      setSession({ ...session, userData: updatedUserData });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      alert("Failed to update to-do. Please try again.");
    }
  };

  /**
   * Deletes a todo item from the user's list.
   */
  const handleDeleteTodo = async (id) => {
    const updatedTodos = (session.userData?.todos || []).filter(
      (todo) => todo.id !== id
    );
    const updatedUserData = {
      ...session.userData,
      todos: updatedTodos,
    };

    try {
      await authAPI.updateTodos(updatedTodos);
      saveUser(session.username, updatedUserData);
      setSession({ ...session, userData: updatedUserData });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      alert("Failed to delete to-do. Please try again.");
    }
  };

  // --- Main Application Render ---
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DashboardLayout
        username={session?.username}
        progress={session?.userData?.progress || {}}
        history={session?.userData?.history || []}
        profile={session?.userData?.profile || {}}
        todos={session?.userData?.todos || []}
        onAddTodo={handleAddTodo}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
        updateProfile={(nextProfile) => {
          const updatedUserData = {
            ...session.userData,
            profile: nextProfile,
          };
          
          authAPI.updateProfile(nextProfile)
            .then(() => {
              saveUser(session.username, updatedUserData);
              setSession({ ...session, userData: updatedUserData });
            })
            .catch((error) => {
              console.error("Failed to update profile:", error);
              alert("Failed to update profile. Please try again.");
            });
        }}
        onLogout={logout}
        task={task}
        setTask={setTask}
        steps={steps}
        currentIndex={currentIndex}
        sendTask={sendTask}
        markDone={markDone}
        goToPreviousStep={goToPreviousStep}
        taskFinished={taskFinished}
        resetTaskSession={resetTaskSession}
      />
    </ThemeProvider>
  );
}

export default App;

