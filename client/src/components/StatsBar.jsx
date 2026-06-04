// ─────────────────────────────────────────────
// src/components/StatsBar.jsx  –  Summary counters
// ─────────────────────────────────────────────

// This is a "presentational" component — it only displays data.
// It receives props and renders them. No state, no API calls.

function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat">
        <span className="stat-number stat-active">{stats.active}</span>
        <span className="stat-label">Active</span>
      </div>
      <div className="stat">
        <span className="stat-number stat-done">{stats.completed}</span>
        <span className="stat-label">Done</span>
      </div>
      {stats.overdue > 0 && (
        <div className="stat">
          <span className="stat-number stat-overdue">{stats.overdue}</span>
          <span className="stat-label">Overdue</span>
        </div>
      )}
    </div>
  );
}

export default StatsBar;
