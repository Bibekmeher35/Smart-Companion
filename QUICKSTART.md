# Quick Start Guide - MongoDB Version

## 🚀 Get Started in 5 Minutes

### Step 1: Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### Step 2: Setup Environment Variables

**Backend** (`backend/.env`):
```env
GEMINI_API_KEY=your-gemini-api-key
MONGODB_URI=mongodb://localhost:27017/smart-companion
JWT_SECRET=change-this-to-random-string
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5050
```

### Step 3: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
node index.js
```

Expected: `MongoDB Connected: localhost` + `Server running on port 5050`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Expected: Browser opens at `http://localhost:3000`

### Step 5: Create Account & Test

1. Click "New user? Create account"
2. Enter username and password
3. Login
4. Create a task and test!

---

## ✅ Verification Checklist

- [ ] MongoDB running (`mongosh` connects)
- [ ] Backend shows "MongoDB Connected"
- [ ] Frontend loads at localhost:3000
- [ ] Can create new account
- [ ] Can login
- [ ] Can create and complete tasks
- [ ] Data persists after browser refresh
- [ ] Can login from different browser/device

---

## 🆘 Quick Troubleshooting

**MongoDB won't connect:**
```bash
# Check if MongoDB is running
mongosh

# If not, start it
brew services start mongodb-community
```

**Backend errors:**
- Check `.env` file exists in `backend/`
- Verify all three variables are set
- Restart backend after changing `.env`

**Frontend can't reach backend:**
- Check backend is running on port 5050
- Verify `REACT_APP_API_URL` in `frontend/.env`
- Restart frontend after changing `.env`

**Token errors:**
- Clear browser localStorage
- Login again

---

## 📚 Full Documentation

- **Setup Guide:** [MONGODB_SETUP.md](MONGODB_SETUP.md)
- **Implementation Details:** [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Main README:** [README.md](README.md)

---

**You're all set!** 🎉
