import { useState } from "react";
import { saveToken, saveUser } from "../utils/storage";
import { authAPI } from "../utils/api";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import {
  LoginRoot,
  LoginHero,
  LoginContainer,
  InputGroup,
  PasswordGroup,
  PasswordField,
  PasswordToggle,
  LoginButton,
  LoginToggle,
  LoginError,
} from "../styles/LoginStyles";

/**
 * Login Component.
 * Handles both user authentication (login) and registration (signup).
 */
export default function Login({ onLogin }) {
  // --- UI State ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false); // Toggle between Login and Register modes
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
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

      // Notify parent component (App.js) of successful login
      onLogin({
        username: response.user.username,
        authToken: response.token,
        userData: response.user,
      });
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginRoot>
      {/* Branding Section */}
      <LoginHero>
        <h1>Smart Companion</h1>
        <p>Turn big tasks into simple, guided steps.</p>
      </LoginHero>

      {/* Form Section */}
      <LoginContainer>
        <h2>{isNewUser ? "Create your account" : "Welcome back"}</h2>

        {/* Username Field */}
        <InputGroup>
          <label>
            Username <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>

        {/* Password Field with Visibility Toggle */}
        <PasswordGroup>
          <label>
            Password <span style={{ color: "red" }}>*</span>
          </label>

          <PasswordField>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordToggle
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </PasswordToggle>
          </PasswordField>
        </PasswordGroup>

        {/* Error Feedback */}
        {error && <LoginError>{error}</LoginError>}

        {/* Action Button */}
        <LoginButton
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
        </LoginButton>

        {/* Auth Mode Toggle (Login <-> Register) */}
        <LoginToggle onClick={() => setIsNewUser(!isNewUser)}>
          {isNewUser
            ? "Already have an account? Login"
            : "New user? Create account"}
        </LoginToggle>
      </LoginContainer>
    </LoginRoot>
  );
}