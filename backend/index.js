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
        /^http:\/\/(?:localhost|127|10|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\./,
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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Gemini API Response:", errorData);
    throw new Error(`Gemini API Error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Invalid response structure from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
}

/**
 * Health check route to verify if the server is running.
 */
app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "Smart Companion Backend",
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    mongodbConfigured: !!process.env.MONGODB_URI,
  });
});

/**
 * Detailed health check for monitoring.
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
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
    // Validate Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return res.status(500).json({
        error: "Server configuration error",
        message:
          "AI service is not properly configured. Please contact support.",
      });
    }

    // Sanitize input to prevent injection attacks and clean the task description
    const cleanTask = sanitize(req.body.task);
    const profile = req.body.profile || {};

    // Define rules based on the user's preferred step detail level
    const stepRules = {
      low: "You MUST provide exactly 3 to 5 high-level steps. Count them before responding.",
      medium: "You MUST provide exactly 6 to 8 clear, detailed steps. Count them before responding.",
      high: "You MUST provide exactly 10 to 15 very small, concrete micro-steps. Count them before responding.",
    };

    const stepExamples = {
      low: "Example for 'Clean room': 1. Pick up items from floor 2. Organize desk 3. Make bed 4. Vacuum floor",
      medium: "Example for 'Clean room': 1. Pick up clothes 2. Put clothes in hamper 3. Clear desk surface 4. Organize desk items 5. Make bed neatly 6. Vacuum entire floor 7. Empty trash bin",
      high: "Example for 'Clean room': 1. Pick up one piece of clothing 2. Put it in hamper 3. Repeat for all clothes 4. Clear left side of desk 5. Clear right side of desk 6. Wipe desk with cloth 7. Organize pens and pencils 8. Stack books neatly 9. Pull up bottom sheet 10. Pull up top sheet 11. Arrange pillows 12. Plug in vacuum 13. Vacuum under bed 14. Vacuum main floor 15. Empty trash",
    };

    // Construct the prompt for the AI, incorporating neuro-inclusive guidelines
    const prompt = `You are a neuro-inclusive task breakdown assistant for people with ADHD, Autism, and Dyslexia.

IMPORTANT REQUIREMENTS:
1. You MUST generate the EXACT number of steps specified below
2. DO NOT stop generating steps until you reach the required count
3. Each step must be a complete, actionable instruction
4. Number each step clearly (1. 2. 3. etc.)

FORMATTING RULES:
- DO NOT include any thinking, reasoning, or internal monologue
- DO NOT include phrases like "Wait", "Let me think", or any meta-commentary  
- DO NOT include asterisks, parentheses with thoughts, or any analysis
- DO NOT add introductions or conclusions
- Return ONLY the numbered steps, nothing else
- Use very simple, clear language
- One specific action per step
- No explanations or justifications
- No emojis or special characters
- Each step should be one short, complete sentence

USER PROFILE:
- Step detail level: ${profile.stepLevel || "medium"}
- Dyslexia-friendly mode: ${profile.dyslexiaMode ? "Yes (use extra simple words)" : "No"}

TASK TO BREAK DOWN:
"${cleanTask}"

REQUIREMENT:
${stepRules[profile.stepLevel] || stepRules["medium"]}

${stepExamples[profile.stepLevel] || stepExamples["medium"]}

Now break down the task "${cleanTask}" following the same format. Generate ALL required steps:
`;

    // Fetch steps from Gemini AI with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    let text;
    try {
      text = await callGemini(prompt);
      clearTimeout(timeout);
    } catch (geminiError) {
      clearTimeout(timeout);
      console.error("Gemini API Error:", geminiError.message);

      // Check if it's a rate limit or quota error
      if (
        geminiError.message.includes("429") ||
        geminiError.message.includes("quota")
      ) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests. Please wait a moment and try again.",
        });
      }

      throw geminiError;
    }

    // Log raw AI response for debugging
    console.log("\n=== RAW AI RESPONSE ===");
    console.log(text);
    console.log(`Response length: ${text.length} characters`);
    console.log("=== END RAW RESPONSE ===\n");

    // Process the text to clean up step numbering, empty lines, and filter out AI reasoning
    // First, try to split by newlines
    let allLines = text.split("\n").map((s) => s.trim()).filter(Boolean);
    
    // If we only get 1-2 lines, the AI might have used different formatting
    // Try splitting by numbered patterns like "1." or "1)" 
    if (allLines.length <= 2) {
      console.log("WARNING: Only got 1-2 lines, trying alternative split methods...");
      
      // Try splitting by number patterns
      const numberPattern = /(?=\d+[\.\)]\s)/g;
      const splitByNumbers = text.split(numberPattern).map(s => s.trim()).filter(Boolean);
      
      if (splitByNumbers.length > allLines.length) {
        console.log(`Found ${splitByNumbers.length} steps using number pattern split`);
        allLines = splitByNumbers;
      }
    }
    
    console.log("\n=== ALL LINES AFTER SPLIT ===");
    allLines.forEach((line, idx) => console.log(`Line ${idx + 1}: ${line}`));
    console.log("=== END ALL LINES ===\n");

    const steps = allLines
      .map((s) => s.replace(/^\d+[.)\s]*/, "").trim())
      .filter(Boolean)
      .filter((s) => {
        // Remove lines that look like AI's internal thinking
        const thinkingPatterns = [
          /^\*.*\*$/,  // Lines wrapped in asterisks
          /^wait,/i,   // Lines starting with "wait"
          /^let me/i,  // Lines starting with "let me"
          /^step \d+ of \d+/i,  // Progress indicators
          /^\(/,       // Lines starting with parentheses
        ];
        const isThinking = thinkingPatterns.some(pattern => pattern.test(s));
        if (isThinking) {
          console.log(`FILTERED OUT (thinking): ${s}`);
        }
        return !isThinking;
      });

    console.log("\n=== FINAL STEPS ===");
    steps.forEach((step, idx) => console.log(`Step ${idx + 1}: ${step}`));
    console.log(`Total steps generated: ${steps.length}`);
    console.log("=== END FINAL STEPS ===\n");

    // Validate minimum step count based on granularity
    const minSteps = {
      low: 3,
      medium: 6,
      high: 10,
    };
    
    const requiredMin = minSteps[profile.stepLevel] || minSteps["medium"];
    
    if (steps.length < requiredMin) {
      console.warn(`WARNING: Only ${steps.length} steps generated, expected at least ${requiredMin}`);
      console.warn("This might indicate the AI response was truncated or incomplete");
    }

    if (steps.length === 0) {
      throw new Error("No steps generated from AI response");
    }
    return res.json({ steps });
  } catch (error) {
    console.error("Task Decomposition Error:", error.message);

    // Return a structured error
    return res.status(503).json({
      error: "The AI service is temporarily unavailable.",
      message:
        "We couldn't break down this task right now. Please try again in a few seconds.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
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
