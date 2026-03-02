# Smart Companion – Frontend (React)

This folder contains the **React frontend** for Smart Companion.

The frontend runs on:

- `http://localhost:3000`

To use the AI task decomposition (“Generate” button), you must also run the backend API (default):

- `http://localhost:5050`

---

## Install (first time only)

From the `frontend/` folder:

```bash
npm install
```

---

## Run the frontend (development)

```bash
npm start
```

Then open:

- `http://localhost:3000`

---

## Backend required for Task → Generate

When you click **Generate** on the Task page, the frontend calls:

- `http://localhost:5050/decompose`

If you see **“Backend not reachable”**, start the backend in another terminal:

```bash
cd ../backend
npm install
node index.js
```

---

## Build for production

```bash
npm run build
```

This creates a production build in:

- `frontend/build/`

---

## Useful scripts

- **Start dev server**: `npm start`
- **Run tests**: `npm test`
- **Production build**: `npm run build`

---

## Where to edit (common files)

- **Login UI**: `src/pages/Login.js`, `src/pages/login.css`
- **Dashboard UI**: `src/pages/DashboardLayout.jsx`, `src/pages/dashboard.css`
- **Task UI**: `src/pages/TaskPage.jsx`
- **Settings UI**: `src/pages/ProfileSettings.js`