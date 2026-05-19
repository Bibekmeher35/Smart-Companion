import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveUser, getToken, removeToken, removeUser } from '../utils/storage';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error('Token verification failed:', error);
        removeToken();
        removeUser();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (sessionData) => {
    setSession(sessionData);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setSession(null);
  };

  const updateSession = (updatedUserData) => {
    setSession({
      ...session,
      userData: updatedUserData,
    });
    saveUser(session.username, updatedUserData);
  };

  const updateProfile = async (nextProfile) => {
    const updatedUserData = {
      ...session.userData,
      profile: nextProfile,
    };

    try {
      await authAPI.updateProfile(nextProfile);
      updateSession(updatedUserData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const value = {
    session,
    loading,
    login,
    logout,
    updateSession,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
