# Bolt’s Journal

## Critical Learnings

- **2025-01-30**: The `Layout` component containing the heavy Three.js `BackgroundScene` was re-rendering on every route change because it was inside a component using `useLocation`. Moving `Layout` outside of the routing context (but inside `BrowserRouter`) prevented this, saving ~2 significant re-renders per navigation and preserving the WebGL context state.
