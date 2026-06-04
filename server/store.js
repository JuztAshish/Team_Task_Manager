// ─────────────────────────────────────────────
// store.js  –  File-backed JSON storage for tasks
// ─────────────────────────────────────────────

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "tasks.json");

// In-memory cache of tasks, kept in sync with the JSON file.
let tasks = [];

function loadSync() {
	try {
		if (!fs.existsSync(DATA_FILE)) {
			fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8");
			tasks = [];
			return;
		}

		const raw = fs.readFileSync(DATA_FILE, "utf8");
		tasks = JSON.parse(raw || "[]");
	} catch (err) {
		// If file is corrupt or unreadable, fall back to empty array
		tasks = [];
		fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
	}
}

function saveSync() {
	fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

// Initialize on require
loadSync();

// Public API
module.exports = {
	// Return a shallow copy to prevent callers from mutating without saving
	getAll() {
		return [...tasks];
	},

	add(task) {
		tasks.push(task);
		saveSync();
	},

	updateById(id, updates) {
		const idx = tasks.findIndex((t) => t.id === id);
		if (idx === -1) return null;
		tasks[idx] = { ...tasks[idx], ...updates };
		saveSync();
		return tasks[idx];
	},

	deleteById(id) {
		const idx = tasks.findIndex((t) => t.id === id);
		if (idx === -1) return false;
		tasks.splice(idx, 1);
		saveSync();
		return true;
	},

	// Replace whole list (not used currently, but useful)
	replaceAll(newTasks) {
		tasks = Array.isArray(newTasks) ? newTasks : [];
		saveSync();
	},
};
