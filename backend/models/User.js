import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Mongoose Schema for the User model.
 * Stores user authentication details, preferences, progress tracking, and history.
 */
const userSchema = new mongoose.Schema(
  {
    // Unique username for identification
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    // Hashed password for security
    passwordHash: {
      type: String,
      required: true,
    },
    // User preferences for task decomposition and UI accessibility
    profile: {
      stepLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      dyslexiaMode: {
        type: Boolean,
        default: false,
      },
    },
    // Gamification and progress metrics
    progress: {
      tasksCompleted: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      dailyTarget: {
        type: Number,
        default: 100, // Percentage target for daily tasks
      },
      completedDates: {
        type: [String], // Array of dates in 'YYYY-MM-DD' format for streak calculation
        default: [],
      },
    },
    // Earned rewards or achievements
    rewards: {
      type: [String],
      default: [],
    },
    // History of decomposed and completed tasks
    history: [
      {
        title: String,
        completedAt: Date,
        stepsCount: Number,
        tasksCompleted: Number,
      },
    ],
    // User's private todo list items
    todos: [
      {
        id: String,
        text: String,
        completed: Boolean,
        createdAt: Date,
      },
    ],
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash the password before saving to the database.
 * Only hashes the password if it has been modified or is new.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  
  // Hash the password with a salt factor of 10 if it's not already hashed
  if (!this.passwordHash.startsWith("$2")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
});

/**
 * Instance method to compare a candidate password with the stored hash.
 * @param {string} candidatePassword - The plain-text password to check.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Custom toJSON implementation to ensure sensitive data (like passwordHash) 
 * is never sent to the client.
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;

