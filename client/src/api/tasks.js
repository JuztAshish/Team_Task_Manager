// API client: handles all backend communication
// Base URL configured via environment variables for deployment flexibility
const BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/tasks`
  : "/api/tasks";

export async function fetchTasks() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

// Create new task
export async function createTask(taskData) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to create task");

  return data;
}

// Update task fields (partial update)
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

export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
}

// Reorder tasks (supports drag-and-drop)
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
