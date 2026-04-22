/**
 * Main entry point for the Smart Companion Backend.
 * Handles server initialization, middleware configuration, and core API logic.
 */

import express from "express";
import cors from "cors";
import { sanitize } from "./sanitize.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import { authenticateToken } from "./middleware/auth.js";

// Load environment variables from .env file
dotenv.config();

// Establish connection to MongoDB database
connectDB();

const app = express();

/**
 * Configure Cross-Origin Resource Sharing (CORS).
 * Defines allowed origins, methods, and headers to secure the API for production and local development.
 */
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://smart-companion-beta.vercel.app",
        "https://bibekg62rtrjsivganup.drops.nxtwave.tech",
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const isLocalNetwork = origin.match(
        /^http:\/\/(?:localhost|127|10|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\./
      );

      if (allowedOrigins.indexOf(origin) !== -1 || isLocalNetwork) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware to parse incoming JSON request bodies
app.use(express.json());

/**
 * Helper function to interact with the Google Gemini AI API.
 * @param {string} prompt - The text prompt to send to the AI model.
 * @returns {Promise<string>} - The generated text response from the AI.
 */
async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Health check route to verify if the server is running.
 */
app.get("/", (req, res) => {
  res.send("Smart Companion Backend Running");
});

// Authentication routes (Login, Signup, etc.)
app.use("/api/auth", authRoutes);

/**
 * Main decomposition API route.
 * Takes a complex task and breaks it down into simple, manageable steps using AI.
 * Requires a valid authentication token.
 */
app.post("/decompose", authenticateToken, async (req, res) => {
  try {
    // Sanitize input to prevent injection attacks and clean the task description
    const cleanTask = sanitize(req.body.task);
    const profile = req.body.profile || {};

    // Define rules based on the user's preferred step detail level
    const stepRules = {
      low: "Break the task into 3–4 high-level steps.",
      medium: "Break the task into 5–7 clear steps.",
      high: "Break the task into very small, concrete micro-steps (8–12 steps).",
    };

    // Construct the prompt for the AI, incorporating neuro-inclusive guidelines
    const prompt = `
You are a neuro-inclusive task assistant.

Rules:
- Use very simple language
- One action per step
- No explanations
- No emojis
- Max 1 short sentence per step

User preferences:
- Step detail: ${profile.stepLevel || "medium"}
- Dyslexia-friendly mode: ${profile.dyslexiaMode ? "Yes" : "No"}

Task:
"${cleanTask}"

${stepRules[profile.stepLevel] || stepRules["medium"]}

Return ONLY the steps, each on a new line.
`;

    // Fetch steps from Gemini AI
    const text = await callGemini(prompt);

    // Process the text to clean up step numbering and empty lines
    const steps = text
      .split("\n")
      .map((s) => s.replace(/^\d+[.)\s]*/, "").trim())
      .filter(Boolean);

    return res.json({ steps });
  } catch (error) {
    console.error("Task Decomposition Error:", error.message);

    // Return a structured error instead of hardcoded steps
    return res.status(503).json({
      error: "The AI service is temporarily unavailable.",
      message: "We couldn't break down this task right now. Please try again in a few seconds.",
      details: error.message
    });
  }
});

/**
 * Start the server on the specified port.
 */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

});

/**
 * Start the server on the specified port.
 */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

