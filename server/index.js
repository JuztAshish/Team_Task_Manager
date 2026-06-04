// ─────────────────────────────────────────────
// index.js  –  The entry point for our Node.js backend
// ─────────────────────────────────────────────

// 'require' is how Node.js imports packages (like 'import' in React)
const express = require("express");
const cors = require("cors");

// Import our routes (defined in a separate file to keep things clean)
const taskRoutes = require("./routes/tasks");

// Create the Express application
// Think of 'app' as the server object we configure and start
const app = express();

// ── MIDDLEWARE ──────────────────────────────────
// Middleware = functions that run on EVERY request before it hits your routes

// cors() allows our React frontend (running on port 3000) to talk to this
// backend (running on port 5000). Without this, the browser blocks the request.
app.use(cors());

// express.json() reads the request body and converts JSON text → JS object
// Without this, req.body would be undefined when the frontend sends JSON
app.use(express.json());

// ── ROUTES ──────────────────────────────────────
// Any request starting with /api/tasks is handled by taskRoutes
app.use("/api/tasks", taskRoutes);

// A simple health-check route so you can verify the server is running
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running ✅" });
});

// ── START SERVER ─────────────────────────────────
// process.env.PORT lets hosting platforms (Render, Railway) set the port
// || 5000 is the fallback for local development
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
