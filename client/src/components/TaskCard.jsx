import { useState } from "react";
import { AlertTriangle, Calendar, Edit2, Trash2, Check } from "lucide-react";
import TaskForm from "./TaskForm";

// Task card: displays task details, supports drag-and-drop reordering and inline editing
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
  const [editing, setEditing] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEditSubmit = async (formData) => {
    await onEdit(task.id, formData);
    setEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`
    );
    if (confirmed) onDelete(task.id);
  };

  let cardClass = "task-card";
  if (task.completed) cardClass += " task-completed";
  if (task.overdue) cardClass += " task-overdue";
  if (isDragOver) cardClass += " drag-over";

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
        <button
          className={`checkbox ${task.completed ? "checked" : ""}`}
          onClick={() => onToggle(task.id, task.completed)}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && <Check size={14} />}
        </button>

        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            {task.dueDate && (
              <span className={`badge ${task.overdue ? "badge-overdue" : "badge-date"}`}>
                {task.overdue ? (
                  <>
                    <AlertTriangle size={14} style={{ marginRight: 6 }} /> Overdue · 
                  </>
                ) : (
                  <Calendar size={14} style={{ marginRight: 6 }} />
                )}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="task-actions">
          <button
            className="btn-icon"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn-icon btn-icon-danger"
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
