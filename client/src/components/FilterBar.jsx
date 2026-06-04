// ─────────────────────────────────────────────
// src/components/FilterBar.jsx  –  Filters & Search
// ─────────────────────────────────────────────

import sortIcon from "./sort-svgrepo-com.svg";

// Props:
//   filter    – current filter value: "all" | "active" | "completed"
//   setFilter – function to change the filter
//   search    – current search string
//   setSearch – function to change the search

function FilterBar({ filter, setFilter, search, setSearch, sortDue, setSortDue }) {
  const filters = ["all", "active", "completed"]; // the three options

  return (
    <div className="filter-bar">
      {/* Status filter buttons */}
      <div className="filter-buttons">
        {filters.map((f) => (
          // Each button highlights when it matches the current filter
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {/* Capitalise first letter: "all" → "All" */}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Sort button (to the right of filter buttons) */}
      <div className="sort-wrapper">
        <button
          className={`sort-btn ${sortDue ? "active" : ""}`}
          title="Sort by due date (newest first)"
          aria-pressed={sortDue}
          onClick={() => setSortDue((s) => !s)}
        >
          <img src={sortIcon} alt="" className="sort-icon" aria-hidden="true" />
        </button>
      </div>

      {/* Search input */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          // Every keystroke updates the search state → triggers re-fetch via useEffect
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Clear button — only shown when there's text */}
        {search && (
          <button className="search-clear" onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
