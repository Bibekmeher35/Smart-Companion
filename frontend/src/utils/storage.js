// storage.js

const USERS_KEY = "SMART_COMPANION_USERS";

/**
 * Get all users safely
 */
function getAllUsers() {
  const stored = localStorage.getItem(USERS_KEY);

  if (!stored) return {};

  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error("Corrupted users storage. Resetting...");
    localStorage.removeItem(USERS_KEY);
    return {};
  }
}

/**
 * Save a single user
 */
export function saveUser(username, userData) {
  const users = getAllUsers();

  users[username] = userData;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Load a single user
 */
export function loadUser(username) {
  const users = getAllUsers();
  return users[username] || null;
}

/**
 * (Optional) Remove user – useful for logout/testing
 */
export function removeUser(username) {
  const users = getAllUsers();

  if (users[username]) {
    delete users[username];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

/**
 * (Optional) Clear everything – DEV ONLY
 */
export function clearAllUsers() {
  localStorage.removeItem(USERS_KEY);
}