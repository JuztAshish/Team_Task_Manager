// Statistics bar: displays task counters (total, active, completed, overdue)
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
