# 🧠 Smart Companion  
![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-2.0.0-blue)

### Bridging the Executive Function Gap with Neuro-Inclusive AI

Smart Companion is a **full-stack web app with MongoDB database** supporting neurodivergent individuals (Autism, ADHD, Dyslexia) by breaking overwhelming tasks into manageable micro-steps using AI.

Built with **React.js**, **Node.js**, **MongoDB**, and Google's **Gemini API**, it delivers adaptive task decomposition tailored to cognitive preferences.

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
- ✅ MongoDB database with JWT authentication  
- ✅ Multi-device data synchronization  
- ✅ Clean, Google-style login experience  

---

# 🏗️ System Architecture

## 🔹 Frontend
- React.js (Create React App)  
- JWT token-based authentication  
- Adaptive UI per neuro-profile  
- Dashboard with charts & calendar  

## 🔹 Backend
- Node.js & Express.js  
- MongoDB database with Mongoose ODM  
- JWT authentication middleware  
- Gemini API (`@google/generative-ai`)  
- Prompt-engineered adaptive responses  
- bcrypt password hashing  

## 🔹 Database
- MongoDB for persistent user data  
- User authentication and profiles  
- Task history and progress tracking  
- Multi-device data synchronization  

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

## 3️⃣ Secure Database Storage

- MongoDB for persistent data storage  
- User accounts with JWT authentication  
- Password hashing with bcryptjs  
- Multi-device data synchronization  
- Secure token-based sessions (7-day expiry)  
- Protected API endpoints with middleware  

All data is securely stored in MongoDB and accessible from any device.

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
    config/
      db.js           # MongoDB connection
    models/
      User.js         # User schema
    routes/
      auth.js         # Authentication routes
    middleware/
      auth.js         # JWT middleware
    index.js          # Express server
    package.json      # Backend dependencies
    .env              # Environment variables

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
        api.js          # API service

    package.json      # Frontend dependencies & scripts
    .env              # Frontend environment variables
```

---

# 🧰 Prerequisites

1. **Node.js (LTS)** – https://nodejs.org  
2. npm (bundled with Node.js)  
3. **MongoDB** – https://www.mongodb.com/try/download/community (or use MongoDB Atlas)  
4. Code editor (e.g., VS Code)  

Verify installations:

```bash
node -v
npm -v
mongosh --version
```

Obtain Gemini API Key:

1. Visit https://aistudio.google.com/  
2. Generate an API key  
3. Copy the key  

---

# ⚙️ Setup & Running

## 📦 MongoDB Setup

**Option 1: Local MongoDB**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongosh
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster and database user
3. Get connection string

**📖 Detailed MongoDB setup guide:** See [MONGODB_SETUP.md](MONGODB_SETUP.md)

---

## 📥 Install Dependencies

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 🔧 Configure Environment Variables

Create `.env` file in `backend/`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
MONGODB_URI=mongodb://localhost:27017/smart-companion
JWT_SECRET=your-super-secret-jwt-key-change-this
```

Create `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5050
```

Restart servers after editing `.env`.

---

## ▶️ Run Servers

### 1️⃣ Backend

```bash
cd backend
node index.js
```

Expected output:  
```
MongoDB Connected: localhost
Server running on port 5050
```

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

- Click "New user? Create account"  
- Enter username and password  
- Login  

Your data is stored in MongoDB and accessible from any device.

---

## 📊 Dashboard

Displays:

- Points  
- Today's target  
- Current streak  
- Total tasks completed  
- Recent task history (last 3)  
- Bar chart of completed tasks  
- Calendar highlighting productive days  

---

## 📝 Task Page

1. Select a task  
2. Enter task description (e.g., "Prepare for exam")  
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
  - Check MongoDB connection  
  - Confirm URL: `http://localhost:5050/decompose`  

- Gemini API errors?  
  - Check `.env` file  
  - Restart backend  

- MongoDB connection errors?  
  - Verify MongoDB is running: `mongosh`  
  - Check `MONGODB_URI` in `.env`  

- Authentication errors?  
  - Clear localStorage and login again  
  - Check JWT_SECRET in `.env`  

---

# 🚀 Future Improvements

- Password reset via email  
- OAuth login (Google/GitHub)  
- Refresh token rotation  
- Weekly productivity analytics  
- Time tracking per step  
- Mobile-first UI  
- Enhanced accessibility fonts  
- Admin dashboard  

---

# 🎯 Learning Opportunities

This project covers:

- Full-stack React + Node.js development  
- REST API design  
- MongoDB database integration  
- JWT authentication  
- AI API integration  
- State management  
- Secure password hashing  
- Adaptive UI design  

---

# 🧠 Vision

Smart Companion bridges the executive function gap with neuro-inclusive AI — empowering users through structure, clarity, and micro-wins.

---

# ❤️ Built For

Neurodivergent minds who deserve tools designed around their thinking — not against it.

---
