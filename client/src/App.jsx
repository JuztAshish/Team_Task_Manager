import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import "./App.css";

// Root component: manages task list, filtering, and UI state
function App() {
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

  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (formData) => {
    await addTask(formData);
    setShowForm(false);
  };

  return (
    <div className="app">
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

        <StatsBar stats={stats} />
      </header>

      <main className="app-main">
        {showForm && (
          <div className="form-container">
            <TaskForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <FilterBar
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
        {loading && (
          <div className="state-message">
            <div className="spinner" />
            <p>Loading tasks...</p>
          </div>
        )}

        {error && (
          <div className="state-message error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
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

        {!loading && tasks.length > 0 && (
          <div className="task-list">
            {tasks.map((task) => (
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
