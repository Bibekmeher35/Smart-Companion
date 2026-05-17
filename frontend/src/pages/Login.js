import { useState } from "react";
import { saveToken, saveUser } from "../utils/storage";
import { authAPI } from "../utils/api";
import "./login.css";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

/**
 * Login Component.
 * Handles both user authentication (login) and registration (signup).
 */
export default function Login({ onLogin }) {
  // --- UI State ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [isNewUser, setIsNewUser] = useState(false); // Toggle between Login and Register modes
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
=======
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> 3babafa (update message)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * handleLogin: Centralized function for authentication.
   * Based on 'isNewUser', it either calls the register or login API.
   */
  const handleLogin = async () => {
    if (loading) return;
    setError("");

    const u = username.trim();
    const p = password.trim();

    // Validation
    if (!u || !p) {
      setError("Enter username and password.");
      return;
    }

    setLoading(true);

<<<<<<< HEAD
    try {
      let response;

      // API Call: Register if new user, Login otherwise
      if (isNewUser) {
        response = await authAPI.register(u, p);
      } else {
        response = await authAPI.login(u, p);
      }

      // Persist credentials in local storage
      saveToken(response.token);
      saveUser(response.user.username, response.user);
=======
    /* ================= CREATE ACCOUNT ================= */
    if (isNewUser) {
      if (user) {
        setError("User already exists. Please login instead.");
        return;
      }

      setLoading(true);

      const passwordHash = await bcrypt.hash(p, 10);

      const newUserData = {
        passwordHash,
        profile: {},
        progress: {
          tasksCompleted: 0,
          currentStreak: 0,
        },
        rewards: [],
        history: [],
        createdAt: new Date().toISOString(),
      };

      saveUser(u, newUserData);
>>>>>>> 3babafa (update message)

      // Notify parent component (App.js) of successful login
      onLogin({
        username: response.user.username,
        authToken: response.token,
        userData: response.user,
      });
<<<<<<< HEAD
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
=======

      setLoading(false);
      return;
    }

    /* ================= LOGIN ================= */
    if (!user) {
      setError("No user found with that username.");
      return;
    }

    setLoading(true);

    const isValid = await bcrypt.compare(p, user.passwordHash);

    if (!isValid) {
      setError("Wrong password. Please try again.");
      setLoading(false);
      return;
    }

    onLogin({
      username: u,
      authToken: user.passwordHash,
      userData: user,
    });

    setLoading(false);
>>>>>>> 3babafa (update message)
  };

  return (
    <div className="login-root">
<<<<<<< HEAD
      {/* Branding Section */}
=======
>>>>>>> 3babafa (update message)
      <div className="login-hero">
        <h1>Smart Companion</h1>
        <p>Turn big tasks into simple, guided steps.</p>
      </div>

<<<<<<< HEAD
      {/* Form Section */}
      <div className="login-container">
        <h2>{isNewUser ? "Create your account" : "Welcome back"}</h2>

        {/* Username Field */}
=======
      <div className="login-container">
        <h2>{isNewUser ? "Create your account" : "Welcome back"}</h2>

        {/* Username */}
>>>>>>> 3babafa (update message)
        <div className="input-group">
          <label>
            Username <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

<<<<<<< HEAD
        {/* Password Field with Visibility Toggle */}
=======
        {/* Password */}
>>>>>>> 3babafa (update message)
        <div className="input-group password-group">
          <label>
            Password <span style={{ color: "red" }}>*</span>
          </label>

<<<<<<< HEAD
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {error && <div className="login-error">{error}</div>}

        {/* Action Button */}
=======
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {error && <div className="login-error">{error}</div>}

        {/* Button */}
>>>>>>> 3babafa (update message)
        <button
          id="login-btn"
          onClick={handleLogin}
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading
            ? isNewUser
              ? "Creating account..."
              : "Signing in..."
            : isNewUser
            ? "Create Account"
            : "Login"}
        </button>

<<<<<<< HEAD
        {/* Auth Mode Toggle (Login <-> Register) */}
=======
        {/* Toggle */}
>>>>>>> 3babafa (update message)
        <p className="login-toggle" onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser
            ? "Already have an account? Login"
            : "New user? Create account"}
        </p>
      </div>
    </div>
  );
}