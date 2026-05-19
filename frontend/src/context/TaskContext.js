import React, { createContext, useContext, useState } from 'react';
import { taskAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { session } = useAuth();
  const [task, setTask] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTaskTitle, setCurrentTaskTitle] = useState('');
  const [taskFinished, setTaskFinished] = useState(false);

  const sendTask = async () => {
    if (!task.trim()) {
      alert('Please enter a task');
      return;
    }

    try {
      const data = await taskAPI.decompose(task, session?.userData?.profile || {});
      const parsedSteps = Array.isArray(data.steps)
        ? data.steps
        : data.steps?.split('\n').filter((s) => s.trim() !== '') || [];

      setCurrentTaskTitle(task);
      setSteps(parsedSteps);
      setCurrentIndex(0);
      setTask('');
      setTaskFinished(false);
    } catch (err) {
      console.error(err);

      let errorMessage = 'Unable to break down the task right now.';

      if (err.message.includes('Rate limit') || err.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (err.message.includes('temporarily unavailable') || err.message.includes('503')) {
        errorMessage = 'The AI service is temporarily unavailable. This usually happens when the server is waking up. Please wait 30 seconds and try again.';
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      alert(errorMessage);
    }
  };

  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const resetTaskSession = () => {
    setTask('');
    setSteps([]);
    setCurrentIndex(0);
    setCurrentTaskTitle('');
    setTaskFinished(false);
  };

  const value = {
    task,
    setTask,
    steps,
    currentIndex,
    setCurrentIndex,
    currentTaskTitle,
    taskFinished,
    setTaskFinished,
    sendTask,
    goToPreviousStep,
    resetTaskSession,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
