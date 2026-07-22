// Single place to rebrand these pages. Both pages load this file.
//
// App name  → edit APP_NAME below.
// App icon  → replace app-icon.png in this folder (same filename, any square PNG).
// Colors    → edit THEME below (mirrored from the iOS app, UIColor+Extension.swift).
const APP_NAME = "UMax";

const THEME = {
  "--bg": "#0C0A12",                    // Color.appBackground
  "--accent": "#7C3AED",                // Color.accentTint
  "--accent-rgb": "124,58,237",         // same accent as r,g,b (used in gradients)
  "--card": "#16121F",                  // Color.surface
  "--border": "rgba(255,255,255,0.08)", // Color.appSeparator
};

document.querySelectorAll(".app-name").forEach(el => (el.textContent = APP_NAME));
document.title = document.title.replace(/^.*? — /, APP_NAME + " — ");
for (const [k, v] of Object.entries(THEME)) document.documentElement.style.setProperty(k, v);
