// ─────────────────────────────────────────────
// routes/tasks.js  –  All task-related API endpoints
// ─────────────────────────────────────────────

const express = require("express");
const { v4: uuidv4 } = require("uuid"); // generates unique IDs like "a3f8-..."

// A Router is a mini Express app for grouping related routes
const router = express.Router();

// Import our file-backed store API
const store = require("../store");

// ── HELPER ───────────────────────────────────────
// Returns true if a task's due date is in the past AND it's not complete
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
}

// ── GET /api/tasks ───────────────────────────────
// Returns ALL tasks in stored order. Filtering/searching is handled in the
// frontend; the API always returns the full task list with computed fields.
router.get("/", (req, res) => {
  let result = store.getAll();

  result.sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA !== orderB) return orderB - orderA;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  result = result.map((t) => ({ ...t, overdue: isOverdue(t) }));
  res.status(200).json(result);
});

// ── POST /api/tasks ──────────────────────────────
// Creates a new task
// Body: { title, description?, dueDate? }
router.post("/", (req, res) => {
  const { title, description, dueDate } = req.body;

  // Validation: title is required
  if (!title || title.trim() === "") {
    // 400 = Bad Request — the client sent invalid data
    return res.status(400).json({ error: "Title is required" });
  }

  // Build the new task object
  const maxOrder = store.getAll().reduce((max, task) => Math.max(max, task.order ?? 0), 0);
  const newTask = {
    id: uuidv4(),             // unique ID e.g. "550e8400-e29b-41d4..."
    title: title.trim(),
    description: description?.trim() || "",   // ?. = optional chaining
    dueDate: dueDate || null,
    completed: false,          // new tasks always start as incomplete
    order: maxOrder + 1,
    createdAt: new Date().toISOString(), // ISO string e.g. "2024-01-15T10:30:00.000Z"
  };

  store.add(newTask);

  // 201 = Created — standard HTTP status for successful POST
  res.status(201).json({ ...newTask, overdue: isOverdue(newTask) });
});

// ── PATCH /api/tasks/reorder ──────────────────────
// Accepts an array of task ids in the desired top-to-bottom order.
router.patch("/reorder", (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "orderedIds must be an array" });
  }

  const all = store.getAll();
  const idSet = new Set(all.map((t) => t.id));
  if (orderedIds.length !== all.length || orderedIds.some((id) => !idSet.has(id))) {
    return res.status(400).json({ error: "orderedIds must include every task id once" });
  }

  const maxOrder = orderedIds.length;
  const reordered = all.map((task) => ({
    ...task,
    order: maxOrder - orderedIds.indexOf(task.id),
  }));

  store.replaceAll(reordered);
  const result = store
    .getAll()
    .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
    .map((t) => ({ ...t, overdue: isOverdue(t) }));

  res.status(200).json(result);
});

// ── PATCH /api/tasks/:id ─────────────────────────
// Updates ONE task partially (any combination of fields)
// :id is a URL parameter, accessible as req.params.id
router.patch("/:id", (req, res) => {
  // Update task via store API
  const existing = store.getAll().find((t) => t.id === req.params.id);
  if (!existing) return res.status(404).json({ error: "Task not found" });

  const { title, description, dueDate, completed } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (completed !== undefined) updates.completed = completed;

  const updatedTask = store.updateById(req.params.id, updates);
  const updated = { ...updatedTask, overdue: isOverdue(updatedTask) };
  res.status(200).json(updated);
});

// ── DELETE /api/tasks/:id ────────────────────────
// Deletes a task by id
router.delete("/:id", (req, res) => {
  const ok = store.deleteById(req.params.id);
  if (!ok) return res.status(404).json({ error: "Task not found" });
  res.status(200).json({ message: "Task deleted successfully" });
});

// ── GET /api/tasks/stats ─────────────────────────
// Returns summary counts (used for the header counters)
router.get("/stats", (req, res) => {
  const all = store.getAll();
  const total = all.length;
  const completed = all.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = all.filter((t) => isOverdue(t)).length;

  res.status(200).json({ total, completed, active, overdue });
});

module.exports = router;
