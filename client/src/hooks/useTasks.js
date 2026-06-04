import { useState, useEffect, useCallback } from "react";
import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks } from "../api/tasks";

// Custom hook: centralized state management for tasks
// Handles data fetching, CRUD operations, filtering, searching, and sorting
export function useTasks() {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortDue, setSortDue] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTasks();
      setAllTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Add new task to the list
  const addTask = async (taskData) => {
    const newTask = await createTask(taskData);
    setAllTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const toggleComplete = async (id, currentValue) => {
    const updated = await updateTask(id, { completed: !currentValue });
    setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const editTask = async (id, changes) => {
    const updated = await updateTask(id, changes);
    setAllTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setAllTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTask = async (draggedId, targetId) => {
    if (draggedId === targetId) return;

    // Reorder tasks in local state before API call
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

  const stats = {
    total: allTasks.length,
    active: allTasks.filter((t) => !t.completed).length,
    completed: allTasks.filter((t) => t.completed).length,
    overdue: allTasks.filter((t) => t.overdue).length,
  };

  // Compute filtered/searched task list and apply sorting
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
        const da = a.dueDate ? new Date(a.dueDate) : null;
        const db = b.dueDate ? new Date(b.dueDate) : null;
        if (da && db) return db - da;
        if (da && !db) return -1;
        if (!da && db) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) return orderB - orderA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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
