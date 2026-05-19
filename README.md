# 🧠 Smart Companion  
![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-2.0.0-blue)

### Bridging the Executive Function Gap with Neuro-Inclusive AI

Smart Companion is a **full-stack web app with MongoDB database** supporting neurodivergent individuals (Autism, ADHD, Dyslexia) by breaking overwhelming tasks into manageable micro-steps using AI.

Built with **React.js**, **Node.js**, **MongoDB**, and Google's **Gemini 2.5 Flash API**, it delivers adaptive task decomposition tailored to cognitive preferences.

---

## 🚀 Problem Statement

Neurodivergent individuals often face:

- Task paralysis  
- Executive dysfunction  
- Time blindness  
- Overwhelm from large instructions  
- Difficulty reading dense text  

Traditional productivity apps lack cognitive adaptability.

---

## 💡 Our Solution

Smart Companion offers:

- ✅ AI-powered, personalized task decomposition  
- ✅ Neuro-profiles with step granularity settings  
- ✅ Dyslexia-friendly UI mode  
- ✅ Micro-step breakdown for clarity  
- ✅ Progress tracking with consecutive day streaks  
- ✅ MongoDB database with JWT authentication  
- ✅ Multi-device data synchronization  
- ✅ Context API for state management (no prop drilling)
- ✅ Lazy loading for optimized performance
- ✅ Previous/Next step navigation
- ✅ Todo list management
- ✅ Clean, Google-style login experience  

---

## 🏗️ System Architecture

### 🔹 Frontend
- **React.js** with Create React App
- **Context API** for global state management (AuthContext, TaskContext, ProgressContext)
- **Lazy Loading** with React.lazy and Suspense for code splitting
- **JWT token-based authentication** with 7-day expiry
- **Styled Components** for theming (normal & dyslexia modes)
- Adaptive UI per neuro-profile  
- Dashboard with charts, calendar, and analytics
- Responsive design with mobile support

### 🔹 Backend
- **Node.js & Express.js**  
- **MongoDB** database with Mongoose ODM  
- **JWT authentication** middleware  
- **Gemini 2.5 Flash API** for AI task decomposition
- Prompt-engineered adaptive responses  
- **bcrypt** password hashing  
- CORS configuration for secure cross-origin requests
- Rate limiting and error handling

### 🔹 Database
- **MongoDB** for persistent user data  
- User authentication and profiles  
- Task history and progress tracking  
- Todo list storage
- Multi-device data synchronization  
- Secure password storage with bcrypt

### 🔹 AI Layer
- **Gemini 2.5 Flash** model
- Constraint-based prompt tuning  
- Step granularity adaptation:
  - Low → 3-5 high-level steps
  - Medium → 6-8 clear steps
  - High → 10-15 micro-steps
- Simple language enforcement  
- Dyslexia-aware formatting
- Internal reasoning filtering

---

## 🧠 Key Features

### 1️⃣ Individualized Neuro-Profiles

Users customize:

- **Step Granularity**  
  - Low → Few, larger steps (3-5)
  - Medium → Balanced (6-8)
  - High → Very small micro-steps (10-15)

- **Dyslexia-Friendly Mode**
  - Larger text and spacing
  - Playful visual design
  - Enhanced readability

These settings shape UI rendering and AI task decomposition.

---

### 2️⃣ AI Task Decomposition

**Example:**  
Input: *Clean my room*  
Output:  
1. Pick up clothes from the floor  
2. Put dirty clothes in laundry basket  
3. Make the bed  
4. Wipe the desk  
5. Organize items on shelves

AI tailors output based on user profile with Enter key support for quick generation.

---

### 3️⃣ Secure Database Storage

- MongoDB for persistent data storage  
- User accounts with JWT authentication  
- Password hashing with bcryptjs  
- Multi-device data synchronization  
- Secure token-based sessions (7-day expiry)  
- Protected API endpoints with middleware  

All data is securely stored in MongoDB and accessible from any device.

---

### 4️⃣ Progress & Rewards System

- Tracks completed tasks  
- Maintains **consecutive day streaks** (not task count)
- Calculates points (10 × tasks completed)  
- Unlocks motivational micro-wins:
  - First Step (1 task)
  - Consistency Badge (5 tasks)
  - 3-Day Streak (3 consecutive days)
- Displays dashboard analytics with charts

---

### 5️⃣ Task Navigation

- **Previous Step** button to review earlier steps
- **Mark as Done** to advance through steps
- **Mark Final Step** for task completion
- Step counter (e.g., "Step 3 of 8")
- Proper button alignment in both UI modes

---

### 6️⃣ Modern Authentication

- Account creation and login  
- JWT token-based sessions
- Password change functionality
- Show/hide password toggle  
- Clean, Google-style interface
- Session verification on app load

---

## 📁 Project Structure

```
smart-companion/
  backend/
    config/
      db.js                 # MongoDB connection
    models/
      User.js              # User schema with Mongoose
    routes/
      auth.js              # Authentication routes
    middleware/
      auth.js              # JWT authentication middleware
    index.js               # Express server & AI decomposition
    sanitize.js            # Input sanitization
    package.json           # Backend dependencies
    .env                   # Environment variables

  frontend/
    src/
      context/
        AuthContext.js     # Authentication state management
        TaskContext.js     # Task decomposition state
        ProgressContext.js # Progress & todos state
      pages/
        Login.js           # Login/signup page
        DashboardLayout.jsx # Main dashboard layout
        TaskPage.jsx       # Task decomposition interface
        ProfileSettings.js # User preferences
        AnalyticsPage.jsx  # Analytics dashboard
        ChartsPage.jsx     # Charts visualization
      components/
        Calendar.jsx       # Streak calendar
        TasksChart.jsx     # Task completion chart
        TodoList.jsx       # Todo management
        SearchModal.jsx    # Search functionality
      styles/
        GlobalStyles.js    # Global CSS
        theme.js           # Theme configuration
        DashboardStyles.js # Dashboard styled components
        ComponentStyles.js # Reusable styled components
      utils/
        storage.js         # LocalStorage helpers
        api.js             # API service layer
      App.js               # Main app with lazy loading
      index.js             # React entry point
    package.json           # Frontend dependencies
    .env                   # Frontend environment variables (optional)
```

---

## 🧰 Prerequisites

1. **Node.js (LTS)** – https://nodejs.org  
2. **npm** (bundled with Node.js)  
3. **MongoDB** – https://www.mongodb.com/try/download/community (or use MongoDB Atlas)  
4. **Code editor** (e.g., VS Code)  

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

## ⚙️ Setup & Running

### 📦 MongoDB Setup

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
3. Get connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/smart-companion`)

---

### 📥 Install Dependencies

From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

### 🔧 Configure Environment Variables

Create `.env` file in `backend/`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
MONGODB_URI=mongodb://localhost:27017/smart-companion
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-companion
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
PORT=5050
```

Create `.env` file in `frontend/` (Optional):

```env
REACT_APP_API_URL=http://localhost:5050
```

**Important:** Never commit `.env` files to git!

---

### ▶️ Run Servers

#### 1️⃣ Backend

```bash
cd backend
node index.js
```

Expected output:  
```
MongoDB Connected: localhost
Server running on port 5050
```

#### 2️⃣ Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

Access app at: `http://localhost:3000`

---

## 🖥️ Using the App

### 🔐 Login / Create Account

1. Click "New user? Create account"  
2. Enter username and password (min 6 characters)
3. Click "Create Account"
4. Login with credentials

Your data is stored in MongoDB and accessible from any device.

---

### 📊 Dashboard

Displays:

- **Points Earned** (10 per task)
- **Today's Target** (100 XP default)
- **Current Streak** (consecutive days)
- **Total Tasks Completed**
- **Todo List** with add/toggle/delete
- **Task Completion Chart**
- **Calendar** highlighting productive days
- **Recent History**

---

### 📝 Task Page

1. Navigate to "Task" from sidebar
2. Enter task description (e.g., "Prepare for exam")
3. Press **Enter** or click **Generate**
4. Wait 5-7 seconds for AI processing
5. Follow steps one by one:
   - Click **Previous Step** to go back
   - Click **Mark as Done** to advance
   - Click **Mark Final Step** on last step
6. Click **Finish** to return to dashboard

Completion updates history, points, streak, and analytics.

---

### ⚙️ Settings Page

Adjust preferences:

- **Step Granularity**
  - Low (3-5 steps)
  - Medium (6-8 steps)
  - High (10-15 micro-steps)
- **Dyslexia-friendly mode** toggle
- **Change Password** section
- **Account Information**

Changes apply instantly to AI responses and UI.

---

### 📈 Analytics & Charts

- **Analytics Page**: Detailed progress metrics
- **Charts Page**: Visual data representations
- Track productivity trends over time

---

## 🐳 Docker Deployment (Backend)

Build backend container:

```bash
cd backend
docker build -t smart-companion-backend .
```

Run container:

```bash
docker run -p 5050:5050 \
  -e GEMINI_API_KEY=your-key \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-secret \
  smart-companion-backend
```

---

## 🏗️ Production Build

### Frontend

```bash
cd frontend
npm run build
```

Outputs to `frontend/build/` with:
- Code splitting (lazy loading)
- Minified bundles
- Optimized assets

Deploy on:
- **Vercel** (recommended)
- Netlify  
- Render  
- GitHub Pages  

### Backend

Deploy on:
- **Render** (current: https://smart-companion-5znk.onrender.com)
- Heroku
- Railway
- AWS/GCP/Azure

Update `frontend/src/utils/api.js` with production backend URL.

---

## ❗ Troubleshooting

### Backend Issues

- **Backend unreachable?**
  - Ensure `node index.js` is running  
  - Check MongoDB connection  
  - Verify port 5050 is not in use
  - Production URL: `https://smart-companion-5znk.onrender.com`

- **MongoDB connection errors?**
  - Verify MongoDB is running: `mongosh`  
  - Check `MONGODB_URI` in `.env`
  - For Atlas: Check IP whitelist and credentials

### Frontend Issues

- **Gemini API errors?**
  - Check `GEMINI_API_KEY` in backend `.env`  
  - Verify API key is valid
  - Check rate limits (429 errors)
  - Restart backend after editing `.env`

- **Authentication errors?**
  - Clear browser localStorage
  - Check `JWT_SECRET` in backend `.env`
  - Verify token hasn't expired (7-day limit)

- **Build errors?**
  - Delete `node_modules` and `package-lock.json`
  - Run `npm install` again
  - Check Node.js version compatibility

---

## 🚀 Future Improvements

- [ ] Password reset via email  
- [ ] OAuth login (Google/GitHub)  
- [ ] Refresh token rotation  
- [ ] Weekly productivity analytics  
- [ ] Time tracking per step  
- [ ] Mobile app (React Native)
- [ ] Voice input for tasks
- [ ] Collaborative task sharing
- [ ] Enhanced accessibility (screen readers)
- [ ] Dark mode theme
- [ ] Export progress reports
- [ ] Admin dashboard  
- [ ] Notification system
- [ ] Offline mode with sync

---

## 🎯 Learning Opportunities

This project demonstrates:

- **Full-stack development** with React + Node.js + MongoDB
- **REST API design** with Express.js
- **Database integration** with Mongoose ODM
- **JWT authentication** and session management
- **AI API integration** with Gemini
- **State management** with Context API
- **Performance optimization** with lazy loading
- **Secure password hashing** with bcrypt
- **Responsive UI design** with styled-components
- **Code splitting** and bundle optimization
- **Error handling** and user feedback
- **Deployment** to production environments

---

## 🧠 Vision

Smart Companion bridges the executive function gap with neuro-inclusive AI — empowering users through structure, clarity, and micro-wins.

---

## ❤️ Built For

Neurodivergent minds who deserve tools designed around their thinking — not against it.

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for the neurodivergent community**
