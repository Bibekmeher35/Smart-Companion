import React, { createContext, useContext } from 'react';
import { authAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { session, updateSession } = useAuth();

  const markDone = async (currentIndex, steps, currentTaskTitle, setCurrentIndex, setTaskFinished) => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const completedDates = [...(session.userData?.progress?.completedDates || [])];

    let newStreak = 1;

    if (!completedDates.includes(today)) {
      completedDates.push(today);

      const sortedDates = completedDates.sort();
      const todayDate = new Date(today);
      let currentStreak = 1;

      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const checkDate = new Date(sortedDates[i]);
        const expectedDate = new Date(todayDate);
        expectedDate.setDate(expectedDate.getDate() - currentStreak);

        if (checkDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
        } else {
          break;
        }
      }

      newStreak = currentStreak;
    } else {
      newStreak = session.userData?.progress?.currentStreak || 1;
    }

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

    updated.history.push({
      title: currentTaskTitle || null,
      completedAt: new Date().toISOString(),
      stepsCount: steps.length,
      tasksCompleted: updated.progress.tasksCompleted,
    });

    if (updated.progress.tasksCompleted === 1 && !updated.rewards.includes('First Step')) {
      updated.rewards.push('First Step');
    }

    if (updated.progress.tasksCompleted === 5 && !updated.rewards.includes('Consistency Badge')) {
      updated.rewards.push('Consistency Badge');
    }

    if (updated.progress.currentStreak >= 3 && !updated.rewards.includes('3-Day Streak')) {
      updated.rewards.push('3-Day Streak');
    }

    try {
      await authAPI.updateProgress(updated.progress, updated.history, updated.rewards);
      updateSession(updated);
      setTaskFinished(true);
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to save progress. Please try again.');
    }
  };

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
      updateSession(updatedUserData);
    } catch (error) {
      console.error('Failed to add todo:', error);
      alert('Failed to add to-do. Please try again.');
    }
  };

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
      updateSession(updatedUserData);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      alert('Failed to update to-do. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    const updatedTodos = (session.userData?.todos || []).filter((todo) => todo.id !== id);
    const updatedUserData = {
      ...session.userData,
      todos: updatedTodos,
    };

    try {
      await authAPI.updateTodos(updatedTodos);
      updateSession(updatedUserData);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      alert('Failed to delete to-do. Please try again.');
    }
  };

  const value = {
    markDone,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
