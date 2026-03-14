# Palette’s Journal

- The `focus-ring` utility class is the project standard for ensuring consistent, accessible focus-visible states across interactive elements like buttons and links. Applied it to `ErrorBoundary` buttons and DEV kitchen sink link.

- Learned that abstract timeline visual structures (like `StepTimeline`) should be wrapped in native `<ol>` and `<li>` semantics instead of purely decorative `div`s to significantly improve screen reader navigation. Additionally, giant decorative background numbers and icons (like those in `StepTimeline` and `PrincipleBlock`) MUST have `aria-hidden="true"` to prevent confusing and disjointed announcements.
