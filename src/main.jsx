import React from "react";
import { createRoot } from "react-dom/client";
import App from "../ridgeline.jsx";

/* Env vars are read here, in a real module, and handed to the app on
   window. Keeping import.meta out of ridgeline.jsx lets that file also
   run in preview sandboxes that don't evaluate it as an ES module. */
window.__GEOAPIFY_KEY__ = import.meta.env.VITE_GEOAPIFY_KEY || "";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
