import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate presence of username and password
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    // Validate username length
    if (username.trim().length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create a new user instance (password will be hashed by pre-save middleware)
    const user = new User({
      username: username.trim(),
      passwordHash: password,
    });

    await user.save();

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    // Find user by username
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify the provided password against the stored hash
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token valid for 7 days
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verify current session and return user data
 * @access  Private (Authenticated)
 */
router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Server error during verification" });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user's profile and data
 * @access  Private (Authenticated)
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile preferences (step level, dyslexia mode)
 * @access  Private (Authenticated)
 */
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { profile } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Merge existing profile preferences with new ones
    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    await user.save();

    res.json({ message: "Profile updated", user: user.toJSON() });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   PUT /api/auth/password
 * @desc    Update user password
 * @access  Private (Authenticated)
 */
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password before allowing change
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password (will be hashed by pre-save middleware)
    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   PUT /api/auth/progress
 * @desc    Update user progress, history, and rewards
 * @access  Private (Authenticated)
 */
router.put("/progress", authenticateToken, async (req, res) => {
  try {
    const { progress, history, rewards } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update specific progress metrics
    if (progress) {
      if (progress.tasksCompleted !== undefined) {
        user.progress.tasksCompleted = progress.tasksCompleted;
      }
      if (progress.currentStreak !== undefined) {
        user.progress.currentStreak = progress.currentStreak;
      }
      if (progress.dailyTarget !== undefined) {
        user.progress.dailyTarget = progress.dailyTarget;
      }
      if (progress.completedDates !== undefined) {
        user.progress.completedDates = progress.completedDates;
      }
      user.markModified('progress');
    }

    // Update task history
    if (history !== undefined) {
      user.history = history;
      user.markModified('history');
    }

    // Update earned rewards
    if (rewards !== undefined) {
      user.rewards = rewards;
      user.markModified('rewards');
    }

    await user.save();

    res.json({ message: "Progress updated", user: user.toJSON() });
  } catch (error) {
    console.error("Progress update error:", error);
    console.error("Request body:", JSON.stringify(req.body, null, 2));
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

/**
 * @route   PUT /api/auth/todos
 * @desc    Update user's private todo list
 * @access  Private (Authenticated)
 */
router.put("/todos", authenticateToken, async (req, res) => {
  try {
    const { todos } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Replace the entire todos list
    if (todos !== undefined) {
      user.todos = todos;
      user.markModified('todos');
    }

    await user.save();

    res.json({ message: "Todos updated", user: user.toJSON() });
  } catch (error) {
    console.error("Todos update error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;

