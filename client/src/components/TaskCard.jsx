import { useState } from "react";
import TaskForm from "./TaskForm";

// Props:
//   task          – the task object
//   onToggle      – fn(id, completed) — toggle complete status
//   onEdit        – fn(id, changes)   — save edits
//   onDelete      – fn(id)            — delete the task

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragOver,
}) {
  // Local state: are we currently in edit mode?
  const [editing, setEditing] = useState(false);

  // ── FORMAT DATE ────────────────────────────────
  // Converts "2024-12-31" → "Dec 31, 2024"
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    // new Date() parses the ISO date string
    // toLocaleDateString() formats it nicely
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── HANDLE EDIT SUBMIT ─────────────────────────
  const handleEditSubmit = async (formData) => {
    await onEdit(task.id, formData);
    setEditing(false); // close the form after saving
  };

  // ── HANDLE DELETE ──────────────────────────────
  // window.confirm() shows a native browser dialog. Simple but effective.
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`
    );
    if (confirmed) onDelete(task.id);
  };

  // ── COMPUTE CSS CLASSES ────────────────────────
  // We build a string of class names based on the task's state
  let cardClass = "task-card";
  if (task.completed) cardClass += " task-completed";
  if (task.overdue) cardClass += " task-overdue";
  if (isDragOver) cardClass += " drag-over";

  // Show the edit form if editing
  if (editing) {
    return (
      <div className={cardClass}>
        <TaskForm
          initialData={task}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={cardClass}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="task-card-header">
        {/* Checkbox to toggle complete */}
        <button
          className={`checkbox ${task.completed ? "checked" : ""}`}
          onClick={() => onToggle(task.id, task.completed)}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && "✓"}
        </button>

        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>

          {/* Only render description if it exists */}
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            {/* Assignee removed for single-user app */}

            {/* Due date — shows "Overdue" warning if past */}
            {task.dueDate && (
              <span className={`badge ${task.overdue ? "badge-overdue" : "badge-date"}`}>
                {task.overdue ? "⚠️ Overdue · " : "📅 "}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="task-actions">
          <button
            className="btn-icon"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-icon-danger"
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
