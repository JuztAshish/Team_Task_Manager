// ─────────────────────────────────────────────
// src/App.jsx  –  Root component
// ─────────────────────────────────────────────
// This is the top-level component. It:
//   1. Calls our custom hook to get all data + actions
//   2. Manages UI state (showForm toggle)
//   3. Renders the page layout with child components

import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import "./App.css";

function App() {
  // ── CUSTOM HOOK ────────────────────────────────
  // All task data and operations come from useTasks
  const {
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
    sortDue,
    setSortDue,
  } = useTasks();

  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);

  const handleDragStart = (id) => {
    setDraggingTaskId(id);
  };

  const handleDragOver = (event, id) => {
    event.preventDefault();
    if (id !== draggingTaskId) {
      setDragOverTaskId(id);
    }
  };

  const handleDrop = async (event, id) => {
    event.preventDefault();
    if (!draggingTaskId || draggingTaskId === id) return;
    setDragOverTaskId(null);
    await reorderTask(draggingTaskId, id);
    setDraggingTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverTaskId(null);
  };

  // ── LOCAL UI STATE ─────────────────────────────
  // showForm controls whether the Add Task form is visible
  // This is kept in App because it's pure UI — not related to data
  const [showForm, setShowForm] = useState(false);

  // ── HANDLE ADD ─────────────────────────────────
  const handleAdd = async (formData) => {
    await addTask(formData);
    setShowForm(false); // hide the form after successful add
  };

  // ── RENDER ─────────────────────────────────────
  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">Team Tasks</h1>
            <p className="app-subtitle">Stay organised, ship faster</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "✕ Cancel" : "+ New Task"}
          </button>
        </div>

        {/* Stats are always visible at the top */}
        <StatsBar stats={stats} />
      </header>

      <main className="app-main">
        {/* ── ADD TASK FORM (toggled) ── */}
        

        {/* ── FILTER + SEARCH BAR ── */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          sortDue={sortDue}
          setSortDue={setSortDue}
        />
{showForm && (
          <div className="form-container">
            <TaskForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}
        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="state-message">
            <div className="spinner" />
            <p>Loading tasks...</p>
          </div>
        )}

        {/* ── ERROR STATE ── */}
        {error && (
          <div className="state-message error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {/* Show only when not loading, no error, and no tasks */}
        {!loading && !error && tasks.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">📋</p>
            <h2>No tasks yet</h2>
            <p>
              {search || filter !== "all"
                ? "Try a different filter or search term."
                : "Click \"+ New Task\" to get started."}
            </p>
          </div>
        )}

        {/* ── TASK LIST ── */}
        {/* tasks.map() renders one TaskCard per task */}
        {!loading && tasks.length > 0 && (
          <div className="task-list">
            {tasks.map((task) => (
              // 'key' is required by React to track list items efficiently
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onEdit={editTask}
                onDelete={removeTask}
                draggable={!sortDue}
                onDragStart={() => handleDragStart(task.id)}
                onDragOver={(event) => handleDragOver(event, task.id)}
                onDrop={(event) => handleDrop(event, task.id)}
                onDragEnd={handleDragEnd}
                isDragOver={dragOverTaskId === task.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
