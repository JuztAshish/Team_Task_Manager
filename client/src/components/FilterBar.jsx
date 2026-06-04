import sortIcon from "./sort-svgrepo-com.svg";
import { Search, X } from "lucide-react";

// Filter bar: status filter buttons, sort by due date, and search
function FilterBar({ filter, setFilter, search, setSearch, sortDue, setSortDue }) {
  const filters = ["all", "active", "completed"];

  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

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

      <div className="search-wrapper">
        <span className="search-icon"><Search size={16} /></span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
