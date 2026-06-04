const fs = require("fs");
const path = require("path");

// File-backed JSON storage: persists tasks to disk
const DATA_FILE = path.join(__dirname, "tasks.json");
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
		tasks = [];
		fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
	}
}

function saveSync() {
	fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

loadSync();

// Public API for task storage operations
module.exports = {
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

	replaceAll(newTasks) {
		tasks = Array.isArray(newTasks) ? newTasks : [];
		saveSync();
	},
};
