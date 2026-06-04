# Team Task Manager

A full-stack task management app built with **Node.js + Express** (backend) and **React** (frontend).

---

## Exercise Chosen

**Exercise 1 — Personal Task Manager**, extended to a Team Task Manager that also supports assigning tasks to team members.

---

## Live Demo

> Deploy steps are in the **Deployment** section below. Fill in your links here after deploying.

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-api.render.com`

---

## Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Backend | Node.js + Express | Lightweight, minimal setup, exactly what the brief asked for |
| Frontend | React 18 (Create React App) | Functional components + hooks as required |
| Storage | In-memory array | Simplest option; avoids database setup complexity |
| Styling | Plain CSS with CSS variables | No extra dependencies; shows understanding of core CSS |
| IDs | `uuid` package | Generates collision-safe unique IDs for tasks |
| CORS | `cors` package | Lets the React dev server (port 3000) talk to Express (port 5000) |

---

## Project Structure

```
task-manager/
├── package.json          ← root scripts to run both apps
│
├── server/
│   ├── package.json
│   ├── index.js          ← Express app setup, middleware, starts server
│   ├── store.js          ← In-memory array (our "database")
│   └── routes/
│       └── tasks.js      ← All CRUD route handlers
│
└── client/
    ├── package.json       ← "proxy" field routes /api calls to Express
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js       ← React entry point
        ├── App.jsx        ← Root component, layout
        ├── App.css        ← All styles
        ├── api/
        │   └── tasks.js   ← All fetch() calls to backend (one place)
        ├── hooks/
        │   └── useTasks.js ← Custom hook: data fetching + state logic
        └── components/
            ├── TaskForm.jsx   ← Add / Edit form
            ├── TaskCard.jsx   ← Single task row
            ├── FilterBar.jsx  ← Status filter + search input
            └── StatsBar.jsx   ← Active / Done / Overdue counters
```

---

## How to Run Locally

> Assumes you have **Node.js 18+** installed. That's all you need.

### Step 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Step 2 — Start the backend

```bash
cd server
npm run dev        # uses nodemon for auto-restart on file changes
# Server runs on http://localhost:5000
```

### Step 3 — Start the frontend (new terminal tab)

```bash
cd client
npm start          # opens http://localhost:3000 automatically
# The "proxy" in client/package.json forwards /api/* to port 5000
```

You should now see the app at **http://localhost:3000**.

---

## API Documentation

Base URL (local): `http://localhost:5000/api/tasks`

### `GET /api/tasks`

Returns all tasks, sorted newest-first.

**Query params (all optional):**

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `active` \| `completed` | Filter by completion status |
| `search` | any string | Case-insensitive search in title + description |

**Response `200`:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design login page",
    "description": "Use Figma mockup v3",
    "dueDate": "2024-12-31",
    "assignee": "Priya",
    "completed": false,
    "overdue": false,
    "createdAt": "2024-06-01T10:30:00.000Z"
  }
]
```

---

### `POST /api/tasks`

Creates a new task.

**Request body:**
```json
{
  "title": "Design login page",        // required
  "description": "Use Figma v3",       // optional
  "dueDate": "2024-12-31",             // optional, YYYY-MM-DD
  "assignee": "Priya"                  // optional
}
```

**Response `201`:** The created task object (same shape as above).

**Response `400`:**
```json
{ "error": "Title is required" }
```

---

### `PATCH /api/tasks/:id`

Updates any fields of an existing task. Only send the fields you want to change.

**Request body (all optional):**
```json
{
  "title": "Updated title",
  "description": "New description",
  "dueDate": "2025-01-15",
  "assignee": "Arjun",
  "completed": true
}
```

**Response `200`:** The updated task object.

**Response `404`:**
```json
{ "error": "Task not found" }
```

---

### `DELETE /api/tasks/:id`

Deletes a task by ID.

**Response `200`:**
```json
{ "message": "Task deleted successfully" }
```

**Response `404`:**
```json
{ "error": "Task not found" }
```

---

### `GET /api/tasks/stats`

Returns summary counts (used for the stats bar).

**Response `200`:**
```json
{
  "total": 10,
  "completed": 4,
  "active": 6,
  "overdue": 2
}
```

---

## Features Implemented

### Must Have ✅
- Add task with title (required), description, due date, assignee
- View all tasks sorted by creation date (newest first)
- Toggle complete / incomplete
- Edit title, description, due date, assignee
- Delete with confirmation dialog
- Filter by All / Active / Completed

### Should Have ✅
- Count of active vs completed tasks in the header stats bar
- Overdue tasks visually highlighted in red
- Empty state UI with helpful message

### Bonus ✅
- Search tasks by title or description
- Assignee field (team extension of the original brief)

---

## Deployment

### Backend → Render (free tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Copy the live URL (e.g. `https://task-api.onrender.com`)

### Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → New Project → import your repo
2. Set **Root Directory** to `client`
3. Add environment variable: `REACT_APP_API_URL=https://task-api.onrender.com`
4. Deploy

---

## What I Would Do Next (with more time)

1. **Persistence** — Write tasks to a JSON file or SQLite so data survives server restarts
2. **Drag-and-drop reordering** — Using `@dnd-kit/core`
3. **Unit tests** — Jest tests for the Express routes (happy path + 404 cases)
4. **Priority levels** — Low / Medium / High with colour coding
5. **Due date reminders** — Toast notification for tasks due today
6. **Authentication** — JWT-based login so different team members see their own tasks
7. **TypeScript** — Add types to the API responses and hook return values

---

## What Works / What Doesn't

| Feature | Status |
|---------|--------|
| Full CRUD (create, read, update, delete) | ✅ Works |
| Filter by status | ✅ Works |
| Search | ✅ Works |
| Overdue highlighting | ✅ Works |
| Stats bar | ✅ Works |
| Data persistence across restart | ❌ In-memory only (by design for this assessment) |
| Tests | ❌ Not included (ran out of time) |

---

## AI Usage Disclosure

Claude was used to help scaffold this project. Every line has been reviewed and I can explain any part of it in an interview.
