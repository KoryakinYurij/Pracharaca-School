# Bolt’s Journal

## Critical Learnings

- **2025-01-30**: The `Layout` component containing the heavy Three.js `BackgroundScene` was re-rendering on every route change because it was inside a component using `useLocation`. Moving `Layout` outside of the routing context (but inside `BrowserRouter`) prevented this, saving ~2 significant re-renders per navigation and preserving the WebGL context state.
- **2025-02-04**: Hoisted invariant math calculations (wave speed, horizontal speed/phase) out of the `useFrame` loop in `BackgroundShapes.tsx`. Benchmarking showed a ~1-9% improvement in raw math throughput by pre-calculating these values instead of re-computing them on every frame (60fps). This reduces CPU overhead for the decorative background.
