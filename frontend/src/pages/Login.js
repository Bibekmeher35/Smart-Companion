import { useState } from "react";
import { loadUser, saveUser } from "../utils/storage";
import bcrypt from "bcryptjs";
import "./login.css";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      alert("Enter username and password");
      return;
    }

    const user = loadUser(u);

    /* ================= CREATE ACCOUNT ================= */
    if (isNewUser) {
      if (user) {
        alert("User already exists! Please login.");
        return;
      }

      const passwordHash = await bcrypt.hash(p, 10);

      const newUserData = {
        passwordHash,
        profile: {},
        progress: {
          tasksCompleted: 0,
          currentStreak: 0,
        },
        rewards: [],
        createdAt: new Date().toISOString(),
      };

      saveUser(u, newUserData);

      onLogin({
        username: u,
        authToken: passwordHash, // local demo token
        userData: newUserData,
      });

      return;
    }

    /* ================= LOGIN ================= */
    if (!user) {
      alert("No user found");
      return;
    }

    const isValid = await bcrypt.compare(p, user.passwordHash);

    if (!isValid) {
      alert("Wrong password");
      return;
    }

    onLogin({
      username: u,
      authToken: user.passwordHash,
      userData: user,
    });
  };

  return (
    <div className="login-container">
      <h2>Smart Companion</h2>

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
      <div className="input-group" style={{ position: "relative" }}>
        <label>
          Password <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ paddingRight: "40px" }}
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "38px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      {/* Button */}
      <button id="login-btn" onClick={handleLogin}>
        {isNewUser ? "Create Account" : "Login"}
      </button>

      {/* Toggle */}
      <p
        style={{
          marginTop: "15px",
          color: "#555",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={() => setIsNewUser(!isNewUser)}
      >
        {isNewUser
          ? "Already have an account? Login"
          : "New user? Create account"}
      </p>
    </div>
  );
}