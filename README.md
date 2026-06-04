# Team Task Manager

A full-stack personal task manager built as a monorepo with a React frontend and an Express backend. The app supports task creation, editing, completion, drag-and-drop reordering, filtering, searching, and file-backed persistence.

---

## Project Title & Brief Description

**Team Task Manager** is the personal task manager exercise implemented as a monorepo with `/client` and `/server`. The frontend is a React SPA, and the backend is an Express API that persists tasks to a JSON file so data survives restarts.

---

## Live Demo Links

- **Frontend:** Not deployed yet
- **Backend:** https://team-task-manager-6weh.onrender.com

> The frontend defaults to the deployed backend above. To run the frontend against
> a different backend (for example your local server), set the environment variable
> `REACT_APP_API_URL` before starting the client.

---

## Tech Stack

- **React 18 + Create React App**: fast frontend development with hooks and component-driven UI.
- **Node.js + Express**: minimal backend for RESTful task operations.
- **uuid**: unique IDs for tasks.
- **cors**: allows the React app to communicate with the backend in development.
- **nodemon**: convenient backend hot reload during development.
- **Plain CSS**: lightweight styling with no additional CSS framework.

---

## How to Run Locally

Assumes you have only **Node.js 18+** installed.

```bash
git clone https://github.com/JuztAshish/Team_Task_Manager.git
cd Team_Task_Manager

# Install dependencies
npm install --prefix server
npm install --prefix client

# Start backend
npm run dev --prefix server

# Start frontend in a second terminal
npm start --prefix client
```

Then open **http://localhost:3000**.

---

## API Documentation

Base URL (production): `https://team-task-manager-6weh.onrender.com/api/tasks`

Note: locally the client will use `process.env.REACT_APP_API_URL` if provided.
Set `REACT_APP_API_URL=http://localhost:5000` to target a local server during development.

### `GET /api/tasks`

Returns all tasks, sorted newest-first, with computed `overdue` status.

**Response `200`:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Finish report",
    "description": "Complete the monthly status report",
    "dueDate": "2024-12-31",
    "completed": false,
    "order": 3,
    "createdAt": "2024-06-01T10:30:00.000Z",
    "overdue": false
  }
]
```

---

### `POST /api/tasks`

Creates a new task.

**Request body:**
```json
{
  "title": "Finish report",
  "description": "Complete the monthly status report",
  "dueDate": "2024-12-31"
}
```

**Response `201`:** Created task object.

**Response `400`:**
```json
{ "error": "Title is required" }
```

---

### `PATCH /api/tasks/reorder`

Updates task order after drag-and-drop.

**Request body:**
```json
{
  "orderedIds": ["id1", "id2", "id3"]
}
```

**Response `200`:** Updated task list in new order.

**Response `400`:**
```json
{ "error": "orderedIds must include every task id once" }
```

---

### `PATCH /api/tasks/:id`

Updates a task by ID.

**Request body (any subset):**
```json
{
  "title": "Updated title",
  "description": "New description",
  "dueDate": "2025-01-15",
  "completed": true
}
```

**Response `200`:** Updated task object.

**Response `404`:**
```json
{ "error": "Task not found" }
```

---

### `DELETE /api/tasks/:id`

Deletes a task.

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

Returns task summary counts.

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

## Project Structure

```
Team_Task_Manager/
├── package.json              # root scripts for the monorepo
├── README.md                 # project documentation
├── .gitignore
├── client/                   # React frontend
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.jsx
│       ├── App.css
│       ├── api/tasks.js
│       ├── hooks/useTasks.js
│       └── components/
│           ├── TaskForm.jsx
│           ├── TaskCard.jsx
│           ├── FilterBar.jsx
│           └── StatsBar.jsx
└── server/                   # Express backend
    ├── package.json
    ├── index.js
    ├── store.js              # file-backed JSON storage
    ├── tasks.json            # persisted task data
    └── routes/tasks.js       # task API endpoints
```

---

## Next Steps

- Deploy frontend and backend and add live demo URLs.
- Add authentication so each user has a private task list.
- Add task priority / tags / reminders.
- Improve keyboard accessibility for drag-and-drop.
- Add API and frontend tests.

---

## Notes

- The server currently persists task data to `server/tasks.json`.
- The client applies filtering, searching, and due-date sorting locally.
