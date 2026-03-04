import express from "express";
import cors from "cors";
import { sanitize } from "./sanitize.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ✅ Proper CORS for Production */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-name.vercel.app", // 🔁 replace with your real Vercel URL
    ],
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

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
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/* ✅ Health Check Route */
app.get("/", (req, res) => {
  res.send("Smart Companion Backend Running");
});

/* ✅ Main API */
app.post("/decompose", async (req, res) => {
  try {
    const cleanTask = sanitize(req.body.task);
    const profile = req.body.profile || {};

    const stepRules = {
      low: "Break the task into 3–4 high-level steps.",
      medium: "Break the task into 5–7 clear steps.",
      high: "Break the task into very small, concrete micro-steps (8–12 steps).",
    };

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

    const text = await callGemini(prompt);

    const steps = text
      .split("\n")
      .map((s) => s.replace(/^\d+[.)\s]*/, "").trim())
      .filter(Boolean);

    return res.json({ steps });
  } catch (error) {
    console.error("Gemini unavailable, using fallback:", error.message);

    return res.json({
      steps: [
        "Pick up items from the floor",
        "Put books or objects on the table",
        "Throw visible trash into the bin",
        "Wipe one surface",
        "Take a short break",
      ],
    });
  }
});

/* ✅ CRITICAL FIX FOR RENDER */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
