import { useState } from "react";
import { loadUser, saveUser } from "../utils/storage";
import bcrypt from "bcryptjs";
import "./login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (loading) return;
    setError("");

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      setError("Enter username and password.");
      return;
    }

    const user = loadUser(u);

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

      onLogin({
        username: u,
        authToken: passwordHash, // local demo token
        userData: newUserData,
      });

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
  };

  return (
    <div className="login-root">
      <div className="login-hero">
        <h1>Smart Companion</h1>
        <p>Turn big tasks into simple, guided steps.</p>
      </div>

      <div className="login-container">
        <h2>{isNewUser ? "Create your account" : "Welcome back"}</h2>

        {/* Username */}
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

        {/* Password */}
        <div className="input-group password-group">
          <label>
            Password <span style={{ color: "red" }}>*</span>
          </label>

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

        {/* Toggle */}
        <p className="login-toggle" onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser
            ? "Already have an account? Login"
            : "New user? Create account"}
        </p>
      </div>
    </div>
  );
}