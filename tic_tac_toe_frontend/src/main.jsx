import "./style.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const mountNode = document.getElementById("app");
if (!mountNode) {
  throw new Error('React mount node "#app" not found in index.html');
}

createRoot(mountNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
