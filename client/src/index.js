// ─────────────────────────────────────────────
// src/index.js  –  React entry point
// ─────────────────────────────────────────────
// This file is the very first thing React runs.
// It finds the <div id="root"> in public/index.html
// and mounts our App component inside it.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// createRoot is the React 18 way to mount your app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // StrictMode helps catch bugs by double-invoking functions in development
  // It does NOT affect production builds
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
