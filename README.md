# 🧠 Smart Companion  
![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

### Bridging the Executive Function Gap with Neuro-Inclusive AI

Smart Companion is a **privacy-first full-stack web app** supporting neurodivergent individuals (Autism, ADHD, Dyslexia) by breaking overwhelming tasks into manageable micro-steps using AI.

Built with **React.js**, **Node.js**, and Google’s **Gemini API**, it delivers adaptive task decomposition tailored to cognitive preferences.

---

# 🚀 Problem Statement

Neurodivergent individuals often face:

- Task paralysis  
- Executive dysfunction  
- Time blindness  
- Overwhelm from large instructions  
- Difficulty reading dense text  

Traditional productivity apps lack cognitive adaptability.

---

# 💡 Our Solution

Smart Companion offers:

- ✅ AI-powered, personalized task decomposition  
- ✅ Neuro-profiles with step granularity settings  
- ✅ Dyslexia-friendly UI mode  
- ✅ Micro-step breakdown for clarity  
- ✅ Progress tracking with rewards  
- ✅ Privacy-first local data storage  
- ✅ Clean, Google-style login experience  

---

# 🏗️ System Architecture

## 🔹 Frontend
- React.js (Create React App)  
- Privacy-first LocalStorage  
- Adaptive UI per neuro-profile  
- Dashboard with charts & calendar  

## 🔹 Backend
- Node.js & Express.js  
- Gemini API (`@google/generative-ai`)  
- Prompt-engineered adaptive responses  

## 🔹 AI Layer
- Constraint-based prompt tuning  
- Step granularity adaptation (Low / Medium / High)  
- Simple language enforcement  
- Dyslexia-aware formatting  

---

# 🧠 Key Features

## 1️⃣ Individualized Neuro-Profiles

Users customize:

- **Step Granularity**  
  - Low → Few, larger steps  
  - Medium → Balanced  
  - High → Very small micro-steps  

- **Dyslexia-Friendly Mode** (UI preference)  

These settings shape UI rendering and AI task decomposition.

---

## 2️⃣ AI Task Decomposition

**Example:**  
Input: *Clean my room*  
Output:  
- Pick up clothes from the floor  
- Put dirty clothes in laundry basket  
- Make the bed  
- Wipe the desk  

AI tailors output based on user profile.

---

## 3️⃣ Privacy-Centric Architecture

- No cloud database  
- No unnecessary data sharing  
- User accounts stored locally  
- Passwords hashed with bcryptjs  
- PIN-style data isolation  
- Cognitive data never shared  

All data is securely stored in the browser’s `localStorage`.

---

## 4️⃣ Progress & Rewards System

- Tracks completed tasks  
- Maintains daily streaks  
- Calculates points (10 × tasks completed)  
- Unlocks motivational micro-wins  
- Displays dashboard analytics  

---

## 5️⃣ Modern Login Experience

- Account creation and login  
- Show/hide password toggle  
- Clean, Google-style interface  

---

# 📁 Project Structure

```
smart-companion/
  backend/
    index.js          # Express server + /decompose route
    package.json      # Backend dependencies
    .env              # GEMINI_API_KEY (user-provided)

  frontend/
    src/
      App.js
      index.js
      pages/
        Login.js
        DashboardLayout.jsx
        TaskPage.jsx
        ProfileSettings.js
      components/
        Calendar.jsx
        TasksChart.jsx
      utils/
        storage.js

    package.json      # Frontend dependencies & scripts
```

---

# 🧰 Prerequisites

1. **Node.js (LTS)** – https://nodejs.org  
2. npm (bundled with Node.js)  
3. Code editor (e.g., VS Code)  

Verify installations:

```bash
node -v
npm -v
```

Obtain Gemini API Key:

1. Visit https://aistudio.google.com/  
2. Generate an API key  
3. Copy the key  

---

# ⚙️ Setup & Running

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create `.env` file in `backend/`:

```
GEMINI_API_KEY=YOUR_KEY_HERE
```

Restart backend after editing `.env`.

---

## ▶️ Run Servers

### 1️⃣ Backend

```bash
cd backend
node index.js
```

Expected output:  
`Server running on port 5050`

### 2️⃣ Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

Access app at:  
`http://localhost:3000`

---

# 🖥️ Using the App

## 🔐 Login / Create Account

- Click “New user? Create account”  
- Enter username and password  
- Login  

Each user’s data is isolated and stored locally.

---

## 📊 Dashboard

Displays:

- Points  
- Today’s target  
- Current streak  
- Total tasks completed  
- Recent task history (last 3)  
- Bar chart of completed tasks  
- Calendar highlighting productive days  

---

## 📝 Task Page

1. Select a task  
2. Enter task description (e.g., “Prepare for exam”)  
3. Click Generate  
4. Follow steps:  
   - Mark as Done  
   - Mark Final Step  
   - Finish  

Completion updates history, points, streak, and analytics.

---

## ⚙️ Settings Page

Adjust preferences:

- Step Granularity (Low / Medium / High)  
- Dyslexia-friendly mode  

Changes apply instantly to AI responses and UI.

---

# 🐳 Docker Deployment (Backend)

Build backend container:

```bash
docker build -t smart-companion-backend .
```

Run container:

```bash
docker run -p 5050:5050 smart-companion-backend
```

---

# 🏗️ Production Build

Build frontend:

```bash
cd frontend
npm run build
```

Outputs to `frontend/build/` — deploy on:

- Netlify  
- Vercel  
- Render  
- GitHub Pages  

Backend requires separate deployment.

---

# ❗ Troubleshooting

- Backend unreachable?  
  - Ensure `node index.js` is running  
  - Confirm URL: `http://localhost:5050/decompose`  

- Gemini API errors?  
  - Check `.env` file  
  - Restart backend  

- Data lost?  
  - Data stored in `localStorage`  
  - Clearing browser storage deletes it  

---

# 🚀 Future Improvements

- Replace `localStorage` with real DB (MongoDB / Supabase)  
- Add JWT authentication  
- Integrate OAuth login  
- Weekly productivity analytics  
- Time tracking per step  
- Mobile-first UI  
- Enhanced accessibility fonts  

---

# 🎯 Learning Opportunities

This project covers:

- Full-stack React + Node.js development  
- REST API design  
- AI API integration  
- State management  
- Local storage handling  
- Adaptive UI design  

---

# 🧠 Vision

Smart Companion bridges the executive function gap with neuro-inclusive AI — empowering users through structure, clarity, and micro-wins.

---

# ❤️ Built For

Neurodivergent minds who deserve tools designed around their thinking — not against it.

---