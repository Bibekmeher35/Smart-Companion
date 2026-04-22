# MongoDB Authentication Setup Guide

## Overview

Smart Companion now uses **MongoDB** for persistent user data storage with **JWT authentication**. Users can login from any device and their data is securely stored in the database.

---

## Prerequisites

1. **MongoDB Installation**
   - Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Node.js & npm** (already installed)

---

## Setup Instructions

### 1. Install MongoDB Locally (Option A)

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
- Download installer from MongoDB website
- Install and start MongoDB service

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

Verify MongoDB is running:
```bash
mongosh
# Should connect to mongodb://localhost:27017
```

### 2. Use MongoDB Atlas (Option B - Cloud)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/smart-companion`)

---

## Backend Configuration

### 1. Update `.env` file in `backend/` folder:

**For Local MongoDB:**
```env
GEMINI_API_KEY=your-gemini-api-key-here
MONGODB_URI=mongodb://localhost:27017/smart-companion
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For MongoDB Atlas:**
```env
GEMINI_API_KEY=your-gemini-api-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-companion?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Change `JWT_SECRET` to a random secure string for production!

### 2. Install Dependencies (if not already done):
```bash
cd backend
npm install
```

### 3. Start Backend Server:
```bash
cd backend
node index.js
```

Expected output:
```
MongoDB Connected: localhost
Server running on port 5050
```

---

## Frontend Configuration

### 1. Update `.env` file in `frontend/` folder:

**For Local Development:**
```env
REACT_APP_API_URL=http://localhost:5050
```

**For Production:**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### 2. Install Dependencies (if not already done):
```bash
cd frontend
npm install
```

### 3. Start Frontend:
```bash
cd frontend
npm start
```

Access app at: `http://localhost:3000`

---

## How It Works

### Authentication Flow

1. **Registration:**
   - User creates account with username and password
   - Password is hashed with bcrypt (10 salt rounds)
   - User data stored in MongoDB
   - JWT token generated and sent to frontend
   - Token stored in localStorage

2. **Login:**
   - User enters credentials
   - Backend verifies password against hash
   - JWT token generated (expires in 7 days)
   - Token sent to frontend and stored

3. **Token Verification:**
   - On app load, frontend checks for stored token
   - Sends token to backend for verification
   - If valid, user data loaded from database
   - If invalid, user redirected to login

4. **Protected Routes:**
   - All API requests include JWT token in Authorization header
   - Backend middleware verifies token before processing
   - Invalid/expired tokens return 401/403 errors

### Data Synchronization

- **Profile Updates:** Synced to MongoDB immediately
- **Task Completion:** Progress, history, and rewards saved to database
- **Password Changes:** Updated in database with new hash
- **Multi-Device:** Login from any device to access your data

---

## API Endpoints

### Authentication Routes

**POST** `/api/auth/register`
- Body: `{ username, password }`
- Returns: `{ token, user }`

**POST** `/api/auth/login`
- Body: `{ username, password }`
- Returns: `{ token, user }`

**GET** `/api/auth/verify`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

**GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

**PUT** `/api/auth/profile`
- Headers: `Authorization: Bearer <token>`
- Body: `{ profile: { stepLevel, dyslexiaMode } }`
- Returns: `{ user }`

**PUT** `/api/auth/password`
- Headers: `Authorization: Bearer <token>`
- Body: `{ currentPassword, newPassword }`
- Returns: `{ message }`

**PUT** `/api/auth/progress`
- Headers: `Authorization: Bearer <token>`
- Body: `{ progress, history, rewards }`
- Returns: `{ user }`

### Task Routes

**POST** `/decompose`
- Headers: `Authorization: Bearer <token>`
- Body: `{ task, profile }`
- Returns: `{ steps }`

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  passwordHash: String (required),
  profile: {
    stepLevel: String (low/medium/high),
    dyslexiaMode: Boolean
  },
  progress: {
    tasksCompleted: Number,
    currentStreak: Number,
    dailyTarget: Number,
    completedDates: [String]
  },
  rewards: [String],
  history: [{
    title: String,
    completedAt: Date,
    stepsCount: Number,
    tasksCompleted: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Features

✅ **Password Hashing:** bcrypt with 10 salt rounds
✅ **JWT Tokens:** Signed with secret key, 7-day expiration
✅ **Protected Routes:** Middleware authentication on all sensitive endpoints
✅ **Input Validation:** Username/password requirements enforced
✅ **Error Handling:** Secure error messages (no sensitive data leaked)
✅ **CORS Configuration:** Restricted to allowed origins

---

## Migration from localStorage

### Automatic Migration (Optional)

If you had users in localStorage, they need to create new accounts. The old localStorage data is separate from the database.

To preserve old data, you can:
1. Export localStorage data manually
2. Create new account
3. Manually import data (requires custom script)

---

## Troubleshooting

### Backend won't start

**Error:** `MongoDB Connection Error`
- Check MongoDB is running: `mongosh`
- Verify `MONGODB_URI` in `.env`
- Check network/firewall settings

**Error:** `JWT_SECRET is not defined`
- Add `JWT_SECRET` to `.env` file
- Restart backend server

### Frontend can't connect

**Error:** `Failed to fetch`
- Verify backend is running on port 5050
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend

**Error:** `Invalid or expired token`
- Token expired (7 days)
- Clear localStorage and login again
- Check JWT_SECRET hasn't changed

### Database issues

**Error:** `User already exists`
- Username is taken
- Try different username

**Error:** `Invalid username or password`
- Check credentials
- Username is case-sensitive

---

## Production Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET` (strong random string)
   - `GEMINI_API_KEY`
   - `PORT` (usually auto-set)

2. Update CORS origins in `backend/index.js`

3. Deploy backend

### Frontend (Vercel/Netlify)

1. Set environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.com`

2. Build and deploy:
   ```bash
   npm run build
   ```

---

## Testing

### Test Registration
```bash
curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test Login
```bash
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5050/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Benefits of MongoDB Implementation

✅ **Persistent Storage:** Data survives browser cache clearing
✅ **Multi-Device Access:** Login from anywhere
✅ **Scalability:** Handles thousands of users
✅ **Data Backup:** Database can be backed up/restored
✅ **Analytics:** Query user data for insights
✅ **Security:** Industry-standard authentication
✅ **Production Ready:** Suitable for real deployment

---

## Future Enhancements

- Password reset via email
- OAuth integration (Google/GitHub)
- Refresh token rotation
- Rate limiting on auth endpoints
- Account deletion
- Data export functionality
- Admin dashboard

---

## Support

For issues or questions:
1. Check MongoDB connection
2. Verify environment variables
3. Check console logs (backend and frontend)
4. Review API endpoint responses

---

**Congratulations!** Your Smart Companion now has professional-grade authentication with MongoDB! 🎉
