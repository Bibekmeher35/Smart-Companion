/**
 * API Communication Layer.
 * Provides a structured way to interact with the backend services.
 */

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const API_URL = isLocalhost
  ? "http://localhost:5050"
  : "https://smart-companion-5znk.onrender.com";

/**
 * Helper to retrieve the JWT token from local storage and format it for the Authorization header.
 * @returns {Object} - An object containing the Authorization header or an empty object.
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Authentication and User Management API calls.
 */
export const authAPI = {
  /**
   * Registers a new user.
   */
  register: async (username, password) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  },

  /**
   * Logs in an existing user.
   */
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  },

  /**
   * Verifies the current session token.
   */
  verify: async () => {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Verification failed");
    }

    return data;
  },

  /**
   * Fetches current user data.
   */
  getUser: async () => {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get user");
    }

    return data;
  },

  /**
   * Updates user profile settings (e.g., dyslexia mode, step level).
   */
  updateProfile: async (profile) => {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ profile }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    return data;
  },

  /**
   * Updates the user's password.
   */
  updatePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/api/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update password");
    }

    return data;
  },

  /**
   * Synchronizes user progress, history, and rewards with the backend.
   */
  updateProgress: async (progress, history, rewards) => {
    const response = await fetch(`${API_URL}/api/auth/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ progress, history, rewards }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update progress");
    }

    return data;
  },

  /**
   * Synchronizes the user's todo list with the backend.
   */
  updateTodos: async (todos) => {
    const response = await fetch(`${API_URL}/api/auth/todos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ todos }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update todos");
    }

    return data;
  },
};

/**
 * Task Management API calls.
 */
export const taskAPI = {
  /**
   * Sends a task to the backend to be broken down into steps.
   */
  decompose: async (task, profile) => {
    const response = await fetch(`${API_URL}/decompose`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ task, profile }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to decompose task");
    }

    return data;
  },
};

