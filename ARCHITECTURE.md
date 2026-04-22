# Smart Companion Architecture - MongoDB Implementation

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 3000)                 │    │
│  │                                                          │    │
│  │  ├─ Login.js (Authentication UI)                       │    │
│  │  ├─ App.js (Main App Logic)                            │    │
│  │  ├─ DashboardLayout.jsx (Dashboard UI)                 │    │
│  │  ├─ TaskPage.jsx (Task Management)                     │    │
│  │  ├─ ProfileSettings.js (User Settings)                 │    │
│  │  │                                                       │    │
│  │  └─ utils/                                              │    │
│  │     ├─ api.js (API Service)                            │    │
│  │     └─ storage.js (Token Management)                   │    │
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
│  │  ├─ CORS Configuration                                 │    │
│  │  ├─ JSON Body Parser                                   │    │
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
│  │  GET  /verify               │   │  └─ Gemini AI Call   │  │
│  │  GET  /me                   │   └────────────────────────┘  │
│  │  PUT  /profile              │                                │
│  │  PUT  /password             │                                │
│  │  PUT  /progress             │                                │
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
│  │  ├─ progress { tasks, streak, dates }                 │   │
│  │  ├─ rewards []                                         │   │
│  │  ├─ history []                                         │   │
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
│  │    progress: { tasksCompleted: 15, currentStreak: 3 }  │    │
│  │    rewards: ["First Step", "3-Day Streak"],           │    │
│  │    history: [...],                                      │    │
│  │    createdAt: ISODate("..."),                          │    │
│  │    updatedAt: ISODate("...")                           │    │
│  │  }                                                       │    │
│  │                                                          │    │
│  │  Document 2: { ... }                                    │    │
│  │  Document 3: { ... }                                    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    (Persistent Storage)
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│          │  1. POST /api/auth/register        │          │
│          │  { username, password }            │          │
│  Client  │ ─────────────────────────────────> │  Backend │
│          │                                     │          │
│          │                                     │  ├─ Hash password (bcrypt)
│          │                                     │  ├─ Save to MongoDB
│          │                                     │  └─ Generate JWT token
│          │                                     │          │
│          │  2. { token, user }                │          │
│          │ <───────────────────────────────── │          │
│          │                                     │          │
│  ├─ Save token to localStorage                │          │
│  └─ Redirect to dashboard                     │          │
│          │                                     │          │
└──────────┘                                    └──────────┘
```

## Protected Request Flow

```
┌──────────┐                                    ┌──────────┐
│          │  1. POST /decompose                │          │
│          │  Headers: Authorization: Bearer JWT│          │
│  Client  │ ─────────────────────────────────> │  Backend │
│          │                                     │          │
│          │                                     │  ├─ JWT Middleware
│          │                                     │  │  ├─ Extract token
│          │                                     │  │  ├─ Verify signature
│          │                                     │  │  └─ Decode userId
│          │                                     │  │
│          │                                     │  ├─ Process request
│          │                                     │  └─ Return response
│          │                                     │          │
│          │  2. { steps: [...] }               │          │
│          │ <───────────────────────────────── │          │
│          │                                     │          │
└──────────┘                                    └──────────┘
```

## Data Synchronization Flow

```
User completes task on Device A
         │
         ▼
Frontend updates local state
         │
         ▼
PUT /api/auth/progress (with JWT)
         │
         ▼
Backend verifies token
         │
         ▼
MongoDB updates user document
         │
         ▼
Backend returns updated user
         │
         ▼
Frontend updates UI
         │
         ▼
User logs in on Device B
         │
         ▼
GET /api/auth/verify (with JWT)
         │
         ▼
Backend fetches user from MongoDB
         │
         ▼
Device B shows updated data ✓
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Layer 1: CORS                                           │
│  ├─ Restricts origins                                   │
│  └─ Prevents unauthorized domains                       │
│                                                           │
│  Layer 2: JWT Authentication                            │
│  ├─ Token-based stateless auth                          │
│  ├─ 7-day expiration                                    │
│  └─ Signed with secret key                              │
│                                                           │
│  Layer 3: Password Hashing                              │
│  ├─ bcrypt with 10 salt rounds                          │
│  ├─ One-way hashing                                     │
│  └─ Secure comparison                                   │
│                                                           │
│  Layer 4: Input Validation                              │
│  ├─ Username length check                               │
│  ├─ Password strength requirements                      │
│  └─ Data sanitization                                   │
│                                                           │
│  Layer 5: Protected Routes                              │
│  ├─ Middleware verification                             │
│  ├─ Token validation                                    │
│  └─ User authorization                                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
├─────────────────────────────────────────────────────────┤
│  React.js 19.2.4                                        │
│  React Router (implicit)                                │
│  Recharts (data visualization)                          │
│  React Icons                                            │
│  Fetch API (HTTP requests)                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│  Node.js                                                │
│  Express.js 5.2.1                                       │
│  Mongoose 8.9.3 (MongoDB ODM)                           │
│  jsonwebtoken 9.0.2 (JWT)                               │
│  bcryptjs 2.4.3 (Password hashing)                      │
│  cors 2.8.6 (CORS middleware)                           │
│  dotenv 17.2.3 (Environment variables)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Database                              │
├─────────────────────────────────────────────────────────┤
│  MongoDB (NoSQL document database)                      │
│  Mongoose ODM (Object Data Modeling)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    External APIs                         │
├─────────────────────────────────────────────────────────┤
│  Google Gemini AI API (Task decomposition)              │
└─────────────────────────────────────────────────────────┘
```

## File Structure

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
│   ├── .env                      # Environment variables
│   └── .env.example              # Env template
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js          # Login UI
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── TaskPage.jsx
│   │   │   └── ProfileSettings.js
│   │   ├── components/
│   │   │   ├── Calendar.jsx
│   │   │   └── TasksChart.jsx
│   │   ├── utils/
│   │   │   ├── api.js            # API service
│   │   │   └── storage.js        # Token management
│   │   ├── App.js                # Main app
│   │   └── index.js              # Entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
│
└── Documentation/
    ├── README.md                 # Main documentation
    ├── MONGODB_SETUP.md          # Setup guide
    ├── QUICKSTART.md             # Quick start
    ├── IMPLEMENTATION_SUMMARY.md # Implementation details
    └── IMPLEMENTATION_CHECKLIST.md # Checklist
```

---

This architecture provides:
- ✅ Scalable multi-tier design
- ✅ Secure authentication
- ✅ Persistent data storage
- ✅ Multi-device support
- ✅ Production-ready structure
