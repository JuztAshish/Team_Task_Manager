import { useState } from "react";

// Props:
//   onSubmit   – function to call with form data
//   initialData – if editing, pre-fill the form with existing values
//   onCancel   – function to call when user clicks Cancel

function TaskForm({ onSubmit, initialData = null, onCancel }) {
  // ── FORM STATE ─────────────────────────────────
  // We use one state object for all fields so they stay together
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    dueDate: initialData?.dueDate || "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── HANDLE INPUT CHANGE ────────────────────────
  // One handler for all inputs — uses the input's 'name' attribute
  // e.target.name tells us which field changed
  // e.target.value is the new value
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Spread the old state, then override just the changed field
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── HANDLE SUBMIT ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the browser's default page reload

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmit(formData); // call the parent's handler
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!initialData; // true if we're editing, false if adding

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{isEditing ? "Edit Task" : "Add New Task"}</h2>

      {/* Error banner */}
      {error && <p className="form-error">{error}</p>}

      {/* Title — required */}
      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"           
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Design landing page"
          autoFocus
        />
      </div>

      {/* Description — optional */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Any additional details..."
          rows={3}
        />
      </div>

      {/* Assignee removed for single-user app */}

      {/* Due Date — optional */}
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      {/* Buttons */}
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
