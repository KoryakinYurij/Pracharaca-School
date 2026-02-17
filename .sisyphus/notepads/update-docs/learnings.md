Updated docs/animations.md to reflect actual animation implementation:
- Used actual route structure from App.tsx.
- Updated duration to 380ms and easing to cubic-bezier(0.22, 1, 0.36, 1).
- Updated PageTransition example with useReducedMotion.
- Updated card animation description to mention CSS Grid and data-open.
- Replaced window.matchMedia with useReducedMotion() in reduced motion section.
## Patterns and Conventions
- Documenting Three.js background with 'frameloop="demand"' and manual 'invalidate()' calls for optimization.
- Using CSS Grid for accordion animations (0fr -> 1fr) instead of JS-based animations.
- Relying on 'useReducedMotion()' from 'framer-motion' for accessibility.
- Using 'aria-hidden' and 'pointer-events-none' on decorative background wrappers.
