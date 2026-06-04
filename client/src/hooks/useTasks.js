// ─────────────────────────────────────────────
// src/hooks/useTasks.js  –  Custom React hook
// ─────────────────────────────────────────────
//
// A custom hook is just a function whose name starts with "use".
// It can use React hooks (useState, useEffect) inside it.
// The benefit: ALL data logic lives here. Components just call useTasks()
// and get back data + functions — they don't worry about HOW data is fetched.

import { useState, useEffect, useCallback } from "react";
import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks } from "../api/tasks";

export function useTasks() {
  // ── STATE ──────────────────────────────────────
  // useState returns [currentValue, setterFunction]
  // 'allTasks' holds the full list from the server. We compute the
  // visible `tasks` by applying the local `filter` and `search`.
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const [search, setSearch] = useState("");
  const [sortDue, setSortDue] = useState(false); // false = sort by createdAt, true = sort by dueDate newest-first

  // ── LOAD TASKS ─────────────────────────────────
  // useCallback memoizes the function so it doesn't re-create on every render
  // The array [filter, search] means: re-create only when these change
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTasks(); // fetch the FULL list
      setAllTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount (and when refresh is called)
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ── ADD TASK ───────────────────────────────────
  const addTask = async (taskData) => {
    const newTask = await createTask(taskData);
    setAllTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  // ── TOGGLE COMPLETE ────────────────────────────
  const toggleComplete = async (id, currentValue) => {
    const updated = await updateTask(id, { completed: !currentValue });
    setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // ── EDIT TASK ──────────────────────────────────
  const editTask = async (id, changes) => {
    const updated = await updateTask(id, changes);
    setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  // ── DELETE TASK ────────────────────────────────
  const removeTask = async (id) => {
    await deleteTask(id);
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTask = async (draggedId, targetId) => {
    if (draggedId === targetId) return;

    const current = [...allTasks];
    const fromIndex = current.findIndex((t) => t.id === draggedId);
    const toIndex = current.findIndex((t) => t.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const updated = [...current];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    const orderedIds = updated.map((task) => task.id);
    const reordered = await reorderTasks(orderedIds);
    setAllTasks(reordered);
  };

  // ── COMPUTED STATS ─────────────────────────────
  // These are derived from 'tasks' — no extra API call needed
  // Stats should reflect the full dataset (not the filtered view)
  const stats = {
    total: allTasks.length,
    active: allTasks.filter((t) => !t.completed).length,
    completed: allTasks.filter((t) => t.completed).length,
    overdue: allTasks.filter((t) => t.overdue).length,
  };

  // Compute the visible (filtered/searched) task list for the UI
  const tasks = allTasks
    .filter((t) => {
      if (filter === "active" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (search) {
        const keyword = search.toLowerCase();
        const inTitle = t.title.toLowerCase().includes(keyword);
        const inDesc = t.description && t.description.toLowerCase().includes(keyword);
        if (!inTitle && !inDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortDue) {
        // Sort by dueDate newest-first. Tasks without dueDate come last.
        const da = a.dueDate ? new Date(a.dueDate) : null;
        const db = b.dueDate ? new Date(b.dueDate) : null;
        if (da && db) return db - da;
        if (da && !db) return -1; // a with date comes before b
        if (!da && db) return 1; // b with date comes before a
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderB - orderA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Return everything the components need
  return {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    search,
    setSearch,
    stats,
    addTask,
    toggleComplete,
    editTask,
    removeTask,
    reorderTask,
    refresh: loadTasks,
    sortDue,
    setSortDue,
  };
}
