import express from "express";
import cors from "cors";
import OpenAI from "openai";
import { sanitize } from "./sanitize.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});


app.get("/", (req, res) => {
  res.send("Smart Companion Backend Running");
});
app.post("/decompose", async (req, res) => {
  const cleanTask = sanitize(req.body.task);

  try {
    const prompt = `
You are a supportive assistant for neurodivergent users.
Break the task into very small steps.
One step = one action.
Each step under 5 minutes.
Use simple language.
Return steps as a numbered list.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: cleanTask }
      ]
    });

    return res.json({
      steps: response.choices[0].message.content
    });

  } catch (error) {
    console.error("AI unavailable or quota exceeded. Using fallback.", error.message);

    return res.json({
      steps: [
        "Pick up items from the floor",
        "Put books or objects on the table",
        "Throw visible trash into the bin",
        "Wipe one surface",
        "Take a short break"
      ]
    });
  }
});

app.listen(5050, () => {
  console.log("Server running on port 5050");
});

// import express from "express";
// import cors from "cors";
// import OpenAI from "openai";
// import { sanitize } from "./sanitize.js";

// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY
// });

// app.post("/decompose", async (req, res) => {
//   const cleanTask = sanitize(req.body.task);

//   const prompt = `
// Break the task into very small steps.
// One step = one action.
// Each step under 5 minutes.
// Use simple language.
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: prompt },
//       { role: "user", content: cleanTask }
//     ]
//   });

//   res.json({ steps: response.choices[0].message.content });
// });

// app.get("/", (req, res) => {
//   res.send("Smart Companion Backend Running");
// });
// app.post("/decompose", async (req, res) => {
//   const cleanTask = sanitize(req.body.task);

//   try {
//     const prompt = `
// You are a supportive assistant for neurodivergent users.
// Break the task into very small steps.
// One step = one action.
// Each step under 5 minutes.
// Use simple language.
// Return steps as a numbered list.
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: cleanTask }
//       ]
//     });

//     return res.json({
//       steps: response.choices[0].message.content
//     });

//   } catch (error) {
//     console.error("AI unavailable or quota exceeded. Using fallback.", error.message);

//     return res.json({
//       steps: [
//         "Pick up items from the floor",
//         "Put books or objects on the table",
//         "Throw visible trash into the bin",
//         "Wipe one surface",
//         "Take a short break"
//       ]
//     });
//   }
// });

// app.listen(5050, () => {
//   console.log("Server running on port 5050");
// });
