const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const store = require("../store");

// Helper: check if task is overdue
function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return new Date(task.dueDate) < new Date();
}

// GET /api/tasks - fetch all tasks
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

// POST /api/tasks - create new task
router.post("/", (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const maxOrder = store.getAll().reduce((max, task) => Math.max(max, task.order ?? 0), 0);
  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim() || "",
    dueDate: dueDate || null,
    completed: false,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  };

  store.add(newTask);
  res.status(201).json({ ...newTask, overdue: isOverdue(newTask) });
});

// PATCH /api/tasks/reorder - reorder tasks
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

// PATCH /api/tasks/:id - update task
router.patch("/:id", (req, res) => {
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

// DELETE /api/tasks/:id - delete task
router.delete("/:id", (req, res) => {
  const ok = store.deleteById(req.params.id);
  if (!ok) return res.status(404).json({ error: "Task not found" });
  res.status(200).json({ message: "Task deleted successfully" });
});

// GET /api/tasks/stats - get task statistics
router.get("/stats", (req, res) => {
  const all = store.getAll();
  const total = all.length;
  const completed = all.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = all.filter((t) => isOverdue(t)).length;

  res.status(200).json({ total, completed, active, overdue });
});

module.exports = router;
