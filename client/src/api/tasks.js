// ─────────────────────────────────────────────
// src/api/tasks.js  –  All API calls to the backend
// ─────────────────────────────────────────────

// BASE_URL points to our Express server.
// When deploying, set REACT_APP_API_URL to your live backend URL.
// The "proxy" field in package.json handles this automatically in development.
const BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/tasks`
  : "/api/tasks";

// ── fetchTasks ───────────────────────────────────
// GET /api/tasks
// Returns an array of task objects. Filtering/searching is performed
// client-side; the API always returns the full list.
export async function fetchTasks() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

// ── createTask ───────────────────────────────────
// POST /api/tasks
// Sends task data, returns the created task with its new id
export async function createTask(taskData) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      // Tell the server we're sending JSON, not a form
      "Content-Type": "application/json",
    },
    // JSON.stringify converts JS object → JSON text for the network
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  // The server sends { error: "..." } for validation failures
  if (!response.ok) throw new Error(data.error || "Failed to create task");

  return data;
}

// ── updateTask ───────────────────────────────────
// PATCH /api/tasks/:id
// Only sends the fields you want to change
export async function updateTask(id, updates) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to update task");

  return data;
}

// ── deleteTask ───────────────────────────────────
// DELETE /api/tasks/:id
export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
}

// ── reorderTasks ─────────────────────────────────
// PATCH /api/tasks/reorder
export async function reorderTasks(orderedIds) {
  const response = await fetch(`${BASE_URL}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to reorder tasks");
  return data;
}
