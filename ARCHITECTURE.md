# 🏗️ Smart Companion Architecture

![Version](https://img.shields.io/badge/version-2.0.0-blue) ![Architecture](https://img.shields.io/badge/architecture-full--stack-green) ![Database](https://img.shields.io/badge/database-MongoDB-brightgreen)

> **Neuro-inclusive AI-powered task management system with Context API, lazy loading, and MongoDB persistence**

---

## 📐 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 3000)                 │    │
│  │                                                          │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │         Context Providers (State Management)     │  │    │
│  │  │                                                   │  │    │
│  │  │  ├─ AuthContext (Authentication & Session)      │  │    │
│  │  │  ├─ TaskContext (Task Decomposition)            │  │    │
│  │  │  └─ ProgressContext (Progress & Todos)          │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                       │                                 │    │
│  │  ┌────────────────────▼──────────────────────────┐   │    │
│  │  │         Lazy Loaded Components                 │   │    │
│  │  │                                                 │   │    │
│  │  │  ├─ Login.js (Authentication UI)              │   │    │
│  │  │  ├─ DashboardLayout.jsx (Main Dashboard)      │   │    │
│  │  │  ├─ TaskPage.jsx (Task Management)            │   │    │
│  │  │  ├─ ProfileSettings.js (User Settings)        │   │    │
│  │  │  ├─ AnalyticsPage.jsx (Analytics)             │   │    │
│  │  │  └─ ChartsPage.jsx (Charts)                   │   │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                       │                                 │    │
│  │  ┌────────────────────▼──────────────────────────┐   │    │
│  │  │         Styled Components (UI Styling)         │   │    │
│  │  │                                                 │   │    │
│  │  │  ├─ GlobalStyles.js (Global CSS)              │   │    │
│  │  │  ├─ theme.js (Theme Config)                   │   │    │
│  │  │  ├─ DashboardStyles.js (Dashboard)            │   │    │
│  │  │  ├─ ComponentStyles.js (Reusable)             │   │    │
│  │  │  ├─ LoginStyles.js (Login)                    │   │    │
│  │  │  └─ AnalyticsStyles.js (Analytics)            │   │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                       │                                 │    │
│  │  ┌────────────────────▼──────────────────────────┐   │    │
│  │  │         Utils & Services                       │   │    │
│  │  │                                                 │   │    │
│  │  │  ├─ api.js (API Service Layer)                │   │    │
│  │  │  └─ storage.js (Token Management)             │   │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  localStorage: { authToken: "JWT..." }                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            │ HTTP Requests                       │
│                            │ Authorization: Bearer <JWT>         │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express Backend (Port 5050)                   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    index.js (Main Server)               │    │
│  │                                                          │    │
│  │  ├─ CORS Configuration (Multiple Origins)             │    │
│  │  ├─ JSON Body Parser                                   │    │
│  │  ├─ MongoDB Connection                                 │    │
│  │  └─ Route Mounting                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ├─────────────────┐                  │
│                            │                 │                  │
│  ┌─────────────────────────▼──┐   ┌─────────▼──────────────┐  │
│  │   Authentication Routes     │   │   Task Routes          │  │
│  │   /api/auth/*               │   │   /decompose           │  │
│  │                             │   │                        │  │
│  │  POST /register             │   │  POST (protected)      │  │
│  │  POST /login                │   │  ├─ JWT Middleware    │  │
│  │  GET  /verify               │   │  ├─ Gemini 2.5 Flash │  │
│  │  GET  /me                   │   │  ├─ 2048 token limit  │  │
│  │  PUT  /profile              │   │  ├─ Response filter   │  │
│  │  PUT  /password             │   │  └─ Step validation   │  │
│  │  PUT  /progress             │   └────────────────────────┘  │
│  │  PUT  /todos                │                                │
│  │                             │                                │
│  │  All use JWT Middleware ──┐ │                                │
│  └────────────────────────────┼─┘                                │
│                               │                                  │
│  ┌────────────────────────────▼──────────────────────────┐     │
│  │           middleware/auth.js (JWT Verification)        │     │
│  │                                                         │     │
│  │  ├─ Extract token from Authorization header           │     │
│  │  ├─ Verify token with JWT_SECRET                      │     │
│  │  ├─ Decode user info (userId, username)               │     │
│  │  └─ Attach to req.user or reject (401/403)            │     │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼──────────────────────────────┐   │
│  │              models/User.js (Mongoose Schema)           │   │
│  │                                                          │   │
│  │  User Schema:                                           │   │
│  │  ├─ username (unique, required)                        │   │
│  │  ├─ passwordHash (bcrypt hashed)                       │   │
│  │  ├─ profile { stepLevel, dyslexiaMode }               │   │
│  │  ├─ progress { tasks, streak, completedDates }        │   │
│  │  ├─ rewards []                                         │   │
│  │  ├─ history []                                         │   │
│  │  ├─ todos []                                           │   │
│  │  └─ timestamps                                         │   │
│  │                                                          │   │
│  │  Methods:                                               │   │
│  │  ├─ comparePassword(password)                          │   │
│  │  └─ toJSON() (removes sensitive data)                 │   │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                              │
│                                                                   │
│  Database: smart-companion                                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Users Collection                       │    │
│  │                                                          │    │
│  │  Document 1: {                                          │    │
│  │    _id: ObjectId("..."),                               │    │
│  │    username: "john_doe",                               │    │
│  │    passwordHash: "$2a$10$...",                         │    │
│  │    profile: { stepLevel: "medium", dyslexiaMode: false }│   │
│  │    progress: {                                          │    │
│  │      tasksCompleted: 15,                               │    │
│  │      currentStreak: 3,                                 │    │
│  │      completedDates: ["2024-01-01", "2024-01-02"]     │    │
│  │    },                                                   │    │
│  │    rewards: ["First Step", "3-Day Streak"],           │    │
│  │    history: [...],                                      │    │
│  │    todos: [{ id, text, completed, createdAt }],       │    │
│  │    createdAt: ISODate("..."),                          │    │
│  │    updatedAt: ISODate("...")                           │    │
│  │  }                                                       │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    (Persistent Storage)
```

---

## 🔄 Context API Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    App Component                         │
│                                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │              AuthProvider                          │ │
│  │  State: session, loading                          │ │
│  │  Methods: login, logout, updateSession,           │ │
│  │           updateProfile                           │ │
│  │                                                    │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │           TaskProvider                       │ │ │
│  │  │  State: task, steps, currentIndex,          │ │ │
│  │  │         currentTaskTitle, taskFinished      │ │ │
│  │  │  Methods: sendTask, goToPreviousStep,       │ │ │
│  │  │           resetTaskSession                  │ │ │
│  │  │                                              │ │ │
│  │  │  ┌───────────────────────────────────────┐ │ │ │
│  │  │  │       ProgressProvider                 │ │ │ │
│  │  │  │  Methods: markDone, handleAddTodo,    │ │ │ │
│  │  │  │           handleToggleTodo,           │ │ │ │
│  │  │  │           handleDeleteTodo            │ │ │ │
│  │  │  │                                        │ │ │ │
│  │  │  │  ┌─────────────────────────────────┐ │ │ │ │
│  │  │  │  │    DashboardLayout              │ │ │ │ │
│  │  │  │  │    (Lazy Loaded)                │ │ │ │ │
│  │  │  │  │                                  │ │ │ │ │
│  │  │  │  │  Uses: useAuth(), useTask(),   │ │ │ │ │
│  │  │  │  │        useProgress()            │ │ │ │ │
│  │  │  │  └─────────────────────────────────┘ │ │ │ │
│  │  │  └───────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

### Benefits:
- ✅ **No prop drilling** - Direct access to state from any component
- ✅ **Clean component signatures** - Removed 20+ props
- ✅ **Centralized state management** - Single source of truth
- ✅ **Easy to test and maintain** - Isolated business logic
```

---

## ⚡ Lazy Loading Architecture

```
Initial Load (Main Bundle - 77KB)
├─ App.js
├─ Context Providers
├─ GlobalStyles
└─ Loading Fallbacks

On-Demand Chunks:
├─ Login.js (loaded when not authenticated)
├─ DashboardLayout.jsx (loaded after login)
├─ TaskPage.jsx (loaded when navigating to Task)
├─ ProfileSettings.js (loaded when navigating to Settings)
├─ AnalyticsPage.jsx (loaded when navigating to Analytics)
└─ ChartsPage.jsx (loaded when navigating to Charts)

### Performance Impact:
- ✅ **65% bundle size reduction** (219KB → 77KB)
- ✅ **Faster initial page load** - Only essential code loaded
- ✅ **Better performance** - On-demand chunk loading
- ✅ **Improved user experience** - Instant app startup
```

---

## 🔐 Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│          │  1. POST /api/auth/register        │          │
│          │  { username, password }            │          │
│  Client  │ ─────────────────────────────────> │  Backend │
│          │                                     │          │
│          │                                     │  ├─ Hash password (bcrypt)
│          │                                     │  ├─ Save to MongoDB
│          │                                     │  └─ Generate JWT (7-day expiry)
│          │                                     │          │
│          │  2. { token, user }                │          │
│          │ <───────────────────────────────── │          │
│          │                                     │          │
│  ├─ Save token to localStorage                │          │
│  ├─ Update AuthContext                        │          │
│  └─ Redirect to dashboard                     │          │
│          │                                     │          │
└──────────┘                                    └──────────┘
```

---

## 🤖 Task Decomposition Flow

```
User enters task → TaskContext.sendTask()
         │
         ▼
POST /decompose (with JWT + profile)
         │
         ▼
Backend validates token
         │
         ▼
Construct AI prompt with:
├─ Step granularity (3-5, 6-8, or 10-15)
├─ Dyslexia mode preference
├─ Examples for each level
└─ Explicit step count requirements
         │
         ▼
Call Gemini 2.5 Flash API
├─ Temperature: 0.9
├─ MaxTokens: 2048
├─ TopP: 0.95
└─ TopK: 40
         │
         ▼
Filter AI response:
├─ Remove internal reasoning
├─ Remove asterisks/parentheses
├─ Remove progress indicators
└─ Split by newlines or number patterns
         │
         ▼
Validate step count
         │
         ▼
Return steps to frontend
         │
         ▼
TaskContext updates state
         │
         ▼
UI renders steps with Previous/Next navigation
```

---

## 🔥 Consecutive Day Streak Calculation

```
User completes task → ProgressContext.markDone()
         │
         ▼
Get today's date (YYYY-MM-DD)
         │
         ▼
Check if today already in completedDates[]
         │
         ├─ Yes → Keep existing streak
         │
         └─ No → Add today to array
                  │
                  ▼
         Sort completedDates array
                  │
                  ▼
         Start from today, count backwards
                  │
                  ▼
         For each previous date:
         ├─ Is it exactly 1 day before? → Continue
         └─ Gap found? → Break loop
                  │
                  ▼
         Return consecutive day count
                  │
                  ▼
         Update MongoDB with new streak
                  │
                  ▼
         Update AuthContext session
                  │
                  ▼
         UI reflects new streak
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Layer 1: CORS                                           │
│  ├─ Multiple allowed origins                            │
│  ├─ Credentials support                                 │
│  └─ Prevents unauthorized domains                       │
│                                                           │
│  Layer 2: JWT Authentication                            │
│  ├─ Token-based stateless auth                          │
│  ├─ 7-day expiration                                    │
│  ├─ Signed with JWT_SECRET                              │
│  └─ Verified on every protected route                   │
│                                                           │
│  Layer 3: Password Hashing                              │
│  ├─ bcrypt with 10 salt rounds                          │
│  ├─ One-way hashing                                     │
│  └─ Secure comparison                                   │
│                                                           │
│  Layer 4: Input Validation & Sanitization               │
│  ├─ Username length check                               │
│  ├─ Password strength requirements                      │
│  ├─ Task input sanitization                             │
│  └─ XSS prevention                                      │
│                                                           │
│  Layer 5: Protected Routes                              │
│  ├─ Middleware verification                             │
│  ├─ Token validation                                    │
│  └─ User authorization                                  │
│                                                           │
│  Layer 6: Environment Variables                         │
│  ├─ Secrets in .env files                               │
│  ├─ Never committed to git                              │
│  └─ Different configs for dev/prod                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
├─────────────────────────────────────────────────────────┤
│  React.js 19.2.4                                        │
│  Context API (State Management)                         │
│  React.lazy & Suspense (Code Splitting)                │
│  Styled Components (CSS-in-JS)                          │
│  Recharts (Data Visualization)                          │
│  React Icons                                            │
│  Fetch API (HTTP Requests)                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│  Node.js                                                │
│  Express.js 5.2.1                                       │
│  Mongoose 8.9.3 (MongoDB ODM)                           │
│  jsonwebtoken 9.0.2 (JWT)                               │
│  bcryptjs 2.4.3 (Password Hashing)                      │
│  cors 2.8.6 (CORS Middleware)                           │
│  dotenv 17.2.3 (Environment Variables)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Database                              │
├─────────────────────────────────────────────────────────┤
│  MongoDB (NoSQL Document Database)                      │
│  MongoDB Atlas (Cloud Hosting)                          │
│  Mongoose ODM (Object Data Modeling)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    External APIs                         │
├─────────────────────────────────────────────────────────┤
│  Google Gemini 2.5 Flash API                            │
│  ├─ Task Decomposition                                  │
│  ├─ 2048 Token Limit                                    │
│  └─ Optimized Generation Config                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Deployment                            │
├─────────────────────────────────────────────────────────┤
│  Frontend: Vercel                                       │
│  Backend: Render (https://smart-companion-5znk...)     │
│  Database: MongoDB Atlas                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
smart-companion/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   └── User.js               # User schema
│   ├── routes/
│   │   └── auth.js               # Auth endpoints
│   ├── index.js                  # Main server
│   ├── sanitize.js               # Input sanitization
│   ├── package.json              # Dependencies
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── context/              # Context API
│   │   │   ├── AuthContext.js    # Authentication state
│   │   │   ├── TaskContext.js    # Task state
│   │   │   └── ProgressContext.js # Progress state
│   │   ├── pages/                # Lazy loaded pages
│   │   │   ├── Login.js
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── TaskPage.jsx
│   │   │   ├── ProfileSettings.js
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── ChartsPage.jsx
│   │   ├── components/           # Reusable components
│   │   │   ├── Calendar.jsx
│   │   │   ├── TasksChart.jsx
│   │   │   ├── TodoList.jsx
│   │   │   └── SearchModal.jsx
│   │   ├── styles/               # Styled components
│   │   │   ├── GlobalStyles.js
│   │   │   ├── theme.js
│   │   │   ├── DashboardStyles.js
│   │   │   ├── ComponentStyles.js
│   │   │   ├── LoginStyles.js
│   │   │   └── AnalyticsStyles.js
│   │   ├── utils/
│   │   │   ├── api.js            # API service
│   │   │   └── storage.js        # Token management
│   │   ├── App.js                # Main app
│   │   ├── index.js              # Entry point
│   │   └── index.css             # Minimal global CSS
│   ├── package.json
│   └── .env
│
└── Documentation/
    ├── README.md                 # Main documentation
    ├── ARCHITECTURE.md           # This file
    └── Smart-Companion.md        # Interview guide
```

---

## 🚀 Performance Optimizations

```
┌─────────────────────────────────────────────────────────┐
│                Performance Optimizations                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Code Splitting (Lazy Loading)                       │
│     ├─ Main bundle: 77KB (65% reduction)                │
│     ├─ Components load on-demand                        │
│     └─ Faster initial page load                         │
│                                                           │
│  2. Context API (No Prop Drilling)                      │
│     ├─ Cleaner component tree                           │
│     ├─ Reduced re-renders                               │
│     └─ Better performance                               │
│                                                           │
│  3. Styled Components                                    │
│     ├─ CSS-in-JS with scoped styles                     │
│     ├─ No CSS file overhead                             │
│     ├─ Dynamic theming                                  │
│     └─ Minimal CSS bundle (156B)                        │
│                                                           │
│  4. AI Response Optimization                            │
│     ├─ 2048 token limit                                 │
│     ├─ Optimized generation config                      │
│     ├─ Response filtering                               │
│     └─ Alternative splitting methods                    │
│                                                           │
│  5. MongoDB Indexing                                     │
│     ├─ Username index (unique)                          │
│     ├─ Fast user lookups                                │
│     └─ Efficient queries                                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### This architecture provides:

| Feature | Description |
|---------|-------------|
| 🏗️ **Scalable Design** | Multi-tier architecture with clear separation of concerns |
| 🔄 **Context API** | State management without prop drilling (20+ props removed) |
| ⚡ **Lazy Loading** | 65% bundle reduction (219KB → 77KB) |
| 🎨 **Styled Components** | Maintainable CSS-in-JS with dynamic theming |
| 🔐 **JWT Authentication** | Secure token-based sessions (7-day expiry) |
| 💾 **MongoDB Storage** | Persistent data with multi-device sync |
| 🔥 **Streak Tracking** | Consecutive day calculation (not task count) |
| 🤖 **AI Decomposition** | Gemini 2.5 Flash with optimized prompts |
| 🚀 **Production Ready** | Deployed on Render + Vercel + MongoDB Atlas |
| 🧠 **Neuro-Inclusive** | Designed for ADHD, Autism, Dyslexia users |

---

## 📊 Architecture Metrics

```
┌─────────────────────────────────────────────────────────┐
│                    Performance Metrics                   │
├─────────────────────────────────────────────────────────┤
│  Bundle Size:        77KB (65% reduction)               │
│  Initial Load:       < 2 seconds                        │
│  API Response:       5-7 seconds (AI processing)        │
│  Database Queries:   < 100ms average                    │
│  JWT Expiry:         7 days                             │
│  Token Limit:        2048 tokens (Gemini)               │
│  Props Removed:      20+ (via Context API)              │
│  CSS Bundle:         156B (styled-components)           │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Principles

1. **Neuro-Inclusive First** - Built for neurodivergent cognitive patterns
2. **Performance Optimized** - Lazy loading, code splitting, minimal bundles
3. **Security Focused** - JWT, bcrypt, CORS, input sanitization
4. **Maintainable Code** - Context API, styled-components, clean architecture
5. **Scalable Structure** - Multi-tier design ready for growth

---

**Made with ❤️ for the neurodivergent community**
