/**
 * Local Storage Utility Functions.
 * Manages persistent storage of authentication tokens and user session data in the browser.
 */

/**
 * Saves the authentication token to localStorage.
 */
export function saveToken(token) {
  localStorage.setItem("authToken", token);
}

/**
 * Retrieves the authentication token from localStorage.
 */
export function getToken() {
  return localStorage.getItem("authToken");
}

/**
 * Removes the authentication token from localStorage.
 */
export function removeToken() {
  localStorage.removeItem("authToken");
}

/**
 * Saves the current user's session data to localStorage.
 */
export function saveUser(username, userData) {
  localStorage.setItem("currentUser", JSON.stringify({ username, userData }));
}

/**
 * Loads the stored user session data from localStorage.
 * Handles JSON parsing and potential corruption by clearing the entry if invalid.
 */
export function loadUser() {
  const stored = localStorage.getItem("currentUser");
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error("Corrupted user storage. Resetting...");
    localStorage.removeItem("currentUser");
    return null;
  }
}

/**
 * Removes the stored user session data from localStorage.
 */
export function removeUser() {
  localStorage.removeItem("currentUser");
}

/**
 * Clears all data from localStorage.
 */
export function clearAllUsers() {
  localStorage.clear();
}