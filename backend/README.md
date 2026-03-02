# 🧠 Smart Companion – Backend

This is the backend service for Smart Companion, a neuro-inclusive AI-powered task assistant.

It handles:
- AI task decomposition
- Prompt tuning
- Profile-aware responses
- API communication with Gemini
- Secure environment variable management

---

## 🚀 Tech Stack

- Node.js
- Express.js
- Gemini API (Google Generative AI)
- dotenv
- CORS

---

## 📂 Project Structure
```
backend/
│── index.js
│── package.json
│── Dockerfile
│── .env              (IMPORTANT – do not commit)
│── README.md
```
---

## 🔐 Environment Variables (.env)

⚠️ The backend **requires** a `.env` file.

Create a file named:
.env
Inside the `backend` folder.

Add:
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=5050

---

## ❗ Why `.env` Is Important

- Keeps API keys secure
- Prevents credential leaks on GitHub
- Allows different configs for development & production
- Required for Gemini API to function

### Add this to `.gitignore`

.env
Never upload your API key publicly.

---

## 🧠 AI Prompt System

The backend adapts AI behavior using user neuro-profiles.

Example profile:

```json
{
  "stepLevel": "high",
  "dyslexiaMode": true
}